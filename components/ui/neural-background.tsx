"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function NeuralBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#050506]">
      {/* Performans Dostu Teknik Izgara */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
      />
      {/* GPU Hızlandırmalı Neural Auralar */}
      <motion.div 
        style={{ y: y1, translateZ: 0 }} 
        className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vh] bg-[#00ffd1]/5 rounded-full blur-[120px] will-change-transform" 
      />
      <motion.div 
        style={{ y: y2, translateZ: 0 }} 
        className="absolute bottom-[-10%] left-[-10%] w-[100vw] h-[100vh] bg-[#8b6cff]/3 rounded-full blur-[150px] will-change-transform" 
      />
    </div>
  );
}
