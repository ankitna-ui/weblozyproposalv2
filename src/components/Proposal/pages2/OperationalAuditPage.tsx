import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { ShieldAlert, AlertCircle, TrendingDown, Activity, Target } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const OperationalAuditPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const challenges = proposal.situation?.challenges?.length > 0 
    ? proposal.situation.challenges 
    : ["Manual Data Entry", "Communication Silos", "Resource Misallocation"];

  const challengeCount = challenges.length;

  // Dynamic card styling based on challenge count to prevent layout overflow in PDF exports
  const challengeStyle = challengeCount > 8 ? { p: "p-2", text: "text-[9.5px]", icon: 12, gap: "gap-2.5", rounded: "rounded-lg" } :
                         challengeCount > 5 ? { p: "p-3", text: "text-[11px]", icon: 14, gap: "gap-3", rounded: "rounded-xl" } :
                         challengeCount > 3 ? { p: "p-3.5 py-4", text: "text-[12px]", icon: 16, gap: "gap-3.5", rounded: "rounded-xl" } :
                         { p: "p-4.5 py-5", text: "text-[13px]", icon: 18, gap: "gap-4.5", rounded: "rounded-[1.75rem]" };

  return (
    <PageWrapper pageNum={pageNum} title="Strategic Audit">
       <div className="flex flex-col h-full space-y-6">
          {/* Header Section */}
          <div className="mb-2 shrink-0">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[2px] bg-red-600" />
                <span className="text-[10px] font-black tracking-[0.15em] text-red-600">Phase 01: Audit</span>
             </div>
             <h2 className="text-5xl font-black tracking-tighter text-[#0B0E14] leading-none mb-1">
                Operational <span className="text-red-600">Audit.</span>
             </h2>
             <div className="text-[10px] font-bold text-slate-400 tracking-wide leading-none">Identifying Systemic Bottlenecks & Growth Inhibitors</div>
          </div>
          
          {/* Main Content Section */}
          <div className="flex-1 min-h-0 flex flex-col space-y-6">
             {/* Situational Narrative */}
             <div className="bg-[#FDF2F2]/50 p-6 rounded-[2.5rem] border border-red-100/50 relative overflow-hidden shrink-0 min-h-[140px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                   <ShieldAlert size={120} className="text-red-600" />
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      <div className="text-[11px] font-black tracking-[0.15em] text-red-600 uppercase">Situational Analysis</div>
                   </div>
                   <div className="text-[13px] font-bold text-slate-700 leading-relaxed max-w-[95%]">
                      {proposal.situation?.currentWorkflow || "The current operational framework exhibits significant friction points that impede scalable growth and resource optimization. Our audit identifies core vulnerabilities in manual coordination and data fragmentation."}
                   </div>
                </div>
             </div>

             {/* Grid Content */}
             <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left Column: Friction Points */}
                <div className="flex flex-col min-h-0">
                   <div className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 shrink-0">Critical Friction Points</div>
                   <div className={`flex flex-col ${challengeCount <= 3 ? 'gap-5 justify-start py-1' : challengeCount <= 4 ? 'gap-4 justify-start py-1' : 'gap-2.5'} flex-1 min-h-0`}>
                      {challenges.map((challenge, i) => (
                         <div key={i} className={`flex items-center ${challengeStyle.gap} bg-white border border-slate-100 ${challengeStyle.rounded} shadow-sm transition-all ${challengeStyle.p}`}>
                            <div 
                               className="rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0"
                               style={{ 
                                 width: challengeCount > 8 ? '24px' : challengeCount > 5 ? '32px' : challengeCount > 3 ? '40px' : '48px', 
                                 height: challengeCount > 8 ? '24px' : challengeCount > 5 ? '32px' : challengeCount > 3 ? '40px' : '48px' 
                               }}
                            >
                               <AlertCircle size={challengeStyle.icon} strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                               <span className={`font-extrabold text-slate-800 leading-tight block ${challengeStyle.text}`}>
                                  {challenge}
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Right Column: Leakage & Inefficiency */}
                <div className="flex flex-col min-h-0">
                   <div className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 shrink-0">Leakage & Inefficiency</div>
                   <div className="flex flex-col gap-4 flex-1">
                      {/* Financial Leakage Card */}
                      <div className="p-6 bg-red-50/50 rounded-[2rem] border border-red-100/60 space-y-3 shadow-sm flex flex-col justify-between flex-1">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-red-600">
                               <TrendingDown size={16} strokeWidth={2.5} />
                               <span className="text-[9.5px] font-black tracking-[0.15em] uppercase">Financial Leakage</span>
                            </div>
                            <div className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{proposal.situation?.revenueLeakage || "₹10k+ / Mo"}</div>
                         </div>
                         <div className="text-[11px] font-semibold text-slate-500 tracking-tight leading-relaxed">
                            Estimated monthly capital loss due to manual inefficiencies, processing delays, and unoptimized resource usage.
                         </div>
                      </div>

                      {/* Operational Drag Card */}
                      <div className="p-6 bg-[#0B0E14] rounded-[2rem] space-y-3 shadow-xl flex flex-col justify-between flex-1">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#99CB48]">
                               <Activity size={16} strokeWidth={2.5} />
                               <span className="text-[9.5px] font-black tracking-[0.15em] uppercase">Operational Drag</span>
                            </div>
                            <div className="text-2xl font-black text-white tracking-tighter mt-1">{proposal.situation?.inefficiencies || "High Manual Overhead"}</div>
                         </div>
                         <div className="text-[11px] font-semibold text-white/50 tracking-tight leading-relaxed">
                            Systemic friction points causing department communication bottlenecks, duplicate workflows, and decreased team velocity.
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Audit Objective Footer */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                   <Target size={24} />
                </div>
                <div className="space-y-0.5">
                   <div className="text-[13px] font-black text-slate-900 uppercase">Audit Objective</div>
                   <div className="text-[10.5px] font-bold text-slate-500 tracking-tight">Neutralizing Operational Friction for Enterprise Scalability</div>
                </div>
             </div>
             <div className="text-[11px] font-black text-red-600 tracking-[0.12em] bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 uppercase shrink-0">
                Action Required
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default OperationalAuditPage;
