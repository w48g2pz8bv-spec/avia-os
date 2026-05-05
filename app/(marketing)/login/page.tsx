"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Cpu, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        document.cookie = "isLoggedIn=true; path=/"; // Fallback for middleware
        router.push("/dashboard");
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setIsLogin(true);
        setError("Kayıt başarılı! Lütfen giriş yapın.");
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050506] bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,209,0.05),transparent_50%)]">
      <div className="w-full max-w-md p-8 sm:p-12 glass-panel border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ffd1] to-transparent opacity-50" />
        
        <div className="flex flex-col items-center mb-10 text-center">
            <Cpu size={48} strokeWidth={1} className="text-[#00ffd1] mb-6 animate-pulse" />
            <h1 className="text-3xl font-syne font-black italic uppercase tracking-tighter text-white">AIVA OS</h1>
            <p className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase mt-2">Neural Access Terminal</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#00ffd1] transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-[#00ffd1]/40 focus:outline-none transition-all font-mono"
              />
            </div>
            
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-[#00ffd1] transition-colors" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-[#00ffd1]/40 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <p className={`text-[10px] font-mono tracking-widest uppercase text-center ${error.includes("başarılı") ? "text-emerald-400" : "text-red-400"}`}>
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#00ffd1] text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(0,255,209,0.2)] hover:shadow-[0_0_40px_rgba(0,255,209,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>{isLogin ? "Authenticate" : "Initialize Link"} <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
            <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[10px] font-mono text-white/40 hover:text-white transition-colors tracking-widest uppercase"
            >
                {isLogin ? "Need access? Request Node" : "Existing node? Authenticate"}
            </button>
        </div>
      </div>
    </div>
  );
}
