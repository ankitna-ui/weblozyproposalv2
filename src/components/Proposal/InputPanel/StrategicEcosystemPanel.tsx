import { Button } from "@/components/ui/button";
import { Trash2, Globe, Plus, ShieldCheck } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

export default function StrategicEcosystemPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-12 pb-20">
      <SectionHeader title="Strategic Architecture" subtitle="Define the structural pillars, connectivity hub, and organizational hierarchy" stepNumber={currentStep + 1} />
      
      <div className="grid grid-cols-1 gap-10">
        <div className="space-y-3">
          <LabelPremium>Strategic Approach Narrative</LabelPremium>
          <ModernTextArea className="min-h-[140px]" placeholder="Describe the core transformation strategy and how it solves systemic friction..." value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <LabelPremium className="mb-0">Connectivity Hub (System Nodes)</LabelPremium>
            <button type="button" onClick={() => updateSolution({ integrations: [...(proposal.solution.integrations || []), ""] })} className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-1.5 rounded-full">+ Add Node</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(proposal.solution.integrations || []).map((link, i) => (
              <div key={i} className="flex gap-3 group items-center bg-white p-2 pr-4 rounded-[1.25rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                   <Globe size={18} />
                </div>
                <ModernInput 
                  className="h-10 border-none shadow-none focus-visible:ring-0 px-0 text-[13px] font-bold" 
                  placeholder="e.g. CRM Integration | https://api.crm.com" 
                  value={link} 
                  onChange={(e) => {
                    const next = [...(proposal.solution.integrations || [])];
                    next[i] = e.target.value;
                    updateSolution({ integrations: next });
                  }} 
                />
                <button type="button" onClick={() => updateSolution({ integrations: proposal.solution.integrations.filter((_, idx) => idx !== i) })} className="text-slate-300 hover:text-red-500 transition-colors">×</button>
              </div>
            ))}
            {(proposal.solution.integrations?.length === 0 || !proposal.solution.integrations) && (
              <div className="col-span-full py-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 gap-2">
                 <Globe size={24} className="opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Connectivity Nodes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <LabelPremium className="mb-0">Implementation Pillars</LabelPremium>
          <button type="button" onClick={() => updateSolution({ approachPoints: [...(proposal.solution.approachPoints || []), ""] })} className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-1.5 rounded-full">+ Add Pillar</button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {(proposal.solution.approachPoints || []).map((point: string, i: number) => (
            <div key={i} className="flex gap-3 items-center bg-white p-2 pr-4 rounded-[1.25rem] border border-slate-100 shadow-sm group transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-black italic text-[11px]">
                 0{i+1}
              </div>
              <ModernInput 
                className="h-10 border-none shadow-none focus-visible:ring-0 px-0 text-[13px] font-bold" 
                placeholder={`Strategic Pillar Protocol`} 
                value={point} 
                onChange={(e) => {
                  const next = [...(proposal.solution.approachPoints || [])];
                  next[i] = e.target.value;
                  updateSolution({ approachPoints: next });
                }} 
              />
              <button type="button" onClick={() => updateSolution({ approachPoints: proposal.solution.approachPoints.filter((_: string, idx: number) => idx !== i) })} className="text-slate-300 hover:text-red-500 transition-colors">×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-10 border-t border-slate-100 pt-12">
        <div className="flex justify-between items-center">
           <div className="space-y-1.5">
             <LabelPremium className="mb-0 text-slate-900">User Access Hierarchy</LabelPremium>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">System authority nodes & permissions</p>
           </div>
           <Button 
             onClick={() => updateSolution({ userRoles: [...(proposal.solution.userRoles || []), "New Strategic Role|Define access permissions..."] })} 
             className="bg-[#0B0E14] hover:bg-black text-white rounded-2xl px-8 h-12 text-[10px] font-black uppercase tracking-widest shadow-2xl"
           >
             <Plus size={16} className="mr-2 text-primary" /> Add Access Node
           </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).map((roleStr, rIdx) => {
            const [title, desc] = (roleStr || "|").split("|");
            return (
              <div key={rIdx} className="group relative bg-white border border-slate-100 hover:border-primary/20 rounded-[2.5rem] p-8 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-white text-[12px] font-black italic shadow-2xl border-4 border-white rotate-3">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                
                <div className="space-y-5 pt-2">
                  <ModernInput 
                    className="h-10 bg-slate-50/50 border-none rounded-xl font-black uppercase tracking-tight text-slate-900" 
                    placeholder="Role Title" 
                    value={title} 
                    onChange={(e) => {
                      const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                      next[rIdx] = `${e.target.value}|${desc}`;
                      updateSolution({ userRoles: next });
                    }}
                  />
                  <ModernTextArea 
                    className="bg-slate-50/50 border-none rounded-xl text-[11px] font-bold text-slate-500 min-h-[80px]" 
                    placeholder="Responsibilities & Permissions..." 
                    value={desc} 
                    onChange={(e) => {
                      const next = [...(proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"])];
                      next[rIdx] = `${title}|${e.target.value}`;
                      updateSolution({ userRoles: next });
                    }}
                  />
                </div>

                <button 
                  onClick={() => updateSolution({ userRoles: (proposal.solution.userRoles?.length > 0 ? proposal.solution.userRoles : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"]).filter((_: string, i: number) => i !== rIdx) })} 
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2 bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
