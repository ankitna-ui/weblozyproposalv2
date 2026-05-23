import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { 
  UserCog, Eye, EyeOff, CheckCircle2, AlertOctagon, Mail, IdCard, Lock, Image as ImageIcon, Upload, Briefcase
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingScreen from '@/components/ui/LoadingScreen';
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Profile State
  const [fullName, setFullName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [position, setPosition] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [email, setEmail] = useState("");

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Visibility State
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      setEmail(user.email || "");

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullName(data.fullName || "");
          setEmployeeId(data.employeeId || "");
          setPosition(data.position || "");
          setProfileImageUrl(data.profileImageUrl || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        toast.error("Image must be smaller than 2MB to avoid storage limits.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !employeeId.trim()) {
      toast.error("Full Name and Employee ID are required.");
      return;
    }

    setSavingProfile(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          fullName: fullName.trim(),
          employeeId: employeeId.trim(),
          position: position.trim(),
          profileImageUrl: profileImageUrl.trim()
        });
        toast.success("Strategic profile successfully updated!");
      }
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVerifyOldPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error("Please enter your current Access Key.");
      return;
    }

    setVerifyingPassword(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        setIsOldPasswordVerified(true);
        toast.success("Access Key verified. You may now establish a new key.");
      }
    } catch (error: any) {
      toast.error("Security Alert: Invalid current Access Key.");
      setOldPassword("");
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Keys cannot be empty.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New Access Key must contain at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Security keys do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        toast.success("Access Key successfully updated!");
        
        // Reset password fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOldPasswordVerified(false);
      }
    } catch (error: any) {
      toast.error("Failed to update password: " + error.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Operator Profile</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Manage your corporate identity and cryptographic access keys.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Identity Settings Form */}
          <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-black/20">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-[#99CB48]/10 flex items-center justify-center text-[#99CB48]">
                  <UserCog className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Identity Parameters</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Terminal ID (Email)</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <Input
                      type="email"
                      value={email}
                      disabled
                      className="h-11 pl-11 bg-white/[0.01] border-slate-200 dark:border-white/5 rounded-xl text-slate-500 dark:text-gray-400 font-bold tracking-tight uppercase text-xs opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[8px] text-slate-400 dark:text-gray-600 uppercase ml-1">Official communication ID is locked.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Full Name</Label>
                  <div className="relative group">
                    <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 pl-11 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white font-bold tracking-tight uppercase transition-all text-xs focus:border-[#99CB48]/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Employee ID</Label>
                  <div className="relative group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                    <Input
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="h-11 pl-11 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white font-bold tracking-tight uppercase transition-all text-xs focus:border-[#99CB48]/30"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Position / Role</Label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                    <Input
                      type="text"
                      placeholder="e.g. CEO, Corporate Manager"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="h-11 pl-11 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white font-bold tracking-tight uppercase transition-all text-xs focus:border-[#99CB48]/30"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Profile Avatar</Label>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                      {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 opacity-50" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="relative group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                        <Input
                          type="text"
                          placeholder="Paste image URL here..."
                          value={profileImageUrl}
                          onChange={(e) => setProfileImageUrl(e.target.value)}
                          className="h-10 pl-11 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white font-bold transition-all text-xs focus:border-[#99CB48]/30"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/5"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">OR</span>
                        <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/5"></div>
                      </div>

                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="h-10 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer text-slate-700 dark:text-gray-300">
                          <Upload className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload from Gallery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={savingProfile} className="w-full h-11 text-[10px] font-black uppercase tracking-[0.3em] bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all active:scale-[0.98]">
                {savingProfile ? "Syncing Logic..." : "Update Identity Data"}
              </Button>
            </form>
          </div>

          {/* Security Protocol Form (Password Reset) */}
          <div className="bg-white dark:bg-[#11151D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-xl shadow-black/20">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Security Protocol</h2>
              </div>

              <AnimatePresence mode="wait">
                {!isOldPasswordVerified ? (
                  <motion.form 
                    key="verify" 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }} 
                    onSubmit={handleVerifyOldPassword} 
                    className="space-y-6"
                  >
                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3">
                      <AlertOctagon className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
                        To mutate your Access Key, you must first verify your current key to establish an authorized security handshake with the server.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Current Access Key</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="h-11 pl-11 pr-10 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-orange-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(prev => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-orange-500 transition-colors"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" disabled={verifyingPassword} className="w-full h-11 text-[10px] font-black uppercase tracking-[0.3em] bg-orange-500 text-black hover:bg-orange-600 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                      {verifyingPassword ? "Verifying Token..." : "Verify Current Key"}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="update" 
                    initial={{ opacity: 0, x: 10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    onSubmit={handleUpdatePassword} 
                    className="space-y-6"
                  >
                    <div className="p-4 rounded-xl bg-[#99CB48]/5 border border-[#99CB48]/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#99CB48] mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
                        Security handshake established. You may now input a new high-strength Access Key. Minimum 6 characters required.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">New Access Key</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-11 pl-11 pr-10 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-[#99CB48]/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(prev => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-[#99CB48] transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] text-[8px] ml-1">Confirm New Key</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#99CB48] transition-colors" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 pl-11 pr-10 bg-slate-50 dark:bg-[#0B0E14] border-slate-300 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-[#99CB48] text-slate-900 dark:text-white placeholder:text-gray-800 font-bold transition-all text-xs focus:border-[#99CB48]/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-[#99CB48] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" onClick={() => setIsOldPasswordVerified(false)} className="h-11 px-6 text-[10px] font-black uppercase tracking-[0.3em] bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updatingPassword} className="flex-1 h-11 text-[10px] font-black uppercase tracking-[0.3em] bg-[#99CB48] text-black hover:bg-[#88B540] rounded-xl shadow-lg shadow-[#99CB48]/10 transition-all active:scale-[0.98]">
                        {updatingPassword ? "Encrypting..." : "Update Security Key"}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
