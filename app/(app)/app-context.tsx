"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase, DBActivityLog, DBKnowledgeEntry } from "@/lib/supabase";

export interface Sector {
  id: string;
  label: string;
  accent: string;
  hero?: string;
  sub?: string;
  cta?: string;
  services?: string[];
}

export interface ActivityLog {
  id: string;
  text: string;
  type: 'builder' | 'agent' | 'automation' | 'sync' | 'system';
  time: string;
}

export interface KnowledgeEntry {
  id: string;
  content: string;
  sector: string;
  tags: string[];
  source: string;
  created_at?: string;
}

interface EfficiencyStats {
  hoursSaved: number;
  successRate: number;
  tasksCompleted: number;
}

interface AppContextType {
  selectedSector: Sector;
  activityLogs: ActivityLog[];
  knowledgeBase: KnowledgeEntry[];
  efficiencyStats: EfficiencyStats;
  deploymentQueue: string[];
  isDbConnected: boolean;
  setSector: (sector: Sector) => void;
  addActivity: (text: string, type: ActivityLog['type']) => void;
  addKnowledge: (content: string, sector: string, tags?: string[], source?: string) => Promise<void>;
  deleteKnowledge: (id: string) => Promise<void>;
  updateMetrics: (update: Partial<EfficiencyStats>) => void;
  addToQueue: (assetName: string) => void;
  clearQueue: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SECTORS: Sector[] = [
  {
    id: 'dental',
    label: 'Dental Clinic',
    accent: '#00ffd1',
    hero: 'Elite Oral Engineering',
    sub: 'Precision clinical solutions for the modern dental practice.',
    cta: 'Schedule Consultation',
    services: ['Restorative Care', 'Diagnostic Imaging', 'Surgical Planning']
  },
  {
    id: 'saas',
    label: 'SaaS Startup',
    accent: '#6366f1',
    hero: 'Scale Your Product',
    sub: 'AI-powered growth engine for B2B SaaS companies.',
    cta: 'Start Free Trial',
    services: ['User Onboarding', 'Churn Prediction', 'Revenue Optimization']
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    accent: '#f59e0b',
    hero: 'Intelligent Property',
    sub: 'Neural automation for modern real estate agencies.',
    cta: 'View Listings',
    services: ['Lead Qualification', 'Property Matching', 'Market Analysis']
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS[0]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>([]);
  const [deploymentQueue, setDeploymentQueue] = useState<string[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [efficiencyStats, setEfficiencyStats] = useState<EfficiencyStats>({
    hoursSaved: 140.4,
    successRate: 98.2,
    tasksCompleted: 420
  });

  // ─── Load data from Supabase on mount ────────────────────────────────────
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if env variables exist
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://YOUR_PROJECT_ID.supabase.co') {
        console.log('[AIVA] Running in offline mode — Supabase not configured.');
        return;
      }

      try {
        // Load activity logs
        const { data: logs, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!logsError && logs) {
          setActivityLogs(logs.map(l => ({
            id: l.id,
            text: l.text,
            type: l.type,
            time: new Date(l.created_at || '').toLocaleTimeString()
          })));
        }

        // Load knowledge base
        const { data: knowledge, error: knowledgeError } = await supabase
          .from('knowledge_base')
          .select('*')
          .order('created_at', { ascending: false });

        if (!knowledgeError && knowledge) {
          setKnowledgeBase(knowledge);
        }

        // Load deployment queue
        const { data: queue, error: queueError } = await supabase
          .from('deployment_queue')
          .select('asset_name')
          .eq('status', 'queued');

        if (!queueError && queue) {
          setDeploymentQueue(queue.map(q => q.asset_name));
        }

        // Load efficiency metrics
        const { data: metrics } = await supabase
          .from('efficiency_metrics')
          .select('*')
          .limit(1)
          .single();

        if (metrics) {
          setEfficiencyStats({
            hoursSaved: metrics.hours_saved,
            successRate: metrics.success_rate,
            tasksCompleted: metrics.tasks_completed
          });
        }

        setIsDbConnected(true);
        console.log('[AIVA] Neural Database: Connected ✓');
      } catch (err) {
        console.log('[AIVA] Offline mode — will sync when Supabase is configured.');
      }
    };

    loadInitialData();
  }, []);

  // ─── Realtime subscription ────────────────────────────────────────────────
  useEffect(() => {
    if (!isDbConnected) return;

    const channel = supabase
      .channel('aiva-neural-stream')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        (payload) => {
          const newLog = payload.new as DBActivityLog;
          setActivityLogs(prev => [{
            id: newLog.id,
            text: newLog.text,
            type: newLog.type,
            time: 'Just Now'
          }, ...prev].slice(0, 50));
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'knowledge_base' },
        (payload) => {
          setKnowledgeBase(prev => [payload.new as KnowledgeEntry, ...prev]);
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deployment_queue' },
        (payload) => {
          setDeploymentQueue(prev => [...new Set([...prev, payload.new.asset_name])]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isDbConnected]);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const setSector = (sector: Sector) => setSelectedSector(sector);

  const addActivity = useCallback(async (text: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      time: 'Just Now'
    };

    // Optimistic update
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));

    // Persist to Supabase if connected
    if (isDbConnected) {
      await supabase.from('activity_logs').insert({ text, type, time: 'Just Now' });
    }
  }, [isDbConnected]);

  const addKnowledge = useCallback(async (content: string, sector: string, tags: string[] = [], source: string = 'manual') => {
    const entry: KnowledgeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      sector,
      tags,
      source
    };

    // Optimistic update
    setKnowledgeBase(prev => [entry, ...prev]);
    
    // Persist to Supabase
    if (isDbConnected) {
      await supabase.from('knowledge_base').insert({ content, sector, tags, source });
    }

    // Also log the activity
    await addActivity(`Knowledge Injected [${source}]: "${content.substring(0, 40)}..."`, 'system');
  }, [isDbConnected, addActivity]);

  const deleteKnowledge = useCallback(async (id: string) => {
    setKnowledgeBase(prev => prev.filter(k => k.id !== id));
    if (isDbConnected) {
      await supabase.from('knowledge_base').delete().eq('id', id);
    }
  }, [isDbConnected]);

  const updateMetrics = (update: Partial<EfficiencyStats>) => {
    setEfficiencyStats(prev => ({ ...prev, ...update }));
  };

  const addToQueue = useCallback(async (assetName: string) => {
    setDeploymentQueue(prev => [...new Set([...prev, assetName])]);
    if (isDbConnected) {
      await supabase.from('deployment_queue').upsert({ asset_name: assetName, status: 'queued' });
    }
    await addActivity(`New Asset Ready for Sync: ${assetName}`, 'sync');
  }, [isDbConnected, addActivity]);

  const clearQueue = useCallback(async () => {
    setDeploymentQueue([]);
    if (isDbConnected) {
      await supabase.from('deployment_queue').update({ status: 'deployed' }).eq('status', 'queued');
    }
  }, [isDbConnected]);

  return (
    <AppContext.Provider value={{ 
      selectedSector, 
      activityLogs,
      knowledgeBase,
      efficiencyStats, 
      deploymentQueue,
      isDbConnected,
      setSector,
      addActivity,
      addKnowledge,
      deleteKnowledge,
      updateMetrics,
      addToQueue,
      clearQueue
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export { SECTORS };
