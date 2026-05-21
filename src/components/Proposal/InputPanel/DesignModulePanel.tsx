import React from "react";
import { Proposal, PageConfig } from "@/types/proposal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Award, 
  Search, 
  Globe, 
  GitBranch, 
  Box, 
  Cpu, 
  TrendingUp, 
  CreditCard, 
  Monitor, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  Layers
} from "lucide-react";

interface PanelProps {
  proposal: Proposal;
  updatePageConfig?: (config: PageConfig[]) => void;
  // Fallbacks if hook isn't directly passed
  setProposal?: React.Dispatch<React.SetStateAction<Proposal>>;
}

const pageIcons: Record<string, React.ComponentType<any>> = {
  cover: FileText,
  identity: Award,
  audit: Search,
  ecosystem: Globe,
  flowchart: GitBranch,
  modules: Box,
  technical: Cpu,
  roi: TrendingUp,
  commercial: CreditCard,
  portfolio: Monitor,
  closing: Send
};

const defaultPages: PageConfig[] = [
  { id: "cover", name: "Cover Page", visible: true },
  { id: "identity", name: "Corporate Identity", visible: true },
  { id: "audit", name: "Operational Audit", visible: true },
  { id: "ecosystem", name: "Strategic Ecosystem", visible: true },
  { id: "flowchart", name: "Operational Logic (Flowchart)", visible: true },
  { id: "modules", name: "Solution Modules", visible: true },
  { id: "technical", name: "Technical Stack", visible: true },
  { id: "roi", name: "Strategic ROI", visible: true },
  { id: "commercial", name: "Commercial Framework", visible: true },
  { id: "portfolio", name: "Portfolio Protocol", visible: true },
  { id: "closing", name: "CTA & Closing", visible: true }
];

interface CustomSwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function CustomSwitch({ checked, disabled, onChange }: CustomSwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`rounded-full transition-all duration-300 relative focus:outline-none ${
        disabled 
          ? "opacity-30 cursor-not-allowed bg-slate-200" 
          : checked 
            ? "bg-[#99CB48] shadow-[0_0_8px_rgba(153,203,72,0.25)]" 
            : "bg-slate-200"
      }`}
      style={{ width: "32px", height: "18px" }}
    >
      <span 
        className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-300 transform shadow-sm ${
          checked ? "translate-x-[14px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function DesignModulePanel({ proposal, updatePageConfig, setProposal }: PanelProps) {
  // Extract or initialize page config
  const pageConfig = proposal.pageConfig || defaultPages;

  const handleToggle = (id: string, checked: boolean) => {
    if (id === "cover" || id === "closing") return;

    const updated = pageConfig.map(page => 
      page.id === id ? { ...page, visible: checked } : page
    );

    if (updatePageConfig) {
      updatePageConfig(updated);
    } else if (setProposal) {
      setProposal(prev => ({ ...prev, pageConfig: updated }));
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pageConfig.length) return;

    const reordered = [...pageConfig];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    if (updatePageConfig) {
      updatePageConfig(reordered);
    } else if (setProposal) {
      setProposal(prev => ({ ...prev, pageConfig: reordered }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-slate-50/50">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-[2px] bg-[#99CB48]" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#99CB48]">MODULE 12: PROPOSAL ARCHITECTURE</span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter text-[#0B0E14] leading-none">
          Page <span className="text-[#99CB48] italic">Customizer.</span>
        </h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1 max-w-md leading-relaxed">
          Manage proposal output structure. Toggle specific sections on or off, and arrange the flow sequence with ease.
        </p>
      </div>

      {/* Quick Guide Information Box */}
      <div className="p-3 rounded-xl bg-white border border-slate-100/80 flex gap-2.5 shadow-sm">
        <div className="w-7 h-7 rounded-lg bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48] shrink-0">
          <Layers size={13} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800">Dynamic Live Rendering</h4>
          <p className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider leading-normal">
            Reordering pages or hiding them will instantly update the dynamic PDF generation sequence and active paginations.
          </p>
        </div>
      </div>

      {/* Pages Container list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-400 px-2 pb-0.5 border-b border-slate-100">
          <span>Proposal Page Flow</span>
          <span>Visibility & Order</span>
        </div>

        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {pageConfig.map((page, idx) => {
              const Icon = pageIcons[page.id] || FileText;
              const isCoverOrClosing = page.id === "cover" || page.id === "closing";

              return (
                <motion.div
                  key={page.id}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className={`py-2 px-3 rounded-xl bg-white border transition-all duration-300 shadow-sm flex items-center justify-between group ${
                    page.visible ? "border-slate-100 hover:border-slate-200" : "border-slate-100/50 opacity-60 bg-slate-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Drag / Position Indicator */}
                    <div className="w-6 h-6 rounded-md bg-slate-50 border border-slate-100/80 flex items-center justify-center text-[9px] font-mono font-black text-slate-400 shadow-inner group-hover:bg-slate-100/50 transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        page.visible ? "bg-[#99CB48]/5 text-[#99CB48]" : "bg-slate-100 text-slate-400"
                      }`}>
                        <Icon size={12} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
                          {page.name}
                          {isCoverOrClosing && (
                            <span className="text-[6px] font-black tracking-widest bg-slate-100 text-slate-400 px-1 py-0.2 rounded uppercase select-none">
                              Core
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Reordering Controls */}
                    <div className="flex items-center border border-slate-100 bg-slate-50 rounded-md p-0.5 shadow-inner">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-white transition-all"
                      >
                        <ChevronUp size={11} />
                      </button>
                      <div className="w-px h-2.5 bg-slate-200/80" />
                      <button
                        type="button"
                        disabled={idx === pageConfig.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none hover:bg-white transition-all"
                      >
                        <ChevronDown size={11} />
                      </button>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <CustomSwitch
                        checked={page.visible}
                        disabled={isCoverOrClosing}
                        onChange={(checked) => handleToggle(page.id, checked)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
