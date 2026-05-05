"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function CTA({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="font-syne text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter"
        >
          Geleceği Bugün <br /> <span className="shimmer-text">Senkronize Et.</span>
        </motion.h2>
        <Button onClick={onOpenModal}>Hemen Başla — Ücretsiz</Button>
      </div>
    </section>
  );
}
