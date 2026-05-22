import React from "react";
import { Proposal } from "@/types/proposal";
import banner2Logo from "@/assets/banner2_logo.png";
import { Phone, Mail, Globe, MapPin, Headphones, Calendar } from "lucide-react";

interface PageProps {
   proposal: Proposal;
   pageNum: number;
}

// Inline Custom SVGs to guarantee compile-time stability and styling control
const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
   </svg>
);

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
   </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
   </svg>
);

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
   </svg>
);

const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
   </svg>
);

const YoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
   >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
   </svg>
);

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
   <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
   >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.99S14.64 1.8 12.008 1.8c-5.435 0-9.863 4.42-9.866 9.863-.001 1.762.476 3.42 1.39 4.911L2.518 21.35l4.129-1.196zm10.435-6.283c-.3-.149-1.772-.874-2.046-.973-.274-.1-.474-.149-.673.15-.199.299-.772.973-.946 1.172-.175.199-.349.224-.649.075-.3-.149-1.266-.467-2.41-1.485-.89-.793-1.49-1.773-1.665-2.072-.175-.3-.019-.462.13-.611.135-.134.3-.349.449-.523.15-.174.2-.299.3-.498.1-.199.05-.374-.025-.523-.075-.15-.673-1.62-.922-2.218-.242-.587-.487-.509-.668-.518-.173-.008-.372-.01-.572-.01-.2 0-.523.075-.798.373-.274.299-1.046 1.022-1.046 2.49 0 1.469 1.07 2.889 1.22 3.088.149.199 2.107 3.218 5.103 4.512.713.308 1.27.492 1.703.629.717.228 1.369.196 1.884.119.574-.085 1.772-.723 2.022-1.42.25-.697.25-1.294.174-1.42-.075-.125-.274-.199-.574-.349z"/>
   </svg>
);

const ClosingPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
   const contactPhoneRaw = proposal?.closing?.contactPhone || "+91 96678 96604";
   let cleanPhone = contactPhoneRaw.replace(/[^0-9]/g, "");
   if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
   }
   
   const proposalId = proposal?.client?.referenceId || proposal?.id || "N/A";
   const proposalTitle = proposal?.client?.proposalTitle || "Strategic Business Automation";
   const whatsappMsg = `Hello Weblozy Team,\n\nI have reviewed the proposal and would like to officially approve it.\n\n*Proposal Title:* ${proposalTitle}\n*Proposal ID:* ${proposalId}\n\nPlease proceed with the next steps.\n\nThank you!`;
   const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

   return (
      <section className="a4-page closing-page flex flex-col justify-between relative overflow-hidden text-white shadow-2xl" style={{ 
         background: 'linear-gradient(160deg, #0B0E14 0%, #0F1923 40%, #0B0E14 100%)',
         padding: '18mm 17mm 18mm 17mm'
      }}>
         {/* Subtle Grid Pattern */}
         <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
         }} />
         
         {/* Accent Glow */}
         <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#1AA6E1]/5 blur-[120px]" />
         <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-[#99CB48]/5 blur-[100px]" />

         {/* ── Section 1: Top Bar ── */}
         <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <a href="https://www.weblozy.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <img src={banner2Logo} alt="Partners" style={{ height: '34px', width: 'auto', objectFit: 'contain', maxWidth: '180px' }} />
               </a>
               <div className="h-5 w-[1px] bg-white/10" />
               <span className="text-[8px] font-black tracking-[0.15em] text-white/30">STRATEGIC OPERATIONS</span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-black tracking-[0.12em] text-[#99CB48]">
               <LockIcon className="w-3 h-3 text-[#99CB48]" />
               <span>CONFIDENTIAL PROPOSAL – 2026</span>
            </div>
         </div>

         {/* ── Section 2: Hero Title & Approve Action ── */}
         <div className="relative z-10 flex items-start justify-between gap-6">
            <div>
               <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg mb-3.5">
                  <div className="w-2 h-2 rounded-full bg-[#99CB48] shadow-[0_0_10px_#99CB48]" />
                  <span className="text-[8px] font-black tracking-[0.15em] text-white/50">ESTABLISH CONNECTION</span>
               </div>
               <h1 className="text-[60px] font-black leading-[0.82] tracking-[-0.04em] pb-3">
                  <span className="text-white/95 font-light italic">Let's</span><br />
                  <span className="text-[#99CB48] tracking-[-0.05em] uppercase">Collaborate.</span>
               </h1>
               <div className="h-[3.5px] w-40 bg-gradient-to-r from-[#99CB48] to-[#1AA6E1] mt-4 rounded-full" />
            </div>
            
            {/* Approve Action — top-right empty space (red box area) */}
            <div className="shrink-0 flex flex-col items-end gap-2 mt-1">
               {/* Client action label */}
               <div className="text-[7.5px] font-black tracking-[0.2em] text-white/25 uppercase">Client Action Required</div>
               
               {/* Premium themed approve button */}
               <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative px-5 py-3.5 bg-[#0B0E14] border border-[#99CB48]/35 rounded-2xl transition-all hover:border-[#99CB48]/70 shadow-[0_0_24px_rgba(153,203,72,0.08)] hover:shadow-[0_0_35px_rgba(153,203,72,0.22)] hover:translate-y-[-1px] font-sans flex items-center gap-3.5 cursor-pointer overflow-hidden"
               >
                  {/* Soft gradient fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#99CB48]/8 via-transparent to-transparent pointer-events-none" />
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-[#99CB48] to-[#1AA6E1] rounded-full" />
                  
                  {/* WhatsApp Icon in themed container */}
                  <div className="relative z-10 w-9 h-9 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center shrink-0 group-hover:bg-[#99CB48]/15 transition-colors">
                     <WhatsAppIcon className="w-4 h-4" style={{ fill: '#99CB48' }} />
                  </div>
                  
                  {/* Text block */}
                  <div className="relative z-10">
                     <div className="text-[12px] font-black tracking-[0.08em] text-white leading-tight">Approve Proposal</div>
                     <div className="text-[8.5px] text-[#99CB48]/70 font-semibold tracking-wide leading-tight mt-0.5">via WhatsApp</div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="relative z-10 ml-1 text-[#99CB48]/40 group-hover:text-[#99CB48]/80 group-hover:translate-x-0.5 transition-all text-sm font-black">→</div>
               </a>
            </div>
         </div>

         {/* ── Section 3: Main Content Grid ── */}
         <div className="relative z-10 grid grid-cols-5 gap-8">
            
            {/* Left: 2 cols — Dynamic Description & Support Protocol Card */}
            <div className="col-span-2 flex flex-col gap-6 justify-start">
               {/* Bypass default p override */}
               <div className="text-[12.5px] font-semibold leading-[1.65] text-white/80">
                  {proposal?.closing?.ctaMessage || "Our architecture is engineered for precision. We are ready to deploy your strategic roadmap and scale your operations with master-grade automation. Our unified solutions optimize resources, eradicate technical debt, and ensure absolute operational velocity."}
               </div>

               {/* Support Card */}
               <div className="p-5 rounded-xl border border-[#99CB48]/20 bg-white/[0.02] space-y-4">
                  <div className="flex items-center gap-2.5">
                     <div className="w-8.5 h-8.5 rounded-full border border-[#99CB48]/20 flex items-center justify-center bg-[#99CB48]/5">
                        <Headphones size={15} className="text-[#99CB48]" />
                     </div>
                     <span className="text-[8.5px] font-bold tracking-[0.15em] text-[#99CB48]">SUPPORT PROTOCOL</span>
                  </div>
                  
                  <h3 className="text-[14.5px] font-extrabold tracking-tight leading-[1.1] text-white">24/7 Technical Liaison</h3>
                  
                  <div className="h-[1px] w-full bg-white/10" />
                  
                  <div className="text-[10px] font-medium text-white/60 leading-relaxed font-sans">
                     Integrated support systems ensuring zero downtime and continuous operational evolution.
                  </div>
               </div>
            </div>

            {/* Right: 3 cols — Dynamic Contact Cards & Socials */}
            <div className="col-span-3 flex flex-col gap-6 justify-start">
               <div className="flex flex-col gap-3">
                  {/* Voice Ports (India) */}
                  <div className="py-3.5 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-[#1AA6E1]/10 border border-[#1AA6E1]/10 flex items-center justify-center shrink-0">
                        <Phone size={15} className="text-[#1AA6E1]" />
                     </div>
                     <div className="h-6 w-[1px] bg-white/10" />
                     <div>
                        <div className="text-[6.5px] font-black tracking-[0.12em] text-white/25 mb-0.5">VOICE PATH (INDIA)</div>
                        <a href={`tel:${(proposal?.closing?.contactPhone || "+919667896604").replace(/\s/g, '')}`} className="text-[13px] font-extrabold tracking-tight text-white leading-none hover:text-[#1AA6E1] transition-colors">
                           {proposal?.closing?.contactPhone || "+91 96678 96604"}
                        </a>
                     </div>
                  </div>

                  {/* Voice Ports (USA) */}
                  <div className="py-3.5 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-[#1AA6E1]/10 border border-[#1AA6E1]/10 flex items-center justify-center shrink-0">
                        <Phone size={15} className="text-[#1AA6E1]" />
                     </div>
                     <div className="h-6 w-[1px] bg-white/10" />
                     <div>
                        <div className="text-[6.5px] font-black tracking-[0.12em] text-white/25 mb-0.5">VOICE PATH (USA)</div>
                        <a href={`tel:${(proposal?.closing?.contactPhoneUSA || "+13204330111").replace(/\s/g, '')}`} className="text-[13px] font-extrabold tracking-tight text-white leading-none hover:text-[#1AA6E1] transition-colors">
                           {proposal?.closing?.contactPhoneUSA || "+1 (320) 433-0111"}
                        </a>
                     </div>
                  </div>

                  {/* Digital Core */}
                  <div className="py-3.5 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Mail size={15} className="text-white" />
                     </div>
                     <div className="h-6 w-[1px] bg-white/10" />
                     <div>
                        <div className="text-[6.5px] font-black tracking-[0.12em] text-white/25 mb-0.5">DIGITAL CORE</div>
                        <a href={`mailto:${proposal?.closing?.contactEmail || "info@weblozy.com"}`} className="text-[13px] font-extrabold tracking-tight text-white leading-none hover:text-[#99CB48] transition-colors">
                           {proposal?.closing?.contactEmail || "info@weblozy.com"}
                        </a>
                     </div>
                  </div>

                  {/* Network Port */}
                  <div className="py-3.5 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01] flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-[#99CB48]/10 border border-[#99CB48]/10 flex items-center justify-center shrink-0">
                        <Globe size={15} className="text-[#99CB48]" />
                     </div>
                     <div className="h-8 w-[1px] bg-white/10" />
                     <div>
                        <div className="text-[6.5px] font-black tracking-[0.12em] text-white/25 mb-0.5">NETWORK PORT</div>
                        <a href={proposal?.client?.websiteUrl || "https://www.weblozy.com"} target="_blank" rel="noopener noreferrer" className="text-[13px] font-extrabold tracking-tight text-white leading-none hover:text-[#99CB48] transition-colors">
                           {proposal?.client?.websiteUrl?.replace('https://', '') || "WWW.WEBLOZY.COM"}
                        </a>
                     </div>
                  </div>
               </div>

               {/* Socials Block */}
               <div className="space-y-3.5">
                  {/* Social Divider */}
                  <div className="flex items-center gap-4">
                     <div className="h-[1px] flex-1 bg-white/10" />
                     <span className="text-[7.5px] font-bold text-[#99CB48] tracking-[0.2em]">DIGITAL EXPANSION</span>
                     <div className="h-[1px] flex-1 bg-white/10" />
                  </div>

                  {/* Social Row with 5 icons (X, Instagram, Facebook, LinkedIn, YouTube) */}
                  <div className="flex justify-around items-center px-1">
                     <div className="flex flex-col items-center gap-1">
                        <a 
                           href={proposal?.closing?.xLink || "https://x.com/weblozy"} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 hover:border-[#1AA6E1]/40 hover:text-[#1AA6E1] text-white/40 transition-all cursor-pointer"
                           title="X"
                        >
                           <XIcon className="w-4 h-4 text-white/40 hover:text-[#1AA6E1] transition-colors" />
                        </a>
                        <span className="text-[6px] font-bold tracking-widest text-white/30 uppercase mt-0.5">X</span>
                     </div>
                     
                     <div className="flex flex-col items-center gap-1">
                        <a 
                           href={proposal?.closing?.instagramLink || "https://www.instagram.com/weblozy/"} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 hover:border-pink-500/40 hover:text-pink-500 text-white/40 transition-all cursor-pointer"
                           title="Instagram"
                        >
                           <InstagramIcon className="w-4 h-4 text-white/40 hover:text-pink-500 transition-colors" />
                        </a>
                        <span className="text-[6px] font-bold tracking-widest text-white/30 uppercase mt-0.5">Instagram</span>
                     </div>

                     <div className="flex flex-col items-center gap-1">
                        <a 
                           href={proposal?.closing?.facebookLink || "https://www.facebook.com/weblozy/"} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 hover:border-blue-600/40 hover:text-blue-600 text-white/40 transition-all cursor-pointer"
                           title="Facebook"
                        >
                           <FacebookIcon className="w-4 h-4 text-white/40 hover:text-blue-600 transition-colors" />
                        </a>
                        <span className="text-[6px] font-bold tracking-widest text-white/30 uppercase mt-0.5">Facebook</span>
                     </div>

                     <div className="flex flex-col items-center gap-1">
                        <a 
                           href={proposal?.closing?.linkedinLink || "https://www.linkedin.com/company/weblozy/"} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 hover:border-blue-500/40 hover:text-blue-500 text-white/40 transition-all cursor-pointer"
                           title="LinkedIn"
                        >
                           <LinkedinIcon className="w-4 h-4 text-white/40 hover:text-blue-500 transition-colors" />
                        </a>
                        <span className="text-[6px] font-bold tracking-widest text-white/40 uppercase mt-0.5">LinkedIn</span>
                     </div>

                     <div className="flex flex-col items-center gap-1">
                        <a 
                           href={proposal?.closing?.youtubeLink || "https://www.youtube.com/@weblozy"} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 hover:border-red-600/40 hover:text-red-600 text-white/40 transition-all cursor-pointer"
                           title="YouTube"
                        >
                           <YoutubeIcon className="w-4 h-4 text-white/40 hover:text-red-600 transition-colors" />
                        </a>
                        <span className="text-[6px] font-bold tracking-widest text-white/30 uppercase mt-0.5">YouTube</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* ── Section 4: Meeting Booking Card (Calendly Meeting) ── */}
         <div className="relative z-10 py-5.5 px-6 rounded-2xl border border-[#99CB48]/25 bg-white/[0.02] flex items-center justify-between gap-6 hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(153,203,72,0.15)]">
                  <Calendar size={25} className="text-[#99CB48]" />
               </div>
               <div>
                  <div className="text-[8.5px] font-black tracking-[0.15em] text-[#99CB48] mb-1">ENGAGEMENT PROTOCOL</div>
                  <h3 className="text-[17px] font-extrabold text-white leading-tight">Schedule Your Strategic Discovery Session</h3>
                  <div className="text-[10.5px] text-white/50 mt-1 font-medium leading-relaxed">
                     Connect directly with our engineering team to align operational logic and finalize sprints.
                  </div>
               </div>
            </div>
            <a 
               href={proposal?.closing?.meetingLink || "https://calendly.com/weblozy"} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="px-6 py-3 bg-[#99CB48] hover:bg-[#86b53b] text-[#0B0E14] text-[12px] font-black tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(153,203,72,0.3)] hover:translate-y-[-1px] shrink-0 font-sans"
            >
               Book Session
            </a>
         </div>

         {/* ── Section 5: Footer ── */}
         <div className="relative z-10 space-y-4">
            <div className="h-[1px] w-full bg-white/[0.04]" />
            
            <div className="space-y-1">
               <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-[#99CB48]" />
                  <span className="text-[8px] font-bold tracking-[0.15em] text-[#99CB48]">GLOBAL HQ</span>
               </div>
               <div className="text-[12px] font-black tracking-[0.05em] text-white">
                  {proposal?.closing?.address || "GH-03, Sector 16B, Greater Noida, Uttar Pradesh 201318"}
               </div>
            </div>

            <div className="h-[1.5px] w-48 bg-[#99CB48]/40" />

            <div className="flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <div>
                     <div className="text-[10px] font-extrabold tracking-tight text-white">Weblozy Strategic Systems</div>
                     <div className="text-[7.5px] font-semibold tracking-wider text-white/40 mt-0.5">Elite Software Partner</div>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <span className="text-[7.5px] font-semibold text-white/40 tracking-wider">
                     © 2026 Weblozy – Quantum Forward
                  </span>
               </div>
               <div className="flex items-center gap-6">
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="text-right">
                     <div className="text-[13px] font-black tracking-tight text-white leading-none">PAGE {pageNum}</div>
                     <div className="text-[7px] font-bold tracking-wider text-white/30 mt-1">
                        Version 1.0 | {pageNum}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default ClosingPage;
