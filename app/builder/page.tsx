"use client";
import { motion } from "framer-motion";
import { Globe, Layout, Palette, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BuilderPage() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#00ffd1] hover:text-black transition-all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-syne font-black text-white">Site Architect</h2>
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Build_Your_Presence</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-[#00ffd1] text-black font-black text-[10px] uppercase rounded-full">Publish_Site</button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="text-[10px] font-mono text-[#00ffd1] uppercase mb-6 tracking-[0.3em]">// Sector_Engine</h3>
            <div className="grid grid-cols-1 gap-3">
              {["Dental Clinic", "Law Firm", "Real Estate", "E-Commerce"].map(s => (
                <div key={s} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00ffd1]/40 transition-all cursor-pointer flex justify-between items-center group">
                  <span className="text-xs font-mono text-white/40 group-hover:text-white">{s}</span>
                  <Layout className="h-3 w-3 text-white/10 group-hover:text-[#00ffd1]" />
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-accent/5 to-transparent">
             <Palette className="h-6 w-6 text-accent mb-4" />
             <p className="text-[10px] font-mono text-white/40 uppercase leading-relaxed">AI will generate a custom color palette based on your logo.</p>
          </div>
        </div>
        
        <div className="lg:col-span-8 glass-panel rounded-[3.5rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center min-h-[500px] group">
          <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center group-hover:border-[#00ffd1]/40 transition-all">
            <Globe className="h-8 w-8 text-white/5 group-hover:text-[#00ffd1]/40" />
          </div>
          <span className="mt-6 text-[10px] font-mono text-white/10 uppercase tracking-[0.8em]">Live_Preview_Sync</span>
        </div>
      </div>
    </div>
  );
}
