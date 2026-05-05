"use client";
import { useState, useEffect, useMemo } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Rocket, 
  Database, 
  Cpu, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Layout, 
  Mic, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Share2,
  RefreshCcw,
  Monitor,
  ExternalLink,
  History,
  Activity,
  Sparkles
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

type AssetStatus = 'awaiting' | 'syncing' | 'live' | 'error';
type Asset = { id: string; name: string; type: string; status: AssetStatus; version: string; isNew?: boolean };

export default function SyncPage() {
  const { selectedSector, deploymentQueue, addActivity } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('website');
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [baseAssets, setBaseAssets] = useState<Asset[]>([
    { id: '1', name: 'Main_Architecture_v2.4', type: 'website', status: 'awaiting', version: '2.4.0' },
    { id: '2', name: 'Appointment Setter v4', type: 'agent', status: 'live', version: '4.1.2' },
    { id: '3', name: 'Review Optimizer Pro', type: 'agent', status: 'awaiting', version: '1.0.5' },
    { id: '4', name: 'Omni_Lead_Acq.logic', type: 'logic', status: 'live', version: '2.2.0' }
  ]);

  const assets = useMemo(() => {
    const queueAssets: Asset[] = deploymentQueue.map((name, i) => ({
        id: `q-${i}`,
        name,
        type: name.includes('Agent') ? 'agent' : name.includes('logic') ? 'logic' : 'website',
        status: 'awaiting',
        version: '1.0.0',
        isNew: true
    }));
    return [...queueAssets, ...baseAssets];
  }, [deploymentQueue, baseAssets]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleDeploy = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    setBaseAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'syncing' } : a));
    addLog(`INITIALIZING_PUSH: ${asset.name}...`);
    
    setTimeout(() => addLog(`STAGE_1: Code Minification & Obfuscation Complete.`), 800);
    setTimeout(() => addLog(`STAGE_2: Pushing Schema to Vector DB (Global Cluster)...`), 1600);
    setTimeout(() => addLog(`STAGE_3: Propagating to Edge Nodes (EU, US, ASIA)...`), 2400);
    
    setTimeout(() => {
        setBaseAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'live' } : a));
        addLog(`SUCCESS: ${asset.name} is now LIVE at production edge.`);
        addActivity(`Global Sync Complete: ${asset.name} is Live`, 'sync');
        toast(`${asset.name} Deployment Successful`, "success");
    }, 3500);
  };

  const handleRollback = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    addLog(`ROLLBACK_INITIATED: Reverting ${asset.name} to v${(parseFloat(asset.version) - 0.1).toFixed(1)}...`);
    setBaseAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'syncing' } : a));
    
    setTimeout(() => {
        setBaseAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'awaiting' } : a));
        addLog(`ROLLBACK_COMPLETE: ${asset.name} returned to Staging.`);
        addActivity(`System Rollback: ${asset.name} reverted`, 'sync');
        toast("Rollback Successful", "info");
    }, 2000);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="Deployment Hub" 
        statusText={maintenanceMode ? "SYSTEM_MAINTENANCE_ACTIVE" : "Ready for Production Sync"}
        action={
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Maintenance</span>
                <button 
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-8 h-4 rounded-full transition-all relative ${maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${maintenanceMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
             </div>
             <div className="h-6 w-px bg-white/5" />
             <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${maintenanceMode ? 'bg-red-500' : 'bg-[#00ffd1]'} animate-pulse`} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Cluster: {maintenanceMode ? 'Locked' : 'Nominal'}</span>
             </div>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex gap-4 border-b border-white/5 pb-4">
             {[
                { id: 'website', label: 'Web Blueprints', icon: Layout },
                { id: 'agent', label: 'Agent Profiles', icon: Mic },
                { id: 'logic', label: 'Logic Rulebooks', icon: Zap }
             ].map((cat) => (
                <button 
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all ${activeTab === cat.id ? 'bg-[#00ffd1] text-black shadow-[0_0_20px_rgba(0,255,209,0.2)]' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                    <cat.icon size={14} />
                    {cat.label}
                    {assets.filter(a => a.type === cat.id && a.isNew).length > 0 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                </button>
             ))}
          </div>

          <div className="grid gap-6">
            {assets.filter(a => a.type === activeTab).map((asset) => (
                <div key={asset.id} className={`glass-panel p-8 flex flex-col gap-8 transition-all border-l-4 ${
                    asset.status === 'live' ? 'border-l-emerald-500 bg-emerald-500/5' : 
                    asset.status === 'syncing' ? 'border-l-[#00ffd1] bg-[#00ffd1]/5' : 
                    asset.isNew ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-transparent'
                }`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl ${asset.status === 'live' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                                {asset.type === 'website' ? <Layout size={24} /> : asset.type === 'agent' ? <Mic size={24} /> : <Zap size={24} />}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-black uppercase italic text-white tracking-tight">{asset.name}</h4>
                                    {asset.isNew && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded border border-amber-500/30">
                                            <Sparkles size={8} className="text-amber-500" />
                                            <span className="text-[8px] font-mono text-amber-500 uppercase font-black">Ready For Sync</span>
                                        </div>
                                    )}
                                    <span className="text-[9px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded">v{asset.version}</span>
                                </div>
                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                    Status: {asset.status.toUpperCase()} // Target: Production_Edge
                                </p>
                            </div>
                        </div>
                        {asset.status === 'live' && (
                            <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase tracking-widest">
                                <Activity size={12} className="animate-pulse" />
                                Live Traffic: 2.4k/min
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {asset.status === 'live' ? (
                            <>
                                <button className="flex-1 bg-white/5 border border-white/10 text-white/60 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:text-[#00ffd1] transition-all flex items-center justify-center gap-2">
                                    <ExternalLink size={14} /> View Deployment
                                </button>
                                <button 
                                    onClick={() => handleRollback(asset.id)}
                                    className="px-6 bg-red-500/10 border border-red-500/20 text-red-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <History size={14} /> Rollback
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => handleDeploy(asset.id)}
                                disabled={asset.status === 'syncing' || maintenanceMode}
                                className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:opacity-20"
                            >
                                {asset.status === 'syncing' ? <><Loader2 size={16} className="animate-spin" /> Syncing...</> : <><Rocket size={16} /> Push To Production</>}
                            </button>
                        )}
                    </div>
                </div>
            ))}
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
           <div className="glass-panel h-[500px] bg-black p-6 font-mono flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-scan" />
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <TerminalIcon size={14} className="text-[#00ffd1]" />
                        <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Deployment_Console</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-4 scrollbar-hide text-[11px]">
                    {logs.length === 0 ? (
                        <p className="text-white/5 italic uppercase tracking-widest">Awaiting system command...</p>
                    ) : (
                        logs.map((log, i) => (
                            <p key={i} className="text-white/40 animate-in slide-in-from-left-2 duration-300">
                                <span className="text-[#00ffd1] mr-3">❯</span>
                                {log}
                            </p>
                        ))
                    )}
                </div>
           </div>

           <div className="glass-panel p-8 space-y-6 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <Monitor size={16} className="text-[#00ffd1]" />
                    <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Edge Performance</h3>
                </div>
                <div className="space-y-6">
                    {[
                        { label: 'Latency', val: '12ms', pct: 15 },
                        { label: 'Integrity', val: '99.9%', pct: 99 },
                        { label: 'Uptime', val: '100%', pct: 100 }
                    ].map((stat) => (
                        <div key={stat.label} className="space-y-2">
                            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest">
                                <span className="text-white/20">{stat.label}</span>
                                <span className="text-[#00ffd1]">{stat.val}</span>
                            </div>
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00ffd1]/40" style={{ width: `${stat.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
           </div>

           <button 
                disabled={maintenanceMode}
                className="w-full py-6 bg-[#00ffd1] text-black rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(0,255,209,0.2)] flex items-center justify-center gap-3 disabled:opacity-20"
            >
                <Globe size={18} /> Sync Neural Web
           </button>
        </aside>
      </div>
    </div>
  );
}