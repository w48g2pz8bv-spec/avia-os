"use client";
import { motion } from "framer-motion";

export default function Navbar({ onOpenModal }) {
  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-8">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-10 py-5 flex justify-between items-center backdrop-blur-xl">
        {/* Efsanevi AIVA Logosu */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="relative h-10 w-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/20 rounded-lg blur-md group-hover:blur-xl transition-all" />
            <div className="relative h-full w-full border-2 border-accent rounded-lg flex items-center justify-center font-black text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-500">
              A
            </div>
            {/* Nabız Efekti */}
            <div className="absolute -inset-1 border border-accent/30 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-black tracking-tighter text-2xl text-white leading-none">AIVA</span>
            <span className="text-[8px] font-mono text-accent uppercase tracking-[0.4em] opacity-50">Neural Core</span>
          </div>
        </motion.div>

        <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          {["Sistem", "Zeka", "Fiyatlandırma"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent hover:tracking-[0.5em] transition-all duration-300">
              {item}
            </a>
          ))}
        </div>

        <button 
          onClick={onOpenModal}
          className="group relative px-8 py-3 overflow-hidden rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all"
        >
          <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
          <span className="relative z-10 group-hover:text-bg transition-colors">Giriş Yap</span>
        </button>
      </div>
    </nav>
  );
}
