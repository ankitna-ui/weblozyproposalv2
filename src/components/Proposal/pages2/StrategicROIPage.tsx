import React from "react";
import { Proposal } from "@/types/proposal";
import bannerLogo from "@/assets/banner_logo.png";
import { TrendingUp, ArrowUpRight, Check, Target, Zap, Clock, BadgeCheck, ExternalLink, FileText } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

const StrategicROIPage: React.FC<PageProps> = ({ proposal, pageNum }) => {

  const impactCards = [
    {
      icon: <TrendingUp size={16} />,
      label: "Revenue Growth",
      value: proposal?.roi?.revenueIncrease || "+15% to +25%",
      accent: "#99CB48",
      bg: "rgba(153,203,72,0.08)",
      border: "rgba(153,203,72,0.25)",
    },
    {
      icon: <Zap size={16} />,
      label: "Manual Work Reduction",
      value: proposal?.roi?.timeSaving || "40% Faster Operations",
      accent: "#1AA6E1",
      bg: "rgba(26,166,225,0.08)",
      border: "rgba(26,166,225,0.25)",
    },
    {
      icon: <Target size={16} />,
      label: "Operational Efficiency",
      value: proposal?.roi?.productivityIncrease || "50% Better Workflow",
      accent: "#99CB48",
      bg: "rgba(153,203,72,0.08)",
      border: "rgba(153,203,72,0.25)",
    },
    {
      icon: <Clock size={16} />,
      label: "Payback Period",
      value: proposal?.roi?.profitImpact || "4–6 Months",
      accent: "#1AA6E1",
      bg: "rgba(26,166,225,0.08)",
      border: "rgba(26,166,225,0.25)",
    },
  ];

  const improvements = [
    "Faster Operations",
    "Reduced Manual Errors",
    "Better Team Coordination",
    "Centralized Data Management",
    "Faster Client Response",
    "Improved Revenue Visibility",
  ];

  return (
    <section
      className="a4-page flex flex-col justify-between relative overflow-hidden shadow-xl"
      style={{
        background: "#F7F9FC",
        padding: "18mm 17mm 16mm 17mm",
      }}
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        <span
          style={{
            fontSize: "130px",
            fontWeight: 900,
            color: "rgba(153,203,72,0.04)",
            letterSpacing: "-0.04em",
            transform: "rotate(-22deg)",
            whiteSpace: "nowrap",
          }}
        >
          WEBLOZY
        </span>
      </div>

      {/* ── Top Header Bar ── */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <a
            href="https://www.weblozy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={bannerLogo}
              alt="Weblozy"
              style={{ height: "18px", width: "auto", objectFit: "contain" }}
              className="opacity-90"
            />
          </a>
          <div className="h-3 w-[1px] bg-slate-200" />
          <span className="text-[8.5px] font-black tracking-[0.14em] text-slate-400 uppercase">
            ROI &amp; Performance Impact
          </span>
        </div>
        <span className="text-[8px] font-extrabold tracking-[0.15em] text-slate-300 uppercase">
          Corporate / Strategic
        </span>
      </div>

      {/* ── Phase Label + Title ── */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-[2.5px] rounded-full bg-[#99CB48]" />
          <span className="text-[9px] font-black tracking-[0.18em] text-[#99CB48] uppercase">Phase 03: Impact</span>
        </div>
        <h1 className="text-[46px] font-black tracking-tighter text-[#0B0E14] leading-none">
          Strategic <span className="text-[#99CB48]">ROI.</span>
        </h1>
        <div className="text-[11px] font-semibold text-slate-400 mt-1 tracking-wide">
          Business Transformation in Numbers — Simple, Clear, Decisive
        </div>
      </div>

      {/* ── Hero ROI Card ── */}
      <div
        className="relative z-10 rounded-2xl overflow-hidden flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #0B0E14 0%, #0F1A2C 60%, #0B1A0D 100%)",
          padding: "22px 28px",
          minHeight: "140px",
          border: "1px solid rgba(153,203,72,0.2)",
          boxShadow: "0 8px 40px rgba(11,14,20,0.18), inset 0 0 60px rgba(153,203,72,0.03)",
        }}
      >
        {/* Background graph SVG */}
        <svg
          className="absolute bottom-0 right-0 w-[45%] h-full opacity-20 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="roi-fill-gradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#99CB48" stopOpacity="0" />
              <stop offset="100%" stopColor="#99CB48" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path d="M0,90 Q30,72 55,42 T100,8 L100,100 L0,100 Z" fill="url(#roi-fill-gradient)" />
          <path d="M0,90 Q30,72 55,42 T100,8" fill="none" stroke="#99CB48" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* Left: Number */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#99CB48] shadow-[0_0_8px_#99CB48]" />
            <span className="text-[8.5px] font-black tracking-[0.2em] text-[#99CB48] uppercase">Projected Value Yield</span>
          </div>
          <div
            className="font-black text-white leading-none"
            style={{ fontSize: "56px", letterSpacing: "-0.03em" }}
          >
            {proposal?.roi?.expectedROI || "₹15L / Year"}
          </div>
          <div className="text-[12px] font-bold text-white/70 mt-1.5">
            Projected Annual Business Impact
          </div>
          <div className="text-[9px] text-white/35 mt-0.5 font-medium">
            Estimated operational and revenue improvement after automation deployment.
          </div>
        </div>

        {/* Right: Arrow Badge */}
        <div className="relative z-10 shrink-0 ml-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border"
            style={{
              background: "rgba(153,203,72,0.1)",
              borderColor: "rgba(153,203,72,0.3)",
            }}
          >
            <ArrowUpRight size={20} className="text-[#99CB48]" />
          </div>
        </div>
      </div>

      {/* ── 4 Impact Metric Cards ── */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        {impactCards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl flex flex-col justify-between"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              padding: "16px",
              minHeight: "100px",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: `${card.accent}15`,
                color: card.accent,
                border: `1px solid ${card.accent}25`,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div
                className="font-extrabold tracking-tight leading-snug mb-0.5"
                style={{ fontSize: "14px", color: "#0B0E14" }}
              >
                {card.value}
              </div>
              <div
                className="text-[8px] font-bold uppercase tracking-widest"
                style={{ color: card.accent }}
              >
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Business Improvements Checklist (Two columns side by side) ── */}
      <div
        className="relative z-10 rounded-2xl"
        style={{
          background: "#fff",
          border: "1px solid #EAECF0",
          padding: "18px 20px",
          boxShadow: "0 2px 10px rgba(11,14,20,0.05)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3.5">
          <BadgeCheck size={14} className="text-[#99CB48]" />
          <span className="text-[9px] font-black tracking-[0.18em] text-[#0B0E14] uppercase">
            Expected Business Improvements
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
          {improvements.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(153,203,72,0.12)",
                  border: "1px solid rgba(153,203,72,0.3)",
                }}
              >
                <Check className="w-3 h-3 text-[#99CB48]" strokeWidth={3} />
              </div>
              <span className="text-[12px] font-semibold text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Conditional: ROI Detail Report Button ── */}
      {proposal?.roi?.roiReportLink && (
        <div className="relative z-10">
          <a
            href={proposal.roi.roiReportLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full rounded-2xl transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0B0E14 0%, #0F1A2C 100%)",
              border: "1px solid rgba(153,203,72,0.3)",
              padding: "18px 24px",
              boxShadow: "0 4px 24px rgba(11,14,20,0.12)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(153,203,72,0.12)",
                  border: "1px solid rgba(153,203,72,0.25)",
                  boxShadow: "0 0 16px rgba(153,203,72,0.15)",
                }}
              >
                <FileText size={18} className="text-[#99CB48]" />
              </div>
              <div>
                <div className="text-[8px] font-black tracking-[0.2em] text-[#99CB48] mb-0.5">
              CLICK TO ACCESS
                </div>
                <div className="text-[16px] font-extrabold text-white leading-none tracking-tight">
                  Business Health Report — Confidential Analysis
                </div>
                <div className="text-[9.5px] text-white/40 font-medium mt-0.5">
                  Full business health analysis: operational strength, revenue outlook &amp; growth roadmap
                </div>
              </div>
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
        </div>
      )}

      {/* ── Bottom Insight Strip ── */}
      <div
        className="relative z-10 rounded-xl flex items-center justify-between"
        style={{
          background: "rgba(153,203,72,0.06)",
          border: "1px solid rgba(153,203,72,0.18)",
          padding: "12px 18px",
        }}
      >
        <div className="text-[10px] font-semibold text-slate-600 italic leading-relaxed">
          "Projected business impact based on current operational workflow and automation opportunities."
        </div>
        <span
          className="text-[7.5px] font-black uppercase tracking-[0.18em] shrink-0 pl-5"
          style={{ color: "#99CB48" }}
        >
          Accurate Projection
        </span>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-5">
          <span className="text-[7px] font-bold tracking-[0.12em] text-slate-300">
            © WEBLOZY • WE AUTOMATE BUSINESS • WWW.WEBLOZY.COM
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-[1px] bg-slate-200" />
          <span className="text-[9px] font-black tracking-[0.15em] text-[#99CB48]">
            PAGE 0{pageNum}
          </span>
        </div>
      </div>
    </section>
  );
};

export default StrategicROIPage;
