import React from "react";
import { Proposal } from "@/types/proposal";
import { ModuleSegment } from "@/utils/proposal/weights";
import PageWrapper from "./PageWrapper";
import { CheckCircle2, IndianRupee, ShieldCheck, Cpu, Zap, Layers, Rocket, Lock, Star } from "lucide-react";

interface ModulePageProps {
  proposal: Proposal;
  pageNum: number;
  pageSegments: ModuleSegment[];
  pageIdx: number;
  totalPages: number;
  isFuturePage?: boolean;
}

const ModuleArchitecturePage: React.FC<ModulePageProps> = ({ 
  proposal, 
  pageNum, 
  pageSegments, 
  pageIdx, 
  totalPages,
  isFuturePage = false
}) => {
  const isFuture = isFuturePage || pageSegments.some(s => s.isFutureScalability);

  return (
    <PageWrapper 
      pageNum={pageNum} 
      title={isFuture ? "Future Scalability Protocol" : "Architectural Ecosystem"}
    >
      <div className="flex flex-col h-full overflow-visible">
        {pageIdx === 0 && (
          <div className="mb-4 pb-1">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-6 h-[2.5px] rounded-full ${isFuture ? "bg-[#1AA6E1]" : "bg-[#99CB48]"}`} />
              <span className={`text-[10px] font-black tracking-[0.18em] uppercase ${isFuture ? "text-[#1AA6E1]" : "text-[#80ae36]"}`}>
                {isFuture ? "Strategic Growth Roadmap" : "Solution Breakdown"}
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-[#0B0E14] leading-tight mb-1">
              {isFuture ? (
                <>Future <span className="text-[#1AA6E1]">Scalability</span> Protocol</>
              ) : (
                <>Modules & <span className="text-[#99CB48]">Architecture</span></>
              )}
            </h2>
            <div className="text-[10.5px] font-bold text-slate-400 tracking-wide">
              {isFuture ? "Next-Generation System Expansion & Scalability Modules" : "Dynamic System Component Specifications & Capabilities"}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-4 overflow-visible py-1">
          {pageSegments.map((segment, sIdx) => {
            const isFutureMod = segment.isFutureScalability || isFuture;
            const basePrimaryColor = isFutureMod ? 'bg-[#1AA6E1]' : 'bg-[#99CB48]';
            const primaryColor = segment.isHighlighted ? 'bg-amber-400' : basePrimaryColor;
            const borderColor = segment.isHighlighted ? 'border-amber-400' : (isFutureMod ? 'border-[#1AA6E1]' : 'border-slate-900');
            const textColor = segment.isHighlighted ? 'text-amber-500' : (isFutureMod ? 'text-[#1AA6E1]' : 'text-[#80ae36]');
            
            return (
            <div key={`${segment.id}-${sIdx}`} className={`module-card break-inside-avoid w-full border-[1.5px] ${borderColor} overflow-hidden rounded-xl shadow-sm ${segment.isHighlighted ? 'shadow-[0_0_15px_rgba(251,191,36,0.15)] bg-amber-50/20' : 'bg-white'}`}>
              {/* Module Header */}
              {segment.isContinuation ? (
                 <div className={`${primaryColor} py-1.5 px-4 border-b-[1px] ${borderColor} flex items-center justify-between`}>
                   <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                     <Layers size={11} /> (Continued from previous page)
                   </span>
                   <span className="text-white/90 text-[9.5px] font-bold uppercase tracking-wider">{segment.name}</span>
                 </div>
              ) : (
                 <div className={`${primaryColor} py-2.5 px-4 border-b-[1px] ${borderColor} flex justify-between items-center gap-3`}>
                   <div className="flex items-center gap-2.5 min-w-0">
                     <h3 className="text-white font-black tracking-wide text-[13.5px] leading-tight truncate">
                       {segment.name}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2 shrink-0">
                     {segment.isHighlighted && (
                       <div className="bg-white/25 px-2.5 py-0.5 rounded-md border border-white/40 backdrop-blur-sm flex items-center gap-1 shadow-sm">
                         <Star size={10} className="text-white fill-white" />
                         <span className="text-[8.5px] font-black uppercase tracking-widest text-white drop-shadow-sm">Featured</span>
                       </div>
                     )}
                     {isFutureMod && !segment.isHighlighted && (
                       <div className="bg-white/20 px-2.5 py-0.5 rounded-md border border-white/30 backdrop-blur-sm flex items-center gap-1">
                         <Rocket size={10} className="text-white" />
                         <span className="text-[8.5px] font-black uppercase tracking-widest text-white">Future Scalability</span>
                       </div>
                     )}
                     {segment.price && (
                       <div className="bg-white px-2.5 py-0.5 rounded-md border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                         <IndianRupee size={9} className="text-slate-900" strokeWidth={3} />
                         <span className="text-[11px] font-black text-slate-900">{segment.price}</span>
                       </div>
                     )}
                   </div>
                 </div>
              )}

              {/* Features Table */}
              <div className="bg-white divide-y divide-slate-100">
                {segment.features.map((feature: any, fIdx: number) => {
                  const isFeatureHighlighted = typeof feature !== 'string' && feature.isHighlighted;
                  return (
                  <div 
                    key={fIdx} 
                    className={`grid grid-cols-[1fr,auto,28px] items-center py-2.5 px-4 min-h-[38px] transition-colors ${
                      isFeatureHighlighted ? "bg-amber-50/60" : (fIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60")
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                       {isFeatureHighlighted ? (
                         <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                       ) : (
                         <div className={`w-1.5 h-1.5 rounded-full ${primaryColor} shrink-0`} />
                       )}
                       <span className={`text-[11.5px] ${isFeatureHighlighted ? "font-black text-amber-700" : "font-bold text-slate-700"} tracking-tight leading-snug truncate`}>
                         {typeof feature === 'string' ? feature : feature.name}
                       </span>
                    </div>
                    {feature.price && (
                       <div className="mr-2 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded flex items-center gap-0.5 shrink-0">
                          <IndianRupee size={8} className={isFeatureHighlighted ? "text-amber-600" : textColor} strokeWidth={3} />
                          <span className="text-[9.5px] font-black text-slate-600">{feature.price}</span>
                       </div>
                    )}
                    <div className="flex justify-end items-center">
                       <div className={`flex items-center justify-center w-4.5 h-4.5 rounded-full ${isFeatureHighlighted ? 'bg-amber-400' : primaryColor} text-white shrink-0 shadow-sm`}>
                          <CheckCircle2 size={11} strokeWidth={3} />
                       </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          );})}
        </div>

        {/* Executive Operational Architecture Standards Panel */}
        {pageIdx === totalPages - 1 && (
          <div className="mt-auto pt-3 shrink-0">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131722] to-slate-900 border border-slate-800 text-white space-y-3 shadow-xl">
              {/* Header inside Panel */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${isFuture ? "bg-[#1AA6E1]/20 text-[#1AA6E1] border-[#1AA6E1]/30" : "bg-[#99CB48]/20 text-[#99CB48] border-[#99CB48]/30"} flex items-center justify-center font-black text-xs shrink-0 shadow-md border`}>
                    {isFuture ? <Rocket size={17} /> : <ShieldCheck size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-2 flex-wrap">
                      <span>{isFuture ? "Future Scalability Protocol" : "Operational Architecture Standards"}</span>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shrink-0 ${isFuture ? "bg-[#1AA6E1]/20 text-[#1AA6E1] border border-[#1AA6E1]/30" : "bg-[#99CB48]/20 text-[#99CB48] border border-[#99CB48]/30"}`}>
                        {isFuture ? "Phase 2 Target" : "100% Certified"}
                      </span>
                    </div>
                    <div className="text-[9.5px] font-medium text-slate-400 tracking-wide mt-0.5 leading-snug">
                      {isFuture 
                        ? "Designed for zero-downtime microservices integration & backward API protocol compatibility." 
                        : "Vetted for high availability, sub-50ms transaction latency & SOC2 data protection standards."}
                    </div>
                  </div>
                </div>

                {/* Right Badge: Weblozy Verified */}
                <div className="text-right shrink-0 whitespace-nowrap pl-3.5 border-l border-slate-800/90 space-y-0.5">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"}`}>
                    Weblozy Verified
                  </div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Production Spec</div>
                </div>
              </div>

              {/* 3 Quality Pillars */}
              <div className="grid grid-cols-3 gap-3">
                {/* Pillar 1 */}
                <div className="p-3 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1.5 transition-all relative overflow-hidden group shadow-sm">
                  <div className={`h-[2px] w-full ${isFuture ? "bg-gradient-to-r from-[#1AA6E1] to-transparent" : "bg-gradient-to-r from-[#99CB48] to-transparent"} absolute top-0 left-0`} />
                  <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <Zap size={11} className={isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"} />
                    High Throughput SLA
                  </div>
                  <div className="text-[9px] font-medium text-slate-300/90 leading-relaxed">
                    Asynchronous event loops & cached data routing for instantaneous response.
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="p-3 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1.5 transition-all relative overflow-hidden group shadow-sm">
                  <div className={`h-[2px] w-full ${isFuture ? "bg-gradient-to-r from-[#1AA6E1] to-transparent" : "bg-gradient-to-r from-[#99CB48] to-transparent"} absolute top-0 left-0`} />
                  <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <Lock size={11} className={isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"} />
                    Data Exfiltration Guard
                  </div>
                  <div className="text-[9px] font-medium text-slate-300/90 leading-relaxed">
                    Granular RBAC role policies & AES-256 transport layer encryption protocols.
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="p-3 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1.5 transition-all relative overflow-hidden group shadow-sm">
                  <div className={`h-[2px] w-full ${isFuture ? "bg-gradient-to-r from-[#1AA6E1] to-transparent" : "bg-gradient-to-r from-[#99CB48] to-transparent"} absolute top-0 left-0`} />
                  <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <Cpu size={11} className={isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"} />
                    Zero Downtime Upgrades
                  </div>
                  <div className="text-[9px] font-medium text-slate-300/90 leading-relaxed">
                    Decoupled modular architecture allows continuous deployment without downtime.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ModuleArchitecturePage;

