import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProposal } from "@/lib/firestore";
import {
  FileText,
  Clock,
  ShieldAlert
} from "lucide-react";
import { Proposal } from "@/types/proposal";
import ProposalPDF from "@/components/Proposal/pages2";

export default function PublicProposalPreview() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("cover");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getProposal(id);
        if (data) {
          // Check expiry
          if (data.shareExpiry && Date.now() > data.shareExpiry) {
            setError("expired");
          } else if (!data.shareExpiry) {
            setError("invalid");
          } else {
            setProposal(data as Proposal);
          }
        } else {
          setError("not_found");
        }
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setError("error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  useEffect(() => {
    if (!proposal?.shareExpiry) return;

    const updateTimer = () => {
      const remaining = proposal.shareExpiry! - Date.now();
      if (remaining <= 0) {
        setError("expired");
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [proposal?.shareExpiry]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const pages = contentRef.current.querySelectorAll('.proposal-page');
      let currentSection = "cover";
      const scrollPosition = contentRef.current.scrollTop + 200;

      pages.forEach((page) => {
        const htmlElement = page as HTMLElement;
        if (htmlElement.offsetTop <= scrollPosition) {
          currentSection = page.id.replace('proposal-page-', '');
        }
      });
      setActiveSection(currentSection);
    };

    const scrollContainer = contentRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [proposal]);

  const scrollToPage = (pageId: string) => {
    setActiveSection(pageId);
    const el = document.getElementById(`proposal-page-${pageId}`);
    if (el && contentRef.current) {
      const topPos = el.offsetTop - contentRef.current.offsetTop;
      contentRef.current.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0E14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-white font-medium uppercase tracking-widest text-sm">Loading Proposal...</p>
        </div>
      </div>
    );
  }

  if (error === "expired") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0E14]">
        <div className="text-center space-y-6 max-w-md p-8 bg-white/5 rounded-3xl border border-white/10">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Link Expired</h2>
            <p className="text-slate-400">This secure preview link was only valid for 10 minutes and has now expired. Please request a new link.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#0B0E14]">
        <div className="text-center space-y-6 max-w-md p-8 bg-white/5 rounded-3xl border border-white/10">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Access Denied</h2>
            <p className="text-slate-400">This proposal link is invalid or you do not have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  // Same pageConfig setup
  const config = proposal.pageConfig || [];
  const isActive = (pageId: string) => {
    const page = config.find(p => p.id === pageId);
    return page ? page.isActive : true;
  };

  const defaultPages = [
    { id: 'cover', label: 'Cover Page' },
    { id: 'letter', label: 'Cover Letter' },
    { id: 'about', label: 'About Us' },
    { id: 'philosophy', label: 'Our Philosophy' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'roi', label: 'ROI' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'conclusion', label: 'Conclusion' }
  ];

  const visiblePages = defaultPages.filter(p => isActive(p.id));
  const pageIconMap: Record<string, any> = {
    cover: FileText,
    letter: FileText,
    about: FileText,
    philosophy: FileText,
    portfolio: FileText,
    roi: FileText,
    pipeline: FileText,
    commercial: FileText,
    milestones: FileText,
    conclusion: FileText
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-[#F8FAFC]" ref={contentRef} style={{
      backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 no-print shadow-sm h-20 w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Minimal Logo space if needed, otherwise empty to balance flex */}
            <div className="w-10"></div>
          </div>

          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-1 inline-block">Secure Preview</span>
            <h2 className="text-sm sm:text-base font-black text-[#0B0E14] uppercase tracking-wider truncate max-w-[200px] sm:max-w-[400px]">
              {proposal.client?.proposalTitle || "Strategic Roadmapping"}
            </h2>
          </div>

          <div className="flex items-center">
            {timeLeft !== null && (
              <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/50">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-black text-slate-700 tracking-widest tabular-nums">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start justify-start relative">
        <div className="hidden lg:block w-[260px] shrink-0 sticky top-[112px] z-20 space-y-4 no-print">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100/50 pb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B0E14]">Document Outline</h3>
              <span className="text-[9px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase">
                {visiblePages.length} Pages
              </span>
            </div>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
              {visiblePages.map((page) => {
                const PageIcon = pageIconMap[page.id] || FileText;
                const isCurrent = activeSection === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => scrollToPage(page.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                      isCurrent
                        ? "bg-primary/5 text-primary border border-primary/20 shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                    }`}
                  >
                    <PageIcon className={`w-4 h-4 transition-colors ${isCurrent ? 'text-primary' : 'text-slate-400'}`} />
                    <span className={`text-[11px] uppercase tracking-wider transition-all ${isCurrent ? 'font-bold' : 'font-semibold'}`}>
                      {page.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0" id="proposal-content">
          <div className="max-w-[794px] mx-auto bg-white shadow-2xl overflow-hidden rounded-xl">
            <ProposalPDF proposal={proposal} isExporting={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
