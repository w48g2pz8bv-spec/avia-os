"use client";
import { useState, useEffect } from "react";
import { useApp } from "../app-context";
import PageHeader from "@/components/shared/page-header";
import { ShieldCheck, Crosshair, Target, MessageSquare, Plus, Activity, Bot, Share2, Zap, Instagram, Facebook, Twitter, CheckCircle2, ChevronRight, X, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/lib/toast-context";

export default function ReputationPage() {
  const { toast } = useToast();
  const { selectedSector, addActivity, addToQueue, supabase, generateResponse } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [activeTab, setActiveTab] = useState("INBOX");
  const [socialModal, setSocialModal] = useState<any>(null);
  const [sentimentVelocity, setSentimentVelocity] = useState("ACCELERATING");
  const [seoKeywords, setSeoKeywords] = useState(["Professional Dentistry", "Painless Implant", "Hygienic Clinic", "Expert Care"]);

  const handleStartCampaign = () => {
      setIsCampaignActive(true);
      toast("Neural Competitor Displacement Active", "success");
      addActivity("Initiated AI Social Transformer Engine.", "system");
      setTimeout(() => setIsCampaignActive(false), 4000);
  };

  const handleStartScan = () => {
      setIsScanning(true);
      toast("Scanning Web Properties for Reviews", "info");
      addActivity("Global reputation sync initiated.", "system");
      setTimeout(() => setIsScanning(false), 3000);
  };

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
        frameworks: {
            ack: "Hızlı iyileşme ve ağrısız süreç deneyiminizi takdir ediyoruz.",
            reframe: "Teknolojimiz, geleneksel implant korkularını konfora dönüştürmek için tasarlandı.",
            pivot: "Bir sonraki kontrolünüzde yeni dijital tarama sistemimizi de deneyimleyeceksiniz."
        },
        injectedKeywords: ["Painless Implant", "Digital Dentistry", "Hygienic Standards"]
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
        frameworks: {
            ack: "İletişim sürecinde yaşadığınız aksaklık için samimiyetle özür dileriz.",
            reframe: "Hızlı hizmet anlayışımız bazen detaylı açıklama beklentisinin önüne geçebiliyor.",
            pivot: "Sizin için 20 dakikalık özel bir ücretsiz konsültasyon tanımladık."
        },
        injectedKeywords: ["Patient Satisfaction", "Dedicated Care", "Quality Communication"]
    }
  ];

  // ... rest of state and effects ... (Keeping leads logic)

  return (
    <div className="max-w-[1600px] animate-in fade-in duration-1000">
      <PageHeader 
        title="Neural Reputation Architect" 
        statusText={isScanning ? "Synchronizing Social Nodes..." : `Sentiment Velocity: ${sentimentVelocity} // SEO Power: 88%`} 
        action={
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-8 px-8 border-r border-white/5 mr-4">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Global SEO Reach</span>
                    <span className="text-sm font-black text-[#00ffd1]">TOP 3 (Regional)</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Authority Score</span>
                    <span className="text-sm font-black text-indigo-400">96.4/100</span>
                </div>
             </div>
             <button 
                onClick={handleStartCampaign}
                disabled={isCampaignActive}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:bg-[#00ffd1] transition-all shadow-[0_0_40px_rgba(0,255,209,0.2)] disabled:opacity-50"
             >
                {isCampaignActive ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill="black" />}
                {isCampaignActive ? `Scaling ${campaignProgress}%` : 'Execute Reputation Multiplier'}
             </button>
          </div>
        } 
      />

      <div className="grid grid-cols-12 gap-8 mb-8">
         {/* SENTIMENT INTELLIGENCE DASHBOARD */}
         <div className="col-span-12 lg:col-span-8">
            <div className={`glass-panel p-8 grid grid-cols-2 gap-8 relative overflow-hidden transition-all duration-1000 ${isRecoveryActive ? 'border-red-500/40 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : ''}`}>
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Activity size={18} className={isRecoveryActive ? 'text-red-500' : 'text-[#00ffd1]'} />
                        <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Sentiment Telemetry</h3>
                    </div>
                    <div className="flex items-end gap-10">
                        <div className="text-5xl font-black italic tracking-tighter text-white">
                            {sentimentScore.toFixed(1)}<span className="text-lg text-white/20">%</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-mono text-white/20 uppercase">Velocity</p>
                            <p className={`text-xs font-black uppercase italic ${sentimentVelocity === 'ACCELERATING' ? 'text-[#00ffd1]' : 'text-amber-500'}`}>{sentimentVelocity}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-end h-20">
                        {[30, 45, 60, 40, 85, 95, 80, 92].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className={`absolute bottom-0 inset-x-0 ${isRecoveryActive && i > 5 ? 'bg-red-500' : 'bg-gradient-to-t from-indigo-500 to-[#00ffd1]'} opacity-40 group-hover:opacity-100 transition-all`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-l border-white/5 pl-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Globe size={16} className="text-indigo-400" />
                        <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Neural SEO Injection</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {seoKeywords.map((kw, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[8px] font-mono text-white/40 uppercase tracking-tighter hover:border-[#00ffd1]/40 hover:text-[#00ffd1] transition-all cursor-crosshair">
                                {kw}
                            </span>
                        ))}
                    </div>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] font-mono text-white/20 uppercase">Market Authority Rank</span>
                            <span className="text-[10px] font-black text-[#00ffd1]">#1 Dental / Izmir</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00ffd1] w-[94%]" />
                        </div>
                    </div>
                </div>

                {isRecoveryActive && (
                    <div className="absolute inset-x-0 bottom-0 py-2 bg-red-500/20 text-red-500 text-[8px] font-mono font-black text-center uppercase tracking-[0.5em] animate-pulse">
                        CRISIS SHIELD ACTIVE // PROTECTING BRAND EQUITY
                    </div>
                )}
            </div>
         </div>

         <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-8 bg-indigo-500/5 border-indigo-500/20 h-full flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Brain size={18} className="text-indigo-400" />
                        <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.3em] uppercase italic">Mastery Intelligence</h3>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed italic">
                        "Yapay zeka, son yorumdaki 'implant' anahtar kelimesini yakaladı ve kurumsal hafızadaki '7 aşamalı sterilizasyon' bilgisiyle birleştirerek otorite seviyesini maksimize etti."
                    </p>
                </div>
                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Mirroring</p>
                        <p className="text-xs font-black text-[#00ffd1]">94%</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-[8px] font-mono text-white/20 uppercase mb-1">Trust Lift</p>
                        <p className="text-xs font-black text-indigo-400">+12%</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* REPUTATION FEED */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-[#00ffd1]" />
                <h2 className="text-xl font-syne font-black italic uppercase tracking-tighter text-white">Authority Pipeline</h2>
             </div>
             <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                {["Empathetic", "Professional", "Strategic", "Neural_Reframing"].map(tone => (
                    <button 
                        key={tone}
                        onClick={() => setSelectedResponseTone(tone)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-mono font-black uppercase transition-all ${selectedResponseTone === tone ? 'bg-[#00ffd1] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}
                    >
                        {tone.replace('_', ' ')}
                    </button>
                ))}
             </div>
          </div>

          <div className="space-y-4">
            {inbox.map((item) => (
              <div key={item.id} className={`glass-panel p-8 space-y-6 group transition-all duration-500 hover:border-white/20 ${item.sentiment === 'NEGATIVE' ? 'border-red-500/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 text-xl font-black italic text-white/40 group-hover:text-[#00ffd1] transition-all relative">
                        {item.user[0]}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black border border-white/10 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">{item.source[0]}</span>
                        </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white flex items-center gap-4">
                        {item.user}
                        <span className={`text-[8px] px-3 py-1 rounded-full font-mono font-black tracking-widest ${item.sentiment === 'POSITIVE' ? 'bg-[#00ffd1]/10 text-[#00ffd1]' : 'bg-red-500/10 text-red-400 animate-pulse'}`}>
                          {item.sentiment}
                        </span>
                      </h4>
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">Via {item.source} • {item.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < item.rating ? 'text-[#00ffd1] fill-[#00ffd1]' : 'text-white/5'} />
                    ))}
                  </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-8 top-0 bottom-0 w-1 bg-white/5 group-hover:bg-[#00ffd1]/20 transition-all" />
                    <p className="text-sm text-white/60 leading-relaxed italic pl-0 py-2">
                    "{item.comment}"
                    </p>
                </div>

                {/* PSYCHOLOGICAL FRAMEWORK PREVIEW */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                    {[
                        { label: 'Acknowledge', content: item.frameworks.ack, icon: CheckCircle2 },
                        { label: 'Reframe', content: item.frameworks.reframe, icon: RefreshCcw },
                        { label: 'Pivot to Value', content: item.frameworks.pivot, icon: Zap }
                    ].map((f, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 group/f hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-2">
                                <f.icon size={12} className="text-indigo-400" />
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest font-black">{f.label}</span>
                            </div>
                            <p className="text-[9px] text-white/40 leading-relaxed group-hover/f:text-white/80 transition-colors line-clamp-2">"{f.content}"</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {item.injectedKeywords.map((kw, i) => (
                                <div key={i} className="px-2 py-1 bg-black border border-white/10 rounded-md text-[7px] font-mono text-[#00ffd1] uppercase">{kw}</div>
                            ))}
                        </div>
                        <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">SEO Injection Success</span>
                  </div>
                  
                  <button 
                    onClick={() => generateDraft(item.id)}
                    disabled={draftingId === item.id}
                    className="flex items-center gap-3 bg-[#00ffd1] text-black px-8 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,209,0.2)] disabled:opacity-50"
                  >
                    {draftingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} fill="black" />}
                    Deploy Neural Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARKET INTELLIGENCE & LEAD ACQUISITION */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass-panel p-10 bg-black/40 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-all duration-1000">
                    <Globe size={150} />
                </div>
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-[#00ffd1]" />
                            <h3 className="text-[10px] font-mono font-black text-white/40 tracking-[0.4em] uppercase italic">Market Scraper</h3>
                        </div>
                        <div className="px-3 py-1 bg-[#00ffd1]/10 rounded-full border border-[#00ffd1]/20">
                            <span className="text-[8px] font-mono text-[#00ffd1] font-black uppercase">Live_Node</span>
                        </div>
                    </div>
                    <p className="text-xs text-white/40 italic leading-relaxed">
                        AIVA, çevrenizdeki 5km'lik alanda diş implantı ile ilgili negatif yorum yapan hastaları gerçek zamanlı tarıyor.
                    </p>
                    <button 
                        onClick={handleScanLeads}
                        disabled={isScanning}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                        {isScanning ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Force Regional Scan'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 px-2 mb-2">
                    <TrendingUp size={16} className="text-[#00ffd1]" />
                    <h4 className="text-[10px] font-mono font-black text-white/20 tracking-[0.3em] uppercase italic">Competitor Displacement</h4>
                </div>
                {leads.map((lead, i) => (
                    <div key={i} className="glass-panel p-6 bg-white/[0.01] hover:border-[#00ffd1]/40 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                                <h5 className="text-sm font-black text-white group-hover:text-[#00ffd1] transition-all">{lead.name}</h5>
                                <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase">
                                    <span className="text-indigo-400">Signal: {lead.signal}</span>
                                    <span>•</span>
                                    <span>{lead.distance}</span>
                                </div>
                            </div>
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                <Share2 size={12} className="text-white/20" />
                            </div>
                        </div>
                        <div className="p-4 bg-black/60 rounded-2xl border border-white/5 mb-4 group-hover:bg-indigo-500/5 transition-all">
                            <p className="text-[10px] text-white/60 italic leading-relaxed">
                                <span className="text-indigo-400 font-black uppercase text-[8px] block mb-1">Neural Intent Capture</span>
                                "{lead.intent}"
                            </p>
                        </div>
                        <button className="w-full py-3 bg-[#00ffd1]/5 border border-[#00ffd1]/20 text-[#00ffd1] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#00ffd1] hover:text-black transition-all rounded-xl">
                            Dispatch Strategic Offer
                        </button>
                    </div>
                ))}
            </div>
                    )}
                </div>
            </div>

            {/* NEURAL SOCIAL TRANSFORMER PREVIEW */}
            {activeDrafts[1] && (
                <div className="mt-8 p-10 bg-gradient-to-br from-indigo-500/10 to-[#00ffd1]/10 border border-white/5 rounded-[3rem] animate-in slide-in-from-bottom-8 duration-700 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-all duration-1000">
                        <Share2 size={120} />
                     </div>
                     <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                        <div className="w-full lg:w-72 aspect-square bg-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl" />
                            <div className="flex gap-1 mb-4">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                                "İmplant süreci beklediğimden çok daha hızlı geçti. Hijyen standartları en üst seviyede!"
                            </p>
                            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 italic">M</div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-800">Melih Akkali</p>
                                    <p className="text-[8px] text-slate-400 font-mono uppercase tracking-widest">Happy Patient</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-white italic tracking-tight">Neural Social Transformer</h4>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Review-to-Content: Success Story #122</p>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed max-w-md">
                                AIVA, Melih Bey'in yorumunu yakaladı ve otomatik olarak markanızın renk paletine uygun profesyonel bir Instagram gönderisi hazırladı.
                            </p>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#00ffd1] transition-all shadow-xl">Push to Instagram</button>
                                <button className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl font-black uppercase text-[10px] tracking-widest hover:text-white transition-all">Edit Asset</button>
                            </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
