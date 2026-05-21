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
import { ShieldCheck, Zap, ChevronRight, ArrowLeft, Mail, Lock, CheckCircle2, Cpu, Globe, Database, UserCheck, IdCard, Eye, EyeOff, Activity, Terminal, LockKeyhole, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import banner2Logo from "@/assets/banner2_logo.png";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06080C] via-[#0D1117] to-[#040507] p-6 relative overflow-hidden font-sans">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(#A3E635 1px, transparent 1px), linear-gradient(90deg, #A3E635 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 75%)'
          }}
        />
        {/* Soft neon green top-right glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#A3E635] blur-[150px] rounded-full"
        />
        {/* Deep navy bottom-left glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.08, 0.15, 0.08], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[550px] h-[550px] bg-[#1668B2] blur-[140px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {authMode === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-sm space-y-10 text-center relative z-10"
          >
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-primary/15 blur-[50px] animate-pulse rounded-full" />
              <motion.img
                src={weblozyLogo}
                alt="Weblozy"
                className="w-full h-full object-contain relative z-10 p-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] leading-none">{loadingText}</h2>
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">Access Channel Validating</p>
              </div>

              <div className="relative space-y-2">
                <div className="h-[1.5px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#99CB48]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  <span>System Logic Hook: {loadingProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl min-h-[550px] md:min-h-[660px] md:h-[680px] grid md:grid-cols-2 bg-[#0E1217]/90 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5 relative z-10"
          >
            {/* Left Side: Institutional Cybernetic Telemetry Deck */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent relative border-r border-white/5 overflow-hidden">
              {/* Background ambient glowing mesh grids */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 10% 20%, rgba(22, 104, 178, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(153, 203, 72, 0.05) 0%, transparent 40%)`
                  }}
                />
              </div>

              <div className="space-y-12 relative z-10">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img src={banner2Logo} alt="Partners" className="h-10 w-auto object-contain max-w-[200px]" />
                    <div className="h-5 w-px bg-white/10" />
                    <span className="text-[6px] uppercase tracking-[0.4em] text-white/30 font-black flex items-center gap-1"><Terminal className="w-3 h-3 text-primary" />System Time</span>
                  </div>

                  {/* Dynamic Real-time Workstation Clock */}
                  <div className="flex flex-col items-end text-right bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <span className="text-[11px] font-mono font-bold text-primary tracking-[0.15em] leading-none">{time || "12:00:00"}</span>
                  </div>
                </motion.div>

                <div className="space-y-6 pt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Strategic Core OS v3.2</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={authMode}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-5xl font-black text-white leading-[0.95] tracking-tight uppercase"
                    >
                      {authMode === "signup" ? (
                        <>
                          Absolute <br />
                          <span className="text-primary italic relative">
                            Authority.
                            <span className="absolute bottom-1 left-0 w-full h-[3.5px] bg-primary/20 rounded shadow-[0_0_12px_rgba(163,230,53,0.3)]" />
                          </span>
                        </>
                      ) : (
                        <>
                          Welcome Back <br />
                          <span className="text-primary italic relative">
                            Commander.
                            <span className="absolute bottom-1 left-0 w-full h-[3.5px] bg-primary/20 rounded shadow-[0_0_12px_rgba(163,230,53,0.3)]" />
                          </span>
                        </>
                      )}
                    </motion.h1>
                  </AnimatePresence>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[320px] font-medium tracking-tight">
                    High-impact enterprise documentation pipeline & multi-operator strategic automation ecosystem.
                  </p>
                </div>
              </div>

              {/* Minimal Luxury Footer */}
              <div className="space-y-2.5 relative z-10 opacity-70 border-t border-white/5 pt-6">
                <div className="text-[9px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                  <span>SECURE ENTERPRISE LAYER</span>
                </div>
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                  ENCRYPTED MULTI-OPERATOR WORKSTATION ACCESS APPROVED FOR OFFICIAL CORPORATE DEPLOYS.
                </p>
              </div>
            </div>

            {/* Right Side: Authentication Interface */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-black/20 h-full overflow-y-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authMode === "login" || authMode === "signup" ? "login-signup" : authMode}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        {getTitle()}
                      </h2>
                      {authMode !== "login" && authMode !== "signup" && authMode !== "success" && (
                        <button onClick={() => setAuthMode("login")} className="text-primary hover:text-white transition-colors">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-tight">
                      {getSubtitle()}
                    </p>
                  </div>

                  {/* Interactive Premium Tab Switcher */}
                  {(authMode === "login" || authMode === "signup") && (
                    <div className="grid grid-cols-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                      <button
                        type="button"
                        onClick={() => { setAuthMode("login"); setError(null); }}
                        className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${authMode === "login"
                          ? "text-black bg-primary shadow-lg shadow-primary/20"
                          : "text-gray-500 hover:text-white"
                          }`}
                      >
                        Sign In (Authorized)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthMode("signup"); setError(null); }}
                        className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative z-10 ${authMode === "signup"
                          ? "text-black bg-primary shadow-lg shadow-primary/20"
                          : "text-gray-500 hover:text-white"
                          }`}
                      >
                        Sign Up (New Employee)
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {authMode === "success" ? (
                      <div className="text-center space-y-8 py-6">
                        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                          <CheckCircle2 className="w-10 h-10 text-primary relative z-10" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white leading-none">Identity Dispatch Complete</h3>
                          <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto">
                            A secure activation protocol has been successfully transmitted to your inbox <span className="text-primary font-black uppercase">{email}</span>. Please click the validation link inside your email to unlock your Proposal OS terminal.
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => { setAuthMode("login"); setError(null); }}
                          className="w-full h-14 text-sm font-black uppercase tracking-[0.4em] bg-primary text-black hover:bg-primary/90 rounded-[1.2rem] shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                        >
                          Return to Login Hub
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Terminal ID (Company Email) - Spans both columns */}
                          {(authMode === "login" || authMode === "signup" || authMode === "forgot-password") && (
                            <div className="col-span-2 space-y-1.5">
                              <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Terminal ID (Company Email)</Label>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                <Input
                                  type="email"
                                  placeholder="OPERATOR@WEBLOZY.COM"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="h-11 pl-11 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold tracking-tight uppercase transition-all text-xs focus:border-primary/30"
                                />
                              </div>
                            </div>
                          )}

                          {/* Sign Up Fields: Employee Name & Employee ID side-by-side */}
                          {authMode === "signup" && (
                            <>
                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Employee Full Name</Label>
                                <div className="relative group">
                                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="h-11 pl-11 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold tracking-tight uppercase transition-all text-xs focus:border-primary/30"
                                  />
                                </div>
                              </div>

                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Employee ID</Label>
                                <div className="relative group">
                                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type="text"
                                    placeholder="Enter EMP-ID"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="h-11 pl-11 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold tracking-tight uppercase transition-all text-xs focus:border-primary/30"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {/* Passwords for Login - spans full column */}
                          {authMode === "login" && (
                            <div className="col-span-2 space-y-1.5">
                              <div className="flex justify-between items-center px-1">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px]">Access Key (Password)</Label>
                                <button type="button" onClick={() => setAuthMode("forgot-password")} className="text-[8px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Recover Password?</button>
                              </div>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="h-11 pl-11 pr-10 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-primary/30"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(prev => !prev)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary transition-colors z-20"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Passwords for Signup - side-by-side */}
                          {authMode === "signup" && (
                            <>
                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Access Key</Label>
                                <div className="relative group">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 pl-11 pr-10 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-primary/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary transition-colors z-20"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Confirm Access Key</Label>
                                <div className="relative group">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-11 pl-11 pr-10 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-primary/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary transition-colors z-20"
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Reset Password fields - side-by-side */}
                          {authMode === "reset-password" && (
                            <>
                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">New Access Key</Label>
                                <div className="relative group">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 pl-11 pr-10 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-primary/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary transition-colors z-20"
                                  >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>

                              <div className="col-span-1 space-y-1.5">
                                <Label className="text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Confirm Access Key</Label>
                                <div className="relative group">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-primary transition-colors" />
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-11 pl-11 pr-10 bg-white/[0.02] border-white/10 rounded-xl focus:ring-1 focus:ring-primary text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-primary/30"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary transition-colors z-20"
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {(authMode === "login" || authMode === "signup") && (
                          <label className="flex items-center gap-2 px-1 cursor-pointer group select-none pt-1">
                            <input
                              type="checkbox"
                              required
                              className="w-3.5 h-3.5 rounded bg-white/[0.02] border-white/10 text-primary focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer accent-primary"
                            />
                            <span className="text-[8.5px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-gray-400 transition-colors">
                              I authorize secure workstation security protocol
                            </span>
                          </label>
                        )}

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest text-center shadow-lg shadow-red-500/5"
                          >
                            {error}
                          </motion.div>
                        )}

                        <Button type="submit" className="w-full h-11 text-xs font-black uppercase tracking-[0.3em] bg-primary text-black hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] group overflow-hidden relative mt-1">
                          {loading ? "Authorizing..." : (
                            <div className="flex items-center gap-1.5">
                              {authMode === "login" ? "Authorize & Sign In" : authMode === "signup" ? "Register & Onboard" : "Send Reset Link"}
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>

                        {(authMode === "login" || authMode === "signup") && (
                          <>
                            <div className="text-center">
                              <p className="text-[8.5px] text-gray-600 font-bold uppercase tracking-widest leading-none">
                                {authMode === "login"
                                  ? "New member? Switch to Sign Up tab above to onboard."
                                  : "Already registered? Switch to Sign In tab above."}
                              </p>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 text-[8px] text-white/30 uppercase tracking-[0.2em] pt-1">
                              <LockKeyhole className="w-3 h-3 text-primary/60" />
                              <span>AES-256 SECURED GATEWAY</span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center opacity-15 pointer-events-none">
        <div className="text-[9px] font-black text-white uppercase tracking-[0.8em]">Weblozy Labs • Secure Terminal</div>
      </div>
    </div>
  );
}

