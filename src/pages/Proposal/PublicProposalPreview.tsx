import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProposal } from "@/lib/firestore";
import { db } from "@/lib/firebase";
import { 
  FileText, Clock, ShieldAlert, FileWarning
} from "lucide-react";
import { Proposal } from "@/types/proposal";
import ProposalPDF from "@/components/Proposal/pages2";
import bannerLogo from "@/assets/banner_logo.png";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";

export default function PublicProposalPreview() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("cover");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    const docRef = doc(db, "proposals", id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setIsLoading(false);
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Proposal;
        
        // Real-time expiry check
        if (data.shareExpiry && Date.now() > data.shareExpiry) {
          setError("expired");
          setProposal(null);
        } else if (!data.shareExpiry) {
          setError("invalid");
          setProposal(null);
        } else {
          setProposal(data);
          setError(null);
        }
      } else {
        setError("not_found");
        setProposal(null);
      }
    }, (err) => {
      console.error("Error fetching proposal:", err);
      setError("error");
      setIsLoading(false);
    });

    return () => unsubscribe();
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
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P / Cmd+P (Print) and Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        toast.warning("This document is restricted. Downloading or printing is not allowed.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    }} onContextMenu={(e) => e.preventDefault()}>
      <style>
        {`
          @media print {
            body { display: none !important; }
          }
          .watermark-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('${bannerLogo}');
            background-repeat: space;
            background-size: 300px;
            opacity: 0.03;
            pointer-events: none;
            z-index: 0;
            transform: rotate(-30deg) scale(1.5);
            mix-blend-mode: multiply;
          }
        `}
      </style>
      <div className="watermark-overlay"></div>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 no-print shadow-sm h-20 w-full">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 sm:w-24"></div>
          </div>

          <div className="text-center flex flex-col items-center">
            <img src={bannerLogo} alt="Weblozy Logo" className="h-6 sm:h-8 mb-1 object-contain" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-1 inline-block">Secure Preview</span>
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

      <div className="max-w-[1100px] mx-auto px-4 py-8 lg:py-12 flex justify-center relative z-10">
        <div className="w-full max-w-[794px]" id="proposal-content">
          <div className="relative pointer-events-none select-none">
            <ProposalPDF proposal={proposal} isExporting={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
