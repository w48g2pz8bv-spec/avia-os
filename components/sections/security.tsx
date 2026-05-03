"use client";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function Security() {
  const items = [
    { icon: ShieldCheck, title: "Neural Shield", desc: "Uçtan uca şifreli veri iletimi." },
    { icon: Lock, title: "Safe Access", desc: "Biyometrik doğrulama protokolü." },
    { icon: EyeOff, title: "Privacy First", desc: "Verileriniz AI eğitimi için kullanılmaz." }
  ];

  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-[3rem] p-12 grid md:grid-cols-3 gap-12 border border-white/5">
          {items.map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <item.icon className="h-8 w-8 text-[#00ffd1] mb-6 mx-auto md:mx-0" />
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/30">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
