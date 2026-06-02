import { DollarSign, Users, Clock, TrendingUp, Link2, CheckCircle2, AlertTriangle } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

// Auto ROI calculation removed – users will manually input ROI values.
const PROBLEMS_LIST = [
  "Faster Operations",
  "Reduced Manual Errors",
  "Better Team Coordination",
  "Centralized Data Management",
  "Faster Client Response",
  "Improved Revenue Visibility",
];

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {




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

      {/* Editable ROI Outputs */}
      <div className="space-y-4">
        <LabelPremium className="mb-0 text-[11px] font-extrabold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
          Projected ROI Outputs (Edit Directly)
        </LabelPremium>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
            <LabelPremium>Projected ROI</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. ₹25L / Year"
              className="mt-2 w-full"
              value={proposal.roi.expectedROI || ""}
              onChange={(e) => updateROI({ expectedROI: e.target.value })}
            />
          </div>
          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
            <LabelPremium>Revenue Growth Range</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. +15% to +25%"
              className="mt-2 w-full"
              value={proposal.roi.revenueIncrease || ""}
              onChange={(e) => updateROI({ revenueIncrease: e.target.value })}
            />
          </div>
          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
            <LabelPremium>Faster Operations</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 40% Faster Operations"
              className="mt-2 w-full"
              value={proposal.roi.timeSaving || ""}
              onChange={(e) => updateROI({ timeSaving: e.target.value })}
            />
          </div>
          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
            <LabelPremium>Better Workflow</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 50% Better Workflow"
              className="mt-2 w-full"
              value={proposal.roi.productivityIncrease || ""}
              onChange={(e) => updateROI({ productivityIncrease: e.target.value })}
            />
          </div>
          <div className="p-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
            <LabelPremium>Payback Period</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 4–6 Months"
              className="mt-2 w-full"
              value={proposal.roi.profitImpact || ""}
              onChange={(e) => updateROI({ profitImpact: e.target.value })}
            />
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
