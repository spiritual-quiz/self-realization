"use client";

import React from "react";
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
  Sparkles 
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();

  // Exactly the 5 items requested by the user
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
      href: "/live-classes",
      label: language === "hi" ? "कक्षाएं" : "Classes",
      fullLabel: "📅 Classes",
      icon: Calendar,
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
      href: "/quiz",
      label: language === "hi" ? "क्विज़" : "Quiz",
      fullLabel: "🏆 Quiz",
      icon: Award,
      exact: false,
      color: "text-amber-500",
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
      <header className="sticky top-0 z-40 w-full bg-[#FFF9EE]/95 backdrop-blur-md border-b border-amber-300/70 shadow-xs transition-all">
        {/* Sacred Mahamantra Ribbon */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-amber-50 text-[11px] sm:text-xs py-1 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
          <span>Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare • Hare Rāma Hare Rāma Rāma Rāma Hare Hare</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="SelfRealization Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900 group-hover:text-amber-700 transition-colors">
                  Self<span className="text-amber-600">Realization</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-amber-800/80 font-bold tracking-wide">
                  {language === "hi" ? "आत्म-साक्षात्कार मंच" : "Spiritual Outreach & LMS"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Professional & Streamlined */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navigationItems.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-100/80 text-amber-900 shadow-xs ring-1 ring-amber-300"
                        : "text-gray-800 hover:text-amber-700 hover:bg-amber-100/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-700" : link.color || "text-gray-600"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Controls: Language Switcher & Primary Call to Action */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Bilingual Switcher */}
              <div className="flex items-center bg-amber-100/70 border border-amber-300 rounded-full p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    language === "hi"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-900 hover:text-amber-700"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-900 hover:text-amber-700"
                  }`}
                >
                  English
                </button>
              </div>

              {/* Join Free Class CTA */}
              <Link
                href="/live-classes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.nav.joinFreeClass}</span>
              </Link>
            </div>

            {/* Mobile Header Right: Language Switcher */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <div className="flex items-center bg-amber-100/80 border border-amber-300 rounded-lg p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer ${
                    language === "hi" ? "bg-amber-600 text-white shadow-xs" : "text-amber-900"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 text-[11px] font-black rounded-md transition-all cursor-pointer ${
                    language === "en" ? "bg-amber-600 text-white shadow-xs" : "text-amber-900"
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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF9EE]/98 backdrop-blur-xl border-t border-amber-300/80 shadow-[0_-4px_25px_rgba(180,83,9,0.12)] py-1.5 px-1.5 flex items-center justify-around"
      >
        {/* 1. 🏠 Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname === "/" 
              ? "text-amber-700 font-black scale-105" 
              : "text-gray-600 hover:text-gray-900 font-medium"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "text-amber-600 stroke-[2.5]" : "text-gray-600"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "होम" : "Home"}
          </span>
        </Link>

        {/* 2. 📅 Classes */}
        <Link
          href="/live-classes"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/live-classes") 
              ? "text-amber-700 font-black scale-105" 
              : "text-gray-600 hover:text-gray-900 font-medium"
          }`}
        >
          <Calendar className={`w-5 h-5 ${pathname.startsWith("/live-classes") ? "text-amber-600 stroke-[2.5]" : "text-gray-600"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "कक्षाएं" : "Classes"}
          </span>
        </Link>

        {/* 3. 🎓 E-Learning */}
        <Link
          href="/courses"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/courses") 
              ? "text-orange-700 font-black scale-105" 
              : "text-gray-600 hover:text-gray-900 font-medium"
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${pathname.startsWith("/courses") ? "text-orange-600 stroke-[2.5]" : "text-gray-600"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "ई-लर्निंग" : "E-Learning"}
          </span>
        </Link>

        {/* 4. 🏆 Quiz */}
        <Link
          href="/quiz"
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/quiz") 
              ? "text-amber-700 font-black scale-105" 
              : "text-gray-600 hover:text-gray-900 font-medium"
          }`}
        >
          <Award className={`w-5 h-5 ${pathname.startsWith("/quiz") ? "text-amber-600 stroke-[2.5]" : "text-gray-600"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate">
            {language === "hi" ? "क्विज़" : "Quiz"}
          </span>
        </Link>

        {/* 5. 🧘 Live Like a Monk */}
        <Link
          href="/live-like-a-monk"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all grow text-center ${
            pathname.startsWith("/live-like-a-monk") 
              ? "text-amber-800 font-black scale-105" 
              : "text-gray-600 hover:text-gray-900 font-medium"
          }`}
        >
          <Compass className={`w-5 h-5 ${pathname.startsWith("/live-like-a-monk") ? "text-amber-700 stroke-[2.5]" : "text-gray-600"}`} />
          <span className="text-[10px] mt-0.5 leading-tight truncate font-bold">
            Live Like a Monk
          </span>
        </Link>
      </nav>
    </>
  );
}
