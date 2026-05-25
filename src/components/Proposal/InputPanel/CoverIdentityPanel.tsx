import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";
import { ImagePlus } from "lucide-react";
import React, { useRef } from "react";

export default function CoverIdentityPanel({ proposal, currentStep, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-10">
      <SectionHeader title="Brand Identity" subtitle="Configure the high-level strategic markers for this document" stepNumber={currentStep + 1} />
      
      
      <div className="space-y-4 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
        <div>
          <LabelPremium>Client Corporate Logo</LabelPremium>
          <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-wider">Upload or provide a URL for the client's logo to be featured on the cover page.</p>
        </div>
        
        <div className="space-y-3">
          <ModernInput 
            placeholder="https://example.com/logo.png" 
            value={proposal.client.clientLogoUrl || ""} 
            onChange={(e) => updateClient({ clientLogoUrl: e.target.value })} 
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 dark:bg-[#131720] px-2 text-slate-400 font-black tracking-widest text-[9px]">Or Upload from Device</span>
            </div>
          </div>
          
          <div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="client-logo-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateClient({ clientLogoUrl: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label 
              htmlFor="client-logo-upload"
              className="flex items-center justify-center gap-2 w-full h-12 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl cursor-pointer transition-colors text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 shadow-sm"
            >
              <ImagePlus size={16} className="text-primary" />
              Select Image from Gallery
            </label>
          </div>
          
          {proposal.client.clientLogoUrl && (
            <div className="mt-4 p-4 bg-white dark:bg-[#0B0E14] rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                <img src={proposal.client.clientLogoUrl} alt="Client Logo Preview" className="max-w-full max-h-full object-contain p-2" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Logo Attached</div>
                <button 
                  onClick={() => updateClient({ clientLogoUrl: "" })}
                  className="text-[9px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest mt-1"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <LabelPremium>Proposal Reference ID</LabelPremium>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black group-focus-within:text-primary transition-colors">#</span>
          <ModernInput className="pl-10" placeholder="e.g. 2026-001" value={proposal.client.referenceId} onChange={(e) => updateClient({ referenceId: e.target.value })} />
        </div>
      </div>

      
      <div className="space-y-2">
        <LabelPremium>Prepared For (Client Name)</LabelPremium>
        <ModernInput placeholder="e.g. Acme Corporation" value={proposal.client.clientName || ""} onChange={(e) => updateClient({ clientName: e.target.value })} />
      </div>

      <div className="space-y-2">
        <LabelPremium>Main Proposal Title</LabelPremium>
        <ModernInput className="text-lg" placeholder="Strategic Digital Transformation" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
      </div>

      <div className="space-y-2">
        <LabelPremium>Title Highlight (Optional Company Name)</LabelPremium>
        <ModernInput placeholder="e.g. Acme Corporation" value={proposal.client.titleHighlight || ""} onChange={(e) => updateClient({ titleHighlight: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <LabelPremium>Filing Date</LabelPremium>
          <ModernInput value={proposal.client.filingDate} onChange={(e) => updateClient({ filingDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <LabelPremium>Footer Protocol</LabelPremium>
          <ModernInput placeholder="e.g. © 2026 Your Company Name" value={proposal.client.footerMessage} onChange={(e) => updateClient({ footerMessage: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
