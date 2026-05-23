import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Eye, 
  Trash2, 
  Pencil, 
  Plus, 
  Calendar, 
  Building2, 
  Loader2,
  AlertOctagon,
  Users
} from "lucide-react";
import { getProposals, deleteProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Proposal } from "@/types/proposal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function SavedProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProposals() {
      if (!auth.currentUser) return;
      try {
        const data = await getProposals(auth.currentUser.uid);
        setProposals(data);
      } catch (error) {
        console.error("Error loading proposals:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProposals();
  }, []);

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
      toast.success("Proposal protocol successfully purged from archives.");
    } catch (error) {
      console.error(error);
      toast.error("Deletion protocol failed. Access denied.");
    }
  };

  const filteredProposals = proposals.filter(p => 
    p.client?.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client?.proposalTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-500 mb-2">Strategic Proposals</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Vault of all generated enterprise protocols</p>
          </div>
          <Button onClick={() => navigate('/create')} className="h-12 px-6 gap-2 bg-blue-500 text-slate-900 dark:text-white hover:bg-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            New Proposal
          </Button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-slate-500 dark:text-gray-400 uppercase font-black text-[10px] tracking-widest">Decrypting Archive...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="bg-white dark:bg-[#11151D] rounded-3xl border border-slate-200 dark:border-white/5 p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">No Protocols Found</h3>
              <p className="text-slate-500 dark:text-gray-400">Your archive is currently empty or no matches found.</p>
            </div>
            <Button onClick={() => navigate('/create')} variant="outline" className="rounded-full px-8 bg-transparent border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:bg-white/5 text-xs uppercase tracking-widest">
              Generate Your First Proposal
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProposals.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#11151D] hover:bg-white/[0.02] transition-colors group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={`rounded-md px-2 py-0.5 uppercase text-[8px] font-black tracking-widest ${
                          p.client.status === 'Accepted' ? "bg-green-500/10 text-green-500" : 
                          p.client.status === 'Sent' ? "bg-blue-500/10 text-blue-500" : 
                          "bg-orange-500/10 text-orange-500"
                        }`}>
                          {p.client.status}
                        </Badge>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-gray-600">{p.client.referenceId}</span>
                      </div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                        {p.client.proposalTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="font-bold text-slate-700 dark:text-gray-300 truncate">{p.client.companyName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-gray-400">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="truncate">Prepared by: <strong className="text-slate-500 dark:text-gray-400">{p.client.preparedBy || p.creatorName || "Weblozy Labs"}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                        <Button 
                          onClick={() => navigate(`/preview/${p.id}`, { state: { proposal: p } })}
                          className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl h-10 font-black uppercase text-[9px] tracking-widest"
                        >
                          <Eye className="w-4 h-4 mr-2 text-blue-500" /> View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/edit/${p.id}`)}
                          className="rounded-xl h-10 w-10 hover:bg-orange-500/10 text-orange-500 bg-slate-100 dark:bg-white/5"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(p.id!)}
                          className="rounded-xl h-10 w-10 hover:bg-red-500/10 text-red-500 bg-slate-100 dark:bg-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

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
                     <Button 
                        onClick={() => setDeleteTargetId(null)}
                        className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        Abort Protocol
                     </Button>
                     <Button 
                        onClick={handleConfirmDelete}
                        className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/25 transition-all"
                      >
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
