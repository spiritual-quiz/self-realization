"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Menu, 
  X, 
  Globe, 
  BookOpen, 
  HelpCircle, 
  Video, 
  Sparkles, 
  Compass, 
  Calendar,
  ChevronDown,
  Info,
  Phone,
  Upload,
  ArrowRight,
  GraduationCap
} from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classesDropdownOpen, setClassesDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const [mobileClassesOpen, setMobileClassesOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const classesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (classesRef.current && !classesRef.current.contains(event.target as Node)) {
        setClassesDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs transition-all">
      {/* Top Sacred Ribbon */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-amber-50 text-[11px] sm:text-xs py-1 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
        <span>Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare • Hare Rāma Hare Rāma Rāma Rāma Hare Hare</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-serif font-black text-xl leading-none">ॐ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-amber-700 transition-colors">
                Self<span className="text-amber-600">Realization</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-amber-800/80 font-medium tracking-wide">
                {language === "hi" ? "आत्म-साक्षात्कार मंच" : "Spiritual Outreach & LMS"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Professional & Streamlined */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* 1. Home */}
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
            >
              {t.nav.home}
            </Link>

            {/* 2. Classes (Dropdown: Live Classes + Self-Paced Courses) */}
            <div
              ref={classesRef}
              className="relative"
              onMouseEnter={() => setClassesDropdownOpen(true)}
              onMouseLeave={() => setClassesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setClassesDropdownOpen(!classesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  classesDropdownOpen ? "text-amber-700 bg-amber-50" : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                <span>{language === "hi" ? "कक्षाएं" : "Classes"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${classesDropdownOpen ? "rotate-180 text-amber-700" : "text-gray-400"}`} />
              </button>

              {classesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-2 space-y-1">
                    <Link
                      href="/live-classes"
                      onClick={() => setClassesDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                          {language === "hi" ? "लाइव कक्षाएं" : "Live Classes"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === "hi" ? "साप्ताहिक निःशुल्क एवं विशेष सेमिनार" : "Weekly free interactive & masterclasses"}
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/courses"
                      onClick={() => setClassesDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                          {language === "hi" ? "स्व-अध्ययन पाठ्यक्रम (LMS)" : "Self-Paced Courses"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === "hi" ? "ऑनलाइन वीडियो पाठ एवं प्रमाण-पत्र" : "Structured video learning & assessments"}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Quiz */}
            <Link
              href="/quiz"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{language === "hi" ? "क्विज़" : "Quiz"}</span>
            </Link>

            {/* 4. Live Like a Monk */}
            <Link
              href="/live-like-a-monk"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Live Like a Monk</span>
            </Link>

            {/* 5. More / Rest Dropdown */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  moreDropdownOpen ? "text-amber-700 bg-amber-50" : "text-gray-700 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                <span>{language === "hi" ? "अन्य" : "More"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180 text-amber-700" : "text-gray-400"}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-fade-in z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-2 space-y-1">
                    <Link
                      href="/about"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.nav.about}</p>
                        <p className="text-[11px] text-gray-500">{language === "hi" ? "दर्शन एवं परंपरा" : "Lineage & philosophy"}</p>
                      </div>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.nav.contact}</p>
                        <p className="text-[11px] text-gray-500">{language === "hi" ? "पता एवं संवाद" : "Location & helpline"}</p>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-gray-100" />

                    <Link
                      href="/quiz/upload"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100 text-amber-900 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">{language === "hi" ? "CSV क्विज़ अपलोड (Admin)" : "CSV Bulk Quiz Upload"}</p>
                        <p className="text-[10px] text-amber-800/80">{language === "hi" ? "10/15 प्रश्न एक साथ अपलोड करें" : "One-shot 10–15 question importer"}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Language Switcher & Primary Call to Action */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Bilingual Switcher */}
            <div className="flex items-center bg-amber-50 border border-amber-200 rounded-full p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
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
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  language === "en"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-900 hover:text-amber-700"
                }`}
              >
                English
              </button>
            </div>

            {/* Most Important Call to Action: Join a Free Class */}
            <Link
              href="/live-classes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t.nav.joinFreeClass}</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-900 flex items-center gap-1 shadow-xs"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === "hi" ? "ENG" : "हिन्दी"}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 border border-gray-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white/98 backdrop-blur-md px-4 pt-4 pb-6 shadow-2xl animate-fade-in space-y-3">
          {/* Prominent CTA in mobile menu */}
          <div>
            <Link
              href="/live-classes"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t.nav.joinFreeClass}</span>
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800"
            >
              <span>{t.nav.home}</span>
            </Link>

            {/* Mobile Classes Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileClassesOpen(!mobileClassesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800"
              >
                <span>{language === "hi" ? "कक्षाएं (Classes)" : "Classes"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileClassesOpen ? "rotate-180 text-amber-700" : "text-gray-400"}`} />
              </button>

              {mobileClassesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-amber-50/50 rounded-xl mb-1">
                  <Link
                    href="/live-classes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-700"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{language === "hi" ? "लाइव कक्षाएं" : "Live Classes"}</span>
                  </Link>
                  <Link
                    href="/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-700"
                  >
                    <GraduationCap className="w-4 h-4 text-orange-600" />
                    <span>{language === "hi" ? "स्व-अध्ययन पाठ्यक्रम (LMS)" : "Self-Paced Courses"}</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{language === "hi" ? "क्विज़" : "Quiz"}</span>
              </div>
            </Link>

            <Link
              href="/live-like-a-monk"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Live Like a Monk</span>
              </div>
            </Link>

            {/* Mobile More Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-amber-50 hover:text-amber-800"
              >
                <span>{language === "hi" ? "अन्य (More)" : "More"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileMoreOpen ? "rotate-180 text-amber-700" : "text-gray-400"}`} />
              </button>

              {mobileMoreOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-amber-50/50 rounded-xl mb-1">
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-700"
                  >
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>{t.nav.about}</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-amber-700"
                  >
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>{t.nav.contact}</span>
                  </Link>
                  <Link
                    href="/quiz/upload"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-bold text-amber-900 hover:text-amber-700"
                  >
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>CSV Bulk Quiz Upload</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
