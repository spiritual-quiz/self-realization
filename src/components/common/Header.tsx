"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Menu, 
  X, 
  Globe, 
  HelpCircle, 
  Sparkles, 
  Compass, 
  Calendar,
  GraduationCap,
  Home,
  Phone,
  Info,
  ChevronRight,
  Award
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      label: t.nav.home,
      icon: Home,
      exact: true,
    },
    {
      href: "/live-classes",
      label: language === "hi" ? "कक्षाएं" : "Classes",
      fullLabel: language === "hi" ? "कक्षाएं (Live Classes)" : "Live Classes",
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      href: "/courses",
      label: language === "hi" ? "ई-लर्निंग" : "Courses",
      fullLabel: language === "hi" ? "ई-लर्निंग (E-Learning)" : "E-Learning Courses",
      icon: GraduationCap,
      color: "text-orange-600",
    },
    {
      href: "/quiz",
      label: language === "hi" ? "क्विज़" : "Quiz",
      fullLabel: language === "hi" ? "वैदिक क्विज़ (Wisdom Quiz)" : "Vedic Quiz Challenge",
      icon: HelpCircle,
      color: "text-amber-500",
    },
    {
      href: "/live-like-a-monk",
      label: language === "hi" ? "साधु जीवन" : "Monk Life",
      fullLabel: "Live Like a Monk (साधु जीवन)",
      icon: Compass,
      color: "text-amber-700",
    },
  ];

  const secondaryLinks = [
    {
      href: "/about",
      label: language === "hi" ? "हमारे बारे में" : "About Outreach",
      icon: Info,
    },
    {
      href: "/contact",
      label: language === "hi" ? "संपर्क करें" : "Contact & Support",
      icon: Phone,
    },
  ];

  return (
    <>
      {/* =========================================================================
          1. TOP STICKY HEADER (Desktop & Mobile Brand / Ribbon)
          ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs transition-all">
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
              {navLinks.map((link) => {
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
                        ? "bg-amber-100/70 text-amber-900 shadow-xs"
                        : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-700" : link.color || "text-gray-500"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Language Switcher & Primary Call to Action */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Bilingual Switcher */}
              <div className="flex items-center bg-amber-50 border border-amber-200 rounded-full p-1 shadow-inner">
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

            {/* Mobile Header Right Controls: Quick Language Switcher & Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
                className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-amber-300 bg-amber-50 text-amber-900 flex items-center gap-1 shadow-xs cursor-pointer"
                title="Toggle Language / भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === "hi" ? "ENG" : "हिन्दी"}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 border border-amber-200 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-amber-900" /> : <Menu className="w-5 h-5 text-gray-800" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE FIXED BOTTOM NAVIGATION DOCK (Native App Feel)
          ========================================================================= */}
      <nav 
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-200/90 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] py-1.5 px-3 flex items-center justify-around"
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            pathname === "/" ? "text-amber-700 font-black scale-105" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === "/" ? "text-amber-600 stroke-[2.5]" : "text-gray-500"}`} />
          <span className="mt-0.5">{language === "hi" ? "होम" : "Home"}</span>
        </Link>

        {/* Classes */}
        <Link
          href="/live-classes"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/live-classes") ? "text-amber-700 font-black scale-105" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Calendar className={`w-5 h-5 ${pathname.startsWith("/live-classes") ? "text-amber-600 stroke-[2.5]" : "text-gray-500"}`} />
          <span className="mt-0.5">{language === "hi" ? "कक्षाएं" : "Classes"}</span>
        </Link>

        {/* Quiz (Center Highlighted) */}
        <Link
          href="/quiz"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/35 border-2 border-white ring-2 ring-amber-300 transform active:scale-95 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-amber-800 mt-0.5">
            {language === "hi" ? "क्विज़" : "Quiz"}
          </span>
        </Link>

        {/* Courses */}
        <Link
          href="/courses"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/courses") ? "text-amber-700 font-black scale-105" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${pathname.startsWith("/courses") ? "text-orange-600 stroke-[2.5]" : "text-gray-500"}`} />
          <span className="mt-0.5">{language === "hi" ? "कोर्स" : "Courses"}</span>
        </Link>

        {/* Vertical Bottom Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
            mobileMenuOpen ? "text-amber-700 font-black" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Menu className="w-5 h-5 text-gray-500" />
          <span className="mt-0.5">{language === "hi" ? "मेन्यू" : "Menu"}</span>
        </button>
      </nav>

      {/* =========================================================================
          3. SLEEK MOBILE BOTTOM VERTICAL MENU SHEET (Slides Up from Bottom)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Dimmer */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Bottom Vertical Menu Sheet */}
          <div className="relative w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FFF1D6] border-t-4 border-amber-500 rounded-t-3xl shadow-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto animate-slide-up space-y-4">
            
            {/* Top Drag Handle Notch */}
            <div className="w-12 h-1.5 bg-amber-300 rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9">
                  <Image
                    src="/images/logo.png"
                    alt="SelfRealization"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 leading-tight">
                    Self<span className="text-amber-600">Realization</span>
                  </h3>
                  <p className="text-[10px] text-amber-800 font-bold">
                    {language === "hi" ? "आध्यात्मिक मंच एवं शिक्षा" : "Spiritual Outreach Portal"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm cursor-pointer"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Language Switcher in Bottom Menu */}
            <div className="flex items-center justify-between bg-amber-100/70 p-1.5 rounded-2xl border border-amber-300/60">
              <span className="text-xs font-bold text-amber-950 px-2 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>भाषा / Language:</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    language === "hi"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-900 hover:bg-amber-200/50"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-900 hover:bg-amber-200/50"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Primary Action Button: Join Free Class */}
            <div>
              <Link
                href="/live-classes"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-lg shadow-amber-900/20 active:scale-98 transition-transform"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.nav.joinFreeClass}</span>
              </Link>
            </div>

            {/* Vertical Menu Navigation Links */}
            <div className="space-y-1.5 pt-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-amber-500/20 text-amber-950 border border-amber-400/60 shadow-xs"
                        : "text-gray-800 hover:bg-amber-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{link.fullLabel || link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-700/60" />
                  </Link>
                );
              })}

              {/* Secondary Links */}
              <div className="border-t border-amber-200/60 pt-2 space-y-1">
                {secondaryLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive ? "bg-amber-200/60 text-amber-950" : "text-gray-700 hover:bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-amber-700" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Notice */}
            <div className="text-center pt-2 text-[11px] text-amber-800/80 font-medium">
              Coordinator: <span className="font-bold text-amber-900">madhavcarandas@gmail.com</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
