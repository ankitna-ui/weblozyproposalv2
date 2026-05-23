import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { WifiOff, ShieldAlert, Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import banner2Logo from "@/assets/banner2_logo.png";

interface ErrorPageProps {
  type?: "404" | "offline" | "server";
}

export default function ErrorPage({ type: propType }: ErrorPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentType, setCurrentType] = useState<"404" | "offline" | "server">("404");

  // Determine type based on props, location state, or connection status
  useEffect(() => {
    if (propType) {
      setCurrentType(propType);
    } else if (location.state?.type) {
      setCurrentType(location.state.type);
    } else if (!navigator.onLine) {
      setCurrentType("offline");
    } else {
      setCurrentType("404");
    }
  }, [propType, location.state]);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate connection or server check delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (navigator.onLine) {
      setIsRetrying(false);
      navigate("/");
    } else {
      setIsRetrying(false);
    }
  };

  const getPageContent = () => {
    switch (currentType) {
      case "offline":
        return {
          icon: WifiOff,
          badge: "Sync Severed",
          badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          glowColor: "shadow-amber-500/10 border-amber-200/50",
          title: "Offline Mode Active",
          description: "Your system has temporarily lost connection to the Weblozy cloud matrix. Verify your local network protocols to synchronize your strategic workspace.",
          primaryBtnText: "Reconnect Node",
          showRetry: true
        };
      case "server":
        return {
          icon: ShieldAlert,
          badge: "Security Alert",
          badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
          glowColor: "shadow-red-500/10 border-red-200/50",
          title: "Protocol Interrupted",
          description: "A security anomaly or database verification protocol failed. Please return to the command dashboard to re-verify your authorization credentials.",
          primaryBtnText: "Return to Security Hub",
          showRetry: false
        };
      case "404":
      default:
        return {
          icon: AlertTriangle,
          badge: "Protocol 404",
          badgeColor: "bg-primary/10 text-primary border-primary/20",
          glowColor: "shadow-primary/10 border-slate-200/50",
          title: "Route Severed",
          description: "The requested sequence index or document page does not exist in our secure digital archives. The link has either expired or been relocated.",
          primaryBtnText: "Return to Hub",
          showRetry: false
        };
    }
  };

  const content = getPageContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#F8FAFC] relative overflow-hidden select-none" style={{
      backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header with Weblozy Logo */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-slate-100 bg-white/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <img src={banner2Logo} alt="Partners Logo" className="h-10 sm:h-12 object-contain max-w-[280px]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Core OS</span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 tabular-nums">VERIFIED // STABLE-V2</span>
      </header>

      {/* Central Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center space-y-8"
        >
          {/* Pulsing Icon Shield */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-3xl bg-slate-100 dark:bg-white/50 border border-slate-200/40 shadow-2xl blur-[4px] pointer-events-none" />
            <motion.div 
              animate={{ 
                scale: [1, 1.03, 1],
                boxShadow: ["0 0 20px rgba(0,0,0,0.02)", "0 0 35px rgba(153,203,72,0.12)", "0 0 20px rgba(0,0,0,0.02)"]
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={`relative z-10 w-28 h-28 rounded-3xl bg-white flex items-center justify-center border shadow-xl transition-all duration-500 ${content.glowColor}`}
            >
              <IconComponent size={42} className={currentType === "offline" ? "text-amber-500" : currentType === "server" ? "text-red-500" : "text-primary"} />
            </motion.div>

            {/* Glowing active outer pulse */}
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-ping ${currentType === "offline" ? "bg-amber-500" : currentType === "server" ? "bg-red-500" : "bg-primary"}`} />
            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${currentType === "offline" ? "bg-amber-500" : currentType === "server" ? "bg-red-500" : "bg-primary"}`} />
          </div>

          {/* Styled Label Badge */}
          <div className="flex justify-center">
            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] border ${content.badgeColor}`}>
              {content.badge}
            </span>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#0B0E14] uppercase tracking-wider">
              {content.title}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500/80 leading-relaxed font-bold tracking-wide max-w-sm mx-auto">
              {content.description}
            </p>
          </div>

          {/* Action Grid */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {content.showRetry && (
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                variant="outline" 
                className="w-full sm:w-auto h-12 px-6 rounded-2xl border-slate-200 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} className={isRetrying ? "animate-spin text-amber-500" : ""} />
                <span>{isRetrying ? "Retrying Matrix..." : content.primaryBtnText}</span>
              </Button>
            )}
            
            <Button 
              onClick={() => navigate("/")} 
              className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-primary hover:bg-[#88B540] text-slate-900 dark:text-white shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
            >
              <Home size={14} />
              <span>{content.showRetry ? "Return Hub" : content.primaryBtnText}</span>
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer Branding Info */}
      <footer className="w-full py-6 text-center border-t border-slate-100 bg-white/20 backdrop-blur-sm z-10">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} WEBLOZY GLOBAL SOLUTIONS • SECURE NETWORK PROTOCOLS
        </p>
      </footer>
    </div>
  );
}
