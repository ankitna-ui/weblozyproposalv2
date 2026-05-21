import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function CorporateLegacyPanel({ proposal, currentStep, updateExperience, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-10">
      <SectionHeader title="Operational Authority" subtitle="Display your track record and market authority" stepNumber={currentStep + 1} />
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Target Industry</LabelPremium>
          <ModernInput placeholder="e.g. Retail Automation" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Industry Domain</LabelPremium>
          <ModernInput placeholder="e.g. Enterprise Sector" value={proposal.client.industryDomain} onChange={(e) => updateClient({ industryDomain: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Years Experience</LabelPremium>
          <ModernInput placeholder="15+" value={proposal.experience.yearsOfExperience} onChange={(e) => updateExperience({ yearsOfExperience: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Projects Built</LabelPremium>
          <ModernInput placeholder="250+" value={proposal.experience.projectsCompleted} onChange={(e) => updateExperience({ projectsCompleted: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <LabelPremium>Industries Served (Authority Count)</LabelPremium>
        <ModernInput 
          placeholder="e.g. 15+ Industry" 
          value={typeof proposal.experience.industriesServed === 'string' ? proposal.experience.industriesServed : "15+"} 
          onChange={(e) => updateExperience({ industriesServed: e.target.value })} 
        />
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-4 italic opacity-60">This value highlights your market reach in the success metrics.</p>
      </div>
    </div>
  );
}
