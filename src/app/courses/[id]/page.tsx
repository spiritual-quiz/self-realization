"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { LMS_COURSES, getCourseById, CourseLesson, LMSCourse } from "@/lib/coursesData";
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Download,
  Share2,
  Check,
  RotateCcw,
  Menu,
  X
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseLearningRoomPage({ params }: PageProps) {
  const { id } = use(params);
  const { language } = useLanguage();
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  // Active Lesson State
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"notes" | "assessment" | "certificate">("notes");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [studentNotes, setStudentNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [studentName, setStudentName] = useState("Vedic Seeker");

  // Assessment Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const activeLesson: CourseLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  // Load Saved Progress from LocalStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`sr_progress_${course.id}`);
    if (savedProgress) {
      try {
        setCompletedLessons(JSON.parse(savedProgress));
      } catch (e) {}
    }

    const savedNotes = localStorage.getItem(`sr_notes_${course.id}`);
    if (savedNotes) {
      setStudentNotes(savedNotes);
    }

    const session = localStorage.getItem("sr_admin_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.name) setStudentName(parsed.name);
      } catch (e) {}
    }
  }, [course.id]);

  // Mark Lesson as Completed
  const handleToggleComplete = (lessonId: string) => {
    let updated: string[];
    if (completedLessons.includes(lessonId)) {
      updated = completedLessons.filter((id) => id !== lessonId);
    } else {
      updated = [...completedLessons, lessonId];
      // Celebrate lesson completion with confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D97706", "#F59E0B", "#10B981"]
      });
    }
    setCompletedLessons(updated);
    localStorage.setItem(`sr_progress_${course.id}`, JSON.stringify(updated));
  };

  // Save Student Notes
  const handleSaveNotes = () => {
    localStorage.setItem(`sr_notes_${course.id}`, studentNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  // Assessment Submission
  const handleSubmitAssessment = () => {
    let score = 0;
    course.assessment.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= Math.ceil(course.assessment.length * 0.75)) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#8B5CF6"]
      });
    }
  };

  const progressPercentage = Math.round(
    (completedLessons.length / course.lessons.length) * 100
  );

  const isEligibleForCertificate =
    completedLessons.length === course.lessons.length ||
    (quizSubmitted && (quizScore || 0) >= Math.ceil(course.assessment.length * 0.75));

  return (
    <div className="min-h-screen bg-[#F6EFE3] text-gray-900 pb-16">
      
      {/* Top Breadcrumb & Course Header Bar */}
      <div className="bg-[#FFFDF8] border-b border-amber-200/90 shadow-2xs sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-700 bg-amber-100/60 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-all border border-amber-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === "hi" ? "पाठ्यक्रम सूची" : "All Courses"}</span>
            </Link>
            
            <span className="hidden sm:inline-block text-amber-300">•</span>
            
            <h1 className="text-xs sm:text-sm font-black text-gray-900 truncate max-w-xs sm:max-w-md">
              {course.title[language] || course.title.en}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-900">
              <span>{progressPercentage}% {language === "hi" ? "पूर्ण" : "Completed"}</span>
              <div className="w-16 h-2 bg-amber-200/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 text-xs font-bold"
            >
              <Menu className="w-4 h-4" />
              <span>{language === "hi" ? "पाठ सूची" : "Curriculum"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: VIDEO PLAYER & LESSON CONTENT (8 Cols)
              ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Embedded Responsive Video Player with 16:9 Aspect Ratio */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-amber-400/80 relative">
              <div className="aspect-video w-full relative">
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title[language] || activeLesson.title.en}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>
            </div>

            {/* Lesson Title & Completion Controls */}
            <div className="bg-[#FFFDF8] rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {language === "hi" ? `सत्र ${activeLessonIndex + 1}` : `Session ${activeLessonIndex + 1}`}
                    </span>
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {activeLesson.duration}
                    </span>
                    {activeLesson.verseRef && (
                      <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        📖 {activeLesson.verseRef}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                    {activeLesson.title[language] || activeLesson.title.en}
                  </h2>
                </div>

                {/* Mark Completed Button */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(activeLesson.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-sm shrink-0 ${
                    completedLessons.includes(activeLesson.id)
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                      : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLessons.includes(activeLesson.id)
                      ? (language === "hi" ? "सत्र पूर्ण हुआ ✓" : "Completed ✓")
                      : (language === "hi" ? "सत्र पूर्ण चिह्नित करें" : "Mark as Completed")}
                  </span>
                </button>
              </div>

              {/* Prev / Next Navigation Controls */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === "hi" ? "पिछला सत्र" : "Previous Session"}</span>
                </button>

                <span className="text-xs text-gray-500">
                  {activeLessonIndex + 1} / {course.lessons.length}
                </span>

                <button
                  type="button"
                  disabled={activeLessonIndex === course.lessons.length - 1}
                  onClick={() => setActiveLessonIndex((prev) => Math.min(course.lessons.length - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span>{language === "hi" ? "अगला सत्र" : "Next Session"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Learning Tabs: Notes, Assessment, Certificate */}
            <div className="bg-[#FFFDF8] rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
              <div className="flex items-center border-b border-amber-200/80 bg-amber-50/50 p-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "notes"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-amber-900 hover:bg-amber-100/60"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{language === "hi" ? "सत्र नोट्स एवं सूत्र" : "Lesson Notes & Summary"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("assessment")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "assessment"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-amber-900 hover:bg-amber-100/60"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{language === "hi" ? "अध्याय क्विज़" : "Assessment Quiz"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("certificate")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "certificate"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-amber-900 hover:bg-amber-100/60"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{language === "hi" ? "प्रमाण-पत्र" : "Certificate"}</span>
                </button>
              </div>

              <div className="p-6 sm:p-8">
                
                {/* TAB 1: LESSON NOTES & SUMMARY */}
                {activeTab === "notes" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>{language === "hi" ? "सत्र का सार (Summary)" : "Session Executive Summary"}</span>
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
                        {activeLesson.summary[language] || activeLesson.summary.en}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>{language === "hi" ? "मुख्य आध्यात्मिक सूत्र (Key Takeaways)" : "Key Vedic Takeaways"}</span>
                      </h3>
                      <ul className="space-y-2.5">
                        {(activeLesson.keyTakeaways[language] || activeLesson.keyTakeaways.en || []).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Student Reflection Notebook */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-amber-950 uppercase tracking-wider">
                          {language === "hi" ? "व्यक्तिगत साधना नोट्स / My Reflection Notebook" : "My Personal Study Notes"}
                        </label>
                        {notesSaved && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {language === "hi" ? "सुरक्षित!" : "Saved locally!"}
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={4}
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder={
                          language === "hi"
                            ? "इस व्याख्यान से आपको क्या सीखने को मिला? अपने विचार यहाँ लिखें..."
                            : "Write your reflections, realizations, and questions here..."
                        }
                        className="w-full p-3.5 rounded-2xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm bg-white"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveNotes}
                          className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          {language === "hi" ? "नोट्स सहेजें (Save Notes)" : "Save Notes"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: COMPREHENSION ASSESSMENT QUIZ */}
                {activeTab === "assessment" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {language === "hi" ? "पाठ्यक्रम समझ मूल्यांकन" : "Course Comprehension Assessment"}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {language === "hi"
                          ? "प्रमाण-पत्र प्राप्त करने हेतु कृपया प्रश्नों के सही उत्तर दें (75% उत्तीर्ण अंक)।"
                          : "Answer these core concept questions to unlock your official course completion certificate (75% to pass)."}
                      </p>
                    </div>

                    <div className="space-y-5">
                      {course.assessment.map((q, qIdx) => {
                        const selected = quizAnswers[qIdx];
                        const isCorrect = selected === q.correctIndex;

                        return (
                          <div
                            key={qIdx}
                            className={`p-5 rounded-2xl border transition-all ${
                              quizSubmitted
                                ? isCorrect
                                  ? "bg-emerald-50/60 border-emerald-300"
                                  : "bg-rose-50/60 border-rose-300"
                                : "bg-white border-amber-200/80 shadow-2xs"
                            }`}
                          >
                            <p className="font-bold text-sm text-gray-900 mb-3">
                              {qIdx + 1}. {q.question[language] || q.question.en}
                            </p>

                            <div className="space-y-2">
                              {(q.options[language] || q.options.en).map((opt, optIdx) => {
                                const isOptionSelected = selected === optIdx;

                                return (
                                  <label
                                    key={optIdx}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                                      quizSubmitted
                                        ? optIdx === q.correctIndex
                                          ? "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold"
                                          : isOptionSelected
                                          ? "bg-rose-100 text-rose-950 border-rose-300"
                                          : "bg-white/60 border-gray-200 text-gray-600"
                                        : isOptionSelected
                                        ? "bg-amber-100 text-amber-950 border-amber-500 font-bold"
                                        : "bg-white hover:bg-amber-50/60 border-gray-200 text-gray-800"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qIdx}`}
                                      checked={isOptionSelected}
                                      disabled={quizSubmitted}
                                      onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                                      className="accent-amber-600"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs">
                                <span className={`font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                                  {isCorrect ? "✓ सही उत्तर / Correct!" : "✗ गलत उत्तर / Incorrect."}
                                </span>
                                <p className="text-gray-700 mt-1">
                                  {q.explanation[language] || q.explanation.en}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      {quizSubmitted ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-gray-900">
                            {language === "hi" ? "प्राप्त अंक:" : "Your Score:"}{" "}
                            <span className="text-emerald-700">{quizScore} / {course.assessment.length}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{language === "hi" ? "पुनः प्रयास करें" : "Retake Quiz"}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={Object.keys(quizAnswers).length < course.assessment.length}
                          onClick={handleSubmitAssessment}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
                        >
                          {language === "hi" ? "मूल्यांकन जमा करें" : "Submit Assessment"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: OFFICIAL COURSE COMPLETION CERTIFICATE */}
                {activeTab === "certificate" && (
                  <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                    {isEligibleForCertificate ? (
                      <div className="space-y-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-md">
                          🎓
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            {language === "hi" ? "प्रमाण-पत्र अनलॉक हुआ!" : "Certificate Unlocked!"}
                          </span>
                          <h3 className="text-2xl font-black text-gray-900 mt-2">
                            {language === "hi" ? "बधाई हो! आपने पाठ्यक्रम पूर्ण कर लिया है।" : "Congratulations! You have completed the course."}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
                            {language === "hi"
                              ? "आपका आधिकारिक वैदिक अध्ययन प्रमाण-पत्र जारी करने हेतु तैयार है।"
                              : "Your verified Certificate of Completion has been generated in your name."}
                          </p>
                        </div>

                        {/* Name input */}
                        <div className="max-w-xs mx-auto text-left space-y-1">
                          <label className="text-[11px] font-bold text-amber-950">
                            {language === "hi" ? "प्रमाण-पत्र पर प्रदर्शित नाम:" : "Name on Certificate:"}
                          </label>
                          <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-amber-300 focus:border-amber-600 outline-none bg-white font-bold text-center text-gray-900"
                          />
                        </div>

                        {/* Certificate Card Preview */}
                        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FFF1D6] border-2 border-amber-400 shadow-xl space-y-3">
                          <div className="text-[10px] font-bold text-amber-800 tracking-widest uppercase">
                            SELFREALIZATION ACADEMY OF VEDIC STUDIES
                          </div>
                          <h4 className="text-lg font-black text-amber-950">
                            CERTIFICATE OF COMPLETION
                          </h4>
                          <p className="text-xs text-gray-600 italic">This is proudly presented to</p>
                          <p className="text-xl font-black text-[#5C2106] border-b border-amber-300 pb-2">
                            {studentName || "Devotee Seeker"}
                          </p>
                          <p className="text-xs text-gray-700">
                            for systematically completing all modules of <strong>{course.title.en}</strong>
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Issued on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>{language === "hi" ? "प्रमाण-पत्र डाउनलोड करें (PDF / Print)" : "Download Certificate (PDF)"}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 p-8 rounded-3xl bg-amber-50/50 border border-amber-200">
                        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mx-auto">
                          🔒
                        </div>
                        <h3 className="text-lg font-black text-gray-900">
                          {language === "hi" ? "प्रमाण-पत्र अभी लॉक है" : "Certificate Currently Locked"}
                        </h3>
                        <p className="text-xs text-gray-600 max-w-sm mx-auto">
                          {language === "hi"
                            ? "प्रमाण-पत्र अनलॉक करने के लिए कृपया सभी वीडियो सत्र देखें या अध्याय मूल्यांकन क्विज़ में कम से कम 75% अंक प्राप्त करें।"
                            : "To unlock your official completion certificate, please complete all sessions or score at least 75% on the assessment quiz."}
                        </p>
                        <div className="text-xs font-bold text-amber-800">
                          {completedLessons.length} of {course.lessons.length} Lessons Completed ({progressPercentage}%)
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: CURRICULUM PLAYLIST SIDEBAR (4 Cols)
              ========================================================================= */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Progress Card */}
            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-amber-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {language === "hi" ? "आपकी प्रगति" : "Your Course Progress"}
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {progressPercentage}%
                </span>
              </div>
              
              <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <p className="text-xs text-gray-500">
                {completedLessons.length} {language === "hi" ? "में से" : "of"} {course.lessons.length} {language === "hi" ? "सत्र पूर्ण हुए" : "sessions completed"}
              </p>
            </div>

            {/* Course Playlist Card */}
            <div className="bg-[#FFFDF8] rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-amber-600" />
                  <span>{language === "hi" ? "पाठ्यक्रम अनुसूची" : "Course Curriculum"}</span>
                </h3>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {course.lessons.length} {language === "hi" ? "सत्र" : "Sessions"}
                </span>
              </div>

              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => {
                  const isCurrent = idx === activeLessonIndex;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setActiveLessonIndex(idx);
                        setActiveTab("notes");
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isCurrent
                          ? "bg-amber-100/90 border-amber-400 shadow-sm ring-1 ring-amber-400"
                          : isDone
                          ? "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-gray-800"
                          : "bg-white hover:bg-amber-50/60 border-amber-100 text-gray-700"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            ✓
                          </div>
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold animate-pulse shadow-xs">
                            ▶
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="grow min-w-0">
                        <p className={`text-xs sm:text-sm leading-snug truncate ${isCurrent ? "font-black text-amber-950" : "font-bold text-gray-900"}`}>
                          {lesson.title[language] || lesson.title.en}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                          <span>{lesson.duration}</span>
                          {isCurrent && (
                            <span className="font-bold text-amber-700">• Playing Now</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructor & Accreditation Info */}
            <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-amber-200/90 shadow-sm space-y-2 text-xs">
              <span className="font-bold text-amber-900 uppercase tracking-wider block text-[10px]">
                {language === "hi" ? "मार्गदर्शक एवं संस्थान" : "Faculty & Academy"}
              </span>
              <p className="font-bold text-gray-900 text-sm">
                {course.instructor}
              </p>
              <p className="text-gray-500 leading-relaxed text-xs">
                {language === "hi"
                  ? "इंटरनेशनल सोसाइटी फॉर कृष्णा कॉन्शियसनेस (इस्कॉन) द्वारा प्रामाणिक वैदिक दर्शन अनुसार संचालित।"
                  : "Authentic Vedic philosophy presented according to the disciplic succession of Śrīla Prabhupāda."}
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
