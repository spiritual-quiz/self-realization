"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  CheckCircle2, 
  X,
  Eye,
  EyeOff,
  Sparkles,
  User
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

function UnifiedLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const { language } = useLanguage();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [directResetUrl, setDirectResetUrl] = useState<string | null>(null);

  // Reset password modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // If user opens link with ?mode=reset
  useEffect(() => {
    if (modeParam === "reset") {
      setShowResetModal(true);
    }
  }, [modeParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const inputUser = usernameOrEmail.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setError("Please enter both Username/Email and Password.");
      setLoading(false);
      return;
    }

    // 1. CHECK ADMIN CREDENTIALS
    const validAdminIdentifiers = ["madhavcarandas@gmail.com", "admin@selfrealization.org", "admin", "madhavcarandas"];
    const isAdminCandidate = validAdminIdentifiers.includes(inputUser) || inputUser.startsWith("admin");

    if (isAdminCandidate) {
      const defaultPass = "SelfRealization@2026";
      const customPass = localStorage.getItem("sr_admin_custom_password");

      // Check remote Firestore
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
        const adminEmail = inputUser.includes("@") ? inputUser : "madhavcarandas@gmail.com";
        localStorage.setItem("sr_admin_session", JSON.stringify({
          email: adminEmail,
          role: "super_admin",
          loginAt: new Date().toISOString()
        }));
        document.cookie = "sr_admin_session=active; path=/; max-age=86400; SameSite=Lax";
        
        // Open Admin Dashboard
        router.push("/admin");
        return;
      } else {
        setError("Invalid password for this account. Please verify your credentials or reset password.");
        setLoading(false);
        return;
      }
    }

    // 2. STUDENT CREDENTIALS FLOW
    // If student credential is given, student dashboard will open
    let studentName = inputUser.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    
    // Check local registrations for matching name
    try {
      const cachedRegs = localStorage.getItem("sr_class_registrations");
      if (cachedRegs) {
        const list = JSON.parse(cachedRegs);
        const match = list.find((r: any) => 
          (r.email && r.email.toLowerCase() === inputUser) ||
          (r.whatsapp && r.whatsapp === inputUser)
        );
        if (match?.name) {
          studentName = match.name;
        }
      }
    } catch (e) {}

    const studentSession = {
      email: inputUser.includes("@") ? inputUser : `${inputUser}@student.selfrealization.org`,
      studentId: inputUser,
      name: studentName,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem("sr_student_session", JSON.stringify(studentSession));

    // Open Student Dashboard
    setTimeout(() => {
      router.push("/student/dashboard");
    }, 400);
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    const resetToken = "rst_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://selfrealization-platform.vercel.app";
    const resetUrl = `${origin}/login?mode=reset&token=${resetToken}&email=${encodeURIComponent(forgotEmail.trim().toLowerCase())}`;
    setDirectResetUrl(resetUrl);

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "password_reset",
          details: {
            email: forgotEmail.trim().toLowerCase(),
            resetUrl,
            token: resetToken
          }
        })
      });

      try {
        await fetch("https://formsubmit.co/ajax/madhavcarandas@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: "🔒 Password Reset Link - SelfRealization Portal",
            _template: "box",
            _captcha: "false",
            "SECURITY NOTICE": "Password Reset Request for SelfRealization Portal",
            "ACCOUNT": forgotEmail.trim().toLowerCase(),
            "PASSWORD RESET LINK": resetUrl,
            "INSTRUCTIONS": "Click the link above to set your new password."
          })
        });
      } catch (e) {}

      setForgotSuccess(`Password reset instructions generated for ${forgotEmail}. You can also use the direct link below.`);
    } catch (err: any) {
      setForgotError("Could not dispatch reset email: " + err.message);
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
      try {
        await setDoc(doc(db, "systemConfig", "admin_auth"), {
          password: newPassword,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {}

      localStorage.setItem("sr_admin_custom_password", newPassword);
      setResetSuccess(true);
      setTimeout(() => {
        localStorage.setItem("sr_admin_session", JSON.stringify({
          email: "madhavcarandas@gmail.com",
          role: "super_admin",
          loginAt: new Date().toISOString()
        }));
        document.cookie = "sr_admin_session=active; path=/; max-age=86400; SameSite=Lax";
        router.push("/admin");
      }, 1500);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            {language === "hi" ? "पोर्टल लॉगिन" : "Portal Login"}
          </h1>
          <p className="text-xs text-gray-500">
            {language === "hi" 
              ? "अपने डैशबोर्ड तक पहुँचने के लिए अपने क्रेडेंशियल्स दर्ज करें।" 
              : "Enter your credentials to access your dashboard."}
          </p>
          <LotusAccent className="my-1 opacity-70" />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Username/Email</span>
            </label>
            <input
              type="text"
              required
              value={usernameOrEmail}
              placeholder="Enter your username or email"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(null);
                  setForgotError(null);
                  setForgotEmail(usernameOrEmail.includes("@") ? usernameOrEmail : "");
                  setDirectResetUrl(null);
                  setShowForgotModal(true);
                }}
                className="text-xs text-amber-700 hover:text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400">
          <span>Official portal for students, seekers, and administrators.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-5">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                Reset Password
              </h3>
              <p className="text-xs text-gray-500">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
                {directResetUrl && (
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-[11px] text-gray-500 block mb-1">Direct Reset Link:</span>
                    <a
                      href={directResetUrl}
                      className="text-xs font-bold text-amber-800 underline break-all hover:text-amber-950 block"
                    >
                      Click here to reset your password directly ➔
                    </a>
                  </div>
                )}
              </div>
            )}

            {!forgotSuccess && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    placeholder="Enter registered email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                Set New Password
              </h3>
              <p className="text-xs text-gray-500">
                Enter your new secure password below.
              </p>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password updated successfully! Redirecting...</span>
              </div>
            )}

            {!resetSuccess && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    placeholder="Enter new password (min. 6 characters)"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <span>Update Password & Log In</span>
                  )}
                </button>
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
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    }>
      <UnifiedLoginContent />
    </Suspense>
  );
}
