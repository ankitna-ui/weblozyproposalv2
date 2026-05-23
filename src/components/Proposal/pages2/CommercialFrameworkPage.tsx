import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Calculator, Cpu, ShieldCheck, TrendingUp } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CommercialFrameworkPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const calculateFinancials = () => {
    // 1. Base Valuation (Core or Modules)
    const moduleSum = (proposal?.solution?.selectedModules || []).reduce((acc, m) => {
      const priceStr = String(m.price || "0").replace(/[^0-9.]/g, "");
      const price = parseFloat(priceStr);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

    const baseVal = proposal?.pricing?.coreValuation ? parseFloat(proposal.pricing.coreValuation) : 0;
    const base = baseVal || moduleSum || 0;
    
    // 2. Discount
    const discountPctStr = String(proposal?.pricing?.discountPercentage || "0").replace(/[^0-9.]/g, "");
    const discountPct = parseFloat(discountPctStr);
    const discountAmount = base * (discountPct / 100);
    const subtotal = base - discountAmount;
    
    // 3. Final Price (As per user request: GST is EXTRA, not included in total)
    const finalPrice = subtotal;
    const taxPct = proposal?.pricing?.taxRate || "18";
    
    return {
      base,
      discountPct,
      discountAmount,
      subtotal,
      finalPrice,
      taxPct
    };
  };

  const f = calculateFinancials();
  const formatCurrency = (val: number) => `₹${Math.round(val).toLocaleString("en-IN")}`;

  return (<PageWrapper pageNum={pageNum} title="Commercial Framework">
  <div className="flex flex-col h-full">
    {/* Header Section */}
    <div className="mb-6 flex flex-col items-center text-center">
      <h2 className="text-6xl font-black tracking-tighter text-[#0B0E14] leading-none">
        Strategic <span className="text-[#99CB48]">Value</span>
      </h2>
      <div className="text-[10px] text-slate-400 tracking-wide font-black mt-2">
        Commercial framework for enterprise transformation
      </div>
    </div>

           <div className="flex-1 grid grid-cols-12 gap-6 items-start min-h-0">
              {/* Left Column: Financial Card (5 columns) */}
              <div className="col-span-5 flex flex-col h-full gap-6">
                 <div className="p-6 bg-[#0B0E14] rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl border-b-[6px] border-[#99CB48]">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] -rotate-12 translate-x-10 -translate-y-10">
                       <Calculator size={180} className="text-white" />
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                       <div className="flex justify-between items-start">
                          <div className="px-4 py-1.5 bg-[#99CB48] rounded-full text-[9px] font-black tracking-wide text-black shadow-lg">Net Investment</div>
                          <Calculator size={20} className="text-[#99CB48] opacity-50" />
                       </div>
                       
                       <div className="space-y-6">
                          {f.discountPct > 0 && (
                             <div className="flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-white/30 italic">
                                <span>Original List Price</span>
                                <span className="relative inline-block"><span className="absolute left-0 top-[50%] -translate-y-[50%] w-full h-[1.5px] bg-red-500" />{formatCurrency(f.base)}</span>
                             </div>
                          )}
                          <div className="flex flex-col">
                             <div className="text-[9px] font-black text-[#99CB48] tracking-[0.12em] mb-1">Total Valuation</div>
                             <div className="text-6xl font-black text-white tracking-tighter leading-none flex items-baseline gap-1">
                                <span className="text-[#99CB48]">{formatCurrency(f.finalPrice).substring(0, 1)}</span>
                                {formatCurrency(f.finalPrice).substring(1)}
                             </div>
                          </div>
                          
                          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                             <div className="flex justify-between items-center">
                                <div className="text-[10px] font-black tracking-wide text-white/40 italic">Exclusive of Taxation</div>
                                <div className="text-[10px] font-black text-[#99CB48] tracking-wide">+{f.taxPct}% GST Extra</div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pt-2">
                          <div className="space-y-1">
                             <div className="text-[8px] font-black tracking-wide text-white/20">Payment Mode</div>
                             <div className="text-[10px] font-black tracking-tight text-[#99CB48]">Phase-Based</div>
                          </div>
                          <div className="space-y-1">
                             <div className="text-[8px] font-black tracking-wide text-white/20">Delivery Time</div>
                             <div className="text-[10px] font-black tracking-tight text-[#99CB48]">30 Days</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[3rem] relative mt-auto">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-[#99CB48] rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <TrendingUp size={20} />
                       </div>
                       <div className="text-[10px] font-black tracking-[0.12em] text-slate-400">ROI Justification</div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-relaxed italic">
                       {proposal?.pricing?.roiLogic || "The investment is optimized for high-yield operational efficiency, with a projected systemic ROI realized through automated cost reduction."}
                    </div>
                 </div>
              </div>

              {/* Right Column: Milestones & Infrastructure (7 columns) */}
              <div className="col-span-7 flex flex-col h-full gap-6">
                 <div className="flex-1 min-h-0 space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mx-2">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#99CB48]" />
                          <div className="text-[12px] font-black tracking-[0.12em] text-slate-900">Roadmap Protocol</div>
                       </div>
                       <div className="text-[10px] font-black text-[#99CB48] tracking-wide bg-[#99CB48]/10 px-3 py-1 rounded-full">Payment Schedule</div>
                    </div>
                    
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                       {(proposal?.pricing?.milestones?.length > 0 ? proposal.pricing.milestones : [
                          { name: "Initiation Protocol", percentage: 40, description: "System blueprint & environment setup" },
                          { name: "Core Architecture", percentage: 40, description: "Backend logic & primary UI modules" },
                          { name: "Final Deployment", percentage: 20, description: "UAT, optimization & handoff" }
                       ]).map((m, i) => {
                          const mCount = proposal?.pricing?.milestones?.length || 3;
                          const isDense = mCount > 6;
                          return (
                             <div key={i} className={`flex items-center justify-between bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-sm ${isDense ? 'p-2 px-4' : 'p-4 px-6'}`}>
                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                   <div className="shrink-0">
                                      <div className={`${isDense ? 'w-7 h-7 rounded-lg' : 'w-10 h-10 rounded-xl'} bg-slate-900 flex flex-col items-center justify-center text-white shadow-lg`}>
                                         <span className={`${isDense ? 'text-[8px]' : 'text-[11px]'} font-black leading-tight`}>{m.percentage}</span>
                                         <span className="text-[4px] font-black tracking-tighter opacity-50">%</span>
                                      </div>
                                   </div>
                                   <div className="min-w-0 flex-1">
                                      <div className={`${isDense ? 'text-[10px]' : 'text-[12px]'} font-extrabold text-slate-900 tracking-tight leading-tight`}>{m.name}</div>
                                      {!isDense && (
                                         <div className="text-[9px] font-medium text-slate-500 mt-0.5 leading-tight">{m.description}</div>
                                      )}
                                   </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0 ml-4">
                                   <div className={`${isDense ? 'text-[8px]' : 'text-[11px]'} font-black text-slate-900`}>{formatCurrency(f.finalPrice * (parseFloat(String(m.percentage))/100))}</div>
                                   {!isDense && (
                                      <div className="text-[6px] font-black text-slate-300 tracking-tighter">Value</div>
                                   )}
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 <div className="p-6 bg-slate-900 rounded-[3rem] text-white shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                       <div className="space-y-1">
                          <div className="text-[10px] font-black tracking-[0.12em] text-[#99CB48]">Service Protocol</div>
                          <h3 className="text-xl font-black tracking-tighter leading-none">Maintenance & Infrastructure</h3>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-4 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-2">
                             <Cpu size={10} className="text-[#99CB48]" />
                             <div className="text-[8px] font-black tracking-wide text-white/40">Cloud</div>
                          </div>
                          <div className="text-[12px] font-black text-white">{proposal?.pricing?.hostingCost || "At Actuals"}</div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-3xl border border-white/5 space-y-1">
                          <div className="flex items-center gap-2">
                             <ShieldCheck size={10} className="text-[#99CB48]" />
                             <div className="text-[8px] font-black tracking-wide text-white/40">Support</div>
                          </div>
                          <div className="text-[12px] font-black text-white">{proposal?.pricing?.maintenanceCost || "SLA Based"}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Section */}
           <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#99CB48] shadow-sm">
                       <Calculator size={20} />
                    </div>
                    <div className="space-y-0.5">
                       <div className="text-[11px] font-black text-slate-900 tracking-tight">Commercial Integrity</div>
                       <div className="text-[9px] font-bold text-slate-400 tracking-tight">Financial framework optimized for ROI</div>
                    </div>
                 </div>
              </div>
              <div className="text-center">
  <div className="text-[7px] font-black text-slate-300 tracking-wide italic">Protocol ID: WBL-2024-ARCH</div>
</div>
           </div>
        </div>
    </PageWrapper>
  );
};

export default CommercialFrameworkPage;
