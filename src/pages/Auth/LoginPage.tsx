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
import roiIllustration from "@/assets/roi_3d_illustration.png";

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
      
      <div className="w-full flex h-[100dvh] overflow-hidden">
        {/* LEFT COLUMN: BRANDING (Hidden on Mobile) */}
        <div className="hidden lg:flex w-[45%] relative bg-[#04060A] flex-col justify-between p-12 overflow-hidden border-r border-white/5">
          {/* Abstract glowing background effect */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#99CB48]/15 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#82b339]/10 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          </div>

          {/* Floating 3D Illustration in center of left panel */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.img 
              src={roiIllustration} 
              alt="Strategic Workstation" 
              className="w-[120%] max-w-none opacity-40 drop-shadow-[0_0_50px_rgba(153,203,72,0.2)]"
              animate={{ 
                y: [-20, 20, -20],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative z-10">
            <img src={banner2Logo} alt="Weblozy Logo" className="h-7 object-contain mb-16" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#99CB48] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#99CB48]"></span>
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#99CB48] uppercase">System Online</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-[1.05] text-white mb-6 drop-shadow-md">
                Strategic<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#99CB48] to-[#A9DF50]">Workstation.</span>
              </h1>
              
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-12 drop-shadow">
                Secure corporate environment for generating, analyzing, and deploying strategic business proposals.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4 max-w-sm"
            >
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-[#99CB48]" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-black uppercase tracking-wider mb-0.5">Secure Core</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise-grade protection.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#99CB48]/10 border border-[#99CB48]/20 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-[#99CB48]" />
                </div>
                <div>
                  <h3 className="text-white text-xs font-black uppercase tracking-wider mb-0.5">Automated</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligent deployment.</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 mt-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#99CB48]" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">AES-256 ENCRYPTED</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">System Time</span>
              <span className="block text-[10px] font-black text-[#99CB48] tracking-widest">{time || "00:00:00 PM"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-[#0B0E14] overflow-y-auto">
          {/* Mobile Logo */}
          <div className="absolute top-8 left-8 lg:hidden">
            <img src={bannerLogo} alt="Weblozy Logo" className="h-6 object-contain dark:hidden" />
            <img src={banner2Logo} alt="Weblozy Logo" className="h-6 object-contain hidden dark:block" />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[400px] mt-12 lg:mt-0"
          >
            <div className="text-center sm:text-left mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">
                {authMode === "signup" ? "Create Account" : authMode === "forgot-password" ? "Recover Account" : "Welcome Back"}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {authMode === "signup" ? "Join Weblozy and elevate your automation journey." : authMode === "forgot-password" ? "Recover your corporate access key." : "Sign in to access your Weblozy workspace."}
              </p>
            </div>
            
            {/* Segmented Control */}
            {(authMode === "login" || authMode === "signup") && (
              <div className="w-full flex bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl mb-8 shadow-inner border border-slate-100 dark:border-white/5 relative">
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${
                    authMode === 'login' 
                      ? "text-[#82b339] dark:text-[#99CB48] bg-white dark:bg-[#1A1F26] shadow-sm ring-1 ring-slate-200 dark:ring-white/10" 
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setError(null); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${
                    authMode === 'signup' 
                      ? "text-[#82b339] dark:text-[#99CB48] bg-white dark:bg-[#1A1F26] shadow-sm ring-1 ring-slate-200 dark:ring-white/10" 
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  Sign Up
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
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-start gap-3">
                    <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              {/* Signup Fields */}
              <AnimatePresence mode="wait">
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Full Name</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Ankit Nag"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] focus:bg-white dark:focus:bg-[#0B0E14] transition-all shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Employee ID</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Building2 size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="WL-0099"
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] focus:bg-white dark:focus:bg-[#0B0E14] transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Corporate Email</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="name@weblozy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-10 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] focus:bg-white dark:focus:bg-[#0B0E14] transition-all shadow-sm"
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
                <div className="space-y-2">
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <KeyRound size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-11 pr-10 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] focus:bg-white dark:focus:bg-[#0B0E14] transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <AnimatePresence mode="wait">
                {authMode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirm Access Key</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <KeyRound size={16} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 pl-11 pr-10 text-xs font-bold rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#99CB48] focus:ring-1 focus:ring-[#99CB48] focus:bg-white dark:focus:bg-[#0B0E14] transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
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
                        className="w-4 h-4 rounded accent-[#99CB48] border-slate-300 dark:border-white/10 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Remember me</span>
                    </label>
                  </>
                ) : authMode === 'signup' ? (
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded accent-[#99CB48] border-slate-300 dark:border-white/10 bg-transparent cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">
                      I agree to the <span className="text-[#82b339] dark:text-[#99CB48] hover:underline">Terms</span>
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
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(153,203,72,0.4)] dark:hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] transition-all duration-500 flex items-center justify-center gap-2 hover:-translate-y-1 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{authMode === "login" ? "SIGN IN" : authMode === "signup" ? "CREATE ACCOUNT" : "SEND RESET LINK"}</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
}
