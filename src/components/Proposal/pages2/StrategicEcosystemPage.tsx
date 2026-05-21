import React from "react";
import { Proposal } from "@/types/proposal";
import PageWrapper from "./PageWrapper";
import { Layout, CheckCircle2, Globe, UserCheck, Cpu, Shield } from "lucide-react";

interface PageProps {
  proposal: Proposal;
  pageNum: number;
}

// Lookup dictionary for user hierarchy role descriptions
const getRoleDesc = (roleName: string, fallback: string) => {
  if (fallback && fallback !== "Strategic Access") return fallback;
  const r = roleName.toLowerCase();
  if (r.includes("admin") || r.includes("super")) {
    return "Complete control over system parameters, configurations, audit logging, and global user permissions.";
  }
  if (r.includes("manager") || r.includes("head") || r.includes("lead")) {
    return "Department-level monitoring, approval routing, operational reporting, and team management.";
  }
  if (r.includes("operator") || r.includes("user") || r.includes("staff") || r.includes("node")) {
    return "Execution of daily transactions, task logging, and access to workspace-specific operational views.";
  }
  if (r.includes("client") || r.includes("customer") || r.includes("external")) {
    return "Secure workspace to check project milestones, download files, and raise support tickets.";
  }
  return "Authorized access tier with role-based permissions and secure boundaries configured for data privacy.";
};

// Lookup dictionary for connectivity integration subtitles
const getIntegrationSub = (isLink: boolean, label: string) => {
  if (isLink) return "External REST Endpoints";
  const l = label.toLowerCase();
  if (l.includes("crm") || l.includes("salesforce") || l.includes("hubspot")) {
    return "Real-time Customer Data Sync";
  }
  if (l.includes("erp") || l.includes("sap") || l.includes("tally")) {
    return "Enterprise Planning Gateway";
  }
  if (l.includes("db") || l.includes("cloud") || l.includes("database") || l.includes("sql") || l.includes("firebase")) {
    return "Secure Database Connection";
  }
  if (l.includes("payment") || l.includes("pay") || l.includes("stripe") || l.includes("razorpay")) {
    return "Secure Transactional Gateway";
  }
  if (l.includes("email") || l.includes("sms") || l.includes("notify")) {
    return "Automated Communication Hub";
  }
  return "Secure API Middleware Node";
};

const StrategicEcosystemPage: React.FC<PageProps> = ({ proposal, pageNum }) => {
  const pillars = proposal?.solution?.approachPoints || ["Agile Development Cycle", "Seamless API Orchestration", "End-to-End Encryption"];
  const integrations = proposal?.solution?.integrations || ["Custom CRM", "ERP Sync", "Cloud DB", "Payment Gateway"];
  const roles = proposal?.solution?.userRoles || ["Super Admin", "Department Head"];

  // Logic for Pillars
  const pillarCount = pillars.length;
  const pillarStyle = pillarCount > 10 ? { p: 'p-1.5', text: 'text-[9.5px]', icon: 10, gap: 'gap-2.5', rounded: 'rounded-lg' } :
                      pillarCount > 7 ? { p: 'p-2 py-2.5', text: 'text-[11px]', icon: 12, gap: 'gap-3', rounded: 'rounded-xl' } :
                      pillarCount > 4 ? { p: 'p-3 py-3.5', text: 'text-[12px]', icon: 14, gap: 'gap-3.5', rounded: 'rounded-2xl' } :
                      { p: 'p-4.5 py-5', text: 'text-[13px]', icon: 18, gap: 'gap-4.5', rounded: 'rounded-[1.75rem]' };

  // Logic for Integrations
  const intCount = integrations.length;
  const useIntGrid = intCount <= 8;
  const intText = intCount > 12 ? 'text-[9.5px]' : intCount > 8 ? 'text-[11px]' : 'text-[13px]';
  const intPad = intCount > 8 ? 'px-3 py-1.5' : 'px-4 py-3';
  const intIconSize = intCount > 12 ? 10 : 14;

  // Logic for Roles
  const roleCount = roles.length;
  const showRoleDesc = roleCount <= 3;
  const roleStyle = roleCount > 8 ? { p: "p-1.5", title: "text-[9.5px]", sub: "text-[8px] font-medium leading-tight", box: "w-7 h-7", numText: "text-[8px]", nodeText: "text-[3px]", icon: 0 } :
                    roleCount > 5 ? { p: "p-2", title: "text-[11px]", sub: "text-[9.5px] font-semibold leading-tight", box: "w-8 h-8", numText: "text-[10px]", nodeText: "text-[4px]", icon: 0 } :
                    roleCount > 3 ? { p: "p-3", title: "text-[12px]", sub: "text-[10px] font-semibold leading-tight", box: "w-10 h-10", numText: "text-[11px]", nodeText: "text-[4.5px]", icon: 12 } :
                    { p: "p-4.5 py-5", title: "text-[13px]", sub: "text-[10px] font-medium mt-1 leading-relaxed", box: "w-12 h-12", numText: "text-[13px]", nodeText: "text-[5px]", icon: 16 };

  return (
    <PageWrapper pageNum={pageNum} title="Strategic Solution">
       <div className="flex flex-col h-full space-y-6">
          {/* Header Section */}
          <div className="mb-2 shrink-0">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[2px] bg-[#3ABEF9]" />
                <span className="text-[10px] font-black tracking-[0.15em] text-[#3ABEF9]">Phase 02: Architecture</span>
             </div>
             <h2 className="text-5xl font-black tracking-tighter text-[#0B0E14] leading-none mb-1">
                Strategic <span className="text-[#3ABEF9]">Ecosystem.</span>
             </h2>
             <div className="text-[10px] font-bold text-slate-400 tracking-wide leading-none">Engineering Scalable Solutions for Digital Excellence</div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-col space-y-6">
             {/* Approach Card */}
             <div className="bg-[#F8FAFC] p-6 rounded-[2.5rem] border border-slate-100 relative overflow-hidden shrink-0 min-h-[140px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                   <Layout size={120} className="text-[#3ABEF9]" />
                </div>
                <div className="relative z-10 space-y-3">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ABEF9]" />
                      <div className="text-[11px] font-black tracking-[0.15em] text-[#3ABEF9] uppercase">Solution Blueprint</div>
                   </div>
                   <div className="text-[14px] font-bold text-slate-800 leading-relaxed max-w-[95%]">
                      {proposal?.solution?.approach || "We propose building a custom automation system tailored to your specific business workflow, ensuring seamless data flow and operational transparency across all departments."}
                   </div>
                </div>
             </div>

             {/* Grid Content */}
             <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left Column: Pillars */}
                <div className="flex flex-col min-h-0">
                   <div className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 shrink-0">Implementation Pillars</div>
                   <div className={`flex flex-col ${pillarCount <= 3 ? 'gap-5 justify-start py-1' : pillarCount <= 4 ? 'gap-4 justify-start py-1' : 'gap-2.5'} flex-1 min-h-0`}>
                      {pillars.map((point, i) => (
                         <div key={i} className={`flex items-center ${pillarStyle.gap} bg-white border border-slate-100 ${pillarStyle.rounded} shadow-sm transition-all ${pillarStyle.p}`}>
                            <div 
                               className="rounded-xl bg-[#3ABEF9]/10 flex items-center justify-center text-[#3ABEF9] shrink-0"
                               style={{ 
                                 width: pillarCount > 10 ? '24px' : pillarCount > 7 ? '28px' : pillarCount > 4 ? '36px' : '44px', 
                                 height: pillarCount > 10 ? '24px' : pillarCount > 7 ? '28px' : pillarCount > 4 ? '36px' : '44px' 
                               }}
                            >
                               <CheckCircle2 size={pillarStyle.icon} strokeWidth={2.5} />
                            </div>
                            <div className="min-w-0">
                               <span className={`font-extrabold text-slate-800 leading-tight block ${pillarStyle.text}`}>
                                  {point}
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Right Column: Connectivity & Hierarchy */}
                <div className="flex flex-col space-y-6 min-h-0">
                   {/* System Connectivity */}
                   <div className="shrink-0">
                      <div className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3">Connectivity Hub</div>
                      {useIntGrid ? (
                         <div className="grid grid-cols-2 gap-3">
                            {integrations.map((item, i) => {
                               const [label, link] = item.includes('|') ? item.split('|') : [item, item];
                               const isLink = link.startsWith('http') || link.includes('.');
                               const href = link.startsWith('http') ? link : `https://${link}`;
                               
                               return (
                                  <a 
                                     key={i} 
                                     href={isLink ? href : undefined}
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className={`flex items-center gap-3 bg-[#0B0E14] rounded-2xl border border-slate-800 shadow-lg ${intPad} ${isLink ? 'hover:border-[#3ABEF9]/50 hover:bg-slate-900/80 transition-all cursor-pointer' : ''}`}
                                  >
                                     <div className="w-8 h-8 rounded-lg bg-[#3ABEF9]/10 flex items-center justify-center text-[#3ABEF9] shrink-0">
                                        <Globe size={16} />
                                     </div>
                                     <div className="space-y-0.5 min-w-0">
                                        <span className={`font-extrabold text-white/95 leading-tight block ${intText}`}>{label}</span>
                                        <span className="text-[9.5px] font-semibold text-slate-400 block leading-tight">{getIntegrationSub(isLink, label)}</span>
                                     </div>
                                  </a>
                               );
                            })}
                         </div>
                      ) : (
                         <div className="flex flex-wrap gap-1.5">
                            {integrations.map((item, i) => {
                               const [label, link] = item.includes('|') ? item.split('|') : [item, item];
                               const isLink = link.startsWith('http') || link.includes('.');
                               const href = link.startsWith('http') ? link : `https://${link}`;
                               
                               return (
                                  <a 
                                     key={i} 
                                     href={isLink ? href : undefined}
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className={`flex items-center gap-1.5 bg-[#0B0E14] rounded-lg border border-slate-800 shadow-lg ${intPad} ${isLink ? 'hover:border-[#3ABEF9]/50 hover:bg-slate-900/80 transition-all cursor-pointer' : ''}`}
                                  >
                                     <Globe size={intIconSize} className="text-[#3ABEF9]" />
                                     <span className={`font-bold text-white/90 ${intText}`}>{label}</span>
                                  </a>
                               );
                            })}
                         </div>
                      )}
                   </div>

                    {/* User Architecture */}
                    <div className="flex flex-col flex-1 min-h-0">
                       <div className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase mb-3 shrink-0">User Hierarchy</div>
                       <div className={`flex flex-col ${roleCount <= 3 ? 'gap-4 justify-start py-1' : 'gap-2.5'} flex-1 min-h-0`}>
                          {roles.map((role, i) => {
                             const roleStr = typeof role === 'string' ? role : "";
                             const [roleName, roleAccess] = roleStr.includes('|') ? roleStr.split('|') : [roleStr, "Strategic Access"];
                             
                             return (
                                <div key={i} className={`flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm transition-all ${roleStyle.p}`}>
                                   <div className="flex items-center gap-3 min-w-0">
                                      <div className={`${roleStyle.box} rounded-xl bg-[#0B0E14] flex flex-col items-center justify-center text-[#99CB48] border border-slate-900 shrink-0`}>
                                         <div className={`${roleStyle.numText} font-black leading-none`}>0{i+1}</div>
                                         <div className={`${roleStyle.nodeText} font-black tracking-wide opacity-40 uppercase`}>Node</div>
                                      </div>
                                      <div className="space-y-0.5 min-w-0">
                                         <div className={`${roleStyle.title} font-extrabold text-slate-900 tracking-tight leading-tight`}>
                                            {roleName || "System Role"}
                                         </div>
                                         <div className={`${roleStyle.sub} text-slate-500 font-semibold leading-tight block`}>
                                            {showRoleDesc ? getRoleDesc(roleName, roleAccess) : roleAccess}
                                         </div>
                                      </div>
                                   </div>
                                   {roleStyle.icon > 0 && <UserCheck size={roleStyle.icon} className="text-[#3ABEF9]/20 shrink-0" />}
                                </div>
                             );
                          })}
                       </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Trust Section Footer - ABSOLUTE STABILITY */}
          <div className="p-6 bg-[#0B0E14] rounded-[2.5rem] relative overflow-hidden shrink-0 border border-slate-800">
             <div className="absolute inset-0 bg-gradient-to-r from-[#3ABEF9]/20 to-transparent" />
             <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                   <div className="text-[#3ABEF9] text-[9px] font-black tracking-[0.15em] uppercase">Scalability Protocol</div>
                   <h4 className="text-white text-lg font-black tracking-tight leading-none">Built for Future Expansion.</h4>
                   <div className="text-[10.5px] text-slate-400 font-semibold max-w-[90%] leading-relaxed mt-1.5">
                      Engineered using cloud-native microservices architecture. Designed for 99.99% uptime, auto-scaling integration routing, and modular expansion capabilities.
                   </div>
                </div>
                <div className="flex gap-3 shrink-0 ml-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                      <Cpu size={20} />
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#3ABEF9]">
                      <Shield size={20} />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </PageWrapper>
  );
};

export default StrategicEcosystemPage;
