import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, X, Loader2, Trash2, Sparkles, CheckCircle, Plus, Clipboard, ShieldAlert, ClipboardList, Zap, Layers, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTokens } from "@/hooks/useTokens";
import TokenAnalyticsBar from "@/components/Proposal/TokenAnalyticsBar";
import { generateModuleFeatures, extractModulesFromContext } from "@/lib/gemini";
import { Module } from "@/types/proposal";
import { InputPanelProps, LabelPremium, SectionHeader, ModernInput, ModernTextArea, InputGroupCard } from "./shared";

import { toast } from "react-toastify";

export interface ParsedBulkModule {
  name: string;
  price?: string;
  features: { name: string; price?: string }[];
}

export function parseBulkModulesText(text: string): ParsedBulkModule[] {
  if (!text || !text.trim()) return [];

  const rawLines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const result: ParsedBulkModule[] = [];
  let currentModule: ParsedBulkModule | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check if line starts with a bullet point or list marker
    const isBulletLine = /^[•\-*+▪■●○]/.test(line) || /^\d+[\.\)]\s+/.test(line);

    // Strip bullet symbol/prefix
    let cleaned = line
      .replace(/^[•\-*+▪■●○\s]+/, "")
      .replace(/^(module|feature|sub-module)\s*\d*[\:\-]\s*/i, "")
      .trim();

    if (!cleaned) continue;

    // Check lookahead: is next line a bullet point?
    const nextLine = rawLines[i + 1] || "";
    const nextIsBullet = /^[•\-*+▪■●○]/.test(nextLine) || /^\d+[\.\)]\s+/.test(nextLine);

    // Header criteria:
    const isHeaderWord = /^(module|system|node|architecture|phase|section)\s*\d*[\:\s\-]/i.test(line) || line.endsWith(":");
    const isNumberedModule = /^(module\s*)?\d+[\.\)]\s+[A-Z0-9]/i.test(line);
    
    const isHeader = isHeaderWord || isNumberedModule || (!isBulletLine && nextIsBullet) || (currentModule === null && !isBulletLine);

    if (isHeader && cleaned.length > 1) {
      let moduleName = cleaned.replace(/[\:\-]+$/, "").trim();
      moduleName = moduleName.replace(/^(module\s*\d*[\:\-]\s*|\d+[\.\)]\s*)/i, "").trim();

      let price = "";
      const priceMatch = moduleName.match(/[\(\[\{]?(?:price|est|cost)?\s*[\:\=]?\s*₹?\s*([\d,]+k?)\s*[\)\]\}]?$/i);
      if (priceMatch && priceMatch[1]) {
        price = priceMatch[1];
        moduleName = moduleName.replace(priceMatch[0], "").trim();
      }

      currentModule = {
        name: moduleName || cleaned,
        price: price,
        features: []
      };
      result.push(currentModule);
    } else {
      if (!currentModule) {
        currentModule = {
          name: "Core System Module",
          price: "",
          features: []
        };
        result.push(currentModule);
      }

      let featureName = cleaned.replace(/^\d+[\.\)]\s*/, "").trim();
      let featurePrice = "";
      const fPriceMatch = featureName.match(/[\(\[\{]?\s*₹?\s*([\d,]+)\s*[\)\]\}]?$/i);
      if (fPriceMatch && fPriceMatch[1] && featureName.includes("₹")) {
        featurePrice = fPriceMatch[1];
        featureName = featureName.replace(fPriceMatch[0], "").trim();
      }

      currentModule.features.push({
        name: featureName,
        price: featurePrice
      });
    }
  }

  return result.filter(m => m.name && (m.features.length > 0 || m.price));
}

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

  const [smartBulkText, setSmartBulkText] = useState("");
  const [parsedSmartModules, setParsedSmartModules] = useState<ParsedBulkModule[]>([]);

  const { consumeTokens } = useTokens();

  const handleApplySmartBulkModules = (asFutureScalability: boolean = false) => {
    if (parsedSmartModules.length === 0) return;

    const newModules: Module[] = parsedSmartModules.map(m => ({
      id: Math.random().toString(36).substr(2, 9),
      name: m.name,
      price: m.price || "",
      features: m.features.map(f => ({ name: f.name, price: f.price || "" })),
      isCustom: true,
      isFutureScalability: asFutureScalability
    }));

    updateSolution({ selectedModules: [...proposal.solution.selectedModules, ...newModules] });

    const moduleTypeLabel = asFutureScalability ? "Future Scalability Modules" : "Core Modules";
    toast.success(`✨ Created & placed ${newModules.length} ${moduleTypeLabel} on the proposal page!`);
    setSmartBulkText("");
    setParsedSmartModules([]);

    const element = document.getElementById("manual-node-section");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
  };  const colors = ["blue", "purple", "emerald", "orange", "rose", "indigo", "pink"];
  const borderColors: Record<string, string> = {
    blue: "border-l-blue-500 hover:border-blue-500/25",
    purple: "border-l-purple-500 hover:border-purple-500/25",
    emerald: "border-l-emerald-500 hover:border-emerald-500/25",
    orange: "border-l-orange-500 hover:border-orange-500/25",
    rose: "border-l-rose-500 hover:border-rose-500/25",
    indigo: "border-l-indigo-500 hover:border-indigo-500/25",
    pink: "border-l-pink-500 hover:border-pink-500/25"
  };
  const badgeColors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
    purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-500",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
    orange: "bg-orange-50 dark:bg-orange-500/10 text-orange-500",
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-500",
    indigo: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500",
    pink: "bg-pink-50 dark:bg-pink-500/10 text-pink-500"
  };
  const dotColors: Record<string, string> = {
    blue: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    purple: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    emerald: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    orange: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]",
    rose: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
    indigo: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]",
    pink: "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"
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
      <InputGroupCard
        icon={<Sparkles className="w-[18px] h-[18px]" />}
        title="Neural Module Protocol"
        description="Synthesize system domain features using AI"
        accentColor="primary"
      >
        <div className="flex gap-3 mt-2">
          <ModernInput 
            className="flex-1 h-11 px-3.5 text-xs font-semibold bg-white dark:bg-[#131722] border-slate-200 dark:border-white/10 rounded-xl" 
            placeholder="System Domain (e.g. Smart Logistics Engine)" 
            value={singleModuleName}
            onChange={(e) => setSingleModuleName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSingleModule()}
          />
          <Button 
            onClick={handleAddSingleModule} 
            disabled={isAiLoading} 
            className="h-11 bg-slate-100 dark:bg-slate-800 hover:bg-[#99CB48] dark:hover:bg-[#99CB48] text-slate-800 dark:text-white hover:text-[#0B0E14] dark:hover:text-[#0B0E14] rounded-xl px-5 text-xs font-bold tracking-wider shadow-sm transition-all hover:scale-102 active:scale-98 shrink-0 border border-slate-200 dark:border-white/5"
          >
            {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : "Generate"}
          </Button>
        </div>
      </InputGroupCard>

      <AnimatePresence>
        {previewModule && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="p-5 sm:p-6 bg-white dark:bg-[#0B0E14] rounded-2xl border border-primary/30 shadow-xl space-y-5"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: AI Synthesized</div>
                  <h4 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-tighter">{previewModule.name}</h4>
                  <p className="text-slate-500 dark:text-white/40 text-[9px] uppercase tracking-wider">Uncheck the features you do not want to include</p>
               </div>
               <button onClick={() => setPreviewModule(null)} className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-905 dark:text-white/40 hover:text-slate-900 dark:text-white transition-colors border border-slate-200 dark:border-white/5"><X size={16} /></button>
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
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-70 hover:bg-white dark:bg-white/5/[0.08] hover:opacity-100"
                        }`}
                     >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-slate-300 dark:border-white/20 bg-transparent text-transparent"
                        }`}>
                           {isChecked && <CheckCircle size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-white uppercase tracking-widest leading-relaxed break-words py-1 flex-1">{fName}</span>
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
            className="p-5 sm:p-6 bg-white dark:bg-[#0B0E14] rounded-2xl border border-primary/30 shadow-xl space-y-6"
          >
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">Preview Node: Bulk AI Synthesized Modules</div>
                  <p className="text-slate-600 dark:text-white/60 text-xs">Toggle the modules and individual features you want to import below:</p>
               </div>
               <button onClick={() => setPreviewBulkModules(null)} className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-905 dark:text-white/40 hover:text-slate-900 dark:text-white transition-colors border border-slate-200 dark:border-white/5"><X size={16} /></button>
            </div>

            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {previewBulkModules.map((module) => {
                const isModuleChecked = !!selectedBulkModules[module.id];
                return (
                  <div key={module.id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-slate-50 dark:bg-white/5/[0.02]">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                      <div 
                        onClick={() => setSelectedBulkModules(prev => ({ ...prev, [module.id]: !prev[module.id] }))}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          isModuleChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-slate-350 dark:border-white/20 bg-transparent text-transparent"
                        }`}>
                          {isModuleChecked && <CheckCircle size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-black uppercase text-slate-805 dark:text-white tracking-wider">{module.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Module</span>
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
                                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-70 hover:bg-white dark:bg-white/5/[0.08] hover:opacity-100"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isFeatureChecked ? "bg-primary border-primary text-[#0B0E14]" : "border-slate-300 dark:border-white/20 bg-transparent text-transparent"
                              }`}>
                                {isFeatureChecked && <CheckCircle size={10} strokeWidth={3} />}
                              </div>
                              <span className="text-[10px] font-semibold text-slate-700 dark:text-white/80 uppercase tracking-wider leading-relaxed break-words py-1 flex-1">{fName}</span>
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
      <InputGroupCard
        icon={<Wand2 className="w-[18px] h-[18px]" />}
        title="Bulk Tactical Extraction"
        description="Extract multiple modules and features from raw requirements text"
        accentColor="orange"
      >
        <ModernTextArea 
          className="min-h-[100px] p-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131722] border border-slate-200 dark:border-white/10 rounded-xl focus:bg-white dark:bg-[#181e29]" 
          placeholder="Paste entire system requirements or legacy audit notes here for neural parsing..." 
          value={bulkContext} 
          onChange={(e) => setBulkContext(e.target.value)} 
        />
        <Button 
          onClick={handleBulkExtract} 
          disabled={isAiLoading || !bulkContext} 
          className="w-full h-11 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-[#99CB48] dark:hover:bg-[#99CB48] hover:text-[#0B0E14] dark:hover:text-[#0B0E14] rounded-xl text-xs font-bold tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : "Extract All Protocol Nodes"}
        </Button>
      </InputGroupCard>

      {/* Smart Bulk Import Card */}
      <InputGroupCard
        icon={<ClipboardList className="w-[18px] h-[18px]" />}
        title="Smart Paste: Modules & Features"
        description="Modules aur unke sare features ko ek sath text box me paste karein — system automatically parse karke page par add kar dega"
        accentColor="emerald"
      >
        <div className="space-y-4">
          <ModernTextArea 
            className="min-h-[140px] p-4 text-xs font-mono text-slate-800 dark:text-slate-100 bg-white dark:bg-[#131722] border border-slate-200 dark:border-white/10 rounded-xl focus:border-primary/50 placeholder:font-sans placeholder:text-slate-400 leading-relaxed" 
            placeholder={`Yaha Modules aur unke Features paste karein, jaise:\n\nModule 1: Lead & CRM System (₹25,000)\n- Automated lead capture\n- Dynamic lead scoring\n- Sales pipeline Kanban view\n\nModule 2: Billing & Invoice Suite (₹35,000)\n- Recurring subscription engine\n- Multi-currency GST settlement\n- Customer self-service portal`} 
            value={smartBulkText} 
            onChange={(e) => {
              const val = e.target.value;
              setSmartBulkText(val);
              const parsed = parseBulkModulesText(val);
              setParsedSmartModules(parsed);
            }} 
          />

          {/* Real-time Detection Badge */}
          {parsedSmartModules.length > 0 && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                    Detected: {parsedSmartModules.length} Modules & {parsedSmartModules.reduce((acc, m) => acc + m.features.length, 0)} Features
                  </span>
                </div>
                <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  Auto-Parsed Ready
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {parsedSmartModules.map((m, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white dark:bg-[#0B0E14] border border-emerald-200 dark:border-emerald-500/20 text-slate-800 dark:text-slate-200 rounded-lg text-[9.5px] font-bold shadow-sm">
                    {m.name} <span className="text-emerald-500">({m.features.length} features)</span> {m.price ? `· ₹${m.price}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button 
              onClick={() => handleApplySmartBulkModules(false)} 
              disabled={!smartBulkText.trim() || parsedSmartModules.length === 0} 
              className="h-12 bg-[#99CB48] hover:bg-[#88B540] text-[#0B0E14] font-black uppercase tracking-[0.12em] text-[10.5px] rounded-xl shadow-lg shadow-[#99CB48]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Zap size={15} />
              {parsedSmartModules.length > 0 
                ? `Add ${parsedSmartModules.length} Core Modules` 
                : "Add as Core Modules"}
            </Button>

            <Button 
              onClick={() => handleApplySmartBulkModules(true)} 
              disabled={!smartBulkText.trim() || parsedSmartModules.length === 0} 
              className="h-12 bg-[#1AA6E1] hover:bg-[#158bbd] text-white font-black uppercase tracking-[0.12em] text-[10.5px] rounded-xl shadow-lg shadow-[#1AA6E1]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Rocket size={15} />
              {parsedSmartModules.length > 0 
                ? `Add ${parsedSmartModules.length} Future Modules` 
                : "Add as Future Modules"}
            </Button>
          </div>
        </div>
      </InputGroupCard>

      {/* Active Module List */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center px-1" id="manual-node-section">
          <div className="space-y-0.5">
             <LabelPremium className="mb-0 text-slate-800 dark:text-slate-200 text-[10px]">Blueprint Registry</LabelPremium>
             <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Active operational modules</p>
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
              className="h-9 rounded-xl px-4 border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all bg-white dark:bg-white/5 text-slate-800 dark:text-white"
            >
              + Add Manual Node
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {proposal.solution.selectedModules.map((module: Module, mIdx: number) => {
            const accent = colors[mIdx % colors.length];
            return (
              <div 
                key={module.id} 
                className={`border-l-4 ${borderColors[accent]} border-y border-r border-y-slate-200 dark:border-y-white/5 border-r-slate-200 dark:border-r-white/5 overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group bg-slate-50/30 dark:bg-[#131720]/40`}
              >
                {/* Card Header (Sleek and Packed) */}
                <div className="p-4 sm:p-5 bg-slate-100/40 dark:bg-[#181E29]/40 border-b border-slate-200/50 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 group-hover:bg-slate-100/60 dark:group-hover:bg-[#1c2330]/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                     <div className={`w-8 h-8 rounded-lg ${badgeColors[accent]} flex items-center justify-center font-black italic shadow-sm rotate-3 group-hover:rotate-0 transition-all duration-500 shrink-0 text-xs`}>
                        M{mIdx + 1}
                     </div>
                     <input 
                        type="text" 
                        className="flex-1 bg-transparent border-none text-base font-black uppercase tracking-tighter text-slate-850 dark:text-slate-100 h-auto p-0 focus:outline-none focus:ring-0 min-w-0" 
                        value={module.name} 
                        onChange={(e) => {
                           const next = [...proposal.solution.selectedModules];
                           next[mIdx].name = e.target.value;
                           updateSolution({ selectedModules: next });
                        }} 
                     />
                  </div>
                  
                  {/* Future Scalability Toggle */}
                  <button
                    onClick={() => {
                      const next = [...proposal.solution.selectedModules];
                      next[mIdx].isFutureScalability = !next[mIdx].isFutureScalability;
                      updateSolution({ selectedModules: next });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all border shrink-0 ${
                      module.isFutureScalability
                        ? "bg-[#1AA6E1]/15 text-[#1AA6E1] border-[#1AA6E1]/40 shadow-sm"
                        : "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-600"
                    }`}
                  >
                    {module.isFutureScalability ? "🚀 Future Scalability" : "⚙️ Core Module"}
                  </button>

                  {/* Module Price Field */}
                  <div className="flex items-center gap-2 shrink-0">
                     <div className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Est. Price:</div>
                     <div className="relative w-28">
                        <input 
                           type="text" 
                           placeholder="e.g. 25,000" 
                           className="w-full h-8 pl-5 pr-2 bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 text-right"
                           value={module.price || ""} 
                           onChange={(e) => {
                              const next = [...proposal.solution.selectedModules];
                              next[mIdx].price = e.target.value;
                              updateSolution({ selectedModules: next });
                           }} 
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-[9px]">₹</span>
                     </div>
                  </div>

                  <button 
                    onClick={() => updateSolution({ selectedModules: proposal.solution.selectedModules.filter((_: Module, i: number) => i !== mIdx) })} 
                    className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Card Content (Sleek Features Grid) */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {module.features.map((feature: any, fIdx: number) => (
                      <div 
                        key={fIdx} 
                        className="flex items-center gap-2 group/item relative bg-white dark:bg-[#131720]/80 hover:bg-slate-100 dark:hover:bg-[#181E29] p-2.5 border border-slate-200/50 dark:border-white/5 rounded-xl transition-all duration-300 w-full min-w-0 shadow-sm hover:shadow"
                      >
                         <div className={`w-1.5 h-1.5 rounded-full ${dotColors[accent]} shrink-0`} />
                         
                         {/* Feature Name Input */}
                         <input 
                            type="text"
                            className="flex-1 bg-transparent border-none text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-0 min-w-0 p-0" 
                            value={typeof feature === 'string' ? feature : feature.name} 
                            onChange={(e) => {
                               const next = [...proposal.solution.selectedModules];
                               const currentPrice = typeof feature === 'string' ? "" : (feature.price || "");
                               next[mIdx].features[fIdx] = { name: e.target.value, price: currentPrice };
                               updateSolution({ selectedModules: next });
                            }} 
                         />
                         
                         {/* Feature Price Input */}
                         <div className="relative w-20 shrink-0">
                            <input 
                               type="text" 
                               placeholder="Price" 
                               className="w-full h-6 pl-3.5 pr-1.5 bg-slate-50 dark:bg-[#0B0E14]/50 border border-slate-200 dark:border-white/10 rounded-md text-[9px] font-bold text-slate-750 dark:text-slate-200 focus:outline-none focus:border-primary/40 text-right p-0"
                               value={typeof feature === 'string' ? "" : (feature.price || "")} 
                               onChange={(e) => {
                                  const next = [...proposal.solution.selectedModules];
                                  const currentName = typeof feature === 'string' ? feature : feature.name;
                                  next[mIdx].features[fIdx] = { name: currentName, price: e.target.value };
                                  updateSolution({ selectedModules: next });
                               }} 
                            />
                            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-[7px]">₹</span>
                         </div>

                         <button 
                           onClick={() => {
                             const next = [...proposal.solution.selectedModules];
                             next[mIdx].features = next[mIdx].features.filter((_: any, i: number) => i !== fIdx);
                             updateSolution({ selectedModules: next });
                           }} 
                           className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-red-500 transition-all shrink-0"
                         >
                           <X size={12} />
                         </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Feature Buttons */}
                  {activeBulkImportMIdx === mIdx ? (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-[#131720]/80 border border-slate-200 dark:border-white/10 rounded-xl space-y-2">
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
                        className="w-full p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131720] border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-primary/50 placeholder:text-slate-400 placeholder:font-normal"
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
                        className="w-full h-8 bg-slate-100 dark:bg-slate-800 hover:bg-black hover:text-white dark:hover:bg-[#99CB48] dark:hover:text-[#0B0E14] text-slate-800 dark:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
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
                </div>
              </div>
            );
          })}
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
              className="w-full max-w-md bg-white dark:bg-[#0B0E14] border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5"
            >
              {/* background red glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] -mr-16 -mt-16" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-500/70">API LIMIT REACHED</div>
                  <h3 className="text-base font-black text-slate-805 dark:text-white uppercase tracking-wider">Quota Exhausted (429)</h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-white/70 leading-relaxed">
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
                  className="flex-1 h-11 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[0.15em] text-[10px] rounded-xl shadow-[0_12px_24px_rgba(244,63,94,0.2)] transition-all active:scale-98"
                >
                  Use Manual Mode
                </button>
                <button
                  onClick={() => setShowQuotaModal(false)}
                  className="px-5 h-11 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white/80 font-black uppercase tracking-[0.15em] text-[10px] rounded-xl transition-all border border-slate-200 dark:border-white/5"
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
