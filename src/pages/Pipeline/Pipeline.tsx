import { useState, useEffect, useMemo, useRef } from "react";
import { 
  CreditCard, TrendingUp, Clock, Send, Target, XCircle, Download, FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProposals, updateProposalStatus } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Proposal } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingScreen from '@/components/ui/LoadingScreen';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import bannerLogo from "@/assets/banner_logo.png";

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-2">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: data.color }} />
        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{data.name}:</span>
        <span className="text-xs font-black text-[#99CB48]">{data.formatted}</span>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-xl flex flex-col gap-1">
        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">{label}</span>
        {payload.map((p: any, idx: number) => (
           <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{p.name}:</span>
              <span className="text-[10px] font-black text-slate-900 dark:text-white">{p.value}</span>
           </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Pipeline() {
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeProfile, setEmployeeProfile] = useState<{ fullName: string, employeeId: string, position?: string } | null>(null);
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProfile(user.uid);
        fetchProposals(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setEmployeeProfile(userDoc.data() as { fullName: string, employeeId: string, position?: string });
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  const fetchProposals = async (uid: string) => {
    try {
      const data = await getProposals(uid);
      setProposals(data as (Proposal & { id: string })[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateProposalStatus(id, newStatus);
      setProposals(prev => prev.map(p => 
        p.id === id ? { ...p, client: { ...p.client, status: newStatus as any } } : p
      ));
      toast.success(`Protocol status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const getProposalValuationDetails = (p: Proposal) => {
    const baseVal = p.pricing?.coreValuation ? parseFloat(String(p.pricing.coreValuation).replace(/[^0-9.]/g, "")) : 0;
    const moduleSum = (p.solution?.selectedModules || []).reduce((acc, m) => {
      const priceStr = String(m.price || "0").replace(/[^0-9.]/g, "");
      const price = parseFloat(priceStr);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);
    const moduleCount = (p.solution?.selectedModules || []).length;
    const base = baseVal || moduleSum || 0;
    const discountPctStr = String(p.pricing?.discountPercentage || "0").replace(/[^0-9.]/g, "");
    const discountPct = parseFloat(discountPctStr) || 0;
    const discountAmount = base * (discountPct / 100);
    const finalValue = base - discountAmount;
    
    return {
      baseVal,
      moduleSum,
      moduleCount,
      base,
      discountPct,
      discountAmount,
      finalValue
    };
  };

  const formatCurrency = (val: number) => {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  };

  const pipelineStats = useMemo(() => {
    let drafts = 0, sent = 0, won = 0, lost = 0;
    let draftsCount = 0, sentCount = 0, wonCount = 0, lostCount = 0;
    
    proposals.forEach(p => {
      const status = p.client?.status || 'Draft';
      const val = getProposalValuationDetails(p).finalValue;
      
      if (status === 'Draft') { drafts += val; draftsCount++; }
      else if (status === 'Sent') { sent += val; sentCount++; }
      else if (status === 'Accepted') { won += val; wonCount++; }
      else if (status === 'Declined') { lost += val; lostCount++; }
    });

    const activePipelineValuation = drafts + sent + won;

    return { 
       drafts, sent, won, lost, activePipelineValuation,
       draftsCount, sentCount, wonCount, lostCount
    };
  }, [proposals]);

  const distributionData = useMemo(() => [
    { name: 'Drafts', value: pipelineStats.drafts, formatted: formatCurrency(pipelineStats.drafts), color: '#f59e0b' },
    { name: 'Sent', value: pipelineStats.sent, formatted: formatCurrency(pipelineStats.sent), color: '#3b82f6' },
    { name: 'Accepted (Won)', value: pipelineStats.won, formatted: formatCurrency(pipelineStats.won), color: '#10b981' },
    { name: 'Declined (Lost)', value: pipelineStats.lost, formatted: formatCurrency(pipelineStats.lost), color: '#ef4444' },
  ].filter(d => d.value > 0), [pipelineStats]);

  const barChartData = useMemo(() => [
     { name: 'Drafts', count: pipelineStats.draftsCount, color: '#f59e0b' },
     { name: 'Sent', count: pipelineStats.sentCount, color: '#3b82f6' },
     { name: 'Won', count: pipelineStats.wonCount, color: '#10b981' },
     { name: 'Lost', count: pipelineStats.lostCount, color: '#ef4444' },
  ], [pipelineStats]);

  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    return proposals.filter(p => 
      p.client?.proposalTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [proposals, searchQuery]);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    toast.info("Generating comprehensive pipeline report...", { autoClose: 2000 });

    try {
      // Small delay to ensure rendering is complete
      await new Promise(r => setTimeout(r, 300));
      // Make it visible momentarily for canvas capture
      const element = reportRef.current;

      // Capture Page 1: Analytics & Data
      const page1 = element.querySelector('#report-page-1') as HTMLElement;
      const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true, logging: false });
      
      // Capture Page 2: Policy & Signature
      const page2 = element.querySelector('#report-page-2') as HTMLElement;
      const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true, logging: false });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add Page 1
      const imgData1 = canvas1.toDataURL('image/png');
      const imgProps1 = pdf.getImageProperties(imgData1);
      const ratio1 = imgProps1.width / imgProps1.height;
      let height1 = pdfWidth / ratio1;
      // Scale down if it exceeds one page
      if (height1 > pdfHeight) {
         height1 = pdfHeight;
      }
      pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, height1);

      // Add Page 2
      pdf.addPage();
      const imgData2 = canvas2.toDataURL('image/png');
      const imgProps2 = pdf.getImageProperties(imgData2);
      const ratio2 = imgProps2.width / imgProps2.height;
      let height2 = pdfWidth / ratio2;
      if (height2 > pdfHeight) {
         height2 = pdfHeight;
      }
      pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, height2);

      pdf.save(`Weblozy_Pipeline_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Pipeline report downloaded successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900 dark:text-white uppercase">Pipeline System</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium tracking-widest uppercase">Financial overview and funnel management</p>
          </div>
          <div className="flex items-center gap-4">
             <Button 
               onClick={generatePDF} 
               disabled={isGeneratingPDF}
               className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
             >
               <Download size={16} className="mr-2" />
               {isGeneratingPDF ? 'Generating...' : 'Download Report'}
             </Button>

             <div className="hidden sm:flex items-center gap-4 bg-white/40 dark:bg-[#11151D]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 px-6 py-3 rounded-2xl shadow-sm">
                <div className="flex flex-col">
                   <span className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">Active Ecosystem Value</span>
                   <span className="text-xl font-black tracking-tight text-[#99CB48] leading-tight">{formatCurrency(pipelineStats.activePipelineValuation)}</span>
                </div>
                <div className="w-12 h-12 bg-[#99CB48]/10 text-[#99CB48] rounded-xl flex items-center justify-center border border-[#99CB48]/20 shrink-0 ml-2">
                   <TrendingUp size={20} />
                </div>
             </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-amber-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><Clock size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 border border-amber-500/20">
              <Clock size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Drafts Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-slate-900 dark:text-white">{formatCurrency(pipelineStats.drafts)}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">{pipelineStats.draftsCount} Protocols</div>
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-blue-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><Send size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 border border-blue-500/20">
              <Send size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Sent Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-slate-900 dark:text-white">{formatCurrency(pipelineStats.sent)}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">{pipelineStats.sentCount} Protocols</div>
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-emerald-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><Target size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/20">
              <Target size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Won Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-emerald-600 dark:text-[#99CB48]">{formatCurrency(pipelineStats.won)}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">{pipelineStats.wonCount} Protocols</div>
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-rose-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><XCircle size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 border border-rose-500/20">
              <XCircle size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Lost Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-rose-500 dark:text-rose-400">{formatCurrency(pipelineStats.lost)}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">{pipelineStats.lostCount} Protocols</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 w-full text-left mb-6">Financial Distribution (Value)</h3>
              <div className="w-[200px] h-[200px] shrink-0 relative flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      cornerRadius={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-wrap justify-center gap-4">
                 {distributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 group cursor-default">
                       <div className="w-3 h-3 rounded-full shrink-0 shadow-md" style={{ backgroundColor: item.color }} />
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest leading-tight">{item.name}</span>
                         <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.formatted}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 w-full text-left mb-6">Pipeline Funnel (Count)</h3>
              <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <RechartsTooltip content={<CustomBarTooltip />} cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                       {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">Pipeline Ecosystem Breakdown</h3>
                 <p className="text-slate-500 dark:text-gray-400 font-medium text-xs uppercase tracking-widest">Detailed analysis of all active protocols</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                 <CreditCard className="w-6 h-6" />
              </div>
           </div>

           <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                 <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">
                       <th className="pb-4 pl-4 font-black">Ref ID / Client</th>
                       <th className="pb-4 text-right">Core Value</th>
                       <th className="pb-4 text-right">Modules</th>
                       <th className="pb-4 text-right">Discount</th>
                       <th className="pb-4 text-right">Final Valuation</th>
                       <th className="pb-4 pr-4 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredProposals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-slate-500">No proposals found.</td>
                      </tr>
                    ) : filteredProposals.map((p) => {
                       const vals = getProposalValuationDetails(p);
                       const status = p.client?.status || 'Draft';
                       return (
                          <tr key={`val-${p.id}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="py-4 pl-4">
                                <div className="flex flex-col">
                                   <a 
                                      href={`/preview/${p.id}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-tight transition-colors"
                                   >
                                      {p.client?.referenceId}
                                   </a>
                                   <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider truncate max-w-[150px]">
                                      {p.client?.clientName && p.client.clientName !== "VALUED CLIENT" 
                                          ? p.client.clientName 
                                          : p.client?.companyName && p.client.companyName !== "VALUED CLIENT" 
                                            ? p.client.companyName 
                                            : p.client?.contactPerson || "N/A"}
                                   </span>
                                </div>
                             </td>
                             <td className="py-4 text-right">
                                <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{formatCurrency(vals.baseVal)}</span>
                             </td>
                              <td className="py-4 text-right">
                                <div className="flex flex-col items-end">
                                   <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{formatCurrency(vals.moduleSum)}</span>
                                   {vals.moduleCount > 0 && <span className="text-[9px] font-bold text-blue-500">{vals.moduleCount} Modules</span>}
                                </div>
                              </td>
                             <td className="py-4 text-right">
                                <div className="flex flex-col items-end">
                                   <span className="text-xs font-bold text-rose-500 dark:text-rose-400">-{vals.discountPct}%</span>
                                   {vals.discountAmount > 0 && <span className="text-[9px] font-bold text-rose-500/70">-{formatCurrency(vals.discountAmount)}</span>}
                                </div>
                             </td>
                             <td className="py-4 text-right">
                                <span className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">{formatCurrency(vals.finalValue)}</span>
                             </td>
                             <td className="py-4 pr-4">
                                <div className="flex justify-center">
                                   <select
                                     value={status}
                                     onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                     className={`rounded-md px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border outline-none cursor-pointer appearance-none text-center ${
                                       status === 'Accepted' ? 'bg-[#99CB48]/10 text-emerald-600 dark:text-[#99CB48] border-emerald-500/20' :
                                       status === 'Sent' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                       status === 'Declined' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                       'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                     }`}
                                   >
                                     <option value="Draft" className="text-slate-900 bg-white font-bold">DRAFT</option>
                                     <option value="Sent" className="text-slate-900 bg-white font-bold">SENT</option>
                                     <option value="Accepted" className="text-slate-900 bg-white font-bold">ACCEPTED (WON)</option>
                                     <option value="Declined" className="text-slate-900 bg-white font-bold">DECLINED (LOST)</option>
                                   </select>
                                </div>
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* Hidden Printable Report Container */}
      <div 
         ref={reportRef} 
         className="absolute top-0 left-0 w-[800px] bg-white pointer-events-none text-slate-900 z-[-9999]"
         style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0 }}
      >
         {/* PAGE 1: Data & Analytics */}
         <div id="report-page-1" className="bg-white w-[800px] min-h-[1130px] p-10 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6 mb-8">
               <img src={bannerLogo} alt="Weblozy Logo" className="h-10 object-contain" />
               <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pipeline Report</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                     {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                     Generated By: <span className="text-blue-600">{employeeProfile?.fullName || "Weblozy Operator"}</span>
                  </p>
               </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-8">
               <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Drafts Valuation</div>
                  <div className="text-xl font-black text-slate-900">{formatCurrency(pipelineStats.drafts)}</div>
                  <div className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">{pipelineStats.draftsCount} Protocols</div>
               </div>
               <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Sent Valuation</div>
                  <div className="text-xl font-black text-slate-900">{formatCurrency(pipelineStats.sent)}</div>
                  <div className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">{pipelineStats.sentCount} Protocols</div>
               </div>
               <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Won Valuation</div>
                  <div className="text-xl font-black text-slate-900">{formatCurrency(pipelineStats.won)}</div>
                  <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">{pipelineStats.wonCount} Protocols</div>
               </div>
               <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                  <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Lost Valuation</div>
                  <div className="text-xl font-black text-slate-900">{formatCurrency(pipelineStats.lost)}</div>
                  <div className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">{pipelineStats.lostCount} Protocols</div>
               </div>
            </div>

            {/* Table */}
            <div className="flex-1">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 border-b border-slate-200 pb-2">Pipeline Ecosystem Detail</h3>
               <table className="w-full text-left whitespace-nowrap">
                  <thead>
                     <tr className="border-b-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50">
                        <th className="p-3">Ref ID / Client</th>
                        <th className="p-3 text-right">Core Value</th>
                        <th className="p-3 text-right">Modules</th>
                        <th className="p-3 text-right">Discount</th>
                        <th className="p-3 text-right">Final Valuation</th>
                        <th className="p-3 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {proposals.map((p) => {
                        const vals = getProposalValuationDetails(p);
                        const status = p.client?.status || 'Draft';
                        return (
                           <tr key={`print-${p.id}`}>
                              <td className="p-3">
                                 <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 uppercase">{p.client?.referenceId}</span>
                                    <span className="text-[10px] font-medium text-slate-500 uppercase whitespace-normal break-words max-w-[200px]">
                                       {p.client?.clientName && p.client.clientName !== "VALUED CLIENT" 
                                          ? p.client.clientName 
                                          : p.client?.companyName && p.client.companyName !== "VALUED CLIENT" 
                                            ? p.client.companyName 
                                            : p.client?.contactPerson || "N/A"}
                                    </span>
                                 </div>
                              </td>
                              <td className="p-3 text-right">
                                 <span className="text-xs font-bold text-slate-700">{formatCurrency(vals.baseVal)}</span>
                              </td>
                              <td className="p-3 text-right">
                                 <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-slate-700">{formatCurrency(vals.moduleSum)}</span>
                                    {vals.moduleCount > 0 && <span className="text-[9px] font-bold text-blue-600">{vals.moduleCount} Modules</span>}
                                 </div>
                              </td>
                              <td className="p-3 text-right">
                                 <span className="text-xs font-bold text-rose-500">-{vals.discountPct}%</span>
                              </td>
                              <td className="p-3 text-right">
                                 <span className="text-sm font-black text-slate-900">{formatCurrency(vals.finalValue)}</span>
                              </td>
                              <td className="p-3 text-center">
                                 <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">{status}</span>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Page 1 of 2 • Weblozy Pipeline System
            </div>
         </div>

         {/* PAGE 2: Policy & Signature */}
         <div id="report-page-2" className="bg-white w-[800px] min-h-[1130px] p-12 flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-center mb-12">
               <img src={bannerLogo} alt="Weblozy Logo" className="h-12 object-contain" />
            </div>

            <h2 className="text-3xl font-black text-center text-slate-900 uppercase tracking-tight mb-8">Internal Policy & Confidentiality</h2>

            <div className="flex-1 space-y-6 text-slate-700 text-sm leading-relaxed border-y-2 border-slate-100 py-8">
               <p className="font-black text-rose-600 text-justify text-base uppercase tracking-wider">
                  STRICT CONFIDENTIALITY & NON-DISCLOSURE WARNING
               </p>
               <p className="font-bold text-justify">
                  This document, containing proprietary financial projections, strategic protocols, and pipeline valuations, is the exclusive intellectual property of Weblozy. Access is strictly granted on a need-to-know basis.
               </p>
               <p className="text-justify">
                  By possessing or reviewing this report, you are legally bound by Weblozy's Non-Disclosure Agreement (NDA). The data herein includes trade secrets, sensitive client identities, and highly confidential financial frameworks that provide Weblozy with a competitive advantage.
               </p>
               <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mt-6 mb-2 text-rose-500">1. ABSOLUTE PROHIBITION ON DISTRIBUTION</h4>
               <p className="text-justify">
                  Under NO circumstances shall any portion of this report be duplicated, photographed, electronically transmitted, shared on cloud platforms, or verbally communicated to any individual outside of Weblozy's authorized executive board. Any breach of this clause will trigger immediate termination of employment and civil litigation for damages.
               </p>
               <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mt-6 mb-2">2. ZERO-TOLERANCE DATA MANIPULATION</h4>
               <p className="text-justify">
                  The valuations and statuses represented in this document are pulled directly from the Weblozy ecosystem. Any attempt by an operator, BDE, or BDM to artificially inflate, misrepresent, or tamper with pipeline metrics is considered corporate fraud and will be dealt with under the fullest extent of the law.
               </p>
               <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs mt-6 mb-2">3. MANDATORY DESTRUCTION OF RECORD</h4>
               <p className="text-justify">
                  The authorizing personnel generating this report accepts sole liability for its chain of custody. Physical copies must be securely cross-cut shredded immediately post-review. Digital files downloaded locally must be permanently purged at the end of the operational day.
               </p>
            </div>

            {/* Signature Block */}
            <div className="mt-16 flex justify-between items-end px-10">
               <div className="flex flex-col items-center">
                  <div className="w-48 border-b-2 border-slate-900 mb-2"></div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Authorized Signature</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">{employeeProfile?.fullName || "Operator"}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{employeeProfile?.position || "BDE / BDM"}</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-48 border-b-2 border-slate-900 mb-2 flex justify-center pb-1">
                     <span className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Date of Generation</span>
               </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Page 2 of 2 • Strictly Confidential • Weblozy
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
