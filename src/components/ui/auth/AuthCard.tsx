// src/components/ui/auth/AuthCard.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  progress?: number; // 0-100 for signup progress bar
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, progress }) => {
  return (
    <div className={cn(
      "relative w-full max-w-[460px] bg-white/30 dark:bg-[#0A0F16]/40 backdrop-blur-xl",
      "border border-white/20 dark:border-white/10 rounded-[2rem] p-8 sm:p-10",
      "shadow-2xl dark:shadow-[0_0_80px_rgba(0,0,0,0.5)]"
    )}>
      {progress !== undefined && (
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 dark:bg-white/20 rounded-t-lg overflow-hidden">
          <div
            className="h-full bg-[#99CB48] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {title && (
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

export default AuthCard;
