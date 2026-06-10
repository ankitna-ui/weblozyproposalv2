import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea, InputGroupCard } from "./shared";
import { AlertCircle, TrendingDown, Eye, Activity, Plus, Trash2 } from "lucide-react";

export default function OperationalAuditPanel({ proposal, currentStep, updateSituation }: InputPanelProps) {
  return (
    <div className="space-y-8">
      <SectionHeader title="Operational Audit" subtitle="Identify core bottlenecks and systemic friction within the current architecture" stepNumber={currentStep + 1} />
      
      <InputGroupCard
        icon={<Eye className="w-[18px] h-[18px]" />}
        title="Audit Narrative"
        description="Situational analysis of the current operational state"
        accentColor="rose"
      >
        <div className="space-y-2">
          <LabelPremium>Narrative description</LabelPremium>
          <ModernTextArea placeholder="Describe current workflow friction and operational gaps..." value={proposal.situation.currentWorkflow} onChange={(e) => updateSituation({ currentWorkflow: e.target.value })} />
        </div>
      </InputGroupCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputGroupCard
          icon={<TrendingDown className="w-[18px] h-[18px]" />}
          title="Revenue Leakage"
          description="Quantifiable financial bleed per month"
          accentColor="orange"
        >
          <div className="space-y-2">
            <LabelPremium>Estimated Leakage</LabelPremium>
            <ModernInput placeholder="₹10k+ / Mo" value={proposal.situation.revenueLeakage} onChange={(e) => updateSituation({ revenueLeakage: e.target.value })} />
          </div>
        </InputGroupCard>

        <InputGroupCard
          icon={<AlertCircle className="w-[18px] h-[18px]" />}
          title="Inefficiency Profile"
          description="Primary nature of operational friction"
          accentColor="yellow"
        >
          <div className="space-y-2">
            <LabelPremium>Friction Profile</LabelPremium>
            <ModernInput placeholder="High Manual Overhead" value={proposal.situation.inefficiencies} onChange={(e) => updateSituation({ inefficiencies: e.target.value })} />
          </div>
        </InputGroupCard>
      </div>

      <InputGroupCard
        icon={<Activity className="w-[18px] h-[18px]" />}
        title="Critical Friction Points"
        description="Dynamic diagnosis of operational bottlenecks"
        accentColor="indigo"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <LabelPremium className="mb-0">Diagnosed Bottlenecks</LabelPremium>
            <button 
              type="button" 
              onClick={() => updateSituation({ challenges: [...proposal.situation.challenges, ""] })} 
              className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-all bg-primary/10 dark:bg-primary/5 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={10} /> Add Diagnosis
            </button>
          </div>
          
          <div className="space-y-3">
            {proposal.situation.challenges.map((challenge: string, i: number) => (
              <div key={i} className="flex gap-3 group items-center">
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  {i + 1}
                </div>
                <ModernInput 
                  placeholder={`Diagnosed friction point #${i + 1}`} 
                  value={challenge} 
                  onChange={(e) => {
                    const next = [...proposal.situation.challenges];
                    next[i] = e.target.value;
                    updateSituation({ challenges: next });
                  }} 
                />
                <button 
                  type="button" 
                  onClick={() => updateSituation({ challenges: proposal.situation.challenges.filter((_: string, idx: number) => idx !== i) })} 
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all shrink-0 border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </InputGroupCard>
    </div>
  );
}
