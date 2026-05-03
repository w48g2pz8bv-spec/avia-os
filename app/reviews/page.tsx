"use client";
import { motion } from "framer-motion";
import { Star, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-syne font-black tracking-tighter italic uppercase">Reputation <span className="text-accent">Architect</span></h1>
          <p className="text-white/20 font-mono text-[10px] mt-2 tracking-[0.4em]">Google_Business_v2.0 // Auto_Sentiment</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-2xl font-syne font-black text-white">4.9</div>
              <div className="flex gap-0.5 text-accent"><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/></div>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel rounded-[3.5rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Incoming_Feedback_Stream</span>
            <div className="flex items-center gap-2 text-accent text-[10px] font-mono uppercase"><Sparkles className="h-3 w-3" /> Auto_Drafting_Active</div>
          </div>
          <div className="p-8 space-y-8">
            {[ 
              { u: "Melih Hakkali", t: "Sistem muazzam çalışıyor, teşekkürler!", s: "POSITIVE" },
              { u: "Caner Y.", t: "Hız gerçekten inanılmaz.", s: "POSITIVE" }
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-bold font-syne">{r.u[0]}</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white/80">{r.u}</h4>
                    <p className="text-[10px] text-white/40 italic">"{r.t}"</p>
                  </div>
                </div>
                <div className="ml-14 p-5 rounded-2xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2 text-[8px] font-mono text-accent uppercase tracking-widest"><MessageSquare className="h-3 w-3" /> AI_Draft_Response</div>
                  <p className="text-[10px] text-accent/80 font-mono leading-relaxed">Değerli yorumunuz için teşekkür ederiz {r.u}! AIVA OS ile işinizi büyütmeye devam edin. Başarılar dileriz.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-panel p-8 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center py-12">
              <ShieldCheck className="h-12 w-12 text-accent mb-4 opacity-40 shadow-[0_0_30px_#00ffd1]" />
              <h3 className="text-xl font-syne font-black text-white">Trust Engine</h3>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mt-2">Filter_Offensive_Content</p>
           </div>
           <div className="glass-panel p-8 rounded-[3rem] border border-white/5">
              <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4">Sentiment_Metrics</h3>
              <div className="h-32 flex items-end gap-1">
                 {[40, 70, 90, 60, 80, 100].map((h, i) => <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-accent/20 rounded-t-sm" />)}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
