import { Trash2, ImagePlus, Link2, MonitorPlay } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function OperationalFlowchartPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  return (
    <div className="space-y-10 pb-10">
      <SectionHeader 
        title="Logic Architecture" 
        subtitle="Visualize the operational flowchart and configure real-time demo access" 
        stepNumber={currentStep + 1} 
      />

      <div className="space-y-8">
        {/* Flowchart Section - Premium Upload Area */}
        <div className="space-y-4">
          <LabelPremium>Operational Flowchart Protocol</LabelPremium>
          {proposal.solution.flowchartImageUrl && proposal.solution.flowchartImageUrl.startsWith('data:') ? (
            <div className="relative group rounded-[3rem] overflow-hidden border border-primary/20 bg-slate-50 aspect-video shadow-2xl">
              <img src={proposal.solution.flowchartImageUrl} alt="Flowchart" className="w-full h-full object-contain p-10" />
              <button 
                onClick={() => updateSolution({ flowchartImageUrl: "" })} 
                className="absolute top-6 right-6 p-4 bg-white rounded-2xl text-red-500 shadow-2xl hover:scale-110 transition-all border border-slate-100"
              >
                <Trash2 size={24} />
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
              <div className="h-[280px] border-2 border-dashed border-slate-200 rounded-[3rem] bg-white flex flex-col items-center justify-center gap-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500 shadow-sm group-hover:shadow-xl">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 shadow-inner flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors group-hover:rotate-6">
                   <ImagePlus size={32} />
                </div>
                <div className="text-center">
                   <p className="text-[11px] font-black uppercase text-slate-900 tracking-[0.3em]">Upload System Logic</p>
                   <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">PNG, JPG or SVG Architecture</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <LabelPremium>Cloud Storage Link (Fallback)</LabelPremium>
            <div className="relative group">
               <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
               <ModernInput 
                 className="pl-12" 
                 placeholder="https://cdn.link.com/flow.png" 
                 value={proposal.solution.flowchartImageUrl && !proposal.solution.flowchartImageUrl.startsWith('data:') ? proposal.solution.flowchartImageUrl : ""} 
                 onChange={(e) => updateSolution({ flowchartImageUrl: e.target.value })} 
               />
            </div>
          </div>

          <div className="space-y-2">
            <LabelPremium>Operational Demo Protocol</LabelPremium>
            <div className="relative group">
               <MonitorPlay className="absolute left-4 top-1/2 -translate-y-1/2 text-primary shadow-[0_0_10px_#99CB48]" size={18} />
               <ModernInput 
                 className="pl-12 border-primary/20 focus-visible:ring-primary/50" 
                 placeholder="https://demo.weblozy.com" 
                 value={proposal.solution.demoLink || ""} 
                 onChange={(e) => updateSolution({ demoLink: e.target.value })} 
               />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed italic">
            <span className="text-primary mr-2">PROTOCOL:</span> The Demo Node will be rendered as a high-impact call-to-action in the strategic document, enabling stakeholders to experience the logic architecture in real-time.
         </p>
      </div>
    </div>
  );
}
