export interface ClientDetails {
  companyName: string;
  clientLogoUrl?: string;
  contactPerson?: string; // Commented out in form defaults to save Firebase space
  clientName?: string; // Specific name for "Name: Valued Client"
  industry?: string; // Commented out in form defaults to save Firebase space
  industryTitle?: string; // For "Business Automation" heading
  meetingDate?: string; // Commented out in form defaults to save Firebase space
  proposalTitle: string;
  titleHighlight?: string;
  tagline?: string; // For "We Automate Businesses"
  preparedBy: string;
  referenceId: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  subTitle?: string;
  industryDomain?: string;
  releaseProtocol?: string;
  protocolTitle?: string; // For "Confidential" label
  filingDate?: string;
  executiveSummary?: string;
  websiteUrl?: string;
  frameworkTitle?: string;
  footerMessage?: string;
}

export interface BusinessSituation {
  currentWorkflow: string;
  existingSoftware: string;
  challenges: string[];
  revenueLeakage: string;
  inefficiencies: string;
  limitations: string;
  meetingNotes?: string; // Commented out in form defaults to save Firebase space
}

export interface Module {
  id: string;
  name: string;
  features: (string | { name: string; price?: string })[];
  price?: string | number;
  description?: string;
  icon?: string;
  isCustom?: boolean;
  isFutureScalability?: boolean;
}

export interface SolutionDetails {
  overview: string;
  approach: string;
  approachPoints: string[];
  selectedModules: Module[];
  customModules: Module[];
  includeFutureScalability?: boolean;
  demoLinks: string[];
  timeline: string;
  integrations: string[];
  userRoles: string[];
  flowchartImageUrl?: string;
  demoLink?: string;
}

export interface ROIMetrics {
  revenueIncrease: string;
  costReduction: string;
  timeSaving: string;
  productivityIncrease: string;
  expectedROI: string;
  profitImpact: string;
  impactSummary: string;
  breakEven?: string;
  growthFactor?: string;
  // Real calculation inputs
  projectCost?: string;
  monthlyCost?: string;
  currentRevenue?: string;
  currentOpsCost?: string;
  manualHoursPerMonth?: string;
  hourlyRate?: string;
  // Premium inputs
  monthlyRevenue?: string;
  totalEmployees?: string;
  businessProblems?: string[];
  expectedGrowthGoal?: string;
  roiReportLink?: string;
}

export interface PricingDetail {
  range: string;
  coreValuation?: string;
  discountPercentage?: string;
  taxRate?: string;
  milestones: { name: string; percentage: number; description: string }[];
  hostingCost: string;
  maintenanceCost: string;
  supportCost: string;
  taxes: string;
  roiLogic?: string;
}

export interface Policies {
  support: string;
  security: string;
  backup: string;
  sla: string;
  timeline: string;
}

export interface ProblemStatement {
  heading: string;
  description: string;
  pointers: string[];
}

export interface ExperiencePortfolio {
  yearsOfExperience: string;
  projectsCompleted: string;
  industriesServed: string | string[];
  testimonials: { client: string; text: string }[];
  portfolioLinks: string[];
  strategicSummary?: string;
  partnerStatus?: string;
}

export interface TechnicalArchitecture {
  frontendStack: string[];
  backendStack: string[];
  database: string;
  hosting: string;
  securityFeatures: string[];
}

export interface ClosingCTA {
  meetingLink: string;
  nextSteps: string[];
  contactEmail: string;
  contactPhone: string;
  ctaMessage?: string;
  qrCodeLink?: string;
  contactPhoneUSA?: string;
  address?: string;
  instagramLink?: string;
  xLink?: string;
  facebookLink?: string;
  linkedinLink?: string;
  youtubeLink?: string;
}

export interface PageConfig {
  id: string;
  name: string;
  visible: boolean;
}

export interface Proposal {
  id?: string;
  userId: string;
  client: ClientDetails;
  problemStatement: ProblemStatement;
  situation: BusinessSituation;
  solution: SolutionDetails;
  techArchitecture: TechnicalArchitecture;
  roi: ROIMetrics;
  experience: ExperiencePortfolio;
  pricing: PricingDetail;
  policies: Policies;
  closing: ClosingCTA;
  aiGeneratedContent?: {
    problemStatement: string;
    proposedSolution: string;
    businessImpact: string;
    whyWeblozy: string;
    roiExplanation?: string;
  };
  createdAt: number;
  updatedAt: number;
  creatorName?: string;
  creatorEmployeeId?: string;
  pageConfig?: PageConfig[];
  isDownloaded?: boolean;
}
