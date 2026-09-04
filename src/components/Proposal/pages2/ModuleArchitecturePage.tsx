import React from "react";
import { Proposal } from "@/types/proposal";
import { ModuleSegment } from "@/utils/proposal/weights";
import PageWrapper from "./PageWrapper";
import { CheckCircle2, IndianRupee, ShieldCheck, Cpu, Zap, Layers } from "lucide-react";

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
              <div className={`w-6 h-[2.5px] ${isFuture ? "bg-[#1AA6E1]" : "bg-[#99CB48]"}`} />
              <span className={`text-[10px] font-black tracking-[0.16em] uppercase ${isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"}`}>
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

        <div className="flex-1 flex flex-col gap-5 overflow-visible py-1">
          {pageSegments.map((segment, sIdx) => {
            const isFutureMod = segment.isFutureScalability || isFuture;
            const primaryColor = isFutureMod ? 'bg-[#1AA6E1]' : 'bg-[#99CB48]';
            const borderColor = isFutureMod ? 'border-[#1AA6E1]' : 'border-slate-900';
            const textColor = isFutureMod ? 'text-[#1AA6E1]' : 'text-[#99CB48]';
            
            return (
            <div key={`${segment.id}-${sIdx}`} className={`module-card break-inside-avoid w-full border-[1.5px] ${borderColor} overflow-hidden rounded-xl shadow-sm bg-white`}>
              {/* Module Header */}
              {segment.isContinuation ? (
                 <div className={`${primaryColor} py-1.5 px-4 border-b-[1px] ${borderColor} flex items-center justify-between`}>
                   <span className="text-white text-[10px] font-black uppercase tracking-widest">(Continued from previous page)</span>
                   <span className="text-white/80 text-[9px] font-bold uppercase tracking-wider">{segment.name}</span>
                 </div>
              ) : (
                 <div className={`${primaryColor} py-2.5 px-4 border-b-[1px] ${borderColor} flex justify-between items-center`}>
                   <div className="flex items-center gap-3">
                     <h3 className="text-white font-black tracking-wide text-[14px] leading-tight">
                       {segment.name}
                     </h3>
                   </div>
                   <div className="flex items-center gap-2.5">
                     {isFutureMod && (
                       <div className="bg-white/20 px-2.5 py-0.5 rounded-md border border-white/30 backdrop-blur-sm">
                         <span className="text-[8.5px] font-black uppercase tracking-widest text-white">Future Scalability</span>
                       </div>
                     )}
                     {segment.price && (
                       <div className="bg-white px-2 py-0.5 rounded-md border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                         <IndianRupee size={9} className="text-slate-900" strokeWidth={3} />
                         <span className="text-[11px] font-black text-slate-900">{segment.price}</span>
                       </div>
                     )}
                   </div>
                 </div>
              )}

              {/* Features Table */}
              <div className="bg-white divide-y divide-slate-100">
                {segment.features.map((feature: any, fIdx: number) => (
                  <div 
                    key={fIdx} 
                    className={`grid grid-cols-[1fr,auto,28px] items-center py-2.5 px-4 min-h-[38px] transition-colors ${
                      fIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${primaryColor} shrink-0`} />
                       <span className="text-[11.5px] font-bold tracking-tight text-slate-700 leading-snug">
                         {typeof feature === 'string' ? feature : feature.name}
                       </span>
                    </div>
                    {feature.price && (
                       <div className="mr-2 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded flex items-center gap-0.5">
                          <IndianRupee size={8} className={textColor} strokeWidth={3} />
                          <span className="text-[9.5px] font-black text-slate-600">{feature.price}</span>
                       </div>
                    )}
                    <div className="flex justify-end items-center">
                       <div className={`flex items-center justify-center w-4.5 h-4.5 rounded-full ${primaryColor} text-white shrink-0 shadow-sm`}>
                          <CheckCircle2 size={11} strokeWidth={3} />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );})}
        </div>

        {/* Executive Operational Architecture Standards Panel */}
        {pageIdx === totalPages - 1 && (
          <div className="mt-4 p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131722] to-slate-900 border border-slate-800 text-white space-y-3.5 shadow-xl shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${isFuture ? "bg-[#1AA6E1]/20 text-[#1AA6E1]" : "bg-[#99CB48]/20 text-[#99CB48]"} flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-white/10`}>
                  {isFuture ? "FS" : "MA"}
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span>{isFuture ? "Future Scalability Protocol" : "Operational Architecture Standards"}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${isFuture ? "bg-[#1AA6E1]/20 text-[#1AA6E1]" : "bg-[#99CB48]/20 text-[#99CB48]"}`}>
                      {isFuture ? "Phase 2 Target" : "100% Certified"}
                    </span>
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-400 tracking-wide mt-0.5">
                    {isFuture 
                      ? "Designed for zero-downtime microservices integration & backward API protocol compatibility." 
                      : "Vetted for high availability, sub-50ms transaction latency & SOC2 data protection standards."}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 pl-4 border-l border-slate-800">
                <div className={`text-[10px] font-black uppercase tracking-widest ${isFuture ? "text-[#1AA6E1]" : "text-[#99CB48]"}`}>
                  Weblozy Verified
                </div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Production Spec</div>
              </div>
            </div>

            {/* 3 Quality Pillars */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl space-y-1">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isFuture ? "bg-[#1AA6E1]" : "bg-[#99CB48]"}`} />
                  High Throughput SLA
                </div>
                <div className="text-[8.5px] font-bold text-slate-400 leading-snug">
                  Asynchronous event loops & cached data routing for instantaneous response.
                </div>
              </div>

              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl space-y-1">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isFuture ? "bg-[#1AA6E1]" : "bg-[#99CB48]"}`} />
                  Data Exfiltration Guard
                </div>
                <div className="text-[8.5px] font-bold text-slate-400 leading-snug">
                  Granular RBAC role policies & AES-256 transport layer encryption protocols.
                </div>
              </div>

              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl space-y-1">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isFuture ? "bg-[#1AA6E1]" : "bg-[#99CB48]"}`} />
                  Zero Downtime Upgrades
                </div>
                <div className="text-[8.5px] font-bold text-slate-400 leading-snug">
                  Decoupled modular architecture allows continuous deployment without downtime.
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
