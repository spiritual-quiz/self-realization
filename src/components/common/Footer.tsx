"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Heart, ExternalLink } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function Footer() {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  // Hide footer on full-screen quiz play only
  if (pathname === "/quiz/play") {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#1E293B] via-[#141E2E] to-[#0F172A] text-slate-300 pt-14 pb-12 border-t-2 border-emerald-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Sacred Decorative Divider */}
        <div className="text-center mb-10">
          <span className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold tracking-wide">हरे कृष्ण • Hare Krishna</span>
          <LotusAccent className="opacity-70 my-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="SelfRealization Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Self<span className="text-amber-300">Realization</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="pt-2">
              <Link
                href="/live-classes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-sm"
              >
                <span>{t.nav.joinFreeClass}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/live-classes" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "कक्षाएं (Classes)" : "Classes"}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "ई-लर्निंग (E-Learning)" : "E-Learning"}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "क्विज़ (Quiz)" : "Quiz"}
                </Link>
              </li>
              <li>
                <Link href="/live-like-a-monk" className="hover:text-amber-400 transition-colors">
                  Live like a monk
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-amber-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-amber-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Programs */}
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              {t.footer.programs}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/live-classes" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "साप्ताहिक निःशुल्क भगवद्गीता कक्षा" : "Weekly Free Bhagavad-gītā Class"}
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "ऑनलाइन स्व-अध्ययन पाठ्यक्रम" : "Self-Paced E-Learning LMS"}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-amber-400 transition-colors">
                  {language === "hi" ? "वैदिक क्विज़ एवं प्रमाण-पत्र" : "Interactive Quizzes & Certificates"}
                </Link>
              </li>
              <li>
                <a 
                  href="https://live-like-a-monk.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold"
                >
                  <span>Live Like a Monk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Temple Address & Contact */}
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              {t.footer.connect}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-amber-200/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t.footer.addressText}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.footer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.footer.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-300/60 gap-4">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <span>Made with devotional seva</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Hari, Guru & Vaiṣṇavas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
