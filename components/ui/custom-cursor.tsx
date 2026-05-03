"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);
  
  const springConfig = { stiffness: 400, damping: 28 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = () => setIsHovering(true);
    const handleOut = () => setIsHovering(false);

    window.addEventListener("mousemove", moveMouse);
    document.querySelectorAll("button, a").forEach(el => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleOut);
    });

    return () => window.removeEventListener("mousemove", moveMouse);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Ana İmleç Merceği */}
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 w-4 h-4 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_20px_#00ffd1]"
      />
      {/* Akışkan Işık İzi */}
      <motion.div
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 2.5 : 1, opacity: isHovering ? 0.3 : 0.6 }}
        className="fixed top-0 left-0 w-12 h-12 border border-accent rounded-full pointer-events-none z-[9998] transition-transform duration-500 ease-out blur-[2px]"
      />
    </>
  );
}
