"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Home, 
  Calendar, 
  GraduationCap, 
  Award, 
  Compass, 
  Sparkles, 
  BookOpen, 
  User, 
  LogOut 
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const adminSession = localStorage.getItem("sr_admin_session");
        const studentSession = localStorage.getItem("sr_student_session");
        setIsLoggedIn(!!(adminSession || studentSession));
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sr_admin_session");
      localStorage.removeItem("sr_student_session");
      document.cookie = "sr_admin_session=; path=/; max-age=0; SameSite=Lax";
      setIsLoggedIn(false);
      window.location.href = "/login";
    }
  };

  // Exactly the items in the requested order: Home, Quiz, Courses, E-Learning, Live Like a Monk
  const navigationItems = [
    {
      href: "/",
      label: language === "hi" ? "होम" : "Home",
      fullLabel: "🏠 Home",
      icon: Home,
      exact: true,
      color: "text-amber-700",
    },
    {
      href: "/quiz",
      label: language === "hi" ? "क्विज़" : "Quiz",
      fullLabel: "🏆 Quiz",
      icon: Award,
      exact: false,
      color: "text-amber-500",
    },
    {
      href: "/live-classes",
      label: language === "hi" ? "पाठ्यक्रम" : "Courses",
      fullLabel: "📖 Courses",
      icon: BookOpen,
      exact: false,
      color: "text-amber-600",
    },
    {
      href: "/courses",
      label: language === "hi" ? "ई-लर्निंग" : "E-Learning",
      fullLabel: "🎓 E-Learning",
      icon: GraduationCap,
      exact: false,
      color: "text-orange-600",
    },
    {
      href: "/live-like-a-monk",
      label: "Live Like a Monk",
      fullLabel: "🧘 Live Like a Monk",
      icon: Compass,
      exact: false,
      color: "text-amber-800",
    },
  ];

  return (
    <>
      {/* =========================================================================
          1. TOP STICKY HEADER (Desktop & Mobile Brand / Ribbon)
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#1E293B] border-b-2 border-emerald-400/80 shadow-md transition-all">
        {/* Sacred Mahamantra Ribbon */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-emerald-200 text-[11px] sm:text-xs py-1 px-4 text-center tracking-wider font-semibold flex items-center justify-center gap-2 border-b border-emerald-500/20">
          <span>Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare • Hare Rāma Hare Rāma Rāma Rāma Hare Hare</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo / Brand - Highlighted with crisp golden-emerald ambient aura & distinct backdrop */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 p-1 rounded-2xl bg-gradient-to-br from-amber-400/25 via-emerald-400/20 to-emerald-500/30 border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all">
                <Image
                  src="/images/logo.png"
                  alt="SelfRealization Logo"
                  fill
                  className="object-contain p-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                  Self<span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">Realization</span>
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-300 font-bold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{language === "hi" ? "आत्म-साक्षात्कार मंच" : "Spiritual Outreach & LMS"}</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Option B: Sacred Emerald Mint Dock */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#0B1320] border border-emerald-500/40 rounded-full p-1 shadow-inner">
              {navigationItems.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400"
                        : "text-emerald-100/90 hover:text-white hover:bg-emerald-950/40"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-300"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Controls: Language Switcher & Primary Call to Action */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Bilingual Switcher */}
              <div className="flex items-center bg-[#0B1320] border border-emerald-500/40 rounded-full p-0.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    language === "hi"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-xs"
                      : "text-emerald-200/80 hover:text-white"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black shadow-xs"
                      : "text-emerald-200/80 hover:text-white"
                  }`}
                >
                  English
                </button>
              </div>

              {/* Unified Login / Logout Action */}
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 hover:border-rose-400 transition-all shadow-xs cursor-pointer"
                  title="Logout / लॉगआउट"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>{language === "hi" ? "लॉगआउट" : "Logout"}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 hover:text-white bg-[#0B1320] border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-950/40 transition-all shadow-xs"
                  title="Login / लॉगिन (Admin & Student)"
                >
                  <User className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{language === "hi" ? "लॉगिन" : "Login"}</span>
                </Link>
              )}

              {/* Join Free Class CTA */}
              <Link
                href="/live-classes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-md shadow-emerald-600/30 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{t.nav.joinFreeClass}</span>
              </Link>
            </div>

            {/* Mobile Header Right: Language Switcher & Login/Logout */}
            <div className="flex items-center gap-1.5 lg:hidden">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-500/40 hover:text-white flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Logout / लॉगआउट"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span>{language === "hi" ? "लॉगआउट" : "Logout"}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-200 bg-[#0B1320] border border-emerald-500/40 hover:text-white flex items-center gap-1 shadow-xs"
                  title="Login / लॉगिन"
                >
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>{language === "hi" ? "लॉगिन" : "Login"}</span>
                </Link>
              )}

              <div className="flex items-center bg-[#0B1320] border border-emerald-500/40 rounded-lg p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer ${
                    language === "hi" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" : "text-emerald-200"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer ${
                    language === "en" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" : "text-emerald-200"
                  }`}
                >
                  Eng
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE HORIZONTAL NAVIGATION MENU AT THE BOTTOM (Native App Bar)
          ========================================================================= */}
      <nav 
        aria-label="Mobile Bottom Horizontal Menu"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] border-t-2 border-emerald-400/60 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] py-1.5 px-1.5 flex items-center justify-around"
      >
        {/* 1. 🏠 Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname === "/" 
              ? "bg-emerald-500/25 text-emerald-300 font-black scale-105 ring-1 ring-emerald-400/50" 
              : "text-slate-300 hover:text-white font-medium"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "text-emerald-400 stroke-[2.5]" : "text-slate-300"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "होम" : "Home"}
          </span>
        </Link>

        {/* 2. 🏆 Quiz */}
        <Link
          href="/quiz"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/quiz") 
              ? "bg-emerald-500/25 text-emerald-300 font-black scale-105 ring-1 ring-emerald-400/50" 
              : "text-slate-300 hover:text-white font-medium"
          }`}
        >
          <Award className={`w-5 h-5 ${pathname.startsWith("/quiz") ? "text-emerald-400 stroke-[2.5]" : "text-slate-300"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "क्विज़" : "Quiz"}
          </span>
        </Link>

        {/* 3. 📖 Courses */}
        <Link
          href="/live-classes"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/live-classes") 
              ? "bg-emerald-500/25 text-emerald-300 font-black scale-105 ring-1 ring-emerald-400/50" 
              : "text-slate-300 hover:text-white font-medium"
          }`}
        >
          <BookOpen className={`w-5 h-5 ${pathname.startsWith("/live-classes") ? "text-emerald-400 stroke-[2.5]" : "text-slate-300"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "पाठ्यक्रम" : "Courses"}
          </span>
        </Link>

        {/* 4. 🎓 E-Learning */}
        <Link
          href="/courses"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/courses") 
              ? "bg-emerald-500/25 text-emerald-300 font-black scale-105 ring-1 ring-emerald-400/50" 
              : "text-slate-300 hover:text-white font-medium"
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${pathname.startsWith("/courses") ? "text-emerald-400 stroke-[2.5]" : "text-slate-300"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "ई-लर्निंग" : "E-Learning"}
          </span>
        </Link>

        {/* 5. 🧘 Live Like a Monk */}
        <Link
          href="/live-like-a-monk"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/live-like-a-monk") 
              ? "bg-emerald-500/25 text-emerald-300 font-black scale-105 ring-1 ring-emerald-400/50" 
              : "text-slate-300 hover:text-white font-medium"
          }`}
        >
          <Compass className={`w-5 h-5 ${pathname.startsWith("/live-like-a-monk") ? "text-emerald-400 stroke-[2.5]" : "text-slate-300"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate font-bold">
            Live Like a Monk
          </span>
        </Link>
      </nav>
    </>
  );
}
