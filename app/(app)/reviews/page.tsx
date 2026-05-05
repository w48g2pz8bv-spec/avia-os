"use client";
import { useState, useEffect } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { 
  MessageSquare, 
  RefreshCcw, 
  Star, 
  Calendar, 
  Globe, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  Fingerprint,
  Smile,
  Meh,
  Frown,
  Share2,
  Loader2,
  Send,
  Zap
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function ReviewsPage() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(92.4);
  const [selectedResponseTone, setSelectedResponseTone] = useState("Empathetic");
  const [activeDrafts, setActiveDrafts] = useState<Record<number, string>>({});
  const [draftingId, setDraftingId] = useState<number | null>(null);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  const inbox = [
    { 
        id: 1,
        user: "Melih Akkali", 
        source: "Google Maps",
        time: "14 mins ago",
        rating: 5, 
        comment: "Klinikteki ilgi muazzamdı. İmplant süreci beklediğimden çok daha hızlı ve ağrısız geçti. Hijyen standartları en üst seviyede.", 
        sentiment: "POSITIVE", 
        safetyScore: 99,
        baseDrafts: {
            Empathetic: "Melih Bey, nazik geri bildiriminiz için teşekkür ederiz! İmplant sürecinizin konforlu geçmesi bizim önceliğimizdi.",
            Professional: "Sayın Akkali, olumlu geri bildiriminiz tarafımızca memnuniyetle karşılanmıştır. Hijyen ve hasta konforu temel vizyonumuzdur.",
            Strategic: "İlginiz için teşekkürler Melih Bey. Bir sonraki randevunuzda ağız sağlığı setimizi size hediye etmek isteriz."
        }
    },
    { 
        id: 2,
        user: "Selin K.", 
        source: "Zocdoc",
        time: "5 hours ago",
        rating: 1, 
        comment: "Doktor çok aceleciydi, sorularıma tam cevap alamadım. İletişim konusunda hayal kırıklığı yaşadım.", 
        sentiment: "NEGATIVE", 
        safetyScore: 94,
        baseDrafts: {
            Empathetic: "Selin Hanım, yaşadığınız deneyim için üzgünüz. Hasta memnuniyeti bizim için kritiktir; durumu detaylı görüşmek için sizi arayabilir miyiz?",
            Professional: "Geri bildiriminiz için teşekkürler. Şikayetiniz başhekimliğe iletilmiş olup süreç incelenmektedir.",
            Strategic: "Tesisimizdeki yoğunluk sebebiyle yaşanan gecikmeler için anlayışınızı rica ederiz."
        }
    }
  ];

  const [isRecoveryActive, setIsRecoveryActive] = useState(false);
  const { addActivity } = useApp();

  const handleGlobalRescan = () => {
    setIsScanning(true);
    toast("Scanning 12 Social Nodes...", "info");
    setTimeout(() => {
        setIsScanning(false);
        setSentimentScore(prev => prev + (Math.random() * 2 - 1));
        toast("Platform-wide Sync Complete", "success");
    }, 2500);
  };

  const handleInitiateRecovery = () => {
    setIsRecoveryActive(true);
    addActivity("Crisis Management: Autonomous Recovery Initiated", "system");
    toast("AIVA is taking control of negative sentiment...", "info");
    
    setTimeout(() => {
        addActivity("Neural Recovery: Drafting empathetic response for Selin K.", "system");
        generateDraft(2);
    }, 1500);
  };

  const generateDraft = (reviewId: number) => {
    setDraftingId(reviewId);
    setTimeout(() => {
        const review = inbox.find(r => r.id === reviewId);
        if (review) {
            setActiveDrafts(prev => ({ ...prev, [reviewId]: (review.baseDrafts as any)[selectedResponseTone] }));
        }
        setDraftingId(null);
        toast("Neural Draft Prepared", "success");
    }, 1500);
  };

  const handleSync = (reviewId: number) => {
    setSyncingId(reviewId);
    toast(`Syncing with ${inbox.find(r => r.id === reviewId)?.source}...`, "info");
    setTimeout(() => {
        setSyncingId(null);
        addActivity(`Review Resolved: ${inbox.find(r => r.id === reviewId)?.user}`, "sync");
        toast("Review Response Deployed Successfully", "success");
        if (reviewId === 2) setIsRecoveryActive(false);
    }, 3000);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="AI Reputation Manager" 
        statusText={isScanning ? "Scanning Active Platforms..." : "Brand Sentiment Index: Elite"} 
        action={
          <div className="flex items-center gap-4">
             <button 
                onClick={handleGlobalRescan}
                disabled={isScanning}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/40 px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-50"
             >
                {isScanning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />}
                Re-Scan All Platforms
             </button>
          </div>
        } 
      />

      {/* NEURAL RECOVERY DASHBOARD */}
      <div className="grid grid-cols-12 gap-8 mb-8">
         <div className="col-span-12 lg:col-span-8">
            <div className={`glass-panel p-8 flex items-center justify-between relative overflow-hidden h-full transition-all duration-1000 ${isRecoveryActive ? 'border-red-500/40 bg-red-500/5' : ''}`}>
                <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                    <TrendingUp size={140} />
                </div>
                {isRecoveryActive && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)] animate-pulse" />
                )}
                
                <div className="space-y-4 relative z-10">
                    <h3 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Sentiment Telemetry</h3>
                    <div className="flex items-end gap-12">
                        <div>
                            <p className={`text-4xl font-black italic tracking-tighter transition-all ${isRecoveryActive ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                {sentimentScore.toFixed(1)}%
                            </p>
                            <p className={`text-[8px] font-mono uppercase tracking-widest flex items-center gap-2 mt-1 ${isRecoveryActive ? 'text-red-400' : 'text-[#00ffd1]'}`}>
                                {isRecoveryActive ? <AlertCircle size={10} /> : <TrendingUp size={10} />} 
                                {isRecoveryActive ? 'Negative Spike Detected' : 'Brand Authority High'}
                            </p>
                        </div>
                        <div className="flex gap-2 pb-2">
                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                <div key={i} className="w-1.5 h-12 bg-white/5 rounded-full flex items-end overflow-hidden">
                                    <div 
                                        className={`w-full rounded-full transition-all duration-1000 ${isRecoveryActive ? 'bg-red-500' : 'bg-[#00ffd1]'} ${isScanning ? 'animate-bounce' : ''}`} 
                                        style={{ height: `${isScanning ? Math.random() * 100 : h}%` }} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="h-20 w-px bg-white/5 hidden lg:block" />
                <div className="space-y-6 relative z-10 text-right">
                    <div className="flex gap-6 justify-end">
                        <div className="text-center">
                            <Smile size={16} className={`${isRecoveryActive ? 'text-white/20' : 'text-[#00ffd1]'} mx-auto mb-2 transition-all`} />
                            <p className="text-[10px] font-black text-white">84%</p>
                        </div>
                        <div className="text-center opacity-40">
                            <Meh size={16} className="text-white mx-auto mb-2" />
                            <p className="text-[10px] font-black text-white">12%</p>
                        </div>
                        <div className={`text-center ${isRecoveryActive ? 'animate-bounce' : 'opacity-40'}`}>
                            <Frown size={16} className="text-red-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-white">4%</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         <div className="col-span-12 lg:col-span-4">
            <div className={`glass-panel p-8 h-full relative overflow-hidden transition-all duration-700 ${isRecoveryActive ? 'bg-red-500/20 border-red-500/40' : 'bg-[#00ffd1]/5 border-[#00ffd1]/20'}`}>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <Zap size={16} className={isRecoveryActive ? 'text-white' : 'text-[#00ffd1]'} />
                    <h3 className={`text-[10px] font-mono font-black tracking-[0.3em] uppercase italic ${isRecoveryActive ? 'text-white' : 'text-[#00ffd1]'}`}>
                        {isRecoveryActive ? 'Neural Recovery Active' : 'Strategic Monitor'}
                    </h3>
                </div>
                <p className="text-[10px] font-mono text-white/60 leading-relaxed uppercase relative z-10 mb-6">
                    {isRecoveryActive 
                        ? 'AIVA is currently orchestrating a sentiment correction strategy for negative mentions.' 
                        : 'Currently tracking 2,142 brand mentions. AI-Drafting is prioritized for unresolved feedback.'}
                </p>
                {!isRecoveryActive && (
                    <button 
                        onClick={handleInitiateRecovery}
                        className="w-full py-3 bg-red-500/20 border border-red-500/40 text-red-500 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                        Initiate Neural Recovery
                    </button>
                )}
            </div>
         </div>
      </div>
      
      <div className="grid gap-8">
        {inbox.map((item) => (
          <div key={item.id} className="glass-panel p-10 flex flex-col lg:flex-row gap-12 hover:border-[#00ffd1]/20 transition-all group relative overflow-hidden bg-black/40">
            {/* REVIEW SIDE */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <span className="text-xl font-black text-white tracking-tight uppercase italic">{item.user}</span>
                    <div className="flex items-center gap-3 text-[8px] font-mono text-white/20 uppercase tracking-widest">
                        <Globe size={10} />
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                    </div>
                </div>
                <div className={`text-[8px] font-black px-3 py-1 rounded border ${
                    item.sentiment === 'POSITIVE' ? 'text-[#00ffd1] border-[#00ffd1]/20 bg-[#00ffd1]/5' : 
                    'text-red-500 border-red-500/20 bg-red-500/5'
                }`}>
                    {item.sentiment}
                </div>
              </div>
              
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={12} fill={idx < item.rating ? "#00ffd1" : "transparent"} className={idx < item.rating ? "text-[#00ffd1]" : "text-white/10"} />
                ))}
              </div>

              <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-[#00ffd1]/20 pl-6 py-2 group-hover:border-[#00ffd1]/60 transition-all bg-white/[0.02] rounded-r-2xl">
                "{item.comment}"
              </p>
            </div>

            {/* DRAFTING SIDE (FUNCTIONAL) */}
            <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 relative">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#00ffd1]/10 rounded-lg text-[#00ffd1]"><Zap size={14} /></div>
                    <div className="flex gap-2">
                        {["Empathetic", "Professional", "Strategic"].map(tone => (
                            <button 
                                key={tone}
                                onClick={() => setSelectedResponseTone(tone)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest transition-all ${selectedResponseTone === tone ? 'bg-[#00ffd1] text-black' : 'bg-white/5 text-white/20 hover:text-white'}`}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Safety Index</p>
                    <p className="text-xs font-black text-[#00ffd1] tracking-tighter">{item.safetyScore}%</p>
                </div>
              </div>
              
              <div className="relative mb-8 min-h-[140px]">
                {!activeDrafts[item.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 border border-white/5 border-dashed rounded-3xl">
                        <button 
                            onClick={() => generateDraft(item.id)}
                            disabled={draftingId === item.id}
                            className="flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-widest text-white/40 hover:text-[#00ffd1] transition-all"
                        >
                            {draftingId === item.id ? <><Loader2 size={14} className="animate-spin" /> Analyzing Intent...</> : <><RefreshCcw size={14} /> Generate Neural Reply</>}
                        </button>
                    </div>
                ) : (
                    <textarea 
                        value={activeDrafts[item.id]}
                        onChange={(e) => setActiveDrafts({ ...activeDrafts, [item.id]: e.target.value })}
                        className="w-full h-32 bg-black/40 border border-[#00ffd1]/10 rounded-3xl p-6 text-sm text-white/80 leading-relaxed font-mono focus:border-[#00ffd1]/40 outline-none transition-all resize-none"
                    />
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                    onClick={() => handleSync(item.id)}
                    disabled={!activeDrafts[item.id] || syncingId === item.id}
                    className="flex-1 bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#00ffd1] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] disabled:opacity-20 flex items-center justify-center gap-3"
                >
                    {syncingId === item.id ? <><Loader2 size={16} className="animate-spin" /> Syncing with {item.source}...</> : <><Send size={16} fill="black" /> Approve & Deploy</>}
                </button>
                <button 
                    onClick={() => {
                        const newDrafts = { ...activeDrafts };
                        delete newDrafts[item.id];
                        setActiveDrafts(newDrafts);
                    }}
                    className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-red-500 hover:border-red-500/20 transition-all"
                >
                    <RefreshCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


