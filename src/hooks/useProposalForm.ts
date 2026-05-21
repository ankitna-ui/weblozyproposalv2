import { useState } from "react";
import { Proposal, ClientDetails, BusinessSituation, SolutionDetails, ROIMetrics, PricingDetail, Policies, TechnicalArchitecture, ExperiencePortfolio, ClosingCTA, PageConfig } from "@/types/proposal";

const DRAFT_KEY = "weblozy_proposal_draft_v2";
const DRAFT_STEP_KEY = "weblozy_proposal_draft_step_v2";

const initialProposal: Proposal = {
  userId: "",
  client: {
    companyName: "VALUED CLIENT",
    // contactPerson: "", // Commented out to save space in Firestore
    clientName: "VALUED CLIENT",
    // industry: "", // Commented out to save space in Firestore
    industryTitle: "BUSINESS AUTOMATION",
    // meetingDate: "", // Commented out to save space in Firestore
    proposalTitle: "",
    tagline: "WE AUTOMATE BUSINESSES",
    preparedBy: "Weblozy Consulting Team",
    referenceId: `WBZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "Draft",
    subTitle: "Digital Transformation & Business Automation",
    industryDomain: "Business Automation / Enterprise Sector",
    releaseProtocol: "Confidential / Stable-V2",
    protocolTitle: "CONFIDENTIAL",
    filingDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
    executiveSummary: "In today's hyper-accelerated market, efficiency is the only competitive moat. This proposal outlines a comprehensive automation architecture designed specifically for your digital excellence.",
    websiteUrl: "WWW.WEBLOZY.COM",
    frameworkTitle: "EXECUTIVE FRAMEWORK",
    footerMessage: "© WEBLOZY SOLUTIONS • GLOBAL OPERATIONS"
  },
  problemStatement: {
    heading: "The Innovation Bottleneck",
    description: "Your current operational architecture is facing systemic challenges that impede rapid growth and scalability. We have identified several critical areas where friction is most prevalent.",
    pointers: [
      "Fragmented data silos leading to informational delay",
      "Manual repetitive tasks consuming high-value human capital",
      "Lack of real-time visibility into operational performance"
    ]
  },
  situation: {
    currentWorkflow: "Current operations rely heavily on manual coordination between departments, utilizing fragmented spreadsheets and legacy communication channels which delay decision-making cycles.",
    existingSoftware: "Legacy ERP / Google Sheets",
    challenges: ["Manual Data Reconciliation", "Delayed Communication Loops", "Fragmented Inventory Tracking", "High Dependency on Human Recall"],
    revenueLeakage: "₹15k+ / Mo",
    inefficiencies: "High Manual Overhead",
    limitations: "Limited Scalability in Current Architecture",
    // meetingNotes: "", // Commented out to save space in Firestore
  },
  solution: {
    overview: "We propose building a custom automation ecosystem tailored to your specific business logic, ensuring seamless data flow and operational transparency.",
    approach: "Strategic implementation of centralized automation protocols to neutralize systemic friction and maximize team velocity.",
    approachPoints: ["Agile Lifecycle Deployment", "Seamless API Architecture", "Operational Transparency Protocols", "Scalable Data Pipelines"],
    selectedModules: [],
    customModules: [],
    demoLinks: [],
    timeline: "8-12 Weeks Implementation",
    integrations: ["Custom CRM Connect", "ERP Data Bridge", "Cloud Logistics Sync", "Automated Billing API"],
    userRoles: ["Executive Admin", "Departmental Manager", "Operations Specialist", "External Auditor"],
    flowchartImageUrl: "",
    demoLink: "",
  },
  techArchitecture: {
    frontendStack: ["React.js", "Next.js", "Tailwind CSS"],
    backendStack: ["Node.js", "Express", "Python"],
    database: "PostgreSQL / MongoDB",
    hosting: "AWS / Google Cloud",
    securityFeatures: ["256-bit AES Encryption", "SOC2 Compliance", "Multi-factor Authentication"],
  },
  roi: {
    revenueIncrease: "25",
    costReduction: "35",
    timeSaving: "40",
    productivityIncrease: "50",
    expectedROI: "₹15L / Year",
    profitImpact: "Significant Operational Lift",
    impactSummary: "Projected 35% reduction in manual overhead and 25% lift in revenue throughput.",
    monthlyRevenue: "500000",
    totalEmployees: "10",
    manualHoursPerMonth: "160",
    businessProblems: ["Faster Operations", "Reduced Manual Errors", "Better Team Coordination"],
    expectedGrowthGoal: "25",
  },
  experience: {
    yearsOfExperience: "15+",
    projectsCompleted: "250+",
    industriesServed: "15+",
    testimonials: [],
    portfolioLinks: [
      "Enterprise Ecosystem|https://weblozyenterprisedemo.netlify.app/",
      "Precision Manufacturing|https://snow-wombat-148981.hostingersite.com/",
      "AI Analytics|https://weblozyaianalyzer.vercel.app/",
      "Modern UX|https://weblozydemocool.netlify.app/"
    ],
    strategicSummary: "Weblozy specializes in high-performance automation ecosystems, bridging the gap between legacy operations and future-ready scalability.",
    partnerStatus: "ACTIVE PARTNER",
  },
  pricing: {
    range: "",
    coreValuation: "100000",
    discountPercentage: "15",
    taxRate: "18",
    milestones: [
      { name: "Initiation Advance", percentage: 50, description: "Strategic Planning & Architecture Setup" },
      { name: "Development Milestone", percentage: 30, description: "Core Development & Beta Testing" },
      { name: "Final Deployment", percentage: 20, description: "UAT & Global Launch" }
    ],
    hostingCost: "Included",
    maintenanceCost: "Included",
    supportCost: "Included",
    taxes: "18% GST extra",
    roiLogic: "The investment is optimized for high-yield operational efficiency, with a projected systemic ROI realized through automated cost reduction.",
  },
  policies: {
    support: "24/7 Priority Support with Dedicated Manager",
    security: "Enterprise-grade security with regular penetration testing",
    backup: "Daily automated geo-redundant cloud backups",
    sla: "99.99% Uptime Guarantee with SLA reporting",
    timeline: "8-12 Weeks Implementation Lifecycle",
  },
  closing: {
    meetingLink: "https://calendly.com/weblozy",
    nextSteps: ["Initial Technical Discovery", "Logic Blueprint Approval", "Agile Development Sprint", "UAT & Deployment"],
    contactEmail: "info@weblozy.com",
    contactPhone: "+91 96678 96604",
    contactPhoneUSA: "+1 (320) 433-0111",
    address: "GH-03, Sector 16B, Greater Noida, Uttar Pradesh 201318",
    instagramLink: "https://www.instagram.com/weblozy/",
    xLink: "https://x.com/weblozy",
    facebookLink: "https://www.facebook.com/weblozy/",
    linkedinLink: "https://www.linkedin.com/company/weblozy/",
    youtubeLink: "https://www.youtube.com/@weblozy",
    ctaMessage: "Our architecture is engineered for precision. We are ready to deploy your strategic roadmap and scale your operations with master-grade automation. Our unified solutions optimize resources, eradicate technical debt, and ensure absolute operational velocity.",
  },
  pageConfig: [
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
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export function useProposalForm() {
  // Lazy initializer: automatically load draft from localStorage if available
  const [proposal, setProposal] = useState<Proposal>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Proposal;
        // Basic validation — make sure it has the core structure
        if (parsed?.client && parsed?.solution && parsed?.closing) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors, fallback to default
    }
    return initialProposal;
  });

  const updateClient = (data: Partial<ClientDetails>) => {
    setProposal(prev => ({ ...prev, client: { ...prev.client, ...data } }));
  };

  const updateProblemStatement = (data: Partial<Proposal['problemStatement']>) => {
    setProposal(prev => ({ ...prev, problemStatement: { ...prev.problemStatement, ...data } }));
  };

  const updateSituation = (data: Partial<BusinessSituation>) => {
    setProposal(prev => ({ ...prev, situation: { ...prev.situation, ...data } }));
  };

  const updateSolution = (data: Partial<SolutionDetails>) => {
    setProposal(prev => ({ ...prev, solution: { ...prev.solution, ...data } }));
  };

  const updateTechArchitecture = (data: Partial<TechnicalArchitecture>) => {
    setProposal(prev => ({ ...prev, techArchitecture: { ...prev.techArchitecture, ...data } }));
  };

  const updateROI = (data: Partial<ROIMetrics>) => {
    setProposal(prev => ({ ...prev, roi: { ...prev.roi, ...data } }));
  };

  const updateExperience = (data: Partial<ExperiencePortfolio>) => {
    setProposal(prev => ({ ...prev, experience: { ...prev.experience, ...data } }));
  };

  const updatePricing = (data: Partial<PricingDetail>) => {
    setProposal(prev => ({ ...prev, pricing: { ...prev.pricing, ...data } }));
  };

  const updatePolicies = (data: Partial<Policies>) => {
    setProposal(prev => ({ ...prev, policies: { ...prev.policies, ...data } }));
  };

  const updateClosing = (data: Partial<ClosingCTA>) => {
    setProposal(prev => ({ ...prev, closing: { ...prev.closing, ...data } }));
  };

  const setAIContent = (content: Proposal['aiGeneratedContent']) => {
    setProposal(prev => ({ ...prev, aiGeneratedContent: content }));
  };

  const updatePageConfig = (data: PageConfig[]) => {
    setProposal(prev => ({ ...prev, pageConfig: data }));
  };

  return {
    proposal,
    updateClient,
    updateProblemStatement,
    updateSituation,
    updateSolution,
    updateTechArchitecture,
    updateROI,
    updateExperience,
    updatePricing,
    updatePolicies,
    updateClosing,
    setAIContent,
    updatePageConfig,
    setProposal
  };
}
