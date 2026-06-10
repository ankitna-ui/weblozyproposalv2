import { Monitor, Link2, Tag, Layout } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";

export default function PortfolioProtocolPanel({ proposal, currentStep, updateExperience }: InputPanelProps) {
  
  const updateProject = (idx: number, field: 'title' | 'url' | 'category', value: string) => {
    const next = [...proposal.experience.portfolioLinks];
    const current = next[idx] || "||";
    const parts = current.split('|');
    
    if (field === 'title') parts[0] = value;
    if (field === 'url') parts[1] = value;
    if (field === 'category') parts[2] = value;
    
    next[idx] = parts.join('|');
    updateExperience({ portfolioLinks: next });
  };

  const getProjectValue = (idx: number, partIdx: number) => {
    const current = proposal.experience.portfolioLinks[idx] || "||";
    return current.split('|')[partIdx] || "";
  };

  const colors = ["blue", "purple", "emerald", "orange"];

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="Success Protocol" 
        subtitle="Curate the high-impact project portfolio and active digital deployments" 
        stepNumber={currentStep + 1} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1, 2, 3].map((idx) => {
          const color = colors[idx % colors.length];
          return (
            <InputGroupCard
              key={idx}
              icon={<Monitor className="w-[18px] h-[18px]" />}
              title={`Deployment Node 0${idx + 1}`}
              description="Project portfolio asset parameters"
              accentColor={color}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <LabelPremium>Project/Client Title</LabelPremium>
                  <div className="relative">
                    <ModernInput 
                      className="pl-10" 
                      placeholder="e.g. Enterprise Asset Management"
                      value={getProjectValue(idx, 0)} 
                      onChange={(e) => updateProject(idx, 'title', e.target.value)} 
                    />
                    <Layout className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                </div>

                <div className="space-y-1">
                  <LabelPremium>Live Asset URL</LabelPremium>
                  <div className="relative">
                    <ModernInput 
                      className="pl-10 text-primary text-xs" 
                      placeholder="e.g. app.domain.com"
                      value={getProjectValue(idx, 1)} 
                      onChange={(e) => updateProject(idx, 'url', e.target.value)} 
                    />
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
                  </div>
                </div>

                <div className="space-y-1">
                  <LabelPremium>Protocol / Sector Category</LabelPremium>
                  <div className="relative">
                    <ModernInput 
                      className="pl-10 text-xs text-slate-600 dark:text-gray-400" 
                      placeholder="e.g. Industrial Automation / Fintech"
                      value={getProjectValue(idx, 2)} 
                      onChange={(e) => updateProject(idx, 'category', e.target.value)} 
                    />
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                </div>
              </div>
            </InputGroupCard>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 dark:bg-[#0B0E14] border border-slate-100 dark:border-white/5 rounded-3xl text-slate-900 dark:text-white flex items-center justify-between overflow-hidden relative shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Monitor size={100} className="text-[#99CB48]" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#99CB48]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white/90">Institutional Identity Protocol Verified</p>
        </div>
        <span className="text-[9px] font-black text-slate-900 dark:text-white/30 uppercase tracking-widest bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 px-4 py-1.5 rounded-full">
          SYSTEM NODE: LIVE-WBL-2026
        </span>
      </div>
    </div>
  );
}
