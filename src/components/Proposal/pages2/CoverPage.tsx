import React from "react";
import { Proposal } from "@/types/proposal";
import bannerLogo from "@/assets/banner_logo.png";
import weblozyLogo from "@/assets/weblozy-logo.png";
import { useLogoBackground } from "@/hooks/useLogoBackground";
import { Target, Settings, ShieldCheck, BarChart3, Calendar, User, Globe } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const CoverPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const clientName = proposal?.client?.clientName || "Valued Client";
  const proposalTitle = proposal?.client?.proposalTitle || "Digital Transformation & Business Automation";
  
  const { bgColor, isTransparent } = useLogoBackground(proposal?.client?.clientLogoUrl);
  
  // Cleanly separate and highlight the client name and '&' symbol
  const renderTitle = () => {
    let titleParts: (string | React.ReactNode)[] = [proposalTitle];

    // First highlight the client name if it exists in the title
    if (clientName && proposalTitle.toLowerCase().includes(clientName.toLowerCase())) {
      const regex = new RegExp(`(${clientName})`, 'gi');
      titleParts = proposalTitle.split(regex).map((part, i) => 
        part.toLowerCase() === clientName.toLowerCase() 
          ? <span key={`client-${i}`} className="text-[#99CB48]">{part}</span> 
          : part
      );
    }

    // Then process all text parts (ignoring JSX elements) to highlight '&'
    return titleParts.map((part, i) => {
      if (typeof part === 'string' && part.includes('&')) {
        return part.split(/(&)/).map((subPart, j) => 
          subPart === '&' 
            ? <span key={`amp-${i}-${j}`} className="text-[#99CB48] font-light">&</span> 
            : subPart
        );
      }
      return part;
    });
  };

  return (
    <section className="a4-page relative overflow-hidden bg-[#FAFCFF] shadow-2xl p-0">
       
       {/* Light Ambient Background Designs for White Section */}
       <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Top-right subtle curves */}
         <div className="absolute right-[-10%] top-[-5%] w-[700px] h-[700px] rounded-[40%] border-[2px] border-slate-100/80 rotate-12" />
         <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] rounded-[45%] border-[1.5px] border-slate-100/80 -rotate-12" />
         
         {/* Center-left subtle curves behind text */}
         <div className="absolute left-[-20%] top-[20%] w-[900px] h-[900px] rounded-[35%] border-[2px] border-[#f0f4f8] rotate-[24deg]" />
         <div className="absolute left-[-10%] top-[30%] w-[700px] h-[700px] rounded-[40%] border-[1.5px] border-[#f0f4f8] rotate-[-15deg]" />
         
         {/* Faint Grid Texture */}
         <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#0A1629_1px,transparent_1px)] bg-[size:32px_32px]" />
       </div>
       
       {/* Navy Diagonal Background */}
       <div 
         className="absolute bottom-0 right-0 w-full h-[75%] bg-gradient-to-br from-[#0B254E] via-[#061731] to-[#020A17] shadow-2xl pointer-events-none z-0" 
         style={{ clipPath: 'polygon(0 62%, 100% 12%, 100% 100%, 0 100%)' }} 
       >
         {/* Premium Ambient Glow */}
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_40%,_rgba(153,203,72,0.1)_0%,_transparent_60%)]" />
         
         {/* Abstract Radar Curves */}
         <div className="absolute right-[-15%] top-[20%] w-[900px] h-[900px] rounded-full border-[1.5px] border-white/5 pointer-events-none" />
         <div className="absolute right-[5%] top-[30%] w-[600px] h-[600px] rounded-full border border-white/10 pointer-events-none" />
         <div className="absolute right-[15%] top-[38%] w-[400px] h-[400px] rounded-full border border-white/5 pointer-events-none" />
         
         {/* Enterprise Dot Grid Texture */}
         <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] bg-[size:28px_28px]" />
       </div>



       {/* TOP LEFT: Branding */}
       <div className="absolute top-14 left-14 space-y-5 z-20">
          <a href="https://www.weblozy.com" target="_blank" rel="noopener noreferrer">
             <img src={bannerLogo} alt="Weblozy" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          </a>
          <div className="flex items-center gap-4">
             <div className="w-8 h-[2px] bg-[#99CB48]" />
             <div className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">
                {proposal?.client?.tagline || "WE AUTOMATE BUSINESSES"}
             </div>
          </div>
       </div>

       {/* TOP RIGHT: Proposal ID */}
       <div className="absolute top-14 right-14 text-right z-20">
          <div className="text-[8px] font-black tracking-[0.2em] text-slate-400 uppercase mb-2">Proposal ID</div>
          <div className="inline-flex items-center gap-3 px-6 py-2.5 border-[1.5px] border-slate-200/50 rounded-full bg-white shadow-sm">
             <div className="w-2.5 h-2.5 rounded-full bg-[#99CB48] shadow-[0_0_8px_rgba(153,203,72,0.6)]" />
             <span className="text-[12px] font-black tracking-widest text-slate-800">
                #{proposal?.client?.referenceId || "WBZ-2026-4031"}
             </span>
          </div>
       </div>

       {/* CENTER LEFT: Typography */}
       <div className="absolute top-[18%] left-14 w-[48%] max-w-[420px] space-y-6 z-20">
          <div className="flex items-center gap-4">
             <div className="w-6 h-[2.5px] bg-[#99CB48]" />
             <div className="text-[10.5px] font-black tracking-[0.25em] text-[#99CB48] uppercase">
                {proposal?.client?.frameworkTitle || "EXECUTIVE FRAMEWORK"}
             </div>
          </div>
          
          <h1 className="text-[36px] sm:text-[40px] font-black leading-[1.25] tracking-tight text-[#0A1629] text-balance break-words drop-shadow-sm">
             {renderTitle()}
             {proposal?.client?.titleHighlight && (
               <>
                 <br />
                 <span className="text-[#99CB48]">{proposal.client.titleHighlight}</span>
               </>
             )}
          </h1>
          
          <p className="text-[15px] font-semibold text-slate-500 tracking-[0.05em] leading-relaxed max-w-[85%] mt-10">
             {proposal?.client?.subTitle || "Digital Transformation & Business Automation"}
          </p>
       </div>

       {/* CENTER RIGHT: Adaptive Logo Container */}
       <div className="absolute right-16 top-[48%] transform -translate-y-1/2 flex justify-center items-center z-30">
          <div 
            className="relative flex items-center justify-center shadow-[0_40px_100px_-10px_rgba(0,0,0,0.6)] border-none overflow-visible group transition-all duration-500 ease-in-out w-fit h-fit aspect-square min-w-[240px] min-h-[240px] max-w-[360px] max-h-[360px] rounded-full p-12"
            style={{ backgroundColor: isTransparent ? "#ffffff" : bgColor }}
          >
             {/* Adaptive Green Framing Line */}
             <div className="absolute -inset-4 border-l-[10px] border-b-[10px] border-[#99CB48] pointer-events-none drop-shadow-[0_0_15px_rgba(153,203,72,0.4)] rounded-full" />
             
             {/* The Image (Adaptive Scaling) */}
             <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full overflow-hidden">
               <img 
                 src={proposal?.client?.clientLogoUrl || weblozyLogo} 
                 alt={proposal?.client?.clientLogoUrl ? "Client Logo" : "Weblozy Default Logo"} 
                 className="w-full h-full max-w-full max-h-[220px] object-contain drop-shadow-sm transition-transform duration-700 group-hover:scale-105" 
               />
             </div>
          </div>
       </div>

       {/* BOTTOM: Features Grid */}
       <div className="absolute bottom-[170px] left-14 right-14 grid grid-cols-4 gap-8 z-20">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-[60px] h-[60px] rounded-full border-[1.5px] border-[#99CB48] flex items-center justify-center mb-5 bg-transparent">
                <Target size={28} className="text-[#99CB48]" strokeWidth={1.25} />
             </div>
             <h3 className="text-white text-[12px] font-bold tracking-widest uppercase mb-2">Strategic</h3>
             <p className="text-white/40 text-[9.5px] leading-[1.6] font-medium px-4">
               Purpose-driven automation aligned with your business goals.
             </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-[60px] h-[60px] rounded-full border-[1.5px] border-[#99CB48] flex items-center justify-center mb-5 bg-transparent">
                <Settings size={28} className="text-[#99CB48]" strokeWidth={1.25} />
             </div>
             <h3 className="text-white text-[12px] font-bold tracking-widest uppercase mb-2">Automated</h3>
             <p className="text-white/40 text-[9.5px] leading-[1.6] font-medium px-4">
               Intelligent workflows for maximum efficiency.
             </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-[60px] h-[60px] rounded-full border-[1.5px] border-[#99CB48] flex items-center justify-center mb-5 bg-transparent">
                <ShieldCheck size={28} className="text-[#99CB48]" strokeWidth={1.25} />
             </div>
             <h3 className="text-white text-[12px] font-bold tracking-widest uppercase mb-2">Secure</h3>
             <p className="text-white/40 text-[9.5px] leading-[1.6] font-medium px-4">
               Enterprise-grade security and data protection.
             </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center">
             <div className="w-[60px] h-[60px] rounded-full border-[1.5px] border-[#99CB48] flex items-center justify-center mb-5 bg-transparent">
                <BarChart3 size={28} className="text-[#99CB48]" strokeWidth={1.25} />
             </div>
             <h3 className="text-white text-[12px] font-bold tracking-widest uppercase mb-2">Scalable</h3>
             <p className="text-white/40 text-[9.5px] leading-[1.6] font-medium px-4">
               Built to scale with your growing business needs.
             </p>
          </div>
       </div>

       {/* BOTTOM METADATA BAR (Seamless Row) */}
       <div className="absolute bottom-[55px] left-14 right-14 border-t border-b border-white/10 py-5 grid grid-cols-3 z-20">
          <div className="flex items-center justify-center gap-6">
             <Calendar size={28} className="text-[#99CB48]" strokeWidth={1.5} />
             <div className="text-left">
               <div className="text-[8.5px] font-black text-white/40 tracking-[0.25em] uppercase mb-1.5">Proposal Date</div>
               <div className="text-white text-[13px] font-bold tracking-widest uppercase">
                 {proposal?.client?.filingDate || "MAY 2026"}
               </div>
             </div>
          </div>

          <div className="flex items-center justify-center gap-6 border-l border-white/10">
             <User size={28} className="text-[#99CB48]" strokeWidth={1.5} />
             <div className="text-left">
               <div className="text-[8.5px] font-black text-white/40 tracking-[0.25em] uppercase mb-1.5">Prepared For</div>
               <div className="text-white text-[13px] font-bold tracking-widest">
                 {clientName}
               </div>
             </div>
          </div>

          <div className="flex items-center justify-center gap-6 border-l border-white/10">
             <Globe size={28} className="text-[#99CB48]" strokeWidth={1.5} />
             <div className="text-left">
               <div className="text-[8.5px] font-black text-white/40 tracking-[0.25em] uppercase mb-1.5">Prepared By</div>
               <div className="text-white text-[13px] font-bold tracking-widest">
                 WEBLOZY
               </div>
             </div>
          </div>
       </div>

       {/* BOTTOM-MOST EDGE */}
       <div className="absolute bottom-[20px] left-14 right-14 flex justify-between items-center text-[7.5px] font-black tracking-[0.25em] text-white/30 uppercase z-20">
          <div className="flex items-center gap-4">
             <div className="w-6 h-[1px] bg-[#99CB48]" />
             <span>{proposal?.client?.footerMessage || "© WEBLOZY SOLUTIONS - WE AUTOMATE BUSINESSES"}</span>
          </div>
          <a 
            href={proposal?.client?.websiteUrl?.includes('http') ? proposal.client.websiteUrl : `https://${proposal?.client?.websiteUrl || 'www.weblozy.com'}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors text-[#99CB48]"
          >
             {proposal?.client?.websiteUrl || "WWW.WEBLOZY.COM"}
          </a>
       </div>

    </section>
  );
};

export default CoverPage;
