"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050506]/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-panel relative w-full max-w-md rounded-[2.5rem] p-10 border border-white/10"
          >
            <h2 className="font-syne text-3xl font-bold text-white mb-2">Sisteme Bağlan</h2>
            <p className="text-white/40 text-sm mb-8 font-medium">Neural ağa erişim için kimlik doğrula.</p>
            
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="E-posta Adresi" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#00ffd1]/50 transition-all"
              />
              <button className="w-full bg-gradient-to-r from-[#8b6cff] to-[#00ffd1] py-4 rounded-2xl font-black uppercase tracking-widest text-[#050506] hover:brightness-110 transition-all">
                Erişim İste
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}