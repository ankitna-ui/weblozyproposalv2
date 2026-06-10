// src/components/ui/auth/AuthLayout.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={cn(
      "min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500",
      "bg-gradient-to-br from-[#F3F6FA] via-[#ECF1F7] to-[#E2E8F4]",
      "dark:from-[#04060A] dark:via-[#090C12] dark:to-[#0E131F]"
    )}>
      {children}
    </div>
  );
};

export default AuthLayout;
