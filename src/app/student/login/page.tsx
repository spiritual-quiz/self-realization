"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Lock, Mail, ArrowRight, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function StudentLoginPage() {
  const { language } = useLanguage();
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/login");
  }, [router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg(language === "hi" ? "कृपया ईमेल और पासवर्ड दर्ज करें।" : "Please enter email and password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create student session
      const studentSession = {
        email: email.trim(),
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        loggedInAt: new Date().toISOString()
      };

      localStorage.setItem("sr_student_session", JSON.stringify(studentSession));
      setIsSubmitting(false);
      router.push("/student/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl space-y-6">
        
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto p-1 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-400/20 border border-emerald-400/40 shadow-xs">
            <Image
              src="/images/logo.png"
              alt="SelfRealization Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-0.5 rounded-full border border-emerald-300">
            {language === "hi" ? "विद्यार्थी पोर्टल" : "Student LMS Portal"}
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === "hi" ? "विद्यार्थी लॉगिन" : "Student Login"}
          </h1>
          <p className="text-xs text-slate-600">
            {language === "hi"
              ? "अपने पाठ्यक्रमों, अध्ययन नोट्स और प्रमाण-पत्रों तक पहुँचने के लिए लॉगिन करें।"
              : "Access your enrolled courses, study notes, and verified certificates."}
          </p>
          <LotusAccent className="my-1 opacity-70" />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {language === "hi" ? "ईमेल आईडी" : "Email Address"} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seeker@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {language === "hi" ? "पासवर्ड" : "Password"} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isSubmitting ? (language === "hi" ? "लॉगिन हो रहा है..." : "Logging in...") : (language === "hi" ? "लॉगिन करें" : "Sign In to Learning Dashboard")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
          <p>
            {language === "hi" ? "खाता नहीं है?" : "Don't have an account?"}{" "}
            <Link href="/courses" className="text-emerald-700 font-bold hover:underline">
              {language === "hi" ? "पाठ्यक्रम एक्सप्लोर करें" : "Explore Courses"}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
