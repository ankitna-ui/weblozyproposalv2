import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { 
  Calculator, 
  Percent, 
  CreditCard, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Cloud, 
  Headset, 
  ShieldCheck, 
  FileText, 
  Target, 
  Shield, 
  Timer, 
  Users 
} from "lucide-react";
import commercialIllustration from "@/assets/commercial_3d_illustration.png";

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

      // 3. Final Price (GST is extra, not included)
      const finalPrice = subtotal || 85000;
      const taxPct = proposal?.pricing?.taxRate || "18";

      const originalBase = base || 100000;
      const actualDiscountPct = discountPct || (base > 0 ? (discountAmount / base) * 100 : 15);

      return {
         base: originalBase,
         discountPct: actualDiscountPct,
         discountAmount: discountAmount || (originalBase - finalPrice),
         subtotal,
         finalPrice,
         taxPct
      };
   };

   const f = calculateFinancials();

   const formatCurrency = (val: number) => {
      return `₹${Math.round(val).toLocaleString("en-IN")}`;
   };

   const formatNumber = (val: number) => {
      return Math.round(val).toLocaleString("en-IN");
   };

   const rawMilestones = proposal?.pricing?.milestones || [];
   const milestones = rawMilestones.length > 0 ? rawMilestones : [
      { name: "Initiation Advance", percentage: 50, description: "Strategic Planning & Architecture Setup" },
      { name: "Development Milestone", percentage: 30, description: "Core Development & Beta Testing" },
      { name: "Final Deployment", percentage: 20, description: "UAT & Shabad Launch" }
   ];

   const mCount = milestones.length;
      // DYNAMIC STYLE CALCULATIONS TO PREVENT OVERFLOW INSIDE EXPANDED TIMELINE CARD (Supports up to 15+ milestones)
    const gapClass = 
       mCount <= 3 ? "space-y-4" : 
       mCount <= 5 ? "space-y-2.5" : 
       mCount <= 7 ? "space-y-1.5" : 
       mCount <= 10 ? "space-y-1" : 
       mCount <= 15 ? "space-y-[2px]" : "space-y-[1px]";

    const paddingClass = 
       mCount <= 3 ? "py-3 px-4" : 
       mCount <= 5 ? "py-2 px-3" : 
       mCount <= 7 ? "py-1.5 px-3" : 
       mCount <= 10 ? "py-1 px-2.5" : 
       mCount <= 15 ? "py-[2px] px-2" : "py-[1px] px-1.5";

    const titleSizeClass = 
       mCount <= 3 ? "text-[13px]" : 
       mCount <= 5 ? "text-[11.5px]" : 
       mCount <= 7 ? "text-[10.5px]" : 
       mCount <= 10 ? "text-[9.5px]" : 
       mCount <= 15 ? "text-[8.5px]" : "text-[7.5px]";

    const descSizeClass = 
       mCount <= 3 ? "text-[9.5px]" : 
       mCount <= 5 ? "text-[8.5px]" : 
       mCount <= 7 ? "text-[8px]" : "text-[7px]";

    const priceSizeClass = 
       mCount <= 3 ? "text-[13.5px]" : 
       mCount <= 5 ? "text-[11.5px]" : 
       mCount <= 7 ? "text-[10.5px]" : 
       mCount <= 10 ? "text-[9.5px]" : 
       mCount <= 15 ? "text-[8.5px]" : "text-[7.5px]";

    const badgeSizeClass = 
       mCount <= 3 ? "text-[8.5px]" : 
       mCount <= 5 ? "text-[8px]" : 
       mCount <= 7 ? "text-[7px]" : 
       mCount <= 10 ? "text-[6.5px]" : 
       mCount <= 15 ? "text-[6px]" : "text-[5px]";

    const circleSizeClass = 
       mCount <= 3 ? "w-10 h-10 text-[11px]" : 
       mCount <= 5 ? "w-8.5 h-8.5 text-[9.5px]" : 
       mCount <= 7 ? "w-7.5 h-7.5 text-[8.5px]" : 
       mCount <= 10 ? "w-7 h-7 text-[8px]" : 
       mCount <= 15 ? "w-[18px] h-[18px] text-[7px]" : "w-[16px] h-[16px] text-[6px]";

    const hideDesc = mCount >= 8;

    const titleTruncateClass = mCount <= 7 ? "whitespace-normal break-words line-clamp-2" : "truncate";
    const descTruncateClass = mCount <= 7 ? "whitespace-normal break-words line-clamp-2" : "truncate";

    const lineTopBottomClass = 
       mCount <= 3 ? "top-[33px] bottom-[33px]" :
       mCount <= 5 ? "top-[26px] bottom-[26px]" :
       mCount <= 7 ? "top-[22px] bottom-[22px]" :
       mCount <= 10 ? "top-[19px] bottom-[19px]" : 
       mCount <= 15 ? "top-[12px] bottom-[12px]" : "top-[10px] bottom-[10px]";

   return (
      <PageWrapper pageNum={pageNum} title="Commercial Framework">
         <div className="flex flex-col h-full justify-between gap-4">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center relative pb-1">
               <h2 className="text-[34px] font-black tracking-tight text-[#070b13] leading-none">
                  Strategic <span className="text-[#99CB48]">Value</span>
               </h2>
               <div className="text-[10px] text-slate-400 tracking-wide font-black mt-2">
                  Commercial framework for enterprise transformation
               </div>
               {/* Small green underline decoration */}
               <div className="w-12 h-1 bg-[#99CB48] rounded-full mt-2" />
            </div>

            {/* Main Section: Financial + ROI Stack (Left) & Roadmap Protocol (Right) */}
            <div className="grid grid-cols-12 gap-5 items-stretch flex-1">
               {/* Left Column: Stack of Financial Card & ROI Justification (col-span-5) */}
               <div className="col-span-5 flex flex-col gap-5">
                  {/* Financial Card */}
                  <div className="flex-1 flex flex-col justify-between p-6 bg-[#070b13] rounded-[2.5rem] text-white relative overflow-hidden shadow-xl min-h-[260px]">
                     {/* Decorative background logo */}
                     <div className="absolute top-0 right-0 p-6 opacity-[0.02] -rotate-12 translate-x-8 -translate-y-8 pointer-events-none">
                        <Calculator size={140} className="text-white" />
                     </div>

                     <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-center">
                           <div className="px-3 py-1 bg-[#99CB48] rounded-full text-[9px] font-black tracking-wide text-black shadow-sm">
                              Net Investment
                           </div>
                           <div className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                              <Calculator size={14} className="text-[#99CB48]" />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black tracking-[0.1em] text-white/30 uppercase">
                              <span>Original List Price</span>
                              <span className="relative inline-block font-extrabold">
                                 <span className="absolute left-0 top-[50%] -translate-y-[50%] w-full h-[2px] bg-red-500" />
                                 {formatCurrency(f.base)}
                              </span>
                           </div>

                           <div className="border-t border-dashed border-white/10 pt-4 flex flex-col">
                              <div className="text-[9px] font-black text-[#99CB48] tracking-wider uppercase">
                                 Total Valuation
                              </div>
                              <div className="text-[36px] font-black text-white tracking-tighter leading-none flex items-baseline gap-1 mt-1">
                                 <span className="text-[#99CB48] font-bold">₹</span>
                                 <span>{formatNumber(f.finalPrice)}</span>
                              </div>
                           </div>

                           <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full border border-dashed border-white/20 flex items-center justify-center shrink-0">
                                    <Percent size={10} className="text-[#99CB48]" />
                                 </div>
                                 <span className="text-[9px] font-black tracking-wide text-white/40 italic">
                                    Exclusives of Taxation
                                 </span>
                              </div>
                              <span className="text-[9.5px] font-black text-[#99CB48] tracking-wide">
                                 +{f.taxPct}% GST Extra
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                 <CreditCard size={10} className="text-[#99CB48]" />
                              </div>
                              <div>
                                 <div className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Payment Mode</div>
                                 <div className="text-[9.5px] font-black tracking-tight text-[#99CB48]">Milestone Based</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                 <Clock size={10} className="text-[#99CB48]" />
                              </div>
                              <div>
                                 <div className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Delivery Time</div>
                                 <div className="text-[9.5px] font-black tracking-tight text-[#99CB48]">{proposal?.pricing?.deliveryTime || "20 Days"}</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* ROI Justification Card */}
                  <div className="h-[185px] flex flex-col justify-between p-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shrink-0">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48] shrink-0">
                           <TrendingUp size={12} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[12px] font-black tracking-tight text-[#070b13]">ROI Justification</span>
                           <div className="w-6 h-[2px] bg-[#99CB48] rounded-full mt-0.5" />
                        </div>
                     </div>

                     <p className="text-[9.5px] font-bold text-slate-600 leading-relaxed italic pr-2 flex-1 flex items-center">
                        {proposal?.pricing?.roiLogic || "The investment is optimized for high-yield operational efficiency, with a projected systemic ROI realized through automated cost reduction."}
                     </p>

                     {/* Dynamic Graphic Chart */}
                     <div className="mt-2 flex items-end justify-between relative h-12 w-full px-2 border-b border-slate-100/50 pb-0.5 shrink-0">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 80" preserveAspectRatio="none">
                           <path
                              d="M 10 70 Q 85 58, 190 18"
                              fill="none"
                              stroke="#99CB48"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                           />
                           <polygon points="190,18 180,20 186,27" fill="#99CB48" />
                        </svg>
                        <div className="w-[10%] bg-[#99CB48]/10 h-[15%] rounded-t-sm" />
                        <div className="w-[10%] bg-[#99CB48]/20 h-[25%] rounded-t-sm" />
                        <div className="w-[10%] bg-[#99CB48]/30 h-[40%] rounded-t-sm" />
                        <div className="w-[10%] bg-[#99CB48]/50 h-[55%] rounded-t-sm" />
                        <div className="w-[10%] bg-[#99CB48]/70 h-[75%] rounded-t-sm" />
                        <div className="w-[10%] bg-[#99CB48]/90 h-[90%] rounded-t-sm" />
                     </div>
                  </div>
               </div>

               {/* Right Column: Roadmap Protocol Timeline (col-span-7) */}
               <div className="col-span-7 flex flex-col justify-between bg-slate-50/30 border border-slate-100 p-6 rounded-[2.5rem] shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
                     <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center bg-white shadow-sm shrink-0">
                           <Calendar size={13} className="text-[#070b13]" />
                        </div>
                        <span className="text-[12px] font-black tracking-tight text-[#070b13]">Roadmap Protocol</span>
                     </div>
                     <div className="flex items-center gap-1 text-[8.5px] font-black text-[#99CB48] border border-[#99CB48]/30 bg-[#99CB48]/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Calendar size={8} />
                        Payment Schedule
                     </div>
                  </div>

                  {/* Timeline - overflow-hidden, no scrollbar */}
                  <div className="relative pl-6 flex-1 overflow-hidden pr-1 pt-1 pb-4">
                     <div className={`relative ${gapClass}`}>
                        {/* Vertical Line */}
                        <div className={`absolute left-[-18px] ${lineTopBottomClass} w-[2px] bg-slate-200/60 z-0`} />

                        {milestones.map((m, i) => {
                           const val = f.finalPrice * (parseFloat(String(m.percentage || "0")) / 100);
                           return (
                              <div key={i} className="relative flex items-center gap-4">
                                 {/* Dot on timeline */}
                                 <div className="absolute -left-[23px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[#99CB48] border-2 border-white shadow-sm z-10" />

                                 {/* Milestone Card */}
                                 <div className={`flex-1 flex items-center justify-between bg-white border border-slate-100 rounded-[1.25rem] ${paddingClass} shadow-sm hover:shadow-md transition-shadow`}>
                                    <div className="flex items-center gap-2.5 min-w-0">
                                       {/* Circle Badge */}
                                       <div className={`${circleSizeClass} rounded-full bg-[#070b13] flex items-center justify-center text-white font-extrabold shrink-0 shadow-sm leading-none whitespace-nowrap tracking-tighter`}>
                                          {m.percentage}
                                       </div>
                                       <div className="min-w-0">
                                          <h4 className={`${titleSizeClass} font-extrabold text-[#070b13] tracking-tight ${titleTruncateClass}`}>{m.name}</h4>
                                          {!hideDesc && m.description && (
                                             <p className={`${descSizeClass} font-medium text-slate-400 mt-0.5 leading-tight ${descTruncateClass}`}>{m.description}</p>
                                          )}
                                       </div>
                                    </div>

                                    {/* Pricing Details */}
                                    <div className="flex flex-col items-end shrink-0 pl-3">
                                       <span className={`${priceSizeClass} font-black text-[#070b13] whitespace-nowrap`}>{formatCurrency(val)}</span>
                                       <span className={`mt-0.5 ${badgeSizeClass} font-black text-[#99CB48] bg-[#99CB48]/10 px-1.5 py-0.5 rounded-md leading-none whitespace-nowrap`}>
                                          {m.percentage}%
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Row: Commercial Integrity, Transparency, & 3D Illustration */}
            <div className="grid grid-cols-12 gap-4 items-center bg-slate-50/60 border border-slate-100 p-3 rounded-[2rem] shadow-sm shrink-0">
               {/* Commercial Integrity */}
               <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#99CB48] shadow-sm shrink-0">
                     <ShieldCheck size={18} />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-[#070b13] tracking-tight">Commercial Integrity</h4>
                     <p className="text-[8px] font-bold text-slate-400 leading-tight">Financial framework optimized for ROI</p>
                  </div>
               </div>

               {/* Separator line */}
               <div className="col-span-1 flex justify-center">
                  <div className="h-8 w-[1.5px] bg-slate-200" />
               </div>

               {/* Transparency */}
               <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#99CB48] shadow-sm shrink-0">
                     <FileText size={18} />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-[#070b13] tracking-tight">Transparent. Structured. Strategic.</h4>
                     <p className="text-[8px] font-bold text-slate-400 leading-tight">A commercial approach aligned with growth</p>
                  </div>
               </div>

               {/* 3D Isometric Illustration */}
               <div className="col-span-2 flex justify-end">
                  <img
                     src={commercialIllustration}
                     alt="Commercial 3D Illustration"
                     className="h-10 w-auto object-contain shrink-0"
                  />
               </div>
            </div>

            {/* Bottom Footer propositions bar */}
            <div className="w-full bg-[#070b13] rounded-[1.5rem] p-2.5 flex justify-between items-center text-white border-b-4 border-[#99CB48] shadow-lg shrink-0">
               {/* Prop 1 */}
               <div className="flex items-center gap-2 flex-1 px-1.5">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                     <Target size={11} className="text-[#99CB48]" />
                  </div>
                  <div>
                     <div className="text-[8.5px] font-black tracking-tight text-white leading-tight">Measurable ROI</div>
                     <div className="text-[7.5px] font-semibold text-slate-400 leading-tight">Drives real impact.</div>
                  </div>
               </div>

               <div className="h-5 w-[1px] bg-white/10 shrink-0" />

               {/* Prop 2 */}
               <div className="flex items-center gap-2 flex-1 px-1.5">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                     <Shield size={11} className="text-[#99CB48]" />
                  </div>
                  <div>
                     <div className="text-[8.5px] font-black tracking-tight text-white leading-tight">Risk Mitigation</div>
                     <div className="text-[7.5px] font-semibold text-slate-400 leading-tight">Reduced risk path.</div>
                  </div>
               </div>

               <div className="h-5 w-[1px] bg-white/10 shrink-0" />

               {/* Prop 3 */}
               <div className="flex items-center gap-2 flex-1 px-1.5">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                     <Timer size={11} className="text-[#99CB48]" />
                  </div>
                  <div>
                     <div className="text-[8.5px] font-black tracking-tight text-white leading-tight">Faster Outcomes</div>
                     <div className="text-[7.5px] font-semibold text-slate-400 leading-tight">Milestone-driven.</div>
                  </div>
               </div>

               <div className="h-5 w-[1px] bg-white/10 shrink-0" />

               {/* Prop 4 */}
               <div className="flex items-center gap-2 flex-1 px-2.5 py-1 bg-gradient-to-r from-[#99CB48]/90 to-[#99CB48] text-[#070b13] rounded-xl border border-[#99CB48]/20 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                     <Users size={11} className="text-[#070b13]" />
                  </div>
                  <div>
                     <div className="text-[8.5px] font-black tracking-tight text-[#070b13] leading-tight">Long-term Value</div>
                     <div className="text-[7.5px] font-black text-[#070b13]/80 leading-tight">Built for scale.</div>
                  </div>
               </div>
            </div>
         </div>
      </PageWrapper>
   );
};

export default CommercialFrameworkPage;
