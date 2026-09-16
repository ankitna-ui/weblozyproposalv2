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
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s;
            -webkit-text-fill-color: white !important;
        }

        .handwritten-text {
          font-family: 'Caveat', cursive;
        }
      `}} />
      
      <div className="w-full flex min-h-[100dvh] overflow-hidden bg-[#030910]">
        
        {/* LEFT COLUMN: VISUAL (60%) */}
        <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-[#0A1118]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={new URL('@/assets/login_bg.png', import.meta.url).href} 
              alt="Workspace" 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Dark gradient overlays for text readability and seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#030910]/90 via-[#030910]/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030910]/90 via-transparent to-[#030910]/40 z-10" />
            
            {/* Smooth Edge Blend to right column */}
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030910] to-transparent z-20" />
            <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#030910]/80 to-transparent z-20" />
            <div className="absolute inset-y-0 right-0 w-96 bg-gradient-to-l from-[#030910]/40 to-transparent z-20" />
          </div>

          <div className="relative z-20 w-full h-full flex flex-col justify-between">
            {/* Top Area: Logo & Hero Text */}
            <div>
              <img src={banner2Logo} alt="Weblozy Logo" className="h-8 object-contain mb-16" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-[10px] font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
                  Welcome to Weblozy
                </div>
                
                <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] text-white mb-6">
                  Strategic<br />
                  <span className="text-[#34D399]">Workstation.</span>
                </h1>
                
                <p className="text-slate-300 text-sm leading-relaxed max-w-md mb-12">
                  Secure corporate environment for generating, analyzing, and deploying strategic business proposals.
                </p>
              </motion.div>

              {/* Features Row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-start gap-8"
              >
                {/* Feature 1 */}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#030910]/80 backdrop-blur-sm border border-[#34D399]/40 shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center justify-center">
                    <ShieldCheck size={20} className="text-[#34D399]" />
                  </div>
                  <div>
                    <h3 className="text-white text-[10px] font-black uppercase tracking-wider mb-1">Secure Core</h3>
                    <p className="text-[11px] font-medium text-slate-400 leading-tight">Enterprise-grade<br/>protection.</p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#030910]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <Zap size={20} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-white text-[10px] font-black uppercase tracking-wider mb-1">Automated</h3>
                    <p className="text-[11px] font-medium text-slate-400 leading-tight">Intelligent<br/>deployment.</p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#030910]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <BarChart2 size={20} className="text-[#A78BFA]" />
                  </div>
                  <div>
                    <h3 className="text-white text-[10px] font-black uppercase tracking-wider mb-1">Data Driven</h3>
                    <p className="text-[11px] font-medium text-slate-400 leading-tight">Smarter<br/>strategies.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Area */}
            <div className="w-full flex items-end justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
                  <span>IDEAS</span>
                  <ChevronRight size={12} className="text-slate-600" />
                  <span>SOLUTIONS</span>
                  <ChevronRight size={12} className="text-slate-600" />
                  <span>GROWTH</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#34D399]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">AES-256 ENCRYPTED</span>
                </div>
              </div>

              {/* Handwritten text */}
              <div className="relative mr-8 rotate-[-5deg]">
                <div className="handwritten-text text-3xl text-white font-semibold leading-tight">
                  Better Tech,<br/>Better Business
                </div>
                <div className="absolute -bottom-2 right-0 w-[120%] h-1 bg-[#34D399] rounded-full opacity-80 shadow-[0_0_10px_rgba(52,211,153,0.5)] transform -rotate-2" />
              </div>
            </div>
          </div>
        </div>

          {/* RIGHT COLUMN: FORM (45%) */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-[#030910] overflow-hidden">
          
          {/* Ambient Background Effects for Right Side */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#142A38_1px,transparent_1px),linear-gradient(to_bottom,#142A38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
            
            {/* Abstract Tech Geometric Elements */}
            {/* Large faint number */}
            <div className="absolute -bottom-10 left-0 text-[#142A38]/30 text-[240px] font-black leading-none tracking-tighter select-none font-sans">
              WL
            </div>
            
            {/* Radar / Circle Pattern Top Right */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] border-[1px] border-[#34D399]/5 rounded-full flex items-center justify-center">
              <div className="w-[400px] h-[400px] border-[1px] border-[#38BDF8]/5 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[300px] h-[300px] border-[1px] border-[#34D399]/10 rounded-full" />
            </div>

            {/* Scattered Plus Signs for Tech Vibe */}
            <div className="absolute top-[20%] left-[10%] text-[#34D399]/30 text-lg font-mono">+</div>
            <div className="absolute top-[60%] right-[10%] text-[#38BDF8]/30 text-xl font-mono">+</div>
            <div className="absolute bottom-[20%] right-[30%] text-[#34D399]/30 text-sm font-mono">+</div>
            <div className="absolute top-[40%] right-[20%] text-white/10 text-xs font-mono">+</div>
            
            {/* Floating Glass Chips */}
            <motion.div 
              className="absolute top-[35%] right-[5%] w-16 h-16 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md rotate-12"
              animate={{ y: [0, -15, 0], rotate: [12, 20, 12] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-[30%] left-[5%] w-10 h-10 rounded-lg border border-[#34D399]/10 bg-[#34D399]/[0.02] backdrop-blur-md -rotate-12"
              animate={{ y: [0, 15, 0], rotate: [-12, -25, -12] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Glowing Orbs */}
            <motion.div 
              className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#34D399]/10 blur-[120px] rounded-full mix-blend-screen"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-[#38BDF8]/10 blur-[100px] rounded-full mix-blend-screen"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                y: [0, -40, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          {/* Mobile Logo */}
          <div className="absolute top-8 left-8 lg:hidden z-20">
            <img src={banner2Logo} alt="Weblozy Logo" className="h-6 object-contain" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[440px] mt-12 lg:mt-0 relative z-10"
          >
            {/* The Floating Card with fixed exact height so it never resizes */}
            <div className="w-full h-[750px] sm:h-[700px] bg-[#07131C] border border-[#142A38] rounded-3xl p-8 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.5),_0_0_20px_rgba(52,211,153,0.03)] relative overflow-hidden flex flex-col">
              {/* Subtle top-left green glow inside card */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#34D399]/40 to-transparent" />
              
              <div className="mb-6 shrink-0">
                <h3 className="text-[#34D399] text-[10px] font-black uppercase tracking-widest mb-1">
                  {authMode === "signup" ? "CREATE ACCOUNT" : authMode === "forgot-password" ? "RECOVER KEY" : "WELCOME BACK"}
                </h3>
                <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight leading-tight">
                  {authMode === "signup" ? "Join Weblozy workspace." : authMode === "forgot-password" ? "Recover your access." : "Sign in to access your workspace."}
                </h2>
              </div>
              
              {/* Segmented Control */}
              {(authMode === "login" || authMode === "signup") && (
                <div className="w-full shrink-0 flex bg-[#030910] p-1.5 rounded-[1.25rem] mb-6 shadow-inner border border-[#142A38] relative">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("login"); setError(null); }}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider rounded-[1rem] transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                      authMode === 'login' 
                        ? "text-[#34D399] bg-[#0A261C] border border-[#34D399]/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]" 
                        : "text-slate-400 hover:text-slate-300 border border-transparent"
                    }`}
                  >
                    <User size={14} className={authMode === 'login' ? 'text-[#34D399]' : 'text-slate-500'} />
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signup"); setError(null); }}
                    className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider rounded-[1rem] transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                      authMode === 'signup' 
                        ? "text-[#34D399] bg-[#0A261C] border border-[#34D399]/30 shadow-[0_0_15px_rgba(52,211,153,0.1)]" 
                        : "text-slate-400 hover:text-slate-300 border border-transparent"
                    }`}
                  >
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                      <span className="absolute w-full h-[1.5px] bg-current rounded-full"></span>
                      <span className="absolute h-full w-[1.5px] bg-current rounded-full"></span>
                    </div>
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
                    className="mb-4 overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-start gap-3 backdrop-blur-md">
                      <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-snug">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex-1 flex flex-col h-full">
                <div className="flex-1 space-y-4">
                  {/* Signup Fields */}
                  <AnimatePresence mode="wait">
                    {authMode === "signup" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-4 overflow-hidden shrink-0"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Full Name</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                              <User size={16} />
                            </span>
                            <input
                              type="text"
                              placeholder="Ankit Nag"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full h-[52px] pl-11 pr-4 text-xs font-semibold rounded-xl border border-[#142A38] bg-[#030910] text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all shadow-inner"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Employee ID</label>
                          <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                              <Building2 size={16} />
                            </span>
                            <input
                              type="text"
                              placeholder="WL-0099"
                              value={employeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              className="w-full h-[52px] pl-11 pr-4 text-xs font-semibold rounded-xl border border-[#142A38] bg-[#030910] text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all shadow-inner"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <div className="space-y-2 shrink-0">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Corporate Email</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        placeholder="name@weblozy.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[52px] pl-11 pr-10 text-xs font-semibold rounded-xl border border-[#142A38] bg-[#030910] text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all shadow-inner"
                      />
                      {isEmailValid(email) ? (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                          <CheckCircle2 size={16} className="text-[#34D399]" />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Password Field */}
                  {(authMode === "login" || authMode === "signup") && (
                    <div className="space-y-2 shrink-0">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Access Key</label>
                        {authMode === "login" && (
                          <button 
                            type="button" 
                            onClick={() => setAuthMode("forgot-password")} 
                            className="text-[10px] font-black text-[#34D399] hover:underline uppercase tracking-widest"
                          >
                            Forgot Key?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                          <KeyRound size={16} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-[52px] pl-11 pr-10 text-xs font-semibold rounded-xl border border-[#142A38] bg-[#030910] text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
                        className="space-y-2 overflow-hidden shrink-0"
                      >
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Confirm Access Key</label>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
                            <KeyRound size={16} />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-[52px] pl-11 pr-10 text-xs font-semibold rounded-xl border border-[#142A38] bg-[#030910] text-white placeholder-slate-600 focus:outline-none focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] transition-all shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Options check & help */}
                  <div className="flex justify-between items-center pt-2 pb-2 shrink-0">
                    {authMode === 'login' ? (
                      <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-[#34D399] bg-[#0A261C] transition-colors">
                          <CheckCircle2 size={12} className="text-[#34D399]" />
                          <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" defaultChecked />
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Remember me</span>
                      </label>
                    ) : authMode === 'signup' ? (
                      <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-[6px] border border-[#34D399] bg-[#0A261C] transition-colors">
                          <CheckCircle2 size={12} className="text-[#34D399]" />
                          <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" defaultChecked />
                        </div>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">
                          I agree to the <span className="text-[#34D399] hover:underline">Terms</span>
                        </span>
                      </label>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setAuthMode("login")} 
                        className="text-[10px] font-black text-[#34D399] hover:underline uppercase tracking-widest"
                      >
                        Return to Login
                      </button>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="shrink-0 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-[#6EE7B7] via-[#34D399] to-[#38BDF8] text-[#030910] font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all duration-500 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    {/* Subtle shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#030910]/20 border-t-[#030910] rounded-full animate-spin relative z-10" />
                        <span className="relative z-10">Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">{authMode === "login" ? "SIGN IN" : authMode === "signup" ? "CREATE ACCOUNT" : "SEND RESET LINK"}</span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </button>
                </div>
                
                {/* Footer Shield text */}
                <div className="mt-auto pt-6 border-t border-[#142A38] flex items-center justify-center gap-2 text-slate-500">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-medium tracking-wide">Your data is secure with Weblozy</span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
}
