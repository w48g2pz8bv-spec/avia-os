"use client";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, SECTORS } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import {
  BookOpen,
  BrainCircuit,
  Trash2,
  Tag,
  Clock,
  Sparkles,
  Database,
  Search,
  Send,
  Globe,
  Link,
  FileText,
  Keyboard,
  Cpu,
  X,
  Zap,
  RefreshCcw,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function KnowledgePage() {
  const { toast } = useToast();
  const { addActivity, selectedSector, isDbConnected } = useApp();
  
  const [realDocuments, setRealDocuments] = useState<any[]>([]);
  const [filterSector, setFilterSector] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (data) setRealDocuments(data);
    };
    fetchDocs();
  }, []);
  
  // Inject Form States
  const [newKnowledge, setNewKnowledge] = useState("");
  const [newSector, setNewSector] = useState(selectedSector.label);
  const [sourceType, setSourceType] = useState<'manual' | 'website' | 'document'>('manual');
  
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  // Oracle Query States
  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState<any>(null);
  const [isOracleThinking, setIsOracleThinking] = useState(false);

  const allSectors = ["All", ...SECTORS.map(s => s.label)];

  const filteredKnowledge = useMemo(() => {
    return realDocuments.filter(entry => {
      const matchesSector = filterSector === "All" || entry.title.includes(filterSector);
      const matchesSearch = !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [realDocuments, filterSector, searchQuery]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddKnowledge = async () => {
    if (newKnowledge.trim().length < 3) return;
    setIsAdding(true);
    setProcessingStage(1);

    try {
      const res = await fetch('/api/knowledge/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `[${sourceType.toUpperCase()}] ${newSector} Verisi - ${newKnowledge.substring(0, 30)}...`,
          content: newKnowledge.trim(),
          type: sourceType,
          source: sourceType === 'website' ? 'URL Extract' : 'Manual Entry'
        })
      });
      const result = await res.json();
      
      setProcessingStage(2);
      await new Promise(r => setTimeout(r, 600));
      setProcessingStage(3);
      await new Promise(r => setTimeout(r, 400));
      
      if (!res.ok) throw new Error(result.error);
      
      toast(`Bilgi başarıyla vektörlenip ${newSector} havuzuna eklendi!`, "success");
      
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (data) setRealDocuments(data);

      setNewKnowledge("");
      setTags([]);
      setTagInput("");
    } catch (e: any) {
      toast(`Hata: ${e.message}`, "error");
    } finally {
      setIsAdding(false);
      setProcessingStage(0);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('documents').delete().eq('id', id);
    setRealDocuments(prev => prev.filter(d => d.id !== id));
    toast("Bilgi vektör uzayından tamamen silindi", "info");
  };

  const handleOracleQuery = async () => {
    if (oracleQuery.trim().length < 3 || isOracleThinking) return;
    setIsOracleThinking(true);
    setOracleResponse(null);

    try {
      const res = await fetch('/api/knowledge/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: oracleQuery.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setOracleResponse({
        answer: data.answer,
        sources: data.sources || []
      });
      setOracleQuery("");
    } catch (e: any) {
      toast(`Oracle Error: ${e.message}`, "error");
    } finally {
      setIsOracleThinking(false);
    }
  };

  const stats = useMemo(() => ({
    total: realDocuments.length,
    bySector: SECTORS.map(s => ({
      label: s.label,
      count: realDocuments.filter(k => k.title.includes(s.label)).length,
      color: s.accent
    }))
  }), [realDocuments]);

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000 pb-20">
      <PageHeader
        title="Teach Mode / Neural KB"
        statusText={`${realDocuments.length} Vectors // Supabase: Active`}
        action={
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-mono font-black uppercase tracking-widest bg-[#00ffd1]/10 border-[#00ffd1]/30 text-[#00ffd1]`}>
              <Database size={12} />
              pgvector Synced
            </div>
          </div>
        }
      />

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={48} />
            </div>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Total Vectors</p>
            <p className="text-3xl font-syne font-black italic tracking-tighter text-white">{stats.total}</p>
        </div>
        {stats.bySector.map((s, i) => (
          <div key={i} className="glass-panel p-5 space-y-2 hover:border-white/10 transition-colors">
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-syne font-black italic tracking-tighter" style={{ color: s.color }}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: TEACH MODE PANEL */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="glass-panel p-8 space-y-6 border-l-4 border-l-[#00ffd1] relative overflow-hidden">
            {isAdding && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center font-mono p-8"
                >
                    <Cpu size={32} className="text-[#00ffd1] mb-6 animate-pulse" />
                    <div className="space-y-4 w-full">
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                            <div className={`h-1.5 w-1.5 rounded-full ${processingStage >= 1 ? 'bg-[#00ffd1] shadow-[0_0_10px_#00ffd1]' : 'bg-white/20'}`} />
                            <span className={processingStage >= 1 ? 'text-white' : 'text-white/40'}>Parsing Input Data...</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                            <div className={`h-1.5 w-1.5 rounded-full ${processingStage >= 2 ? 'bg-[#00ffd1] shadow-[0_0_10px_#00ffd1]' : 'bg-white/20'}`} />
                            <span className={processingStage >= 2 ? 'text-white' : 'text-white/40'}>Generating Vector Embeddings...</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                            <div className={`h-1.5 w-1.5 rounded-full ${processingStage >= 3 ? 'bg-[#00ffd1] shadow-[0_0_10px_#00ffd1]' : 'bg-white/20'}`} />
                            <span className={processingStage >= 3 ? 'text-white' : 'text-white/40'}>Syncing to Neural Cluster...</span>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#00ffd1]" />
              <h3 className="text-[12px] font-mono font-black text-white tracking-[0.2em] uppercase italic">Teach AIVA</h3>
            </div>
            
            {/* Source Selector */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { id: 'manual', icon: Keyboard, label: 'Manual' },
                    { id: 'website', icon: Link, label: 'URL Scrape' },
                    { id: 'document', icon: FileText, label: 'Upload' }
                ].map((src) => (
                    <button
                        key={src.id}
                        onClick={() => setSourceType(src.id as any)}
                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                            sourceType === src.id 
                                ? 'bg-[#00ffd1]/10 border-[#00ffd1]/30 text-[#00ffd1]' 
                                : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <src.icon size={16} />
                        <span className="text-[8px] font-mono uppercase tracking-widest font-black">{src.label}</span>
                    </button>
                ))}
            </div>

            {sourceType === 'website' && (
                <input 
                    type="url" 
                    placeholder="https://example.com/pricing"
                    className="w-full bg-black/40 border border-[#00ffd1]/30 rounded-xl p-3 text-sm text-white font-mono focus:border-[#00ffd1] outline-none placeholder:text-[#00ffd1]/20 transition-all"
                />
            )}

            {sourceType === 'document' && (
                <div className="w-full h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col gap-2 hover:border-[#00ffd1]/40 hover:bg-[#00ffd1]/5 transition-all cursor-pointer">
                    <FileText size={20} className="text-white/20" />
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Drop PDF / CSV Here</span>
                </div>
            )}

            {/* Content Textarea */}
            <div className="space-y-2">
                <label className="text-[8px] font-mono text-white/40 uppercase tracking-widest flex justify-between">
                    <span>{sourceType === 'manual' ? 'Raw Knowledge Data' : 'Extracted/Context Notes'}</span>
                    <span className="text-[#00ffd1]">{newKnowledge.length} chars</span>
                </label>
                <textarea
                value={newKnowledge}
                onChange={e => setNewKnowledge(e.target.value)}
                placeholder="E.g. 'Our primary service is restorative implants, starting at $1200.'"
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white font-mono leading-relaxed focus:border-[#00ffd1]/40 outline-none resize-none placeholder:text-white/10 transition-all"
                />
            </div>

            {/* Sector & Tags */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Target Sector</label>
                    <div className="flex flex-wrap gap-2">
                        {SECTORS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setNewSector(s.label)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest transition-all ${
                            newSector === s.label 
                                ? 'bg-white text-black' 
                                : 'bg-white/5 text-white/30 hover:text-white border border-white/5'
                            }`}
                        >
                            {s.label}
                        </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Neural Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 bg-[#00ffd1]/10 text-[#00ffd1] border border-[#00ffd1]/20 px-2 py-1 rounded-md text-[9px] font-mono uppercase">
                                <Tag size={8} /> {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-white ml-1"><X size={10} /></button>
                            </span>
                        ))}
                    </div>
                    <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type tag & press Enter..."
                        className="w-full bg-transparent border-b border-white/10 pb-2 text-[10px] font-mono text-white focus:border-[#00ffd1] outline-none placeholder:text-white/20 transition-all"
                    />
                </div>
            </div>

            <button
              onClick={handleAddKnowledge}
              disabled={newKnowledge.trim().length < 3 || isAdding}
              className="w-full py-4 bg-[#00ffd1] text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,255,209,0.2)] disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <Send size={14} /> Inject to Long-Term Memory
            </button>
          </div>
        </div>

        {/* RIGHT: KNOWLEDGE EXPLORER */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
          
          <div className="flex gap-4 items-center bg-black/40 p-2 rounded-2xl border border-white/5">
            <div className="flex-1 relative flex items-center">
              <Search size={14} className="absolute left-4 text-white/20" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search vector space..."
                className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-white font-mono focus:outline-none placeholder:text-white/20"
              />
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex gap-1 pr-2">
              {allSectors.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterSector(s)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filterSector === s ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
                  }`}
                >
                  {s === 'All' ? 'All Clusters' : s.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {filteredKnowledge.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-white/10"
                >
                  <BrainCircuit size={48} className="text-white/5" />
                  <div className="space-y-2">
                    <p className="text-[12px] font-mono text-white/20 uppercase tracking-[0.3em] font-black">
                      {realDocuments.length === 0 ? 'Memory Bank Empty' : 'No Vectors Match Query'}
                    </p>
                    <p className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
                      Use the Teach Panel to populate the neural network.
                    </p>
                  </div>
                </motion.div>
              ) : (
                filteredKnowledge.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                    className="glass-panel p-6 flex gap-6 group hover:border-[#00ffd1]/20 transition-all bg-black/20"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <div className="p-3 bg-white/5 rounded-2xl h-fit border border-white/5 group-hover:bg-[#00ffd1]/10 group-hover:border-[#00ffd1]/30 group-hover:text-[#00ffd1] transition-colors text-white/20">
                            {entry.source === 'website' ? <Globe size={18} /> : entry.source === 'document' ? <FileText size={18} /> : <Keyboard size={18} />}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-4">
                      <p className="text-sm text-white/70 font-mono leading-relaxed group-hover:text-white transition-colors">
                        {entry.title}
                      </p>
                      
                      <div className="flex items-center gap-x-6 gap-y-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Database size={10} className="text-white/20" />
                          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Type: <span className="text-[#00ffd1]/80">{entry.type}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-white/20" />
                          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                            Added: {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Just Now'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tag size={10} className="text-[#00ffd1]/40" />
                          <span className="text-[8px] font-mono text-[#00ffd1]/60 uppercase tracking-widest bg-[#00ffd1]/5 px-2 py-0.5 rounded">
                              Tokens: {entry.token_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 self-start"
                      title="Delete from memory"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* NEW: NEURAL DISTRIBUTION MAP */}
      <div className="mt-12 glass-panel p-10 bg-gradient-to-br from-[#00ffd1]/5 to-transparent border-[#00ffd1]/10">
          <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-[#00ffd1]/10 rounded-2xl text-[#00ffd1]"><Cpu size={24} /></div>
              <div className="space-y-1">
                  <h3 className="text-xl font-syne font-black uppercase italic text-white tracking-tight">Neural Cluster Mapping</h3>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Spatial Intelligence Distribution</p>
              </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square max-w-[400px] mx-auto lg:mx-0">
                  <div className="absolute inset-0 border border-white/5 rounded-full" />
                  <div className="absolute inset-[20%] border border-white/5 rounded-full" />
                  <div className="absolute inset-[40%] border border-white/5 rounded-full" />
                  
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00ffd1] rounded-full blur-[20px] opacity-20 animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00ffd1] rounded-full shadow-[0_0_20px_#00ffd1]" />
                  
                  {/* Sector Nodes */}
                  {stats.bySector.map((s, i) => {
                      const angle = (i / stats.bySector.length) * Math.PI * 2;
                      const x = 50 + Math.cos(angle) * 35;
                      const y = 50 + Math.sin(angle) * 35;
                      return (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="absolute w-2 h-2 rounded-full cursor-help group"
                            style={{ left: `${x}%`, top: `${y}%`, backgroundColor: s.color }}
                          >
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                  <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mb-1">{s.label}</p>
                                  <p className="text-[10px] font-black text-white">{s.count} Data Points</p>
                              </div>
                              <div className="absolute inset-0 bg-inherit rounded-full blur-[8px] opacity-40 animate-pulse" />
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[50px] bg-gradient-to-t from-white/10 to-transparent origin-bottom rotate-180" style={{ transform: `translate(-50%, -100%) rotate(${angle + Math.PI/2}rad)` }} />
                          </motion.div>
                      );
                  })}
              </div>
              
              <div className="space-y-8">
                  <div className="space-y-4">
                      <h4 className="text-[10px] font-mono font-black text-[#00ffd1] uppercase tracking-[0.3em]">Knowledge Integrity Report</h4>
                      <p className="text-sm text-white/40 leading-relaxed italic">
                          "AIVA'nın uzun süreli hafızası şu an {realDocuments.length} farklı vektör düğümü üzerinden çapraz sorgulama yapabiliyor. Sektörel kümeler arasındaki semantik benzerlik %84.2 oranında optimize edildi."
                      </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">Retrieval Speed</p>
                          <p className="text-xl font-black text-white italic">12ms</p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">Context Match</p>
                          <p className="text-xl font-black text-[#00ffd1] italic">99.8%</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* NEW: SEMANTIC ORACLE & LEARNING LOOP */}
      <div className="grid grid-cols-12 gap-8 mt-8">
        
        {/* SEMANTIC ORACLE */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <BrainCircuit size={18} className="text-indigo-400" />
                <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Semantic Oracle</h2>
            </div>
            
            <div className="glass-panel p-8 bg-black/40 border-indigo-500/10">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                    Cross-Module Intelligence Query
                </p>
                <div className="space-y-6">
                    {/* Oracle Response Area */}
                    {isOracleThinking ? (
                        <div className="flex items-center gap-3 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 text-indigo-400">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest">Searching Vector Space & Synthesizing...</span>
                        </div>
                    ) : oracleResponse ? (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                                <Zap size={12} className="text-indigo-400" />
                            </div>
                            <div className="flex-1 bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl rounded-tl-sm space-y-4">
                                {oracleResponse.sources.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-black rounded text-[7px] font-mono text-indigo-400 border border-indigo-400/20">
                                            Sources Found: {oracleResponse.sources.length}
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm text-white/90 leading-relaxed italic">
                                    "{oracleResponse.answer}"
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 opacity-50">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-black text-white">U</span>
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm">
                                <p className="text-sm text-white/50 font-mono italic">AIVA OS hafızasına az önce kaydettiğiniz bilgilere dair bir soru sorun (Örn: Kliniğin çalışma saatleri nedir?)</p>
                            </div>
                        </div>
                    )}

                    <div className="relative mt-4">
                        <input 
                            type="text" 
                            value={oracleQuery}
                            onChange={e => setOracleQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleOracleQuery()}
                            placeholder="Ask the Oracle..." 
                            className="w-full bg-black/60 border border-indigo-500/30 rounded-2xl pl-6 pr-16 py-4 text-sm text-white font-mono focus:border-indigo-500 outline-none placeholder:text-white/20 transition-all"
                            disabled={isOracleThinking}
                        />
                        <button 
                            onClick={handleOracleQuery}
                            disabled={isOracleThinking || oracleQuery.trim().length < 3}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center hover:bg-indigo-500/40 text-indigo-400 transition-colors disabled:opacity-30"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* AUTONOMOUS LEARNING LOOP */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <RefreshCcw size={18} className="text-[#00ffd1]" />
                <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Autonomous Loop</h2>
            </div>
            
            <div className="glass-panel p-8 bg-black/20 border-[#00ffd1]/10">
                <p className="text-sm text-white/60 italic leading-relaxed mb-6">
                    AIVA sadece sizin eklediğiniz verilerle kalmaz. Aktif modüllerden elde ettiği başarılı sonuçları otonom olarak yeni <span className="text-[#00ffd1] font-bold">Knowledge Vector</span>'lerine dönüştürür.
                </p>

                <div className="space-y-4 relative">
                    {/* Connecting line */}
                    <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-gradient-to-b from-[#00ffd1]/40 via-indigo-500/40 to-transparent" />
                    
                    <div className="relative z-10 flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-black border border-[#00ffd1]/30 flex flex-col items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,255,209,0.1)] group-hover:scale-110 transition-transform">
                            <MessageSquare size={14} className="text-[#00ffd1] mb-1" />
                            <span className="text-[6px] font-mono text-[#00ffd1] uppercase">Vapi</span>
                        </div>
                        <div className="flex-1 pt-2">
                            <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-widest mb-1">Trigger: Call Closed</p>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-white/70 font-mono">
                                "Müşteri 'acı' itirazını 'Lazer Doku Kaynağı' argümanıyla aştık. Başarı: %92"
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-black border border-indigo-500/30 flex flex-col items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform">
                            <Cpu size={14} className="text-indigo-400 mb-1" />
                            <span className="text-[6px] font-mono text-indigo-400 uppercase">Process</span>
                        </div>
                        <div className="flex-1 pt-2">
                            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Auto-Vectoring</p>
                            <div className="flex items-center gap-2 p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[9px] text-indigo-200">
                                <Loader2 size={10} className="animate-spin" /> Synthesizing new defense matrix rule...
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4 items-start group">
                        <div className="w-12 h-12 rounded-2xl bg-[#00ffd1] text-black flex flex-col items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,255,209,0.4)] group-hover:scale-110 transition-transform">
                            <Database size={16} className="mb-1" />
                            <span className="text-[7px] font-mono font-black uppercase">Saved</span>
                        </div>
                        <div className="flex-1 pt-2">
                            <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-widest mb-1 font-black">Memory Expanded</p>
                            <div className="p-3 bg-[#00ffd1]/10 rounded-xl border border-[#00ffd1]/20 text-[10px] text-white/90 italic">
                                "Lazer Doku Kaynağı" argümanı artık tüm modüller tarafından kullanılabilir.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

