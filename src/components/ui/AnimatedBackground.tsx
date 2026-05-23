import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const AnimatedBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-700">
      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#020617] dark:via-[#08152e] dark:to-[#040810] transition-colors duration-700" />

      {/* 2. Abstract Geometric Grid (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,white_80%),linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_80%),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:100%_100%,32px_32px,32px_32px] opacity-100 dark:opacity-60 transition-colors duration-700" />

      {/* 3. Floating Gradient Orbs */}
      <motion.div
        animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#99CB48] rounded-full blur-[100px] dark:blur-[120px] opacity-[0.15] dark:opacity-[0.08]"
      />
      <motion.div
        animate={{ x: [0, -150, 100, 0], y: [0, 150, -100, 0], scale: [1, 1.1, 1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-[#0ea5e9] rounded-full blur-[100px] dark:blur-[140px] opacity-[0.12] dark:opacity-[0.08]"
      />
      <motion.div
        animate={{ x: [0, 50, -100, 0], y: [0, 100, -50, 0], scale: [0.9, 1.2, 1, 0.9] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-[#8b5cf6] rounded-full blur-[100px] dark:blur-[100px] opacity-[0.08] dark:opacity-[0.05]"
      />

      {/* 4. Mouse-following Interactive Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{ background: `radial-gradient(600px circle at calc(var(--x) * 1px) calc(var(--y) * 1px), rgba(153, 203, 72, 0.05), transparent 40%)` }}
        animate={{ "--x": smoothX.get(), "--y": smoothY.get() } as any}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{ background: `radial-gradient(600px circle at calc(var(--x) * 1px) calc(var(--y) * 1px), rgba(153, 203, 72, 0.08), transparent 40%)` }}
        animate={{ "--x": smoothX.get(), "--y": smoothY.get() } as any}
      />

      {/* 5. Animated Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
    </div>
  );
};
