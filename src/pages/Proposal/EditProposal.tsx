import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useProposalForm } from "@/hooks/useProposalForm";
import { useTokens } from "@/hooks/useTokens";
import { generateProposalContent } from "@/lib/gemini";
import DesignModulePanel from "@/components/Proposal/InputPanel/DesignModulePanel";
import { getProposal, updateProposal } from "@/lib/firestore";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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

export default function EditProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeProfile, setEmployeeProfile] = useState<{ fullName: string, employeeId: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  const { consumeTokens } = useTokens();

  useEffect(() => {
    async function loadProposal() {
      if (!id) return;
      try {
        const data = await getProposal(id);
        if (data) {
          if (!data.pageConfig) {
            data.pageConfig = [
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
          }
          setProposal(data);
        } else {
          toast.error("Protocol Error: Requested document not found in strategic archives.");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        toast.error("System Error: Failed to retrieve protocol from secure storage.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProposal();
  }, [id, setProposal, navigate]);

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
    if (!id) return;

    if (!proposal.client.proposalTitle?.trim()) {
      setValidationError("Pre-Flight Check Failed: Proposal Title is required.");
      return;
    }

    setValidationError(null);

    setIsSaving(true);
    
    const updatePromise = updateProposal(id, {
      ...proposal,
      client: {
        ...proposal.client,
        preparedBy: employeeProfile ? `${employeeProfile.fullName} (${employeeProfile.employeeId})` : (proposal.client.preparedBy || "Weblozy Labs")
      },
      creatorName: employeeProfile?.fullName || "Strategic Operator",
      creatorEmployeeId: employeeProfile?.employeeId || "UNKNOWN",
      updatedAt: Date.now()
    });

    toast.promise(updatePromise, {
      pending: 'Synchronizing Protocol Changes...',
      success: 'Strategic Protocol Updated Successfully! 🚀',
      error: 'Failed to update protocol. Please try again.'
    });

    try {
      await updatePromise;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0E14]">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white/40">Loading Protocol...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090C] transition-colors duration-500">
      <div className="flex h-screen overflow-hidden">
        {/* Modernized Input Panel with Glassmorphism */}
        <div className="w-full md:w-1/2 lg:w-[42%] xl:w-[40%] flex flex-col border-r border-slate-100 bg-white dark:bg-[#0B0E14] z-30 overflow-hidden relative shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-500">
           
           {/* High-End Header */}
           <div className="px-6 sm:px-10 py-6 sm:py-10 border-b border-slate-100/50 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 transition-colors duration-500">
              <div className="flex items-center gap-4 sm:gap-6">
                 <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-50 dark:bg-[#0B0E14] rounded-[0.8rem] sm:rounded-[1.25rem] flex items-center justify-center text-slate-900 dark:text-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 group">
                    <img src={logo} alt="W" className="w-6 h-6 sm:w-9 sm:h-9 object-contain dark:brightness-0 dark:invert transition-transform group-hover:scale-110" />
                 </div>
                 <div>
                    <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter text-[#0B0E14] dark:text-white transition-colors duration-500">Strategic <span className="text-primary italic">OS.</span></h1>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_#99CB48]" />
                       <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Tactical Editor V4.0</p>
                    </div>
                 </div>
              </div>
              <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center bg-slate-100/80 hover:bg-red-500 rounded-xl text-slate-400 hover:text-slate-900 dark:text-white transition-all duration-300 border border-transparent shadow-sm">
                 <X size={20} />
              </button>
           </div>

           {/* Advanced Step Navigation */}
           <div className="px-5 sm:px-10 py-3.5 sm:py-6 bg-slate-50 dark:bg-[#07090C] border-b border-slate-200 dark:border-white/10 flex gap-2.5 sm:gap-4 transition-colors duration-500 overflow-x-auto no-scrollbar scroll-smooth">
              {dynamicSteps.map((step, i) => {
                 const StepIcon = step.icon;
                 const isActive = currentStep === i;
                 return (
                    <button 
                       key={step.id} 
                       onClick={() => setCurrentStep(i)} 
                       className={`flex-shrink-0 flex items-center gap-2 sm:gap-3.5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 relative group ${
                          isActive 
                             ? "bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-white shadow-2xl shadow-black/20 scale-105" 
                             : "bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/10 text-slate-400 hover:border-primary/50 hover:text-slate-700 dark:hover:text-white transition-colors duration-500"
                       }`}
                    >
                       <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors duration-500 ${isActive ? "bg-primary text-slate-900 dark:text-white shadow-[0_0_15px_#99CB48]" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}`}>
                          <StepIcon size={12} />
                       </div>
                       <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{step.name}</span>
                       {isActive && (
                          <motion.div layoutId="activeStep" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_#99CB48]" />
                       )}
                    </button>
                 );
              })}
           </div>

           {/* Form Content Area */}
           <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-white dark:bg-[#07090C] transition-colors duration-500">
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

           {/* Premium Control Footer */}
           <div className="p-6 sm:p-10 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-2xl flex justify-between items-center sticky bottom-0 z-40 transition-colors duration-500">
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
                 className="h-12 sm:h-16 px-5 sm:px-10 rounded-xl sm:rounded-[1.25rem] border-slate-200 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] bg-white hover:bg-slate-100 dark:hover:bg-[#1C2128] text-slate-900 dark:text-white border-slate-200 dark:border-white/10 dark:bg-[#161B22] transition-all duration-500 disabled:opacity-20 shadow-sm"
              >
                 <ChevronLeft size={20} className="mr-1.5 sm:mr-3" />
                 <span className="hidden sm:inline">Back Sequence</span>
                 <span className="inline sm:hidden">Back</span>
              </Button>
              
              <div className="flex gap-2 sm:gap-4 items-center">
                 {currentStep < dynamicSteps.length - 1 ? (
                    <Button onClick={nextStep} className="h-12 sm:h-16 px-6 sm:px-12 rounded-xl sm:rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary hover:text-slate-900 dark:hover:text-slate-900 shadow-2xl shadow-slate-900/20 dark:shadow-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] group transition-all duration-500">
                       <span className="hidden sm:inline">Proceed</span>
                       <span className="inline sm:hidden">Next</span>
                       <ChevronRight size={20} className="text-[#99CB48] group-hover:text-slate-900 ml-1.5 sm:ml-3 group-hover:translate-x-2 transition-all" />
                    </Button>
                 ) : (
                    <Button onClick={handleSave} disabled={isSaving} className="h-12 sm:h-16 px-6 sm:px-12 rounded-xl sm:rounded-[1.25rem] bg-primary hover:bg-[#88B540] text-slate-900 dark:text-white shadow-2xl shadow-primary/30 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 scale-105 active:scale-95">
                       {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="mr-1.5 sm:mr-3" />}
                       <span className="hidden sm:inline">Finalize Protocol</span>
                       <span className="inline sm:hidden">Finalize</span>
                    </Button>
                 )}
              </div>
           </div>
        </div>

        {/* Cleaned Preview Panel (Dedicated Header & Soft Shadows) */}
        <div className="hidden md:flex flex-col flex-1 bg-slate-100 border-l border-slate-200 overflow-hidden h-full relative">
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
           <div className="flex-1 overflow-y-auto p-12 custom-scrollbar flex justify-center items-start bg-transparent bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="relative z-10 flex justify-center h-fit w-full">
                 <div className="pdf-preview-scale transition-all duration-500 h-fit w-full flex justify-center">
                    <ProposalPDF proposal={proposal} />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

  );
}
