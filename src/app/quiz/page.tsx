"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HelpCircle, Award, Sparkles, Volume2, ShieldCheck, ArrowRight, Upload, BookOpen } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { resolveImageUrlByTag } from "@/lib/imageLibrary";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, limit } from "firebase/firestore";

export default function QuizOverviewPage() {
  const { t, language } = useLanguage();
  const [customQuizzes, setCustomQuizzes] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const deletedQuizIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_quizzes") || "[]");
        const raw = localStorage.getItem("sr_custom_quizzes");
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.filter((q: any) => !deletedQuizIds.includes(q.id));
          }
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      const deletedQuizIds: string[] = JSON.parse(localStorage.getItem("sr_deleted_quizzes") || "[]");
      let list: any[] = [];
      try {
        const snap = await getDocs(query(collection(db, "quizzes"), limit(50)));
        snap.forEach((d) => {
          const data = d.data();
          const docId = d.id;
          if (!deletedQuizIds.includes(docId) && !deletedQuizIds.includes(data.id)) {
            list.push({ ...data, id: docId });
          }
        });
      } catch (e) {
        console.warn("Firestore quiz fetch failed, checking local cache", e);
      }

      const rawSaved = localStorage.getItem("sr_custom_quizzes");
      if (rawSaved !== null) {
        try {
          const parsed = JSON.parse(rawSaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((localQ: any) => {
              if (
                !deletedQuizIds.includes(localQ.id) &&
                !list.some((q) => q.id === localQ.id)
              ) {
                list.push(localQ);
              }
            });
          }
        } catch (e) {}
      } else if (list.length === 0 && deletedQuizIds.length === 0 && rawSaved === null) {
        list = defaultQuizzes;
      }

      const finalList = list.filter((q) => !deletedQuizIds.includes(q.id));
      setCustomQuizzes(finalList);
    };
    fetchQuizzes();
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

      {/* Quizzes Grid (Matching Exact Uploaded Reference Design) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>{language === "hi" ? "उपलब्ध वैदिक प्रश्नोत्तरी" : "Featured Spiritual Quizzes"}</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">
            {customQuizzes.length} {language === "hi" ? "क्विज़ उपलब्ध" : "Quizzes Available"}
          </span>
        </div>

        {customQuizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-gray-500">
              {language === "hi" ? "वर्तमान में कोई प्रश्नोत्तरी उपलब्ध नहीं है।" : "No quizzes available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {customQuizzes.map((q: any) => {
              const titleStr = typeof q.title === "object" ? (q.title[language] || q.title.en || q.title.hi) : q.title;
              const descStr = q.description ? (typeof q.description === "object" ? (q.description[language] || q.description.en) : q.description) : "Test your spiritual intellect, earn marks, and receive an official verifiable devotional certificate.";
              const questionsCount = q.questionCount || q.questions?.length || q.questions || 10;
              const imgUrl = resolveImageUrlByTag(q.image || q.imageUrl || "krishna");

              return (
                <div
                  key={q.id}
                  className="bg-gradient-to-b from-white via-white to-amber-50/20 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* 1. Header Image Banner (Aspect 16:9 like reference) */}
                    <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-amber-950 via-stone-900 to-indigo-950 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={titleStr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wider shadow-sm">
                        Vedic Quiz Arena
                      </div>
                    </div>

                    {/* 2. Card Content Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      
                      {/* Quiz Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                        {titleStr}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {descStr}
                      </p>

                      {/* Category & Badge */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          By SelfRealization Outreach
                        </p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-600 text-white shrink-0">
                          FREE
                        </span>
                      </div>

                      {/* Questions & Duration Row */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">{questionsCount} Questions</span>
                        <span className="text-sky-600 font-bold">10s per Question</span>
                      </div>

                      {/* Certificate Course Badge */}
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Official Certificate Included</span>
                      </div>

                      {/* Details Box */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-700 flex items-center justify-between">
                        <span className="font-bold text-emerald-800">
                          Total Marks: {q.totalMarks || (questionsCount * 10)}
                        </span>
                        <span className="text-slate-500">
                          Format: <strong>Instant Sound & Emoticons</strong>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* 3. Action Button (Start Quiz Play) with Color Hover Transition */}
                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      href={`/quiz/play?id=${q.id}`}
                      className="w-full py-2.5 px-4 rounded-xl text-sm font-black text-sky-900 bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-400 hover:from-emerald-600 hover:to-teal-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-center"
                    >
                      <span>Start Quiz Play</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
