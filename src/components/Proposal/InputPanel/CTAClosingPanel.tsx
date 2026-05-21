import { Calendar, Mail, Phone, Shield, MapPin, Globe, MessageSquare } from "lucide-react";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput } from "./shared";

export default function CTAClosingPanel({ proposal, currentStep, updateClosing }: InputPanelProps) {
  return (
    <div className="space-y-12 pb-10">
      <SectionHeader 
        title="Strategic Alignment & CTA" 
        subtitle="Finalize engagement protocols, addresses, social coordinates, and custom closing message" 
        stepNumber={currentStep + 1} 
      />

      {/* Row 1: Scheduling & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Engagement Scheduling Protocol</LabelPremium>
            <Calendar size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              className="pl-12 font-black text-primary text-xs" 
              placeholder="e.g. https://calendly.com/weblozy" 
              value={proposal.closing.meetingLink || ""} 
              onChange={(e) => updateClosing({ meetingLink: e.target.value })} 
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
          </div>
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Direct Operations Email</LabelPremium>
            <Mail size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              type="email"
              className="pl-12 font-bold text-slate-700" 
              placeholder="info@weblozy.com"
              value={proposal.closing.contactEmail || ""} 
              onChange={(e) => updateClosing({ contactEmail: e.target.value })} 
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
      </div>

      {/* Row 2: India Hotline & USA Hotline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Direct Hotline (India)</LabelPremium>
            <Phone size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              type="tel"
              className="pl-12 font-bold text-slate-700" 
              placeholder="+91 96678 96604"
              value={proposal.closing.contactPhone || ""} 
              onChange={(e) => updateClosing({ contactPhone: e.target.value })} 
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div className="space-y-4 group">
          <div className="flex items-center justify-between px-2">
            <LabelPremium className="mb-0 text-slate-900">Direct Hotline (USA)</LabelPremium>
            <Phone size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
          </div>
          <div className="relative">
            <ModernInput 
              type="tel"
              className="pl-12 font-bold text-slate-700" 
              placeholder="+1 (320) 433-0111"
              value={proposal.closing.contactPhoneUSA || ""} 
              onChange={(e) => updateClosing({ contactPhoneUSA: e.target.value })} 
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>
      </div>

      {/* Row 3: Physical Address */}
      <div className="space-y-4 group">
        <div className="flex items-center justify-between px-2">
          <LabelPremium className="mb-0 text-slate-900">Global HQ Address</LabelPremium>
          <MapPin size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
        </div>
        <div className="relative">
          <ModernInput 
            className="pl-12 font-bold text-slate-700" 
            placeholder="GH-03, Sector 16B, Greater Noida, Uttar Pradesh 201318"
            value={proposal.closing.address || ""} 
            onChange={(e) => updateClosing({ address: e.target.value })} 
          />
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        </div>
      </div>

      {/* Row 4: Custom Message */}
      <div className="space-y-4 group">
        <div className="flex items-center justify-between px-2">
          <LabelPremium className="mb-0 text-slate-900">Custom CTA Message (Closes gaps in layout)</LabelPremium>
          <MessageSquare size={16} className="text-slate-300 group-hover:text-primary transition-colors duration-300" />
        </div>
        <div className="relative">
          <textarea 
            className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-xs text-slate-700 transition-all placeholder:text-slate-300 shadow-sm"
            placeholder="Introduce closing statement..."
            value={proposal.closing.ctaMessage || ""} 
            onChange={(e) => updateClosing({ ctaMessage: e.target.value })} 
          />
        </div>
      </div>

      {/* Row 5: Social Coordinate Links */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Globe size={16} className="text-primary" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Digital Expansion Coordinates</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="space-y-2">
            <LabelPremium className="text-[9px] text-slate-500">Instagram Link</LabelPremium>
            <ModernInput 
              className="font-medium text-xs text-slate-700" 
              placeholder="e.g. https://www.instagram.com/weblozy/"
              value={proposal.closing.instagramLink || ""} 
              onChange={(e) => updateClosing({ instagramLink: e.target.value })} 
            />
          </div>

          {/* X / Twitter */}
          <div className="space-y-2">
            <LabelPremium className="text-[9px] text-slate-500">X (Twitter) Link</LabelPremium>
            <ModernInput 
              className="font-medium text-xs text-slate-700" 
              placeholder="e.g. https://x.com/weblozy"
              value={proposal.closing.xLink || ""} 
              onChange={(e) => updateClosing({ xLink: e.target.value })} 
            />
          </div>

          {/* Facebook */}
          <div className="space-y-2">
            <LabelPremium className="text-[9px] text-slate-500">Facebook Link</LabelPremium>
            <ModernInput 
              className="font-medium text-xs text-slate-700" 
              placeholder="e.g. https://www.facebook.com/weblozy/"
              value={proposal.closing.facebookLink || ""} 
              onChange={(e) => updateClosing({ facebookLink: e.target.value })} 
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <LabelPremium className="text-[9px] text-slate-500">LinkedIn Link</LabelPremium>
            <ModernInput 
              className="font-medium text-xs text-slate-700" 
              placeholder="e.g. https://www.linkedin.com/company/weblozy/"
              value={proposal.closing.linkedinLink || ""} 
              onChange={(e) => updateClosing({ linkedinLink: e.target.value })} 
            />
          </div>

          {/* YouTube - full row */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <LabelPremium className="text-[9px] text-slate-500">YouTube Link</LabelPremium>
            <ModernInput 
              className="font-medium text-xs text-slate-700" 
              placeholder="e.g. https://www.youtube.com/@weblozy"
              value={proposal.closing.youtubeLink || ""} 
              onChange={(e) => updateClosing({ youtubeLink: e.target.value })} 
            />
          </div>
        </div>
      </div>

      <div className="p-8 bg-[#0B0E14] rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative shadow-xl">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield size={100} className="text-primary" />
         </div>
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10B981]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Institutional NDA & Security Protocol Enforced</p>
         </div>
         <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 border border-emerald-800/50 px-4 py-1.5 rounded-full">
            SECURE ACCESS
         </span>
      </div>
    </div>
  );
}
