import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Target, ShieldCheck, Zap, Rocket, Star, Code, ShoppingCart, UserCheck, Database, Layout, Globe, CheckCircle2, BadgeCheck } from "lucide-react";
import aboutIllustration from "@/assets/image.png";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CorporateIdentityPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  return (
    <PageWrapper pageNum={pageNum} title="Corporate Identity">
       <div className="flex flex-col h-full space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-start">
             <div>
                <div className="text-[10px] font-black tracking-[0.15em] text-[#1AA6E1] mb-1">Corporate Identity</div>
                <h2 className="text-6xl font-black tracking-tighter text-[#0B0E14] leading-[0.9]">
                   About <br /> Company.
                </h2>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex gap-2">
                   <div className="w-[100px] h-[65px] bg-[#0B0E14] rounded-2xl flex flex-col items-center justify-center text-white p-2 shadow-xl border border-white/5 relative">
                      <div className="text-base font-extrabold tracking-tighter leading-tight text-[#99CB48]">{proposal?.experience?.yearsOfExperience || "15+"}</div>
                      <div className="text-[5px] font-black tracking-wide opacity-80 text-center mt-1">Years Precision</div>
                   </div>
                   <div className="w-[100px] h-[65px] bg-white rounded-2xl flex flex-col items-center justify-center text-[#0B0E14] p-2 shadow-xl border border-slate-100 relative">
                      <div className="text-base font-extrabold tracking-tighter leading-tight text-[#0B0E14]">{proposal?.experience?.projectsCompleted || "250+"}</div>
                      <div className="text-[5px] font-black tracking-wide opacity-60 text-center mt-1">Projects Built</div>
                   </div>
                   <div className="w-[100px] h-[65px] bg-[#99CB48] rounded-2xl flex flex-col items-center justify-center text-[#0B0E14] p-2 shadow-xl border border-black/5 relative">
                      <div className="text-base font-extrabold tracking-tighter leading-tight text-[#0B0E14]">
                         {typeof proposal?.experience?.industriesServed === 'string' 
                           ? proposal?.experience?.industriesServed 
                           : (Array.isArray(proposal?.experience?.industriesServed) ? proposal?.experience?.industriesServed.length : "20+")}
                      </div>
                      <div className="text-[5px] font-black tracking-wide opacity-80 text-center mt-1">Industries</div>
                   </div>
                </div>
                
                {/* Compact Verified Badge */}
                <div className="w-[100px] h-[65px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-[#99CB48] p-2 shadow-inner border border-slate-100 relative shrink-0">
                    <BadgeCheck size={16} className="text-[#99CB48]" />
                    <div className="text-[8px] font-black tracking-[0.05em] text-[#99CB48] text-center leading-tight mt-0.5">Verified<br />Authority</div>
                 </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
             {/* Left Column: Introduction & Why Weblozy */}
             <div className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100 flex flex-col space-y-6">
                <div className="space-y-3">
                   <div className="text-[#1AA6E1] text-[8px] font-black tracking-[0.12em]">Strategic Profile</div>
                   <div className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                      At Weblozy, we are committed to delivering elite business automation and technical solutions with industry-leading support. Weblozy is a premier agency specializing in Business Automation, LinkedIn Lead Generation, and high-performance Website Development, based out of Noida, India.
                   </div>
                </div>

                <div className="h-[1px] w-full bg-slate-200" />

                <div className="space-y-6">
                   <div className="text-slate-400 text-[8px] font-black tracking-[0.12em]">Why Weblozy?</div>
                   <div className="grid grid-cols-1 gap-y-1.5">
                      {[
                         { icon: <Target className="text-[#1AA6E1]" size={16} />, title: "Creatively Customized" },
                         { icon: <ShieldCheck className="text-[#99CB48]" size={16} />, title: "Reliably Responsive" },
                         { icon: <Zap className="text-[#1AA6E1]" size={16} />, title: "Effortlessly Efficient" },
                         { icon: <Rocket className="text-[#99CB48]" size={16} />, title: "Securely Streamlined" },
                         { icon: <Star className="text-yellow-500" size={16} />, title: "Exceptionally Experiential" }
                      ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <div className="shrink-0">{item.icon}</div>
                            <span className="text-[12px] font-semibold text-slate-800 leading-tight">{item.title}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Right Column: Operational Core & Ecosystem */}
             <div className="space-y-6 flex flex-col">
                {/* Operational Core Image Card */}
                <div className="relative h-[140px] rounded-[2rem] overflow-hidden border border-slate-100 group shadow-lg shrink-0">
                   <img src={aboutIllustration} alt="Operational Core" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                   <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="text-lg font-black tracking-tighter text-primary">Operational Core.</h4>
                      <div className="text-[7px] font-bold tracking-[0.12em] text-white/60">Strategic Delivery HQ</div>
                   </div>
                </div>

                {/* Master Services Ecosystem */}
                <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 space-y-6 shadow-sm flex-1 overflow-visible">
                   <div className="text-slate-400 text-[8px] font-black tracking-[0.12em]">Full-Stack Ecosystem</div>
                   <div className="space-y-2">
                      {[
                         { icon: <Globe size={20} className="text-[#99CB48]" />, name: "Full-Stack Ecosystem" },
                         { icon: <Database size={20} className="text-[#99CB48]" />, name: "Business Automation" },
                         { icon: <ShoppingCart size={20} className="text-[#99CB48]" />, name: "Ecommerce Development" },
                         { icon: <Code size={20} className="text-[#99CB48]" />, name: "Software Development" },
                         { icon: <UserCheck size={20} className="text-[#99CB48]" />, name: "Linkedin Automation" },
                         { icon: <Rocket size={20} className="text-[#99CB48]" />, name: "Sass Development / Consultant" }
                      ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50">
                            <div className="flex items-center gap-6">
                               <div className="shrink-0">{item.icon}</div>
                               <span className="text-[12px] font-bold text-slate-800 leading-none">{item.name}</span>
                            </div>
                            <CheckCircle2 size={16} className="text-[#99CB48] shrink-0" />
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Quote Section */}
          <div className="bg-[#0B0E14] rounded-full py-3 px-6 text-center relative overflow-hidden shadow-2xl shrink-0">
             <div className="absolute inset-0 bg-gradient-to-r from-[#1AA6E1]/10 via-transparent to-[#99CB48]/10" />
             <div className="relative z-10 text-white text-[12px] font-black tracking-tight italic">
                "We have completely mastered the art of digital technology."
             </div>
          </div>

          {/* Manifesto Footer Section */}
          <div className="bg-slate-900 rounded-[2rem] p-4 flex items-center justify-between relative overflow-hidden border border-slate-800 shrink-0">
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                   <Layout size={20} />
                </div>
                <div className="space-y-1">
                   <div className="text-[8px] font-black tracking-[0.15em] text-white/40">Weblozy Manifesto</div>
                   <div className="text-[8px] font-bold text-white/60 max-w-lg leading-tight">
                      Are you ready to break free from the monochrome monotony of traditional tech solutions? Welcome to Weblozy. Where your business isn't just optimized — it's immortalized.
                   </div>
                </div>
             </div>
             <div className="text-right space-y-1 relative z-10">
                <div className="text-[7px] font-black tracking-[0.12em] text-white/20">Fiscal Status</div>
                <div className="text-[#1AA6E1] text-[9px] font-black tracking-wide">{proposal?.experience?.partnerStatus || "Active Partner"}</div>
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default CorporateIdentityPage;
