import React from "react";
import { Proposal, Module } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { CheckCircle2, IndianRupee } from "lucide-react";

interface ModulePageProps {
  proposal: Proposal;
  pageNum: number;
  pageModules: Module[];
  pageIdx: number;
  totalPages: number;
}

const ModuleArchitecturePage: React.FC<ModulePageProps> = ({ proposal, pageNum, pageModules, pageIdx, totalPages }) => {
  return (
    <PageWrapper 
      pageNum={pageNum} 
      title="Architectural Ecosystem"
    >
      <div className="flex flex-col h-full overflow-visible">
        {pageIdx === 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-[2px] bg-[#99CB48]" />
              <span className="text-[10px] font-black tracking-[0.12em] text-[#99CB48]">Solution Breakdown</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-[#0B0E14] leading-none mb-0.5">
              Modules & <span className="text-[#99CB48]">Architecture.</span>
            </h2>
            <div className="text-[10px] font-bold text-slate-400 tracking-wide leading-none">Dynamic System Component Specifications</div>
          </div>
        )}

        <div className="flex-1 space-y-2 overflow-visible py-1">
          {pageModules.map((module, mIdx) => {
            const isFuture = module.isFutureScalability;
            const primaryColor = isFuture ? 'bg-[#1AA6E1]' : 'bg-[#99CB48]';
            const borderColor = isFuture ? 'border-[#1AA6E1]' : 'border-slate-900';
            const textColor = isFuture ? 'text-[#1AA6E1]' : 'text-[#99CB48]';
            
            return (
            <div key={mIdx} className={`module-card break-inside-avoid w-full border-[1px] ${borderColor} overflow-hidden rounded-lg shadow-sm`}>
              {/* Compact Module Header */}
              <div className={`${primaryColor} py-1.5 px-3 border-b-[1px] ${borderColor} flex justify-between items-center`}>
                <h3 className="text-white font-extrabold tracking-wide text-[14px] leading-tight">
                  {module.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isFuture && (
                    <div className="bg-white/20 px-2 py-0.5 rounded border border-white/30 backdrop-blur-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white">Future Scalability</span>
                    </div>
                  )}
                  {module.price && (
                    <div className="bg-white px-2 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                      <IndianRupee size={9} className="text-slate-900" strokeWidth={3} />
                      <span className="text-[11px] font-extrabold text-slate-900">{module.price}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* High-Density Features Table */}
              <div className="bg-white">
                {module.features.map((feature: any, fIdx: number) => (
                  <div 
                    key={fIdx} 
                    className={`grid grid-cols-[1fr,auto,30px] items-center py-1.5 px-3 ${
                      fIdx !== module.features.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       <div className={`w-1 h-1 rounded-full ${primaryColor} shrink-0`} />
                       <span className="text-[12px] font-semibold tracking-tight text-slate-700 leading-tight">
                         {typeof feature === 'string' ? feature : feature.name}
                       </span>
                    </div>
                    {feature.price && (
                       <div className="mr-3 px-1.5 py-0 bg-slate-50 border border-slate-200 rounded flex items-center gap-0.5">
                          <IndianRupee size={8} className={textColor} strokeWidth={3} />
                          <span className="text-[10px] font-bold text-slate-500">{feature.price}</span>
                       </div>
                    )}
                    <div className="flex justify-end">
                       <div className={`flex items-center justify-center w-5 h-5 rounded-full ${primaryColor} text-white shrink-0`}>
                          <CheckCircle2 size={12} strokeWidth={3} />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )})}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="text-[9px] font-black tracking-[0.12em] text-slate-300 italic">
            Proprietary Modular Framework // Weblozy Sequential logic
          </div>
          {totalPages > 1 && (
            <div className="text-[9px] font-bold text-slate-400 tracking-wide flex items-center gap-1">
               <div className="w-1 h-1 rounded-full bg-[#99CB48] animate-pulse" />
               Continued...
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ModuleArchitecturePage;
