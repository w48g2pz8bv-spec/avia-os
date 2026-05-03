"use client";
import { motion } from "framer-motion";
import { Layers, Share2, Rocket, Brain } from "lucide-react";

const features = [
  { icon: Brain, title: "Zekâ Odaklı Dağıtım", desc: "İçeriklerinizi AI ile analiz eder ve en doğru kitleye ulaştırır." },
  { icon: Layers, title: "Çoklu Platform", desc: "Tek bir fikri YouTube, Instagram ve TikTok formatlarına böler." },
  { icon: Share2, title: "Otomatik Yayın", desc: "Tüm sosyal medya kanallarınızda eş zamanlı senkronizasyon." },
  { icon: Rocket, title: "Hızlı Ölçekleme", desc: "Manuel süreçleri %90 azaltarak büyümenizi hızlandırır." }
];

export default function Features() {
  return (
    <section id="zeka" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -5 }}
              className="glass-panel group rounded-3xl p-8 border border-white/5 hover:border-[#00ffd1]/20 transition-all"
            >
              <div className="mb-6 h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#00ffd1]/10 transition-colors">
                <f.icon className="h-6 w-6 text-[#00ffd1]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}