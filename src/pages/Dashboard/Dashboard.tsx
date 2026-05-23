import { useState, useEffect, useMemo } from "react";
import { 
  FileText, Users, Clock, Eye, Trash2, Pencil, 
  AlertOctagon, ArrowRight, Download, CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProposals, deleteProposal } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Proposal } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import LoadingScreen from '@/components/ui/LoadingScreen';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { UserCog } from "lucide-react";

function getTimeAgo(dateString: string | number) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${Math.max(0, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function Dashboard() {
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [employeeProfile, setEmployeeProfile] = useState<{ fullName: string, employeeId: string, position?: string, profileImageUrl?: string } | null>(null);
  const navigate = useNavigate();

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
        setEmployeeProfile(userDoc.data() as { fullName: string, employeeId: string, position?: string, profileImageUrl?: string });
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  const fetchProposals = async (uid: string) => {
    try {
      const [data] = await Promise.all([
        getProposals(uid),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      setProposals(data as (Proposal & { id: string })[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await deleteProposal(id);
      setProposals(prev => prev.filter(p => p.id !== id));
      toast.success("Strategic asset successfully decommissioned.");
    } catch (error) {
      console.error(error);
      toast.error("Permission denied: You can only delete your own protocols.");
    }
  };

  const filteredProposals = useMemo(() => {
    if (!searchQuery) return proposals;
    return proposals.filter(p => 
      p.client?.proposalTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.referenceId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [proposals, searchQuery]);

  const stats = useMemo(() => {
    const total = filteredProposals.length;
    const drafts = filteredProposals.filter(p => (p.client?.status || 'Draft') === 'Draft').length;
    const downloaded = filteredProposals.filter(p => (p as any).isDownloaded || p.client?.status === 'Sent' || p.client?.status === 'Accepted' || p.client?.status === 'Declined').length;

    return {
      proposals: total,
      drafts: drafts,
      downloaded: downloaded
    };
  }, [filteredProposals]);

  const distributionData = useMemo(() => [
    { name: 'Total Proposals', value: stats.proposals || 0, color: '#3b82f6' },
    { name: 'Active Drafts', value: stats.drafts || 0, color: '#84cc16' },
    { name: 'Downloaded', value: stats.downloaded || 0, color: '#f97316' },
  ].filter(d => d.value > 0), [stats]);

  const totalDistributionValue = useMemo(() => distributionData.reduce((acc, curr) => acc + curr.value, 0), [distributionData]);

  // Dynamic Chart Data (Last 7 Days Cumulative)
  const areaChartData = useMemo(() => {
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        dateObj: d,
        name: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        count: 0
      };
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    let cumulative = proposals.filter(p => new Date(p.createdAt || p.updatedAt) < sevenDaysAgo).length;

    proposals.forEach(p => {
      const pDate = new Date(p.createdAt || p.updatedAt);
      const dayData = last7Days.find(d => 
        d.dateObj.getDate() === pDate.getDate() && 
        d.dateObj.getMonth() === pDate.getMonth() &&
        d.dateObj.getFullYear() === pDate.getFullYear()
      );
      if (dayData) {
        dayData.count += 1;
      }
    });
    
    return last7Days.map(d => {
      cumulative += d.count;
      return { name: d.name, total: cumulative };
    });
  }, [proposals]);

  // Dynamic Activity Feed
  const dynamicActivityFeed = useMemo(() => {
    const sorted = [...proposals].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return sorted.slice(0, 4).map(p => {
      const isDraft = (p.client?.status || 'Draft') === 'Draft';
      return {
        title: isDraft ? 'Draft Updated' : 'Proposal Saved/Updated',
        subtitle: p.client?.proposalTitle || 'Untitled Proposal',
        time: getTimeAgo(p.updatedAt),
        icon: isDraft ? Clock : FileText,
        color: isDraft ? "text-[#99CB48]" : "text-blue-500",
        bg: isDraft ? "bg-[#99CB48]/10" : "bg-blue-500/10"
      };
    });
  }, [proposals]);

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Welcome & Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back, {employeeProfile?.fullName?.split(' ')[0] || "Operator"} 👋</h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">Here's what's happening with your strategic ecosystem today.</p>
          </div>

          {employeeProfile && (
            <div className="flex items-center gap-6 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 px-6 py-4 rounded-2xl shadow-lg shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-gray-400 overflow-hidden">
                {employeeProfile.profileImageUrl ? (
                  <img src={employeeProfile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCog size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] mb-1">{employeeProfile.position || "Corporate Operator"}</span>
                <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">{employeeProfile.fullName}</span>
              </div>
              <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] mb-1">Employee ID</span>
                <span className="text-sm font-black uppercase tracking-wider text-[#99CB48]">{employeeProfile.employeeId}</span>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Proposals */}
          <div onClick={() => navigate('/saved')} className="cursor-pointer transition-all hover:scale-[1.02] bg-white dark:bg-[#11151D] border-t-2 border-t-blue-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><FileText size={120} /></div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <FileText size={18} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-2">Total Proposals</div>
            <div className="text-4xl font-black mb-6 truncate">{stats.proposals}</div>
            <div className="flex items-center text-[11px] font-bold text-blue-400 group-hover:text-blue-300">
              View all proposals <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Card 2: Active Drafts */}
          <div onClick={() => navigate('/drafts')} className="cursor-pointer transition-all hover:scale-[1.02] bg-white dark:bg-[#11151D] border-t-2 border-t-[#99CB48] border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Clock size={120} /></div>
            <div className="w-10 h-10 rounded-xl bg-[#99CB48]/10 text-[#99CB48] flex items-center justify-center mb-6">
              <Clock size={18} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-2">Active Drafts</div>
            <div className="text-4xl font-black mb-6 truncate">{stats.drafts}</div>
            <div className="flex items-center text-[11px] font-bold text-[#99CB48] group-hover:text-[#aee056]">
              Continue drafting <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Card 3: Downloaded Proposals */}
          <div onClick={() => navigate('/saved')} className="cursor-pointer transition-all hover:scale-[1.02] bg-white dark:bg-[#11151D] border-t-2 border-t-orange-500 border-x border-b border-slate-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Download size={120} /></div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
              <Download size={18} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 mb-2">Downloaded Proposals</div>
            <div className="text-4xl font-black mb-6 truncate">{stats.downloaded}</div>
            <div className="flex items-center text-[11px] font-bold text-orange-400 group-hover:text-orange-300">
              View downloaded <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>

        {/* Charts & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Line Chart */}
          <div className="lg:col-span-5 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300">Proposal Generation Overview</h3>
              <div className="text-[10px] bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/5">Last 7 Days</div>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#99CB48" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#99CB48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#11151D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#99CB48', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#99CB48" strokeWidth={3} fillOpacity={1} fill="url(#colorAssets)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="lg:col-span-4 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 mb-6">Asset Distribution</h3>
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="w-[120px] h-[120px] shrink-0 relative">
                {/* Center overlay text (optional but adds premium feel) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{totalDistributionValue}</span>
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">Total</span>
                </div>
                <ResponsiveContainer width="100%" height="100%" minWidth={10} minHeight={10}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={4}
                      cornerRadius={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#11151D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend side */}
              <div className="flex flex-col gap-4 w-full flex-1 min-w-[200px]">
                {distributionData.length === 0 ? (
                   <span className="text-[10px] text-slate-500 dark:text-gray-400 italic text-center sm:text-left">No data to display</span>
                ) : distributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between w-full group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-md transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 ml-2">
                      <span className="text-[11px] font-black text-slate-900 dark:text-white">
                        {Math.round((item.value / totalDistributionValue) * 100)}%
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-3 bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300">Activity Feed</h3>
            </div>
            <div className="flex-1 space-y-6">
              {dynamicActivityFeed.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-500">No recent activity</div>
              ) : dynamicActivityFeed.map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center shrink-0`}>
                    <activity.icon size={16} className={activity.color} />
                  </div>
                  <div className="flex flex-col justify-center pt-0.5 overflow-hidden">
                    <div className="text-xs text-slate-700 dark:text-gray-300 font-bold truncate">{activity.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-gray-500 truncate">{activity.subtitle}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#99CB48] mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Assets Table */}
        <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-gray-300">Recent Strategic Assets</h3>
            <button 
              onClick={() => navigate('/saved')}
              className="text-[10px] font-bold text-[#99CB48] uppercase tracking-wider hover:text-[#7ba936] transition-colors"
            >
              View All Assets →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5">
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Client Profile</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Strategic Title</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Prepared By</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Status</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Updated</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredProposals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-500">No proposals found.</td>
                  </tr>
                ) : filteredProposals.slice(0, 3).map((p, i) => {
                  const isDraft = (p.client?.status || 'Draft') === 'Draft';
                  return (
                    <tr key={p.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#99CB48]">
                            <FileText size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">{p.client?.referenceId || "WBL-000"}</span>
                            <span className="text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">{p.client?.companyName || "VALUED CLIENT"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-slate-500 dark:text-gray-400 text-xs font-bold uppercase tracking-tight max-w-[200px] truncate">{p.client?.proposalTitle || "Bespoke Solution"}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-slate-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider flex flex-col">
                          <span>{p.creatorName || p.client?.preparedBy || "Weblozy Labs"}</span>
                          <span className="text-slate-400 dark:text-gray-600 mt-0.5">({p.creatorEmployeeId || "WL-000000"})</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <Badge variant="outline" className={`rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-wider border-none ${isDraft ? 'bg-orange-500/10 text-orange-500' : 'bg-[#99CB48]/10 text-[#99CB48]'}`}>
                          {p.client?.status || 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-slate-500 dark:text-gray-400 text-[10px] font-medium flex flex-col">
                          <span>{new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-slate-400 dark:text-gray-600 mt-0.5">{new Date(p.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/preview/${p.id}`, { state: { proposal: p } })} className="w-8 h-8 rounded-lg hover:bg-[#99CB48]/10 text-[#99CB48] transition-colors">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit/${p.id}`)} className="w-8 h-8 rounded-lg hover:bg-orange-500/10 text-orange-500 transition-colors">
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(p.id)} disabled={p.userId === 'system'} className="w-8 h-8 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-20">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate('/saved')} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#99CB48] hover:bg-[#99CB48]/10 rounded-full h-8 px-6">
                View All Assets <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Stunning Custom Confirmation Modal */}
      <AnimatePresence>
         {deleteTargetId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteTargetId(null)}
                  className="absolute inset-0 bg-black/75 backdrop-blur-md"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white dark:bg-[#11151D] border border-red-500/20 rounded-[2.5rem] p-8 max-w-md w-full relative z-10 overflow-hidden shadow-2xl shadow-red-950/20 flex flex-col items-center text-center space-y-6"
               >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                  <div className="w-16 h-16 rounded-[1.25rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
                     <AlertOctagon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Decommission Protocol?</h3>
                     <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 leading-relaxed uppercase tracking-wider">
                        This action is irreversible. The selected proposal will be permanently purged from the strategic index.
                     </p>
                  </div>
                  <div className="flex gap-4 w-full pt-2">
                     <Button onClick={() => setDeleteTargetId(null)} className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest transition-all">
                        Abort Protocol
                     </Button>
                     <Button onClick={handleConfirmDelete} className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/25 transition-all">
                        Confirm Purge
                     </Button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
