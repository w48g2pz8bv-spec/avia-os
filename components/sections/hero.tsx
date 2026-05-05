"use client";
import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <div className="relative z-10 text-center px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-12 backdrop-blur-md"
        >
          <Terminal size={12} className="text-accent" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.3em] font-black">
            System Protocol: <span className="text-accent italic">v2.0.4 Online</span>
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-syne font-black mb-8 leading-[0.9] tracking-tighter"
        >
          AI İLE İŞİNİ <br /> 
          <span className="shimmer-text">BÜYÜT. YÖNET.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl mx-auto text-white/40 text-sm md:text-base mb-16 uppercase tracking-[0.2em] font-medium leading-relaxed"
        >
          Geleneksel otomasyonun ötesinde, işletmenizin <br />
          yeni dijital sinir sistemi.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/dashboard" className="group relative inline-flex items-center gap-6 bg-accent text-black px-14 py-7 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_20px_60px_rgba(0,255,209,0.4)] hover:shadow-[0_25px_80px_rgba(0,255,209,0.6)] hover:scale-105 transition-all">
            Kontrol Merkezine Gir 
            <div className="p-2 bg-black/10 rounded-full group-hover:translate-x-2 transition-transform">
              <ArrowRight size={18} />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
