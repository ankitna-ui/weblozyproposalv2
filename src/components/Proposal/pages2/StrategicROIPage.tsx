import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { TrendingUp, Clock, Settings, ShieldCheck, Check, FileText, ExternalLink } from "lucide-react";
import roiIllustration from "@/assets/roi_3d_illustration.png";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const StrategicROIPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const improvements = [
    "Faster Operations",
    "Reduced Manual Errors",
    "Better Team Coordination",
    "Centralized Data Management",
    "Faster Client Response",
    "Improved Revenue Visibility",
  ];

  const profitImpactText = proposal?.roi?.profitImpact || "Significant Operational Lift";
  // Dynamically size the payback text so it fits beautifully in the card
  const profitImpactFontSize = profitImpactText.length > 5 
    ? "text-[15px] sm:text-[16px] min-h-[48px] flex items-center" 
    : "text-[48px]";

  return (
    <PageWrapper pageNum={pageNum} title="ROI & Performance Impact">
      <div className="flex flex-col h-full justify-between">

        {/* ─── Header & 3D Illustration Section ─── */}
        <div className="relative flex justify-between items-start w-full min-h-[190px] shrink-0">
          <div className="space-y-4 max-w-[55%] z-10">

            <div className="space-y-1">
              <h2 className="text-[38px] font-black tracking-tighter text-[#0B0E14] leading-none">
                Strategic <span className="text-[#99CB48]">ROI</span>
              </h2>
              <p className="text-[11px] font-bold text-slate-400 tracking-wide">
                Business Transformation in Numbers — Simple, Clear, Decisive
              </p>
            </div>
            
            {/* Projected ROI / Value Yield Box */}
            <div className="p-4 bg-gradient-to-r from-[#0B0E14] via-[#151A24] to-[#0A1629] border border-white/5 flex items-center justify-between shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] w-full max-w-[380px] rounded-[20px]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#99CB48]/15 border border-[#99CB48]/30 flex items-center justify-center text-[#99CB48] shadow-sm">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-[0.25em] text-[#99CB48] uppercase block">Expected Value Yield</span>
                  <span className="text-[11px] font-bold text-white/50 block mt-0.5">Annual ROI Impact</span>
                </div>
              </div>
              <div className="text-right pr-3">
                <span className="text-[26px] font-black text-[#99CB48] tracking-tight leading-none">
                  {proposal?.roi?.expectedROI || "₹15L / Year"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side illustration and background elements */}
          <div className="relative flex items-center justify-center w-[240px] h-[190px] mr-4 select-none shrink-0">
            {/* Concentric Grey Orbits */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[200px] h-[200px] rounded-full border border-slate-100/80 flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-full border border-slate-100/60 flex items-center justify-center">
                  <div className="w-[100px] h-[100px] rounded-full border border-slate-100/40" />
                </div>
              </div>
            </div>
            
            {/* Dot Pattern Graphic */}
            <div className="absolute top-[-10px] right-[-10px] grid grid-cols-4 gap-1.5 opacity-35 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#99CB48]/30" />
              ))}
            </div>

            <img src={roiIllustration} alt="Strategic ROI 3D" className="relative z-10 w-[200px] h-[200px] object-contain" />
          </div>
        </div>

        {/* ─── The 4 Column Metric Cards ─── */}
        <div className="grid grid-cols-4 gap-4 shrink-0">
          
          {/* Card 1: Revenue Growth */}
          <div className="p-5 rounded-[24px] bg-[#F4FAF0] border border-[#D9EFCD] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(153,203,72,0.08)] h-[330px]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#99CB48]/20 border border-[#99CB48]/30 flex items-center justify-center text-[#4F801B] shadow-sm">
                <TrendingUp size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#4F801B] mb-1">REVENUE GROWTH</div>
                <div className="text-[48px] font-black text-[#4F801B] tracking-tighter leading-none">
                  {proposal?.roi?.revenueIncrease || "25"}
                </div>
              </div>
            </div>
            <div>
              <div className="w-8 h-[2.5px] bg-[#99CB48] rounded-full my-3" />
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                Projected revenue uplift through optimized customer acquisition, retention, and operational efficiency.
              </p>
            </div>
          </div>

          {/* Card 2: Manual Work Reduction */}
          <div className="p-5 rounded-[24px] bg-[#F6F3FC] border border-[#E1D6FA] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(168,85,247,0.08)] h-[330px]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-700 shadow-sm">
                <Clock size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-purple-700 mb-1">MANUAL WORK REDUCTION</div>
                <div className="text-[48px] font-black text-purple-700 tracking-tighter leading-none">
                  {proposal?.roi?.timeSaving || "40"}
                </div>
              </div>
            </div>
            <div>
              <div className="w-8 h-[2.5px] bg-purple-500 rounded-full my-3" />
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                Reduced manual overhead through automation of repetitive tasks, workflows, and data entry.
              </p>
            </div>
          </div>

          {/* Card 3: Operational Efficiency */}
          <div className="p-5 rounded-[24px] bg-[#F0F5FD] border border-[#D4E3FB] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(59,130,246,0.08)] h-[330px]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 shadow-sm">
                <Settings size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#175CD3] mb-1">OPERATIONAL EFFICIENCY</div>
                <div className="text-[48px] font-black text-[#175CD3] tracking-tighter leading-none">
                  {proposal?.roi?.productivityIncrease || "50"}
                </div>
              </div>
            </div>
            <div>
              <div className="w-8 h-[2.5px] bg-blue-500 rounded-full my-3" />
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                Streamlined coordination, reduced communication silos, and enhanced team velocity.
              </p>
            </div>
          </div>

          {/* Card 4: Payback Period */}
          <div className="p-5 rounded-[24px] bg-[#FFF6ED] border border-[#FFDEC9] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(249,115,22,0.08)] h-[330px]">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 shadow-sm">
                <TrendingUp className="rotate-90" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#C4320A] mb-1">PAYBACK PERIOD</div>
                <div className={`font-black text-[#C4320A] tracking-tight leading-tight ${profitImpactFontSize}`}>
                  {profitImpactText}
                </div>
              </div>
            </div>
            <div>
              <div className="w-8 h-[2.5px] bg-orange-500 rounded-full my-3" />
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                Accelerated return on investment with compounding benefits across processes and performance.
              </p>
            </div>
          </div>

        </div>

        {/* ─── Bottom Panel: Expected Business Improvements ─── */}
        <div className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex-1 space-y-4">
            <h3 className="text-[10.5px] font-black uppercase tracking-widest text-slate-800">
              Expected Business Improvements
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {improvements.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#99CB48]/15 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#99CB48]" strokeWidth={4.5} />
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Vertical Separator Line */}
          <div className="w-[1px] h-14 bg-slate-200/70 mx-8" />
          
          {/* Verified Seal */}
          <div className="flex flex-col items-center shrink-0 w-[120px] text-center select-none">
            <div className="w-12 h-12 rounded-full bg-[#99CB48]/10 border-[1.5px] border-[#99CB48]/35 flex items-center justify-center mb-2 shadow-inner">
              <div className="w-8 h-8 rounded-full border border-[#99CB48]/20 flex items-center justify-center bg-white shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#99CB48]" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#99CB48] leading-none">Verified</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1.5 leading-none">Impact Validated</span>
          </div>
        </div>

        {/* ─── Conditional: ROI Detail Report Button ─── */}
        {proposal?.roi?.roiReportLink && (
          <a
            href={proposal.roi.roiReportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#0B0E14] rounded-[24px] p-4 flex items-center justify-between border border-white/10 shadow-2xl shrink-0 transition-all hover:border-white/20"
          >
            <div className="flex items-center gap-6">
              <div className="w-2 h-2 bg-[#99CB48] rounded-full shadow-[0_0_12px_#99CB48] animate-pulse" />
              <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
                <FileText size={14} className="text-[#99CB48]" />
                <span className="text-[10px] font-black tracking-[0.15em] text-white uppercase">Business Health Report</span>
              </div>
              <span className="text-[9px] font-bold text-white/40 tracking-[0.1em] uppercase">Full confidential analysis — Click to access</span>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style={{
                background: "rgba(153,203,72,0.15)",
                border: "1px solid rgba(153,203,72,0.3)",
              }}
            >
              <ExternalLink size={14} className="text-[#99CB48]" />
            </div>
          </a>
        )}
      </div>
    </PageWrapper>
  );
};

export default StrategicROIPage;

