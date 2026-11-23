"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Award, 
  CheckCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  FileText,
  Lock,
  ArrowRight
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function CoursesCataloguePage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "free" | "paid">("all");
  const [expandedCourse, setExpandedCourse] = useState<string | null>("discover-yourself");

  const courses = [
    {
      id: "discover-yourself",
      title: {
        en: "Discover Yourself: Fundamentals of Bhagavad-gītā",
        hi: "स्वयं को जानें: भगवद्गीता के मूलभूत सिद्धांत"
      },
      desc: {
        en: "A structured 6-session foundation journey exploring soul, mind, reincarnation, karma, and supreme identity.",
        hi: "आत्मा, मन, पुनर्जन्म, कर्म और परम सत्य के रहस्यों को उद्घाटित करने वाली 6 सत्रों की व्यवस्थित यात्रा।"
      },
      level: language === "hi" ? "प्रारंभिक (Beginner)" : "Beginner",
      lessons: "6 Lessons",
      duration: "3.5 Hours",
      price: language === "hi" ? "निःशुल्क (Free)" : "Free Access",
      isPaid: false,
      modules: [
        { title: { en: "Session 1: Can a Scientist Believe in God?", hi: "सत्र 1: क्या वैज्ञानिक ईश्वर में विश्वास कर सकता है?" }, length: "35 mins" },
        { title: { en: "Session 2: Getting the Eyes of Knowledge (Veda)", hi: "सत्र 2: ज्ञान चक्षु की प्राप्ति (वेद क्या हैं?)" }, length: "30 mins" },
        { title: { en: "Session 3: Science of Soul & Reincarnation", hi: "सत्र 3: आत्मा का विज्ञान एवं पुनर्जन्म का रहस्य" }, length: "40 mins" },
        { title: { en: "Session 4: One God or Many Gods?", hi: "सत्र 4: एक ईश्वर अथवा अनेक देव?" }, length: "35 mins" },
        { title: { en: "Session 5: Why Do Bad Things Happen to Good People? (Karma)", hi: "सत्र 5: अच्छे लोगों के साथ बुरा क्यों होता है? (कर्म का नियम)" }, length: "45 mins" },
        { title: { en: "Session 6: Topmost Yoga System for Kali Yuga", hi: "सत्र 6: कलियुग हेतु सर्वश्रेष्ठ योग प्रणाली" }, length: "40 mins" },
      ]
    },
    {
      id: "science-of-self-realization",
      title: {
        en: "Science of Self-Realization & Practical Devotion",
        hi: "आत्म-साक्षात्कार का विज्ञान एवं व्यावहारिक भक्ति"
      },
      desc: {
        en: "Mastering practical devotion in day-to-day work, balancing modern career stress, and developing inner consciousness.",
        hi: "दैनिक कार्यस्थल में भक्तिमय संतुलन साधने, कार्य-तनाव से मुक्ति पाने और कर्म को योग बनाने का प्रामाणिक मार्ग।"
      },
      level: language === "hi" ? "मध्यम (Intermediate)" : "Intermediate",
      lessons: "12 Lessons",
      duration: "8 Hours",
      price: language === "hi" ? "निःशुल्क (Free)" : "Free Access",
      isPaid: false,
      modules: [
        { title: { en: "Module 1: Defining the Living Entity & Mind", hi: "मॉड्यूल 1: जीवात्मा एवं मन की संरचना" }, length: "45 mins" },
        { title: { en: "Module 2: The Three Modes of Material Nature (Gunas)", hi: "मॉड्यूल 2: प्रकृति के तीन गुण (सत्व, रज, तम)" }, length: "50 mins" },
        { title: { en: "Module 3: Overcoming Lust, Anger & Greed", hi: "मॉड्यूल 3: काम, क्रोध और लोभ पर विजय" }, length: "45 mins" },
        { title: { en: "Module 4: Practical Art of Japa Meditation", hi: "मॉड्यूल 4: जप ध्यान की व्यावहारिक कला" }, length: "40 mins" },
      ]
    },
    {
      id: "comprehensive-gita",
      title: {
        en: "Comprehensive Bhagavad-gītā Study with Sanskrit Recitation",
        hi: "श्रीमद्भगवद्गीता सम्पूर्ण संस्कृत श्लोक एवं भाष्य अध्ययन"
      },
      desc: {
        en: "In-depth verse-by-verse commentary analysis, philosophical assessments, Sanskrit pronunciation, and certificate.",
        hi: "श्लोक दर श्लोक प्रामाणिक भाष्य विश्लेषण, दार्शनिक प्रश्नों के उत्तर, संस्कृत उच्चारण एवं प्रमाणित प्रमाण-पत्र।"
      },
      level: language === "hi" ? "उन्नत (Advanced)" : "Advanced",
      lessons: "18 Chapters",
      duration: "24 Hours",
      price: "₹999",
      isPaid: true,
      modules: [
        { title: { en: "Part 1: Karma Yoga (Chapters 1 to 6)", hi: "भाग 1: कर्म योग (अध्याय 1 से 6)" }, length: "8 Hours" },
        { title: { en: "Part 2: Bhakti Yoga (Chapters 7 to 12)", hi: "भाग 2: भक्ति योग (अध्याय 7 से 12)" }, length: "8 Hours" },
        { title: { en: "Part 3: Jnana Yoga (Chapters 13 to 18)", hi: "भाग 3: ज्ञान योग (अध्याय 13 से 18)" }, length: "8 Hours" },
      ]
    }
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = 
      categoryFilter === "all" ? true :
      categoryFilter === "free" ? !c.isPaid :
      c.isPaid;

    const matchesSearch = 
      c.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc[language].toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Title & Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "व्यवस्थित ऑनलाइन शिक्षा" : "Self-Paced E-Learning LMS"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.nav.courses}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {language === "hi"
            ? "प्रमाणित वीडियो व्याख्यान, अध्यायवार मूल्यांकन और तुरंत डाउनलोड होने वाले प्रमाण-पत्रों के साथ अपनी गति से सीखें।"
            : "Study systematic Vedic knowledge at your own pace with structured video modules, lesson assessments, and verifiable certificates."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "hi" ? "पाठ्यक्रम खोजें..." : "Search courses..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm bg-white"
          />
        </div>

        <div className="inline-flex p-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              categoryFilter === "all" ? "bg-amber-600 text-white shadow-sm" : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "सभी" : "All"} ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("free")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              categoryFilter === "free" ? "bg-amber-600 text-white shadow-sm" : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "निःशुल्क पाठ्यक्रम" : "Free Courses"}
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("paid")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              categoryFilter === "paid" ? "bg-amber-600 text-white shadow-sm" : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "सर्टिफाइड सेमिनार" : "Certified"}
          </button>
        </div>
      </div>

      {/* Courses Detailed List with Syllabus Accordions */}
      <div className="space-y-6 max-w-5xl mx-auto">
        {filteredCourses.map((c) => {
          const isExpanded = expandedCourse === c.id;

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {c.price}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {c.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <PlayCircle className="w-4 h-4 text-amber-600" />
                      {c.lessons}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-amber-600" />
                      {c.duration}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <Award className="w-4 h-4" />
                      Certificate
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                  {c.title[language]}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {c.desc[language]}
                </p>

                {/* Actions Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
                  >
                    <span>{isExpanded ? (language === "hi" ? "पाठ्यक्रम छिपाएं" : "Hide Syllabus") : (language === "hi" ? "पाठ्यक्रम विवरण देखें" : "View Syllabus & Lessons")}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(language === "hi" ? "Phase 5 में सम्पूर्ण LMS एनरोलमेंट, YouTube प्लेयर और प्रोग्रेस ट्रैकर सक्रिय किया जाएगा।" : "Full LMS Classroom, protected video player & progress saving unlocks in Phase 5!")}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{language === "hi" ? "पाठ्यक्रम में प्रवेश लें" : "Enroll & Start Course"}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Syllabus Breakdown */}
              {isExpanded && (
                <div className="bg-amber-50/50 p-6 sm:p-8 border-t border-amber-200/60 space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>{language === "hi" ? "पाठ्यक्रम की रूपरेखा (Syllabus)" : "Course Curriculum & Lessons"}</span>
                  </h4>
                  <div className="space-y-2">
                    {c.modules.map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-800">{m.title[language]}</span>
                        </div>
                        <span className="text-gray-400 font-mono text-xs shrink-0">{m.length}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
