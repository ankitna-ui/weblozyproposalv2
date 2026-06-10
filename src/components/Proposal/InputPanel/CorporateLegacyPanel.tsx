import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";
import { Award, Briefcase, Globe } from "lucide-react";

export default function CorporateLegacyPanel({ proposal, currentStep, updateExperience }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Operational Authority" subtitle="Display your track record and market authority" stepNumber={currentStep + 1} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputGroupCard 
          icon={<Award className="w-[18px] h-[18px]" />} 
          title="Industry Experience" 
          description="Years of active domain expertise"
          accentColor="blue"
        >
          <div className="space-y-2">
            <LabelPremium>Years Experience</LabelPremium>
            <ModernInput placeholder="e.g. 15+" value={proposal.experience.yearsOfExperience} onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })} />
          </div>
        </InputGroupCard>

        <InputGroupCard 
          icon={<Briefcase className="w-[18px] h-[18px]" />} 
          title="Track Record" 
          description="Total enterprise integrations built"
          accentColor="purple"
        >
          <div className="space-y-2">
            <LabelPremium>Projects Completed</LabelPremium>
            <ModernInput placeholder="e.g. 250+" value={proposal.experience.projectsCompleted} onChange={(e) => updateExperience({ projectsCompleted: e.target.value })} />
          </div>
        </InputGroupCard>
      </div>

      <InputGroupCard 
        icon={<Globe className="w-[18px] h-[18px]" />} 
        title="Market Penetration" 
        description="Global sectors and industries active in"
        accentColor="primary"
      >
        <div className="space-y-2">
          <LabelPremium>Industries Served</LabelPremium>
          <ModernInput 
            placeholder="e.g. 15+ Industries" 
            value={typeof proposal.experience.industriesServed === 'string' ? proposal.experience.industriesServed : "15+"} 
            onChange={(e) => updateExperience({ industriesServed: e.target.value })} 
          />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1 italic opacity-60">This value highlights your market reach in the success metrics.</p>
        </div>
      </InputGroupCard>
    </div>
  );
}
