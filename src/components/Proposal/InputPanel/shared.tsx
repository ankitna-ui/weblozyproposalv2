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
  <Label className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-gray-300 mb-2.5 block transition-colors", className)}>
    {children}
  </Label>
);

export const SectionHeader = ({ title, subtitle, stepNumber }: { title: string, subtitle?: string, stepNumber: number }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-3">
       <div className="w-8 h-[2px] bg-primary shadow-[0_0_10px_#99CB48]" />
       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">Sequence 0{stepNumber}</span>
    </div>
    <h3 className="text-[32px] font-black uppercase tracking-[-0.03em] leading-none text-slate-900 dark:text-white mb-4">{title}</h3>
    {subtitle && <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-[0.15em] leading-relaxed max-w-md border-l-2 border-slate-200 dark:border-white/10 pl-4">{subtitle}</p>}
  </div>
);

export const ModernInput = (props: React.ComponentProps<typeof Input>) => (
  <Input 
    {...props} 
    className={cn(
      "h-14 bg-slate-50 dark:bg-[#11151D] border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 font-black rounded-xl transition-all duration-300 hover:border-slate-400 dark:hover:border-white/20 dark:hover:bg-[#161B22]",
      props.className
    )} 
  />
);

export const ModernTextArea = (props: React.ComponentProps<typeof Textarea>) => (
  <Textarea 
    {...props} 
    className={cn(
      "min-h-[120px] bg-slate-50 dark:bg-[#11151D] border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 font-bold rounded-xl transition-all duration-300 hover:border-slate-400 dark:hover:border-white/20 dark:hover:bg-[#161B22] leading-relaxed",
      props.className
    )} 
  />
);
