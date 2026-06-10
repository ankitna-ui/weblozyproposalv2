import { Calendar, Mail, Phone, Shield, MapPin, Globe, MessageSquare } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, InputGroupCard } from "./shared";

export default function CTAClosingPanel({ proposal, currentStep, updateClosing }: InputPanelProps) {
  return (
    <div className="space-y-6 pb-10">
      <SectionHeader 
        title="Strategic Alignment & CTA" 
        subtitle="Finalize engagement protocols, addresses, social coordinates, and custom closing message" 
        stepNumber={currentStep + 1} 
      />

      {/* Booking and contact info card */}
      <InputGroupCard
        icon={<Calendar className="w-[18px] h-[18px]" />}
        title="Engagement Coordinates"
        description="Booking links and direct contact details"
        accentColor="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <LabelPremium>Booking Protocol URL</LabelPremium>
            <div className="relative">
              <ModernInput 
                className="pl-10 text-primary text-xs" 
                placeholder="e.g. https://calendly.com/your-booking" 
                value={proposal.closing.meetingLink || ""} 
                onChange={(e) => updateClosing({ meetingLink: e.target.value })} 
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
            </div>
          </div>

          <div className="space-y-2">
            <LabelPremium>Direct Operations Email</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="email"
                className="pl-10 text-slate-700 dark:text-gray-300" 
                placeholder="e.g. hello@company.com"
                value={proposal.closing.contactEmail || ""} 
                onChange={(e) => updateClosing({ contactEmail: e.target.value })} 
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
          </div>

          <div className="space-y-2">
            <LabelPremium>Direct Hotline (India)</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="tel"
                className="pl-10 text-slate-700 dark:text-gray-300" 
                placeholder="e.g. +91 98765 43210"
                value={proposal.closing.contactPhone || ""} 
                onChange={(e) => updateClosing({ contactPhone: e.target.value })} 
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
          </div>

          <div className="space-y-2">
            <LabelPremium>Direct Hotline (USA)</LabelPremium>
            <div className="relative">
              <ModernInput 
                type="tel"
                className="pl-10 text-slate-700 dark:text-gray-300" 
                placeholder="e.g. +1 (800) 123-4567"
                value={proposal.closing.contactPhoneUSA || ""} 
                onChange={(e) => updateClosing({ contactPhoneUSA: e.target.value })} 
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
          </div>
        </div>
      </InputGroupCard>

      {/* Address Card */}
      <InputGroupCard
        icon={<MapPin className="w-[18px] h-[18px]" />}
        title="Global Headquarters"
        description="Physical operational base address"
        accentColor="purple"
      >
        <div className="space-y-2">
          <LabelPremium>Global HQ Address</LabelPremium>
          <div className="relative">
            <ModernInput 
              className="pl-10 text-slate-700 dark:text-gray-300" 
              placeholder="e.g. 123 Business Center, Tech Park, NY 10001"
              value={proposal.closing.address || ""} 
              onChange={(e) => updateClosing({ address: e.target.value })} 
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>
      </InputGroupCard>

      {/* Closing Statement Card */}
      <InputGroupCard
        icon={<MessageSquare className="w-[18px] h-[18px]" />}
        title="Custom CTA Message"
        description="Closing statement text to conclude the document"
        accentColor="rose"
      >
        <div className="space-y-2">
          <LabelPremium>Closing Statement Narrative</LabelPremium>
          <textarea 
            className="w-full min-h-[100px] p-4 bg-white dark:bg-[#131722] border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold text-sm text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400 shadow-sm"
            placeholder="Introduce closing statement..."
            value={proposal.closing.ctaMessage || ""} 
            onChange={(e) => updateClosing({ ctaMessage: e.target.value })} 
          />
        </div>
      </InputGroupCard>

      {/* Social Coordinates Card */}
      <InputGroupCard
        icon={<Globe className="w-[18px] h-[18px]" />}
        title="Digital Coordinates"
        description="Toggle and configure external branding networks"
        accentColor="orange"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <LabelPremium className="mb-0">Instagram Link</LabelPremium>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#99CB48] rounded-sm"
                  checked={proposal.closing.showInstagram !== false}
                  onChange={(e) => updateClosing({ showInstagram: e.target.checked })}
                />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Show</span>
              </label>
            </div>
            <ModernInput 
              className={`text-xs text-slate-700 dark:text-gray-300 transition-opacity ${proposal.closing.showInstagram === false ? 'opacity-40' : ''}`}
              placeholder="e.g. https://instagram.com/yourcompany"
              value={proposal.closing.instagramLink || ""} 
              onChange={(e) => updateClosing({ instagramLink: e.target.value })} 
              disabled={proposal.closing.showInstagram === false}
            />
          </div>

          {/* X / Twitter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <LabelPremium className="mb-0">X (Twitter) Link</LabelPremium>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#99CB48] rounded-sm"
                  checked={proposal.closing.showX !== false}
                  onChange={(e) => updateClosing({ showX: e.target.checked })}
                />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Show</span>
              </label>
            </div>
            <ModernInput 
              className={`text-xs text-slate-700 dark:text-gray-300 transition-opacity ${proposal.closing.showX === false ? 'opacity-40' : ''}`}
              placeholder="e.g. https://x.com/yourcompany"
              value={proposal.closing.xLink || ""} 
              onChange={(e) => updateClosing({ xLink: e.target.value })} 
              disabled={proposal.closing.showX === false}
            />
          </div>

          {/* Facebook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <LabelPremium className="mb-0">Facebook Link</LabelPremium>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#99CB48] rounded-sm"
                  checked={proposal.closing.showFacebook !== false}
                  onChange={(e) => updateClosing({ showFacebook: e.target.checked })}
                />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Show</span>
              </label>
            </div>
            <ModernInput 
              className={`text-xs text-slate-700 dark:text-gray-300 transition-opacity ${proposal.closing.showFacebook === false ? 'opacity-40' : ''}`}
              placeholder="e.g. https://facebook.com/yourcompany"
              value={proposal.closing.facebookLink || ""} 
              onChange={(e) => updateClosing({ facebookLink: e.target.value })} 
              disabled={proposal.closing.showFacebook === false}
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <LabelPremium className="mb-0">LinkedIn Link</LabelPremium>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#99CB48] rounded-sm"
                  checked={proposal.closing.showLinkedin !== false}
                  onChange={(e) => updateClosing({ showLinkedin: e.target.checked })}
                />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Show</span>
              </label>
            </div>
            <ModernInput 
              className={`text-xs text-slate-700 dark:text-gray-300 transition-opacity ${proposal.closing.showLinkedin === false ? 'opacity-40' : ''}`}
              placeholder="e.g. https://linkedin.com/company/yourcompany"
              value={proposal.closing.linkedinLink || ""} 
              onChange={(e) => updateClosing({ linkedinLink: e.target.value })} 
              disabled={proposal.closing.showLinkedin === false}
            />
          </div>

          {/* YouTube */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <LabelPremium className="mb-0">YouTube Link</LabelPremium>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#99CB48] rounded-sm"
                  checked={proposal.closing.showYoutube !== false}
                  onChange={(e) => updateClosing({ showYoutube: e.target.checked })}
                />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Show</span>
              </label>
            </div>
            <ModernInput 
              className={`text-xs text-slate-700 dark:text-gray-300 transition-opacity ${proposal.closing.showYoutube === false ? 'opacity-40' : ''}`}
              placeholder="e.g. https://youtube.com/@yourcompany"
              value={proposal.closing.youtubeLink || ""} 
              onChange={(e) => updateClosing({ youtubeLink: e.target.value })} 
              disabled={proposal.closing.showYoutube === false}
            />
          </div>
        </div>
      </InputGroupCard>

      <div className="p-6 bg-slate-50 dark:bg-[#0B0E14] border border-slate-100 dark:border-white/5 rounded-3xl text-slate-900 dark:text-white flex items-center justify-between overflow-hidden relative shadow-sm">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={100} className="text-[#99CB48]" />
         </div>
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10B981]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white/90">Institutional NDA & Security Protocol Enforced</p>
         </div>
         <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-950 border border-emerald-800/50 px-4 py-1.5 rounded-full">
            SECURE ACCESS
         </span>
      </div>
    </div>
  );
}
