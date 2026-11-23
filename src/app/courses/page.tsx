"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, PlayCircle, Clock, Award, CheckCircle } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function CoursesCataloguePage() {
  const { t, language } = useLanguage();

  const courses = [
    {
      id: "discover-yourself",
      title: {
        en: "Discover Yourself: Fundamentals of Bhagavad-gītā",
        hi: "स्वयं को जानें: भगवद्गीता के मूलभूत सिद्धांत"
      },
      desc: {
        en: "A structured 6-session foundation journey exploring soul, mind, reincarnation, and destiny.",
        hi: "आत्मा, मन, पुनर्जन्म और कर्म के रहस्यों को उद्घाटित करने वाली 6 सत्रों की यात्रा।"
      },
      level: "Beginner",
      lessons: "6 Lessons",
      duration: "3.5 Hours",
      price: "Free",
      isPaid: false
    },
    {
      id: "science-of-self-realization",
      title: {
        en: "Science of Self-Realization & Practical Devotion",
        hi: "आत्म-साक्षात्कार का विज्ञान एवं व्यावहारिक भक्ति"
      },
      desc: {
        en: "Mastering practical devotion in day-to-day work, balancing modern career and spiritual consciousness.",
        hi: "दैनिक कार्यस्थल में भक्तिमय संतुलन साधने और कर्म को योग बनाने का प्रामाणिक मार्ग।"
      },
      level: "Intermediate",
      lessons: "12 Lessons",
      duration: "8 Hours",
      price: "Free",
      isPaid: false
    },
    {
      id: "comprehensive-gita",
      title: {
        en: "Comprehensive Bhagavad-gītā Study with Sanskrit Recitation",
        hi: "श्रीमद्भगवद्गीता सम्पूर्ण संस्कृत श्लोक एवं भाष्य अध्ययन"
      },
      desc: {
        en: "In-depth verse-by-verse commentary analysis, philosophical questions, and chapter assessments.",
        hi: "श्लोक दर श्लोक प्रामाणिक भाष्य विश्लेषण, दार्शनिक प्रश्नों के उत्तर एवं अध्यायवार मूल्यांकन।"
      },
      level: "Advanced",
      lessons: "18 Chapters",
      duration: "24 Hours",
      price: "₹999",
      isPaid: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "व्यवस्थित ऑनलाइन शिक्षा" : "Self-Paced E-Learning LMS"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t.nav.courses}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi"
            ? "वीडियो पाठ, मूल्यांकन और प्रमाण-पत्रों के साथ अपनी गति से सीखें।"
            : "Explore structured courses with video lessons, lesson quizzes, and completion certificates."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  {c.price}
                </span>
                <span className="text-xs text-gray-500 font-medium">{c.level}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                {c.title[language]}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {c.desc[language]}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4 text-amber-600" />
                  {c.lessons}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {c.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  Certificate
                </span>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => alert(language === "hi" ? "Phase 5 में सम्पूर्ण LMS प्लेयर एवं मूल्यांकन सक्रिय किया जाएगा।" : "Full LMS Classroom and assessment engine unlocks in Phase 5!")}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
              >
                {language === "hi" ? "पाठ्यक्रम में प्रवेश लें" : "Enroll & Start Course"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
