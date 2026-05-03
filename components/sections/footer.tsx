"use client";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-20 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
        <div>
          <div className="text-2xl font-black text-white tracking-tighter mb-4">AIVA</div>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
            © 2026 Neural Distribution Protocol
          </p>
        </div>
        
        <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-[#00ffd1] transition-colors">Güvenlik</a>
          <a href="#" className="hover:text-[#00ffd1] transition-colors">API</a>
          <a href="#" className="hover:text-[#00ffd1] transition-colors">Durum</a>
        </div>
      </div>
    </footer>
  );
}