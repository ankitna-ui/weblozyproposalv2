// src/components/ui/auth/InputField.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showToggle?: boolean; // for password visibility toggle
  toggleVisibility?: () => void;
  isPasswordVisible?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showToggle = false,
  toggleVisibility,
  isPasswordVisible,
}) => {
  return (
    <div className="relative group mb-4">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors">
        {icon}
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "h-12 pl-10 pr-3 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl",
          "text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600",
          "focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all",
          error && "border-red-500 focus:border-red-500"
        )}
      />
      {showToggle && toggleVisibility && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {isPasswordVisible ? (
            // EyeOff icon placeholder; user can import actual icon where used
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0s10 4.477 10 10c0 .341-.018.678-.053 1.011M15 15l5 5M2 2l20 20" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          )}
        </button>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default InputField;
