"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

type ToastType = "info" | "success" | "warning" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`
                pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px]
                ${t.type === 'success' ? 'bg-[#00ffd1]/10 border-[#00ffd1]/20 text-[#00ffd1]' : 
                  t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                  t.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                  'bg-white/5 border-white/10 text-white/80'}
              `}
            >
              <div className="flex-shrink-0">
                {t.type === 'success' && <CheckCircle size={18} />}
                {t.type === 'error' && <XCircle size={18} />}
                {t.type === 'warning' && <AlertTriangle size={18} />}
                {t.type === 'info' && <Info size={18} />}
              </div>
              
              <div className="flex-1">
                <p className="text-[10px] font-mono uppercase tracking-widest font-black opacity-40 mb-0.5">
                  System_{t.type}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-tight">{t.message}</p>
              </div>

              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                className="opacity-20 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>

              {/* Progress Bar Animation */}
              <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-[1px] w-full origin-left ${
                    t.type === 'success' ? 'bg-[#00ffd1]' : 
                    t.type === 'error' ? 'bg-red-500' : 
                    t.type === 'warning' ? 'bg-amber-500' : 
                    'bg-white/40'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
