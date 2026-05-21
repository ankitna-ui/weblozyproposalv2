import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Cpu, Shield, Globe, Smartphone, Database, CheckCircle2, Server, Terminal, Lock } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const TechnicalArchitecturePage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const stack = proposal?.techArchitecture || {
    frontendStack: ["React", "Next.js", "Tailwind CSS"],
    backendStack: ["Node.js", "Express", "PostgreSQL"],
    database: "Managed Cloud SQL",
    hosting: "AWS / Vercel Edge",
    securityFeatures: ["AES-256 Encryption", "SSL/TLS Protocol", "OAuth 2.0 Auth"]
  };

  return (
    <PageWrapper pageNum={pageNum} title="Technical Protocol">
       <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-[2px] bg-[#99CB48]" />
             <span className="text-[10px] font-black tracking-[0.15em] text-[#99CB48]">Technology Ecosystem</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-[#0B0E14] leading-none mb-2">
             Technical <span className="text-[#99CB48]">Protocol.</span>
          </h2>
          <div className="text-[10px] font-bold text-slate-400 tracking-wide">Enterprise Architecture & Security Standards</div>
       </div>

       <div className="space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-6">
             {/* Left Column: Stack */}
             <div className="space-y-6">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-[#99CB48] shadow-lg shadow-[#99CB48]/10">
                         <Terminal size={18} />
                      </div>
                      <div className="text-[11px] font-black tracking-[0.12em] text-slate-800">Frontend Core</div>
                   </div>
                   <div className="flex flex-wrap gap-2.5">
                      {stack.frontendStack.map((tech, i) => (
                         <div key={i} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 shadow-sm border-l-4 border-l-[#99CB48]">
                            {tech}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-[#99CB48] shadow-lg shadow-[#99CB48]/10">
                         <Server size={18} />
                      </div>
                      <div className="text-[11px] font-black tracking-[0.12em] text-slate-800">Backend Infrastructure</div>
                   </div>
                   <div className="flex flex-wrap gap-2.5">
                      {stack.backendStack.map((tech, i) => (
                         <div key={i} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold shadow-xl border-b-4 border-b-[#99CB48]">
                            {tech}
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Column: Security & Infrastructure */}
             <div className="space-y-6">
                <div className="p-6 bg-slate-900 rounded-[3rem] border border-slate-800 relative overflow-hidden group shadow-2xl">
                   <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                      <Lock size={120} className="text-[#99CB48]" />
                   </div>
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-3">
                         <Shield className="text-[#99CB48]" size={20} />
                         <div className="text-[10px] font-black tracking-[0.15em] text-white">Security Protocol</div>
                      </div>
                      <div className="space-y-5">
                         {stack.securityFeatures.map((feature, i) => (
                            <div key={i} className="flex items-center gap-6">
                               <div className="w-5 h-5 rounded-full bg-[#99CB48]/20 flex items-center justify-center">
                                  <CheckCircle2 size={12} className="text-[#99CB48]" />
                               </div>
                               <span className="text-[12px] font-semibold tracking-tight text-white/90 leading-none">{feature}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-white border-2 border-slate-900 rounded-[2.5rem] shadow-[4px_4px_0px_0px_rgba(153,203,72,1)] space-y-6">
                      <Database size={24} className="text-[#99CB48]" />
                      <div className="text-[9px] font-black tracking-wide text-slate-400">Data Hub</div>
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">{stack.database}</div>
                   </div>
                   <div className="p-6 bg-white border-2 border-slate-900 rounded-[2.5rem] shadow-[4px_4px_0px_0px_rgba(153,203,72,1)] space-y-6">
                      <Globe size={24} className="text-[#99CB48]" />
                      <div className="text-[9px] font-black tracking-wide text-slate-400">Cloud Port</div>
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">{stack.hosting}</div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       <div className="mt-6 p-6 bg-[#99CB48] rounded-[2.5rem] border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(11,14,20,1)] flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-[#99CB48] shadow-lg">
                <Cpu size={32} />
             </div>
             <div className="space-y-1">
                <div className="text-slate-900 text-sm font-black tracking-wide leading-none">Enterprise Stability Core</div>
                <div className="text-slate-900/60 text-[10px] font-bold tracking-[0.12em]">High Availability Deployment Protocol</div>
             </div>
          </div>
          <div className="h-12 w-[2px] bg-slate-900/10" />
          <div className="text-right">
             <div className="text-slate-900 text-[11px] font-black tracking-wide leading-none mb-1">Performance Tier: L1</div>
             <div className="text-slate-900/40 text-[9px] font-black tracking-[0.12em]">99.99% Uptime SLA Guaranteed</div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default TechnicalArchitecturePage;
