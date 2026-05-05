"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
    >
      <div className="flex items-center gap-8 px-8 py-4 glass-panel rounded-full border border-white/10 backdrop-blur-xl">
        <Link href="/" className="text-xl font-black tracking-tighter text-white mr-4">
          AIVA <span className="text-accent italic">OS</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
          <Link href="#zeka" className="hover:text-accent transition-colors">Zekâ</Link>
          <Link href="#mimari" className="hover:text-accent transition-colors">Mimari</Link>
          <Link href="#guvenlik" className="hover:text-accent transition-colors">Güvenlik</Link>
        </div>

        <Link 
          href="/dashboard" 
          className="ml-4 px-6 py-2 bg-accent text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all"
        >
          Sistemi Başlat
        </Link>
      </div>
    </motion.nav>
  );
}
