import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalHomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on Dashboard, Login, and Preview pages
  const isHidden = 
    location.pathname === "/" || 
    location.pathname === "/dashboard" || 
    location.pathname === "/login" || 
    location.pathname.startsWith("/preview");

  if (isHidden) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -20 }}
        onClick={() => navigate("/")}
        className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3 p-3 pl-4 bg-[#0B0E14]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-primary/40 transition-all duration-300"
      >
        <div className="flex flex-col items-start leading-none pr-2">
          <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors">Return to</span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Dashboard</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(153,203,72,0.3)] group-hover:shadow-[0_0_30px_rgba(153,203,72,0.5)] transition-all">
          <LayoutGrid className="w-5 h-5 text-black" />
        </div>
      </motion.button>
    </AnimatePresence>
  );
}
