"use client";
import { motion } from "framer-motion";

export default function SystemStats() {
  return (
    <div className="fixed bottom-10 left-10 z-[100] hidden xl:block font-mono text-[8px] text-white/20 uppercase tracking-[0.3em] space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-1 w-1 rounded-full bg-accent animate-ping" />
        <span>CORE_TEMP: 32°C</span>
      </div>
      <div>UPTIME: 99.9%</div>
      <div>REGION: TR-EST</div>
      <div className="h-[1px] w-20 bg-white/10 my-4" />
      <div className="text-accent/40">NEURAL DISTRIBUTION PROTOCOL_V4</div>
    </div>
  );
}
