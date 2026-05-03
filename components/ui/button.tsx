 "use client";
import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full bg-gradient-to-r from-[#8b6cff] to-[#00ffd1] p-[1px] font-bold text-white shadow-[0_0_20px_rgba(139,108,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(0,255,209,0.5)] ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a0a] px-8 py-4 transition-all group-hover:bg-transparent">
        <span className="relative z-10 flex items-center gap-2 transition-colors group-hover:text-[#0a0a0a]">
          {children}
          <motion.span 
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </motion.span>
        </span>
      </div>
    </motion.button>
  );
}