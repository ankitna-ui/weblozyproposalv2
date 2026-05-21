import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, TrendingUp, Users, Clock, Eye, Trash2, LogOut, Pencil, LayoutGrid, Search, Bell, Settings, AlertOctagon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProposals, deleteProposal } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Proposal } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import banner2Logo from "@/assets/banner2_logo.png";
import LoadingScreen from '@/components/ui/LoadingScreen';

// System Templates / Sample Data for a full experience
const SAMPLE_PROPOSALS: (Proposal & { id: string })[] = [
  {
    id: "sample-1",
    userId: "system",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    client: {
      companyName: "Nexus Global",
      contactPerson: "Alex Rivera",
      clientName: "Alex Rivera",
      industry: "Retail Automation",
      industryTitle: "Retail Automation",
      proposalTitle: "E-commerce AI Transformation",
      industryDomain: "Global E-commerce",
      websiteUrl: "WWW.NEXUSGLOBAL.COM",
      tagline: "The Future of Retail",
      subTitle: "Strategic Technical Roadmap V2.0",
      protocolTitle: "CONFIDENTIAL",
      releaseProtocol: "SECURE-NODE",
      filingDate: "MAY 2024",
      status: "Sent",
      referenceId: "WBL-NEXUS-001",
      meetingDate: "2024-05-10",
      preparedBy: "Weblozy Labs"
    },
    problemStatement: { heading: "Operational Inefficiency", description: "Manual order management is causing leakage.", pointers: [] },
    situation: { currentWorkflow: "Manual overhead", meetingNotes: "", existingSoftware: "None", challenges: [], revenueLeakage: "High", inefficiencies: "Manual", limitations: "Scale" },
    solution: { overview: "Systemic transformation", approach: "Automation", approachPoints: [], selectedModules: [], customModules: [], demoLinks: [], integrations: [], userRoles: [], timeline: "" },
    techArchitecture: { frontendStack: [], backendStack: [], database: "", hosting: "", securityFeatures: [] },
    roi: { revenueIncrease: "35", productivityIncrease: "50", costReduction: "20", timeSaving: "150", expectedROI: "320", impactSummary: "", profitImpact: "₹4.2L / Month" },
    pricing: { range: "", coreValuation: "55000", discountPercentage: "10", taxRate: "18", milestones: [], roiLogic: "", hostingCost: "", maintenanceCost: "", supportCost: "", taxes: "" },
    experience: { yearsOfExperience: "", projectsCompleted: "", industriesServed: [], portfolioLinks: [], strategicSummary: "", testimonials: [] },
    policies: { support: "", security: "", backup: "", sla: "", timeline: "" },
    closing: { meetingLink: "", contactEmail: "", contactPhone: "", nextSteps: [] }
  }
];

export default function Dashboard() {
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [employeeProfile, setEmployeeProfile] = useState<{ fullName: string, employeeId: string } | null>(null);
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
  }, []);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setEmployeeProfile(userDoc.data() as { fullName: string, employeeId: string });
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  const fetchProposals = async (uid: string) => {
    try {
      const [data] = await Promise.all([
        getProposals(uid),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      setProposals(data as (Proposal & { id: string })[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
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
    const list: (Proposal & { id: string })[] = proposals.length > 0 ? proposals : SAMPLE_PROPOSALS;
    if (!searchQuery) return list;
    return list.filter(p => 
      p.client?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.proposalTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client?.referenceId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [proposals, searchQuery]);

  const metrics = useMemo(() => [
    { title: "Strategic Proposals", value: filteredProposals.length.toString(), icon: FileText, color: "from-blue-600/20 to-blue-400/5", textColor: "text-blue-400" },
    { title: "Active Drafts", value: filteredProposals.filter(p => (p.client?.status || 'Draft') === 'Draft').length.toString(), icon: Clock, color: "from-[#99CB48]/20 to-[#99CB48]/5", textColor: "text-[#99CB48]" },
    { title: "Institutional Assets", value: (filteredProposals.length * 9).toString(), icon: LayoutGrid, color: "from-purple-600/20 to-purple-400/5", textColor: "text-purple-400" },
    { title: "Client Network", value: new Set(filteredProposals.map(p => p.client?.companyName)).size.toString(), icon: Users, color: "from-orange-600/20 to-orange-400/5", textColor: "text-orange-400" },
  ], [filteredProposals]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white overflow-x-hidden font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1668B2]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <img src={banner2Logo} alt="Partners" className="h-10 sm:h-12 w-auto object-contain max-w-[280px]" />
            <div className="h-6 w-[1.5px] bg-white/10 hidden md:block" />
            <div className="hidden md:block">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Automation OS</h2>
              <p className="text-[8px] text-gray-500 uppercase tracking-widest">Strategic Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-10 w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search Assets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[10px] uppercase tracking-widest text-white focus:ring-0 placeholder:text-gray-700 w-full" 
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button onClick={handleLogout} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 gap-2 px-3 sm:px-4 h-10">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <Button onClick={() => navigate('/create')} className="bg-primary text-black hover:bg-primary/90 h-10 px-4 sm:px-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20 gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Strategy</span>
                <span className="inline sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Node Secured</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">
              Strategic <span className="text-primary italic">Dashboard</span>
            </h1>
          </div>

          {employeeProfile && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 sm:gap-6 bg-white/[0.02] border border-white/5 px-4 sm:px-8 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.8rem] backdrop-blur-md shadow-lg shadow-black/10 w-fit"
            >
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Corporate Operator</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">{employeeProfile.fullName}</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Employee ID</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-primary">{employeeProfile.employeeId}</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 sm:p-8 bg-gradient-to-br ${metric.color} border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] relative overflow-hidden group hover:border-primary/20 transition-all duration-500`}
            >
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <metric.icon size={120} />
              </div>
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                  <metric.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${metric.textColor}`} />
                </div>
                <div>
                  <div className="text-2xl sm:text-4xl font-black tracking-tighter mb-1 leading-none">{metric.value}</div>
                  <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{metric.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter">Recent Strategic Assets</h3>
            <Badge variant="outline" className="border-white/10 rounded-full px-3 sm:px-4 py-1 uppercase text-[8px] sm:text-[9px] font-black tracking-widest text-primary bg-primary/5">
              Live Monitoring
            </Badge>
          </div>

          <div className="bg-[#161B22]/40 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 sm:p-6 pl-4 sm:pl-10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Client Profile</th>
                    <th className="p-4 sm:p-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Strategic Title</th>
                    <th className="p-4 sm:p-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Prepared By</th>
                    <th className="p-4 sm:p-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="p-4 sm:p-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProposals.map((p, i) => (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-4 sm:p-6 pl-4 sm:pl-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center text-primary border border-primary/10 shadow-sm shadow-primary/5">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-white uppercase tracking-wider text-[10px] sm:text-xs">{p.client?.referenceId || "WBL-000"}</span>
                            <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{p.client?.companyName || "VALUED CLIENT"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-tight">{p.client?.proposalTitle || "Bespoke Solution"}</div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <div className="text-gray-500 text-[10px] sm:text-xs font-black uppercase tracking-wider">{p.client?.preparedBy || p.creatorName || "Weblozy Labs"}</div>
                      </td>
                      <td className="p-4 sm:p-6">
                        <Badge variant="outline" className={`rounded-full px-3 sm:px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] border-none ${p.client?.status === 'Draft' ? 'bg-orange-500/10 text-orange-400' : 'bg-primary/10 text-primary'}`}>
                          {p.client?.status || 'Draft'}
                        </Badge>
                      </td>
                      <td className="p-4 sm:p-6 pr-4 sm:pr-10 text-right">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/preview/${p.id}`, { state: { proposal: p } })} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-primary/10 text-primary transition-all active:scale-90">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit/${p.id}`)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-orange-500/10 text-orange-500 transition-all active:scale-90">
                            <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(p.id)} disabled={p.userId === 'system'} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-red-500/10 text-red-500 transition-all active:scale-90 disabled:opacity-20">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <div className="flex items-center gap-4">
          <img src={banner2Logo} alt="Partners" className="h-8 w-auto object-contain max-w-[200px]" />
          <div className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Control Node</div>
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.6em]">
          Secure Terminal Access • Version 2.8.5 • © 2026 Weblozy Labs
        </div>
      </footer>

      {/* Stunning Custom Confirmation Modal */}
      <AnimatePresence>
         {deleteTargetId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               {/* Backdrop */}
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDeleteTargetId(null)}
                  className="absolute inset-0 bg-black/75 backdrop-blur-md"
               />
               
               {/* Modal Card */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-[#11151D] border border-red-500/20 rounded-[2.5rem] p-8 max-w-md w-full relative z-10 overflow-hidden shadow-2xl shadow-red-950/20 flex flex-col items-center text-center space-y-6"
               >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                  
                  <div className="w-16 h-16 rounded-[1.25rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
                     <AlertOctagon className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="text-xl font-black uppercase tracking-tight text-white">Decommission Protocol?</h3>
                     <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                        This action is irreversible. The selected proposal will be permanently purged from the strategic index.
                     </p>
                  </div>
                  
                  <div className="flex gap-4 w-full pt-2">
                     <Button 
                        onClick={() => setDeleteTargetId(null)}
                        className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        Abort Protocol
                     </Button>
                     <Button 
                        onClick={handleConfirmDelete}
                        className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/25 transition-all"
                     >
                        Confirm Purge
                     </Button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
