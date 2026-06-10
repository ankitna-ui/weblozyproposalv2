import { Button } from "@/components/ui/button";
import { Trash2, Globe, Plus, ShieldCheck, FileText, Share2, Layers } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea, InputGroupCard } from "./shared";

export default function StrategicEcosystemPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  const integrationsList = proposal.solution.integrations || [];
  const pillarsList = proposal.solution.approachPoints || [];
  const rolesList = proposal.solution.userRoles?.length > 0 
    ? proposal.solution.userRoles 
    : ["Master Administrator|Complete system control & strategic management", "Operator Node|Routine operational workflows & task execution"];

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader title="Strategic Architecture" subtitle="Define the structural pillars, connectivity hub, and organizational hierarchy" stepNumber={currentStep + 1} />
      
      {/* Narrative Card */}
      <InputGroupCard
        icon={<FileText className="w-[18px] h-[18px]" />}
        title="Strategic Approach Narrative"
        description="Describe the core transformation strategy and systemic friction resolutions"
        accentColor="primary"
      >
        <div className="space-y-2">
          <LabelPremium>Approach description</LabelPremium>
          <ModernTextArea className="min-h-[140px]" placeholder="Describe the core transformation strategy and how it solves systemic friction..." value={proposal.solution.approach} onChange={(e) => updateSolution({ approach: e.target.value })} />
        </div>
      </InputGroupCard>

      {/* Connectivity Hub Card */}
      <InputGroupCard
        icon={<Share2 className="w-[18px] h-[18px]" />}
        title="Connectivity Hub"
        description="System integration nodes and external APIs"
        accentColor="blue"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <LabelPremium className="mb-0">System Nodes</LabelPremium>
            <button 
              type="button" 
              onClick={() => updateSolution({ integrations: [...integrationsList, ""] })} 
              className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-all bg-primary/10 dark:bg-primary/5 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={10} /> Add Node
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationsList.map((link: string, i: number) => (
              <div key={i} className="flex gap-3 group items-center bg-white dark:bg-[#131720]/45 p-2 pr-4 rounded-[1.25rem] border border-slate-100 dark:border-white/5 shadow-sm hover:border-blue-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                   <Globe size={18} />
                </div>
                <ModernInput 
                  className="h-10 border-none shadow-none focus-visible:ring-0 px-0 text-[13px] font-bold bg-transparent" 
                  placeholder="e.g. CRM Integration | https://api.crm.com" 
                  value={link} 
                  onChange={(e) => {
                    const next = [...integrationsList];
                    next[i] = e.target.value;
                    updateSolution({ integrations: next });
                  }} 
                />
                <button 
                  type="button" 
                  onClick={() => updateSolution({ integrations: integrationsList.filter((_: string, idx: number) => idx !== i) })} 
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            {integrationsList.length === 0 && (
              <div className="col-span-full py-8 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
                 <Globe size={24} className="opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Connectivity Nodes</p>
              </div>
            )}
          </div>
        </div>
      </InputGroupCard>

      {/* Pillars Card */}
      <InputGroupCard
        icon={<Layers className="w-[18px] h-[18px]" />}
        title="Implementation Pillars"
        description="Primary strategic tenets of delivery"
        accentColor="purple"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <LabelPremium className="mb-0">Pillar list</LabelPremium>
            <button 
              type="button" 
              onClick={() => updateSolution({ approachPoints: [...pillarsList, ""] })} 
              className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-all bg-primary/10 dark:bg-primary/5 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={10} /> Add Pillar
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarsList.map((point: string, i: number) => (
              <div key={i} className="flex gap-3 items-center bg-white dark:bg-[#131720]/45 p-2 pr-4 rounded-[1.25rem] border border-slate-100 dark:border-white/5 shadow-sm hover:border-purple-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 font-black italic text-[11px]">
                   0{i+1}
                </div>
                <ModernInput 
                  className="h-10 border-none shadow-none focus-visible:ring-0 px-0 text-[13px] font-bold bg-transparent" 
                  placeholder="Strategic Pillar Protocol" 
                  value={point} 
                  onChange={(e) => {
                    const next = [...pillarsList];
                    next[i] = e.target.value;
                    updateSolution({ approachPoints: next });
                  }} 
                />
                <button 
                  type="button" 
                  onClick={() => updateSolution({ approachPoints: pillarsList.filter((_: string, idx: number) => idx !== i) })} 
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </InputGroupCard>

      {/* Access Hierarchy Card */}
      <InputGroupCard
        icon={<ShieldCheck className="w-[18px] h-[18px]" />}
        title="User Access Hierarchy"
        description="System authority nodes & user role permissions"
        accentColor="emerald"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-2">
            <LabelPremium className="mb-0">Strategic Roles</LabelPremium>
            <button 
              type="button"
              onClick={() => updateSolution({ userRoles: [...rolesList, "New Strategic Role|Define access permissions..."] })} 
              className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-all bg-primary/10 dark:bg-primary/5 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={10} /> Add Access Node
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rolesList.map((roleStr: string, rIdx: number) => {
              const [title, desc] = (roleStr || "|").split("|");
              return (
                <div key={rIdx} className="group relative bg-white dark:bg-[#131720]/30 border border-slate-100 dark:border-white/5 hover:border-emerald-500/20 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="absolute -top-3 -left-3 w-9 h-9 bg-slate-50 dark:bg-[#0B0E14] rounded-xl flex items-center justify-center text-slate-900 dark:text-white shadow border border-slate-100 dark:border-white/5">
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <ModernInput 
                      className="h-10 bg-slate-50 dark:bg-[#0B0E14]/40 border-none rounded-xl font-black uppercase tracking-tight text-slate-900 dark:text-white" 
                      placeholder="Role Title" 
                      value={title} 
                      onChange={(e) => {
                        const next = [...rolesList];
                        next[rIdx] = `${e.target.value}|${desc}`;
                        updateSolution({ userRoles: next });
                      }}
                    />
                    <ModernTextArea 
                      className="bg-slate-50 dark:bg-[#0B0E14]/40 border-none rounded-xl text-[11px] font-semibold text-slate-500 min-h-[80px]" 
                      placeholder="Responsibilities & Permissions..." 
                      value={desc} 
                      onChange={(e) => {
                        const next = [...rolesList];
                        next[rIdx] = `${title}|${e.target.value}`;
                        updateSolution({ userRoles: next });
                      }}
                    />
                  </div>

                  <button 
                    onClick={() => updateSolution({ userRoles: rolesList.filter((_: string, i: number) => i !== rIdx) })} 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1.5 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </InputGroupCard>
    </div>
  );
}
