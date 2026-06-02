import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { TrendingUp, ArrowUpRight, Check, Target, Zap, Clock, Activity, BarChart3, ExternalLink, FileText } from "lucide-react";

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

  return (
    <PageWrapper pageNum={pageNum} title="ROI & Performance Impact">
      <div className="flex flex-col h-full space-y-6">

        {/* Header Section */}
        <div className="mb-2 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-[2px] bg-[#99CB48]" />
            <span className="text-[10px] font-black tracking-[0.15em] text-[#99CB48]">Phase 03: Impact</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-[#0B0E14] leading-none mb-1">
            Strategic <span className="text-[#99CB48]">ROI</span>
          </h2>
          <div className="text-[10px] font-bold text-slate-400 tracking-wide leading-none">
            Business Transformation in Numbers — Simple, Clear, Decisive
          </div>
        </div>

        {/* Main Content Grid: Left Dark Panel + Right Metrics */}
        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">

          {/* Left Column: Dark Hero Panel & Payback */}
          <div className="flex flex-col gap-6 min-h-0">
            {/* Projected Value Card */}
            <div
              className="p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between flex-1 group"
              style={{
                background: "linear-gradient(145deg, #0B0E14 0%, #151A24 60%, #0D1610 100%)",
                boxShadow: "0 20px 40px rgba(11,14,20,0.15)",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              {/* Background graph SVG */}
              <svg
                className="absolute bottom-0 right-0 w-[80%] h-full opacity-[0.08] pointer-events-none transition-transform duration-1000 group-hover:scale-105"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="roi-fill-gradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#99CB48" stopOpacity="0" />
                    <stop offset="100%" stopColor="#99CB48" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M0,90 Q30,72 55,42 T100,8 L100,100 L0,100 Z" fill="url(#roi-fill-gradient)" />
                <path d="M0,90 Q30,72 55,42 T100,8" fill="none" stroke="#99CB48" strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#99CB48] shadow-[0_0_8px_#99CB48] animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#99CB48] uppercase">Projected Value Yield</span>
                </div>
                <div
                  className="font-black text-white leading-none mt-4"
                  style={{ fontSize: "52px", letterSpacing: "-0.04em" }}
                >
                  {proposal?.roi?.expectedROI || "₹15L / Year"}
                </div>
                <div className="text-[14px] font-bold text-white/70 mt-2">
                  Projected Annual Business Impact
                </div>
                <div className="text-[11px] text-white/40 font-medium max-w-[85%] mt-1 leading-relaxed">
                  Estimated operational and revenue improvement after automation deployment.
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <Activity size={16} className="text-[#99CB48]" />
                  <span className="text-[10px] font-black tracking-[0.15em] text-white/50 uppercase">Growth Trajectory</span>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12"
                  style={{
                    background: "rgba(153,203,72,0.1)",
                    border: "1px solid rgba(153,203,72,0.3)",
                  }}
                >
                  <ArrowUpRight size={20} className="text-[#99CB48]" />
                </div>
              </div>
            </div>

            {/* Payback Period Card */}
            <div
              className="p-6 bg-gradient-to-r from-[#99CB48]/10 to-[#99CB48]/5 rounded-[2rem] border border-[#99CB48]/20 flex items-center gap-6 shrink-0 shadow-sm"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(153,203,72,0.15)",
                  border: "1px solid rgba(153,203,72,0.3)",
                  boxShadow: "0 4px 12px rgba(153,203,72,0.1)"
                }}
              >
                <Clock size={24} className="text-[#99CB48]" />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-[0.15em] text-[#99CB48] uppercase mb-1">Payback Period</div>
                <div className="text-3xl font-black text-[#0B0E14] tracking-tighter leading-none">
                  {proposal?.roi?.profitImpact || "4–6 Months"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Impact Metrics */}
          <div className="flex flex-col gap-6 min-h-0">
            {/* Revenue Growth */}
            <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/60 flex-1 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#99CB48] mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#99CB48]/10 flex items-center justify-center border border-[#99CB48]/20">
                    <TrendingUp size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.15em] uppercase">Revenue Growth</span>
                </div>
                <div className="text-4xl font-black text-[#0B0E14] tracking-tighter">
                  {proposal?.roi?.revenueIncrease || "+15% to +25%"}
                </div>
              </div>
              <div className="text-[12px] font-semibold text-slate-500 tracking-tight leading-relaxed mt-2 pr-4">
                Projected revenue uplift through optimized customer acquisition, retention, and operational efficiency.
              </div>
            </div>

            {/* Manual Work Reduction */}
            <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/60 flex-1 flex flex-col justify-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-500 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Zap size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.15em] uppercase">Manual Work Reduction</span>
                </div>
                <div className="text-4xl font-black text-[#0B0E14] tracking-tighter">
                  {proposal?.roi?.timeSaving || "40% Faster Ops"}
                </div>
              </div>
              <div className="text-[12px] font-semibold text-slate-500 tracking-tight leading-relaxed mt-2 pr-4">
                Reduced manual overhead through automation of repetitive tasks, workflows, and data entry.
              </div>
            </div>

            {/* Operational Efficiency */}
            <div className="p-6 bg-[#0B0E14] rounded-[2rem] border border-white/10 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#99CB48] rounded-full blur-[60px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2 text-[#99CB48] mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#99CB48]/10 flex items-center justify-center border border-[#99CB48]/20">
                    <Target size={14} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.15em] uppercase">Operational Efficiency</span>
                </div>
                <div className="text-4xl font-black text-white tracking-tighter">
                  {proposal?.roi?.productivityIncrease || "50% Better Flow"}
                </div>
              </div>
              <div className="relative z-10 text-[12px] font-semibold text-white/50 tracking-tight leading-relaxed mt-2 pr-4">
                Streamlined coordination, reduced communication silos, and enhanced team velocity.
              </div>
            </div>
          </div>
        </div>

        {/* Business Improvements Footer Strip */}
        <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-200/60 flex items-center justify-between shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#99CB48] shadow-sm shrink-0">
              <BarChart3 size={28} />
            </div>
            <div>
              <div className="text-[11px] font-black tracking-[0.15em] text-slate-900 uppercase mb-2">Expected Business Improvements</div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {improvements.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#99CB48]/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#99CB48]" strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[12px] font-black text-[#99CB48] tracking-[0.15em] bg-[#99CB48]/10 px-5 py-3 rounded-xl border border-[#99CB48]/20 uppercase shrink-0">
            Verified
          </div>
        </div>

        {/* Conditional: ROI Detail Report Button */}
        {proposal?.roi?.roiReportLink && (
          <a
            href={proposal.roi.roiReportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#0B0E14] rounded-[2rem] p-5 flex items-center justify-between border border-white/10 shadow-2xl shrink-0 transition-all hover:shadow-[0_8px_30px_rgba(11,14,20,0.4)] hover:border-white/20"
          >
            <div className="flex items-center gap-6">
              <div className="w-2.5 h-2.5 bg-[#99CB48] rounded-full shadow-[0_0_12px_#99CB48] animate-pulse" />
              <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-2">
                <FileText size={16} className="text-[#99CB48]" />
                <span className="text-[11px] font-black tracking-[0.15em] text-white uppercase">Business Health Report</span>
              </div>
              <span className="text-[10px] font-bold text-white/40 tracking-[0.1em] uppercase">Full confidential analysis — Click to access</span>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
              style={{
                background: "rgba(153,203,72,0.15)",
                border: "1px solid rgba(153,203,72,0.3)",
              }}
            >
              <ExternalLink size={16} className="text-[#99CB48]" />
            </div>
          </a>
        )}
      </div>
    </PageWrapper>
  );
};

export default StrategicROIPage;

