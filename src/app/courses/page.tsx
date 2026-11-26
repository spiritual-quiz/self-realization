"use client";

import React, { useState, useEffect } from "react";
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
  ArrowRight,
  Globe,
  MapPin,
  MessageCircle
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import ClassRegistrationModal, { ClassItem } from "@/components/common/ClassRegistrationModal";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, limit } from "firebase/firestore";

const DEFAULT_COURSES = [
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
    thumbnail: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    level: "Beginner",
    lessons: "6 Lessons",
    duration: "3.5 Hours",
    price: "Free Access",
    isPaid: false,
    instructor: "H.G. Gauranga Das & Scholars",
    mode: "Online & Offline (Hybrid)",
    timing: "Every Sunday: 10:00 AM – 11:30 AM IST",
    venue: "Sri Sri Radha Vrindavanchandra Mandir",
    roomNumber: "Room 108 (Ground Floor)",
    whatsappGroupUrl: "https://chat.whatsapp.com/SelfRealizationGita",
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
    thumbnail: "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg",
    level: "Intermediate",
    lessons: "12 Lessons",
    duration: "8 Hours",
    price: "Free Access",
    isPaid: false,
    instructor: "H.G. Radheshyam Das & Mentors",
    mode: "Online (Live Zoom) & Offline (Temple Classroom)",
    timing: "Wednesday & Friday: 07:00 PM – 08:30 PM IST",
    venue: "ISKCON NVCC Vedic Cultural Centre",
    roomNumber: "Hall 204 (First Floor)",
    whatsappGroupUrl: "https://chat.whatsapp.com/ScienceOfSelfRealization",
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
    thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
    level: "Advanced",
    lessons: "18 Chapters",
    duration: "24 Hours",
    price: "₹999",
    isPaid: true,
    instructor: "Bhakti Shastri Scholars",
    mode: "Online & Offline (Hybrid Classroom)",
    timing: "Saturday & Sunday: 04:00 PM – 06:00 PM IST",
    venue: "Satsang Bhavan, ISKCON NVCC",
    roomNumber: "Room 302 (Auditorium)",
    whatsappGroupUrl: "https://chat.whatsapp.com/BhagavadGitaDeepStudy",
    modules: [
      { title: { en: "Part 1: Karma Yoga (Chapters 1 to 6)", hi: "भाग 1: कर्म योग (अध्याय 1 से 6)" }, length: "8 Hours" },
      { title: { en: "Part 2: Bhakti Yoga (Chapters 7 to 12)", hi: "भाग 2: भक्ति योग (अध्याय 7 से 12)" }, length: "8 Hours" },
      { title: { en: "Part 3: Jnana Yoga (Chapters 13 to 18)", hi: "भाग 3: ज्ञान योग (अध्याय 13 से 18)" }, length: "8 Hours" },
    ]
  }
];

export default function CoursesCataloguePage() {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<any[]>(DEFAULT_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "free" | "paid">("all");
  const [expandedCourse, setExpandedCourse] = useState<string | null>("discover-yourself");
  const [enrollingCourse, setEnrollingCourse] = useState<ClassItem | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const deletedList: string[] = JSON.parse(localStorage.getItem("sr_deleted_courses") || "[]");

      // 1. Try Firestore First
      try {
        const snap = await getDocs(query(collection(db, "courses"), limit(50)));
        const list: any[] = [];
        snap.forEach((d) => {
          if (!deletedList.includes(d.id)) {
            list.push({ id: d.id, ...d.data() });
          }
        });
        if (list.length > 0) {
          setCourses(list);
          localStorage.setItem("sr_custom_courses", JSON.stringify(list));
          localStorage.setItem("sr_lms_courses", JSON.stringify(list));
          return;
        }
      } catch (err) {
        console.warn("Firestore courses fetch error, checking localStorage", err);
      }

      // 2. Try Admin local cache
      const localC = localStorage.getItem("sr_custom_courses") || localStorage.getItem("sr_lms_courses");
      if (localC) {
        try {
          const parsed = JSON.parse(localC);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized = parsed.filter((c: any) => !deletedList.includes(c.id));
            setCourses(sanitized);
            return;
          }
        } catch (e) {}
      }

      // 3. Fallback to default minus any deleted IDs
      const remainingDefaults = DEFAULT_COURSES.filter((c) => !deletedList.includes(c.id));
      setCourses(remainingDefaults);
    };
    fetchCourses();
  }, []);

  const getLocalized = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[language] || val.en || val.hi || "";
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = 
      categoryFilter === "all" ? true :
      categoryFilter === "free" ? !c.isPaid :
      c.isPaid;

    const titleStr = getLocalized(c.title).toLowerCase();
    const descStr = getLocalized(c.desc).toLowerCase();
    const matchesSearch = titleStr.includes(searchQuery.toLowerCase()) || descStr.includes(searchQuery.toLowerCase());

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

        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-emerald-500/30 w-full sm:w-auto justify-center shadow-xs">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              categoryFilter === "all" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "सभी" : "All"} ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("free")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              categoryFilter === "free" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "निःशुल्क पाठ्यक्रम" : "Free Courses"}
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("paid")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              categoryFilter === "paid" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "सर्टिफाइड सेमिनार" : "Certified"}
          </button>
        </div>
      </div>

      {/* Courses Cards Grid (Matching Exact Uploaded Reference Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {filteredCourses.map((c) => {
          const isExpanded = expandedCourse === c.id;

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-400"
            >
              <div>
                {/* 1. Header Image Banner (Aspect 16:9 like reference) */}
                <div className="relative w-full h-44 sm:h-48 bg-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.thumbnail || c.image || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"}
                    alt={getLocalized(c.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20 uppercase tracking-wider">
                    E-Learning LMS
                  </div>
                </div>

                {/* 2. Card Content Body */}
                <div className="p-5 sm:p-6 space-y-3">
                  
                  {/* Course Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {getLocalized(c.title)}
                  </h3>

                  {/* Short Description (small explanation) */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {getLocalized(c.desc)}
                  </p>

                  {/* Speaker & Paid/Free Badge */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      By {c.instructor || "ISKCON NVCC Scholars"}
                    </p>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        c.isPaid
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {c.isPaid ? "PAID" : "FREE"}
                    </span>
                  </div>

                  {/* Mode: Online, Offline, or Both */}
                  <div className="flex items-center gap-1.5 text-xs text-sky-800 font-bold bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    <Globe className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate"><strong>Mode:</strong> {c.mode || "Online & Offline (Hybrid)"}</span>
                  </div>

                  {/* Timing & Venue / Room Number Details */}
                  <div className="space-y-1 text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/70">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate"><strong>Timing:</strong> {c.timing || "Every Sunday: 10:00 AM – 11:30 AM IST"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate"><strong>Venue:</strong> {c.venue || "ISKCON Mandir"}, <strong className="text-amber-900">{c.roomNumber || "Room 108"}</strong></span>
                    </div>
                  </div>

                  {/* Hours & Self-Paced Access Row */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-semibold">{c.duration || "4 Hours"}</span>
                    <span className="text-sky-600 font-bold">Start: Immediate / Dec 17</span>
                  </div>

                  {/* Certificate Badge */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Certificate Course</span>
                  </div>

                  {/* Module Count */}
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold text-emerald-800">
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.lessons || (c.modules ? `${c.modules.length} Lessons` : "6 Lessons")}</span>
                    </span>
                    <span className="text-slate-500">
                      Level: <strong>{c.level || "Beginner"}</strong>
                    </span>
                  </div>

                </div>
              </div>

              {/* 3. Action Buttons Row: Enroll Now, WhatsApp & Syllabus */}
              <div className="p-5 sm:p-6 pt-0 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link
                    href={`/courses/${c.id}`}
                    className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black text-sky-600 hover:text-white bg-white hover:bg-sky-600 border-2 border-sky-500 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>Enroll Now</span>
                  </Link>

                  <a
                    href={c.whatsappGroupUrl || "https://chat.whatsapp.com/SelfRealizationGita"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 border-2 border-emerald-500 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    title="Directly join our WhatsApp group"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:text-white shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                  className="w-full py-1 text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? "Hide Syllabus ▲" : "View Curriculum ▼"}</span>
                </button>
              </div>

              {/* Collapsible Syllabus Breakdown */}
              {isExpanded && (
                <div className="bg-amber-50/50 p-4 border-t border-amber-200/60 space-y-2 animate-fade-in">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>{language === "hi" ? "पाठ्यक्रम की रूपरेखा" : "Curriculum Modules"}</span>
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(c.modules || []).map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-800 truncate">{getLocalized(m.title)}</span>
                        </div>
                        <span className="text-gray-400 font-mono text-[11px] shrink-0">{m.length}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Course Enrollment Modal */}
      <ClassRegistrationModal
        classItem={enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
      />
    </div>
  );
}
