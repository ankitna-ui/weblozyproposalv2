import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface InputPanelProps {
  proposal: any;
  currentStep: number;
  updateClient: (data: any) => void;
  updateSituation: (data: any) => void;
  updateSolution: (data: any) => void;
  updateTechArchitecture: (data: any) => void;
  updateROI: (data: any) => void;
  updateExperience: (data: any) => void;
  updatePricing: (data: any) => void;
  updateClosing: (data: any) => void;
}

export const LabelPremium = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Label className={cn("text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2 block transition-colors", className)}>
    {children}
  </Label>
);

export const SectionHeader = ({ title, subtitle, stepNumber }: { title: string, subtitle?: string, stepNumber: number }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
       <div className="w-8 h-[2px] bg-primary shadow-[0_0_10px_#99CB48]" />
       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/85">Sequence 0{stepNumber}</span>
    </div>
    <h3 className="text-[30px] font-black uppercase tracking-[-0.03em] leading-none text-slate-900 dark:text-white mb-3">{title}</h3>
    {subtitle && <p className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] leading-relaxed max-w-md border-l-2 border-slate-200 dark:border-white/15 pl-4">{subtitle}</p>}
  </div>
);

export const ModernInput = (props: React.ComponentProps<typeof Input>) => (
  <Input 
    {...props} 
    className={cn(
      "h-12 px-4 bg-white dark:bg-[#131722] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 font-semibold text-sm rounded-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 dark:hover:bg-[#181E29] focus-visible:outline-none focus:outline-none focus:ring-1 focus:ring-primary",
      props.className
    )} 
  />
);

export const ModernTextArea = (props: React.ComponentProps<typeof Textarea>) => (
  <Textarea 
    {...props} 
    className={cn(
      "min-h-[120px] px-4 py-3 bg-white dark:bg-[#131722] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 font-semibold text-sm rounded-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 dark:hover:bg-[#181E29] leading-relaxed focus-visible:outline-none focus:outline-none focus:ring-1 focus:ring-primary",
      props.className
    )} 
  />
);

export const InputGroupCard = ({
  icon,
  title,
  description,
  accentColor = "primary", // "primary" | "blue" | "purple" | "emerald" | "orange" | "rose" | "indigo" | "pink" | "yellow"
  children,
  className = ""
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  accentColor?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const accentClasses: Record<string, { bg: string, text: string, hover: string }> = {
    primary: {
      bg: "bg-[#99CB48]/10 dark:bg-[#99CB48]/5",
      text: "text-[#99CB48] dark:text-[#99CB48]",
      hover: "hover:border-[#99CB48]/30 dark:hover:border-[#99CB48]/25"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-500 dark:text-blue-400",
      hover: "hover:border-blue-500/30 dark:hover:border-blue-500/25"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-500/10",
      text: "text-purple-500 dark:text-purple-400",
      hover: "hover:border-purple-500/30 dark:hover:border-purple-500/25"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-500 dark:text-emerald-400",
      hover: "hover:border-emerald-500/30 dark:hover:border-emerald-500/25"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-500/10",
      text: "text-orange-500 dark:text-orange-400",
      hover: "hover:border-orange-500/30 dark:hover:border-orange-500/25"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-500/10",
      text: "text-rose-500 dark:text-rose-400",
      hover: "hover:border-rose-500/30 dark:hover:border-rose-500/25"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      text: "text-indigo-500 dark:text-indigo-400",
      hover: "hover:border-indigo-500/30 dark:hover:border-indigo-500/25"
    },
    pink: {
      bg: "bg-pink-50 dark:bg-pink-500/10",
      text: "text-pink-500 dark:text-pink-400",
      hover: "hover:border-pink-500/30 dark:hover:border-pink-500/25"
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      hover: "hover:border-yellow-500/30 dark:hover:border-yellow-500/25"
    }
  };

  const style = accentClasses[accentColor] || accentClasses.primary;

  return (
    <div className={cn(
      "p-6 bg-slate-50/50 dark:bg-[#131720]/40 border border-slate-100 dark:border-white/5 rounded-3xl transition-all duration-300 shadow-sm",
      style.hover,
      className
    )}>
      {(icon || title) && (
        <div className="flex items-start gap-4 mb-5 border-b border-slate-100 dark:border-white/5 pb-4">
          {icon && (
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 hover:scale-105",
              style.bg,
              style.text
            )}>
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-[12px] font-black uppercase tracking-wider text-slate-800 dark:text-white leading-tight mt-1">
              {title}
            </h4>
            {description && (
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
