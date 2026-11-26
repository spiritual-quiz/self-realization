"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  X,
  Loader2,
  User
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

function LoginContent() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin Forgot / Reset Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [directResetUrl, setDirectResetUrl] = useState<string | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check URL parameters for reset
  useEffect(() => {
    if (searchParams.get("mode") === "reset") {
      setShowResetModal(true);
    }
  }, [searchParams]);

  // Determine if entered identifier corresponds to Admin
  const cleanId = identifier.trim().toLowerCase();
  const isAdminId = 
    cleanId === "madhavcarandas@gmail.com" ||
    cleanId === "admin@selfrealization.org" ||
    cleanId === "admin" ||
    cleanId === "madhavcarandas" ||
    cleanId.startsWith("admin-") ||
    cleanId.includes("admin@");

  // Handle Quick Demo Fill
  const handleQuickFill = (type: "admin" | "student") => {
    if (type === "admin") {
      setIdentifier("madhavcarandas@gmail.com");
      setPassword("SelfRealization@2026");
    } else {
      setIdentifier("student@selfrealization.org");
      setPassword("student123");
    }
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const inputId = identifier.trim();
    const inputPass = password.trim();

    if (!inputId) {
      setErrorMsg(language === "hi" ? "कृपया अपनी आईडी या ईमेल दर्ज करें।" : "Please enter your ID or Email.");
      return;
    }
    if (!inputPass) {
      setErrorMsg(language === "hi" ? "कृपया अपना पासवर्ड दर्ज करें।" : "Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. ADMIN LOGIN FLOW
      if (isAdminId) {
        const validEmails = ["madhavcarandas@gmail.com", "admin@selfrealization.org", "admin", "madhavcarandas"];
        const defaultPass = "SelfRealization@2026";
        const customPass = localStorage.getItem("sr_admin_custom_password");

        // Remote Firestore check
        let remotePass = null;
        try {
          const snap = await getDoc(doc(db, "systemConfig", "admin_auth"));
          if (snap.exists()) {
            remotePass = snap.data()?.password;
          }
        } catch (err) {}

        const passwordValid =
          inputPass === defaultPass ||
          (customPass && inputPass === customPass) ||
          (remotePass && inputPass === remotePass);

        if (passwordValid) {
          const adminEmail = inputId.includes("@") ? inputId.toLowerCase() : "madhavcarandas@gmail.com";
          localStorage.setItem("sr_admin_session", JSON.stringify({
            email: adminEmail,
            role: "super_admin",
            loginAt: new Date().toISOString()
          }));
          document.cookie = "sr_admin_session=active; path=/; max-age=86400; SameSite=Lax";
          
          // Route directly to Admin Console
          router.push("/admin");
          return;
        } else {
          setErrorMsg(
            language === "hi"
              ? "अमान्य एडमिन पासवर्ड। कृपया सही पासवर्ड दर्ज करें।"
              : "Invalid administrator password. Please check your credentials or reset password below."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // 2. STUDENT LOGIN FLOW
      // If student ID is given, student details will open
      const studentEmail = inputId.includes("@") ? inputId.toLowerCase() : `${inputId.toLowerCase()}@student.selfrealization.org`;
      
      // Look up student name from past registrations or derive from ID
      let studentName = inputId.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      try {
        const cachedRegs = localStorage.getItem("sr_class_registrations");
        if (cachedRegs) {
          const list = JSON.parse(cachedRegs);
          const matched = list.find((r: any) => 
            (r.email && r.email.toLowerCase() === inputId.toLowerCase()) ||
            (r.whatsapp && r.whatsapp === inputId)
          );
          if (matched?.name) {
            studentName = matched.name;
          }
        }
      } catch (e) {}

      const studentSession = {
        email: studentEmail,
        studentId: inputId,
        name: studentName,
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem("sr_student_session", JSON.stringify(studentSession));

      // Route directly to Student Details / Dashboard
      setTimeout(() => {
        router.push("/student/dashboard");
      }, 400);

    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during login.");
      setIsSubmitting(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);
    setDirectResetUrl(null);

    const emailToReset = forgotEmail.trim().toLowerCase();
    const allowedEmails = ["madhavcarandas@gmail.com", "admin@selfrealization.org"];

    if (!allowedEmails.includes(emailToReset)) {
      setForgotError("This email is not registered as an administrator.");
      setForgotLoading(false);
      return;
    }

    try {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await setDoc(doc(db, "systemConfig", "password_reset_token"), {
        token: resetToken,
        email: emailToReset,
        expiresAt: expiresAt
      });

      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://selfrealization-platform.vercel.app";
      const resetLink = `${currentOrigin}/login?mode=reset&token=${resetToken}`;
      setDirectResetUrl(resetLink);

      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: "madhavcarandas@gmail.com",
            subject: "Password Reset Request - SelfRealization Portal",
            text: `Admin Password Reset requested. Use this link: ${resetLink}`
          })
        });
      } catch (e) {}

      setForgotSuccess("Password reset token generated! You can click the recovery link below.");
    } catch (err: any) {
      setForgotError("Could not generate reset link: " + err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset password execution
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      localStorage.setItem("sr_admin_custom_password", newPassword);
      await setDoc(doc(db, "systemConfig", "admin_auth"), {
        password: newPassword,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setResetSuccess(true);
      setTimeout(() => {
        setShowResetModal(false);
        setPassword(newPassword);
      }, 1500);
    } catch (err: any) {
      setResetError("Failed to update password: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-stone-50 via-amber-50/30 to-stone-100">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto p-1.5 rounded-2xl bg-gradient-to-br from-amber-400/20 via-emerald-400/20 to-emerald-500/30 border border-emerald-400/50 shadow-md">
            <Image
              src="/images/logo.png"
              alt="SelfRealization Logo"
              fill
              className="object-contain p-1 filter drop-shadow-sm"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === "hi" ? "एकीकृत प्रवेश द्वार" : "Unified Portal Login"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === "hi" ? "प्रवेश / लॉगिन" : "Portal Sign In"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {language === "hi"
              ? "विद्यार्थी आईडी दर्ज करने पर विद्यार्थी डैशबोर्ड खुलेगा, और एडमिन आईडी दर्ज करने पर एडमिन कंसोल खुलेगा।"
              : "Enter your Student ID to open student details, or your Admin ID to open the administrative console."}
          </p>

          <LotusAccent className="my-1 opacity-70" />
        </div>

        {/* Quick Demo Helper Tabs */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
            {language === "hi" ? "त्वरित परीक्षण आईडी (क्लिक करें):" : "Quick Demo ID Fill (Click to test):"}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("student")}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
            >
              <GraduationCap className="w-3 h-3 text-emerald-700" />
              <span>Student ID Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-amber-700" />
              <span>Admin ID Demo</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* User ID / Email Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {language === "hi" ? "विद्यार्थी या एडमिन आईडी / ईमेल" : "Student ID or Admin Email"} *
              </label>
              {identifier && (
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isAdminId ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                }`}>
                  {isAdminId ? "🛡️ Admin Account" : "🎓 Student Account"}
                </span>
              )}
            </div>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="madhavcarandas@gmail.com or student@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm bg-white font-medium"
              />
            </div>
            {/* Live routing explanation */}
            <p className="text-[11px] text-slate-500 mt-1">
              {isAdminId ? (
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin details and management console will open upon login.</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student details and learning dashboard will open upon login.</span>
                </span>
              )}
            </p>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {language === "hi" ? "पासवर्ड" : "Password"} *
              </label>
              {isAdminId && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(identifier.includes("@") ? identifier : "madhavcarandas@gmail.com");
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  {language === "hi" ? "पासवर्ड भूल गए?" : "Forgot Admin Password?"}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm bg-white font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === "hi" ? "सत्यापित हो रहा है..." : "Verifying Credentials..."}</span>
              </>
            ) : (
              <>
                <span>
                  {isAdminId
                    ? (language === "hi" ? "एडमिन कंसोल खोलें ➔" : "Open Admin Console ➔")
                    : (language === "hi" ? "विद्यार्थी डैशबोर्ड खोलें ➔" : "Open Student Dashboard ➔")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>New seeker?</span>
          <Link href="/live-classes" className="text-emerald-700 font-bold hover:underline">
            Enroll in Free Course ➔
          </Link>
        </div>
      </div>

      {/* =========================================================================
          MODAL: FORGOT ADMIN PASSWORD
          ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 border border-amber-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Reset Administrator Password</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Enter your registered administrator email to receive a password reset token.
            </p>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold space-y-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
                {directResetUrl && (
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-[10px] text-gray-500 block mb-1">Direct Recovery Link:</span>
                    <a
                      href={directResetUrl}
                      className="text-xs font-bold text-amber-800 underline break-all hover:text-amber-950 block"
                    >
                      Click here to reset password directly ➔
                    </a>
                  </div>
                )}
              </div>
            )}

            {!forgotSuccess && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="madhavcarandas@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    {forgotLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EXECUTE PASSWORD RESET
          ========================================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 border-2 border-emerald-400 shadow-2xl">
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Set New Administrator Password</span>
            </h3>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {resetError}
              </div>
            )}

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center">
                ✓ Password updated successfully! Closing...
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Password</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
