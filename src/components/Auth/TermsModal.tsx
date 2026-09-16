import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, FileText, Lock, EyeOff, ShieldAlert } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#030910]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-full bg-[#07131C] border border-[#142A38] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8),_0_0_30px_rgba(52,211,153,0.05)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 px-8 py-6 border-b border-[#142A38] flex items-center justify-between bg-[#0A1118]/50 backdrop-blur-xl relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#34D399]/20 to-[#38BDF8]/10 flex items-center justify-center border border-[#34D399]/20">
                  <ShieldCheck size={20} className="text-[#34D399]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Weblozy Workspace Policies</h2>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">Strict Confidentiality & Rules of Engagement</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#142A38] text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar relative z-0">
              
              {/* Background watermark */}
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-[#142A38]/30 text-[180px] font-black pointer-events-none select-none tracking-tighter mix-blend-overlay">
                WEBLOZY
              </div>

              {/* Section 1 */}
              <section className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-[#34D399]" size={20} />
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">1. Strict Confidentiality</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#0A1118]/80 border border-[#142A38] space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    By accessing the Weblozy workspace, you are entering a strictly confidential, end-to-end encrypted environment. All proposals, commercial frameworks, client pipelines, and architectural documents generated or viewed within this system are classified as <span className="text-[#38BDF8] font-bold">Weblozy Internal Highly Confidential</span>.
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-2 ml-2">
                    <li>No unauthorized sharing of proposal links to non-clients.</li>
                    <li>No local downloading of pipeline architecture without explicit managerial approval.</li>
                    <li>Any leak of commercial data will result in immediate termination of the access key.</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <EyeOff className="text-[#F59E0B]" size={20} />
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">2. Anti-Espionage & Tracking</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#0A1118]/80 border border-[#142A38] space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    To protect proprietary technology and pricing models, Weblozy utilizes advanced tracking on all generated links and workspace sessions.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="p-4 rounded-xl bg-[#030910] border border-[#142A38]">
                      <h4 className="text-xs font-bold text-white mb-1 uppercase">Link Expiry Protocol</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Generated proposal links are tightly controlled. Refreshing a "Burn-After-Reading" link post-expiry will permanently void the preview.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#030910] border border-[#142A38]">
                      <h4 className="text-xs font-bold text-white mb-1 uppercase">Audit Logging</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Every keystroke, login attempt, and document view is permanently logged with IP and Device Fingerprint data.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="text-[#EF4444]" size={20} />
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">3. Copy & Print Restrictions</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/20 space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Digital Rights Management (DRM) is actively enforced on all Proposal Previews.
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-200/70 space-y-2 ml-2">
                    <li><strong className="text-red-400">Printing Disabled:</strong> Using Ctrl+P / Cmd+P will trigger a security violation overlay.</li>
                    <li><strong className="text-red-400">No Screenshots:</strong> Dynamic blending watermarks ensure screenshots contain trackable employee IDs.</li>
                    <li><strong className="text-red-400">No Text Selection:</strong> Copying raw text from proposals is technically disabled.</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-[#34D399]" size={20} />
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">4. Authorized Usage</h3>
                </div>
                <div className="p-5 rounded-2xl bg-[#0A1118]/80 border border-[#142A38] space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    You agree to use the Weblozy dashboard solely for the purpose of generating, managing, and tracking client proposals on behalf of Weblozy. Any attempt to reverse engineer the Quick Calculator logic, bypass the Firebase security rules, or scrape the database will trigger automated legal compliance protocols.
                  </p>
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="shrink-0 px-8 py-5 border-t border-[#142A38] bg-[#0A1118] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center sm:text-left">
                By clicking "I agree" in the form, you accept these terms.
              </p>
              <button 
                onClick={onClose}
                className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-[#6EE7B7] to-[#34D399] text-[#030910] font-black uppercase tracking-[0.15em] text-xs rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all hover:scale-[1.02]"
              >
                Acknowledge & Close
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
