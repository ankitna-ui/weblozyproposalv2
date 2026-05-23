import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Zap, ChevronRight, ArrowLeft, Mail, Lock, CheckCircle2, Cpu, Globe, Database, UserCheck, IdCard, Eye, EyeOff, Activity, Terminal, LockKeyhole, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import banner2Logo from "@/assets/banner2_logo.png";
import bannerLogo from "@/assets/banner_logo.png";
import weblozyLogo from "@/assets/weblozy-logo.png";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password" | "success" | "loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing System...");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode === "resetPassword" && oobCode) {
      setAuthMode("reset-password");
    }
  }, [mode, oobCode]);

  useEffect(() => {
    setError(null);
  }, [email, password, newPassword, confirmPassword, fullName, employeeId, authMode]);

  useEffect(() => {
    if (authMode === "loading") {
      const texts = [
        "Establishing Secure Bridge...",
        "Synchronizing Strategic Modules...",
        "Decrypting Executive Assets...",
        "Validating Authority Tokens...",
        "Launching Weblozy OS..."
      ];
      let currentTextIndex = 0;

      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => navigate("/"), 500);
            return 100;
          }

          if (prev % 20 === 0 && prev > 0) {
            currentTextIndex = Math.min(currentTextIndex + 1, texts.length - 1);
            setLoadingText(texts[currentTextIndex]);
          }

          return prev + 1;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [authMode, navigate]);

  const getBrandedErrorMessage = (error: any): string => {
    if (!error) return "Authentication protocol failed. Please verify credentials.";

    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Weblozy System Alert: Invalid credentials for this corporate terminal.";
      case "auth/email-already-in-use":
        return "Weblozy System Alert: This official email is already registered in the system database. Please login or reset your credentials.";
      case "auth/invalid-email":
        return "Weblozy System Alert: Invalid email address format. Only official @weblozy.com and @weblozy.in accounts are accepted.";
      case "auth/weak-password":
        return "Weblozy System Alert: Access Key does not meet security protocols. Minimum 6 characters required.";
      case "auth/too-many-requests":
        return "Weblozy System Alert: Access temporarily suspended due to multiple failed attempts. Try again later.";
      case "auth/network-request-failed":
        return "Weblozy System Alert: Network communication failure. Please verify corporate gateway connectivity.";
      default:
        const message = error.message || "Authentication protocol failed. Please verify credentials.";
        return message.replace(/Firebase/gi, "Weblozy System");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Advanced Local Validations
    if (authMode === "login" || authMode === "signup" || authMode === "forgot-password") {
      if (!email.trim()) {
        setError("Operator Validation Failure: Terminal ID (Email) cannot be empty.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Security Alert: Invalid Terminal ID (Email) format.");
        return;
      }
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setError("Operator Validation Failure: Employee Full Name is required.");
        return;
      }
      if (!employeeId.trim()) {
        setError("Operator Validation Failure: Employee ID is required.");
        return;
      }
      if (!confirmPassword) {
        setError("Security Alert: Please confirm your Access Key.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Security Alert: Access keys do not match.");
        return;
      }
    }

    if (authMode === "login" || authMode === "signup") {
      if (!password) {
        setError("Security Alert: Access Key (Password) cannot be empty.");
        return;
      }
      if (password.length < 6) {
        setError("Security Alert: Access Key must contain at least 6 characters.");
        return;
      }
    }

    if (authMode === "reset-password") {
      if (!newPassword || !confirmPassword) {
        setError("Security Alert: Keys cannot be empty.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Security Alert: New Access Key must contain at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Security Alert: Security keys do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const isDomainAuthorized = (emailAddr: string) => {
        const normalized = emailAddr.trim().toLowerCase();
        return normalized.endsWith("@weblozy.com") || normalized.endsWith("@weblozy.in");
      };

      if (authMode === "login") {
        if (!isDomainAuthorized(email)) {
          setError("Security Access Alert: Unauthorized Domain. Only official @weblozy.com and @weblozy.in accounts are permitted.");
          setLoading(false);
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (!user.emailVerified && !isLocal) {
          await sendEmailVerification(user);
          await signOut(auth);
          setError("Activation Pending: A secure verification link was sent to your official inbox. Please verify your email before terminal access is granted.");
          setLoading(false);
          return;
        }

        toast.success("Identity Verified. Accessing Strategic Dashboard.");
        setAuthMode("loading");
      } else if (authMode === "signup") {
        if (!isDomainAuthorized(email)) {
          setError("Security Access Alert: Unauthorized Domain. Only official @weblozy.com and @weblozy.in accounts can establish credentials.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Persist complete employee profile details into Firestore database under users collection
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          employeeId: employeeId.trim(),
          role: "operator",
          createdAt: new Date().toISOString()
        });

        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        if (isLocal) {
          toast.success("Local Identity Setup Approved. Accessing Workspace.");
          setAuthMode("loading");
        } else {
          await sendEmailVerification(userCredential.user);
          await signOut(auth);
          toast.success("Identity Setup Initiated. Activation link dispatched.");
          setAuthMode("success");
        }
      } else if (authMode === "forgot-password") {
        await sendPasswordResetEmail(auth, email);
        toast.success("Recovery Protocol Dispatched to your inbox.");
        setAuthMode("success");
      } else if (authMode === "reset-password") {
        if (oobCode) {
          await confirmPasswordReset(auth, oobCode, newPassword);
          toast.success("Security Key Re-established successfully.");
          setAuthMode("success");
        }
      }
    } catch (error: any) {
      console.error(error);
      const friendlyMessage = getBrandedErrorMessage(error);
      setError(friendlyMessage);
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case "signup": return "Operator Onboarding";
      case "forgot-password": return "Account Recovery";
      case "reset-password": return "Re-establish Keys";
      case "success": return "System Dispatch";
      default: return "Workstation Login";
    }
  };

  const getSubtitle = () => {
    switch (authMode) {
      case "signup": return "Establish your secure credentials inside the corporate index.";
      case "forgot-password": return "Request a security link to recover your terminal access keys.";
      case "reset-password": return "Set a new high-strength password to authorize your session.";
      case "success": return "Your secure request was successfully dispatched to the server.";
      default: return "Welcome back. Initialize your workspace terminal to access Proposals.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] dark:bg-[#06080A] font-sans transition-all duration-500 ease-in-out overflow-y-auto p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {authMode === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full flex flex-col items-center justify-center space-y-10 text-center relative z-10"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-primary/15 blur-[50px] animate-pulse rounded-full" />
              <motion.img
                src={weblozyLogo}
                alt="Weblozy"
                className="w-full h-full object-contain relative z-10 p-2 brightness-0 dark:invert"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <div className="space-y-6 max-w-sm w-full px-6">
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] leading-none">{loadingText}</h2>
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">Access Channel Validating</p>
              </div>

              <div className="relative space-y-1.5">
                <div className="h-[1.5px] w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#99CB48]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="text-[8px] font-black text-slate-500 dark:text-white/20 uppercase tracking-[0.3em]">
                  <span>System Logic Hook: {loadingProgress}%</span>
                </div>
              </div>
              {/* Institutional Footer (Moved to Left) */}
              <div className="relative z-10 pt-10 flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black">
                <LockKeyhole className="w-3 h-3 text-slate-400 dark:text-[#99CB48]/80" />
                <span>AES-256 Encrypted Connection</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1050px] min-h-[500px] max-h-[95vh] h-auto lg:h-[85vh] bg-white dark:bg-[#0A0D14] rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none overflow-hidden border border-slate-200/50 dark:border-white/[0.03] flex flex-col lg:grid lg:grid-cols-2 relative z-10"
          >
            {/* ─── LEFT PANEL (COMMAND CENTER DECK) ─── */}
            <div className="hidden lg:flex flex-col justify-between p-6 xl:p-10 bg-white dark:bg-gradient-to-br dark:from-[#060A14] dark:via-[#0A0D14] dark:to-[#040508] relative overflow-hidden text-slate-900 dark:text-white shadow-none dark:shadow-[20px_0_40px_rgba(0,0,0,0.5)] z-10 border-r border-slate-100 dark:border-white/[0.03] lg:overflow-y-auto custom-scrollbar">
              
              {/* Dynamic Wave Graphic */}
              <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none opacity-80">
                 {/* Radial base glow */}
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(153,203,72,0.15),transparent_70%)]" />
                 
                 {/* Abstract Perspective Grid */}
                 <div 
                   className="absolute inset-0 opacity-40"
                   style={{
                     backgroundImage: `linear-gradient(rgba(153,203,72,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(153,203,72,0.2) 1px, transparent 1px)`,
                     backgroundSize: '40px 20px',
                     transform: 'perspective(600px) rotateX(65deg) scale(2.5) translateY(20%)',
                     transformOrigin: 'bottom',
                     maskImage: 'linear-gradient(to top, black 20%, transparent 80%)'
                   }}
                 />

                 {/* Simulated glowing nodes / rays */}
                 <motion.div 
                   animate={{ height: ['40px', '120px', '40px'], opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                   className="absolute bottom-[10%] left-[20%] w-[1.5px] bg-gradient-to-t from-transparent to-[#99CB48] shadow-[0_0_15px_#99CB48]" 
                 />
                 <motion.div 
                   animate={{ height: ['60px', '160px', '60px'], opacity: [0.4, 0.8, 0.4] }}
                   transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                   className="absolute bottom-[5%] left-[50%] w-[2px] bg-gradient-to-t from-transparent to-[#99CB48] shadow-[0_0_20px_#99CB48]" 
                 />
                 <motion.div 
                   animate={{ height: ['30px', '90px', '30px'], opacity: [0.3, 0.9, 0.3] }}
                   transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                   className="absolute bottom-[15%] right-[25%] w-[1.5px] bg-gradient-to-t from-transparent to-[#99CB48] shadow-[0_0_10px_#99CB48]" 
                 />
              </div>

              {/* Top Section */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <img src={bannerLogo} alt="Weblozy" className="block dark:hidden h-10 w-auto object-contain" />
                  <img src={banner2Logo} alt="Weblozy" className="hidden dark:block h-10 w-auto object-contain brightness-0 invert" />
                </div>
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm dark:shadow-lg">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black">System Time</span>
                  <span className="text-[11px] font-mono text-[#99CB48] font-bold tracking-[0.1em]">{time || "12:00:00"}</span>
                </div>
              </div>

              {/* Middle Title Section */}
              <div className="relative z-10 max-w-xl pb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#99CB48]/10 border border-[#99CB48]/20 rounded-full mb-4 shadow-[0_0_20px_rgba(153,203,72,0.1)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48] shadow-[0_0_8px_#99CB48] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#99CB48]">Strategic Core OS V3.2</span>
                </div>
                
                <h1 className="text-[32px] lg:text-[40px] xl:text-[46px] font-black leading-[0.95] tracking-tighter uppercase text-slate-900 dark:text-white mb-3 xl:mb-4 drop-shadow-sm dark:drop-shadow-2xl">
                  {authMode === "signup" ? "Absolute" : "Welcome Back,"}<br />
                  <span className="text-[#99CB48] relative block mt-2">
                    {authMode === "signup" ? "Authority." : "Commander."}
                  </span>
                </h1>
                <div className="w-16 h-[3px] bg-[#99CB48] mt-4 mb-6 rounded-full shadow-[0_0_10px_rgba(153,203,72,0.3)]" />
                
                <p className="text-slate-600 dark:text-slate-400 text-[12px] xl:text-[13px] leading-relaxed max-w-sm font-medium tracking-wide drop-shadow-sm dark:drop-shadow-lg">
                  {authMode === "signup" 
                    ? "Establish your secure credentials and initialize your corporate workspace profile." 
                    : "Secure access to your strategic workspace and automation ecosystem."}
                </p>
              </div>

              {/* Bottom Features */}
              <div className="relative z-10 grid grid-cols-3 gap-6 pt-4 mt-4 border-t border-slate-200 dark:border-white/5">
                <div className="space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm dark:shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#99CB48]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Secure</h3>
                    <p className="text-[8px] text-slate-500 leading-relaxed font-medium">Enterprise grade<br/>security protocol</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm dark:shadow-lg">
                    <Zap className="w-3.5 h-3.5 text-[#99CB48]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Automated</h3>
                    <p className="text-[8px] text-slate-500 leading-relaxed font-medium">Intelligent automation<br/>at scale</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm dark:shadow-lg">
                    <Activity className="w-3.5 h-3.5 text-[#99CB48]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Strategic</h3>
                    <p className="text-[8px] text-slate-500 leading-relaxed font-medium">Data-driven decisions<br/>and insights</p>
                  </div>
                </div>
              </div>
              {/* Institutional Footer (Moved to Left) */}
              <div className="relative z-10 pt-10 flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-black">
                <LockKeyhole className="w-3 h-3 text-slate-400 dark:text-[#99CB48]/80" />
                <span>AES-256 Encrypted Connection</span>
              </div>
            </div>

            {/* ─── RIGHT PANEL (AUTH FORM) ─── */}
            <div className="flex flex-col justify-center items-center bg-white dark:bg-transparent relative p-6 sm:p-6 xl:p-10 h-full lg:overflow-y-auto custom-scrollbar">
               {/* Mobile Logo Fallback */}
               <div className="lg:hidden w-full max-w-md mb-0.50 flex justify-between items-center">
                 <img src={bannerLogo} alt="Weblozy" className="block dark:hidden h-8 w-auto object-contain transition-all" />
                 <img src={banner2Logo} alt="Weblozy" className="hidden dark:block h-8 w-auto object-contain transition-all" />
                 <div className="flex items-center gap-2 px-3 py-1 bg-[#99CB48]/10 rounded-full border border-[#99CB48]/20">
                    <div className="w-1 h-1 rounded-full bg-[#99CB48] animate-pulse" />
                    <span className="text-[8px] font-black text-[#99CB48] uppercase tracking-[0.2em]">OS V3.2</span>
                 </div>
               </div>

               <div className="w-full max-w-[380px] space-y-3 xl:space-y-4 py-4 lg:py-0">
                 
                 {/* Auth Headers */}
                 <div className="space-y-3">
                   <h2 className="text-[24px] sm:text-[28px] xl:text-[32px] font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none drop-shadow-sm">
                     {authMode === "login" ? <><span className="text-slate-900 dark:text-white">WORKSTATION</span> <span className="text-[#99CB48]">LOGIN</span></> : getTitle()}
                   </h2>
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#99CB48] mb-0.5">
                     <Lock className="w-3 h-3" />
                     <span>Authorized Access Only</span>
                   </div>
                   <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[360px]">
                     {getSubtitle()}
                   </p>
                 </div>

                 {/* Tab Switcher */}
                 {(authMode === "login" || authMode === "signup") && (
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       type="button"
                       onClick={() => { setAuthMode("login"); setError(null); }}
                       className={`py-2.5 px-3 flex items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                         authMode === "login"
                           ? "bg-[#bce67d] dark:bg-[#99CB48] border-[#bce67d] dark:border-[#99CB48] text-slate-900 dark:text-black shadow-md shadow-[#99CB48]/20"
                           : "bg-transparent dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                       }`}
                     >
                       <UserCheck className="w-3 h-3" />
                       Sign In (Authorized)
                     </button>
                     <button
                       type="button"
                       onClick={() => { setAuthMode("signup"); setError(null); }}
                       className={`py-2.5 px-3 flex items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                         authMode === "signup"
                           ? "bg-[#bce67d] dark:bg-[#99CB48] border-[#bce67d] dark:border-[#99CB48] text-slate-900 dark:text-black shadow-md shadow-[#99CB48]/20"
                           : "bg-transparent dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                       }`}
                     >
                       <IdCard className="w-3 h-3" />
                       Sign Up (New Employee)
                     </button>
                   </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-6">
                   {authMode === "success" ? (
                     <div className="text-center space-y-8 py-6">
                       <div className="mx-auto w-24 h-24 rounded-full bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center relative shadow-xl shadow-[#99CB48]/10">
                         <div className="absolute inset-0 rounded-full bg-[#99CB48]/5 animate-pulse" />
                         <CheckCircle2 className="w-10 h-10 text-[#99CB48] relative z-10" />
                       </div>
                       <div className="space-y-3">
                         <h3 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white leading-none">Identity Dispatch Complete</h3>
                         <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                           A secure activation protocol has been successfully transmitted to your inbox <span className="text-[#99CB48] font-black uppercase">{email}</span>. Please click the validation link inside your email to unlock your Proposal OS terminal.
                         </p>
                       </div>
                       <Button
                         type="button"
                         onClick={() => { setAuthMode("login"); setError(null); }}
                         className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] bg-[#99CB48] text-black hover:bg-[#88B540] rounded-xl shadow-xl shadow-[#99CB48]/20 transition-all active:scale-[0.98]"
                       >
                         Return to Login Hub
                       </Button>
                     </div>
                   ) : (
                     <>
                       <div className="space-y-3">
                         {/* Terminal ID (Company Email) */}
                         {(authMode === "login" || authMode === "signup" || authMode === "forgot-password") && (
                           <div className="space-y-1.5">
                             <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Terminal ID (Company Email)</Label>
                             <div className="relative group">
                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                               <Input
                                 type="email"
                                 placeholder="operator@weblozy.com"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-wide transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm"
                               />
                               {email && email.includes('@') && (
                                 <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#99CB48]" />
                               )}
                             </div>
                           </div>
                         )}

                         {/* Sign Up Fields */}
                         <AnimatePresence>
                         {authMode === "signup" && (
                           <motion.div
                             initial={{ opacity: 0, height: 0, marginTop: 0 }}
                             animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                             exit={{ opacity: 0, height: 0, marginTop: 0 }}
                             transition={{ duration: 0.3, ease: "easeInOut" }}
                             className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                           >
                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Employee Full Name</Label>
                               <div className="relative group">
                                 <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type="text"
                                   placeholder="Enter Name"
                                   value={fullName}
                                   onChange={(e) => setFullName(e.target.value)}
                                   className="h-9 pl-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-wide transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                               </div>
                             </div>

                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Employee ID</Label>
                               <div className="relative group">
                                 <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type="text"
                                   placeholder="Enter EMP-ID"
                                   value={employeeId}
                                   onChange={(e) => setEmployeeId(e.target.value)}
                                   className="h-9 pl-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-wide transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                               </div>
                             </div>
                           </motion.div>
                         )}
                         </AnimatePresence>

                         {/* Password Field */}
                         {authMode === "login" && (
                           <div className="space-y-1.5">
                             <div className="flex justify-between items-center px-1">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[9px]">Access Key (Password)</Label>
                               <button type="button" onClick={() => setAuthMode("forgot-password")} className="text-[9px] font-black text-[#99CB48] hover:text-[#88B540] uppercase tracking-[0.15em] transition-colors">Recover Password?</button>
                             </div>
                             <div className="relative group">
                               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                               <Input
                                 type={showPassword ? "text" : "password"}
                                 placeholder="••••••••"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-[0.3em] transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                               />
                               <button
                                 type="button"
                                 onClick={() => setShowPassword(prev => !prev)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#99CB48] transition-colors z-20"
                               >
                                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                               </button>
                             </div>
                           </div>
                         )}

                         {/* Sign Up Passwords */}
                         <AnimatePresence>
                         {authMode === "signup" && (
                           <motion.div
                             initial={{ opacity: 0, height: 0, marginTop: 0 }}
                             animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                             exit={{ opacity: 0, height: 0, marginTop: 0 }}
                             transition={{ duration: 0.3, ease: "easeInOut" }}
                             className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                           >
                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Access Key</Label>
                               <div className="relative group">
                                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type={showPassword ? "text" : "password"}
                                   placeholder="••••••••"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-[0.3em] transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => setShowPassword(prev => !prev)}
                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#99CB48] transition-colors z-20"
                                 >
                                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                               </div>
                             </div>

                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Confirm Access Key</Label>
                               <div className="relative group">
                                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type={showConfirmPassword ? "text" : "password"}
                                   placeholder="••••••••"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-[0.3em] transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => setShowConfirmPassword(prev => !prev)}
                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#99CB48] transition-colors z-20"
                                 >
                                   {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                               </div>
                             </div>
                           </motion.div>
                         )}
                         </AnimatePresence>

                         {/* Reset Password fields */}
                         {authMode === "reset-password" && (
                           <>
                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">New Access Key</Label>
                               <div className="relative group">
                                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type={showNewPassword ? "text" : "password"}
                                   placeholder="••••••••"
                                   value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)}
                                   className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-[0.3em] transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => setShowNewPassword(prev => !prev)}
                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#99CB48] transition-colors z-20"
                                 >
                                   {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                               </div>
                             </div>

                             <div className="space-y-1.5">
                               <Label className="text-slate-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] text-[8px] ml-1">Confirm Access Key</Label>
                               <div className="relative group">
                                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#99CB48] transition-colors" />
                                 <Input
                                   type={showConfirmPassword ? "text" : "password"}
                                   placeholder="••••••••"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                                   className="h-9 pl-10 pr-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 font-bold tracking-[0.3em] transition-all duration-300 ease-out text-sm focus:border-[#99CB48] shadow-sm hover:shadow-md"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => setShowConfirmPassword(prev => !prev)}
                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#99CB48] transition-colors z-20"
                                 >
                                   {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                               </div>
                             </div>
                           </>
                         )}
                       </div>

                       {(authMode === "login" || authMode === "signup") && (
                         <label className="flex items-center gap-3 px-1 cursor-pointer group select-none pt-2">
                           <div className="relative flex items-center justify-center">
                             <input
                               type="checkbox"
                               required
                               className="peer appearance-none w-3.5 h-3.5 rounded-[3px] border border-slate-300 dark:border-white/20 bg-transparent checked:bg-[#99CB48] checked:border-[#99CB48] transition-all cursor-pointer shadow-sm"
                             />
                             <CheckCircle2 className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                           </div>
                           <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.1em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                             I authorize secure workstation security protocol
                           </span>
                         </label>
                       )}

                       {error && (
                         <motion.div
                           initial={{ opacity: 0, y: -5 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center shadow-sm"
                         >
                           {error}
                         </motion.div>
                       )}

                       <Button type="submit" className="w-full h-11 mt-3 text-[10px] font-black uppercase tracking-[0.25em] bg-[#99CB48] text-black hover:bg-[#88B540] rounded-2xl shadow-[0_10px_30px_-10px_rgba(153,203,72,0.4)] transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group">
                         {loading ? (
                           <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Authorizing...
                           </>
                         ) : (
                           <>
                             {authMode === "login" ? "Authorize & Sign In" : authMode === "signup" ? "Register & Onboard" : "Send Reset Link"}
                             <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </>
                         )}
                       </Button>

                       {(authMode === "login" || authMode === "signup") && (
                         <div className="text-center pt-2">
                           <button 
                             type="button"
                             onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(null); }}
                             className="text-[9px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase tracking-[0.15em] transition-colors"
                           >
                             {authMode === "login"
                               ? "New member? Switch to Sign Up tab above to onboard."
                               : "Already registered? Switch to Sign In tab above."}
                           </button>
                         </div>
                       )}

                       {/* New Inner Footer */}
                       <div className="pt-10 flex justify-center items-center gap-4 w-full border-t border-slate-100 pt-4 dark:border-white/5 mt-4">
                         <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                           <ShieldCheck className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                           <span className="leading-tight">Enterprise<br/>Secure</span>
                         </div>
                         <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                         <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                           <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-500 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48]" />
                           </div>
                           <span className="leading-tight">99.9%<br/>Uptime</span>
                         </div>
                         <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
                         <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                           <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                           <span className="leading-tight">Global<br/>Infrastructure</span>
                         </div>
                       </div>
                     </>
                   )}
                 </form>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
