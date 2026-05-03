"use client";
import * as Icons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const menu = [
    { icon: Icons.LayoutDashboard, label: "DASHBOARD", href: "/dashboard" },
    { icon: Icons.Mic, label: "AI AGENTS", href: "/vapi" },
    { icon: Icons.Zap, label: "AUTOMATIONS", href: "/automations" },
    { icon: Icons.MessageSquare, label: "REVIEWS", href: "/reviews" },
    { icon: Icons.Share2, label: "CONTENT", href: "/sync" },
    { icon: Icons.Globe, label: "WEBSITES", href: "/builder" },
    { icon: Icons.BarChart3, label: "ANALYTICS", href: "/analytics" }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#050506] border-r border-white/5 p-8 z-[100]">
      <div className="flex items-center gap-3 mb-16 p-3 glass-panel border-[#00ffd1]/20 shadow-[0_0_20px_rgba(0,255,209,0.1)]">
        <div className="h-8 w-8 bg-[#00ffd1] rounded flex items-center justify-center font-black text-black tracking-tighter">A</div>
        <span className="font-syne font-black text-white text-xl tracking-tighter uppercase">AVIA OS</span>
      </div>
      
      <nav className="space-y-6">
        {menu.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            className={`flex items-center gap-4 transition-all duration-300 group ${pathname === item.href ? 'text-[#00ffd1]' : 'text-white/30 hover:text-white'}`}
          >
            <item.icon size={18} className={`${pathname === item.href ? 'drop-shadow-[0_0_8px_rgba(0,255,209,0.5)]' : ''}`} />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
