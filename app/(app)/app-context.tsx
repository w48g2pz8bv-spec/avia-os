"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase, DBActivityLog, DBKnowledgeEntry } from "@/lib/supabase";
import { useToast } from "@/lib/toast-context";

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
  conversionRate: number;
}

interface AppContextType {
  user: any;
  supabase: any;
  selectedSector: Sector;
  activityLogs: ActivityLog[];
  knowledgeBase: KnowledgeEntry[];
  analyticsEvents: any[];
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
  trackEvent: (name: string, metadata?: any) => Promise<void>;
  autonomousPlanning: (situation: string) => Promise<any>;
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
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
    id: 'law',
    label: 'Law Firm',
    accent: '#e11d48',
    hero: 'Authority Shield Legal',
    sub: 'Strategic litigation and compliance management for high-stakes cases.',
    cta: 'Case Assessment',
    services: ['Risk Mitigation', 'Contract Intelligence', 'Policy Audit']
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
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS[0]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: '1', text: "Neural Link Established: Deep Learning Engine v4.2 Active", type: 'system', time: 'Just Now' },
    { id: '2', text: "Market Node Scanned: 124 New High-Intent Signals Identified", type: 'sync', time: '2m ago' },
    { id: '3', text: "Security Protocol: Brand Shield Monitoring Social Sentiment", type: 'system', time: '5m ago' }
  ]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>([
    { id: 'k1', content: "Klinik protokolü: Tüm implant operasyonları öncesi 3D panoramik film zorunludur.", sector: 'Dental Clinic', tags: ['medical', 'hygiene'], source: 'manual', created_at: new Date().toISOString() },
    { id: 'k2', content: "Hukuki Danışmanlık: KVKK uyum süreçlerinde veri sorumlusu envanteri 15 iş günü içinde tamamlanmalıdır.", sector: 'Law Firm', tags: ['legal', 'compliance'], source: 'document', created_at: new Date().toISOString() },
    { id: 'k3', content: "SaaS Model: SLA süremiz kritik hatalar için 4 saattir.", sector: 'SaaS Startup', tags: ['pricing', 'sla'], source: 'website', created_at: new Date().toISOString() }
  ]);
  const [deploymentQueue, setDeploymentQueue] = useState<string[]>([]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [efficiencyStats, setEfficiencyStats] = useState<EfficiencyStats>({
    hoursSaved: 124.5,
    successRate: 98.2,
    tasksCompleted: 452,
    conversionRate: 12.4
  });

  const [user, setUser] = useState<any>(null);
  const [analyticsEvents, setAnalyticsEvents] = useState<any[]>([]);

  // ─── Load data from Supabase on mount ────────────────────────────────────
  useEffect(() => {
    const loadInitialData = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://YOUR_PROJECT_ID.supabase.co') {
        return;
      }

      try {
        // Fetch User
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Load analytics events
        const { data: events } = await supabase
          .from('analytics_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (events) setAnalyticsEvents(events);

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

        setIsDbConnected(true);
      } catch (err) {
        console.error('[AIVA] Database Init Error:', err);
      }
    };

    loadInitialData();
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const trackEvent = useCallback(async (name: string, metadata: any = {}) => {
    const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        metadata,
        created_at: new Date().toISOString()
    };

    // Optimistic update
    setAnalyticsEvents(prev => [newEvent, ...prev].slice(0, 100));

    if (isDbConnected && user) {
        await supabase.from('analytics_events').insert({
            user_id: user.id,
            name,
            metadata
        });
    }

    // Add to activity log for visibility
    addActivity(`Event Logged: ${name.toUpperCase()}`, 'system');
  }, [isDbConnected, user]);

  const setSector = (sector: Sector) => setSelectedSector(sector);

  const addActivity = useCallback(async (text: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      time: 'Just Now'
    };

    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));

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

    setKnowledgeBase(prev => [entry, ...prev]);
    
    if (isDbConnected) {
      await supabase.from('knowledge_base').insert({ content, sector, tags, source });
    }

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
    addActivity(`New Asset Ready for Sync: ${assetName}`, 'sync');
  }, [isDbConnected, addActivity]);

  const clearQueue = useCallback(async () => {
    setDeploymentQueue([]);
    if (isDbConnected) {
      await supabase.from('deployment_queue').update({ status: 'deployed' }).eq('status', 'queued');
    }
  }, [isDbConnected]);

  const autonomousPlanning = async (situation: string) => {
    try {
        const res = await fetch('/api/reason', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ situation, niche: selectedSector })
        });
        const data = await res.json();
        if (data.status === 'success') {
            addActivity(`Neural Planner: Strategy formulated for "${situation.slice(0, 20)}..."`, 'system');
            return data;
        }
    } catch (e) {
        console.error("Autonomous planning failed:", e);
    }
    return null;
  };

  return (
    <AppContext.Provider value={{ 
      user,
      supabase,
      selectedSector, 
      activityLogs,
      knowledgeBase,
      analyticsEvents,
      efficiencyStats, 
      deploymentQueue,
      isDbConnected,
      setSector,
      addActivity,
      addKnowledge,
      deleteKnowledge,
      updateMetrics,
      addToQueue,
      clearQueue,
      trackEvent,
      autonomousPlanning,
      toast
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
