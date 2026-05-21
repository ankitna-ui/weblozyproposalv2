import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function cleanAndParseJSON(rawText: string) {
  let cleaned = rawText.trim();
  
  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  // Strip markdown fences
  cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  // Find boundaries of JSON array or object
  const firstArray = cleaned.indexOf('[');
  const lastArray = cleaned.lastIndexOf(']');
  const firstObject = cleaned.indexOf('{');
  const lastObject = cleaned.lastIndexOf('}');

  let startIndex = -1;
  let endIndex = -1;

  if (firstArray !== -1 && (firstObject === -1 || firstArray < firstObject)) {
    startIndex = firstArray;
    endIndex = lastArray;
  } else if (firstObject !== -1) {
    startIndex = firstObject;
    endIndex = lastObject;
  }

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const jsonCandidate = cleaned.substring(startIndex, endIndex + 1);
    try {
      return JSON.parse(jsonCandidate);
    } catch (e) {
      console.warn("JSON extraction parser failed on candidate:", jsonCandidate);
    }
  }

  throw new Error("Could not extract valid JSON from raw text: " + rawText);
}

export async function generateProposalContent(notes: string, clientName: string, modules: string[]) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    You are a Strategic Solutions Architect at Weblozy.
    Based on the following meeting notes for the client "${clientName}" and the selected modules [${modules.join(", ")}], generate a McKinsey-style professional proposal content.
    
    MEETING NOTES:
    ${notes}
    
    Provide the output in JSON format with the following keys:
    1. problemStatement: Deep analytical deep-dive.
    2. proposedSolution: Futuristic roadmap.
    3. businessImpact: Quantifiable outcomes.
    4. whyWeblozy: Expertise summary.
    5. roiExplanation: Financial impact.
    
    Tone: Authoritative, Visionary.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    return {
      content: cleanAndParseJSON(text),
      tokens: usage?.totalTokenCount || 0
    };
  } catch (error: any) {
    console.error("Error generating AI content:", error);
    return {
      content: {
        problemStatement: "Currently experiencing operational friction and technical debt.",
        proposedSolution: "Implementing an automated architectural ecosystem.",
        businessImpact: "Significant increase in scalability and efficiency.",
        whyWeblozy: "Our expertise in high-end automation.",
        roiExplanation: "Strategic value creation through automation."
      },
      tokens: 0
    };
  }
}

export async function generateModuleFeatures(moduleName: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    As a Senior Business Automation Expert at Weblozy, analyze the module named "${moduleName}".
    Identify exactly 18-20 comprehensive, highly specific, technical, and high-value enterprise features. Make sure they cover various aspects of this module such as integration, analytics, workflows, security, configuration, and reports.
    Output MUST be a JSON array of strings. Do not wrap in markdown or any text other than the JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    return {
      features: cleanAndParseJSON(text),
      tokens: usage?.totalTokenCount || 0,
      isFallback: false
    };
  } catch (error: any) {
    console.error("Error generating module features:", error);
    return { 
      features: [
        "Advanced Data Integration Framework",
        "Real-time Analytics Dashboard",
        "Automated Workflow Optimization",
        "Enterprise-grade Security Protocol",
        "Scalable Cloud Infrastructure Sync",
        "Universal API Connector Engine",
        "Custom Metadata Management Suite",
        "Real-Time Logging & Audit Logs",
        "Interactive Workflow Canvas",
        "Granular Role-Based Access Control",
        "AI-Powered Predictive Modeling",
        "Dynamic PDF Report Builder",
        "Multi-Tenant Namespace Isolation",
        "Instant Webhook Notification Hub",
        "Automated Compliance Auditing",
        "Data Exfiltration Protection Shield",
        "Scheduled Batch Extraction System",
        "Disaster Recovery Failover Sync"
      ], 
      tokens: 0,
      isFallback: true
    };
  }
}

export async function extractModulesFromContext(context: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    Analyze the following business context and identify automation modules.
    CONTEXT: ${context}
    For each identified module, extract exactly 18-20 highly specific, technical, and high-value enterprise features.
    Output MUST be a JSON array of objects containing the fields:
    [{"name": "Module Name", "description": "Summary", "features": ["Feature 1", "Feature 2", ..., "Feature 20"]}]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    return {
      modules: cleanAndParseJSON(text),
      tokens: usage?.totalTokenCount || 0,
      isFallback: false
    };
  } catch (error: any) {
    console.error("Error extracting modules:", error);
    return { 
      modules: [
        {
          name: "Tactical Extraction Core",
          description: "Automated extraction and processing module",
          features: [
            "Advanced Data Integration Framework",
            "Real-time Analytics Dashboard",
            "Automated Workflow Optimization",
            "Enterprise-grade Security Protocol",
            "Scalable Cloud Infrastructure Sync",
            "Universal API Connector Engine",
            "Custom Metadata Management Suite",
            "Real-Time Logging & Audit Logs",
            "Interactive Workflow Canvas",
            "Granular Role-Based Access Control",
            "AI-Powered Predictive Modeling",
            "Dynamic PDF Report Builder",
            "Multi-Tenant Namespace Isolation",
            "Instant Webhook Notification Hub",
            "Automated Compliance Auditing",
            "Data Exfiltration Protection Shield",
            "Scheduled Batch Extraction System",
            "Disaster Recovery Failover Sync"
          ]
        }
      ], 
      tokens: 0,
      isFallback: true
    };
  }
}
