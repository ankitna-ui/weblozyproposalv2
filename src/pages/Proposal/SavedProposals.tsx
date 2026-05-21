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
  ChevronLeft, 
  Plus, 
  Calendar, 
  Building2, 
  Loader2,
  Search,
  Filter,
  AlertOctagon,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProposals, deleteProposal } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Proposal } from "@/types/proposal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import logo from "@/assets/weblozy-logo.png";

export default function SavedProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    p.client.companyName.toLowerCase().includes(search.toLowerCase()) ||
    p.client.proposalTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <img src={logo} alt="Weblozy" className="w-12 h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-primary">Proposal Archive</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Vault of all generated enterprise protocols</p>
            </div>
          </div>
          <Button onClick={() => navigate('/create')} className="h-14 px-8 gap-2 bg-primary text-black hover:bg-primary/90 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            New Proposal
          </Button>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by client or title..." 
              className="h-14 pl-12 bg-card border-none rounded-2xl shadow-sm focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 font-bold uppercase text-[10px] tracking-widest">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground uppercase font-black text-[10px] tracking-widest">Decrypting Archive...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <Card className="rounded-[3rem] border-none shadow-premium p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-primary opacity-50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-tight">No Protocols Found</h3>
              <p className="text-muted-foreground">Your archive is currently empty or no matches found.</p>
            </div>
            <Button onClick={() => navigate('/create')} variant="outline" className="rounded-full px-8">
              Generate Your First Proposal
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProposals.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-[2.5rem] border-none shadow-premium bg-card/80 backdrop-blur hover:scale-[1.02] transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={`rounded-full px-3 uppercase text-[8px] font-black tracking-widest ${
                          p.client.status === 'Accepted' ? "bg-green-500 text-white" : 
                          p.client.status === 'Sent' ? "bg-blue-500 text-white" : 
                          "bg-primary text-black"
                        }`}>
                          {p.client.status}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">{p.client.referenceId}</span>
                      </div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                        {p.client.proposalTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="font-bold text-foreground">{p.client.companyName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <Users className="w-4 h-4 text-primary" />
                          <span>Prepared by: <strong className="text-foreground">{p.client.preparedBy || p.creatorName || "Weblozy Labs"}</strong></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-primary/5">
                        <Button 
                          onClick={() => navigate(`/preview/${p.id}`, { state: { proposal: p } })}
                          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl h-12 font-black uppercase text-[10px] tracking-widest"
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/edit/${p.id}`)}
                          className="rounded-xl h-12 w-12 hover:bg-primary/10 text-primary border border-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(p.id!)}
                          className="rounded-xl h-12 w-12 hover:bg-red-500/10 text-red-500 border border-red-500/10"
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
