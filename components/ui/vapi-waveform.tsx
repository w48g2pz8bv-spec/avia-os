 "use client";
import { motion } from "framer-motion";

export default function VapiWaveform() {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 w-full">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: [8, Math.random() * 30 + 10, 8],
            opacity: [0.3, 1, 0.3] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8, 
            delay: i * 0.05,
            ease: "easeInOut" 
          }}
          className="w-1.5 bg-gradient-to-t from-[#8b6cff] to-[#00ffd1] rounded-full shadow-[0_0_15px_rgba(0,255,209,0.3)]"
        />
      ))}
    </div>
  );
}