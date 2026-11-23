"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function LiveClassesPage() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "साप्ताहिक एवं विशेष कक्षाएं" : "Live Interactive Sessions"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t.nav.classes}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi" 
            ? "भगवद्गीता के शाश्वत ज्ञान को समझने के लिए हमारी निःशुल्क और विशेष लाइव कक्षाओं में भाग लें।"
            : "Deepen your understanding of Bhagavad-gītā with experienced teachers through interactive online and temple sessions."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Free Classes Showcase */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>{language === "hi" ? "साप्ताहिक निःशुल्क कक्षाएं" : "Weekly Free Classes"}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% Free
              </span>
              <span className="text-xs text-gray-500 font-medium">Every Sunday</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === "hi" 
                ? "भगवद्गीता का रहस्य: आत्मा, कर्म और योग" 
                : "Bhagavad-gītā Unveiled: Soul, Karma & Yoga"}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === "hi"
                ? "जीवन के वास्तविक उद्देश्य, तनाव प्रबंधन और मन की शांति पर केंद्रित गहन साप्ताहिक व्याख्यान।"
                : "Weekly in-depth discourse focusing on life's true purpose, stress mastery, and inner peace."}
            </p>
            <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>06:00 PM – 07:30 PM IST</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Temple Hall & Live Zoom Stream</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(language === "hi" ? "Phase 2 में पंजीकरण फॉर्म सक्रिय किया जाएगा।" : "Registration flow will be active in Phase 2!")}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              {language === "hi" ? "निःशुल्क पंजीकरण करें" : "Register For Free"}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% Free
              </span>
              <span className="text-xs text-gray-500 font-medium">Every Wednesday</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === "hi" 
                ? "महामंत्र ध्यान एवं मानसिक एकाग्रता कार्यशाला" 
                : "Mantra Meditation & Mind Concentration Workshop"}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === "hi"
                ? "हरे कृष्ण महामंत्र के वैज्ञानिक लाभ और प्रतिदिन 15 मिनट ध्यान करने की व्यावहारिक तकनीक।"
                : "Scientific benefits of the Hare Krishna Maha-Mantra with practical 15-minute daily meditation techniques."}
            </p>
            <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>07:30 PM – 08:30 PM IST</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Online Zoom Interactive Session</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(language === "hi" ? "Phase 2 में पंजीकरण फॉर्म सक्रिय किया जाएगा।" : "Registration flow will be active in Phase 2!")}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              {language === "hi" ? "निःशुल्क पंजीकरण करें" : "Register For Free"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
