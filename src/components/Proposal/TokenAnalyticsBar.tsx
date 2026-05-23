import React, { useState, useEffect } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { Cpu, Zap, Activity, ShieldAlert, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TokenAnalyticsBar: React.FC = () => {
  const { 
    used, 
    total, 
    remaining, 
    percentage, 
    lastUsage, 
    isQuotaExceeded, 
    lastCallTime, 
    setQuotaStatus 
  } = useTokens();

  const [refillSeconds, setRefillSeconds] = useState<number>(0);
  const [secondsAgo, setSecondsAgo] = useState<number | null>(null);

  useEffect(() => {
    const updateTimers = () => {
      if (lastCallTime > 0) {
        const now = Date.now();
        const elapsed = Math.floor((now - lastCallTime) / 1000);
        
        // Cooldown window is 60 seconds (1 minute) for Gemini RPM free limit
        const secondsLeft = Math.max(0, 60 - elapsed);
        setRefillSeconds(secondsLeft);
        setSecondsAgo(elapsed);

      } else {
        setRefillSeconds(0);
        setSecondsAgo(null);
      }
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [lastCallTime, isQuotaExceeded]);

  const getRefillDateTimeString = () => {
    if (lastCallTime <= 0) return 'N/A';
    // Daily quota resets after 24 hours
    const refillTime = new Date(lastCallTime + 24 * 60 * 60 * 1000);
    return refillTime.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + refillTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (isQuotaExceeded) return 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
    if (percentage > 85) return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
    return 'bg-[#3ABEF9] shadow-[0_0_12px_rgba(58,190,249,0.4)]';
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B0E14] rounded-2xl p-4 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group mb-6 transition-all duration-300">
      {/* Dynamic Background Glows */}
      <AnimatePresence>
        {isQuotaExceeded ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-rose-600 blur-[80px]"
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#3ABEF9] blur-[80px]"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isQuotaExceeded ? (
            /* CASE 1: Quota Exceeded - Show exact date and time when refills occur */
            <motion.div 
              key="exceeded"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert size={16} className="animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">AI Quota Exceeded (429)</span>
              </div>
              
              <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1">
                <span className="text-[7.5px] font-bold text-rose-400/60 uppercase tracking-widest block">Scheduled Token Reset</span>
                <span className="text-xs font-black text-rose-200 flex items-center gap-1.5">
                  <Calendar size={12} className="opacity-70 text-rose-400" />
                  {getRefillDateTimeString()}
                </span>
              </div>
            </motion.div>
          ) : (
            /* CASE 2: Tokens Available - Show only exact remaining/used token data */
            <motion.div 
              key="active"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center shrink-0 text-[#3ABEF9]">
                    <Cpu size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-white">AI Neural Engine</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[7.5px] font-bold uppercase tracking-wider text-emerald-400">Gateway Active</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 dark:text-white">{(remaining / 1000).toFixed(1)}k</span>
                  <span className="text-[6.5px] font-bold text-slate-900 dark:text-white/40 uppercase tracking-widest">Credits Free</span>
                </div>
              </div>

              {/* Progress & Token Usage Stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[7.5px] font-black uppercase tracking-widest text-slate-900 dark:text-white/40">
                  <div className="flex items-center gap-1">
                    <Activity size={10} className="text-[#3ABEF9]" />
                    <span>Telemetry Stream</span>
                  </div>
                  <span className="tabular-nums text-slate-900 dark:text-white/50">
                    {used.toLocaleString()} / {total.toLocaleString()} TKN
                  </span>
                </div>
                <div className="h-2 w-full bg-white/[0.02] rounded-full overflow-hidden border border-white/[0.05] p-[1.5px] relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, percentage)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${getStatusColor()} transition-colors duration-300`}
                  />
                </div>
              </div>

              {/* Last Action details */}
              {lastUsage > 0 && secondsAgo !== null && (
                <div className="flex items-center justify-between text-[8px] font-bold uppercase pt-1.5 border-t border-white/[0.04] text-slate-900 dark:text-white/40">
                  <span>Last Charge:</span>
                  <div className="flex items-center gap-1 text-slate-900 dark:text-white/60">
                    <Zap size={9} className="text-amber-400 fill-amber-400/20 shrink-0" />
                    <span>+{lastUsage.toLocaleString()} TKN</span>
                    <span className="text-slate-900 dark:text-white/30 font-normal">({secondsAgo}s ago)</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TokenAnalyticsBar;
