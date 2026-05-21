import { Monitor, Server, Database, Cloud, ShieldCheck } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function TechnicalStackPanel({ proposal, currentStep, updateTechArchitecture }: InputPanelProps) {
  return (
    <div className="space-y-10 pb-10">
      <SectionHeader 
        title="Technology Protocol" 
        subtitle="Define the high-performance architectural foundation of the proposed ecosystem" 
        stepNumber={currentStep + 1} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
               <Monitor size={18} />
            </div>
            <LabelPremium className="mb-0 text-slate-900">Frontend Interface Stack</LabelPremium>
          </div>
          <ModernInput 
            placeholder="React, Next.js, Tailwind CSS..." 
            value={proposal.techArchitecture.frontendStack.join(", ")} 
            onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map((i: string) => i.trim()) })} 
          />
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
               <Server size={18} />
            </div>
            <LabelPremium className="mb-0 text-slate-900">Core Engine (Backend)</LabelPremium>
          </div>
          <ModernInput 
            placeholder="Node.js, Python, Go..." 
            value={proposal.techArchitecture.backendStack.join(", ")} 
            onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map((i: string) => i.trim()) })} 
          />
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
               <Database size={18} />
            </div>
            <LabelPremium className="mb-0 text-slate-900">Data Architecture</LabelPremium>
          </div>
          <ModernInput 
            placeholder="PostgreSQL, MongoDB, Redis..." 
            value={proposal.techArchitecture.database} 
            onChange={(e) => updateTechArchitecture({ database: e.target.value })} 
          />
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
               <Cloud size={18} />
            </div>
            <LabelPremium className="mb-0 text-slate-900">Infrastructure & Hosting</LabelPremium>
          </div>
          <ModernInput 
            placeholder="AWS, Azure, Vercel..." 
            value={proposal.techArchitecture.hosting} 
            onChange={(e) => updateTechArchitecture({ hosting: e.target.value })} 
          />
        </div>
      </div>

      <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-start gap-4 shadow-inner">
         <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
            <ShieldCheck size={20} />
         </div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed pt-1">
            Note: All listed technologies are vetted for enterprise-grade scalability, security protocols, and 99.9% uptime reliability.
         </p>
      </div>
    </div>
  );
}
