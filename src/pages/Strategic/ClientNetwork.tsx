import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function ClientNetwork() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-orange-500 mb-2">Client Network</h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium uppercase text-[10px] tracking-[0.3em]">Corporate relations and client matrices</p>
          </div>
          <Button className="h-12 px-6 gap-2 bg-orange-500 text-black hover:bg-orange-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </header>

        <div className="bg-white dark:bg-[#11151D] rounded-3xl border border-slate-200 dark:border-white/5 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto">
            <Users className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">No Corporate Connections</h3>
            <p className="text-slate-500 dark:text-gray-400">Your network grid is empty. Establish a connection to visualize data.</p>
          </div>
          <Button variant="outline" className="rounded-full px-8 bg-transparent border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:bg-white/5 text-xs uppercase tracking-widest text-slate-900 dark:text-white">
            Establish Connection
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
