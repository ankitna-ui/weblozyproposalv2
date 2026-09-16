// src/components/ui/auth/AuthLayout.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={cn(
      "min-h-screen w-full flex bg-white dark:bg-[#0B0E14] transition-colors duration-500 overflow-hidden"
    )}>
      {children}
    </div>
  );
};

export default AuthLayout;
