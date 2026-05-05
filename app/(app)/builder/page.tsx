"use client";
import { useState, useEffect } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  Plus, 
  Sparkles, 
  Monitor, 
  ShieldCheck, 
  Cpu, 
  Terminal as TerminalIcon, 
  Layout, 
  Layers, 
  ChevronRight,
  RefreshCcw,
  Download,
  Settings2,
  ArrowUp,
  ArrowDown,
  Trash2,
  Wand2,
  Zap,
  Rocket,
  ArrowUpRight,
  CheckCircle2,
  BrainCircuit
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

const INDUSTRIES = ["Dental Clinic", "Law Firm", "SaaS Startup", "Real Estate", "E-commerce"];
const STYLES = ["Glassmorphism", "Minimalist", "High-Contrast", "Cinematic"];

type Component = {
  id: string;
  type: string;
  title: string;
  content?: string;
  items?: any;
  status: 'draft' | 'final';
};

export default function BuilderPage() {
  const { selectedSector, addActivity, addToQueue, knowledgeBase, user, supabase, trackEvent } = useApp();
  const { toast } = useToast();
  const [industry, setIndustry] = useState(selectedSector.label);
  const [style, setStyle] = useState(STYLES[0]);
  const [prompt, setPrompt] = useState("");
  const [buildState, setBuildState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<Component[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop");

  const addLocalLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  const handleStartBuild = async () => {
    setBuildState('processing');
    setBlueprint([]);
    addLocalLog(`Accessing Neural Memory for ${industry}...`);
    addActivity(`Neural Architect consulting knowledge base...`, 'builder');
    
    setTimeout(() => addLocalLog(`Found ${knowledgeBase.length} Contextual Anchors...`), 500);
    setTimeout(() => addLocalLog(`Synthesizing Business DNA...`), 1000);
    
    try {
        // Fetch data from our Next.js API route with Knowledge Base context
        // Fetch data from our Next.js API route with Knowledge Base context
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                industry: industry.toLowerCase().split(' ')[0], 
                style, 
                prompt,
                context: knowledgeBase // SENDING THE BRAIN DATA!
            })
        });
        
        let data: any = {};
        try {
            const textResponse = await res.text();
            data = textResponse ? JSON.parse(textResponse) : {};
        } catch (parseError) {
            console.error("Neural generation parsing failed:", parseError);
            addLocalLog("Neural Engine Offline: Using cached blueprint...");
            toast("Neural Sync Failed. Using Fallback Matrix.", "error");
        }
        
        if (data.imageKeyword) {
            setHeroImage(`https://loremflickr.com/1600/900/${data.imageKeyword.split(' ').join(',')}`);
        }

        const generatedBlueprint: Component[] = [
            { id: '1', type: 'HERO', title: data.hero?.title || 'Neural Hero Header', status: 'draft' },
            { id: '2', type: 'SUBTEXT', title: data.hero?.sub || 'Strategic Mission', status: 'draft' },
            { id: '3', type: 'ABOUT', title: data.about?.title || 'Hikayemiz', content: data.about?.content, status: 'draft' },
            { 
                id: '4', 
                type: 'SERVICES', 
                title: 'Stratejik Çözüm Paketi', 
                items: [
                    ...(data.services || []),
                    { name: "Neural Content Multiplier", desc: "İçeriklerinizi 12 farklı platform için otonom optimize eder." },
                    { name: "Autonomous Lead Recovery", desc: "Kaybedilen müşteri adaylarını otonom senaryolarla geri kazanır." },
                    { name: "Omni-Channel Planner", desc: "Tüm dijital varlığınızı tek bir beyin üzerinden yönetir." }
                ], 
                status: 'draft' 
            },
            { id: '5', type: 'FAQ', title: 'Sıkça Sorulan Sorular', items: data.faqs, status: 'draft' },
            { id: '6', type: 'TESTIMONIALS', title: 'Müşteri Yorumları', items: data.testimonials, status: 'draft' },
            { 
                id: '9', 
                type: 'CASE_STUDIES', 
                title: 'Başarı Hikayeleri', 
                items: [
                    { client: "Global Dental Group", result: "%45 Verimlilik Artışı", desc: "AIVA entegrasyonu sonrası randevu kaçırma oranları sıfıra indi." },
                    { client: "TechFlow SaaS", result: "2.4M TL Ek Gelir", desc: "Otonom satış asistanı sayesinde kapalı satış oranları %34 arttı." }
                ], 
                status: 'draft' 
            },
            { 
                id: '10', 
                type: 'PRICING', 
                title: 'Yatırım Planları', 
                items: [
                    { plan: "Neural Entry", price: "₺1,499", features: ["Basic Automations", "Social Media Sync", "Email Support"] },
                    { plan: "Neural Pro", price: "₺4,999", features: ["Full Vapi Access", "Lead Scraper", "24/7 Support"], popular: true },
                    { plan: "Enterprise", price: "Custom", features: ["Dedicated Neural Node", "On-Premise Sync", "SLA Guarantee"] }
                ], 
                status: 'draft' 
            },
            { id: '7', type: 'CONTACT', title: 'İletişim', items: data.contact, status: 'draft' },
            { id: '8', type: 'CTA', title: data.hero?.cta || 'Conversion Anchor', status: 'draft' }
        ];

        setBlueprint(generatedBlueprint);
        setBuildState('done');
        addLocalLog(`SUCCESS: Deep Architecture Generated (v${data.architecture || '5.0.0-Deep'}).`);
        addActivity(`Full Corporate Architecture Generated: 8 Nodes`, 'builder');
        addToQueue('Website_Blueprint_v5.0_Deep');
        toast("Deep Architecture Complete: Fully personalized.", "success");
        
        // AUTO-SAVE NEW GENERATION
        await saveToDatabase(generatedBlueprint, heroImage);
    } catch (error) {
        addLocalLog(`ERROR: Neural API Failed.`);
        setBuildState('idle');
        toast("API Connection Failed", "error");
    }
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newBlueprint = [...blueprint];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blueprint.length) return;
    
    [newBlueprint[index], newBlueprint[targetIndex]] = [newBlueprint[targetIndex], newBlueprint[index]];
    setBlueprint(newBlueprint);
    addLocalLog(`Moved ${blueprint[index].type} ${direction === 'up' ? 'ascending' : 'descending'}.`);
    addToQueue('Website_Blueprint_Update');
  };

  const deleteComponent = (id: string) => {
    const comp = blueprint.find(c => c.id === id);
    setBlueprint(prev => prev.filter(c => c.id !== id));
    addLocalLog(`Component ${comp?.title} purged from branch.`);
    addActivity(`Component Removed: ${comp?.title}`, 'builder');
    addToQueue('Website_Blueprint_Update');
  };

  const refineComponent = (id: string) => {
    const comp = blueprint.find(c => c.id === id);
    addLocalLog(`Refining ${comp?.title} with current DNA constraints...`);
    toast(`Refining ${comp?.title}...`, "info");
    
    setTimeout(() => {
        setBlueprint(prev => prev.map(c => c.id === id ? { ...c, status: 'final', title: c.title + " (Refined)" } : c));
        addLocalLog(`Refinement complete for ${comp?.title}.`);
        addActivity(`Component Refined: ${comp?.title}`, 'builder');
        addToQueue('Website_Blueprint_Update');
    }, 1500);
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  // LOAD PERSISTED ARCHITECTURE
  useEffect(() => {
    const loadLatest = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('site_blueprints')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data && !error) {
            setBlueprint(data.content);
            setHeroImage(data.hero_image);
            setIndustry(data.industry);
            setStyle(data.style);
            setBuildState('done');
            addLocalLog("Neural Link Restored: Latest architecture loaded.");
        }
    };
    loadLatest();
  }, [user]);

  const saveToDatabase = async (newBlueprint: Component[], img: string) => {
    if (!user) return;
    try {
        await supabase.from('site_blueprints').insert([{
            user_id: user.id,
            industry,
            style,
            content: newBlueprint,
            hero_image: img
        }]);
    } catch (e) {
        console.error("Failed to save blueprint:", e);
    }
  };

  const updateComponentTitle = async (id: string, newTitle: string) => {
    const newBlueprint = blueprint.map(c => c.id === id ? { ...c, title: newTitle, status: 'final' } as Component : c);
    setBlueprint(newBlueprint);
    addLocalLog(`Manual override: ${id} updated.`);
    addToQueue('Website_Blueprint_Update');
    
    // Auto-save edit
    if (user) {
        await supabase.from('site_blueprints').update({ content: newBlueprint })
            .match({ user_id: user.id })
            .order('created_at', { ascending: false })
            .limit(1);
    }
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20 relative">
      <PageHeader 
        title="Neural Architect" 
        statusText={buildState === 'done' ? "Architecture: Vetted" : `Workspace: ${industry}_Sector`}
        action={
          <div className="flex items-center gap-4">
             <button 
                onClick={handleStartBuild}
                disabled={buildState === 'processing'}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
             >
                {buildState === 'processing' ? <><RefreshCcw size={14} className="animate-spin" /> Processing</> : <><Sparkles size={14} /> Initiate Build</>}
             </button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: CONFIGURATION PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* NEW: PREDICTIVE CONVERSION MATRIX */}
          <div className="glass-panel p-8 bg-indigo-500/5 border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <Rocket size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Zap size={16} className="text-indigo-400" />
                      <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Predictive Conversion</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Estimated ROI Lift</p>
                          <p className="text-3xl font-black text-white italic">+24<span className="text-sm text-white/40">%</span></p>
                      </div>
                      <div>
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Trust Index</p>
                          <p className="text-3xl font-black text-[#00ffd1] italic">96<span className="text-sm text-[#00ffd1]/40">/100</span></p>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest">
                          <span className="text-white/40">Funnel Friction</span>
                          <span className="text-emerald-400">Low</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-400 w-[15%]" />
                          <div className="h-full bg-indigo-500 w-[60%]" />
                          <div className="h-full bg-[#00ffd1] w-[25%]" />
                      </div>
                  </div>
              </div>
          </div>

          <div className="glass-panel p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                <Settings2 size={16} className="text-[#00ffd1]" />
                <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">DNA Configuration</h3>
            </div>

            <div className="space-y-6">
              {/* NEW: SELF-HEALING TOGGLE */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-[#00ffd1]/30 transition-all cursor-pointer">
                  <div className="space-y-1">
                      <div className="flex items-center gap-2">
                          <ShieldCheck size={12} className="text-[#00ffd1]" />
                          <h4 className="text-[9px] font-mono font-black text-white uppercase tracking-widest">Self-Healing Sync</h4>
                      </div>
                      <p className="text-[8px] font-mono text-white/40 uppercase">Auto-updates from KB</p>
                  </div>
                  <div className="w-10 h-5 bg-[#00ffd1]/20 rounded-full flex items-center p-1 border border-[#00ffd1]/40 relative">
                      <div className="w-3 h-3 bg-[#00ffd1] rounded-full absolute right-1 shadow-[0_0_10px_#00ffd1]" />
                  </div>
              </div>

              {/* NEW: NEURAL WIDGETS */}
              <div className="space-y-3">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Active Neural Widgets</label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-2 group hover:border-indigo-500/40 transition-all">
                        <Monitor size={14} className="text-indigo-400" />
                        <span className="text-[8px] font-mono text-white/60 uppercase tracking-widest font-black">Vapi Agent</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex flex-col gap-2 group hover:border-[#00ffd1]/40 transition-all">
                        <Sparkles size={14} className="text-[#00ffd1]" />
                        <span className="text-[8px] font-mono text-white/60 uppercase tracking-widest font-black">Reputation Feed</span>
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Strategic Mission</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Focus on dental implants with premium aesthetic feel..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/10 focus:border-[#00ffd1]/40 transition-all h-24 outline-none resize-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-black font-mono space-y-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 animate-scan" />
             <div className="flex items-center gap-2 text-white/10 border-b border-white/5 pb-4">
                <TerminalIcon size={12} />
                <span className="text-[8px] uppercase tracking-[0.3em] font-black italic">Architect_Output_Log</span>
             </div>
             <div className="space-y-1.5 min-h-[140px] max-h-[140px] overflow-y-auto scrollbar-hide">
                {logs.length === 0 ? (
                    <p className="text-[9px] text-white/5 italic uppercase tracking-widest">Awaiting command...</p>
                ) : (
                    logs.map((log, i) => (
                        <p key={i} className="text-[9px] text-[#00ffd1]/60 animate-in slide-in-from-left-2 duration-300">
                            {log}
                        </p>
                    ))
                )}
             </div>
          </div>
        </div>

        {/* RIGHT: ARCHITECTURE CANVAS */}
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-panel h-full min-h-[800px] flex flex-col overflow-hidden relative group bg-black/40">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                    </div>
                    <div className="h-4 w-px bg-white/5" />
                    <div className="flex items-center gap-4 text-white/20">
                        <Monitor size={14} className="text-[#00ffd1]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest italic font-black">Interactive Workspace</span>
                    </div>
                </div>
                {buildState === 'done' && (
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Monitor size={14} /> Live Preview
                        </button>
                        <button 
                            onClick={() => addToQueue('Full_Architecture_Push')}
                            className="flex items-center gap-2 bg-[#00ffd1]/10 border border-[#00ffd1]/40 text-[#00ffd1] px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-[#00ffd1] hover:text-black transition-all"
                        >
                            <Download size={14} /> Global Sync
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 p-8 flex flex-col relative overflow-hidden bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:30px_30px]">
                {buildState === 'idle' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-1000">
                         <Cpu size={84} strokeWidth={0.5} className="text-white/5 animate-pulse" />
                         <div className="text-center space-y-4">
                            <h2 className="text-4xl font-syne font-black uppercase italic tracking-tighter text-white/10">Engine Standby</h2>
                            <p className="text-[10px] font-mono text-white/5 uppercase tracking-[0.5em]">Input DNA and Initiate Architect</p>
                         </div>
                    </div>
                )}

                {buildState === 'processing' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                         <div className="relative">
                            <div className="absolute inset-0 bg-[#00ffd1]/20 blur-3xl animate-pulse" />
                            <RefreshCcw size={48} className="text-[#00ffd1] animate-spin relative z-10" />
                         </div>
                         <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.5em] animate-pulse">Synthesizing Nodes...</p>
                    </div>
                )}

                {buildState === 'done' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {blueprint.map((comp, idx) => (
                            <div 
                                key={comp.id} 
                                onClick={() => setEditingId(comp.id)}
                                className={`glass-panel p-8 flex items-center justify-between group hover:border-[#00ffd1]/40 transition-all bg-black/40 relative border-l-4 cursor-pointer ${editingId === comp.id ? 'border-l-[#00ffd1] bg-[#00ffd1]/5' : 'border-l-white/5 hover:border-l-[#00ffd1]'}`}
                            >
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => moveComponent(idx, 'up')} className="text-white/10 hover:text-[#00ffd1] transition-all"><ArrowUp size={14} /></button>
                                        <button onClick={() => moveComponent(idx, 'down')} className="text-white/10 hover:text-[#00ffd1] transition-all"><ArrowDown size={14} /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-[8px] font-mono text-[#00ffd1] uppercase tracking-widest border border-[#00ffd1]/20 px-2 py-0.5 rounded-full">{comp.type}</span>
                                            <span className={`text-[8px] font-mono uppercase ${comp.status === 'final' ? 'text-emerald-500 font-black' : 'text-white/20'}`}>[{comp.status}]</span>
                                            
                                            {/* PREDICTIVE CONVERSION BADGES */}
                                            {(comp.type === 'CTA' || comp.type === 'HERO') && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-mono text-emerald-400 uppercase">
                                                    <ArrowUpRight size={8} /> +14.2% Conversion Lift
                                                </div>
                                            )}
                                            {(comp.type === 'PRICING' || comp.type === 'SERVICES') && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-mono text-indigo-400 uppercase">
                                                    <BrainCircuit size={8} /> Optimized by Vapi Insights
                                                </div>
                                            )}
                                            {(comp.type === 'TESTIMONIALS') && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[8px] font-mono text-amber-400 uppercase">
                                                    <RefreshCcw size={8} className="animate-spin" /> Live Sync from Reputation
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-black italic uppercase text-white tracking-tight">{comp.title}</h4>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                        onClick={() => refineComponent(comp.id)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-[#00ffd1] hover:border-[#00ffd1]/40 transition-all flex items-center gap-2 text-[10px] font-mono font-black uppercase"
                                    >
                                        <Wand2 size={14} /> Refine
                                    </button>
                                    <button 
                                        onClick={() => deleteComponent(comp.id)}
                                        className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500/40 hover:bg-red-500/20 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <button className="w-full py-8 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-white/10 hover:text-[#00ffd1] hover:border-[#00ffd1]/20 transition-all group">
                            <Plus size={32} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Inject Manual Node</span>
                        </button>
                    </div>
                )}
            </div>

            {/* EDIT PANEL OVERLAY */}
            {editingId && (
                <div className="absolute inset-y-0 right-0 w-80 bg-[#050506] border-l border-white/10 p-8 animate-in slide-in-from-right duration-500 z-30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[10px] font-mono font-black text-[#00ffd1] uppercase tracking-widest">Node Editor</h3>
                        <button onClick={() => setEditingId(null)} className="text-white/20 hover:text-white transition-colors"><Plus className="rotate-45" size={20} /></button>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Component Content</label>
                            <textarea 
                                value={blueprint.find(c => c.id === editingId)?.title || ""}
                                onChange={(e) => updateComponentTitle(editingId, e.target.value)}
                                className="w-full bg-black border border-white/5 rounded-2xl p-6 text-sm text-white/80 font-mono focus:border-[#00ffd1]/40 outline-none transition-all h-64 resize-none"
                            />
                        </div>
                        <div className="p-6 bg-[#00ffd1]/5 border border-[#00ffd1]/10 rounded-2xl">
                            <p className="text-[8px] font-mono text-[#00ffd1]/60 uppercase tracking-widest italic">Note: Changes reflect in live preview instantly.</p>
                        </div>
                        <button 
                            onClick={() => setEditingId(null)}
                            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all"
                        >
                            Save Node
                        </button>
                    </div>
                </div>
            )}

            <div className="p-6 border-t border-white/5 flex items-center justify-between bg-[#050506]">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className={`h-1.5 w-1.5 rounded-full ${buildState === 'processing' ? 'bg-[#00ffd1] animate-ping' : 'bg-white/10'}`} />
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Architect Engine: {buildState.toUpperCase()}</span>
                    </div>
                    <div className="h-4 w-px bg-white/5" />
                    <div className="flex items-center gap-3 text-[9px] font-mono text-white/20 uppercase tracking-widest italic">
                        Nodes: {blueprint.length} // Memory: NOMINAL
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono text-white/10 uppercase tracking-widest italic">
                    <Zap size={10} className="text-[#00ffd1]" /> v4.2.1-NEURAL
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-7xl h-full max-h-[90vh] bg-[#050506] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-[0_0_100px_rgba(0,255,209,0.1)]">
                {/* Browser Toolbar */}
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="px-32 py-1.5 bg-black/40 border border-white/5 rounded-full text-[10px] font-mono text-white/40 tracking-widest">
                        https://client-preview.aiva.os
                    </div>
                    <button onClick={() => setIsPreviewOpen(false)} className="text-white/40 hover:text-white transition-colors">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>
                
                {/* Simulated Website */}
                <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#050506]">
                    {/* Fake Navbar */}
                    <nav className="sticky top-0 w-full z-30 p-6 md:p-8 flex justify-between items-center bg-[#050506]/80 backdrop-blur-md border-b border-white/5">
                        <div className="text-xl font-syne font-black italic text-white tracking-tighter">BRAND.</div>
                        <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-widest text-white/60">
                            <span className="hover:text-[#00ffd1] cursor-pointer transition-colors">About</span>
                            <span className="hover:text-[#00ffd1] cursor-pointer transition-colors">Services</span>
                            <span className="hover:text-[#00ffd1] cursor-pointer transition-colors">Contact</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#00ffd1]/10 border border-[#00ffd1]/20 flex items-center justify-center text-[#00ffd1]">
                            <Zap size={16} />
                        </div>
                    </nav>
 
                    <div className="relative">
                        {/* HERO SECTION */}
                        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center space-y-12 py-32 px-10 relative overflow-hidden">
                            <img 
                                src={heroImage} 
                                alt="AI Architecture" 
                                className="absolute inset-0 w-full h-full object-cover opacity-10"
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,209,0.06)_0%,transparent_70%)]" />
                            <div className="space-y-6 relative z-10 max-w-6xl mx-auto">
                                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#00ffd1]/30 bg-[#00ffd1]/5 backdrop-blur-md animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ffd1]" />
                                    <span className="text-[10px] font-mono font-black text-[#00ffd1] uppercase tracking-[0.3em]">Neural Architecture Active</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-syne font-black uppercase italic text-white leading-[0.95] tracking-[-0.04em]">
                                    {blueprint.find(c => c.type === 'HERO')?.title || 'Revolutionary AI Strategy'}
                                </h1>
                                <p className="text-sm md:text-base text-white/30 font-light max-w-xl mx-auto italic leading-relaxed">
                                    {blueprint.find(c => c.type === 'SUBTEXT')?.title || 'Autonomous business transformation powered by neural reasoning.'}
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-4">
                                <button className="px-10 py-4 bg-[#00ffd1] text-black font-black uppercase text-[9px] tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_50px_rgba(0,255,209,0.2)]">
                                    {blueprint.find(c => c.type === 'CTA')?.title || 'Launch Growth'}
                                </button>
                                <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] tracking-widest rounded-full hover:bg-white/10 transition-all backdrop-blur-xl">
                                    Explore Ecosystem
                                </button>
                            </div>
                        </div>
    
                            {/* Content Blocks */}
                            <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
                                
                                {/* ABOUT SECTION */}
                                {blueprint.find(c => c.type === 'ABOUT') && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-8">
                                            <div className="w-12 h-1 bg-[#00ffd1]" />
                                            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase italic text-white tracking-tighter leading-tight">
                                                {blueprint.find(c => c.type === 'ABOUT')?.title}
                                            </h2>
                                            <p className="text-lg text-white/30 leading-relaxed font-light italic border-l-2 border-white/5 pl-8">
                                                {blueprint.find(c => c.type === 'ABOUT')?.content || "Sektörünüzde fark yaratmak için tasarlanmış derin öğrenme destekli stratejik vizyonumuzla tanışın."}
                                            </p>
                                        </div>
                                        <div className="aspect-video bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                                            <img src={heroImage} alt="About" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] to-transparent opacity-40" />
                                        </div>
                                    </div>
                                )}
    
                                {/* SERVICES GRID */}
                                <div className="space-y-16">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-syne font-black uppercase italic text-white tracking-tighter leading-tight">Solutions</h2>
                                        <p className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-[0.4em] italic font-black">Strategic Outcome Alignment</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(blueprint.find(c => c.type === 'SERVICES')?.items || []).map((service: any, i: number) => (
                                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-[#00ffd1]/40 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                                                <div className="space-y-6">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#00ffd1] group-hover:text-black transition-all duration-500">
                                                        <Zap size={20} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-[#00ffd1] transition-colors">{service.name}</h3>
                                                        <p className="text-xs text-white/30 leading-relaxed italic line-clamp-4">
                                                            "{service.desc}"
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00ffd1]/40 transition-all">
                                                        <ArrowUpRight size={12} className="text-white/20 group-hover:text-[#00ffd1]" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
    
                                {/* FAQ SECTION */}
                                {blueprint.find(c => c.type === 'FAQ') && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12">
                                        <div className="lg:col-span-4 space-y-4">
                                            <h2 className="text-4xl md:text-5xl font-syne font-black uppercase italic text-white leading-tight">Common<br/>Questions</h2>
                                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Neural Knowledge Retrieval</p>
                                        </div>
                                        <div className="lg:col-span-8 space-y-4">
                                            {(blueprint.find(c => c.type === 'FAQ')?.items || []).map((faq: any, i: number) => (
                                                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                                    <h4 className="text-base font-black text-white group-hover:text-[#00ffd1] mb-2 uppercase tracking-tight">{faq.q}</h4>
                                                    <p className="text-xs text-white/30 italic leading-relaxed">{faq.a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* CASE STUDIES */}
                            {blueprint.find(c => c.type === 'CASE_STUDIES') && (
                                <div className="space-y-16">
                                    <div className="text-center space-y-4">
                                        <h2 className="text-5xl font-syne font-black uppercase italic text-white">Impact Evidence</h2>
                                        <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.4em]">Real-world Neural Success</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {(blueprint.find(c => c.type === 'CASE_STUDIES')?.items || []).map((study: any, i: number) => (
                                            <div key={i} className="p-12 bg-white/[0.02] border border-white/10 rounded-[3.5rem] space-y-8 group hover:bg-[#00ffd1]/5 transition-all duration-700">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{study.client}</span>
                                                    <span className="px-4 py-1 bg-[#00ffd1]/10 text-[#00ffd1] text-[10px] font-black rounded-full border border-[#00ffd1]/20">{study.result}</span>
                                                </div>
                                                <p className="text-2xl font-light italic text-white/80 leading-snug">"{study.desc}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PRICING TABLE */}
                            {blueprint.find(c => c.type === 'PRICING') && (
                                <div className="space-y-20">
                                    <div className="text-center space-y-4">
                                        <h2 className="text-5xl font-syne font-black uppercase italic text-white">Value Tiers</h2>
                                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Investment Roadmap</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {(blueprint.find(c => c.type === 'PRICING')?.items || []).map((tier: any, i: number) => (
                                            <div key={i} className={`p-12 rounded-[4rem] border transition-all duration-700 flex flex-col ${tier.popular ? 'bg-[#00ffd1] border-[#00ffd1] text-black scale-105 z-10' : 'bg-white/[0.02] border-white/10 text-white'}`}>
                                                <div className="mb-10">
                                                    <h4 className="text-xs font-mono font-black uppercase tracking-widest mb-4 opacity-60">{tier.plan}</h4>
                                                    <p className="text-5xl font-black italic tracking-tighter">{tier.price}</p>
                                                </div>
                                                <div className="space-y-4 mb-12 flex-1">
                                                    {(tier.features || []).map((f: string, j: number) => (
                                                        <div key={j} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                                                            <CheckCircle2 size={14} className={tier.popular ? 'text-black' : 'text-[#00ffd1]'} />
                                                            {f}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${tier.popular ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-black hover:bg-[#00ffd1]'}`}>
                                                    Select Tier
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
                            {/* CONTACT SECTION */}
                            {blueprint.find(c => c.type === 'CONTACT') && (
                                <div className="p-12 md:p-20 bg-gradient-to-br from-[#00ffd1]/10 to-transparent border border-[#00ffd1]/20 rounded-[5rem] text-center space-y-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ffd1]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
                                    <div className="space-y-4 relative z-10">
                                        <h2 className="text-5xl md:text-6xl font-syne font-black uppercase italic text-white">Get in Touch</h2>
                                        <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.5em]">Direct Channel Established</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                                        {[
                                            { label: 'Location', val: blueprint.find(c => c.type === 'CONTACT')?.items?.address || 'Global Neural Node' },
                                            { label: 'Voice', val: blueprint.find(c => c.type === 'CONTACT')?.items?.phone || '+1 (AIVA) OPS-88' },
                                            { label: 'Neural Mail', val: blueprint.find(c => c.type === 'CONTACT')?.items?.email || 'sync@aiva-os.com' }
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-3">
                                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{item.label}</p>
                                                <p className="text-sm text-white/70 font-medium italic">{item.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

