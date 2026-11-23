"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Globe, Check } from "lucide-react";
import { Language } from "@/types";

export default function LanguageModal() {
  const { showLangModal, confirmInitialLanguage, language } = useLanguage();
  const [selected, setSelected] = useState<Language>(language || "en");

  if (!showLangModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden transform transition-all">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white text-center relative">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-xs">
            <Globe className="w-6 h-6 text-amber-100" />
          </div>
          <h2 className="text-xl font-bold tracking-wide">
            Welcome to SelfRealization
          </h2>
          <p className="text-sm text-amber-100 mt-1">
            कृपया अपनी भाषा चुनें / Please choose your language
          </p>
        </div>

        {/* Language Options */}
        <div className="p-6 space-y-4">
          <button
            type="button"
            onClick={() => setSelected("hi")}
            className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
              selected === "hi"
                ? "border-amber-600 bg-amber-50/70 shadow-sm"
                : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">हिन्दी</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                  Hindi
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                वेबसाइट, पाठ्यक्रम और लाइव कक्षाएं हिंदी में देखें
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selected === "hi"
                  ? "bg-amber-600 border-amber-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {selected === "hi" && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected("en")}
            className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
              selected === "en"
                ? "border-amber-600 bg-amber-50/70 shadow-sm"
                : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">English</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                  International
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Browse website, courses and live sessions in English
              </p>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selected === "en"
                  ? "bg-amber-600 border-amber-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {selected === "en" && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => confirmInitialLanguage(selected)}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{selected === "hi" ? "आगे बढ़ें" : "Continue"}</span>
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            You can always switch language from the top header anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
