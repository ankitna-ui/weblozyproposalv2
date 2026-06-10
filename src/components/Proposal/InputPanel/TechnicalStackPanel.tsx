import { Monitor, Server, Database, Cloud, ShieldCheck } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";

export default function TechnicalStackPanel({ proposal, currentStep, updateTechArchitecture }: InputPanelProps) {
  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="Technology Protocol" 
        subtitle="Define the high-performance architectural foundation of the proposed ecosystem" 
        stepNumber={currentStep + 1} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroupCard
          icon={<Monitor className="w-[18px] h-[18px]" />}
          title="Frontend Interface Stack"
          description="Client interface technologies"
          accentColor="blue"
        >
          <div className="space-y-2">
            <LabelPremium>Frontend Frameworks & Libs</LabelPremium>
            <ModernInput 
              placeholder="React, Next.js, Tailwind CSS..." 
              value={proposal.techArchitecture.frontendStack.join(", ")} 
              onChange={(e) => updateTechArchitecture({ frontendStack: e.target.value.split(",").map((i: string) => i.trim()) })} 
            />
          </div>
        </InputGroupCard>

        <InputGroupCard
          icon={<Server className="w-[18px] h-[18px]" />}
          title="Core Engine (Backend)"
          description="Application logic & compute backend"
          accentColor="purple"
        >
          <div className="space-y-2">
            <LabelPremium>Backend Technologies</LabelPremium>
            <ModernInput 
              placeholder="Node.js, Python, Go..." 
              value={proposal.techArchitecture.backendStack.join(", ")} 
              onChange={(e) => updateTechArchitecture({ backendStack: e.target.value.split(",").map((i: string) => i.trim()) })} 
            />
          </div>
        </InputGroupCard>

        <InputGroupCard
          icon={<Database className="w-[18px] h-[18px]" />}
          title="Data Architecture"
          description="Databases, caching & message queues"
          accentColor="emerald"
        >
          <div className="space-y-2">
            <LabelPremium>Databases & Stores</LabelPremium>
            <ModernInput 
              placeholder="PostgreSQL, MongoDB, Redis..." 
              value={proposal.techArchitecture.database} 
              onChange={(e) => updateTechArchitecture({ database: e.target.value })} 
            />
          </div>
        </InputGroupCard>

        <InputGroupCard
          icon={<Cloud className="w-[18px] h-[18px]" />}
          title="Infrastructure & Hosting"
          description="Cloud infrastructure & deployment vectors"
          accentColor="orange"
        >
          <div className="space-y-2">
            <LabelPremium>Cloud Providers & Platforms</LabelPremium>
            <ModernInput 
              placeholder="AWS, Azure, Vercel..." 
              value={proposal.techArchitecture.hosting} 
              onChange={(e) => updateTechArchitecture({ hosting: e.target.value })} 
            />
          </div>
        </InputGroupCard>
      </div>

      <div className="p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl flex items-start gap-4 shadow-inner">
         <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-primary shrink-0">
            <ShieldCheck size={20} />
         </div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed pt-1">
            Note: All listed technologies are vetted for enterprise-grade scalability, security protocols, and 99.9% uptime reliability.
         </p>
      </div>
    </div>
  );
}
