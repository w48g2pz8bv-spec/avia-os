"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

const plans = [
  { name: "Starter", price: "$49", features: ["1,000 Neural Tasks", "Basic Distribution"] },
  { name: "Pro", price: "$149", features: ["Unlimited Neural Tasks", "Advanced Voice AI"], highlight: true },
  { name: "Enterprise", price: "$Custom", features: ["Dedicated Infrastructure", "White-label API"] }
];

export default function Pricing({ onOpenModal }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h2 className="font-syne text-5xl font-black text-white mb-4">Sistemi Ölçeklendir.</h2>
        <p className="text-white/30 font-outfit uppercase tracking-widest text-[10px]">Size en uygun zeka katmanını seçin</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -10, borderColor: "rgba(0,255,209,0.3)" }}
            className={`glass-panel p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center ${plan.highlight ? 'ring-1 ring-accent/20 shadow-[0_0_40px_rgba(0,255,209,0.05)]' : ''}`}
          >
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">{plan.name}</span>
            <div className="text-4xl font-syne font-black text-white mb-8">{plan.price}<span className="text-xs text-white/20">/ay</span></div>
            <ul className="space-y-4 mb-10 w-full">
              {plan.features.map((f, j) => (
                <li key={j} className="text-sm text-white/40 flex items-center gap-3">
                  <div className="h-1 w-1 rounded-full bg-accent" /> {f}
                </li>
              ))}
            </ul>
            <Button onClick={onOpenModal} className="w-full">Planı Seç</Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
