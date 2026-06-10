import { Trash2, ImagePlus, Link2, MonitorPlay } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";

export default function OperationalFlowchartPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-6 pb-10">
      <SectionHeader 
        title="Logic Architecture" 
        subtitle="Visualize the operational flowchart and configure real-time demo access" 
        stepNumber={currentStep + 1} 
      />

      {/* Flowchart Section - Premium Upload Area */}
      <InputGroupCard
        icon={<ImagePlus className="w-[18px] h-[18px]" />}
        title="Operational Flowchart Protocol"
        description="PNG, JPG or SVG Architecture file upload"
        accentColor="primary"
      >
        {proposal.solution.flowchartImageUrl && proposal.solution.flowchartImageUrl.startsWith('data:') ? (
          <div className="relative group rounded-[2rem] overflow-hidden border border-primary/20 bg-slate-50 dark:bg-white/5 aspect-video shadow-lg">
            <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-10" />
            <button 
              onClick={() => updateSolution({ flowchartImageUrl: "" })} 
              className="absolute top-4 right-4 p-3 bg-white dark:bg-white/5 rounded-xl text-red-500 shadow-md hover:scale-105 transition-all border border-slate-100 dark:border-white/5"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => updateSolution({ flowchartImageUrl: reader.result as string });
                  reader.readAsDataURL(file);
                }
              }} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className="h-[200px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 flex flex-col items-center justify-center gap-4 group-hover:border-primary/50 group-hover:bg-[#99CB48]/5 transition-all duration-300 shadow-sm">
              <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-white/5 shadow-inner flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                 <ImagePlus size={24} />
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-wider">Upload System Logic</p>
                 <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Select PNG, JPG or SVG</p>
              </div>
            </div>
          </div>
        )}
      </InputGroupCard>

      {/* Cloud & Demo links Card */}
      <InputGroupCard
        icon={<MonitorPlay className="w-[18px] h-[18px]" />}
        title="Access Protocols & Demos"
        description="Configure cloud hosting logic and real-time interactive demo links"
        accentColor="blue"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <LabelPremium>Cloud Storage Link (Fallback)</LabelPremium>
            <div className="relative group">
               <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
               <ModernInput 
                 className="pl-10" 
                 placeholder="https://cdn.link.com/flow.png" 
                 value={proposal.solution.flowchartImageUrl && !proposal.solution.flowchartImageUrl.startsWith('data:') ? proposal.solution.flowchartImageUrl : ""} 
                 onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} 
               />
            </div>
          </div>

          <div className="space-y-2">
            <LabelPremium>Operational Demo Protocol</LabelPremium>
            <div className="relative group">
               <MonitorPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
               <ModernInput 
                 className="pl-10 border-primary/20 focus-visible:ring-primary/50" 
                 placeholder="e.g. https://demo.yourdomain.com" 
                 value={proposal.solution.demoLink || ""} 
                 onChange={(e) => updateSolution({ demoLink: e.target.value })} 
               />
            </div>
          </div>
        </div>
      </InputGroupCard>

      <div className="p-6 bg-slate-900 dark:bg-black/20 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-inner">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-primary mr-2">PROTOCOL:</span> The Demo Node will be rendered as a high-impact call-to-action in the strategic document, enabling stakeholders to experience the logic architecture in real-time.
         </p>
      </div>
    </div>
  );
}
