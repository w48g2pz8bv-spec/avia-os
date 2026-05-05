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
  Zap,
  Activity,
  Brain
} from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function ReviewsPage() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(92.4);
  const [isRecoveryActive, setIsRecoveryActive] = useState(false);
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

  const [leads, setLeads] = useState<any[]>([
    { name: "Ahmet Yılmaz", source: "Google Maps", distance: "2.4km", signal: "HIGH", intent: "Searching for 'İmplant Fiyatları'", score: 98, status: 'New' },
    { name: "Ecem S.", source: "Instagram Ads", distance: "N/A", signal: "MED", intent: "Interacted with Dental Post", score: 82, status: 'New' },
    { name: "Global Med Center", source: "B2B Directory", distance: "5.1km", signal: "HIGH", intent: "Competitor review drop detected", score: 94, status: 'New' }
  ]);
  const { user, supabase, addActivity, knowledgeBase } = useApp();

  // LOAD LEADS FROM DATABASE
  useEffect(() => {
    const loadLeads = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && !error && data.length > 0) {
            setLeads(data);
        }
    };
    loadLeads();
  }, [user]);

  const handleScanLeads = async () => {
    setIsScanning(true);
    addActivity("Neural Scraper: Scanning regional market nodes...", "system");
    
    setTimeout(async () => {
        const newLead = {
            name: "Dr. Caner Öz",
            source: "LinkedIn / Referral",
            distance: "1.2km",
            signal: "ELITE",
            intent: "Looking for high-end aesthetic dental partnership",
            score: 99,
            status: 'New'
        };
        
        setLeads(prev => [newLead, ...prev]);
        if (user) {
            await supabase.from('leads').insert({ ...newLead, user_id: user.id });
        }
        
        setIsScanning(false);
        addActivity(`High-Value Lead Detected: ${newLead.name}`, "system");
        toast("Market Intelligence: Elite Lead Found", "success");
    }, 3000);
  };

  const draftNeuralOffer = (leadId: number) => {
    const lead = leads[leadId];
    const kbNotes = knowledgeBase.map(k => k.content).join(" ");
    const offer = `AIVA Neural Draft: Sayın ${lead.name}, ${lead.intent} konulu talebinizi sistemimiz yakaladı. Kurumsal hafızamızdaki verilere göre size özel bir çözüm hazırladık. (KB Ref: ${kbNotes.substring(0, 50)}...)`;
    
    toast("Neural Offer Drafted using Knowledge Base", "success");
    addActivity(`Offer Prepared for ${lead.name}`, "system");
    return offer;
  };

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

  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);

  const handleStartCampaign = () => {
    setIsCampaignActive(true);
    setCampaignProgress(0);
    addActivity("Neural Multiplier: Launching batch review sequence for 124 leads", "sync");
    toast("Reputation Multiplier Started", "success");
    
    const interval = setInterval(() => {
        setCampaignProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setIsCampaignActive(false);
                addActivity("Campaign Complete: +42 New Review Drafts Pending Approval", "system");
                toast("Batch Campaign Success", "success");
                return 100;
            }
            return prev + 5;
        });
    }, 500);
  };

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="AI Reputation Manager" 
        statusText={isScanning ? "Scanning Active Platforms..." : "Brand Sentiment Index: Elite"} 
        action={
          <div className="flex items-center gap-4">
             <button 
                onClick={handleStartCampaign}
                disabled={isCampaignActive}
                className="flex items-center gap-2 bg-[#00ffd1] text-black px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,209,0.3)] disabled:opacity-50"
             >
                {isCampaignActive ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {isCampaignActive ? `Syncing ${campaignProgress}%` : 'Launch Multiplier Campaign'}
             </button>
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
                                        className={`w-full ${isRecoveryActive && i > 4 ? 'bg-red-500' : 'bg-[#00ffd1]'} transition-all duration-1000`} 
                                        style={{ height: `${h}%` }} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-right space-y-4 relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Autonomous Status</p>
                        <p className="text-xs font-black text-white uppercase italic">{isRecoveryActive ? 'Active Recovery' : 'Monitoring'}</p>
                    </div>
                    {!isRecoveryActive ? (
                        <button 
                            onClick={handleInitiateRecovery}
                            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                        >
                            Force Neural Recovery
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-red-500 font-mono text-[9px] animate-pulse">
                            <Activity size={12} /> SECURING BRAND ASSETS...
                        </div>
                    )}
                </div>
            </div>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-8 bg-[#00ffd1]/5 border-[#00ffd1]/20 h-full">
                <h3 className="text-[10px] font-mono font-black text-[#00ffd1] tracking-[0.3em] uppercase italic mb-6">Mastery Insight</h3>
                <p className="text-xs text-white/60 leading-relaxed italic">
                    "AIVA son 24 saatte sosyal medyadaki marka algınızı %2.4 yükseltti. Olumsuz sinyaller anında nöral filtreleme ile kontrol altına alınıyor."
                </p>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-white/20 uppercase">Safety Rating</span>
                    <span className="text-sm font-black text-[#00ffd1]">ELITE (99.1)</span>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* REVIEWS INBOX */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-[#00ffd1]" />
                <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Reputation Feed</h2>
                <div className="flex gap-2">
                    {["Empathetic", "Professional", "Strategic", "Contrast", "Hidden Truth"].map(tone => (
                        <button 
                            key={tone}
                            onClick={() => setSelectedResponseTone(tone)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-mono font-black uppercase transition-all ${selectedResponseTone === tone ? 'bg-[#00ffd1] text-black shadow-[0_0_15px_rgba(0,255,209,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            {tone}
                        </button>
                    ))}
                </div>
             </div>
          </div>

          <div className="p-6 bg-[#00ffd1]/5 border border-[#00ffd1]/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} className="text-[#00ffd1]" />
                  <span className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-widest font-black">Narrative Strategy Active</span>
              </div>
              <p className="text-[10px] text-white/40 italic leading-relaxed">
                  {selectedResponseTone === "Contrast" ? "Dünya olduğu gibi ↔ Dünya olabileceği gibi zıtlığını kullanarak güven inşa ediliyor." :
                   selectedResponseTone === "Hidden Truth" ? "İzleyicide 'ben bunu bilmiyordum' hissi yaratarak otorite kuruluyor." :
                   "Standart empati protokolü ile kullanıcı deneyimi normalize ediliyor."}
              </p>
          </div>

          <div className="space-y-4">
            {inbox.map((item) => (
              <div key={item.id} className={`glass-panel p-8 space-y-6 group transition-all duration-500 hover:border-white/20 ${item.sentiment === 'NEGATIVE' ? 'border-red-500/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 text-lg font-black italic text-white/40 group-hover:text-[#00ffd1] transition-all">
                      {item.user[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-3">
                        {item.user}
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-mono ${item.sentiment === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>
                          {item.sentiment}
                        </span>
                      </h4>
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">Via {item.source} • {item.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? 'text-[#00ffd1] fill-[#00ffd1]' : 'text-white/5'} />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed italic border-l-2 border-white/5 pl-6 py-2">
                  "{item.comment}"
                </p>

                <div className="flex items-center gap-4 pt-2">
                  {activeDrafts[item.id] ? (
                    <div className="flex-1 animate-in slide-in-from-left-4 duration-500">
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-[#00ffd1] uppercase tracking-[0.4em] italic">Neural Draft: {selectedResponseTone}</span>
                                <Fingerprint size={14} className="text-white/10" />
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed italic">"{activeDrafts[item.id]}"</p>
                            <div className="flex gap-3 justify-end">
                                <button className="text-[9px] font-mono text-white/20 hover:text-white uppercase tracking-widest">Discard</button>
                                <button 
                                    onClick={() => handleSync(item.id)}
                                    disabled={syncingId === item.id}
                                    className="px-6 py-2 bg-[#00ffd1] text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#00ffd144]"
                                >
                                    {syncingId === item.id ? <Loader2 size={12} className="animate-spin" /> : 'Deploy Sync'}
                                </button>
                            </div>
                        </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => generateDraft(item.id)}
                      disabled={draftingId === item.id}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 text-white/40 px-6 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
                    >
                      {draftingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
                      Craft Neural Response
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEAD ACQUISITION ENGINE */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#00ffd1]" />
                    <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Neural Lead Gen</h2>
                </div>
                <button 
                    onClick={handleScanLeads}
                    disabled={isScanning}
                    className="flex items-center gap-2 bg-[#00ffd1] text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                >
                    {isScanning ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Scan Regional Nodes
                </button>
            </div>

            <div className="glass-panel p-6 bg-black/40 border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,209,0.05)_0%,transparent_50%)]" />
                <div className="space-y-4 relative z-10">
                    {leads.map((lead, i) => (
                        <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00ffd1]/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h5 className="text-sm font-black text-white group-hover:text-[#00ffd1] transition-all">{lead.name}</h5>
                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{lead.source} • {lead.distance}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-[#00ffd1] italic">%{lead.score}</span>
                                    <p className="text-[8px] font-mono text-white/20 uppercase">Neural Fit</p>
                                </div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl mb-4">
                                <p className="text-[10px] text-white/40 italic flex items-center gap-2">
                                    <Activity size={10} className="text-[#00ffd1]" /> {lead.intent}
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    const draft = draftNeuralOffer(i);
                                    alert(draft);
                                }}
                                className="w-full py-3 border border-[#00ffd1]/20 text-[#00ffd1] text-[9px] font-black uppercase tracking-widest hover:bg-[#00ffd1] hover:text-black transition-all rounded-xl"
                            >
                                Dispatch Neural Offer
                            </button>
                        </div>
                    ))}
                    {isScanning && (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-pulse">
                            <div className="w-12 h-12 border-2 border-[#00ffd1] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.4em]">Scanning Market Matrix...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
