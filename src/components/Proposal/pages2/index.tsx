import React, { forwardRef, useEffect, useRef } from "react";
import { Proposal } from "@/types/proposal";
import { paginateModules } from "@/utils/proposal/weights";

// Import Modular Pages
import CoverPage from "./CoverPage";
import CorporateIdentityPage from "./CorporateIdentityPage";
import OperationalAuditPage from "./OperationalAuditPage";
import StrategicEcosystemPage from "./StrategicEcosystemPage";
import OperationalFlowchartPage from "./OperationalFlowchartPage";
import ModuleArchitecturePage from "./ModuleArchitecturePage";
import TechnicalArchitecturePage from "./TechnicalArchitecturePage";
import StrategicROIPage from "./StrategicROIPage";
import CommercialFrameworkPage from "./CommercialFrameworkPage";
import CorporateAuthorityPage from "./CorporateAuthorityPage";
import ClosingPage from "./ClosingPage";

interface ProposalPDFProps {
  proposal: Proposal;
  activeStep?: number;
}

const stepToPageIdMap: Record<number, string> = {
  0: "cover",
  1: "identity",
  2: "audit",
  3: "ecosystem",
  4: "flowchart",
  5: "modules",
  6: "technical",
  7: "roi",
  8: "commercial",
  9: "portfolio",
  10: "closing",
  11: "closing" // step 11 is the page customizer step, default scroll target is closing
};

const ProposalPDF = forwardRef<HTMLDivElement, ProposalPDFProps>(({ proposal, activeStep }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract or initialize page config
  const orderedPages = proposal.pageConfig || [
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

  let currentPageNum = 1;
  // Calculate pages needed for modules dynamically (matching ModuleArchitecturePage fallback logic)
  const solutionModules = proposal?.solution?.selectedModules?.length > 0 
    ? proposal.solution.selectedModules 
    : [
        { id: "sample-mod-1", name: "Industrial Product Management", features: [{ name: "Product dependency management", price: "₹2,500" }, { name: "Variant & SKU workflows", price: "₹1,500" }, { name: "Category management" }], price: "₹25,000" },
      ];
  const modulePages = paginateModules(solutionModules);
  const modulePagesCount = modulePages.length || 1;

  useEffect(() => {
    if (activeStep !== undefined && containerRef.current) {
      const pageId = stepToPageIdMap[activeStep];
      if (!pageId) return;

      const visiblePages = orderedPages.filter(p => p.visible);
      let targetPageIndex = visiblePages.findIndex(p => p.id === pageId);

      if (targetPageIndex === -1) {
        // Fallback to first page if current section is hidden
        targetPageIndex = 0;
      }

      // Accounts for dynamic module page count before target index
      const modulesIndex = visiblePages.findIndex(p => p.id === "modules");
      if (modulesIndex !== -1 && targetPageIndex > modulesIndex) {
        targetPageIndex += (modulePagesCount - 1);
      }

      const pages = containerRef.current.querySelectorAll('.a4-page');
      const targetPage = pages[Math.min(targetPageIndex, pages.length - 1)];
      if (targetPage) {
        targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeStep, proposal.pageConfig, modulePagesCount]);

  // Combine refs
  const setRefs = (node: HTMLDivElement) => {
    (containerRef as any).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  };

  const pageRenderers: Record<string, (pageNum: number) => React.ReactNode> = {
    cover: (pageNum) => <CoverPage key="cover" proposal={proposal} pageNum={pageNum} />,
    identity: (pageNum) => <CorporateIdentityPage key="identity" proposal={proposal} pageNum={pageNum} />,
    audit: (pageNum) => <OperationalAuditPage key="audit" proposal={proposal} pageNum={pageNum} />,
    ecosystem: (pageNum) => <StrategicEcosystemPage key="ecosystem" proposal={proposal} pageNum={pageNum} />,
    flowchart: (pageNum) => <OperationalFlowchartPage key="flowchart" proposal={proposal} pageNum={pageNum} />,
    technical: (pageNum) => <TechnicalArchitecturePage key="technical" proposal={proposal} pageNum={pageNum} />,
    roi: (pageNum) => <StrategicROIPage key="roi" proposal={proposal} pageNum={pageNum} />,
    commercial: (pageNum) => <CommercialFrameworkPage key="commercial" proposal={proposal} pageNum={pageNum} />,
    portfolio: (pageNum) => <CorporateAuthorityPage key="portfolio" proposal={proposal} pageNum={pageNum} />,
    closing: (pageNum) => <ClosingPage key="closing" proposal={proposal} pageNum={pageNum} />
  };

  return (
    <div ref={setRefs} className="flex flex-col gap-12 items-center font-sans text-[#0B0E14] w-full h-fit">
      {orderedPages.map((page) => {
        if (!page.visible) return null;

        // Skip Commercial Framework Page if pricing logic is empty (optional logic)
        if (page.id === "commercial") {
          const hasModulePrices = (proposal?.solution?.selectedModules || []).some(
            m => m.price && String(m.price).trim() !== "" && parseFloat(String(m.price).replace(/[^0-9.]/g, "")) > 0
          );
          const hasCoreValuation = proposal?.pricing?.coreValuation && 
            String(proposal.pricing.coreValuation).trim() !== "" && 
            parseFloat(String(proposal.pricing.coreValuation).replace(/[^0-9.]/g, "")) > 0;
          
          if (!hasModulePrices && !hasCoreValuation) {
            return null;
          }
        }
        
        if (page.id === "modules") {
          const startPageNum = currentPageNum;
          currentPageNum += modulePagesCount;
          
          return (
            <React.Fragment key="modules">
              {modulePages.map((pageModules, pageIdx) => {
                return (
                  <div 
                    key={`modules-page-${pageIdx}`} 
                    id={pageIdx === 0 ? "proposal-page-modules" : `proposal-page-modules-${pageIdx}`} 
                    className="scroll-mt-24 w-full flex justify-center pdf-page proposal-page"
                  >
                    <ModuleArchitecturePage 
                      proposal={proposal} 
                      pageNum={startPageNum + pageIdx} 
                      pageModules={pageModules} 
                      pageIdx={pageIdx} 
                      totalPages={modulePagesCount}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        const renderer = pageRenderers[page.id];
        if (!renderer) return null;
        
        const content = renderer(currentPageNum++);
        if (!content) return null;

        return (
          <div key={page.id} id={`proposal-page-${page.id}`} className="scroll-mt-24 w-full flex justify-center pdf-page proposal-page">
            {content}
          </div>
        );
      })}
    </div>
  );
});

ProposalPDF.displayName = "ProposalPDF";

export default ProposalPDF;
