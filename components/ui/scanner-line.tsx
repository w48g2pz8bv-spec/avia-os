"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScannerLine() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="fixed top-0 right-4 h-full w-[1px] bg-white/5 z-50 hidden md:block">
      <motion.div 
        style={{ scaleY, originY: 0 }}
        className="w-full h-full bg-accent shadow-[0_0_15px_#00ffd1]"
      />
      <div className="absolute top-1/2 -right-2 transform -rotate-90 text-[8px] font-mono text-white/20 tracking-[0.5em] whitespace-nowrap">
        NEURAL_SCAN_ACTIVE
      </div>
    </div>
  );
}
