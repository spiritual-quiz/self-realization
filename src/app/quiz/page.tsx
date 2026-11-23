"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HelpCircle, Award, Sparkles, Volume2, ShieldCheck, ArrowRight } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function QuizOverviewPage() {
  const { t, language } = useLanguage();

  const quizzes = [
    {
      id: "bg-overview",
      title: {
        en: "Bhagavad-gītā Wisdom Challenge (Chapters 1–6)",
        hi: "भगवद्गीता ज्ञान प्रश्नोत्तरी (अध्याय 1 से 6)"
      },
      category: "Bhagavad-gītā",
      questions: 10,
      marks: 100,
      time: "10 Mins"
    },
    {
      id: "krishna-philosophy",
      title: {
        en: "Vedic Science of the Soul & Karma",
        hi: "आत्मा एवं कर्म का वैदिक विज्ञान"
      },
      category: "Spiritual Science",
      questions: 10,
      marks: 100,
      time: "10 Mins"
    },
    {
      id: "temple-rituals",
      title: {
        en: "Daily Temple Sadhana & Kīrtana Culture",
        hi: "दैनिक मंदिर साधना एवं संकीर्तन संस्कृति"
      },
      category: "Devotional Living",
      questions: 10,
      marks: 100,
      time: "10 Mins"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "सार्वजनिक प्रश्नोत्तरी मंच" : "Interactive Public Quizzes"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t.nav.quizzes}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi"
            ? "बिना किसी लॉगिन के तुरंत क्विज़ खेलें। सही उत्तर पर पुष्प-वर्षा, मधुर ध्वनि एवं स्वतः प्रमाण-पत्र!"
            : "No login or password required. Play instant quizzes with pastel cards, sound effects, flower blossoms, and instant verifiable certificates."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                {q.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                {q.title[language]}
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>{q.questions} Questions</span>
                <span>{q.marks} Points</span>
                <span>{q.time}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(language === "hi" ? "Phase 3 में पूर्ण इंटरैक्टिव क्विज़ एरिना एवं साउंड इफेक्ट्स सक्रिय किए जाएंगे।" : "Full Interactive Quiz Arena with Audio & Blossom FX unlocks in Phase 3!")}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{language === "hi" ? "क्विज़ शुरू करें (No Login)" : "Start Quiz (No Login)"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
