import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Download,
  Printer,
  Loader2,
  BookOpen,
  Compass,
  Search,
  Layers,
  Workflow,
  Boxes,
  Cpu,
  Activity,
  DollarSign,
  Award,
  ThumbsUp,
  FileText,
  ArrowLeft,
  Home
} from "lucide-react";
import { Proposal } from "@/types/proposal";
import ProposalPDF from "@/components/Proposal/pages2";

const pageIconMap: Record<string, React.ComponentType<any>> = {
  cover: BookOpen,
  identity: Compass,
  audit: Search,
  ecosystem: Layers,
  flowchart: Workflow,
  modules: Boxes,
  technical: Cpu,
  roi: Activity,
  commercial: DollarSign,
  portfolio: Award,
  closing: ThumbsUp
};

export default function ProposalPreview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const proposalRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<string>("cover");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const proposal = location.state?.proposal as Proposal;

  const visiblePages = (proposal?.pageConfig || [
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
  ]).filter(p => p.visible);

  // Active scroll-spy tracking using modern IntersectionObserver API (immune to CSS zoom & layout offsets)
  useEffect(() => {
    if (!visiblePages.length) return;

    const observerOptions = {
      root: null, // use browser viewport
      rootMargin: "-25% 0px -45% 0px", // focus area inside upper-middle of screen view
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let pageId = entry.target.id.replace("proposal-page-", "");
          if (pageId.startsWith("modules")) {
            pageId = "modules";
          }
          setActiveSection(pageId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all proposal-page container elements in the DOM
    const elements = document.querySelectorAll('[id^="proposal-page-"]');
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [visiblePages, proposal]);

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">No proposal data found</h2>
          <Button onClick={() => navigate('/create')} className="bg-[#99CB48] text-black">Go to Create</Button>
        </div>
      </div>
    );
  }

  const scrollToPage = (pageId: string) => {
    // Instantly highlight in sidebar for lightning-fast active feedback
    setActiveSection(pageId);

    const el = document.getElementById(`proposal-page-${pageId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const waitForAssets = async (container: HTMLElement) => {
    await document.fonts.ready;

    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  };

  const exportPDF = async () => {
    const originalElement = document.getElementById("proposal-pdf-content");
    if (!originalElement) return;

    setIsExporting(true);
    setExportProgress(5);

    // Capture initial styles to restore them later
    const originalZoom = originalElement.style.zoom;
    const originalTransform = originalElement.style.transform;
    const originalWidth = originalElement.style.width;
    const originalBorderRadius = originalElement.style.borderRadius;
    const originalShadow = originalElement.style.boxShadow;
    const originalMargin = originalElement.style.margin;

    try {
      console.log("[PDF Debug] Initializing high-precision client-side PDF export...");
      setExportProgress(10);
      
      // 1. Wait for web fonts and images to load completely
      await waitForAssets(originalElement);
      setExportProgress(20);

      // 2. Temporarily reset zoom, transform, width, and shadows on the live container
      // to let it render at full 1:1 scale (794px width) for precise pixel capturing.
      originalElement.style.zoom = "1";
      originalElement.style.transform = "none";
      originalElement.style.borderRadius = "0";
      originalElement.style.boxShadow = "none";
      originalElement.style.width = "794px";
      originalElement.style.margin = "0";

      // Also force zoom override on class level by temporarily removing class
      originalElement.classList.remove("pdf-preview-scale");
      
      // Allow browser layout engine to paint the unscaled DOM elements
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportProgress(30);

      // Find all target .proposal-page containers
      const pageElements = Array.from(originalElement.querySelectorAll(".proposal-page"));
      console.log(`[PDF Debug] Found ${pageElements.length} pages to render.`);

      if (pageElements.length === 0) {
        throw new Error("No proposal pages found inside preview content container.");
      }

      // Dynamic import html2canvas and jsPDF to optimize bundle sizes
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Create PDF with exact requested pixels [794, 1123] for A4
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [794, 1123],
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i] as HTMLElement;
        console.log(`[PDF Debug] Capturing page ${i + 1}/${pageElements.length}...`);
        
        const progress = 30 + Math.round((i / pageElements.length) * 65);
        setExportProgress(progress);

        // Save original individual page styles to avoid visual layout shifts
        const originalPageBorderRadius = pageEl.style.borderRadius;
        const originalPageBoxShadow = pageEl.style.boxShadow;
        const originalPageBorder = pageEl.style.border;
        const originalPageMargin = pageEl.style.margin;
        const originalPageTransform = pageEl.style.transform;
        const originalPageTransition = pageEl.style.transition;

        // Force exact crisp A4 print layout styles (flat, no margin/shadows/rounding/transitions)
        pageEl.style.borderRadius = "0";
        pageEl.style.boxShadow = "none";
        pageEl.style.border = "none";
        pageEl.style.margin = "0";
        pageEl.style.transform = "none";
        pageEl.style.transition = "none";

        // Capture page using exact requested html2canvas settings
        const canvas = await html2canvas(pageEl, {
          scale: 3, // High scale factor for crisp printing
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0
        });

        const imgData = canvas.toDataURL("image/png");

        // Restore original page preview styles
        pageEl.style.borderRadius = originalPageBorderRadius;
        pageEl.style.boxShadow = originalPageBoxShadow;
        pageEl.style.border = originalPageBorder;
        pageEl.style.margin = originalPageMargin;
        pageEl.style.transform = originalPageTransform;
        pageEl.style.transition = originalPageTransition;

        if (i > 0) {
          pdf.addPage([794, 1123], "portrait");
        }
        
        pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);

        // Detect and overlay active links in the PDF page
        const pageRect = pageEl.getBoundingClientRect();
        if (pageRect.width > 0 && pageRect.height > 0) {
          const scaleX = 794 / pageRect.width;
          const scaleY = 1123 / pageRect.height;
          const anchors = Array.from(pageEl.querySelectorAll("a"));
          
          anchors.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && !href.startsWith("#") && href !== "javascript:void(0)") {
              const linkRect = link.getBoundingClientRect();
              const relLeft = (linkRect.left - pageRect.left) * scaleX;
              const relTop = (linkRect.top - pageRect.top) * scaleY;
              const relWidth = linkRect.width * scaleX;
              const relHeight = linkRect.height * scaleY;
              
              if (relWidth > 0 && relHeight > 0) {
                pdf.link(relLeft, relTop, relWidth, relHeight, { url: href });
              }
            }
          });
        }

        // Clean canvas memory
        canvas.width = 0;
        canvas.height = 0;
      }

      setExportProgress(95);

      // Restore original container layout styles
      originalElement.style.zoom = originalZoom;
      originalElement.style.transform = originalTransform;
      originalElement.style.borderRadius = originalBorderRadius;
      originalElement.style.boxShadow = originalShadow;
      originalElement.style.width = originalWidth;
      originalElement.style.margin = originalMargin;
      originalElement.classList.add("pdf-preview-scale");

      // Calculate filename
      const refId = (proposal as any).referenceId || proposal.client?.referenceId || "proposal";
      const title = (proposal as any).proposalTitle || proposal.client?.proposalTitle || "Weblozy";
      const filename = `${refId}_${title}.pdf`.replace(/\s+/g, '_');

      console.log(`[PDF Debug] Downloading PDF file: ${filename}`);
      pdf.save(filename);

      setExportProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error("High-precision PDF download failed:", err);
      // Ensure we restore styles even on error
      if (originalElement) {
        originalElement.style.zoom = originalZoom;
        originalElement.style.transform = originalTransform;
        originalElement.style.borderRadius = originalBorderRadius;
        originalElement.style.boxShadow = originalShadow;
        originalElement.style.width = originalWidth;
        originalElement.style.margin = originalMargin;
        originalElement.classList.add("pdf-preview-scale");
      }
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handlePrint = () => {
    exportPDF();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{
      backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>

      {/* High-End Sticky Navigation Header with Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 no-print shadow-sm h-20 w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-100/50 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border border-slate-200/20 shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-2 py-0.5 rounded">Preview OS</span>
                <span className="text-slate-300 text-[10px]">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">#{proposal.client?.referenceId || "WBL-001"}</span>
              </div>
              <h2 className="text-xs sm:text-sm font-black text-[#0B0E14] uppercase tracking-wider truncate max-w-[150px] sm:max-w-[320px] md:max-w-[480px] mt-0.5">
                {proposal.client?.proposalTitle || "Strategic Roadmapping"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button onClick={exportPDF} className="h-10 px-4 sm:px-5 rounded-xl bg-primary hover:bg-[#88B540] text-white shadow-lg shadow-primary/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] transition-all">
              <Download size={15} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Download Master PDF</span>
              <span className="inline sm:hidden">Download</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Content Layout */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start justify-start relative">

        {/* Left Sticky Outline Sidebar Panel (Hidden on screens below lg) */}
        <div className="hidden lg:block w-[260px] shrink-0 sticky top-[112px] z-20 space-y-4 no-print">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100/50 pb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B0E14]">Document Outline</h3>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase">
                {visiblePages.length} Pages
              </span>
            </div>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              {visiblePages.map((page, idx) => {
                const PageIcon = pageIconMap[page.id] || FileText;
                const isActive = activeSection === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActiveSection(page.id);
                      scrollToPage(page.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-300 group ${isActive
                      ? "bg-[#0B0E14] text-white shadow-lg shadow-black/10 scale-[1.02]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${isActive ? "bg-primary/20 text-primary animate-pulse" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200/60"
                        }`}>
                        <PageIcon size={13} />
                      </div>
                      <span className="text-[9.5px] font-bold uppercase tracking-wider truncate">{page.name}</span>
                    </div>
                    <span className={`text-[9px] font-black tracking-widest shrink-0 opacity-40 group-hover:opacity-75 ${isActive ? "text-primary" : "text-slate-400"
                      }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right/Center Document Canvas */}
        <div className="flex-1 flex flex-col items-center lg:items-start w-full min-w-0">
          <div className="pdf-container overflow-visible py-0 flex flex-col items-center lg:items-start w-full bg-transparent shadow-none">
            <div
              id="proposal-pdf-content"
              className="pdf-export-wrapper pdf-preview-scale transition-all duration-500 h-fit bg-transparent border-none shadow-none"
            >
              <ProposalPDF ref={proposalRef} proposal={proposal} />
            </div>
          </div>
        </div>

      </div>

      {/* Floating Return to Dashboard pill in the bottom right corner */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3.5 px-5 py-3 rounded-full bg-[#0B0E14] hover:bg-black text-white shadow-2xl transition-all duration-300 hover:scale-105 group border border-white/5">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/90">Return to Dashboard</span>
          <div className="w-8 h-8 rounded-full bg-primary hover:bg-[#88B540] text-black flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Home size={14} className="text-white brightness-0 invert" />
          </div>
        </button>
      </div>


      {isExporting && (
        <div className="fixed inset-0 z-[9999] bg-[#0B0E14]/90 backdrop-blur-md flex items-center justify-center flex-col pdf-export-loader">
          <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
            <Loader2 className="w-14 h-14 text-primary animate-spin" />
            <div className="space-y-2">
              <h3 className="text-white text-[12px] font-black uppercase tracking-[0.4em] mb-1">Compiling Strategic Proposal</h3>
              <p className="text-white/45 text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">Please wait, generating print-ready vector frames...</p>
            </div>

            {/* High-contrast progress bar */}
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#99CB48] shadow-[0_0_12px_#99CB48] transition-all duration-300 rounded-full"
                style={{ width: `${exportProgress}%` }}
              />
            </div>

            <p className="text-white/30 text-[9px] font-black uppercase tracking-wider tabular-nums">{exportProgress}% Sync Complete</p>
          </div>
        </div>
      )}
    </div>
  );
}
