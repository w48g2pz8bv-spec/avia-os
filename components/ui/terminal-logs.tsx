"use client";
import { useEffect, useState } from "react";

export default function TerminalLogs() {
  const [logs, setLogs] = useState(["Bağlantı kuruluyor...", "Sistem: Optimal"]);

  useEffect(() => {
    const msgs = ["Neural link active.", "Data sync: 100%", "VAPI Node: Connected", "CDS protocol: V4"];
    const timer = setInterval(() => {
      setLogs(prev => [...prev.slice(-4), msgs[Math.floor(Math.random() * msgs.length)]]);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-[#00ffd1]/60 space-y-1 border border-white/5">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span>{log}</span>
        </div>
      ))}
    </div>
  );
}
