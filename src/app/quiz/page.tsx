"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HelpCircle, Award, Sparkles, Volume2, ShieldCheck, ArrowRight, Upload, BookOpen } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function QuizOverviewPage() {
  const { t, language } = useLanguage();
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
    setCustomQuizzes(saved);
  }, []);

  const defaultQuizzes = [
    {
      id: "bg-overview",
      title: {
        en: "Bhagavad-gītā Wisdom Challenge (10 Core Verses)",
        hi: "श्रीमद्भगवद्गीता ज्ञान प्रश्नोत्तरी (10 प्रमुख श्लोक)"
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
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "सार्वजनिक प्रश्नोत्तरी मंच" : "Interactive Public Quizzes"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.nav.quizzes}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {language === "hi"
            ? "बिना किसी लॉगिन या पासवर्ड के तुरंत खेलें। 4 पेस्टल कार्ड, पुष्प-वर्षा, मधुर ध्वनि एवं तुरंत डाउनलोड होने वाला प्रमाण-पत्र!"
            : "Play immediately without login or password. Enjoy pastel answer cards, falling petals, pleasant chimes, and instant downloadable certificates."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Admin CSV Upload Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Admin Feature</span>
          <h3 className="text-xl font-bold text-gray-900">Have a 10 or 15 Question Quiz in CSV?</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Upload your questions in one shot using a CSV file. Includes ready-made sample template!
          </p>
        </div>
        <Link
          href="/quiz/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Quiz via CSV</span>
        </Link>
      </div>

      {/* Custom Admin Quizzes if any */}
      {customQuizzes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Recently Uploaded Quizzes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customQuizzes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Uploaded via CSV
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {q.title.en}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                    <span>{q.questionCount} Questions</span>
                    <span>{q.totalMarks} Marks</span>
                  </div>
                </div>

                <Link
                  href={`/quiz/play?id=${q.id}`}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Play Uploaded Quiz</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Standard Quizzes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Featured Devotional Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaultQuizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group hover:border-amber-300"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                  {q.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-amber-700 transition-colors">
                  {q.title[language]}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>{q.questions} Questions</span>
                  <span>{q.marks} Points</span>
                  <span>{q.time}</span>
                </div>
              </div>

              <Link
                href="/quiz/play"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-amber-200" />
                <span>{language === "hi" ? "क्विज़ खेलें (No Login)" : "Start Quiz (No Login)"}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
