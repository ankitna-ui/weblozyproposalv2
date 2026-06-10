import React, { useState, useEffect } from "react";
import { 
  Mail, KeyRound, User, Building2, Eye, EyeOff, Activity, 
  ShieldCheck, CheckCircle2, Lock, ChevronRight, Zap, BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import AuthLayout from "@/pages/Auth/AuthLayout";
import { toast } from "react-toastify";
import logo from "@/assets/weblozy-logo.png";

type AuthMode = "login" | "signup" | "forgot-password" | "loading";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [time, setTime] = useState("");

  const navigate = useNavigate();

  // Load logos
  const banner2Logo = new URL('@/assets/banner2_logo.png', import.meta.url).href; // Light text (Dark Mode)
  const bannerLogo = new URL('@/assets/banner_logo.png', import.meta.url).href;   // Dark text (Light Mode)

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  const isEmailValid = (emailAddr: string) => {
    const normalized = emailAddr.trim().toLowerCase();
    return normalized.endsWith("@weblozy.com") || normalized.endsWith("@weblozy.in");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === "forgot-password") {
      if (!email) { setError("Please enter your corporate email."); return; }
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset link sent securely.");
        setAuthMode("login");
      } catch (err: any) {
        setError(err.message || "Failed to send reset link.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) { setError("Required credentials missing."); return; }
    
    if (authMode === "signup") {
      if (!fullName) { setError("Full Name is required."); return; }
      if (!employeeId) { setError("Employee ID is required."); return; }
      if (password !== confirmPassword) { setError("Access keys do not match."); return; }
      if (password.length < 6) { setError("Access key must be at least 6 characters."); return; }
    }

    setLoading(true);
    try {
      if (authMode === "login") {
        if (!isEmailValid(email)) {
          setError("Terminal Access Denied. Identity validation failed corporate security policy.");
          setLoading(false); return;
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified && window.location.hostname !== "localhost") {
          await sendEmailVerification(userCredential.user);
          await signOut(auth);
          setError("Verification pending. Check your email.");
          setLoading(false); return;
        }
        toast.success("Identity Verified.");
        setAuthMode("loading");
        navigate("/dashboard");
      } else if (authMode === "signup") {
        if (!isEmailValid(email)) {
          setError("Terminal Access Denied. Identity validation failed corporate security policy.");
          setLoading(false); return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName,
          employeeId,
          email: userCredential.user.email,
          role: "user",
          createdAt: new Date().toISOString()
        });
        await sendEmailVerification(userCredential.user);
        toast.success("Account initialized. Please verify your email.");
        await signOut(auth);
        setAuthMode("login");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' 
        ? "Invalid access credentials." 
        : err.message || "Authentication protocol failed.");
    } finally {
      if (authMode !== "loading") setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AnimatedBackground />
      {/* CSS FIX FOR BROWSER AUTOFILL BACKGROUND */}
      <style dangerouslySetInnerHTML={{__html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s;
            -webkit-text-fill-color: currentColor !important;
        }
      `}} />
      
      <div className="w-full max-w-[1150px] mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[90vh] lg:min-h-0 lg:h-[750px] relative z-10 p-4 sm:p-8 gap-8 lg:gap-16">
        
        {/* BRANDING LEFT COLUMN */}
        <div className="w-full lg:w-[48%] flex flex-col justify-between py-6 sm:py-10 self-stretch">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8 lg:mb-0"
          >
            <img src={bannerLogo} alt="Weblozy Logo" className="h-6 object-contain dark:hidden" />
            <img src={banner2Logo} alt="Weblozy Logo" className="h-6 object-contain hidden dark:block" />
            <div className="h-4 w-px bg-slate-300 dark:bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Enterprise Portal</span>
          </motion.div>

          {/* Title and Description */}
          <div className="my-auto py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161B23]/40 border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#99CB48] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#99CB48]"></span>
              </span>
              <span className="text-[9px] font-black tracking-[0.2em] text-[#82b339] dark:text-[#99CB48] uppercase">System Online</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.05] text-[#0B0E14] dark:text-white mb-4"
            >
              Strategic<br />
              <span className="text-[#99CB48]">Workstation.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mb-8"
            >
              Secure corporate environment for generating, analyzing, and deploying strategic business proposals.
            </motion.p>

            {/* Feature lists */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 max-w-md"
            >
              <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white/70 dark:bg-[#161B23]/40 border border-slate-200/50 dark:border-white/5 shadow-sm hover:scale-[1.01] transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center text-[#99CB48]">
                  <ShieldCheck size={22} className="text-[#99CB48]" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider">Secure</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug uppercase tracking-wider mt-0.5">Enterprise-grade security and data protection.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white/70 dark:bg-[#161B23]/40 border border-slate-200/50 dark:border-white/5 shadow-sm hover:scale-[1.01] transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center text-[#99CB48]">
                  <Zap size={22} className="text-[#99CB48]" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider">Automated</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug uppercase tracking-wider mt-0.5">Intelligent automation for maximum efficiency.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-white/70 dark:bg-[#161B23]/40 border border-slate-200/50 dark:border-white/5 shadow-sm hover:scale-[1.01] transition-all duration-300">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center text-[#99CB48]">
                  <BarChart2 size={22} className="text-[#99CB48]" />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider">Strategic</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-snug uppercase tracking-wider mt-0.5">Data-driven insights for smarter decisions.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer lock and time info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-between w-full max-w-md pt-6 mt-auto border-t border-slate-200 dark:border-white/5"
          >
            <div className="flex items-center gap-2 text-[#99CB48]">
              <Lock className="w-4 h-4 text-[#99CB48]" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">AES-256 ENCRYPTED</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Time</span>
              <span className="text-[10px] font-black text-[#99CB48] tracking-widest">{time || "00:00:00 PM"}</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN FORM CARD */}
        <div className="w-full lg:w-[48%] flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[480px] bg-white dark:bg-[#0E131F]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-8 sm:p-10 relative flex flex-col items-center"
          >
            {/* Floating circular logo header */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              {/* Light Mode Logo Container */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 dark:hidden">
                <img src={logo} alt="Weblozy Logo" className="w-10 h-10 object-contain" />
              </div>
              {/* Dark Mode Logo Container */}
              <div className="hidden dark:flex w-20 h-20 bg-[#0E131F] rounded-full items-center justify-center border border-white/10 shadow-[0_0_25px_rgba(153,203,72,0.15)] relative">
                {/* Glowing neon ring */}
                <div className="absolute inset-0 rounded-full border border-[#99CB48]/20 animate-pulse pointer-events-none" />
                <img src={logo} alt="Weblozy Logo" className="w-10 h-10 object-contain" />
              </div>
            </div>

            <div className="w-full pt-10 text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {authMode === "signup" ? "Create Account" : authMode === "forgot-password" ? "Recover Account" : "Welcome Back"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                {authMode === "signup" ? "Join Weblozy and elevate your automation journey." : authMode === "forgot-password" ? "Recover your corporate access key." : "Sign in to access your Weblozy workspace."}
              </p>
            </div>
            
            {/* Segmented Control / Tab Switcher */}
            {(authMode === "login" || authMode === "signup") && (
              <div className="w-full flex bg-[#F1F5F9] dark:bg-[#161B23] border border-transparent dark:border-white/5 rounded-2xl mb-6 p-1 backdrop-blur-sm shadow-inner relative">
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${
                    authMode === 'login' 
                      ? "text-[#82b339] dark:text-[#99CB48]" 
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  Sign In
                  {authMode === 'login' && (
                    <motion.div
                      layoutId="authActiveTab"
                      className="absolute inset-0 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-white/5 shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${
                    authMode === 'signup' 
                      ? "text-[#82b339] dark:text-[#99CB48]" 
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  Sign Up
                  {authMode === 'signup' && (
                    <motion.div
                      layoutId="authActiveTab"
                      className="absolute inset-0 bg-white dark:bg-[#0E131F] rounded-xl border border-slate-200 dark:border-white/5 shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mb-6 overflow-hidden"
                >
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              {/* Signup Fields (Animated) */}
              <AnimatePresence mode="wait">
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden mb-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Full Name</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Ankit Nag"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-12 pl-12 pr-4 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#161B23] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Employee ID</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                          <Building2 size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="WL-0099"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="w-full h-12 pl-12 pr-4 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#161B23] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Corporate Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="ankitnag@weblozy.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#161B23] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] transition-all"
                  />
                  {isEmailValid(email) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-[#99CB48]">
                      <CheckCircle2 size={16} className="text-[#99CB48]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              {(authMode === "login" || authMode === "signup") && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Access Key</label>
                    {authMode === "login" && (
                      <button 
                        type="button" 
                        onClick={() => setAuthMode("forgot-password")} 
                        className="text-[10px] font-bold text-[#82b339] dark:text-[#99CB48] hover:underline uppercase tracking-wider"
                      >
                        Forgot Key?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <KeyRound size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-10 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#161B23] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Field (Signup) */}
              <AnimatePresence mode="wait">
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirm Access Key</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                        <KeyRound size={16} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 pl-12 pr-10 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/5 bg-[#F8FAFC] dark:bg-[#161B23] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options check & help */}
              <div className="flex justify-between items-center pt-2">
                {authMode === 'login' ? (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded accent-[#99CB48] border-slate-300 dark:border-white/5 bg-white dark:bg-[#161B23] cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Remember me</span>
                    </label>
                    <span className="text-[10px] font-black text-[#82b339] dark:text-[#99CB48] cursor-pointer hover:underline uppercase tracking-widest">Need help?</span>
                  </>
                ) : authMode === 'signup' ? (
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded accent-[#99CB48] border-slate-300 dark:border-white/5 bg-white dark:bg-[#161B23] cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">
                      I agree to the <span className="text-[#99CB48] hover:underline">Terms</span> & <span className="text-[#99CB48] hover:underline">Privacy</span>
                    </span>
                  </label>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setAuthMode("login")} 
                    className="text-[10px] font-black text-[#82b339] dark:text-[#99CB48] hover:underline uppercase tracking-widest"
                  >
                    Return to Login
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#82b339] to-[#99CB48] hover:from-[#99CB48] hover:to-[#A9DF50] text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_4px_25px_-5px_rgba(153,203,72,0.4)] hover:shadow-[0_4px_30px_-5px_rgba(153,203,72,0.6)] transition-all duration-300 hover:scale-[1.01] active:scale-99 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === "login" ? "SIGN IN" : authMode === "signup" ? "CREATE ACCOUNT" : "SEND RESET LINK"}</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* End-to-end Encrypted Footer block inside right form card */}
              <div className="pt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest border-t border-slate-100 dark:border-white/5 w-full">
                <Lock size={12} className="text-slate-400 dark:text-slate-500" />
                <span>End-to-end encrypted protocol</span>
              </div>

            </form>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
}
