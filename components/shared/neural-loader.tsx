"use client";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function NeuralLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050506] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Rings */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t border-b border-[#00ffd1]/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-24 h-24 border-l border-r border-[#00ffd1]/40 rounded-full"
        />
        
        {/* Center Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Cpu className="text-[#00ffd1]" size={32} />
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 space-y-2 text-center"
      >
        <p className="text-[10px] font-mono text-[#00ffd1] uppercase tracking-[0.6em] animate-pulse">
          Neural_Link_Establishing
        </p>
        <div className="flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
                <motion.div 
                    key={i}
                    animate={{ scaleY: [1, 2, 1], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-[2px] h-2 bg-[#00ffd1]"
                />
            ))}
        </div>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#00ffd1]/5 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
}
