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
  ArrowRight,
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
  ]).filter(p => {
    if (!p.visible) return false;
    
    // Skip Commercial Framework Page if pricing logic is empty
    if (p.id === "commercial") {
      const hasModulePrices = (proposal?.solution?.selectedModules || []).some(
        m => m.price && String(m.price).trim() !== "" && parseFloat(String(m.price).replace(/[^0-9.]/g, "")) > 0
      );
      const hasCoreValuation = proposal?.pricing?.coreValuation && 
        String(proposal.pricing.coreValuation).trim() !== "" && 
        parseFloat(String(proposal.pricing.coreValuation).replace(/[^0-9.]/g, "")) > 0;
      
      if (!hasModulePrices && !hasCoreValuation) {
        return false;
      }
    }
    
    return true;
  });

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
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0E14]">
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
    if ((window as any).__isExportingPDF) {
      console.warn("PDF export already in progress.");
      return;
    }

    const originalElement = document.getElementById("proposal-pdf-content");
    if (!originalElement) return;

    (window as any).__isExportingPDF = true;
    setIsExporting(true);

    // Create a global floating progress toast that survives navigation
    let toast = document.getElementById("pdf-export-toast");
    if (!toast) {
      toast = document.createElement('div');
      toast.id = "pdf-export-toast";
      toast.className = "fixed bottom-6 right-6 z-[99999] bg-[#0B0E14] text-white p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-4 min-w-[320px] transition-all duration-500 transform translate-y-0 opacity-100";
      toast.innerHTML = `
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div class="flex-1 pt-1">
            <h4 class="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">Generating PDF</h4>
            <p class="text-[9px] text-white/50 uppercase tracking-widest font-bold progress-text">0% Complete</p>
          </div>
        </div>
        <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-[#99CB48] shadow-[0_0_10px_#99CB48] transition-all duration-300 progress-bar" style="width: 0%"></div>
        </div>
      `;
      document.body.appendChild(toast);
    }

    const updateProgress = (percent: number) => {
      setExportProgress(percent);
      const text = toast?.querySelector('.progress-text');
      const bar = toast?.querySelector('.progress-bar') as HTMLElement;
      if (text) text.innerHTML = `${percent}% Complete <span class="lowercase text-white/30 ml-1 font-normal">(background task)</span>`;
      if (bar) bar.style.width = `${percent}%`;
    };

    updateProgress(5);

    // Create a hidden PDF-only cloned container for export
    const exportContainer = document.createElement("div");
    exportContainer.style.position = "absolute";
    exportContainer.style.left = "-9999px";
    exportContainer.style.top = "0";
    exportContainer.style.width = "794px";
    exportContainer.style.opacity = "0";
    exportContainer.style.pointerEvents = "none";
    document.body.appendChild(exportContainer);

    try {
      console.log("[PDF Debug] Initializing high-precision client-side PDF export with cloned DOM...");
      updateProgress(10);
      
      // Find all target .proposal-page containers
      const originalPages = Array.from(originalElement.querySelectorAll(".proposal-page"));
      console.log(`[PDF Debug] Found ${originalPages.length} pages to render.`);

      if (originalPages.length === 0) {
        throw new Error("No proposal pages found inside preview content container.");
      }

      // Clone pages into exportContainer
      originalPages.forEach((page) => {
        const clone = page.cloneNode(true) as HTMLElement;
        
        // Apply fixed A4 sizing and styling only to cloned page
        clone.style.setProperty('width', '794px', 'important');
        clone.style.setProperty('height', '1123px', 'important');
        clone.style.setProperty('min-height', '1123px', 'important');
        clone.style.setProperty('max-height', '1123px', 'important');
        clone.style.setProperty('overflow', 'hidden', 'important');
        clone.style.setProperty('background', '#ffffff', 'important');
        clone.style.setProperty('box-sizing', 'border-box', 'important');
        clone.style.setProperty('margin', '0', 'important');
        clone.style.setProperty('padding', '0', 'important');
        clone.style.setProperty('position', 'relative', 'important');
        
        // Remove export-problematic styles from cloned pages
        clone.style.setProperty('box-shadow', 'none', 'important');
        clone.style.setProperty('outline', 'none', 'important');
        clone.style.setProperty('border', 'none', 'important');
        clone.style.setProperty('transform', 'none', 'important');
        clone.style.setProperty('zoom', '1', 'important');
        clone.style.setProperty('filter', 'none', 'important');
        clone.style.setProperty('backdrop-filter', 'none', 'important');
        clone.style.setProperty('animation', 'none', 'important');
        clone.style.setProperty('transition', 'none', 'important');
        clone.style.setProperty('border-radius', '0', 'important');

        exportContainer.appendChild(clone);
      });

      exportContainer.classList.add('pdf-export-mode');
      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .pdf-export-mode * {
          font-family: "Outfit", Arial, sans-serif !important;
          outline: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
        }
      `;
      exportContainer.appendChild(styleEl);
      
      // Sanitize remote images to fix CSP blocking in html-to-image
      const exportImages = Array.from(exportContainer.querySelectorAll("img"));
      exportImages.forEach((img) => {
        if (img.src.includes("api.microlink.io")) {
          const fallback = img.getAttribute("data-fallback-src");
          if (fallback) {
            // Add a timestamp to bypass any browser cache that might hold the broken state
            img.src = fallback;
          } else {
            // Invisible 1x1 pixel fallback if no placeholder exists
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
          }
        }
      });
      
      // 1. Wait for web fonts and images to load completely inside cloned container
      await waitForAssets(exportContainer);
      updateProgress(20);

      // Allow browser layout engine to paint the cloned unscaled DOM elements
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProgress(30);

      // Dynamic import html-to-image and jsPDF to optimize bundle sizes
      const { toCanvas } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      // Add export quality config for high quality rendering (target: 5MB-10MB)
      const PDF_EXPORT_CONFIG = {
        pixelRatio: 2,
        imageType: "image/jpeg",
        quality: 0.92,
        compression: "MEDIUM" as const
      };

      // Use exact a4 dimensions in mm
      const pdf = new jsPDF("p", "mm", "a4");

      const rawPages = Array.from(exportContainer.querySelectorAll(".proposal-page"))
        .filter((el) => el instanceof HTMLElement) as HTMLElement[];
        
      const validPages = rawPages.filter((page) => {
        const hasText = page.textContent && page.textContent.trim().length > 0;
        const hasMedia = page.querySelector("img, svg, canvas, a, button");
        const hasHeight = page.getBoundingClientRect().height > 20;
        return (hasText || hasMedia) && hasHeight;
      });

      console.log(`[PDF Debug] Found ${validPages.length} valid pages to render`);

      for (let i = 0; i < validPages.length; i++) {
        const pageEl = validPages[i];
        console.log(`[PDF Debug] Capturing valid page ${i + 1}/${validPages.length}...`);
        
        const progress = 30 + Math.round((i / validPages.length) * 65);
        updateProgress(progress);

        // Use html-to-image to generate canvas first instead of direct PNG
        const canvas = await toCanvas(pageEl, {
          width: 794,
          height: 1123,
          pixelRatio: PDF_EXPORT_CONFIG.pixelRatio,
          cacheBust: false,
          backgroundColor: "#ffffff"
        });

        // Ensure transparent backgrounds are filled white before JPEG conversion
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Convert canvas to compressed JPEG
        const jpegDataUrl = canvas.toDataURL(PDF_EXPORT_CONFIG.imageType, PDF_EXPORT_CONFIG.quality);

        if (i > 0) {
          pdf.addPage("a4", "portrait");
        }
        
        pdf.addImage(jpegDataUrl, "JPEG", 0, 0, 210, 297, undefined, PDF_EXPORT_CONFIG.compression);

        // Keep clickable links working on cloned page
        const pageRect = pageEl.getBoundingClientRect();
        if (pageRect.width > 0 && pageRect.height > 0) {
          // Convert DOM pixel positions to A4 PDF millimeters correctly
          const scaleX = 210 / pageRect.width;
          const scaleY = 297 / pageRect.height;
          const anchors = Array.from(pageEl.querySelectorAll("a[href]"));
          
          let addedLinksCount = 0;

          anchors.forEach((link) => {
            let href = link.getAttribute("href");
            if (href && !href.startsWith("#") && href !== "javascript:void(0)") {
              
              // Only add valid external links or relative paths resolved to absolute URLs
              if (!href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
                 href = new URL(href, window.location.origin).href;
              }

              const linkRect = link.getBoundingClientRect();
              const xMm = (linkRect.left - pageRect.left) * scaleX;
              const yMm = (linkRect.top - pageRect.top) * scaleY;
              const widthMm = linkRect.width * scaleX;
              const heightMm = linkRect.height * scaleY;
              
              if (widthMm > 0 && heightMm > 0) {
                pdf.link(xMm, yMm, widthMm, heightMm, { url: href });
                addedLinksCount++;
              }
            }
          });
          
          console.log(`[PDF Debug] Added ${addedLinksCount} clickable links on page ${i + 1}`);
        }

        // Clean up all canvas objects after each page render to reduce browser memory
        canvas.width = 0;
        canvas.height = 0;
      }

      updateProgress(95);

      // Calculate filename
      const refId = (proposal as any).referenceId || proposal.client?.referenceId || "proposal";
      const title = (proposal as any).proposalTitle || proposal.client?.proposalTitle || "Weblozy";
      const filename = `${refId}_${title}.pdf`.replace(/\s+/g, '_');

      console.log(`[PDF Debug] Downloading PDF file: ${filename}`);
      pdf.save(filename);

      // Track download
      if (proposal.id) {
        try {
          // Import dynamic to avoid top-level issues if any
          const { updateProposal } = await import("@/lib/firestore");
          await updateProposal(proposal.id, { isDownloaded: true, client: { ...proposal.client, status: 'Sent' } });
        } catch(e) {
          console.error("Failed to update download status", e);
        }
      }

      updateProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.error("High-precision PDF download failed:", err);
    } finally {
      // Remove cloned export container from DOM
      if (document.body.contains(exportContainer)) {
        document.body.removeChild(exportContainer);
      }
      setIsExporting(false);
      setExportProgress(0);
      (window as any).__isExportingPDF = false;

      // Animate and remove toast
      if (toast) {
        toast.style.transform = "translate-y-10";
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast && document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 500);
      }
    }
  };

  const handlePrint = () => {
    exportPDF();
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#F8FAFC]" style={{
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


    </div>
  );
}
