import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Arka plan efektleri için güvenli alan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00ffd1]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">Sistem Durumu: Optimal</span>
        </div>
        
        <h1 className="text-7xl font-syne font-black mb-6 leading-tight tracking-tighter">
          AI ile işini <br /> 
          <span className="text-[#00ffd1] drop-shadow-[0_0_15px_rgba(0,255,209,0.3)]">büyüt. Yönet.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-white/40 text-lg mb-12">
          Sadece bir otomasyon değil, işletmenizin yeni sinir sistemi. <br />
          Geleceği bugün tek bir merkezden kontrol edin.
        </p>
        
        <button className="flex items-center gap-4 bg-[#00ffd1] text-black px-12 py-6 rounded-[2rem] font-black uppercase text-sm shadow-[0_20px_50px_rgba(0,255,209,0.3)] hover:scale-105 transition-all mx-auto">
          Sistemi Başlat <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
