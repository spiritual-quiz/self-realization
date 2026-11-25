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
  Sparkles, 
  Compass, 
  Calendar,
  GraduationCap,
  Home,
  ChevronRight,
  Award
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Exactly the 5 items requested by the user
  const verticalMenuItems = [
    {
      href: "/",
      label: "🏠 Home (मुख्य पृष्ठ)",
      desktopLabel: language === "hi" ? "होम" : "Home",
      icon: Home,
      exact: true,
      color: "text-amber-700",
      bgHover: "hover:bg-amber-50"
    },
    {
      href: "/live-classes",
      label: "📅 Classes (निःशुल्क कक्षाएं)",
      desktopLabel: language === "hi" ? "कक्षाएं" : "Classes",
      icon: Calendar,
      exact: false,
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50"
    },
    {
      href: "/courses",
      label: "🎓 E-Learning Courses (पाठ्यक्रम)",
      desktopLabel: language === "hi" ? "पाठ्यक्रम" : "Courses",
      icon: GraduationCap,
      exact: false,
      color: "text-orange-600",
      bgHover: "hover:bg-amber-50"
    },
    {
      href: "/quiz",
      label: "🏆 Vedic Quiz Challenge (वैदिक क्विज़)",
      desktopLabel: language === "hi" ? "वैदिक क्विज़" : "Vedic Quiz",
      icon: Award,
      exact: false,
      color: "text-amber-500",
      bgHover: "hover:bg-amber-50"
    },
    {
      href: "/live-like-a-monk",
      label: "🧘 Live Like a Monk (साधु जीवन)",
      desktopLabel: language === "hi" ? "साधु जीवन" : "Monk Life",
      icon: Compass,
      exact: false,
      color: "text-amber-800",
      bgHover: "hover:bg-amber-50"
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
              {verticalMenuItems.map((link) => {
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
                    <span>{link.desktopLabel}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Controls: Language Switcher & Primary Call to Action */}
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

            {/* Mobile Header Right: Prominent Language Switcher & Vertical Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Language Switcher (comes before page open as requested) */}
              <div className="flex items-center bg-amber-50 border border-amber-300 rounded-lg p-0.5 shadow-xs">
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

              {/* Vertical Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-amber-600 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-900/20 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle vertical navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4 stroke-[2.5]" /> : <Menu className="w-4 h-4 stroke-[2.5]" />}
                <span>{mobileMenuOpen ? (language === "hi" ? "बंद करें" : "Close") : (language === "hi" ? "मेन्यू" : "Menu")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. STRICT 5-ITEM VERTICAL MENU (Bottom Sheet / Drawer for Mobile)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Dimmer */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Vertical Menu Container (Clean vertical list, only 5 items as specified) */}
          <div className="relative w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FFF1D6] border-t-4 border-amber-500 rounded-t-3xl shadow-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto animate-slide-up space-y-4">
            
            {/* Top Drag Notch */}
            <div className="w-12 h-1.5 bg-amber-300 rounded-full mx-auto" />

            {/* Menu Header with Logo */}
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
                    {language === "hi" ? "आत्म-साक्षात्कार मंच" : "Spiritual Outreach Portal"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm cursor-pointer shadow-xs"
                aria-label="Close Menu"
              >
                ✕
              </button>
            </div>

            {/* Language Switcher Bar inside menu */}
            <div className="flex items-center justify-between bg-amber-100/70 p-2 rounded-2xl border border-amber-300/60">
              <span className="text-xs font-bold text-amber-950 px-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-700" />
                <span>भाषा / Language:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
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
                  className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-amber-900 hover:bg-amber-200/50"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* PURE VERTICAL MENU LINKS - STRICTLY THE 5 USER-SPECIFIED ITEMS */}
            <div className="space-y-2 pt-1">
              {verticalMenuItems.map((link) => {
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all shadow-xs border ${
                      isActive
                        ? "bg-amber-500/20 text-amber-950 border-amber-400/80 ring-1 ring-amber-400/40"
                        : "bg-white/80 hover:bg-amber-50 text-gray-900 border-amber-200/60"
                    }`}
                  >
                    <span className="text-sm font-black tracking-tight">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Join Free Class CTA */}
            <div className="pt-2">
              <Link
                href="/live-classes"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md shadow-amber-900/20 active:scale-98 transition-transform"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.nav.joinFreeClass}</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
