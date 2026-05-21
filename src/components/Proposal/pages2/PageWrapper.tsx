import React from "react";
import bannerLogo from "@/assets/banner_logo.png";

interface PageWrapperProps {
  children: React.ReactNode;
  pageNum: number;
  className?: string;
  title?: string;
}

const PageWrapper = ({ children, pageNum, className = "", title = "" }: PageWrapperProps) => (
  <section className={`a4-page bg-white shadow-xl ${className} flex flex-col`}>
    <div className="watermark text-[#99CB48]/5">WEBLOZY</div>
    
    {/* Page Header */}
    <div className="relative z-20 flex justify-between items-center mb-6 border-b pb-4 border-slate-100 proposal-header">
       <div className="flex items-center gap-3">
          <a href="https://www.weblozy.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src={bannerLogo} alt="Weblozy" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} className="opacity-90" />
          </a>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="text-[9px] font-black tracking-[0.12em] text-slate-400">{title}</div>
       </div>
       <div className="text-[8px] font-extrabold tracking-[0.15em] text-slate-300">Corporate / Strategic</div>
    </div>

    <div className="relative z-10 flex-1 flex flex-col min-h-0 proposal-content">
      {children}
    </div>

    {/* Professional Footer */}
    <div className="relative z-20 mt-6 pt-6 border-t border-slate-100 flex justify-between items-center proposal-footer">
        <div className="flex items-center gap-6">
          <a href="https://www.weblozy.com" target="_blank" rel="noopener noreferrer" className="text-[7px] font-bold tracking-[0.12em] text-slate-300 hover:text-[#99CB48] transition-colors">
            © WEBLOZY • WE AUTOMATE BUSINESS • WWW.WEBLOZY.COM
          </a>
        </div>
       <div className="text-[9px] font-black tracking-[0.15em] text-[#99CB48]">PAGE 0{pageNum}</div>
    </div>
  </section>
);

export default PageWrapper;
