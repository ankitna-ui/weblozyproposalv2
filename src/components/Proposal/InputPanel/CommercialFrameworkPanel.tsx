import { useMemo } from "react";
import { CreditCard, Percent, Receipt, ShieldCheck, Plus, Trash2, Calculator, Server } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

export default function CommercialFrameworkPanel({ proposal, currentStep, updatePricing }: InputPanelProps) {
  
  const stats = useMemo(() => {
    const base = parseFloat(proposal.pricing.coreValuation) || 0;
    const discPct = parseFloat(proposal.pricing.discountPercentage) || 0;
    const taxPct = parseFloat(proposal.pricing.taxRate) || 18;
    
    const discAmt = base * (discPct / 100);
    const subtotal = base - discAmt;
    const total = subtotal; 
    
    return { base, discPct, discAmt, subtotal, taxPct, total };
  }, [proposal.pricing.coreValuation, proposal.pricing.discountPercentage, proposal.pricing.taxRate]);

  const addMilestone = () => {
    const milestones = proposal.pricing.milestones || [];
    updatePricing({
      milestones: [...milestones, { name: "New Milestone", percentage: 0, description: "" }]
    });
  };

  const removeMilestone = (idx: number) => {
    const milestones = proposal.pricing.milestones.filter((_: any, i: number) => i !== idx);
    updatePricing({ milestones });
  };

  const updateMilestone = (idx: number, data: any) => {
    const milestones = [...proposal.pricing.milestones];
    milestones[idx] = { ...milestones[idx], ...data };
    updatePricing({ milestones });
  };

  const formatINR = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8 pb-10">
      <SectionHeader 
        title="Commercial Alignment" 
        subtitle="Configure the investment framework and structured financial roadmap" 
        stepNumber={currentStep + 1} 
      />

      {/* ──── VALUATION MATRIX ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <LabelPremium className="mb-0 text-slate-800 text-[10px]">Project Valuation (Base)</LabelPremium>
            <CreditCard size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <div className="relative">
             <ModernInput 
                type="number" 
                className="h-11 pl-9 pr-3 text-base font-semibold text-slate-800 border-slate-200/80 focus-visible:ring-primary rounded-xl" 
                placeholder="0,00,000"
                value={proposal.pricing.coreValuation} 
                onChange={(e) => updatePricing({ coreValuation: e.target.value })} 
             />
             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
          </div>
        </div>

        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <LabelPremium className="mb-0 text-slate-800 text-[10px]">Strategic Discount</LabelPremium>
            <Percent size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <div className="relative">
             <ModernInput 
                type="number" 
                className="h-11 pl-4 pr-9 text-base font-semibold text-emerald-600 border-slate-200/80 focus-visible:ring-primary rounded-xl" 
                placeholder="0"
                value={proposal.pricing.discountPercentage} 
                onChange={(e) => updatePricing({ discountPercentage: e.target.value })} 
             />
             <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">%</span>
          </div>
        </div>
      </div>

      {/* ──── CALCULATION ENGINE (PREMIUM DARK) ──── */}
      <div className="p-6 sm:p-8 bg-[#0B0E14] rounded-2xl text-white relative overflow-hidden shadow-xl border border-white/5">
         <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 scale-150 pointer-events-none">
            <Calculator size={180} className="text-primary" />
         </div>
         
         <div className="relative z-10 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
               <div className="flex items-center gap-2 text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Investment Synthesis</span>
               </div>
               <div className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  Calculated Live
               </div>
            </div>
            
            {/* Investment Pointers */}
            <div className="space-y-3.5 max-w-full">
               <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-white/40 font-black uppercase tracking-wider text-[9px]">Gross Valuation</span>
                  <span className="font-bold text-white/90">{formatINR(stats.base)}</span>
               </div>
               {stats.discAmt > 0 && (
                 <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="text-emerald-400/40 font-black uppercase tracking-wider text-[9px]">Strategic Relief ({stats.discPct}%)</span>
                    <span className="font-bold text-emerald-400">- {formatINR(stats.discAmt)}</span>
                 </div>
               )}
               <div className="flex justify-between items-center">
                  <span className="text-white/40 font-black uppercase tracking-wider text-[9px]">Current Tax (GST)</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-white/25">RATE</span>
                     <input 
                        type="number" 
                        className="w-10 h-7 bg-white/5 border border-white/10 rounded-md text-center text-xs font-bold py-0.5 focus:outline-none focus:border-primary/40 focus:bg-[#0B0E14] text-white" 
                        value={proposal.pricing.taxRate || 18} 
                        onChange={(e) => updatePricing({ taxRate: e.target.value })}
                     />
                     <span className="text-[9px] font-black text-white/25">%</span>
                  </div>
               </div>
            </div>

            {/* Net Capital Commitment Sub-card (Full Width) */}
            <div className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl space-y-2">
               <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Net Capital Commitment</div>
               <div className="flex flex-wrap items-baseline gap-2">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none select-all">{formatINR(stats.total)}</div>
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">+ GST Extra</div>
               </div>
               <p className="text-[8px] font-medium text-white/20 uppercase tracking-wider leading-relaxed">
                  * Final valuation subject to milestone alignment and service level specifications.
               </p>
            </div>
         </div>
      </div>

      {/* ──── SUPPORTING OVERHEADS ──── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <LabelPremium className="mb-0 text-slate-800 text-[10px]">Infrastructure (Cloud)</LabelPremium>
            <Server size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <ModernInput 
            className="h-11 px-3.5 text-sm font-semibold text-slate-800 border-slate-200/80 focus-visible:ring-primary rounded-xl" 
            placeholder="e.g. Billed at Actuals / Monthly"
            value={proposal.pricing.hostingCost} 
            onChange={(e) => updatePricing({ hostingCost: e.target.value })} 
          />
        </div>
        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-1">
            <LabelPremium className="mb-0 text-slate-800 text-[10px]">Maintenance Protocol</LabelPremium>
            <ShieldCheck size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <ModernInput 
            className="h-11 px-3.5 text-sm font-semibold text-slate-800 border-slate-200/80 focus-visible:ring-primary rounded-xl" 
            placeholder="e.g. 15% Annual Post-Warranty"
            value={proposal.pricing.maintenanceCost} 
            onChange={(e) => updatePricing({ maintenanceCost: e.target.value })} 
          />
        </div>
      </div>

      {/* ──── MILESTONE ROADMAP ──── */}
      <div className="space-y-6 bg-slate-50/40 p-6 sm:p-8 rounded-2xl border border-slate-100/80 shadow-sm">
        <div className="flex justify-between items-center px-1">
           <div className="space-y-0.5">
              <LabelPremium className="mb-0 text-slate-800 text-[10px]">Investment Roadmap</LabelPremium>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Defined Payment Milestones & Deliverables</p>
           </div>
           <button 
             onClick={addMilestone} 
             className="text-[9px] font-bold uppercase text-primary hover:text-white hover:bg-primary px-4 py-2 border border-primary/20 rounded-xl transition-all shadow-sm bg-white"
           >
             + Add Milestone
           </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
           {proposal.pricing.milestones?.map((m: any, i: number) => (
              <div key={i} className="relative group bg-white p-5 rounded-xl border border-slate-100 hover:border-primary/20 transition-all duration-300 shadow-sm flex gap-4 items-start">
                 <div className="w-10 h-10 bg-[#0B0E14] rounded-xl flex items-center justify-center font-black text-white text-sm italic shrink-0 shadow-md -rotate-3 group-hover:rotate-0 transition-transform">
                    {String(i + 1).padStart(2, '0')}
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                       <div className="md:col-span-9 space-y-3">
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold uppercase text-slate-300 tracking-widest pl-0.5">Milestone Phase</p>
                             <ModernInput 
                               className="bg-transparent border-b border-transparent focus:border-slate-200 font-semibold text-slate-800 p-0 h-8 text-sm focus:bg-white focus:px-2 rounded transition-all" 
                               placeholder="e.g. System Blueprint & Initiation"
                               value={m.name} 
                               onChange={(e) => updateMilestone(i, { name: e.target.value })} 
                             />
                          </div>
                          <ModernTextArea 
                            className="bg-slate-50 border border-slate-100/50 text-xs font-medium text-slate-500 p-3 min-h-[60px] focus:bg-white focus:border-primary/20 rounded-lg transition-all" 
                            placeholder="Describe the scope and delivery logic for this phase..."
                            value={m.description} 
                            onChange={(e) => updateMilestone(i, { description: e.target.value })} 
                          />
                       </div>
                       <div className="md:col-span-3">
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold uppercase text-slate-300 tracking-widest pl-0.5">Allocation (%)</p>
                             <div className="relative">
                                <ModernInput 
                                  type="number"
                                  className="h-10 pl-3 pr-8 font-semibold text-primary text-sm bg-slate-50 border border-slate-100/50 rounded-lg focus-visible:ring-primary focus:bg-white text-center" 
                                  value={m.percentage} 
                                  onChange={(e) => updateMilestone(i, { percentage: e.target.value })} 
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/45 font-bold text-xs">%</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => removeMilestone(i)} 
                   className="absolute top-4 right-4 p-1.5 bg-red-50 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 border border-red-100/50"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>
           ))}
        </div>
      </div>

      {/* ──── ROI LOGIC ──── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
           <LabelPremium className="mb-0 text-slate-800 text-[10px]">ROI Settlement Protocol</LabelPremium>
           <span className="text-[8px] font-bold uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Financial Logic</span>
        </div>
        <ModernTextArea 
          className="min-h-[120px] p-4 text-sm font-medium text-slate-700 leading-relaxed rounded-xl border border-slate-200/80 focus-visible:ring-primary focus-visible:ring-offset-0 focus:border-primary/40 focus:bg-white transition-all bg-slate-50/20" 
          placeholder="Clarify the settlement logic. E.g., 'Payment for each phase is due upon successful deployment to the staging environment and client protocol sign-off...'" 
          value={proposal.pricing.roiLogic} 
          onChange={(e) => updatePricing({ roiLogic: e.target.value })} 
        />
      </div>
    </div>
  );
}
