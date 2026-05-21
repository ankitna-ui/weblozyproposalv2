import { Monitor, Link2, Tag, Layout } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

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

  return (
    <div className="space-y-12 pb-10">
      <SectionHeader 
        title="Success Protocol" 
        subtitle="Curate the high-impact project portfolio and active digital deployments" 
        stepNumber={currentStep + 1} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0B0E14] rounded-xl flex items-center justify-center text-white text-[11px] font-black italic shadow-md rotate-3 group-hover:rotate-0 transition-transform">
                  0{idx + 1}
                </div>
                <LabelPremium className="mb-0 text-slate-900 text-[8px]">Deployment Node</LabelPremium>
              </div>
              <Monitor size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest pl-1">Project/Client Title</p>
                <div className="relative">
                  <ModernInput 
                    className="h-12 pl-10 pr-3 font-bold text-slate-800 text-sm border-slate-100/80 focus-visible:ring-primary rounded-xl" 
                    placeholder="e.g. Enterprise Asset Management"
                    value={getProjectValue(idx, 0)} 
                    onChange={(e) => updateProject(idx, 'title', e.target.value)} 
                  />
                  <Layout className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest pl-1">Live Asset URL</p>
                <div className="relative">
                  <ModernInput 
                    className="h-12 pl-10 pr-3 font-bold text-primary text-xs border-slate-100/80 focus-visible:ring-primary rounded-xl" 
                    placeholder="e.g. app.domain.com"
                    value={getProjectValue(idx, 1)} 
                    onChange={(e) => updateProject(idx, 'url', e.target.value)} 
                  />
                  <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-300 tracking-widest pl-1">Protocol / Sector Category</p>
                <div className="relative">
                  <ModernInput 
                    className="h-12 pl-10 pr-3 font-bold text-slate-600 text-xs border-slate-100/80 focus-visible:ring-primary rounded-xl" 
                    placeholder="e.g. Industrial Automation / Fintech"
                    value={getProjectValue(idx, 2)} 
                    onChange={(e) => updateProject(idx, 'category', e.target.value)} 
                  />
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-[#0B0E14] rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Monitor size={100} className="text-primary" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#99CB48]" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Institutional Identity Protocol Verified</p>
        </div>
        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
          SYSTEM NODE: LIVE-WBL-2026
        </span>
      </div>
    </div>
  );
}
