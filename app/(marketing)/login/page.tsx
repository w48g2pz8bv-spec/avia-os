"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Anayasa kuralı: Cookie ile session simülasyonu
    document.cookie = "isLoggedIn=true; path=/";
    router.push("/dashboard");
    router.refresh(); // Middleware'in yeni çerezi görmesi için
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050506]">
      <div className="p-12 glass-panel text-center">
        <h1 className="text-2xl font-syne font-black mb-8 uppercase tracking-tighter">Sisteme Eriş</h1>
        <button 
          onClick={handleLogin}
          className="bg-[#00ffd1] text-black px-12 py-4 rounded-2xl font-black uppercase text-xs shadow-[0_10px_30px_rgba(0,255,209,0.2)] hover:scale-105 transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
}
