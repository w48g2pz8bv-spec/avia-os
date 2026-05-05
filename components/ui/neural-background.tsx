"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function NeuralBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#050506] overflow-hidden">
      {/* 1. Global Cinematic Noise (Grain) Overlay */}
      <div className="absolute inset-0 opacity-[0.25] mix-blend-soft-light pointer-events-none z-50">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 2. Dynamic Scanline Effect */}
      <motion.div 
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[30vh] bg-gradient-to-b from-transparent via-[#00ffd1]/[0.03] to-transparent z-40"
      />

      {/* 3. Performance-Focused Technical Grid */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />

      {/* 4. Layered Neural Auras */}
      <div className="absolute inset-0">
        <motion.div 
          style={{ y: y1 }} 
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] right-[-10%] w-[120vw] h-[120vh] bg-[#00ffd1]/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          style={{ y: y2 }} 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-30%] left-[-20%] w-[120vw] h-[120vh] bg-[#8b6cff]/5 rounded-full blur-[180px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient(circle at center, transparent, #050506)" />
      </div>

      {/* 5. Vignette Effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

