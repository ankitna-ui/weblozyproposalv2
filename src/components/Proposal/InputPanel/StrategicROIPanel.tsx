import { useEffect } from "react";
import { DollarSign, Users, Clock, TrendingUp, Link2, CheckCircle2, AlertTriangle } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

const PROBLEMS_LIST = [
  "Faster Operations",
  "Reduced Manual Errors",
  "Better Team Coordination",
  "Centralized Data Management",
  "Faster Client Response",
  "Improved Revenue Visibility",
];

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {

  // ── AUTO ROI ENGINE ──────────────────────────────────────────────────
  useEffect(() => {
    const monthlyRevenue = parseFloat(proposal.roi.monthlyRevenue || "500000") || 500000;
    const savedHours     = parseFloat(proposal.roi.manualHoursPerMonth || "160") || 160;
    const growthPct      = parseFloat(proposal.roi.expectedGrowthGoal || "25") || 25;

    // Revenue impact: monthly * 12 * growth%
    const revenueImpact = monthlyRevenue * 12 * (growthPct / 100);
    // Time saving impact: hours saved * 12 months * ₹650 per hour (industry avg)
    const timeSavingImpact = savedHours * 12 * 650;
    const totalImpact = revenueImpact + timeSavingImpact;

    // Format ROI number
    let roiLabel = "";
    if (totalImpact >= 10_000_000) {
      roiLabel = `₹${(totalImpact / 10_000_000).toFixed(1)} Cr / Year`;
    } else if (totalImpact >= 100_000) {
      roiLabel = `₹${Math.round(totalImpact / 100_000)}L / Year`;
    } else {
      roiLabel = `₹${Math.round(totalImpact / 1_000).toLocaleString("en-IN")}K / Year`;
    }

    // Revenue Growth label
    const lo = Math.max(5, growthPct - 5);
    const hi = growthPct + 5;
    const growthRange = `+${lo}% to +${hi}%`;

    // Hours saved label
    const hoursPct = Math.min(80, Math.round(30 + savedHours / 15));
    const timeSavingLabel = `${hoursPct}% Faster Operations`;

    // Ops efficiency based on selected problems
    const problemCount = proposal.roi.businessProblems?.length || 3;
    const efficiencyPct = Math.min(90, Math.max(30, problemCount * 12 + 20));
    const efficiencyLabel = `${efficiencyPct}% Better Workflow`;

    // Payback period (static executive friendly)
    const payback = "4–6 Months";

    const updates: Partial<typeof proposal.roi> = {
      expectedROI: roiLabel,
      revenueIncrease: growthRange,
      timeSaving: timeSavingLabel,
      productivityIncrease: efficiencyLabel,
      profitImpact: payback,
    };
    updateROI(updates);
  }, [
    proposal.roi.monthlyRevenue,
    proposal.roi.manualHoursPerMonth,
    proposal.roi.expectedGrowthGoal,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(proposal.roi.businessProblems),
  ]);

  const toggleProblem = (problem: string) => {
    const current = proposal.roi.businessProblems || [];
    updateROI({
      businessProblems: current.includes(problem)
        ? current.filter((p) => p !== problem)
        : [...current, problem],
    });
  };

  return (
    <div className="space-y-8 pb-8">
      <SectionHeader
        title="ROI Impact Calculator"
        subtitle="Fill in 4 simple business numbers — we'll calculate the projected annual ROI automatically"
        stepNumber={currentStep + 1}
      />

      {/* ── 4 Core Inputs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Monthly Revenue */}
        <div className="p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
            <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              Current Monthly Revenue (₹)
            </LabelPremium>
          </div>
          <ModernInput
            type="number"
            placeholder="e.g. 500000"
            className="h-10 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 border-none rounded-lg focus-visible:ring-emerald-500"
            value={proposal.roi.monthlyRevenue || ""}
            onChange={(e) => updateROI({ monthlyRevenue: e.target.value })}
          />
          <p className="text-[9px] text-slate-400 font-medium">
            Your company's current monthly income
          </p>
        </div>

        {/* Total Employees */}
        <div className="p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
            <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              Total Employees
            </LabelPremium>
          </div>
          <ModernInput
            type="number"
            placeholder="e.g. 10"
            className="h-10 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 border-none rounded-lg focus-visible:ring-blue-500"
            value={proposal.roi.totalEmployees || ""}
            onChange={(e) => updateROI({ totalEmployees: e.target.value })}
          />
          <p className="text-[9px] text-slate-400 font-medium">
            Total headcount in your organisation
          </p>
        </div>

        {/* Hours Saved Per Month */}
        <div className="p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
            <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              Hours Saved / Month (Approx)
            </LabelPremium>
          </div>
          <ModernInput
            type="number"
            placeholder="e.g. 160"
            className="h-10 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 border-none rounded-lg focus-visible:ring-amber-500"
            value={proposal.roi.manualHoursPerMonth || ""}
            onChange={(e) => updateROI({ manualHoursPerMonth: e.target.value })}
          />
          <p className="text-[9px] text-slate-400 font-medium">
            Estimated manual hours our software will recover per month
          </p>
        </div>

        {/* Expected Growth */}
        <div className="p-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl space-y-2 hover:shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48]">
              <TrendingUp size={16} />
            </div>
            <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              Expected Revenue Growth (%)
            </LabelPremium>
          </div>
          <ModernInput
            type="number"
            placeholder="e.g. 25"
            className="h-10 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 border-none rounded-lg focus-visible:ring-[#99CB48]"
            value={proposal.roi.expectedGrowthGoal || ""}
            onChange={(e) => updateROI({ expectedGrowthGoal: e.target.value })}
          />
          <p className="text-[9px] text-slate-400 font-medium">
            Approximate annual revenue growth after automation
          </p>
        </div>
      </div>

      {/* ── Business Problems (multi-select) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
            Business Problems to Solve
          </LabelPremium>
          <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">
            Select all that apply
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROBLEMS_LIST.map((problem) => {
            const selected = (proposal.roi.businessProblems || []).includes(problem);
            return (
              <button
                key={problem}
                type="button"
                onClick={() => toggleProblem(problem)}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                  selected
                    ? "bg-[#99CB48]/10 border-[#99CB48] text-[#0B0E14] shadow-sm"
                    : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-slate-300 dark:border-white/20 text-slate-600 dark:text-gray-400"
                }`}
              >
                <span>{problem}</span>
                {selected
                  ? <CheckCircle2 size={15} className="text-[#99CB48] shrink-0" />
                  : <AlertTriangle size={15} className="text-slate-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Live ROI Preview ── */}
      <div className="p-6 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl text-slate-900 dark:text-white relative overflow-hidden shadow-xl border border-slate-200 dark:border-white/5">
        <div className="absolute top-[-30px] right-[-30px] w-44 h-44 rounded-full bg-[#99CB48]/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-[#99CB48]">
              Live Projected ROI
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 leading-none">
              {proposal.roi.expectedROI || "₹15L / Year"}
            </div>
            <p className="text-[9px] font-semibold text-slate-900 dark:text-white/40 mt-1">
              Auto-calculated from your inputs
            </p>
          </div>
          <div className="flex flex-col sm:items-end justify-center">
            <span className="text-[7.5px] font-black uppercase tracking-[0.25em] text-slate-900 dark:text-white/30">
              Revenue Growth Range
            </span>
            <div className="text-base font-extrabold text-[#99CB48] mt-1">
              {proposal.roi.revenueIncrease || "+15% to +25%"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Optional Report Link ── */}
      <div className="p-5 bg-white dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-3 hover:shadow-sm transition-all">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Link2 size={16} />
          </div>
          <div>
            <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
              Company Health Report Link (Optional)
            </LabelPremium>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">
              Paste a Google Drive / PDF link — a "Company Health Report" button will appear on the proposal page
            </p>
          </div>
        </div>
        <ModernInput
          type="url"
          placeholder="https://drive.google.com/file/..."
          className="h-10 px-3 text-sm font-semibold text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 border-none rounded-lg focus-visible:ring-indigo-400"
          value={proposal.roi.roiReportLink || ""}
          onChange={(e) => updateROI({ roiReportLink: e.target.value })}
        />
        {proposal.roi.roiReportLink && (
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
            <CheckCircle2 size={13} className="text-indigo-500 shrink-0" />
            <span className="text-[9.5px] font-bold text-indigo-600">
              "Company Health Report" button will appear on the ROI page ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
