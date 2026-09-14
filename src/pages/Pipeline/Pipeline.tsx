import { useState, useEffect, useMemo } from "react";
import { 
  CreditCard,
  TrendingUp,
  Clock,
  Send,
  Target,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProposals, updateProposalStatus } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Proposal } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from '@/components/ui/LoadingScreen';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DashboardLayout from "@/components/Layout/DashboardLayout";

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

export default function Pipeline() {
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProposals(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
    const base = baseVal || moduleSum || 0;
    const discountPctStr = String(p.pricing?.discountPercentage || "0").replace(/[^0-9.]/g, "");
    const discountPct = parseFloat(discountPctStr) || 0;
    const discountAmount = base * (discountPct / 100);
    const finalValue = base - discountAmount;
    
    return {
      baseVal,
      moduleSum,
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
    
    proposals.forEach(p => {
      const status = p.client?.status || 'Draft';
      const val = getProposalValuationDetails(p).finalValue;
      
      if (status === 'Draft') drafts += val;
      else if (status === 'Sent') sent += val;
      else if (status === 'Accepted') won += val;
      else if (status === 'Declined') lost += val;
    });

    const activePipelineValuation = drafts + sent + won;

    return { drafts, sent, won, lost, activePipelineValuation };
  }, [proposals]);

  const distributionData = useMemo(() => [
    { name: 'Drafts', value: pipelineStats.drafts, formatted: formatCurrency(pipelineStats.drafts), color: '#f59e0b' },
    { name: 'Sent', value: pipelineStats.sent, formatted: formatCurrency(pipelineStats.sent), color: '#3b82f6' },
    { name: 'Accepted (Won)', value: pipelineStats.won, formatted: formatCurrency(pipelineStats.won), color: '#10b981' },
    { name: 'Declined (Lost)', value: pipelineStats.lost, formatted: formatCurrency(pipelineStats.lost), color: '#ef4444' },
  ].filter(d => d.value > 0), [pipelineStats]);

  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    return proposals.filter(p => 
      p.client?.proposalTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [proposals, searchQuery]);

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
          <div className="flex items-center gap-4 bg-white/40 dark:bg-[#11151D]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 px-6 py-3 rounded-2xl shadow-sm">
             <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">Active Ecosystem Value</span>
                <span className="text-xl font-black tracking-tight text-[#99CB48] leading-tight">{formatCurrency(pipelineStats.activePipelineValuation)}</span>
             </div>
             <div className="w-12 h-12 bg-[#99CB48]/10 text-[#99CB48] rounded-xl flex items-center justify-center border border-[#99CB48]/20 shrink-0 ml-2">
                <TrendingUp size={20} />
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
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-blue-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><Send size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 border border-blue-500/20">
              <Send size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Sent Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-slate-900 dark:text-white">{formatCurrency(pipelineStats.sent)}</div>
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-emerald-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><Target size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/20">
              <Target size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Won Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-emerald-600 dark:text-[#99CB48]">{formatCurrency(pipelineStats.won)}</div>
          </div>

          <div className="bg-white dark:bg-[#11151D] border-t-2 border-t-rose-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-slate-900 dark:text-white"><XCircle size={100} /></div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 border border-rose-500/20">
              <XCircle size={16} />
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-1">Lost Valuation</div>
            <div className="text-2xl font-black mb-1 truncate text-rose-500 dark:text-rose-400">{formatCurrency(pipelineStats.lost)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-4 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 w-full text-left mb-6">Financial Distribution</h3>
              <div className="w-[180px] h-[180px] shrink-0 relative flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      cornerRadius={6}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-col gap-3">
                 {distributionData.length === 0 ? (
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 italic text-center">No data to display</span>
                 ) : distributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between w-full group cursor-default">
                       <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full shrink-0 shadow-md" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                       </div>
                       <span className="text-xs font-black text-slate-900 dark:text-white">{item.formatted}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-8 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col">
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
                          // Show all on pipeline view
                          return (
                             <tr key={`val-${p.id}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="py-4 pl-4">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{p.client?.referenceId}</span>
                                      <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider truncate max-w-[150px]">
                                         {p.client?.companyName || p.client?.clientName || "Valued Client"}
                                      </span>
                                   </div>
                                </td>
                                <td className="py-4 text-right">
                                   <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{vals.baseVal > 0 ? formatCurrency(vals.baseVal) : "—"}</span>
                                </td>
                                <td className="py-4 text-right">
                                   <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{vals.moduleSum > 0 ? formatCurrency(vals.moduleSum) : "—"}</span>
                                </td>
                                <td className="py-4 text-right">
                                   <div className="flex flex-col items-end">
                                      <span className="text-xs font-bold text-rose-500 dark:text-rose-400">{vals.discountPct > 0 ? `-${vals.discountPct}%` : "—"}</span>
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

      </div>
    </DashboardLayout>
  );
}
