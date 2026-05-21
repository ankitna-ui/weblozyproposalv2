import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function CoverIdentityPanel({ proposal, currentStep, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-10">
      <SectionHeader title="Brand Identity" subtitle="Configure the high-level strategic markers for this document" stepNumber={currentStep + 1} />
      
      <div className="space-y-2">
        <LabelPremium>Proposal Reference ID</LabelPremium>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black group-focus-within:text-primary transition-colors">#</span>
          <ModernInput className="pl-10" placeholder="2024-001" value={proposal.client.referenceId} onChange={(e) => updateClient({ referenceId: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <LabelPremium>Main Proposal Title</LabelPremium>
        <ModernInput className="text-lg" placeholder="Strategic Digital Transformation" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Framework Title</LabelPremium>
          <ModernInput placeholder="Executive Protocol" value={proposal.client.frameworkTitle} onChange={(e) => updateClient({ frameworkTitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Corporate Tagline</LabelPremium>
          <ModernInput placeholder="Innovation at Scale" value={proposal.client.tagline} onChange={(e) => updateClient({ tagline: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <LabelPremium>Strategic Domain (Industry)</LabelPremium>
        <ModernInput placeholder="E-Commerce & Logistics" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Filing Date</LabelPremium>
          <ModernInput value={proposal.client.filingDate} onChange={(e) => updateClient({ filingDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Footer Protocol</LabelPremium>
          <ModernInput placeholder="© Weblozy Strategic Operations" value={proposal.client.footerMessage} onChange={(e) => updateClient({ footerMessage: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
