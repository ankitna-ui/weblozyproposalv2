import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  X, 
  Loader2,
  Layout,
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
  Sliders,
  RotateCcw,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useProposalForm } from "@/hooks/useProposalForm";
import { useTokens } from "@/hooks/useTokens";
import { generateProposalContent } from "@/lib/gemini";
import DesignModulePanel from "@/components/Proposal/InputPanel/DesignModulePanel";
import { saveProposal } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSmartDraft, readDraftMeta, readDraftProposal, clearDraft } from "@/hooks/useSmartDraft";

import logo from "@/assets/weblozy-logo.png";
import ProposalPDF from "@/components/Proposal/pages2";
import {
  CoverIdentityPanel,
  CorporateLegacyPanel,
  OperationalAuditPanel,
  StrategicEcosystemPanel,
  OperationalFlowchartPanel,
  SolutionModulesPanel,
  TechnicalStackPanel,
  StrategicROIPanel,
  CommercialFrameworkPanel,
  PortfolioProtocolPanel,
  CTAClosingPanel
} from "@/components/Proposal/InputPanel";

const stepDefinitions: Record<string, { name: string; icon: any; render: (props: any) => React.ReactNode }> = {
  cover: { 
    name: "Cover & Identity", 
    icon: Layout, 
    render: (props) => <CoverIdentityPanel {...props} /> 
  },
  identity: { 
    name: "Corporate Legacy", 
    icon: Award, 
    render: (props) => <CorporateLegacyPanel {...props} /> 
  },
  audit: { 
    name: "Operational Audit", 
    icon: Search, 
    render: (props) => <OperationalAuditPanel {...props} /> 
  },
  ecosystem: { 
    name: "Strategic Ecosystem", 
    icon: Globe, 
    render: (props) => <StrategicEcosystemPanel {...props} /> 
  },
  flowchart: { 
    name: "Operational Logic", 
    icon: GitBranch, 
    render: (props) => <OperationalFlowchartPanel {...props} /> 
  },
  modules: { 
    name: "Solution Modules", 
    icon: Box, 
    render: (props) => <SolutionModulesPanel {...props} /> 
  },
  technical: { 
    name: "Technical Stack", 
    icon: Cpu, 
    render: (props) => <TechnicalStackPanel {...props} /> 
  },
  roi: { 
    name: "Strategic ROI", 
    icon: TrendingUp, 
    render: (props) => <StrategicROIPanel {...props} /> 
  },
  commercial: { 
    name: "Commercial Framework", 
    icon: CreditCard, 
    render: (props) => <CommercialFrameworkPanel {...props} /> 
  },
  portfolio: { 
    name: "Portfolio Protocol", 
    icon: Monitor, 
    render: (props) => <PortfolioProtocolPanel {...props} /> 
  },
  closing: { 
    name: "CTA & Closing", 
    icon: Send, 
    render: (props) => <CTAClosingPanel {...props} /> 
  }
};

export default function CreateProposal() {
  const navigate = useNavigate();
  // Restore saved step from localStorage on first load
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = localStorage.getItem("weblozy_proposal_draft_step_v2");
      if (savedStep) return Number(savedStep);
    } catch {}
    return 0;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<{ fullName: string, employeeId: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Smart Draft state — now just shows info banner (draft auto-loads via useProposalForm)
  const [draftBanner, setDraftBanner] = useState<{ show: boolean; title: string | null; timestamp: number | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setEmployeeProfile(userDoc.data() as { fullName: string, employeeId: string });
          }
        } catch (err) {
          console.error("Error loading user profile:", err);
        }
      }
    };
    fetchProfile();
  }, []);

  // Check for existing draft on mount — data is already auto-loaded by useProposalForm
  useEffect(() => {
    const meta = readDraftMeta();
    if (meta.hasDraft) {
      // Show info banner (form already has the data, just inform user)
      setDraftBanner({ show: true, title: meta.draftTitle, timestamp: meta.draftTimestamp });
      // Auto-dismiss after 5 seconds
      setTimeout(() => setDraftBanner(null), 5000);
    }
  }, []);

  const { consumeTokens } = useTokens();

  const { 
    proposal, 
    updateClient, 
    updateSituation, 
    updateSolution, 
    updateTechArchitecture,
    updateROI, 
    updateExperience,
    updatePricing, 
    updateClosing,
    setAIContent,
    updatePageConfig,
    setProposal
  } = useProposalForm();

  // Auto-save to localStorage on every change (debounced)
  useSmartDraft(proposal, currentStep);

  // Start fresh — clears draft and resets form to defaults
  const handleStartFresh = () => {
    clearDraft();
    window.location.reload(); // Cleanest way to reset full form state to defaults
  };

  // Dismiss banner only (keep draft data in form)
  const handleDismissDraft = () => {
    setDraftBanner(null);
  };

  // 1. Dynamic steps based on current page config
  const defaultPageOrder = proposal.pageConfig || [
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

  const activePageSteps = defaultPageOrder
    .filter(page => page.visible)
    .map(page => {
      const def = stepDefinitions[page.id];
      return {
        id: page.id,
        name: def?.name || page.name,
        icon: def?.icon || Layout,
        render: def?.render || (() => null)
      };
    });

  const dynamicSteps = [
    ...activePageSteps,
    {
      id: "architecture",
      name: "Proposal Architecture",
      icon: Sliders,
      render: (props: any) => (
        <DesignModulePanel 
          proposal={props.proposal} 
          updatePageConfig={props.updatePageConfig} 
        />
      )
    }
  ];

  // Self-heal step index bounds on changes
  useEffect(() => {
    if (currentStep >= dynamicSteps.length) {
      setCurrentStep(Math.max(0, dynamicSteps.length - 1));
    }
  }, [dynamicSteps.length, currentStep]);

  useEffect(() => {
    setValidationError(null);
  }, [currentStep, proposal.client.proposalTitle, proposal.solution.selectedModules]);

  /* 
  // Commented out to match deactivated meetingNotes field (saves Firebase space)
  const handleAIAction = async () => {
    if (!proposal.situation.meetingNotes) {
      toast.warning("Protocol Error: Please add meeting notes first to synchronize AI.");
      return;
    }
    
    setIsGenerating(true);
    const aiPromise = generateProposalContent(
      proposal.situation.meetingNotes,
      proposal.client.companyName,
      proposal.solution.selectedModules.map(m => m.name)
    );

    toast.promise(aiPromise, {
      pending: 'Synchronizing Strategic AI Intelligence...',
      success: 'AI Content Synchronized Successfully! ✨',
      error: 'AI Synchronization Failed. Please verify connectivity.'
    });

    try {
      const { content, tokens } = await aiPromise;
      setAIContent(content);
      consumeTokens(tokens);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  */

  const validateStep = () => {
    const activeStep = dynamicSteps[currentStep];
    if (!activeStep) return true;
    switch (activeStep.id) {
      case "cover":
        if (!proposal.client.proposalTitle?.trim()) {
          setValidationError("Validation Error: Main Proposal Title is required.");
          return false;
        }
        break;
      case "modules":
        if (proposal.solution.selectedModules.length === 0) {
          setValidationError("Validation Error: Add at least one module node to continue.");
          return false;
        }
        break;
    }
    setValidationError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(dynamicSteps.length - 1, prev + 1));
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setValidationError("Authentication Required: Please login to initiate your protocol.");
      return;
    }

    if (!proposal.client.proposalTitle?.trim()) {
      setValidationError("Pre-Flight Check Failed: Proposal Title is required.");
      return;
    }

    setValidationError(null);
    setIsSaving(true);
    const savePromise = saveProposal({
      ...proposal,
      client: {
        ...proposal.client,
        preparedBy: employeeProfile ? `${employeeProfile.fullName} (${employeeProfile.employeeId})` : (proposal.client.preparedBy || "Weblozy Labs")
      },
      userId: user.uid,
      creatorName: employeeProfile?.fullName || "Strategic Operator",
      creatorEmployeeId: employeeProfile?.employeeId || "UNKNOWN",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    toast.promise(savePromise, {
      pending: 'Initializing Strategic Protocol...',
      success: 'Strategic Protocol Initialized Successfully! 🚀',
      error: 'Failed to save protocol. Please try again.'
    });

    try {
      const id = await savePromise;
      // Clear draft after successful save
      clearDraft();
      const finalProposal = {
        ...proposal,
        id,
        userId: user.uid,
        client: {
          ...proposal.client,
          preparedBy: employeeProfile ? `${employeeProfile.fullName} (${employeeProfile.employeeId})` : (proposal.client.preparedBy || "Weblozy Labs")
        },
        creatorName: employeeProfile?.fullName || "Strategic Operator",
        creatorEmployeeId: employeeProfile?.employeeId || "UNKNOWN"
      };
      navigate(`/preview/${id}`, { state: { proposal: finalProposal } });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Common props for all panels
  const panelProps = {
    proposal,
    currentStep,
    updateClient,
    updateSituation,
    updateSolution,
    updateTechArchitecture,
    updateROI,
    updateExperience,
    updatePricing,
    updateClosing,
    updatePageConfig
  };

  const renderStep = () => {
    const step = dynamicSteps[currentStep];
    if (!step) return null;
    return step.render(panelProps);
  };

  // Format draft timestamp for display
  const formatDraftTime = (ts: number | null) => {
    if (!ts) return "";
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen overflow-hidden">
        {/* Modernized Input Panel */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[40%] flex flex-col border-r border-slate-100 bg-[#F8FAFC] shadow-[20px_0_40px_-15px_rgba(0,0,0,0.03)] z-30 overflow-hidden relative">
          
          {/* ─── Smart Draft Restore Banner ─── */}
          <AnimatePresence>
            {draftBanner?.show && (
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-0 left-0 right-0 z-50 bg-[#0B0E14] border-b border-[#99CB48]/30 px-5 py-3 flex items-center justify-between gap-3 shadow-xl shadow-black/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/25 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-[#99CB48]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-[#99CB48] uppercase tracking-widest">Draft Auto-Restored ✓</div>
                    <div className="text-[9px] text-white/50 font-semibold truncate">
                      {draftBanner.title ? `"${draftBanner.title}"` : "Untitled Proposal"} · saved {formatDraftTime(draftBanner.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleStartFresh}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/50 hover:text-red-400 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all"
                  >
                    Start Fresh
                  </button>
                  <button
                    onClick={handleDismissDraft}
                    className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/70 transition-all border border-white/10"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0B0E14] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={logo} alt="W" className="w-6 h-6 sm:w-8 sm:h-8 object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#0B0E14]">Proposal <span className="text-primary italic">OS.</span></h1>
                <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#99CB48]" />
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Strategic Editor V3</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center bg-slate-100/50 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
              <X size={20} />
            </button>
          </div>

          {/* Premium Step Navigation */}
          <div className="px-5 sm:px-8 py-3.5 sm:py-5 bg-white/40 border-b border-slate-100 flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {dynamicSteps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === i;
              return (
                <button 
                  key={step.id} 
                  onClick={() => setCurrentStep(i)} 
                  className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-[#0B0E14] text-white shadow-xl shadow-black/10 scale-105" 
                      : "bg-white/80 border border-slate-100 text-slate-400 hover:border-primary/30 hover:text-slate-600"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-300"}`}>
                    <StepIcon size={12} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{step.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-white/30">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }} 
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-red-500/5"
                  >
                    {validationError}
                  </motion.div>
                )}
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Modernized Footer Controls */}
          <div className="p-6 sm:p-10 border-t border-slate-100 bg-white/90 backdrop-blur-xl flex justify-between items-center sticky bottom-0 z-40">
            {/* Absolute Top Border Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-100">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${Math.round(((currentStep + 1) / dynamicSteps.length) * 100)}%` }}
              />
            </div>

            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} 
              disabled={currentStep === 0} 
              className="h-12 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-all disabled:opacity-30"
            >
              <ChevronLeft size={18} className="mr-1 sm:mr-2" /> Back
            </Button>

            {/* Auto-save indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Auto-Saving Draft</span>
            </div>
            
            <div className="flex gap-2 items-center">
              {currentStep < dynamicSteps.length - 1 ? (
                <Button onClick={nextStep} className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl sm:rounded-2xl bg-[#0B0E14] hover:bg-black text-white shadow-xl shadow-black/10 text-[10px] font-black uppercase tracking-[0.2em] group">
                  <span className="hidden sm:inline">Next Sequence</span>
                  <span className="inline sm:hidden">Next</span>
                  <ChevronRight size={18} className="text-primary ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={isSaving} className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl sm:rounded-2xl bg-primary hover:bg-[#88B540] text-white shadow-xl shadow-primary/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="mr-1 sm:mr-2" />}
                  <span className="hidden sm:inline">Finalize Protocol</span>
                  <span className="inline sm:hidden">Finalize</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Cleaned Preview Panel (Dedicated Header & Soft Shadows) */}
        <div className="hidden md:flex flex-col flex-1 bg-slate-50/50 border-l border-slate-100 overflow-hidden h-full relative">
           {/* Sticky Top Status Header */}
           <div className="sticky top-0 z-20 w-full bg-white/85 backdrop-blur-md border-b border-slate-100/80 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#99CB48] animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Real-time Visualization</span>
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                 Live Render
              </div>
           </div>

           {/* Scrollable Document Area */}
           <div className="flex-1 overflow-y-auto p-12 custom-scrollbar flex justify-center items-start bg-slate-50/20">
              <div className="relative z-10 flex justify-center h-fit w-full">
                 <div className="pdf-preview-scale transition-all duration-500 h-fit rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-slate-100/80 bg-white">
                    <ProposalPDF proposal={proposal} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
}
