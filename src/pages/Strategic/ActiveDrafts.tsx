import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileEdit, Plus } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function ActiveDrafts() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#99CB48] mb-2">Active Drafts</h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium uppercase text-[10px] tracking-[0.3em]">Continue working on your strategic protocols</p>
          </div>
          <Button onClick={() => navigate('/create')} className="h-12 px-6 gap-2 bg-[#99CB48] text-black hover:bg-[#88B540] rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#99CB48]/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            New Draft
          </Button>
        </header>

        <div className="bg-white dark:bg-[#11151D] rounded-3xl border border-slate-200 dark:border-white/5 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-[#99CB48]/10 rounded-3xl flex items-center justify-center mx-auto">
            <FileEdit className="w-10 h-10 text-[#99CB48] opacity-50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">No Drafts In Progress</h3>
            <p className="text-slate-500 dark:text-gray-400">All your strategic proposals have been finalized and deployed.</p>
          </div>
          <Button onClick={() => navigate('/create')} variant="outline" className="rounded-full px-8 bg-transparent border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:bg-white/5 text-xs uppercase tracking-widest text-slate-900 dark:text-white">
            Start A New Protocol
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
