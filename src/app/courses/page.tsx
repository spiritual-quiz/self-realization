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
import { collection, getDocs, query, limit, onSnapshot } from "firebase/firestore";
import { subscribeToCatalogSync, getDeletedCourseIds } from "@/lib/catalogSync";

// Zero hardcoded courses: 100% database-driven from Firestore
const DEFAULT_COURSES: any[] = [];

export default function CoursesCataloguePage() {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const deletedList = getDeletedCourseIds();
        const localC = localStorage.getItem("sr_custom_courses") || localStorage.getItem("sr_lms_courses");
        if (localC !== null) {
          const parsed = JSON.parse(localC);
          if (Array.isArray(parsed)) {
            return parsed.filter((c: any) => !deletedList.includes(c.id));
          }
        }
      } catch (e) {}
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "free" | "paid">("all");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<ClassItem | null>(null);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    try {
      const q = query(collection(db, "courses"), limit(50));
      unsubSnapshot = onSnapshot(q, (snap) => {
        const deletedList = getDeletedCourseIds();
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
        } else {
          setCourses([]);
          localStorage.setItem("sr_custom_courses", JSON.stringify([]));
          localStorage.setItem("sr_lms_courses", JSON.stringify([]));
        }
      }, (err) => {
        console.warn("Firestore courses onSnapshot notice:", err);
      });
    } catch (e) {
      console.warn("courses onSnapshot error:", e);
    }

    // Instant cross-tab and intra-window synchronization
    const unsubSync = subscribeToCatalogSync(() => {
      try {
        const deletedList = getDeletedCourseIds();
        const localC = localStorage.getItem("sr_custom_courses") || localStorage.getItem("sr_lms_courses");
        if (localC !== null) {
          const parsed = JSON.parse(localC);
          if (Array.isArray(parsed)) {
            setCourses(parsed.filter((c: any) => !deletedList.includes(c.id)));
          }
        }
      } catch (e) {}
    });

    return () => {
      if (unsubSnapshot) unsubSnapshot();
      unsubSync();
    };
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
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-amber-200/70 text-center max-w-xl mx-auto shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-amber-600 mx-auto opacity-70" />
          <h3 className="text-xl font-bold text-gray-900">
            {language === "hi" ? "कोई पाठ्यक्रम उपलब्ध नहीं है" : "No Courses Available"}
          </h3>
          <p className="text-sm text-gray-600">
            {language === "hi"
              ? "वर्तमान में कोई ई-लर्निंग पाठ्यक्रम सक्रिय नहीं है। नए पाठ्यक्रम शीघ्र जोड़े जाएंगे।"
              : "No e-learning courses are currently active. Please check back soon or explore our live ongoing classes."}
          </p>
          <div className="pt-2">
            <Link
              href="/live-classes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === "hi" ? "लाइव कक्षाएं देखें" : "Explore Live Classes"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {filteredCourses.map((c) => {
          const isExpanded = expandedCourse === c.id;

          return (
            <div
              key={c.id}
              className="bg-gradient-to-b from-white via-white to-amber-50/20 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* 1. Header Image Banner (Aspect 16:9 like reference) */}
                <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.thumbnail || c.image || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"}
                    alt={getLocalized(c.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wider shadow-sm">
                    E-Learning LMS
                  </div>
                  <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[11px] font-bold text-white/90">
                    {c.duration || "4 Hours"}
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

              {/* 3. Action Buttons Row: Enroll Now (Opens registration modal with WhatsApp join link) & Syllabus Toggle */}
              <div className="p-5 sm:p-6 pt-0 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEnrollingCourse({
                      id: c.id,
                      title: typeof c.title === "object" ? c.title : { en: c.title, hi: c.title },
                      description: typeof c.desc === "object" ? c.desc : { en: c.desc || "", hi: c.desc || "" },
                      image: c.thumbnail || c.image,
                      isPaid: !!c.isPaid,
                      price: c.price,
                      date: c.timing || "Immediate Access",
                      time: c.timing || "Self-Paced / Weekly",
                      mode: c.mode || "Online & Offline (Hybrid)",
                      venue: c.venue || "ISKCON Mandir",
                      roomNumber: c.roomNumber || "Room 108",
                      whatsappGroupUrl: c.whatsappGroupUrl || "https://chat.whatsapp.com/SelfRealizationGita",
                      instructor: c.instructor || "ISKCON NVCC Scholars",
                      hours: c.duration || "4 Hours"
                    });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-black text-sky-900 bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-400 hover:from-emerald-600 hover:to-teal-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                  className="w-full py-1.5 text-center text-xs font-bold text-slate-500 hover:text-amber-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>{isExpanded ? (language === "hi" ? "पाठ्यक्रम विवरण छुपाएं ▲" : "Hide Curriculum ▲") : (language === "hi" ? "पाठ्यक्रम देखें (View Curriculum) ▼" : "View Curriculum ▼")}</span>
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
      )}

      {/* Course Enrollment Modal */}
      <ClassRegistrationModal
        classItem={enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
      />
    </div>
  );
}
