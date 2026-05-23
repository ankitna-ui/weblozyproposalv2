import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, FileText, Users, LogOut, Search, Settings,
  Home, FileEdit, Database, UserCog, ToyBrick, Sun, Moon, Download
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { auth, db } from "@/lib/firebase";
import { getProposals } from "@/lib/firestore";
import { Proposal } from "@/types/proposal";
import banner2Logo from "@/assets/banner2_logo.png";
import bannerLogo from "@/assets/banner_logo.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export default function DashboardLayout({ children, searchQuery, setSearchQuery }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [proposals, setProposals] = useState<(Proposal & { id: string })[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const data = await getProposals(user.uid);
          setProposals(data as (Proposal & { id: string })[]);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchStats();
  }, [location.pathname]); // Refetch slightly on nav just in case

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const stats = useMemo(() => {
    const total = proposals.length;
    const drafts = proposals.filter(p => (p.client?.status || 'Draft') === 'Draft').length;
    const downloaded = proposals.filter(p => (p as any).isDownloaded || p.client?.status === 'Sent' || p.client?.status === 'Accepted' || p.client?.status === 'Declined').length;
    return {
      proposals: total,
      drafts: drafts,
      downloaded: downloaded
    };
  }, [proposals]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-white overflow-hidden font-sans transition-colors">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-64 bg-white dark:bg-[#11151D] border-r border-slate-200 dark:border-white/5 flex flex-col justify-between hidden lg:flex h-full shrink-0 transition-colors">
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Logo Area */}
          <div className="mb-10 pl-2">
            <img src={banner2Logo} alt="Weblozy" className="hidden dark:block h-8 w-auto object-contain transition-all" />
            <img src={bannerLogo} alt="Weblozy" className="block dark:hidden h-8 w-auto object-contain transition-all" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-8">
            <div>
              <div 
                onClick={() => navigate('/dashboard')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive('/dashboard') || isActive('/') ? 'bg-[#99CB48]/10 text-[#99CB48] border border-[#99CB48]/20' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5'}`}
              >
                <Home size={16} />
                <span className="text-[11px] font-black uppercase tracking-wider">Dashboard</span>
              </div>
            </div>

            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-3 px-4">Strategic Management</div>
              <div className="space-y-1">
                <div 
                  onClick={() => navigate('/saved')} 
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive('/saved') ? 'bg-blue-500/10 text-blue-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} />
                    <span className="text-[11px] font-bold tracking-wider">Total Proposals</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{stats.proposals}</span>
                </div>
                
                <div 
                  onClick={() => navigate('/drafts')} 
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive('/drafts') ? 'bg-[#99CB48]/10 text-[#99CB48]' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <FileEdit size={16} />
                    <span className="text-[11px] font-bold tracking-wider">Active Drafts</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{stats.drafts}</span>
                </div>
                
                <div 
                  onClick={() => navigate('/saved')} 
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${!isActive('/drafts') && !isActive('/saved') && !isActive('/dashboard') && !isActive('/') ? 'bg-orange-500/10 text-orange-500' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <Download size={16} />
                    <span className="text-[11px] font-bold tracking-wider">Downloaded</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{stats.downloaded}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-3 px-4">Settings</div>
              <div className="space-y-1">
                <div 
                  onClick={() => navigate('/profile')} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive('/profile') ? 'bg-[#99CB48]/10 text-[#99CB48] border border-[#99CB48]/20' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-white/5'}`}
                >
                  <UserCog size={16} />
                  <span className="text-[11px] font-black uppercase tracking-wider">Users & Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl">
            <div className="text-[11px] font-black tracking-wider text-[#99CB48] mb-1">Need Help?</div>
            <p className="text-[10px] text-slate-500 dark:text-gray-500 leading-relaxed mb-4">Access docs or contact support team.</p>
            <Button variant="outline" className="w-full bg-transparent border-slate-300 dark:border-white/10 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-9 transition-colors">
              Contact Support
            </Button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/4 w-[40%] h-[20%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ─── TOP HEADER ─── */}
        <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-xl shrink-0 z-10 transition-colors">
          <div className="hidden md:block">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#99CB48]">Automation OS</h2>
            <p className="text-[9px] text-slate-500 dark:text-gray-500 uppercase tracking-widest mt-0.5">Strategic Command Center</p>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="flex items-center bg-slate-50 dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-full px-5 h-11 w-full focus-within:border-slate-300 dark:focus-within:border-white/20 transition-colors">
              <Search className="w-4 h-4 text-slate-500 dark:text-gray-500 mr-3" />
              <input 
                type="text" 
                placeholder="Search assets, proposals, clients..." 
                value={searchQuery !== undefined ? searchQuery : ""}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold tracking-wider text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-gray-600 w-full" 
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>


            
            <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2">
              <LogOut size={16} /> Logout
            </button>
            
            <Button onClick={() => navigate('/create')} className="bg-[#99CB48] text-black hover:bg-[#88B540] h-11 px-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-[#99CB48]/20 gap-2 ml-2 transition-transform active:scale-95">
              <Plus className="w-4 h-4" /> New Strategy
            </Button>
          </div>
        </header>

        {/* ─── SCROLLABLE PAGE CONTENT ─── */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
