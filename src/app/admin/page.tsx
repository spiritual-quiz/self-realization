"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Volume2,
  Play,
  Pause,
  BookOpen,
  Radio,
  ExternalLink,
  ChevronRight,
  Menu
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { SAMPLE_CSV_CONTENT, parseCSVToQuestions, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, limit } from "firebase/firestore";

const INITIAL_LMS_COURSES = [
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

const INITIAL_ONGOING_CLASSES = [
  {
    id: "class-sunday-gita",
    title: {
      en: "Bhagavad-gītā Unveiled: The Science of Soul & Karma",
      hi: "श्रीमद्भगवद्गीता का रहस्य: आत्मा एवं कर्म का विज्ञान"
    },
    subtitle: {
      en: "Every Sunday interactive evening session with kirtan and prasadam",
      hi: "प्रत्येक रविवार सांध्यकालीन सत्र, संकीर्तन एवं महाप्रसाद"
    },
    isPaid: false,
    price: "Free Access",
    date: "Every Sunday",
    time: "06:00 PM – 07:30 PM IST",
    mode: "Both",
    instructor: "H.G. Gauranga Das",
    status: "Ongoing",
    image: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    description: {
      en: "Deep dive into the 18 chapters of Bhagavad-gita As It Is with practical modern life applications.",
      hi: "यथारूप भगवद्गीता के 18 अध्यायों का व्यावहारिक जीवन में गहरा अनुप्रयोग।"
    }
  },
  {
    id: "class-wed-meditation",
    title: {
      en: "Mantra Meditation & Mind Control Workshop",
      hi: "मंत्र ध्यान एवं मन-नियंत्रण कार्यशाला"
    },
    subtitle: {
      en: "Mid-week mindfulness, japa technique, and stress release",
      hi: "सप्ताहिक मानसिक शांति, जप विधि और तनाव मुक्ति"
    },
    isPaid: false,
    price: "Free Access",
    date: "Every Wednesday",
    time: "07:30 PM – 08:30 PM IST",
    mode: "Online",
    instructor: "H.G. Radheshyam Das",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    description: {
      en: "Learn authentic Vedic mantra meditation techniques to overcome anxiety and build focus.",
      hi: "चिंता और एकाग्रता की कमी को दूर करने हेतु प्रामाणिक वैदिक जप तकनीक सीखें।"
    }
  },
  {
    id: "class-sat-youth",
    title: {
      en: "VOICE Youth Forum: Focus, Purpose & Spiritual Life",
      hi: "युवा मंच (VOICE): एकाग्रता, जीवन का उद्देश्य और साधना"
    },
    subtitle: {
      en: "Dynamic interactive session for students & young working professionals",
      hi: "विद्यार्थियों एवं युवा कामकाजी पेशेवरों के लिए विशेष सत्र"
    },
    isPaid: false,
    price: "Free Access",
    date: "Every Saturday",
    time: "06:30 PM – 08:00 PM IST",
    mode: "Both",
    instructor: "Resident Monks & Youth Mentors",
    status: "Ongoing",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    description: {
      en: "Empowering youth with strong character, moral leadership, clarity of purpose, and life balance.",
      hi: "सशक्त चरित्र, नैतिक नेतृत्व और जीवन संतुलन के साथ युवाओं को सशक्त बनाना।"
    }
  },
  {
    id: "class-seminar-leadership",
    title: {
      en: "Vedic Wisdom for Modern Professionals (Leadership & Ethics)",
      hi: "आधुनिक पेशेवरों के लिए वैदिक नेतृत्व एवं कार्यकुशलता सूत्र"
    },
    subtitle: {
      en: "Special 3-Hour Interactive Masterclass for Working Professionals",
      hi: "विशेष 3-घंटे की गहन कार्यशाला"
    },
    isPaid: true,
    price: "₹499",
    date: "Dec 12, 2026",
    time: "05:00 PM – 08:00 PM IST",
    mode: "Online",
    instructor: "Dr. Sumit Sharma (IIT-B Alumnus)",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    description: {
      en: "Executive masterclass on ethical leadership and mindfulness for managers and engineers.",
      hi: "आधुनिक प्रबंधन एवं नैतिक नेतृत्व हेतु विशेष कार्यशाला।"
    }
  }
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("madhavcarandas@gmail.com");
  
  // Left Sidebar Tabs strictly matching user requests
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "ongoing-courses" | "quizzes" | "classes" | "inquiries"
  >("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Analytics & Collections State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);
  const [lmsCoursesList, setLmsCoursesList] = useState<any[]>(INITIAL_LMS_COURSES);
  const [ongoingCoursesList, setOngoingCoursesList] = useState<any[]>(INITIAL_ONGOING_CLASSES);
  const [loadingData, setLoadingData] = useState(false);

  // LMS Course Management Modal State
  const [showLmsModal, setShowLmsModal] = useState(false);
  const [editingLmsId, setEditingLmsId] = useState<string | null>(null);
  const [lmsTitleEn, setLmsTitleEn] = useState("");
  const [lmsTitleHi, setLmsTitleHi] = useState("");
  const [lmsDescEn, setLmsDescEn] = useState("");
  const [lmsDescHi, setLmsDescHi] = useState("");
  const [lmsLevel, setLmsLevel] = useState("Beginner");
  const [lmsDuration, setLmsDuration] = useState("4 Hours");
  const [lmsLessons, setLmsLessons] = useState("6 Lessons");
  const [lmsPrice, setLmsPrice] = useState("Free Access");
  const [lmsModules, setLmsModules] = useState<{ titleEn: string; titleHi: string; length: string }[]>([
    { titleEn: "Introduction & Overview", titleHi: "प्रस्तावना एवं परिचय", length: "30 mins" }
  ]);

  // Normal / Ongoing Course Modal State (Requirement 4)
  const [showOngoingModal, setShowOngoingModal] = useState(false);
  const [editingOngoingId, setEditingOngoingId] = useState<string | null>(null);
  const [ongoingTitleEn, setOngoingTitleEn] = useState("");
  const [ongoingTitleHi, setOngoingTitleHi] = useState("");
  const [ongoingSubtitleEn, setOngoingSubtitleEn] = useState("");
  const [ongoingSubtitleHi, setOngoingSubtitleHi] = useState("");
  const [ongoingInstructor, setOngoingInstructor] = useState("Resident Mentors");
  const [ongoingDate, setOngoingDate] = useState("Every Sunday");
  const [ongoingTime, setOngoingTime] = useState("06:00 PM – 07:30 PM IST");
  const [ongoingMode, setOngoingMode] = useState<"Online" | "Offline" | "Both">("Both");
  const [ongoingStatus, setOngoingStatus] = useState<"Ongoing" | "Upcoming" | "Completed">("Ongoing");
  const [ongoingIsPaid, setOngoingIsPaid] = useState(false);
  const [ongoingPrice, setOngoingPrice] = useState("Free Access");
  const [ongoingDescEn, setOngoingDescEn] = useState("");
  const [ongoingDescHi, setOngoingDescHi] = useState("");
  const [ongoingImage, setOngoingImage] = useState("https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png");

  // CSV Quiz Upload & Audio Settings State (Requirement 2)
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

  // Audio Edit Modal for Published Quizzes
  const [editingQuizAudio, setEditingQuizAudio] = useState<any | null>(null);
  const [editBgMusicUrl, setEditBgMusicUrl] = useState<string>("/audio/bg-music.mp3");
  const [editCorrectSoundUrl, setEditCorrectSoundUrl] = useState<string>("/audio/correct.mp3");
  const [editWrongSoundUrl, setEditWrongSoundUrl] = useState<string>("/audio/wrong.mp3");
  const [editBgMusicVolume, setEditBgMusicVolume] = useState<number>(0.35);

  // Preview Audio Player
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [playingPreviewUrl, setPlayingPreviewUrl] = useState<string | null>(null);

  const togglePlayAudioPreview = (url: string, volume: number = 0.5) => {
    if (!url) return;
    if (playingPreviewUrl === url) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPlayingPreviewUrl(null);
      return;
    }

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }
    const a = new Audio(url);
    a.volume = volume;
    a.play().then(() => {
      audioPreviewRef.current = a;
      setPlayingPreviewUrl(url);
      a.onended = () => setPlayingPreviewUrl(null);
    }).catch((err) => {
      console.warn("Audio play notice:", err);
      setPlayingPreviewUrl(null);
    });
  };

  // Direct Audio File Upload via FileReader
  const handleAudioUpload = (file: File, target: "bg" | "correct" | "wrong" | "edit-bg" | "edit-correct" | "edit-wrong") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (target === "bg") setBgMusicUrl(dataUrl);
      else if (target === "correct") setCorrectSoundUrl(dataUrl);
      else if (target === "wrong") setWrongSoundUrl(dataUrl);
      else if (target === "edit-bg") setEditBgMusicUrl(dataUrl);
      else if (target === "edit-correct") setEditCorrectSoundUrl(dataUrl);
      else if (target === "edit-wrong") setEditWrongSoundUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Check Admin Session
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

  // Fetch Dashboard Data from Firestore & Local Storage
  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Registrations (Merge Firestore & Local Cache)
      const cachedReg = localStorage.getItem("sr_class_registrations");
      let localRegs: any[] = [];
      if (cachedReg) {
        try { localRegs = JSON.parse(cachedReg); } catch (e) {}
      }

      try {
        const regSnap = await getDocs(query(collection(db, "classRegistrations"), limit(100)));
        const regList: any[] = [];
        regSnap.forEach((doc) => regList.push({ id: doc.id, ...doc.data() }));

        // Merge without duplicates
        const combined = [...regList];
        localRegs.forEach((lr) => {
          if (!combined.some((c) => c.id === lr.id || (c.email === lr.email && c.createdAt === lr.createdAt))) {
            combined.push(lr);
          }
        });
        setRegistrations(combined);
        localStorage.setItem("sr_class_registrations", JSON.stringify(combined));
      } catch (e) {
        if (localRegs.length > 0) {
          setRegistrations(localRegs);
        }
      }

      // 2. Fetch Inquiries
      const inqSnap = await getDocs(query(collection(db, "inquiries"), limit(100)));
      const inqList: any[] = [];
      inqSnap.forEach((doc) => inqList.push({ id: doc.id, ...doc.data() }));
      setInquiries(inqList);

      // 3. Fetch Quizzes
      const quizSnap = await getDocs(query(collection(db, "quizzes"), limit(100)));
      const quizList: any[] = [];
      quizSnap.forEach((doc) => quizList.push({ id: doc.id, ...doc.data() }));
      if (quizList.length > 0) {
        setCustomQuizzes(quizList);
        localStorage.setItem("sr_custom_quizzes", JSON.stringify(quizList));
      } else {
        const localQ = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
        setCustomQuizzes(localQ);
      }

      // 4. Fetch LMS Courses from Firestore with Local fallback
      try {
        const courseSnap = await getDocs(collection(db, "courses"));
        if (!courseSnap.empty) {
          const list: any[] = [];
          courseSnap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setLmsCoursesList(list);
          localStorage.setItem("sr_lms_courses", JSON.stringify(list));
        } else {
          const cachedLms = localStorage.getItem("sr_lms_courses");
          if (cachedLms) {
            setLmsCoursesList(JSON.parse(cachedLms));
          } else {
            setLmsCoursesList(INITIAL_LMS_COURSES);
            localStorage.setItem("sr_lms_courses", JSON.stringify(INITIAL_LMS_COURSES));
          }
        }
      } catch (e) {
        const cachedLms = localStorage.getItem("sr_lms_courses");
        if (cachedLms) setLmsCoursesList(JSON.parse(cachedLms));
      }

      // 5. Fetch Ongoing Courses / Live Classes (Requirement 4)
      const cachedOngoing = localStorage.getItem("sr_ongoing_classes");
      if (cachedOngoing) {
        setOngoingCoursesList(JSON.parse(cachedOngoing));
      } else {
        const classSnap = await getDocs(collection(db, "classes"));
        if (!classSnap.empty) {
          const list: any[] = [];
          classSnap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setOngoingCoursesList(list);
          localStorage.setItem("sr_ongoing_classes", JSON.stringify(list));
        }
      }
    } catch (error) {
      console.warn("Could not fetch Firestore collections:", error);
      const localQ = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
      setCustomQuizzes(localQ);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sr_admin_session");
    router.push("/admin/login");
  };

  // --- LMS COURSES HANDLERS ---
  const handleOpenAddLms = () => {
    setEditingLmsId(null);
    setLmsTitleEn("");
    setLmsTitleHi("");
    setLmsDescEn("");
    setLmsDescHi("");
    setLmsLevel("Beginner");
    setLmsDuration("4 Hours");
    setLmsLessons("6 Lessons");
    setLmsPrice("Free Access");
    setLmsModules([{ titleEn: "Session 1: Introduction", titleHi: "सत्र 1: प्रस्तावना", length: "30 mins" }]);
    setShowLmsModal(true);
  };

  const handleOpenEditLms = (c: any) => {
    setEditingLmsId(c.id);
    setLmsTitleEn(c.title?.en || "");
    setLmsTitleHi(c.title?.hi || "");
    setLmsDescEn(c.desc?.en || "");
    setLmsDescHi(c.desc?.hi || "");
    setLmsLevel(c.level || "Beginner");
    setLmsDuration(c.duration || "4 Hours");
    setLmsLessons(c.lessons || "6 Lessons");
    setLmsPrice(c.price || "Free Access");
    setLmsModules(c.modules ? c.modules.map((m: any) => ({
      titleEn: m.title?.en || m.titleEn || "",
      titleHi: m.title?.hi || m.titleHi || "",
      length: m.length || "30 mins"
    })) : []);
    setShowLmsModal(true);
  };

  const handleSaveLmsCourse = async () => {
    if (!lmsTitleEn.trim()) return;
    const courseObj = {
      id: editingLmsId || `lms-${Date.now()}`,
      title: { en: lmsTitleEn, hi: lmsTitleHi || lmsTitleEn },
      desc: { en: lmsDescEn, hi: lmsDescHi || lmsDescEn },
      level: lmsLevel,
      duration: lmsDuration,
      lessons: lmsLessons,
      price: lmsPrice,
      isPaid: lmsPrice.toLowerCase().includes("free") ? false : true,
      modules: lmsModules.map(m => ({
        title: { en: m.titleEn, hi: m.titleHi || m.titleEn },
        length: m.length
      }))
    };

    let updated: any[] = [];
    if (editingLmsId) {
      updated = lmsCoursesList.map(c => c.id === editingLmsId ? courseObj : c);
    } else {
      updated = [courseObj, ...lmsCoursesList];
    }
    setLmsCoursesList(updated);
    localStorage.setItem("sr_lms_courses", JSON.stringify(updated));
    localStorage.setItem("sr_custom_courses", JSON.stringify(updated));

    try {
      await setDoc(doc(db, "courses", courseObj.id), courseObj);
    } catch (e) {
      console.warn("Could not save LMS course to Firestore:", e);
    }
    setShowLmsModal(false);
  };

  const handleDeleteLmsCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this LMS course?")) return;
    const updated = lmsCoursesList.filter(c => c.id !== courseId);
    setLmsCoursesList(updated);
    localStorage.setItem("sr_lms_courses", JSON.stringify(updated));
    localStorage.setItem("sr_custom_courses", JSON.stringify(updated));

    // Also mark in deletion blacklist for instant cross-tab sync
    try {
      const deletedList = JSON.parse(localStorage.getItem("sr_deleted_courses") || "[]");
      if (!deletedList.includes(courseId)) {
        deletedList.push(courseId);
        localStorage.setItem("sr_deleted_courses", JSON.stringify(deletedList));
      }
      await deleteDoc(doc(db, "courses", courseId));
    } catch (e) {
      console.warn("Could not delete LMS course from Firestore:", e);
    }
  };

  // --- ONGOING COURSES HANDLERS (Requirement 4) ---
  const handleOpenAddOngoing = () => {
    setEditingOngoingId(null);
    setOngoingTitleEn("");
    setOngoingTitleHi("");
    setOngoingSubtitleEn("");
    setOngoingSubtitleHi("");
    setOngoingInstructor("H.G. Gauranga Das");
    setOngoingDate("Every Sunday");
    setOngoingTime("06:00 PM – 07:30 PM IST");
    setOngoingMode("Both");
    setOngoingStatus("Ongoing");
    setOngoingIsPaid(false);
    setOngoingPrice("Free Access");
    setOngoingDescEn("");
    setOngoingDescHi("");
    setOngoingImage("https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png");
    setShowOngoingModal(true);
  };

  const handleOpenEditOngoing = (c: any) => {
    setEditingOngoingId(c.id);
    setOngoingTitleEn(c.title?.en || "");
    setOngoingTitleHi(c.title?.hi || "");
    setOngoingSubtitleEn(c.subtitle?.en || "");
    setOngoingSubtitleHi(c.subtitle?.hi || "");
    setOngoingInstructor(c.instructor || "");
    setOngoingDate(c.date || "");
    setOngoingTime(c.time || "");
    setOngoingMode(c.mode || "Both");
    setOngoingStatus(c.status || "Ongoing");
    setOngoingIsPaid(c.isPaid || false);
    setOngoingPrice(c.price || "Free Access");
    setOngoingDescEn(c.description?.en || "");
    setOngoingDescHi(c.description?.hi || "");
    setOngoingImage(c.image || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png");
    setShowOngoingModal(true);
  };

  const handleSaveOngoingCourse = async () => {
    if (!ongoingTitleEn.trim()) return;
    const item = {
      id: editingOngoingId || `ongoing-${Date.now()}`,
      title: { en: ongoingTitleEn, hi: ongoingTitleHi || ongoingTitleEn },
      subtitle: { en: ongoingSubtitleEn, hi: ongoingSubtitleHi || ongoingSubtitleEn },
      instructor: ongoingInstructor,
      date: ongoingDate,
      time: ongoingTime,
      mode: ongoingMode,
      status: ongoingStatus,
      isPaid: ongoingIsPaid,
      price: ongoingIsPaid ? ongoingPrice : "Free Access",
      description: { en: ongoingDescEn, hi: ongoingDescHi || ongoingDescEn },
      image: ongoingImage,
      registrationOpen: true
    };

    let updated: any[] = [];
    if (editingOngoingId) {
      updated = ongoingCoursesList.map(c => c.id === editingOngoingId ? item : c);
    } else {
      updated = [item, ...ongoingCoursesList];
    }
    setOngoingCoursesList(updated);
    localStorage.setItem("sr_ongoing_classes", JSON.stringify(updated));

    try {
      await setDoc(doc(db, "classes", item.id), item);
    } catch (e) {
      console.warn("Could not save to Firestore:", e);
    }
    setShowOngoingModal(false);
  };

  const handleDeleteOngoingCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this ongoing course?")) return;
    const updated = ongoingCoursesList.filter(c => c.id !== courseId);
    setOngoingCoursesList(updated);
    localStorage.setItem("sr_ongoing_classes", JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, "classes", courseId));
    } catch (e) {}
  };

  // --- QUIZZES & AUDIO HANDLERS (Requirement 2) ---
  const handleParseCsv = (rawText: string) => {
    setCsvRawText(rawText);
    setParseError(null);
    setUploadSuccess(false);

    if (!rawText.trim()) {
      setParsedQuestions([]);
      return;
    }

    try {
      const result = parseCSVToQuestions(rawText);
      if (result.error) {
        setParseError(result.error);
      } else {
        setParsedQuestions(result.questions);
      }
    } catch (err: any) {
      setParseError(err.message || "Failed to parse CSV format.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  const handlePublishQuiz = async () => {
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
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "quizzes"), quizData);
      const newQuiz = { id: docRef.id, ...quizData };
      const updated = [newQuiz, ...customQuizzes];
      setCustomQuizzes(updated);
      localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
      setUploadSuccess(true);
    } catch (error) {
      const mockId = `quiz-${Date.now()}`;
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
    } catch (e) {}
    const updated = customQuizzes.filter((q) => q.id !== quizId);
    setCustomQuizzes(updated);
    localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));
  };

  // Open & Save Audio Settings for existing quiz
  const handleOpenEditQuizAudio = (quiz: any) => {
    setEditingQuizAudio(quiz);
    setEditBgMusicUrl(quiz.bgMusicUrl || "/audio/bg-music.mp3");
    setEditCorrectSoundUrl(quiz.correctSoundUrl || "/audio/correct.mp3");
    setEditWrongSoundUrl(quiz.wrongSoundUrl || "/audio/wrong.mp3");
    setEditBgMusicVolume(quiz.bgMusicVolume !== undefined ? Number(quiz.bgMusicVolume) : 0.35);
  };

  const handleSaveQuizAudio = async () => {
    if (!editingQuizAudio) return;
    const updated = customQuizzes.map((q) => {
      if (q.id === editingQuizAudio.id) {
        return {
          ...q,
          bgMusicUrl: editBgMusicUrl,
          correctSoundUrl: editCorrectSoundUrl,
          wrongSoundUrl: editWrongSoundUrl,
          bgMusicVolume: editBgMusicVolume,
        };
      }
      return q;
    });

    setCustomQuizzes(updated);
    localStorage.setItem("sr_custom_quizzes", JSON.stringify(updated));

    try {
      await setDoc(doc(db, "quizzes", editingQuizAudio.id), {
        bgMusicUrl: editBgMusicUrl,
        correctSoundUrl: editCorrectSoundUrl,
        wrongSoundUrl: editWrongSoundUrl,
        bgMusicVolume: editBgMusicVolume,
      }, { merge: true });
    } catch (e) {}

    setEditingQuizAudio(null);
  };

  const handleDeleteRegistration = async (regId: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteDoc(doc(db, "classRegistrations", regId));
    } catch (e) {
      console.warn("Could not delete registration from Firestore:", e);
    }
    const updated = registrations.filter((r) => r.id !== regId);
    setRegistrations(updated);
    localStorage.setItem("sr_class_registrations", JSON.stringify(updated));
  };

  const handleDeleteInquiry = async (inqId: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, "inquiries", inqId));
    } catch (e) {}
    setInquiries((prev) => prev.filter((i) => i.id !== inqId));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EFE3] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-amber-900 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
          <span>Verifying Administrator Session...</span>
        </div>
      </div>
    );
  }

  // Strictly the 6 Left-Side Vertical Menu Tabs requested by user
  const sidebarNavItems = [
    { id: "overview", label: "Console Overview", icon: BarChart3, count: null },
    { id: "courses", label: "Manage Course LMS", icon: GraduationCap, count: lmsCoursesList.length },
    { id: "ongoing-courses", label: "Manage Ongoing Courses", icon: BookOpen, count: ongoingCoursesList.length },
    { id: "quizzes", label: "Quizzes", icon: Award, count: customQuizzes.length + 3 },
    { id: "classes", label: "Registration", icon: Calendar, count: registrations.length },
    { id: "inquiries", label: "Enquiries", icon: Mail, count: inquiries.length },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F6EFE3] flex flex-col lg:flex-row text-gray-900">
      
      {/* =========================================================================
          LEFT VERTICAL SIDEBAR MENU (Requirement 5)
          ========================================================================= */}
      <aside className="w-full lg:w-72 bg-[#FFFDF8] border-r border-amber-200/90 shrink-0 lg:min-h-screen flex flex-col justify-between shadow-sm z-30">
        
        {/* Top Brand Section */}
        <div>
          <div className="p-5 border-b border-amber-200/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/images/logo.png" alt="SelfRealization" fill className="object-contain" priority />
              </div>
              <div>
                <span className="text-base font-black text-gray-900 tracking-tight block">
                  Self<span className="text-amber-600">Realization</span>
                </span>
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-amber-100/60"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Admin User Chip */}
          <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/60 flex items-center justify-between">
            <div className="truncate text-xs">
              <span className="text-gray-500 font-medium block text-[10px]">Logged in as:</span>
              <span className="font-bold text-amber-950 truncate block">{adminEmail}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" title="Active" />
          </div>

          {/* PURE VERTICAL MENU NAVIGATION (Requirement 5) */}
          <nav className={`p-4 space-y-1.5 ${mobileSidebarOpen ? "block" : "hidden lg:block"}`}>
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md shadow-amber-900/15"
                      : "text-gray-700 hover:text-amber-900 hover:bg-amber-100/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-amber-700"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? "bg-white/25 text-white" : "bg-amber-100 text-amber-900"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className={`p-4 border-t border-amber-200/80 space-y-2 bg-[#FFFDF8] ${mobileSidebarOpen ? "block" : "hidden lg:block"}`}>
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT CONTENT PANE
          ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Top Status Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-200/70">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 capitalize flex items-center gap-2">
                {activeTab === "overview" && "📊 Console Overview"}
                {activeTab === "courses" && "🎓 Manage Course LMS"}
                {activeTab === "ongoing-courses" && "📅 Manage Ongoing Courses & Live Classes"}
                {activeTab === "quizzes" && "🏆 Vedic Quizzes & Audio Settings"}
                {activeTab === "classes" && "📋 Seeker Registrations"}
                {activeTab === "inquiries" && "✉️ Contact Enquiries"}
              </h1>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                SelfRealization Central Administrative Console
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loadingData}
              className="px-3.5 py-2 rounded-xl bg-amber-100/70 hover:bg-amber-200/70 text-amber-950 font-bold text-xs flex items-center gap-1.5 border border-amber-300 transition-all cursor-pointer shadow-xs"
            >
              {loadingData ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "↻"}
              <span>{loadingData ? "Syncing..." : "Sync Cloud"}</span>
            </button>
          </div>

          {/* =========================================================================
              TAB 1: CONSOLE OVERVIEW (STRICTLY 4 STATS - Requirement 3)
              ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total Course Details */}
                <div 
                  onClick={() => setActiveTab("courses")}
                  className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Course Details</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{lmsCoursesList.length + ongoingCoursesList.length}</p>
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      {lmsCoursesList.length} LMS • {ongoingCoursesList.length} Ongoing
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. Live Quizzes */}
                <div 
                  onClick={() => setActiveTab("quizzes")}
                  className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Quizzes</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{customQuizzes.length + 3}</p>
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      {customQuizzes.length} Custom • 3 Standard
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* 3. Registrations */}
                <div 
                  onClick={() => setActiveTab("classes")}
                  className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Registration</p>
                    <p className="text-3xl font-black text-emerald-600 mt-1">{registrations.length}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">Enrolled Seekers</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* 4. Inquiries Received Details */}
                <div 
                  onClick={() => setActiveTab("inquiries")}
                  className="bg-white p-5 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Inquiries Received</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{inquiries.length}</p>
                    <p className="text-[11px] text-blue-800 font-semibold mt-1">Direct Contacts</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: MANAGE COURSE LMS (VIDEO SYLLABUS COURSES)
              ========================================================================= */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span>Self-Paced E-Learning LMS Courses</span>
                  </h2>
                  <button
                    type="button"
                    onClick={handleOpenAddLms}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add LMS Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lmsCoursesList.map((course) => (
                    <div key={course.id} className="p-5 rounded-2xl border border-amber-200/80 bg-stone-50/60 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          {course.level} • {course.duration}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{course.title?.en}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2">{course.desc?.en}</p>
                        <p className="text-[11px] text-amber-900 font-semibold">{course.modules?.length || 0} Syllabus Modules</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => handleOpenEditLms(course)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLmsCourse(course.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: MANAGE ONGOING COURSES & LIVE CLASSES (Requirement 4)
              ========================================================================= */}
          {activeTab === "ongoing-courses" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                      <span>Live Ongoing Courses & Weekly Classes</span>
                    </h2>
                    <p className="text-xs text-gray-500">Currently active sessions displayed on /live-classes and homepage</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddOngoing}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Ongoing Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ongoingCoursesList.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-amber-200/80 bg-stone-50/60 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            item.status === "Ongoing" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {item.status} • {item.mode}
                          </span>
                          <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            {item.price || (item.isPaid ? "Paid" : "Free")}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.title?.en}</h3>
                        <p className="text-xs text-amber-900 font-semibold">🎙️ {item.instructor}</p>
                        <p className="text-xs text-gray-600">⏰ {item.date} • {item.time}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => handleOpenEditOngoing(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOngoingCourse(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: QUIZZES & AUDIO SETTINGS (Requirement 2)
              ========================================================================= */}
          {activeTab === "quizzes" && (
            <div className="space-y-6">
              
              {/* Published Custom Quizzes with Individual Audio Control */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span>Published Quizzes (Manage Sounds & Questions)</span>
                    </h3>
                    <p className="text-xs text-gray-500">Each quiz has its own background music, correct answer sound, and wrong answer sound</p>
                  </div>
                </div>

                {customQuizzes.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-4 bg-amber-50/50 rounded-xl">
                    No custom quizzes uploaded yet. Use the Bulk CSV Importer below to upload one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customQuizzes.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl border border-amber-200/80 bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900">{q.title?.en}</p>
                          <p className="text-xs text-gray-500">
                            {q.questionCount || q.questions?.length || 0} Questions • {q.timerSeconds || 10}s Timer • {q.totalMarks || 100} Points
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-amber-800 font-semibold pt-1">
                            <span className="bg-amber-100 px-2 py-0.5 rounded-md">🎵 Custom Sounds Configured</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Audio Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditQuizAudio(q)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Music className="w-3.5 h-3.5 text-amber-700" />
                            <span>Edit Audio</span>
                          </button>

                          <Link
                            href={`/quiz/play?id=${q.id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1"
                          >
                            <span>Play</span>
                            <ExternalLink className="w-3 h-3" />
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

              {/* Bulk CSV Quiz Creator with Sound Upload Options */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span>Upload New Quiz via Bulk CSV</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Upload a CSV of questions and set specific background music, right answer, and wrong answer sounds.
                  </p>
                </div>

                {/* Audio Customization for New Quiz */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-700" />
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Audio & Sound FX for this Quiz (Upload or Select)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Background Music */}
                    <div className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700">Background Music</label>
                        <button
                          type="button"
                          onClick={() => togglePlayAudioPreview(bgMusicUrl, bgMusicVolume)}
                          className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {playingPreviewUrl === bgMusicUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{playingPreviewUrl === bgMusicUrl ? "Stop" : "Test"}</span>
                        </button>
                      </div>
                      <select
                        value={bgMusicUrl}
                        onChange={(e) => setBgMusicUrl(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                      >
                        <option value="/audio/bg-music.mp3">Divine Flute (Default)</option>
                        <option value="https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3">Sacred Sitar & Bells</option>
                        <option value="https://assets.mixkit.co/music/preview/mixkit-meditation-flute-247.mp3">Ambient Flute</option>
                      </select>
                      <div className="pt-1">
                        <label className="text-[10px] text-gray-500 font-semibold block">Or Upload MP3/WAV File:</label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "bg")}
                          className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-amber-100 file:text-amber-800 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 2. Right Answer Sound */}
                    <div className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700">Right Answer Sound</label>
                        <button
                          type="button"
                          onClick={() => togglePlayAudioPreview(correctSoundUrl)}
                          className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {playingPreviewUrl === correctSoundUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{playingPreviewUrl === correctSoundUrl ? "Stop" : "Test"}</span>
                        </button>
                      </div>
                      <select
                        value={correctSoundUrl}
                        onChange={(e) => setCorrectSoundUrl(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                      >
                        <option value="/audio/correct.mp3">Harinam Chime (Default)</option>
                        <option value="https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3">Temple Bell Ding</option>
                        <option value="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3">Celestial Flute Note</option>
                      </select>
                      <div className="pt-1">
                        <label className="text-[10px] text-gray-500 font-semibold block">Or Upload Sound File:</label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "correct")}
                          className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-amber-100 file:text-amber-800 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 3. Wrong Answer Sound */}
                    <div className="space-y-1.5 bg-white/80 p-3 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-700">Wrong Answer Sound</label>
                        <button
                          type="button"
                          onClick={() => togglePlayAudioPreview(wrongSoundUrl)}
                          className="text-[11px] font-bold text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          {playingPreviewUrl === wrongSoundUrl ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{playingPreviewUrl === wrongSoundUrl ? "Stop" : "Test"}</span>
                        </button>
                      </div>
                      <select
                        value={wrongSoundUrl}
                        onChange={(e) => setWrongSoundUrl(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                      >
                        <option value="/audio/wrong.mp3">Soft Temple Gong (Default)</option>
                        <option value="https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3">Deep Resonance Bell</option>
                        <option value="https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3">Low Tone</option>
                      </select>
                      <div className="pt-1">
                        <label className="text-[10px] text-gray-500 font-semibold block">Or Upload Sound File:</label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "wrong")}
                          className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-amber-100 file:text-amber-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="pt-2 flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="text-xs font-bold text-gray-700 shrink-0">Music Volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgMusicVolume}
                      onChange={(e) => setBgMusicVolume(parseFloat(e.target.value))}
                      className="w-36 accent-amber-600"
                    />
                    <span className="text-xs font-black text-amber-900">{Math.round(bgMusicVolume * 100)}%</span>
                  </div>
                </div>

                {/* Quiz Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Quiz Title (English)</label>
                    <input
                      type="text"
                      value={quizTitleEn}
                      onChange={(e) => setQuizTitleEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Quiz Title (Hindi)</label>
                    <input
                      type="text"
                      value={quizTitleHi}
                      onChange={(e) => setQuizTitleHi(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Timer per Question</label>
                    <select
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                    >
                      <option value={10}>10 Seconds (Standard)</option>
                      <option value={15}>15 Seconds (Relaxed)</option>
                      <option value={20}>20 Seconds (Deep Study)</option>
                    </select>
                  </div>
                </div>

                {/* CSV File Upload or Paste */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Paste CSV Content</label>
                    <label className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer">
                      <span>Browse .CSV File</span>
                      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <textarea
                    rows={6}
                    value={csvRawText}
                    onChange={(e) => handleParseCsv(e.target.value)}
                    placeholder="Paste CSV rows here..."
                    className="w-full font-mono text-xs p-3 rounded-2xl border border-gray-200 bg-stone-50/50"
                  />
                </div>

                {parseError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                    ⚠️ {parseError}
                  </div>
                )}

                {parsedQuestions.length > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between">
                    <span>✓ Successfully parsed {parsedQuestions.length} questions!</span>
                    <button
                      type="button"
                      onClick={handlePublishQuiz}
                      disabled={uploading}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-sm"
                    >
                      {uploading ? "Publishing..." : "Publish Live Quiz ➔"}
                    </button>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl text-xs font-bold">
                    🎉 Quiz published successfully! It is now live in the Vedic Quiz catalog.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: REGISTRATIONS
              ========================================================================= */}
          {activeTab === "classes" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Seeker Class & Quiz Registrations</span>
                </h2>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Total: {registrations.length}
                </span>
              </div>

              {registrations.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-4 bg-amber-50/50 rounded-xl">No registrations recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => {
                    const cleanPhone = (reg.phone || reg.whatsapp || "").replace(/\D/g, "");
                    const isQuiz = Boolean(reg.quizTitle || reg.source === "Vedic Quiz Challenge");
                    return (
                      <div key={reg.id} className="p-5 rounded-2xl border border-amber-200/80 space-y-2.5 bg-gradient-to-br from-white to-amber-50/40 shadow-xs hover:border-amber-300 transition-all">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 text-base">{reg.fullName || reg.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isQuiz ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-purple-100 text-purple-900 border border-purple-200"
                            }`}>
                              {isQuiz ? "🏆 Vedic Quiz" : "📅 Live Class"}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {reg.preferredMode || reg.classMode || "Online Zoom"}
                            </span>
                          </div>

                          {/* Delete Button (User Requirement 2) */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* Contact details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700">
                          {reg.whatsapp || reg.phone ? (
                            <a 
                              href={`https://wa.me/91${cleanPhone.slice(-10)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline underline-offset-2"
                            >
                              <span>📱 WhatsApp: {reg.phone || reg.whatsapp}</span>
                            </a>
                          ) : null}
                          {reg.email && <span>✉️ {reg.email}</span>}
                          {reg.age && <span>🎂 Age: {reg.age} yrs</span>}
                          {reg.gender && <span>👤 Gender: {reg.gender}</span>}
                          {reg.occupation && <span>💼 {reg.occupation}</span>}
                        </div>

                        {/* Residence and Native Place */}
                        {(reg.currentLocation || reg.nativePlace) && (
                          <div className="text-xs text-stone-600 flex flex-wrap gap-x-3 bg-white p-2 rounded-xl border border-gray-100">
                            {reg.currentLocation && <span>📍 Current: {reg.currentLocation}</span>}
                            {reg.nativePlace && <span>🏡 Native: {reg.nativePlace}</span>}
                          </div>
                        )}

                        {/* Target Course / Quiz Details */}
                        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-gray-100">
                          <p className="text-amber-950 font-bold">
                            Target: {typeof reg.classTitle === "object" ? (reg.classTitle.en || reg.classTitle.hi) : (reg.classTitle || reg.quizTitle || "Free Devotional Sessions")}
                          </p>
                          {reg.score && (
                            <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Score: {reg.score}
                            </span>
                          )}
                          {reg.createdAt && (
                            <span className="text-[10px] text-gray-400">
                              {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 6: ENQUIRIES
              ========================================================================= */}
          {activeTab === "inquiries" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span>Contact & Spiritual Inquiries</span>
                </h2>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
                  Total: {inquiries.length}
                </span>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-4 bg-amber-50/50 rounded-xl">No inquiries recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 rounded-2xl border border-gray-200 space-y-1.5 bg-stone-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{inq.fullName || inq.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">📱 {inq.phone} • ✉️ {inq.email}</p>
                      <p className="text-xs font-bold text-amber-950">Subject: {inq.subject}</p>
                      <p className="text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-100">{inq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          MODAL 1: EDIT QUIZ AUDIO SETTINGS (Requirement 2)
          ========================================================================= */}
      {editingQuizAudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border-2 border-amber-400 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">Custom Audio Settings</h3>
                <p className="text-xs text-amber-800 font-semibold">{editingQuizAudio.title?.en}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuizAudio(null)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Background Music */}
            <div className="space-y-1 bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800">Background Music</label>
                <button
                  type="button"
                  onClick={() => togglePlayAudioPreview(editBgMusicUrl, editBgMusicVolume)}
                  className="text-xs font-bold text-amber-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {playingPreviewUrl === editBgMusicUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingPreviewUrl === editBgMusicUrl ? "Stop" : "Test Audio"}</span>
                </button>
              </div>
              <select
                value={editBgMusicUrl}
                onChange={(e) => setEditBgMusicUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white"
              >
                <option value="/audio/bg-music.mp3">Divine Flute (Default)</option>
                <option value="https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3">Sacred Sitar & Bells</option>
                <option value="https://assets.mixkit.co/music/preview/mixkit-meditation-flute-247.mp3">Ambient Flute</option>
              </select>
              <div className="pt-1">
                <label className="text-[10px] text-gray-500 font-semibold block">Or Upload MP3/WAV from Computer:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "edit-bg")}
                  className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-amber-100 file:text-amber-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Answer Sound */}
            <div className="space-y-1 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900">Right Answer Sound</label>
                <button
                  type="button"
                  onClick={() => togglePlayAudioPreview(editCorrectSoundUrl)}
                  className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {playingPreviewUrl === editCorrectSoundUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingPreviewUrl === editCorrectSoundUrl ? "Stop" : "Test Sound"}</span>
                </button>
              </div>
              <select
                value={editCorrectSoundUrl}
                onChange={(e) => setEditCorrectSoundUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white"
              >
                <option value="/audio/correct.mp3">Harinam Chime (Default)</option>
                <option value="https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3">Temple Bell Ding</option>
                <option value="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3">Celestial Flute Note</option>
              </select>
              <div className="pt-1">
                <label className="text-[10px] text-gray-500 font-semibold block">Or Upload Sound File:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "edit-correct")}
                  className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-emerald-100 file:text-emerald-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Wrong Answer Sound */}
            <div className="space-y-1 bg-rose-50/60 p-3 rounded-2xl border border-rose-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-900">Wrong Answer Sound</label>
                <button
                  type="button"
                  onClick={() => togglePlayAudioPreview(editWrongSoundUrl)}
                  className="text-xs font-bold text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {playingPreviewUrl === editWrongSoundUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingPreviewUrl === editWrongSoundUrl ? "Stop" : "Test Sound"}</span>
                </button>
              </div>
              <select
                value={editWrongSoundUrl}
                onChange={(e) => setEditWrongSoundUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white"
              >
                <option value="/audio/wrong.mp3">Soft Temple Gong (Default)</option>
                <option value="https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3">Deep Resonance Bell</option>
                <option value="https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3">Low Meditation Tone</option>
              </select>
              <div className="pt-1">
                <label className="text-[10px] text-gray-500 font-semibold block">Or Upload Sound File:</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0], "edit-wrong")}
                  className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-rose-100 file:text-rose-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-gray-700">Volume: {Math.round(editBgMusicVolume * 100)}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={editBgMusicVolume}
                onChange={(e) => setEditBgMusicVolume(parseFloat(e.target.value))}
                className="w-48 accent-amber-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingQuizAudio(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuizAudio}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer"
              >
                Save Audio for this Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD/EDIT ONGOING COURSE & LIVE CLASS (Requirement 4)
          ========================================================================= */}
      {showOngoingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 border-2 border-amber-400 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>{editingOngoingId ? "Edit Ongoing Course" : "Add New Ongoing Course"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowOngoingModal(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={ongoingTitleEn}
                  onChange={(e) => setOngoingTitleEn(e.target.value)}
                  placeholder="e.g. Bhagavad-gītā Unveiled"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title (Hindi)</label>
                <input
                  type="text"
                  value={ongoingTitleHi}
                  onChange={(e) => setOngoingTitleHi(e.target.value)}
                  placeholder="e.g. श्रीमद्भगवद्गीता का रहस्य"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Instructor / Speaker</label>
                <input
                  type="text"
                  value={ongoingInstructor}
                  onChange={(e) => setOngoingInstructor(e.target.value)}
                  placeholder="e.g. H.G. Gauranga Das"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Date / Day</label>
                <input
                  type="text"
                  value={ongoingDate}
                  onChange={(e) => setOngoingDate(e.target.value)}
                  placeholder="e.g. Every Sunday"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Timing</label>
                <input
                  type="text"
                  value={ongoingTime}
                  onChange={(e) => setOngoingTime(e.target.value)}
                  placeholder="06:00 PM – 07:30 PM IST"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attendance Mode</label>
                <select
                  value={ongoingMode}
                  onChange={(e) => setOngoingMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  <option value="Both">Both (Online + Offline)</option>
                  <option value="Online">Online Only</option>
                  <option value="Offline">Offline Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={ongoingStatus}
                  onChange={(e) => setOngoingStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pricing Access</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      checked={!ongoingIsPaid}
                      onChange={() => setOngoingIsPaid(false)}
                    />
                    <span>Free Access</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      checked={ongoingIsPaid}
                      onChange={() => setOngoingIsPaid(true)}
                    />
                    <span>Paid Masterclass</span>
                  </label>
                </div>
              </div>
              {ongoingIsPaid && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fee Amount</label>
                  <input
                    type="text"
                    value={ongoingPrice}
                    onChange={(e) => setOngoingPrice(e.target.value)}
                    placeholder="e.g. ₹499"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description (English)</label>
              <textarea
                rows={3}
                value={ongoingDescEn}
                onChange={(e) => setOngoingDescEn(e.target.value)}
                placeholder="Overview of this weekly course or masterclass..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={ongoingImage}
                onChange={(e) => setOngoingImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowOngoingModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOngoingCourse}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer"
              >
                Save Ongoing Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD/EDIT LMS COURSE
          ========================================================================= */}
      {showLmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 border-2 border-amber-400 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <span>{editingLmsId ? "Edit LMS Video Course" : "Add New LMS Video Course"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLmsModal(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (English) *</label>
                <input
                  type="text"
                  value={lmsTitleEn}
                  onChange={(e) => setLmsTitleEn(e.target.value)}
                  placeholder="e.g. Science of Self-Realization"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (Hindi)</label>
                <input
                  type="text"
                  value={lmsTitleHi}
                  onChange={(e) => setLmsTitleHi(e.target.value)}
                  placeholder="e.g. आत्म-साक्षात्कार का विज्ञान"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Difficulty Level</label>
                <select
                  value={lmsLevel}
                  onChange={(e) => setLmsLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Total Duration</label>
                <input
                  type="text"
                  value={lmsDuration}
                  onChange={(e) => setLmsDuration(e.target.value)}
                  placeholder="e.g. 4 Hours"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lesson Count</label>
                <input
                  type="text"
                  value={lmsLessons}
                  onChange={(e) => setLmsLessons(e.target.value)}
                  placeholder="e.g. 8 Lessons"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description (English)</label>
              <textarea
                rows={3}
                value={lmsDescEn}
                onChange={(e) => setLmsDescEn(e.target.value)}
                placeholder="Course summary and learning outcomes..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLmsModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLmsCourse}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer"
              >
                Save LMS Course
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
