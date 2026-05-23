import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, X, Loader2, Trash2, Sparkles, CheckCircle, Plus, Clipboard, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTokens } from "@/hooks/useTokens";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
import { Module } from "@/types/proposal";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea } from "./shared";

import { toast } from "react-toastify";

function generateRealisticFallbackFeatures(moduleName: string): string[] {
  const name = moduleName.toLowerCase();
  
  const securityFeatures = [
    "Enterprise-grade SSL/TLS Transport Layer Encryption",
    "Granular Role-Based Access Control (RBAC) & Permission Policy",
    "Multi-factor Authentication (MFA) Integration Gateway",
    "Real-time IP Whitelisting & Threat Detection Shield",
    "Data Exfiltration Prevention & Masking Engine",
    "Comprehensive System Audit Trails & Logging Hub"
  ];
  
  const analyticsFeatures = [
    "Real-time KPI Monitoring & Interactive Widgets",
    "Custom Reporting Engine with Multi-format Data Export",
    "Automated Performance Index Calculation Analytics",
    "Historical Trend Analysis & Anomaly Detection",
    "Predictive Forecasting using Dynamic Data Modeling",
    "Configurable Alerts & Escalation Trigger System"
  ];

  const integrationFeatures = [
    "Universal REST API Gateway & Webhook Router",
    "Automated Background Sync & Database Connector",
    "JSON/CSV Bulk Import-Export Schema Parser",
    "Legacy System Adapter with Legacy Middleware",
    "Scalable Cloud Sync & Microservices Router",
    "Asynchronous Task Queue & Queue Optimizer"
  ];

  if (name.includes("lead") || name.includes("crm") || name.includes("sales") || name.includes("customer")) {
    const leadSpecific = [
      "Automated Lead Capture & Validation Protocol",
      "Dynamic Lead Scoring & Predictive Weight Engine",
      "Intelligent Rep Allocation & Round-Robin Routing",
      "Interactive Sales Pipeline Visual Kanban Canvas",
      "Omnichannel Touchpoint Timeline & Activity Tracker",
      "Automated Email & Follow-up Scheduler Suite",
      "Smart Campaign Attribution & Source Analyzer",
      "Customer Profile Deduplication & Cleansing Hub",
      "Dynamic Proposal & Contract Document Builder",
      "Automated SLA Expiration Warn & Alarm Trigger"
    ];
    return [...leadSpecific, ...securityFeatures.slice(0, 5), ...analyticsFeatures.slice(0, 4)];
  }
  
  if (name.includes("billing") || name.includes("payment") || name.includes("finance") || name.includes("invoice")) {
    const billingSpecific = [
      "Automated Recurring Subscription Invoice Engine",
      "Multi-currency Settlement & Dynamic Rates Sync",
      "Automated Tax (GST/VAT) Calculation & Compliance",
      "Smart Dunning Management & Auto-retry Logic Engine",
      "Customer Self-service Billing portal Gateway",
      "Revenue Recognition Scheduler & Account Ledger",
      "Payment Gateway Router & Failover Redirection",
      "Fraud Detection Scanner & Chargeback Guard",
      "Dynamic Discount & Promo Code Validation API",
      "Automated Balance Sheet Reconciliation Report"
    ];
    return [...billingSpecific, ...securityFeatures.slice(0, 5), ...analyticsFeatures.slice(0, 4)];
  }

  if (name.includes("logistic") || name.includes("delivery") || name.includes("inventory") || name.includes("supply")) {
    const logisticsSpecific = [
      "Real-time Stock Inventory Optimization Tracker",
      "Multi-warehouse Stock Allocation & Transfer Hub",
      "Automated Purchase Order Dispatch Protocol",
      "Smart Route Optimization & GPS Dispatch Mapping",
      "Courier Gateway API Integration & Sync Engine",
      "Barcode & RFID Tag Scanning Support System",
      "Warehouse Location & Rack Layout Mapping Suite",
      "Automated RMA & Reverse Logistics Workflow",
      "Demand Forecasting & Low-stock Alerts Hub",
      "Driver Allocation & Fleet Tracking Dashboard"
    ];
    return [...logisticsSpecific, ...securityFeatures.slice(0, 5), ...integrationFeatures.slice(0, 4)];
  }

  if (name.includes("audit") || name.includes("inspect") || name.includes("quality") || name.includes("compliance")) {
    const auditSpecific = [
      "Dynamic Audit Template Builder & Schema Config",
      "Mobile-offline Audit Capture & Sync Handler",
      "Automated Corrective Action Request (CAR) Tracker",
      "Multi-layer Compliance Checklist Verification",
      "Signature Capture & Secure Verification Lock",
      "Automated Non-compliance Risk Score Engine",
      "Regulatory Standard Mapping (ISO, HIPAA, GDPR)",
      "Dynamic Corrective Action Workflow Trigger",
      "Photo Upload with Metadata and GPS Coordinates",
      "Interactive Incident Report Submission Portal"
    ];
    return [...auditSpecific, ...securityFeatures.slice(0, 5), ...analyticsFeatures.slice(0, 4)];
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const capName = moduleName.split(" ").map(capitalize).join(" ");
  const customSpecific = [
    `Advanced ${capName} Management Core Controller`,
    `Real-time ${capName} Operational Workflow Sync`,
    `Automated ${capName} Performance Rating Engine`,
    `Dynamic ${capName} Node Connection Framework`,
    `Integrated ${capName} Resource Planner Module`,
    `${capName} Data Visualization Chart Widget`,
    `Asynchronous ${capName} Query Cache Optimizer`,
    `Granular Audit Trail for ${capName} Transactions`,
    `Dynamic Field Layout for ${capName} Input Forms`,
    `Custom Automation Rules Engine for ${capName}`
  ];
  return [...customSpecific, ...securityFeatures.slice(0, 5), ...integrationFeatures.slice(0, 4)];
}

function generateRealisticBulkFallback(context: string): any[] {
  const candidates = context
    .split(/[\n,;•]+/)
    .map(c => c.trim())
    .filter(c => c.length > 5 && c.length < 50);

  const moduleNames = candidates.length > 0 ? candidates.slice(0, 3) : ["Operational Core System", "Security Protocol Engine", "Data Sync Hub"];

  return moduleNames.map(name => ({
    name: name,
    description: `Automated management suite for ${name}`,
    features: generateRealisticFallbackFeatures(name)
  }));
}

export default function SolutionModulesPanel({ proposal, currentStep, updateSolution }: InputPanelProps) {
  const [singleModuleName, setSingleModuleName] = useState("");
  const [bulkContext, setBulkContext] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewModule, setPreviewModule] = useState<Module | null>(null);
  const [selectedPreviewFeatures, setSelectedPreviewFeatures] = useState<Record<string, boolean>>({});
  
  const [previewBulkModules, setPreviewBulkModules] = useState<Module[] | null>(null);
  const [selectedBulkModules, setSelectedBulkModules] = useState<Record<string, boolean>>({});
  const [selectedBulkFeatures, setSelectedBulkFeatures] = useState<Record<string, Record<string, boolean>>>({});
  const [activeBulkImportMIdx, setActiveBulkImportMIdx] = useState<number | null>(null);
  const [bulkImportText, setBulkImportText] = useState("");
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  const { consumeTokens } = useTokens();

  const handleAddSingleModule = async () => {
    if (!singleModuleName) return;
    setIsAiLoading(true);
    try {
      const { features, tokens, isFallback } = await generateModuleFeatures(singleModuleName);
      consumeTokens(tokens, isFallback);
      
      if (isFallback) {
        setShowQuotaModal(true);
        toast.info("Gemini API Quota Exceeded (429)! Please use manual mode.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Initialize selection state: all checked by default
      const initialSelected: Record<string, boolean> = {};
      features.forEach((f: string) => {
        initialSelected[f] = true;
      });
      setSelectedPreviewFeatures(initialSelected);

      const newModule: Module = {
        id: Math.random().toString(36).substr(2, 9),
        name: singleModuleName,
        features: features.map((f: string) => ({ name: f, price: "" })),
        price: "", // pricing is optional, default to empty string
        isCustom: true
      };
      setPreviewModule(newModule);
    } catch (error) {
      console.error("AI Feature generation failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmPreviewModule = () => {
    if (!previewModule) return;
    
    // Filter features that are selected/checked
    const finalFeatures = previewModule.features.filter(f => {
      const fName = typeof f === "string" ? f : f.name;
      return selectedPreviewFeatures[fName];
    });
    
    const moduleToIntegrate: Module = {
      ...previewModule,
      features: finalFeatures
    };

    updateSolution({ selectedModules: [...proposal.solution.selectedModules, moduleToIntegrate] });
    setPreviewModule(null);
    setSelectedPreviewFeatures({});
    setSingleModuleName("");
  };

  const handleBulkExtract = async () => {
    if (!bulkContext) return;
    setIsAiLoading(true);
    try {
      const { modules: extracted, tokens, isFallback } = await extractModulesFromContext(bulkContext);
      consumeTokens(tokens, isFallback);
      
      if (isFallback) {
        setShowQuotaModal(true);
        toast.info("Gemini API Quota Exceeded (429)! Please use manual mode.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      const parsedModules = extracted.map((m: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: m.name,
        description: m.description || "",
        features: m.features.map((f: string) => ({ name: f, price: "" })),
        price: "", // pricing is optional, default to empty string
        isCustom: true
      }));

      // Initialize preview selections
      const initialModulesSelected: Record<string, boolean> = {};
      const initialFeaturesSelected: Record<string, Record<string, boolean>> = {};

      parsedModules.forEach((m: Module) => {
        initialModulesSelected[m.id] = true;
        initialFeaturesSelected[m.id] = {};
        m.features.forEach((f: any) => {
          initialFeaturesSelected[m.id][f.name] = true;
        });
      });

      setSelectedBulkModules(initialModulesSelected);
      setSelectedBulkFeatures(initialFeaturesSelected);
      setPreviewBulkModules(parsedModules);
    } catch (error) {
      console.error("AI Bulk extraction failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const confirmBulkPreviewModules = () => {
    if (!previewBulkModules) return;

    const integrated: Module[] = [];
    previewBulkModules.forEach((m) => {
      // If the module itself is checked
      if (selectedBulkModules[m.id]) {
        // Filter checked features of this module
        const finalFeatures = m.features.filter(f => {
          const fName = typeof f === "string" ? f : f.name;
          return selectedBulkFeatures[m.id]?.[fName];
        });
        integrated.push({
          ...m,
          features: finalFeatures
        });
      }
    });

    if (integrated.length > 0) {
      updateSolution({ selectedModules: [...proposal.solution.selectedModules, ...integrated] });
    }
    setPreviewBulkModules(null);
    setSelectedBulkModules({});
    setSelectedBulkFeatures({});
    setBulkContext("");
  };

  const handleAddManualModule = () => {
    const newModule: Module = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Strategic Module",
      features: [],
      price: "",
      isCustom: true
    };
    updateSolution({ selectedModules: [...proposal.solution.selectedModules, newModule] });
  };

  return (
    <div className="space-y-8 pb-10">
      <TokenAnalyticsBar />
      <SectionHeader 
        title="Functional Blueprint" 
        subtitle="Engineer the core system modules via Neural AI or precision manual definition" 
        stepNumber={currentStep + 1} 
      />
      
      {/* AI Generator - Premium Glassmorphism Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-primary/5 via-primary/[0.08] to-primary/10 rounded-2xl border border-primary/20 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(153,203,72,0.3)] shrink-0">
             <Sparkles size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B0E14]/80">Neural Module Protocol</span>
        </div>
        <div className="flex gap-3">
          <ModernInput 
            className="flex-1 h-11 px-3.5 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl" 
            placeholder="System Domain (e.g. Smart Logistics Engine)" 
            value={singleModuleName}
            onChange={(e) => setSingleModuleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
          />
          <Button 
            onClick={handleAddSingleModule} 
            disabled={isAiLoading} 
            className="h-11 bg-slate-50 dark:bg-[#0B0E14] hover:bg-black text-slate-900 dark:text-white rounded-xl px-5 text-xs font-bold tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 shrink-0"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : "Generate"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {previewModule && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-primary/30 shadow-xl space-y-5"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: AI Synthesized</div>
                  <h4 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-tighter">{previewModule.name}</h4>
                  <p className="text-slate-900 dark:text-white/40 text-[9px] uppercase tracking-wider">Uncheck the features you do not want to include</p>
               </div>
               <button onClick={() => setPreviewModule(null)} className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-900 dark:text-white/40 hover:text-slate-900 dark:text-white transition-colors border border-slate-200 dark:border-white/5"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
               {previewModule.features.map((f: any, i: number) => {
                  const fName = typeof f === "string" ? f : f.name;
                  const isChecked = !!selectedPreviewFeatures[fName];
                  return (
                     <div 
                        key={i} 
                        onClick={() => setSelectedPreviewFeatures(prev => ({ ...prev, [fName]: !prev[fName] }))}
                        className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${
                          isChecked 
                            ? "bg-primary/10 border-primary/40 hover:bg-primary/15" 
                            : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-40 hover:bg-white dark:bg-white/5/[0.08] hover:opacity-60"
                        }`}
                     >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-white/20 bg-transparent text-transparent"
                        }`}>
                           {isChecked && <CheckCircle size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest leading-none truncate">{fName}</span>
                     </div>
                  );
               })}
            </div>
            <div className="pt-2">
              <Button onClick={confirmPreviewModule} className="w-full h-11 bg-primary hover:bg-primary/90 text-[#0B0E14] font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_12px_24px_rgba(153,203,72,0.2)] transition-all hover:scale-101 active:scale-99">
                Integrate Selected Features
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewBulkModules && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0B0E14] rounded-2xl border border-primary/30 shadow-xl space-y-6"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: Bulk AI Synthesized Modules</div>
                  <p className="text-slate-900 dark:text-white/60 text-xs">Toggle the modules and individual features you want to import below:</p>
               </div>
               <button onClick={() => setPreviewBulkModules(null)} className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-900 dark:text-white/40 hover:text-slate-900 dark:text-white transition-colors border border-slate-200 dark:border-white/5"><X size={16} /></button>
            </div>

            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {previewBulkModules.map((module) => {
                const isModuleChecked = !!selectedBulkModules[module.id];
                return (
                  <div key={module.id} className="border border-slate-300 dark:border-white/10 rounded-xl p-4 space-y-3 bg-white dark:bg-white/5/[0.02]">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <div 
                        onClick={() => setSelectedBulkModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isModuleChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-white/20 bg-transparent text-transparent"
                        }`}>
                          {isModuleChecked && <CheckCircle size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-wider">{module.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-900 dark:text-white/30 uppercase tracking-widest">Module</span>
                    </div>

                    {isModuleChecked && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                        {module.features.map((f: any, i: number) => {
                          const fName = typeof f === "string" ? f : f.name;
                          const isFeatureChecked = !!selectedBulkFeatures[module.id]?.[fName];
                          return (
                            <div 
                              key={i} 
                              onClick={() => setSelectedBulkFeatures(prev => {
                                const nextFeatures = { ...prev[module.id] };
                                nextFeatures[fName] = !nextFeatures[fName];
                                return { ...prev, [module.id]: nextFeatures };
                              })}
                              className={`flex items-center gap-3 border p-2 rounded-lg cursor-pointer transition-all ${
                                isFeatureChecked 
                                  ? "bg-primary/10 border-primary/40 hover:bg-primary/15" 
                                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-40 hover:bg-white dark:bg-white/5/[0.08] hover:opacity-60"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isFeatureChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-white/20 bg-transparent text-transparent"
                              }`}>
                                {isFeatureChecked && <CheckCircle size={10} strokeWidth={3} />}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-900 dark:text-white/80 uppercase tracking-wider truncate">{fName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Button onClick={confirmBulkPreviewModules} className="w-full h-11 bg-primary hover:bg-primary/90 text-[#0B0E14] font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_12px_24px_rgba(153,203,72,0.2)] transition-all hover:scale-101 active:scale-99">
                Integrate Selected Modules
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Extraction Panel */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
           <Wand2 size={14} className="shrink-0" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em]">Bulk Tactical Extraction</span>
        </div>
        <ModernTextArea 
          className="min-h-[100px] p-3.5 text-xs font-medium text-slate-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:bg-white dark:bg-white/5" 
          placeholder="Paste entire system requirements or legacy audit notes here for neural parsing..." 
          value={bulkContext} 
          onChange={(e) => setBulkContext(e.target.value)} 
        />
        <Button 
          onClick={handleBulkExtract} 
          disabled={isAiLoading || !bulkContext} 
          className="w-full h-11 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#0B0E14] hover:bg-slate-50 dark:bg-[#0B0E14] hover:text-slate-900 dark:text-white rounded-xl text-xs font-bold tracking-wider transition-all shadow-sm"
        >
          Extract All Protocol Nodes
        </Button>
      </div>

      {/* Active Module List */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-1" id="manual-node-section">
          <div className="space-y-0.5">
             <LabelPremium className="mb-0 text-slate-800 text-[10px]">Blueprint Registry</LabelPremium>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Active operational modules</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => {
                const futureModule: Module = {
                  id: Math.random().toString(36).substr(2, 9),
                  name: "Future Scalability",
                  features: [],
                  price: "",
                  isCustom: true,
                  isFutureScalability: true
                };
                updateSolution({ selectedModules: [...proposal.solution.selectedModules, futureModule] });
              }}
              className="h-9 rounded-xl px-4 bg-[#1AA6E1]/10 text-[#1AA6E1] hover:bg-[#1AA6E1]/20 border border-[#1AA6E1]/30 text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
            >
              + Future Scalability
            </Button>
            <Button 
              onClick={handleAddManualModule} 
              variant="outline" 
              className="h-9 rounded-xl px-4 border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 dark:bg-white/5 transition-all bg-white dark:bg-white/5"
            >
              + Add Manual Node
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {proposal.solution.selectedModules.map((module: Module, mIdx: number) => (
            <Card key={module.id} className="border-slate-100 dark:border-white/5 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group bg-white dark:bg-white/5">
              {/* Card Header (Sleek and Packed) */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 group-hover:bg-white dark:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#0B0E14] flex items-center justify-center text-slate-900 dark:text-white font-black italic shadow-sm rotate-3 group-hover:rotate-0 transition-all duration-500 shrink-0 text-xs">
                      M{mIdx + 1}
                   </div>
                   <input 
                      type="text" 
                      className="flex-1 bg-transparent border-none text-base font-black uppercase tracking-tighter text-[#0B0E14] h-auto p-0 focus:outline-none focus:ring-0 min-w-0" 
                      value={module.name} 
                      onChange={(e) => {
                         const next = [...proposal.solution.selectedModules];
                         next[mIdx].name = e.target.value;
                         updateSolution({ selectedModules: next });
                      }} 
                   />
                </div>
                
                {/* Module Price Field */}
                <div className="flex items-center gap-2 shrink-0">
                   <div className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Est. Price:</div>
                   <div className="relative w-28">
                      <input 
                         type="text" 
                         placeholder="e.g. 25,000" 
                         className="w-full h-8 pl-5 pr-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-[#0B0E14] focus:outline-none focus:border-primary/50 text-right"
                         value={module.price || ""} 
                         onChange={(e) => {
                            const next = [...proposal.solution.selectedModules];
                            next[mIdx].price = e.target.value;
                            updateSolution({ selectedModules: next });
                         }} 
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[9px]">₹</span>
                   </div>
                </div>

                <button 
                  onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_: Module, i: number) => i !== mIdx) })} 
                  className="p-1.5 bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Card Content (Sleek Features Grid) */}
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {module.features.map((feature: any, fIdx: number) => (
                    <div 
                      key={fIdx} 
                      className="flex items-center gap-2 group/item relative bg-slate-50 dark:bg-white/5 hover:bg-slate-50 dark:bg-white/5 p-2 border border-slate-100 dark:border-white/5 rounded-xl transition-all duration-300 w-full min-w-0 shadow-sm hover:shadow"
                    >
                       <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_#99CB48]" />
                       
                       {/* Feature Name Input */}
                       <input 
                          type="text"
                          className="flex-1 bg-transparent border-none text-xs font-semibold text-slate-600 dark:text-gray-400 focus:outline-none focus:ring-0 min-w-0 p-0" 
                          value={typeof feature === 'string' ? feature : feature.name} 
                          onChange={(e) => {
                             const next = [...proposal.solution.selectedModules];
                             const currentPrice = typeof feature === 'string' ? "" : (feature.price || "");
                             next[mIdx].features[fIdx] = { name: e.target.value, price: currentPrice };
                             updateSolution({ selectedModules: next });
                          }} 
                       />
                       
                       {/* Feature Price Input */}
                       <div className="relative w-16 shrink-0">
                          <input 
                             type="text" 
                             placeholder="Price" 
                             className="w-full h-6 pl-3.5 pr-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-[9px] font-bold text-slate-700 dark:text-gray-300 focus:outline-none focus:border-primary/40 text-right p-0"
                             value={typeof feature === 'string' ? "" : (feature.price || "")} 
                             onChange={(e) => {
                                const next = [...proposal.solution.selectedModules];
                                const currentName = typeof feature === 'string' ? feature : feature.name;
                                next[mIdx].features[fIdx] = { name: currentName, price: e.target.value };
                                updateSolution({ selectedModules: next });
                             }} 
                          />
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[7px]">₹</span>
                       </div>

                       <button 
                         onClick={() => {
                           const next = [...proposal.solution.selectedModules];
                           next[mIdx].features = next[mIdx].features.filter((_: any, i: number) => i !== fIdx);
                           updateSolution({ selectedModules: next });
                         }} 
                         className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-all shrink-0"
                       >
                         <X size={12} />
                       </button>
                    </div>
                  ))}
                </div>
                
                {/* Add Feature Buttons */}
                {activeBulkImportMIdx === mIdx ? (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">Paste ChatGPT / Gemini Features</span>
                      <button 
                        onClick={() => {
                          setActiveBulkImportMIdx(null);
                          setBulkImportText("");
                        }} 
                        className="text-[8px] font-bold text-rose-500 hover:text-rose-700 uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      className="w-full p-2.5 text-xs font-semibold text-slate-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-primary/50 placeholder:text-slate-400 placeholder:font-normal"
                      placeholder="Paste pointers here (e.g.)&#10;- Advanced Lead Management Dashboard&#10;- Real-time pipeline status sync&#10;- Custom notification triggers"
                      value={bulkImportText}
                      onChange={(e) => setBulkImportText(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!bulkImportText.trim()) return;
                        const lines = bulkImportText.split('\n');
                        const parsedFeatures: { name: string, price: string }[] = [];
                        
                        lines.forEach(line => {
                          let cleaned = line.trim();
                          if (!cleaned) return;
                          
                          // Clean list markers: -, *, •, ●, ■, 1., 2)
                          cleaned = cleaned.replace(/^[\s\-*•●■○]+/, ""); // bullet markers
                          cleaned = cleaned.replace(/^\d+[\.\)]\s*/, ""); // numbered markers
                          cleaned = cleaned.trim();
                          
                          if (cleaned) {
                            parsedFeatures.push({ name: cleaned, price: "" });
                          }
                        });
                        
                        if (parsedFeatures.length > 0) {
                          const next = [...proposal.solution.selectedModules];
                          next[mIdx].features = [...next[mIdx].features, ...parsedFeatures];
                          updateSolution({ selectedModules: next });
                        }
                        
                        setActiveBulkImportMIdx(null);
                        setBulkImportText("");
                      }}
                      className="w-full h-8 bg-slate-50 dark:bg-[#0B0E14] hover:bg-black text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                    >
                      Parse & Import Features
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => {
                        const next = [...proposal.solution.selectedModules];
                        next[mIdx].features.push({ name: "New Feature Protocol", price: "" });
                        updateSolution({ selectedModules: next });
                      }} 
                      className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-primary hover:text-primary/80 transition-all pl-3 border-l border-slate-200 dark:border-white/10 py-0.5"
                    >
                       <Plus size={10} /> Add Feature
                    </button>
                    
                    <button 
                      onClick={() => {
                        setActiveBulkImportMIdx(mIdx);
                        setBulkImportText("");
                      }} 
                      className="flex items-center gap-1.5 text-[8px] font-bold uppercase text-indigo-500 hover:text-indigo-750 transition-all pl-3 border-l border-slate-200 dark:border-white/10 py-0.5"
                    >
                       <Clipboard size={10} /> Paste Bulk Features
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quota Exhausted Modal Dialog */}
      <AnimatePresence>
        {showQuotaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-50 dark:bg-[#0B0E14] border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5"
            >
              {/* background red glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] -mr-16 -mt-16" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-500/70">API LIMIT REACHED</div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Quota Exhausted (429)</h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-semibold text-slate-900 dark:text-white/70 leading-relaxed">
                <p>
                  Your free-tier Gemini API credits are currently exhausted (Quota Limit Reached).
                </p>
                <p>
                  To proceed, please utilize the **Manual Mode** options (+ Add Manual Node / Paste Bulk Features) to customize your system architecture.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowQuotaModal(false);
                    // Automatically scroll to manual node button
                    const element = document.getElementById("manual-node-section");
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 h-11 bg-rose-500 hover:bg-rose-600 text-[#0B0E14] font-black uppercase tracking-[0.15em] text-[10px] rounded-xl shadow-[0_12px_24px_rgba(244,63,94,0.2)] transition-all active:scale-98"
                >
                  Use Manual Mode
                </button>
                <button
                  onClick={() => setShowQuotaModal(false)}
                  className="px-5 h-11 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white/80 font-black uppercase tracking-[0.15em] text-[10px] rounded-xl transition-all border border-slate-200 dark:border-white/5"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
