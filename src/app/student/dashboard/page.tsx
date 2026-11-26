"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  BookOpen, 
  PlayCircle, 
  Award, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  User, 
  Sparkles, 
  ArrowRight,
  RotateCcw
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { LMS_COURSES } from "@/lib/coursesData";

export default function StudentDashboardPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [studentSession, setStudentSession] = useState<{ name: string; email: string } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    const sessionStr = localStorage.getItem("sr_student_session");
    if (!sessionStr) {
      router.push("/student/login");
      return;
    }
    try {
      const parsed = JSON.parse(sessionStr);
      setStudentSession(parsed);
    } catch (e) {
      router.push("/student/login");
    }

    // Load custom courses or defaults
    const deletedList: string[] = JSON.parse(localStorage.getItem("sr_deleted_courses") || "[]");
    let availableCourses = LMS_COURSES.filter(c => !deletedList.includes(c.id));

    const customC = localStorage.getItem("sr_custom_courses") || localStorage.getItem("sr_lms_courses");
    if (customC) {
      try {
        const parsedCustom: any[] = JSON.parse(customC);
        const filtered = parsedCustom.filter(c => !deletedList.includes(c.id));
        if (filtered.length > 0) {
          availableCourses = filtered;
        }
      } catch (e) {}
    }

    // Attach student progress per course
    const enriched = availableCourses.map((c: any) => {
      const savedProgress = localStorage.getItem(`sr_progress_${c.id}`);
      const completed: string[] = savedProgress ? JSON.parse(savedProgress) : [];
      const totalLessons = c.lessons ? c.lessons.length : (c.modules ? c.modules.length : 6);
      const percent = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0;

      return {
        ...c,
        completedCount: completed.length,
        totalLessons,
        progressPercent: percent
      };
    });

    setEnrolledCourses(enriched);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("sr_student_session");
    router.push("/student/login");
  };

  if (!studentSession) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Top Banner / Welcome Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-800 text-2xl font-black shadow-inner">
            <User className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {language === "hi" ? "विद्यार्थी डैशबोर्ड" : "Active Student"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === "hi" ? `हरे कृष्ण, ${studentSession.name}!` : `Hare Krishna, ${studentSession.name}!`}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {studentSession.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/courses"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{language === "hi" ? "सभी पाठ्यक्रम" : "Course Catalog"}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === "hi" ? "लॉगआउट" : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Enrolled Courses Progress Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{language === "hi" ? "मेरे अध्ययनरत पाठ्यक्रम" : "My Enrolled Courses & Progress"}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {enrolledCourses.length} {language === "hi" ? "पाठ्यक्रम" : "Courses Available"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {c.price || "Free Access"}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {c.duration || "Self-Paced"}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 line-clamp-2">
                  {typeof c.title === "object" ? (c.title[language] || c.title.en || c.title.hi) : c.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {typeof c.desc === "object" ? (c.desc[language] || c.desc.en || c.desc.hi) : c.desc}
                </p>

                {/* Progress Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{language === "hi" ? "प्रगति:" : "Progress:"}</span>
                    <span className="text-emerald-700 font-black">{c.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {c.completedCount} of {c.totalLessons} {language === "hi" ? "सत्र पूर्ण" : "Lessons Completed"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/courses/${c.id}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-emerald-200" />
                  <span>{c.progressPercent > 0 ? (language === "hi" ? "अध्ययन जारी रखें ▶" : "Resume Learning ▶") : (language === "hi" ? "प्रारंभ करें ▶" : "Start Course ▶")}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
