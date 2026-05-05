"use client";
import { 
  LayoutDashboard, 
  Radio, 
  Workflow, 
  MessageSquare, 
  Repeat, 
  Box, 
  BarChart3, 
  Settings,
  Activity,
  Cpu,
  Zap,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/app/(app)/app-context";

const menuItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: Radio, label: "AI Agents", href: "/vapi", status: "3 LIVE" },
  { icon: Workflow, label: "Automations", href: "/automations" },
  { icon: MessageSquare, label: "Reputation", href: "/reviews", status: "NEW" },
  { icon: Repeat, label: "Deployment Hub", href: "/sync", status: "SYNCING" },
  { icon: Box, label: "Neural Architect", href: "/builder" },
  { icon: BookOpen, label: "Knowledge Base", href: "/knowledge" },
  { icon: BarChart3, label: "Intelligence", href: "/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activityLogs, efficiencyStats, deploymentQueue } = useApp();

  const totalEvents = activityLogs.length;
  const loopScore = Math.min(100, 72 + Math.min(28, totalEvents * 2));

  return (
    <aside className="w-[260px] h-screen sticky top-0 bg-[#050506] border-r border-white/5 flex flex-col p-6 overflow-hidden z-[100]">
      {/* Brand */}
      <div className="mb-10 px-2 flex justify-between items-start">
        <div className="space-y-1">
            <h2 className="text-xl font-syne font-black tracking-tighter text-white flex items-center gap-2">
                AIVA<span className="text-white/20 uppercase">OS</span>
            </h2>
            <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-[#00ffd1] animate-pulse" />
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Neural_Link_Stable</span>
            </div>
        </div>
        <Cpu size={14} className="text-white/5" />
      </div>

      {/* Golden Loop Score Mini-Widget */}
      <div className="mb-6 px-2 py-4 bg-[#00ffd1]/5 border border-[#00ffd1]/10 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] font-mono text-[#00ffd1] uppercase tracking-widest font-black">Golden Loop</span>
          <span className="text-[10px] font-black text-[#00ffd1]">{loopScore}%</span>
        </div>
        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#00ffd1] rounded-full shadow-[0_0_8px_#00ffd1]"
            initial={{ width: '72%' }}
            animate={{ width: `${loopScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[7px] font-mono text-white/10 uppercase">{totalEvents} events</span>
          {deploymentQueue.length > 0 && (
            <span className="text-[7px] font-mono text-amber-500 uppercase font-black">{deploymentQueue.length} in queue</span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                ? "bg-white/[0.04] text-white border border-white/5" 
                : "text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={`${isActive ? "text-[#00ffd1]" : "group-hover:text-white/80 transition-colors"}`} />
                <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
              </div>
              
              {item.status && (
                <span className={`text-[7px] font-mono font-black px-1.5 py-0.5 rounded border border-white/5 ${
                    item.status === '3 LIVE' ? 'bg-[#00ffd1]/10 text-[#00ffd1] border-[#00ffd1]/10' :
                    item.status === 'NEW' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-white/5 text-white/20'
                }`}>
                    {item.status}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Live Stats */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest italic">Neural_Pulse</span>
                <Activity size={10} className="text-[#00ffd1] animate-pulse" />
            </div>
            <div className="flex gap-1 h-4 items-end">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ height: [4, Math.random() * 14 + 4, 4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                        className="flex-1 bg-[#00ffd1]/20 rounded-full"
                    />
                ))}
            </div>
            <div className="flex justify-between text-[7px] font-mono text-white/10 uppercase">
              <span>Success: {efficiencyStats.successRate}%</span>
              <span>Saved: {efficiencyStats.hoursSaved}h</span>
            </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 text-white/20 hover:text-white/60 transition-colors cursor-pointer group">
          <Settings size={14} className="group-hover:rotate-45 transition-transform" />
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase">System Settings</span>
        </div>
      </div>
    </aside>
  );
}
