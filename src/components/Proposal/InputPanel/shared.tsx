import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  <Label className={`text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2.5 block transition-colors ${className}`}>
    {children}
  </Label>
);

export const SectionHeader = ({ title, subtitle, stepNumber }: { title: string, subtitle?: string, stepNumber: number }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-3">
       <div className="w-8 h-[2px] bg-primary shadow-[0_0_10px_#99CB48]" />
       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">Sequence 0{stepNumber}</span>
    </div>
    <h3 className="text-[32px] font-black uppercase tracking-[-0.03em] leading-none text-[#0B0E14] mb-4">{title}</h3>
    {subtitle && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed max-w-md border-l-2 border-slate-100 pl-4">{subtitle}</p>}
  </div>
);

export const ModernInput = (props: React.ComponentProps<typeof Input>) => (
  <Input 
    {...props} 
    className={`h-14 bg-white border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] focus-visible:ring-primary focus-visible:border-primary/50 font-black rounded-xl transition-all duration-300 hover:shadow-lg ${props.className}`} 
  />
);

export const ModernTextArea = (props: React.ComponentProps<typeof Textarea>) => (
  <Textarea 
    {...props} 
    className={`min-h-[120px] bg-white border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] focus-visible:ring-primary focus-visible:border-primary/50 font-bold rounded-xl transition-all duration-300 hover:shadow-lg leading-relaxed ${props.className}`} 
  />
);
