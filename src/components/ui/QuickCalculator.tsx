import { useState } from "react";
import { Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function QuickCalculator() {
  const location = useLocation();
  const isHidden = location.pathname === "/login" || location.pathname.startsWith("/preview");

  const [isOpen, setIsOpen] = useState(false);
  const [moduleCount, setModuleCount] = useState<number | "">("");
  const [modulePrice, setModulePrice] = useState<number | "">(10000);
  const [discountPct, setDiscountPct] = useState<number | "">(15);

  if (isHidden) return null;

  const basePrice = (Number(moduleCount) || 0) * (Number(modulePrice) || 0);
  const discountAmount = basePrice * ((Number(discountPct) || 0) / 100);
  const finalPrice = basePrice - discountAmount;

  const formatCurrency = (val: number) => {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-[100] group flex items-center justify-center w-12 h-12 bg-white dark:bg-[#0B0E14]/80 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-primary/40 transition-all duration-300 no-print"
        title="Quick Calculator"
      >
        <Calculator className="w-5 h-5 text-slate-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
      </button>

      {/* Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-8 z-[101] w-80 bg-white dark:bg-[#11141A] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden no-print"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Quick Calculator</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Number of Modules</label>
                <input
                  type="number"
                  value={moduleCount}
                  onChange={(e) => setModuleCount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price per Module (₹)</label>
                <input
                  type="number"
                  value={modulePrice}
                  onChange={(e) => setModulePrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 10000"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Discount (%)</label>
                <input
                  type="number"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 15"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-black p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Base Price</span>
                <span className="text-white font-bold">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-400 font-medium">Discount ({(Number(discountPct) || 0)}%)</span>
                <span className="text-rose-400 font-bold">-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Final Price</span>
                <span className="text-lg font-black text-primary tracking-tight">{formatCurrency(finalPrice)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
