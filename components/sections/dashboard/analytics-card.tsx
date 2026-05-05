"use client";
import { TrendingUp } from "lucide-react";

type AnalyticsCardProps = {
  title: string;
  value: string;
};

export default function AnalyticsCard({ title, value }: AnalyticsCardProps) {
  return (
    <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-4 group hover:border-[#00ffd1]/20 transition-all">
      <div className="flex justify-between items-center text-white/20">
        <p className="text-[10px] font-mono font-black uppercase tracking-[0.4em] italic">{title}</p>
        <TrendingUp size={14} className="group-hover:text-[#00ffd1] transition-colors" />
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black italic text-white/90">{value}</h3>
        <span className="text-[10px] font-mono text-[#00ffd1]">+12.4%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#00ffd1]/20 w-[65%] group-hover:bg-[#00ffd1]/40 transition-all" />
      </div>
    </div>
  );
}
