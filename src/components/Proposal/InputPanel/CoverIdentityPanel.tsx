import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";
import { ImagePlus, Hash, User, FileText, Settings, Calendar, Globe } from "lucide-react";
import React from "react";

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        resolve("");
        return;
      }
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
        const mime = isPng ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(mime, isPng ? undefined : 0.85));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
};

const convertUrlToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!url || !url.startsWith("http")) {
      resolve(url);
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 300;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
          return;
        }
      } catch (e) {
        console.warn("Canvas conversion failed for remote logo URL:", e);
      }
      resolve(url);
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
};

export default function CoverIdentityPanel({ proposal, currentStep, updateClient }: InputPanelProps) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Brand Identity" subtitle="Configure the high-level strategic markers for this document" stepNumber={currentStep + 1} />
      
      {/* Logo Card */}
      <InputGroupCard
        icon={<ImagePlus className="w-[18px] h-[18px]" />}
        title="Client Corporate Logo"
        description="Upload or provide a URL for the client's logo"
        accentColor="primary"
      >
        <div className="space-y-4">
          <ModernInput 
            placeholder="https://example.com/logo.png" 
            value={proposal.client.clientLogoUrl || ""} 
            onChange={(e) => {
              const val = e.target.value;
              updateClient({ clientLogoUrl: val });
              if (val && val.startsWith("http")) {
                convertUrlToBase64(val).then((base64) => {
                  if (base64 && base64.startsWith("data:")) {
                    updateClient({ clientLogoUrl: base64 });
                  }
                });
              }
            }} 
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#131720] px-2 text-slate-400 font-black tracking-widest text-[9px]">Or Upload from Device</span>
            </div>
          </div>
          
          <div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="client-logo-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const compressed = await compressImageFile(file);
                  if (compressed) {
                    updateClient({ clientLogoUrl: compressed });
                  }
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
      </InputGroupCard>

      {/* Identity Card */}
      <InputGroupCard
        icon={<User className="w-[18px] h-[18px]" />}
        title="Document Identity"
        description="Filing reference and client configuration"
        accentColor="blue"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </InputGroupCard>

      {/* Titles Card */}
      <InputGroupCard
        icon={<FileText className="w-[18px] h-[18px]" />}
        title="Document Title & Highlights"
        description="Core headings on the cover page"
        accentColor="purple"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <LabelPremium>Main Proposal Title</LabelPremium>
            <ModernInput placeholder="Strategic Digital Transformation" value={proposal.client.proposalTitle} onChange={(e) => updateClient({ proposalTitle: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <LabelPremium>Title Highlight (Optional)</LabelPremium>
            <ModernInput placeholder="e.g. Acme Corporation" value={proposal.client.titleHighlight || ""} onChange={(e) => updateClient({ titleHighlight: e.target.value })} />
          </div>
        </div>
      </InputGroupCard>

      {/* Protocol & Metadata Card */}
      <InputGroupCard
        icon={<Settings className="w-[18px] h-[18px]" />}
        title="Metadata & Taglines"
        description="Framework ordering and branding tags"
        accentColor="emerald"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <LabelPremium>Framework Title</LabelPremium>
            <ModernInput placeholder="Executive Protocol" value={proposal.client.frameworkTitle} onChange={(e) => updateClient({ frameworkTitle: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <LabelPremium>Corporate Tagline</LabelPremium>
            <ModernInput placeholder="Innovation at Scale" value={proposal.client.tagline} onChange={(e) => updateClient({ tagline: e.target.value })} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <LabelPremium>Strategic Domain (Industry)</LabelPremium>
            <ModernInput placeholder="E-Commerce & Logistics" value={proposal.client.industryTitle} onChange={(e) => updateClient({ industryTitle: e.target.value })} />
          </div>
        </div>
      </InputGroupCard>

      {/* Date & Footer Card */}
      <InputGroupCard
        icon={<Calendar className="w-[18px] h-[18px]" />}
        title="Filing & Verification Dates"
        description="Footer details and signing metrics"
        accentColor="orange"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <LabelPremium>Filing Date</LabelPremium>
            <ModernInput value={proposal.client.filingDate} onChange={(e) => updateClient({ filingDate: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <LabelPremium>Footer Protocol</LabelPremium>
            <ModernInput placeholder="e.g. © 2026 Your Company Name" value={proposal.client.footerMessage} onChange={(e) => updateClient({ footerMessage: e.target.value })} />
          </div>
        </div>
      </InputGroupCard>
    </div>
  );
}
