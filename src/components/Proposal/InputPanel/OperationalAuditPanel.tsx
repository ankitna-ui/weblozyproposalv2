import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

export default function OperationalAuditPanel({ proposal, currentStep, updateSituation }: InputPanelProps) {
  return (
    <div className="space-y-10">
      <SectionHeader title="Operational Audit" subtitle="Identify core bottlenecks and systemic friction within the current architecture" stepNumber={currentStep + 1} />
      
      <div className="space-y-2">
        <LabelPremium>Audit Narrative (Situational Analysis)</LabelPremium>
        <ModernTextArea placeholder="Describe current workflow friction and operational gaps..." value={proposal.situation.currentWorkflow} onChange={(e) => updateSituation({ currentWorkflow: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Revenue Leakage</LabelPremium>
          <ModernInput placeholder="₹10k+ / Mo" value={proposal.situation.revenueLeakage} onChange={(e) => updateSituation({ revenueLeakage: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Inefficiency Profile</LabelPremium>
          <ModernInput placeholder="High Manual Overhead" value={proposal.situation.inefficiencies} onChange={(e) => updateSituation({ inefficiencies: e.target.value })} />
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <LabelPremium className="mb-0">Critical Friction Points</LabelPremium>
          <button type="button" onClick={() => updateSituation({ challenges: [...proposal.situation.challenges, ""] })} className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-1.5 rounded-full">+ Add Diagnosis</button>
        </div>
        <div className="space-y-4">
          {proposal.situation.challenges.map((challenge: string, i: number) => (
            <div key={i} className="flex gap-3 group">
              <ModernInput placeholder={`Challenge Protocol #${i + 1}`} value={challenge} onChange={(e) => {
                const next = [...proposal.situation.challenges];
                next[i] = e.target.value;
                updateSituation({ challenges: next });
              }} />
              <button type="button" onClick={() => updateSituation({ challenges: proposal.situation.challenges.filter((_: string, idx: number) => idx !== i) })} className="w-14 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-black">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
