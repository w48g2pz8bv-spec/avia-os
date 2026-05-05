"use client";

interface PageHeaderProps {
  title: string;
  statusText?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, statusText = "System Optimal", action }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 bg-[#00ffd1] rounded-full shadow-[0_0_10px_rgba(0,255,209,0.5)]" />
          <span className="text-[9px] font-mono font-black text-[#00ffd1] tracking-[0.3em] uppercase">{statusText}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-syne font-black tracking-tighter uppercase italic leading-none text-white">
          {title}
        </h1>
      </div>
      {action && <div className="flex-shrink-0 mb-1">{action}</div>}
    </header>
  );
}

