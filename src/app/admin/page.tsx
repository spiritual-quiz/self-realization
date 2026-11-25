"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  HelpCircle, 
  Calendar, 
  Mail, 
  Upload, 
  Download, 
  Users, 
  CheckCircle2, 
  Plus, 
  LogOut, 
  Sparkles, 
  Trash2, 
  Clock, 
  Award,
  AlertCircle,
  FileText,
  Eye,
  Loader2,
  GraduationCap,
  Edit,
  Save,
  X,
  Music,
  Volume2
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { SAMPLE_CSV_CONTENT, parseCSVToQuestions, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, limit } from "firebase/firestore";

const INITIAL_COURSES = [
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
    level: "Beginner",
    lessons: "6 Lessons",
    duration: "3.5 Hours",
    price: "Free Access",
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
    level: "Intermediate",
    lessons: "12 Lessons",
    duration: "8 Hours",
    price: "Free Access",
    isPaid: false,
    modules: [
      { title: { en: "Module 1: Mind Control & Mental Hygiene", hi: "अध्याय 1: मन नियंत्रण एवं मानसिक शुद्धि" }, length: "45 mins" },
      { title: { en: "Module 2: Overcoming Stress & Anger through Gita", hi: "अध्याय 2: तनाव एवं क्रोध से मुक्ति" }, length: "50 mins" },
      { title: { en: "Module 3: Daily Japa & Meditation Routines", hi: "अध्याय 3: दैनिक जप एवं ध्यान दिनचर्या" }, length: "40 mins" }
    ]
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("madhavcarandas@gmail.com");
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "quizzes" | "classes" | "inquiries">("overview");

  // Analytics & Collections State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>(INITIAL_COURSES);
  const [loadingData, setLoadingData] = useState(false);

  // Course Management State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitleEn, setCourseTitleEn] = useState("");
  const [courseTitleHi, setCourseTitleHi] = useState("");
  const [courseDescEn, setCourseDescEn] = useState("");
  const [courseDescHi, setCourseDescHi] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const [courseDuration, setCourseDuration] = useState("4 Hours");
  const [courseLessons, setCourseLessons] = useState("6 Lessons");
  const [coursePrice, setCoursePrice] = useState("Free Access");
  const [courseModules, setCourseModules] = useState<{ titleEn: string; titleHi: string; length: string }[]>([
    { titleEn: "Introduction & Overview", titleHi: "प्रस्तावना एवं परिचय", length: "30 mins" }
  ]);
  const [savingCourse, setSavingCourse] = useState(false);

  // CSV Quiz Upload & Customization State
  const [csvRawText, setCsvRawText] = useState("");
  const [quizTitleEn, setQuizTitleEn] = useState("Bhagavad-gītā Wisdom Challenge");
  const [quizTitleHi, setQuizTitleHi] = useState("श्रीमद्भगवद्गीता ज्ञान प्रश्नोत्तरी");
  const [category, setCategory] = useState("Bhagavad-gītā");
  const [timerSeconds, setTimerSeconds] = useState<number>(10);
  const [bgMusicUrl, setBgMusicUrl] = useState<string>("/audio/bg-music.mp3");
  const [bgMusicVolume, setBgMusicVolume] = useState<number>(0.35);
  const [correctSoundUrl, setCorrectSoundUrl] = useState<string>("/audio/correct.mp3");
  const [wrongSoundUrl, setWrongSoundUrl] = useState<string>("/audio/wrong.mp3");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuizQuestion[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Check Admin Session on mount
  useEffect(() => {
    const session = localStorage.getItem("sr_admin_session");
    if (!session) {
      router.push("/admin/login");
    } else {
      try {
        const parsed = JSON.parse(session);
        if (parsed?.email) setAdminEmail(parsed.email);
      } catch (e) {}
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, [router]);

  // Fetch live registrations, inquiries, quizzes, and courses
  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Class Registrations
      const regSnap = await getDocs(query(collection(db, "classRegistrations"), limit(50)));
      const regList: any[] = [];
      regSnap.forEach((doc) => regList.push({ id: doc.id, ...doc.data() }));
      setRegistrations(regList);

      // 2. Fetch Inquiries
      const inqSnap = await getDocs(query(collection(db, "inquiries"), limit(50)));
      const inqList: any[] = [];
      inqSnap.forEach((doc) => inqList.push({ id: doc.id, ...doc.data() }));
      setInquiries(inqList);

      // 3. Fetch Quizzes from Firestore & LocalStorage
      const quizSnap = await getDocs(query(collection(db, "quizzes"), limit(50)));
      const quizList: any[] = [];
      quizSnap.forEach((doc) => quizList.push({ id: doc.id, ...doc.data() }));
      if (quizList.length > 0) {
        setCustomQuizzes(quizList);
        localStorage.setItem("sr_custom_quizzes", JSON.stringify(quizList));
      } else {
        const localQ = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
        setCustomQuizzes(localQ);
      }

      // 4. Fetch Courses from Firestore & LocalStorage
      const courseSnap = await getDocs(query(collection(db, "courses"), limit(50)));
      const fetchedCourses: any[] = [];
      courseSnap.forEach((doc) => fetchedCourses.push({ id: doc.id, ...doc.data() }));
      if (fetchedCourses.length > 0) {
        setCoursesList(fetchedCourses);
        localStorage.setItem("sr_custom_courses", JSON.stringify(fetchedCourses));
      } else {
        const localC = JSON.parse(localStorage.getItem("sr_custom_courses") || "null");
        if (localC && localC.length > 0) {
          setCoursesList(localC);
        } else {
          setCoursesList(INITIAL_COURSES);
          localStorage.setItem("sr_custom_courses", JSON.stringify(INITIAL_COURSES));
        }
      }
    } catch (err) {
      console.warn("Error fetching firestore admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sr_admin_session");
    document.cookie = "sr_admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  // COURSE MANAGEMENT HANDLERS
  const handleOpenAddCourse = () => {
    setEditingCourseId(null);
    setCourseTitleEn("");
    setCourseTitleHi("");
    setCourseDescEn("");
    setCourseDescHi("");
    setCourseLevel("Beginner");
    setCourseDuration("4 Hours");
    setCourseLessons("6 Lessons");
    setCoursePrice("Free Access");
    setCourseModules([
      { titleEn: "Session 1: Getting Started", titleHi: "सत्र 1: प्रारंभिक परिचय", length: "35 mins" }
    ]);
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setCourseTitleEn(course.title?.en || "");
    setCourseTitleHi(course.title?.hi || "");
    setCourseDescEn(course.desc?.en || "");
    setCourseDescHi(course.desc?.hi || "");
    setCourseLevel(course.level || "Beginner");
    setCourseDuration(course.duration || "4 Hours");
    setCourseLessons(course.lessons || "6 Lessons");
    setCoursePrice(course.price || "Free Access");
    if (course.modules && course.modules.length > 0) {
      setCourseModules(course.modules.map((m: any) => ({
        titleEn: m.title?.en || m.titleEn || "",
        titleHi: m.title?.hi || m.titleHi || "",
        length: m.length || "30 mins"
      })));
    } else {
      setCourseModules([
        { titleEn: "Session 1: Introduction", titleHi: "सत्र 1: परिचय", length: "30 mins" }
      ]);
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitleEn.trim()) return;

    setSavingCourse(true);
    const courseId = editingCourseId || ("course-" + Date.now());

    const courseData = {
      id: courseId,
      title: {
        en: courseTitleEn.trim(),
        hi: courseTitleHi.trim() || courseTitleEn.trim()
      },
      desc: {
        en: courseDescEn.trim(),
        hi: courseDescHi.trim() || courseDescEn.trim()
      },
      level: courseLevel,
      duration: courseDuration,
      lessons: courseLessons,
      price: coursePrice,
      isPaid: coursePrice.toLowerCase().includes("₹") || coursePrice.toLowerCase().includes("paid"),
      modules: courseModules.map((m) => ({
        title: { en: m.titleEn, hi: m.titleHi || m.titleEn },
        length: m.length
      })),
      updatedAt: new Date().toISOString()
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, "courses", courseId), courseData, { merge: true });
    } catch (err) {
      console.warn("Firestore save notice:", err);
    }

    // Update state & localStorage
    const updated = editingCourseId
      ? coursesList.map((c) => (c.id === editingCourseId ? courseData : c))
      : [courseData, ...coursesList];

    setCoursesList(updated);
    localStorage.setItem("sr_custom_courses", JSON.stringify(updated));
    setSavingCourse(false);
    setShowCourseModal(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? It will immediately be removed from the visitors page.")) return;

    try {
      await deleteDoc(doc(db, "courses", courseId));
    } catch (e) {
      console.warn("Firestore delete notice:", e);
    }

    const updated = coursesList.filter((c) => c.id !== courseId);
    setCoursesList(updated);
    localStorage.setItem("sr_custom_courses", JSON.stringify(updated));
  };

  // QUIZ CSV UPLOAD & DELETE HANDLERS
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selfrealization_quiz_template_with_images.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSample = () => {
    setCsvRawText(SAMPLE_CSV_CONTENT);
    const res = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
    setParseError(null);
    setParsedQuestions(res.questions);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setCsvRawText(content);
      const res = parseCSVToQuestions(content);
      if (res.error) {
        setParseError(`Notice: ${res.error}`);
      } else {
        setParseError(null);
      }
      setParsedQuestions(res.questions);
    };
    reader.readAsText(file);
  };

  const handleUpdateQuestionImage = (index: number, newUrl: string) => {
    setParsedQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], imageUrl: newUrl };
      return copy;
    });
  };

  const handleUploadQuiz = async () => {
    if (parsedQuestions.length === 0) return;
    setUploading(true);

    const quizData = {
      title: { en: quizTitleEn, hi: quizTitleHi },
      category,
      timerSeconds,
      bgMusicUrl,
      bgMusicVolume,
      correctSoundUrl,
      wrongSoundUrl,
      questionCount: parsedQuestions.length,
      totalMarks: parsedQuestions.reduce((a, b) => a + b.points, 0),
      questions: parsedQuestions,
    };

    try {
      const docRef = await addDoc(collection(db, "quizzes"), {
        ...quizData,
        createdAt: serverTimestamp(),
      });
      const newQuiz = { id: docRef.id, ...quizData };
      const updated = [newQuiz, ...customQuizzes];
      setCustomQuizzes(updated);
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
      setUploadSuccess(true);
    } catch (e) {
      const mockId = "quiz-" + Date.now();
      const newQuiz = { id: mockId, ...quizData };
      const updated = [newQuiz, ...customQuizzes];
      setCustomQuizzes(updated);
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
      setUploadSuccess(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await deleteDoc(doc(db, "quizzes", quizId));
    } catch (e) {
      console.warn("Firestore delete quiz notice:", e);
    }

    const updated = customQuizzes.filter((q) => q.id !== quizId);
    setCustomQuizzes(updated);
    localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
  };

  const handleDeleteRegistration = async (regId: string) => {
    if (!confirm("Are you sure you want to delete this class registration?")) return;

    try {
      await deleteDoc(doc(db, "classRegistrations", regId));
    } catch (e) {
      console.warn("Firestore delete registration notice:", e);
    }

    setRegistrations((prev) => prev.filter((r) => r.id !== regId));
  };

  const handleDeleteInquiry = async (inqId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      await deleteDoc(doc(db, "inquiries", inqId));
    } catch (e) {
      console.warn("Firestore delete inquiry notice:", e);
    }

    setInquiries((prev) => prev.filter((i) => i.id !== inqId));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      
      {/* Top Admin Navigation Bar with Official Transparent Logo */}
      <div className="bg-amber-950 text-white border-b-2 border-amber-600 px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/images/logo.png"
              alt="SelfRealization"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">SelfRealization Admin Console</h1>
            <p className="text-[11px] text-amber-300/80">
              Administrator: <span className="font-semibold text-white">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
          >
            View Public Site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "overview" ? "bg-amber-600 text-white shadow-md" : "text-gray-700 hover:bg-amber-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Console Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "courses" ? "bg-amber-600 text-white shadow-md" : "text-gray-700 hover:bg-amber-50"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Manage Courses (LMS)</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {coursesList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "quizzes" ? "bg-amber-600 text-white shadow-md" : "text-gray-700 hover:bg-amber-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quizzes & CSV Importer</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {customQuizzes.length + 3}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "classes" ? "bg-amber-600 text-white shadow-md" : "text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Registrations</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {registrations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "inquiries" ? "bg-amber-600 text-white shadow-md" : "text-gray-700 hover:bg-amber-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              {inquiries.length}
            </span>
          </button>
        </div>

        {/* TAB 1: CONSOLE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Courses</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{coursesList.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Quizzes</p>
                  <p className="text-3xl font-black text-gray-900 mt-1">{customQuizzes.length + 3}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Registrations</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">{registrations.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Inquiries Received</p>
                  <p className="text-3xl font-black text-blue-600 mt-1">{inquiries.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Admin Quick Actions</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={handleOpenAddCourse}
                  className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all cursor-pointer space-y-1"
                >
                  <p className="text-sm font-bold text-amber-900">+ Add New Course</p>
                  <p className="text-xs text-gray-600">Create a new LMS video course with syllabus</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("quizzes")}
                  className="p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left transition-all cursor-pointer space-y-1"
                >
                  <p className="text-sm font-bold text-orange-900">Upload Quiz via CSV</p>
                  <p className="text-xs text-gray-600">Import 10-15 questions in 1 shot</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("classes")}
                  className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all cursor-pointer space-y-1"
                >
                  <p className="text-sm font-bold text-emerald-900">View Registrations</p>
                  <p className="text-xs text-gray-600">Review participants for weekly live classes</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSE MANAGEMENT (FULL CRUD) */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                  <span>E-Learning Courses (LMS) Management</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add, edit, or delete self-paced courses. All updates immediately reflect on the public visitors page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCourse}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Course</span>
              </button>
            </div>

            {/* Courses Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coursesList.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {course.level || "All Levels"}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {course.price || "Free Access"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {course.title?.en || course.title}
                    </h3>
                    <p className="text-xs text-gray-500 italic">
                      {course.title?.hi}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {course.desc?.en || course.desc}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>{course.lessons || "6 Lessons"}</span>
                      <span>•</span>
                      <span>{course.duration || "3.5 Hours"}</span>
                      <span>•</span>
                      <span>{(course.modules || []).length} Modules</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCourse(course)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Course</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES & CSV IMPORTER */}
        {activeTab === "quizzes" && (
          <div className="space-y-6">
            {/* CSV Quiz Importer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span>Upload Quiz in One Shot via CSV</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload 10, 15, or 20 questions in one batch. You can set the countdown timer and image URLs per question.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Template</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-orange-900 bg-orange-50 hover:bg-orange-100 border border-orange-200 cursor-pointer"
                  >
                    Load Sample (10 Qs)
                  </button>
                </div>
              </div>

              {uploadSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Quiz successfully uploaded and published live! Visitors can play immediately.</span>
                </div>
              )}

              {parseError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Quiz Title (English)</label>
                  <input
                    type="text"
                    value={quizTitleEn}
                    onChange={(e) => setQuizTitleEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Quiz Title (Hindi)</label>
                  <input
                    type="text"
                    value={quizTitleHi}
                    onChange={(e) => setQuizTitleHi(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Timer per Question</label>
                  <select
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value={5}>5 Seconds (Fast Action)</option>
                    <option value={10}>10 Seconds (Standard Gaming)</option>
                    <option value={15}>15 Seconds (Comfortable)</option>
                    <option value={20}>20 Seconds (Extended)</option>
                  </select>
                </div>
              </div>

              {/* AUDIO & AMBIENCE CUSTOMIZATION */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Audio & Sound FX Customization</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Background Music */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-amber-600" />
                      <span>Background Music</span>
                    </label>
                    <select
                      value={bgMusicUrl}
                      onChange={(e) => setBgMusicUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="/audio/bg-music.mp3">Divine Flute Meditation (Default)</option>
                      <option value="https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3">Sacred Sitar & Temple Bells</option>
                      <option value="https://assets.mixkit.co/music/preview/mixkit-meditation-flute-247.mp3">Peaceful Ambient Flute</option>
                      <option value="https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3">Peaceful Yamuna Ambient</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Or enter custom MP3 URL..."
                      value={bgMusicUrl}
                      onChange={(e) => setBgMusicUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] bg-white text-gray-700"
                    />
                  </div>

                  {/* Right Answer Sound */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Right Answer Sound FX</span>
                    </label>
                    <select
                      value={correctSoundUrl}
                      onChange={(e) => setCorrectSoundUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="/audio/correct.mp3">Harinam Chime & Bell (Default)</option>
                      <option value="https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3">Temple Bell Ding</option>
                      <option value="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3">Celestial Flute Note</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Or enter custom MP3 URL..."
                      value={correctSoundUrl}
                      onChange={(e) => setCorrectSoundUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] bg-white text-gray-700"
                    />
                  </div>

                  {/* Wrong Answer Sound */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Wrong Answer Sound FX</span>
                    </label>
                    <select
                      value={wrongSoundUrl}
                      onChange={(e) => setWrongSoundUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value="/audio/wrong.mp3">Soft Temple Gong (Default)</option>
                      <option value="https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3">Deep Resonance Bell</option>
                      <option value="https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3">Low Meditation Tone</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Or enter custom MP3 URL..."
                      value={wrongSoundUrl}
                      onChange={(e) => setWrongSoundUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] bg-white text-gray-700"
                    />
                  </div>
                </div>

                {/* Volume Slider for Quiz Background Music */}
                <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">Background Music Volume Control</span>
                      <span className="text-[11px] text-gray-500">Adjust the default background music loudness for participants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-72">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round(bgMusicVolume * 100)}
                      onChange={(e) => setBgMusicVolume(Number(e.target.value) / 100)}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-xs text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md shrink-0 w-12 text-center">
                      {Math.round(bgMusicVolume * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {[20, 35, 50, 75, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setBgMusicVolume(v / 100)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md border cursor-pointer ${
                          Math.round(bgMusicVolume * 100) === v
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-50"
                        }`}
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center justify-between">
                  <span>Upload CSV File</span>
                  <span className="text-[11px] text-gray-400 font-normal">Supports headers: question_en, question_hi, image_url, etc.</span>
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                />
              </div>

              {parsedQuestions.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                    <div>
                      <p className="text-xs font-bold text-amber-950">
                        ✓ {parsedQuestions.length} Questions Verified & Ready to Publish
                      </p>
                      <p className="text-[11px] text-amber-800">
                        You can review or change the image URL for any individual question below.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadQuiz}
                      disabled={uploading}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Publish Quiz Now</span>
                    </button>
                  </div>

                  {/* Individual Question Images & Options Review */}
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {parsedQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>

                        {/* Thumbnail */}
                        <div className="relative w-16 h-12 rounded-lg bg-stone-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {q.imageUrl ? (
                            <Image
                              src={q.imageUrl}
                              alt={`Q${idx + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">No Image</span>
                          )}
                        </div>

                        {/* Details & Image Input */}
                        <div className="grow space-y-1.5 w-full">
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {q.question.hi}
                          </p>
                          <p className="text-[11px] text-gray-500 italic">
                            {q.question.en}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <label className="text-[10px] font-bold text-amber-900 uppercase shrink-0">Image URL:</label>
                            <input
                              type="text"
                              value={q.imageUrl || ""}
                              onChange={(e) => handleUpdateQuestionImage(idx, e.target.value)}
                              placeholder="https://... (individual question image)"
                              className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-1 focus:ring-amber-500 text-gray-800"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Existing Custom Quizzes List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Published Custom Quizzes</h3>
              {customQuizzes.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No custom quizzes uploaded yet. Use the CSV Importer above to publish one.</p>
              ) : (
                <div className="space-y-3">
                  {customQuizzes.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-gray-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900">{q.title?.en}</p>
                        <p className="text-xs text-gray-500">{q.questionCount} Questions • {q.timerSeconds || 10}s Timer • {q.totalMarks} Points</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/quiz/play?id=${q.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100"
                        >
                          Play Quiz ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuiz(q.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLASS REGISTRATIONS */}
        {activeTab === "classes" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>Live Class & Course Registrations</span>
            </h2>

            {registrations.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No registrations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-amber-50 text-amber-900 font-bold uppercase border-b border-amber-200">
                    <tr>
                      <th className="p-3">Participant</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Class / Course</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((r) => (
                      <tr key={r.id} className="hover:bg-amber-50/40">
                        <td className="p-3 font-semibold text-gray-900">{r.fullName}</td>
                        <td className="p-3 font-mono">{r.phone}</td>
                        <td className="p-3">{r.email || "—"}</td>
                        <td className="p-3 font-medium text-amber-900">{typeof r.classTitle === "object" ? r.classTitle.en : r.classTitle}</td>
                        <td className="p-3 capitalize">{r.preferredMode || "Online"}</td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">
                          {r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRegistration(r.id)}
                            className="p-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              <span>Contact & Spiritual Inquiries</span>
            </h2>

            {inquiries.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No inquiries recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-2xl border border-gray-200 space-y-1.5 bg-stone-50/50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">{inq.fullName} <span className="text-xs font-normal text-gray-500 font-mono">({inq.phone} • {inq.email})</span></p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">{inq.subject}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer text-[11px] font-bold flex items-center gap-1 px-2"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT COURSE */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <span>{editingCourseId ? "Edit LMS Course" : "Add New LMS Course"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Course Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={courseTitleEn}
                    onChange={(e) => setCourseTitleEn(e.target.value)}
                    placeholder="e.g. Science of Self-Realization"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Course Title (Hindi)</label>
                  <input
                    type="text"
                    value={courseTitleHi}
                    onChange={(e) => setCourseTitleHi(e.target.value)}
                    placeholder="उदा. आत्म-साक्षात्कार का विज्ञान"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Description (English)</label>
                  <textarea
                    rows={2}
                    value={courseDescEn}
                    onChange={(e) => setCourseDescEn(e.target.value)}
                    placeholder="Brief syllabus overview..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={courseDescHi}
                    onChange={(e) => setCourseDescHi(e.target.value)}
                    placeholder="संक्षिप्त विवरण..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-200 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Lessons</label>
                  <input
                    type="text"
                    value={courseLessons}
                    onChange={(e) => setCourseLessons(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Price Tag</label>
                  <input
                    type="text"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              {/* Modules / Lessons List */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase">Curriculum Sessions / Lessons</label>
                  <button
                    type="button"
                    onClick={() => setCourseModules([...courseModules, { titleEn: `Session ${courseModules.length + 1}`, titleHi: `सत्र ${courseModules.length + 1}`, length: "30 mins" }])}
                    className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    + Add Lesson
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {courseModules.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-gray-200 text-xs">
                      <span className="font-bold text-gray-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder="Lesson Title (English)"
                        value={m.titleEn}
                        onChange={(e) => {
                          const updated = [...courseModules];
                          updated[idx].titleEn = e.target.value;
                          setCourseModules(updated);
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Length"
                        value={m.length}
                        onChange={(e) => {
                          const updated = [...courseModules];
                          updated[idx].length = e.target.value;
                          setCourseModules(updated);
                        }}
                        className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 bg-white"
                      />
                      {courseModules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCourseModules(courseModules.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {savingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingCourseId ? "Update Course" : "Publish Course"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
