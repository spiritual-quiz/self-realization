"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Sparkles
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const tokenParam = searchParams.get("token");

  const [email, setEmail] = useState("");
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

    const validEmails = ["madhavcarandas@gmail.com", "admin@selfrealization.org"];
    const defaultPass = "SelfRealization@2026";
    const customPass = localStorage.getItem("sr_admin_custom_password");

    // Also check Firestore for updated password
    let remotePass = null;
    try {
      const snap = await getDoc(doc(db, "systemConfig", "admin_auth"));
      if (snap.exists()) {
        remotePass = snap.data()?.password;
      }
    } catch (err) {}

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (
      validEmails.includes(inputEmail) &&
      (inputPass === defaultPass || (customPass && inputPass === customPass) || (remotePass && inputPass === remotePass))
    ) {
      localStorage.setItem("sr_admin_session", JSON.stringify({
        email: inputEmail,
        role: "super_admin",
        loginAt: new Date().toISOString()
      }));
      document.cookie = "sr_admin_session=active; path=/; max-age=86400; SameSite=Lax";
      router.push("/admin");
    } else {
      setError("Invalid admin credentials. Please enter your valid admin email and password.");
      setLoading(false);
    }
  };

  // Email dispatch retrieval
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    const resetToken = "rst_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://selfrealization-platform.vercel.app";
    const resetUrl = `${origin}/admin/login?mode=reset&token=${resetToken}&email=${encodeURIComponent(forgotEmail.trim().toLowerCase())}`;
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

      setForgotSuccess(
        `A password reset link has been dispatched to ${forgotEmail.trim()}! You can also reset it directly below:`
      );
    } catch (err: any) {
      setForgotError("Failed to dispatch password recovery email. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Perform Password Reset
  const handlePerformReset = async (e: React.FormEvent) => {
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
        updatedAt: new Date().toISOString(),
        updatedBy: "madhavcarandas@gmail.com"
      }, { merge: true });

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
    } catch (err: any) {
      // Fallback local storage
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
            Admin Portal Login
          </h1>
          <p className="text-xs text-gray-500">
            Secure administrative access for SelfRealization platform managers.
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
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              placeholder="xxxxx@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Password</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(null);
                  setForgotError(null);
                  setForgotEmail("");
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
                placeholder="Enter your admin password"
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
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-400">
          <span>Official administration portal for authorized coordinators only.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-5">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Reset Admin Password
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enter your registered admin email ID below. We will send you an official password reset link.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{forgotSuccess}</span>
                </div>

                {/* Direct 1-Click Reset Action */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-2">
                  <p className="text-[11px] text-amber-900 font-medium">
                    You can set your new password immediately right here:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setShowResetModal(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>Set New Password Now</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>Registered Admin Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    placeholder="xxxxx@gmail.com"
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Set New Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-5">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Choose New Admin Password
              </h2>
              <p className="text-xs text-gray-500">
                Set a strong, new password for the SelfRealization admin portal.
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  Password updated successfully! Logging into dashboard...
                </span>
              </div>
            ) : (
              <form onSubmit={handlePerformReset} className="space-y-4">
                {resetError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    placeholder="Enter at least 6 characters"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    placeholder="Re-enter your new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Password & Log In</span>
                      </>
                    )}
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

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    }>
      <AdminLoginInner />
    </Suspense>
  );
}
