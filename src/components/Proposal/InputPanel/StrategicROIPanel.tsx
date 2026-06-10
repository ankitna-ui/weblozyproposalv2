import { TrendingUp, Clock, Settings, Link2, CheckCircle2 } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";

export default function StrategicROIPanel({ proposal, currentStep, updateROI }: InputPanelProps) {
  return (
    <div className="space-y-6 pb-8">
      <SectionHeader
        title="ROI Impact Calculator"
        subtitle="Configure key business value metrics - we'll visualize the projected ROI automatically"
        stepNumber={currentStep + 1}
      />

      {/* Expected Value Yield - Top Banner Box */}
      <InputGroupCard
        icon={<TrendingUp className="w-[18px] h-[18px]" />}
        title="Expected Value Yield"
        description="Maps to the dark Projected ROI Banner at the top of the page"
        accentColor="primary"
      >
        <div className="space-y-2">
          <LabelPremium>Expected Yield Value</LabelPremium>
          <ModernInput
            type="text"
            placeholder="e.g. ₹15L / Year"
            value={proposal.roi.expectedROI || ""}
            onChange={(e) => updateROI({ expectedROI: e.target.value })}
          />
        </div>
      </InputGroupCard>

      {/* 4 Cards Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1: Revenue Growth */}
        <InputGroupCard
          icon={<TrendingUp className="w-[18px] h-[18px]" />}
          title="Revenue Growth"
          description="Maps to the green Revenue Growth card"
          accentColor="emerald"
        >
          <div className="space-y-2">
            <LabelPremium>Revenue Increase % / Value</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 25"
              value={proposal.roi.revenueIncrease || ""}
              onChange={(e) => updateROI({ revenueIncrease: e.target.value })}
            />
          </div>
        </InputGroupCard>

        {/* Card 2: Manual Work Reduction */}
        <InputGroupCard
          icon={<Clock className="w-[18px] h-[18px]" />}
          title="Manual Work Reduction"
          description="Maps to the purple Manual Work card"
          accentColor="purple"
        >
          <div className="space-y-2">
            <LabelPremium>Work Hours Saved % / Value</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 40"
              value={proposal.roi.timeSaving || ""}
              onChange={(e) => updateROI({ timeSaving: e.target.value })}
            />
          </div>
        </InputGroupCard>

        {/* Card 3: Operational Efficiency */}
        <InputGroupCard
          icon={<Settings className="w-[18px] h-[18px]" />}
          title="Operational Efficiency"
          description="Maps to the blue Operational Efficiency card"
          accentColor="blue"
        >
          <div className="space-y-2">
            <LabelPremium>Efficiency Gain % / Value</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. 50"
              value={proposal.roi.productivityIncrease || ""}
              onChange={(e) => updateROI({ productivityIncrease: e.target.value })}
            />
          </div>
        </InputGroupCard>

        {/* Card 4: Payback Period */}
        <InputGroupCard
          icon={<TrendingUp className="w-[18px] h-[18px] rotate-90" />}
          title="Payback Period"
          description="Maps to the orange Payback Period card"
          accentColor="orange"
        >
          <div className="space-y-2">
            <LabelPremium>Estimated Payback Duration</LabelPremium>
            <ModernInput
              type="text"
              placeholder="e.g. Significant Operational Lift"
              value={proposal.roi.profitImpact || ""}
              onChange={(e) => updateROI({ profitImpact: e.target.value })}
            />
          </div>
        </InputGroupCard>
      </div>

      {/* Optional Report Link */}
      <InputGroupCard
        icon={<Link2 className="w-[18px] h-[18px]" />}
        title="Company Health Report Link (Optional)"
        description="A 'Company Health Report' button will appear on the proposal page if filled"
        accentColor="indigo"
      >
        <div className="space-y-3">
          <LabelPremium>Report URL</LabelPremium>
          <ModernInput
            type="url"
            placeholder="https://drive.google.com/file/..."
            value={proposal.roi.roiReportLink || ""}
            onChange={(e) => updateROI({ roiReportLink: e.target.value })}
          />
          {proposal.roi.roiReportLink && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#99CB48]/15 dark:bg-[#99CB48]/10 rounded-xl border border-[#99CB48]/20">
              <CheckCircle2 size={13} className="text-[#99CB48] shrink-0" />
              <span className="text-[9.5px] font-bold text-[#99CB48] dark:text-[#99CB48]/90">
                &quot;Company Health Report&quot; button will appear on the ROI page ✓
              </span>
            </div>
          )}
        </div>
      </InputGroupCard>
    </div>
  );
}
