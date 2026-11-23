"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Sparkles, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@selfrealization.org");
  const [password, setPassword] = useState("SelfRealization@2026");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify Admin Credentials
    const validEmails = ["admin@selfrealization.org", "madhavcarandas@gmail.com"];
    const validPass = "SelfRealization@2026";

    setTimeout(() => {
      if (validEmails.includes(email.trim().toLowerCase()) && password.trim() === validPass) {
        localStorage.setItem("sr_admin_session", JSON.stringify({
          email: email.trim(),
          role: "super_admin",
          loginAt: new Date().toISOString()
        }));
        document.cookie = "sr_admin_session=active; path=/; max-age=86400; SameSite=Lax";
        router.push("/admin");
      } else {
        setError("Invalid admin credentials. Please verify your email and password.");
        setLoading(false);
      }
    }, 600);
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold">Pre-configured Admin Access:</p>
          <p>Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin@selfrealization.org</code></p>
          <p>Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded">SelfRealization@2026</code></p>
        </div>
      </div>
    </div>
  );
}
