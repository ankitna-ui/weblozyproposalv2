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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

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
      const isDomainAuthorized = (emailAddr: string) => {
        const normalized = emailAddr.trim().toLowerCase();
        return normalized.endsWith("@weblozy.com") || normalized.endsWith("@weblozy.in");
      };

      if (authMode === "login") {
        if (!isDomainAuthorized(email)) {
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
        if (!isDomainAuthorized(email)) {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#07090C] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 dark:from-[#0B101A] dark:via-[#07090C] dark:to-[#040507] font-sans selection:bg-[#99CB48]/30 overflow-hidden relative transition-colors duration-500">
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row h-auto min-h-screen lg:min-h-0 lg:h-[750px] lg:max-h-[90vh] relative z-10 p-4 sm:p-8 lg:gap-12 overflow-y-auto lg:overflow-visible"
      >
        
        {/* === LEFT PANEL (BRANDING) === */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center lg:justify-between py-8 sm:py-12 relative mb-8 lg:mb-0">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <img src={bannerLogo} alt="Weblozy Logo" className="h-6 object-contain dark:hidden" />
            <img src={banner2Logo} alt="Weblozy Logo" className="h-6 object-contain hidden dark:block" />
            <div className="h-4 w-px bg-slate-300 dark:bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-white/60">Enterprise Portal</span>
          </motion.div>

          {/* Typography */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 mb-6 backdrop-blur-md">
               <div className="w-1.5 h-1.5 rounded-full bg-[#99CB48] shadow-[0_0_8px_#99CB48]" />
               <span className="text-[9px] font-bold tracking-[0.15em] text-[#99CB48] uppercase">System Online</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-4 text-slate-900 dark:text-white"
            >
              Strategic<br />
              <span className="text-[#99CB48]">Workstation.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm"
            >
              Secure corporate environment for generating, analyzing, and deploying strategic business proposals.
            </motion.p>
          </motion.div>

          {/* Feature Cards - Changed to items-center */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4 max-w-sm mb-12 lg:mb-0"
          >
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 dark:bg-transparent border border-[#99CB48]/30 flex items-center justify-center text-[#99CB48]">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-0.5">Secure</h3>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Enterprise-grade security and data protection.</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 dark:bg-transparent border border-[#99CB48]/30 flex items-center justify-center text-[#99CB48]">
                   <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-0.5">Automated</h3>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Intelligent automation for maximum efficiency.</p>
                </div>
             </div>

             <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 dark:bg-transparent border border-[#99CB48]/30 flex items-center justify-center text-[#99CB48]">
                   <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-slate-900 dark:text-white text-sm font-bold mb-0.5">Strategic</h3>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Data-driven insights for smarter decisions.</p>
                </div>
             </div>
          </motion.div>

          {/* Footer inside Left Panel */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 1 }}
             className="flex items-center justify-between w-full max-w-sm mt-auto"
          >
             <div className="flex items-center gap-2 text-[#99CB48]">
                <Lock className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300">AES-256 Encrypted</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Time</span>
                <span className="text-[10px] font-bold text-[#99CB48] tracking-widest">{time || "00:00:00 AM"}</span>
             </div>
          </motion.div>
        </div>

        {/* === RIGHT PANEL (FORM CARD) === */}
        <div className="w-full lg:w-[50%] flex items-center justify-center relative h-auto lg:h-full pb-8 lg:pb-0">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            className="w-full max-w-[460px] h-[650px] overflow-y-auto custom-scrollbar flex flex-col bg-white/70 dark:bg-[#0A0F16]/40 backdrop-blur-3xl border border-slate-200 dark:border-white/[0.05] shadow-2xl dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 sm:p-10 relative z-10"
          >
            
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                {authMode === "signup" ? "Create Your Account" : authMode === "forgot-password" ? "Recover Account" : "Welcome Back"}
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                {authMode === "signup" ? "Join Weblozy and elevate your automation journey." : "Sign in to access your Weblozy workspace."}
              </p>
            </motion.div>

            {/* Segmented Control / Tab Switcher */}
            {(authMode === "login" || authMode === "signup") && (
              <motion.div variants={itemVariants} className="flex bg-slate-100/50 dark:bg-white/[0.03] border border-transparent dark:border-white/[0.05] rounded-xl mb-8 p-1 backdrop-blur-sm">
                {(['login', 'signup'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setError(null); }}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 relative z-10 ${
                      authMode === mode 
                        ? "text-[#99CB48]" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {mode === 'login' ? 'SIGN IN' : 'SIGN UP'}
                    {authMode === mode && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-[#99CB48]/20 shadow-sm dark:shadow-none -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Signup Fields (Animated) */}
              <AnimatePresence>
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "1.25rem" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="grid grid-cols-2 gap-4 overflow-hidden mb-5"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors" />
                        <Input 
                          type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                          className="h-12 pl-10 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Employee ID</Label>
                      <div className="relative group">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors" />
                        <Input 
                          type="text" placeholder="Enter employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
                          className="h-12 pl-10 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Corporate Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="Enter your corporate email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all"
                  />
                  {email && email.includes('@') && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                      <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99CB48]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {(authMode === "login" || authMode === "signup") && (
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Access Key</Label>
                    {authMode === "login" && (
                      <button type="button" onClick={() => setAuthMode("forgot-password")} className="text-[10px] font-bold text-[#99CB48] hover:text-[#b1e658] transition-colors">
                        Forgot Key?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter access key"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10 pr-10 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-wide focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Confirm Password (Animated) */}
              <AnimatePresence>
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "1.25rem" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirm Access Key</Label>
                    <div className="relative group">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#99CB48] transition-colors" />
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm access key"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 pl-10 pr-10 bg-slate-50 dark:bg-[#161B23] border-slate-200 dark:border-[#222934] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-wide focus:ring-1 focus:ring-[#99CB48]/50 focus:border-[#99CB48] transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember Me & Terms Checkbox */}
              <motion.div variants={itemVariants} className="flex justify-between items-center pt-2">
                 {authMode === 'login' ? (
                    <>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="w-4 h-4 rounded border border-slate-300 dark:border-[#222934] group-hover:border-[#99CB48] bg-white dark:bg-[#161B23] flex items-center justify-center transition-colors">
                             <CheckCircle2 className="w-3 h-3 text-[#99CB48] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Remember me</span>
                       </label>
                       <span className="text-[11px] font-bold text-[#99CB48] cursor-pointer hover:underline">Need help?</span>
                    </>
                 ) : authMode === 'signup' && (
                    <label className="flex items-center gap-2 cursor-pointer group">
                       <div className="w-4 h-4 rounded border border-slate-300 dark:border-[#222934] group-hover:border-[#99CB48] bg-white dark:bg-[#161B23] flex items-center justify-center transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-[#99CB48]" />
                       </div>
                       <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          I agree to the <span className="text-[#99CB48] hover:underline">Terms of Service</span> and <span className="text-[#99CB48] hover:underline">Privacy Policy</span>
                       </span>
                    </label>
                 )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-[52px] bg-[#99CB48] hover:bg-[#A9DF50] text-black font-black uppercase tracking-[0.1em] text-xs rounded-xl shadow-[0_4px_25px_-5px_rgba(153,203,72,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {authMode === "login" ? "SIGN IN" : authMode === "signup" ? "CREATE ACCOUNT" : "SEND RESET LINK"}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.div>



              {/* Footer */}
              <motion.div variants={itemVariants} className="mt-auto pt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                <Lock className="w-3 h-3" />
                <span>End-to-end encrypted protocol</span>
              </motion.div>

            </form>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
