import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/weblozy-logo.png';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  // Simulate a progressive loading number
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070a] overflow-hidden font-sans">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      
      {/* Center Ambient Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#99CB48]/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Scanning Line */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#99CB48]/50 to-transparent shadow-[0_0_20px_rgba(153,203,72,0.8)] z-0" 
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* Advanced Ring System */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mb-12">
          
          {/* Outer Dashed Orbit */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full border border-white/5 border-dashed" 
          />

          {/* Primary Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#99CB48] border-r-[#99CB48]/30 drop-shadow-[0_0_10px_rgba(153,203,72,0.5)]" 
          />
          
          {/* Secondary Reverse Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[6px] rounded-full border-[2px] border-transparent border-b-white/40 border-l-white/10" 
          />
          
          {/* Inner Logo Core */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-[15px] flex items-center justify-center p-6 bg-[#0B0E14] rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(153,203,72,0.1)] border border-white/5 backdrop-blur-xl"
          >
            <motion.img 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              src={logo} 
              alt="Weblozy Logo" 
              className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </motion.div>
        </div>

        {/* Text & Progress Section */}
        <div className="w-full mt-4">
           <div className="flex flex-col items-center justify-center text-center space-y-2 mb-6">
              <h2 className="text-white text-sm md:text-base font-black tracking-[0.4em] uppercase">
                Authenticating
              </h2>
              <div className="text-[10px] text-[#99CB48] font-black tracking-widest uppercase flex items-center justify-center gap-2">
                Establishing Secure Tunnel
                <span className="flex gap-0.5">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </div>
           </div>

           {/* High-Tech Progress Bar */}
           <div className="flex items-center gap-4 w-full px-2">
             <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden relative backdrop-blur-md shadow-inner">
               <motion.div 
                 className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#99CB48]/40 via-[#99CB48]/80 to-[#99CB48] shadow-[0_0_20px_rgba(153,203,72,1)]"
                 initial={{ width: 0 }}
                 animate={{ width: `${progress > 100 ? 100 : progress}%` }}
                 transition={{ ease: "linear", duration: 0.4 }}
               />
             </div>
             <div className="text-xl md:text-2xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] w-16 text-right shrink-0">
                {progress > 100 ? 100 : progress}<span className="text-xs text-white/70 ml-1">%</span>
             </div>
           </div>
        </div>

        {/* System Diagnostics Footer */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 bg-[#99CB48] rounded-full animate-ping" />
             <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white">Cloud Node Active</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
             <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white">Encryption V4.0</span>
           </div>
        </div>

      </div>
    </div>
  );
}
