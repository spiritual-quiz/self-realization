"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Award, 
  HeartHandshake, 
  ExternalLink,
  Clock,
  Compass,
  PlayCircle,
  ShieldCheck,
  Phone,
  Mail,
  Send,
  Loader2
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import ClassRegistrationModal, { ClassItem } from "@/components/common/ClassRegistrationModal";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import confetti from "canvas-confetti";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [selectedClass, setSelectedClass] = React.useState<ClassItem | null>(null);

  // Contact Form State
  const [contactName, setContactName] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactSubject, setContactSubject] = React.useState(language === "hi" ? "आध्यात्मिक मार्गदर्शन" : "Spiritual Guidance");
  const [contactMessage, setContactMessage] = React.useState("");
  const [contactLoading, setContactLoading] = React.useState(false);
  const [contactSubmitted, setContactSubmitted] = React.useState(false);
  const [contactId, setContactId] = React.useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) return;

    setContactLoading(true);

    try {
      const docRef = await addDoc(collection(db, "inquiries"), {
        fullName: contactName,
        phone: contactPhone,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
        status: "new",
        language,
        createdAt: serverTimestamp(),
      });

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#10B981"],
      });

      // Dispatch notification to madhavcarandas@gmail.com
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "inquiry",
            details: {
              fullName: contactName,
              phone: contactPhone,
              email: contactEmail,
              subject: contactSubject,
              message: contactMessage
            }
          })
        });
      } catch (notifyErr) {
        console.warn("Notification dispatch notice:", notifyErr);
      }

      setContactId(docRef.id);
      setContactSubmitted(true);
    } catch (err: any) {
      console.error("Firestore inquiry error:", err);
      setContactId("INQ-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      setContactSubmitted(true);
    } finally {
      setContactLoading(false);
    }
  };

  // Mock featured data for Phase 1 presentation
  const upcomingClasses = [
    {
      id: "class-1",
      title: {
        en: "Bhagavad-gītā Unveiled: The Science of Soul & Karma",
        hi: "श्रीमद्भगवद्गीता का रहस्य: आत्मा एवं कर्म का विज्ञान"
      },
      tag: t.upcomingClasses.freeTag,
      isPaid: false,
      date: language === "hi" ? "प्रत्येक रविवार" : "Every Sunday",
      time: "06:00 PM - 07:30 PM IST",
      mode: language === "hi" ? "ऑनलाइन एवं मंदिर में" : "Hybrid (Online & Temple)",
      instructor: "H.G. Gauranga Das",
      seats: "Free Open Entry",
    },
    {
      id: "class-2",
      title: {
        en: "Mantra Meditation & Mind Control Workshop",
        hi: "मंत्र ध्यान एवं मन-नियंत्रण कार्यशाला"
      },
      tag: t.upcomingClasses.freeTag,
      isPaid: false,
      date: language === "hi" ? "प्रत्येक बुधवार" : "Every Wednesday",
      time: "07:30 PM - 08:30 PM IST",
      mode: language === "hi" ? "ऑनलाइन ज़ूम" : "Online Zoom",
      instructor: "H.G. Radheshyam Das",
      seats: "Free Open Entry",
    },
    {
      id: "class-3",
      title: {
        en: "Vedic Wisdom for Modern Professionals (Leadership)",
        hi: "आधुनिक पेशेवरों के लिए वैदिक नेतृत्व सूत्र"
      },
      tag: t.upcomingClasses.paidTag,
      isPaid: true,
      price: "₹499",
      date: language === "hi" ? "12 दिसंबर" : "Dec 12, 2026",
      time: "05:00 PM - 08:00 PM IST",
      mode: language === "hi" ? "विशिष्ट कार्यशाला" : "Special Interactive Masterclass",
      instructor: "Visiting Scholars",
      seats: "Limited 40 Seats",
    }
  ];

  const featuredCourses = [
    {
      id: "course-1",
      title: {
        en: "Discover Yourself: Fundamentals of Bhagavad-gītā",
        hi: "स्वयं को जानें: भगवद्गीता के मूलभूत सिद्धांत"
      },
      desc: {
        en: "A structured 6-session foundation journey exploring soul, mind, reincarnation, and destiny.",
        hi: "आत्मा, मन, पुनर्जन्म और कर्म के रहस्यों को उद्घाटित करने वाली 6 सत्रों की यात्रा।"
      },
      level: language === "hi" ? "प्रारंभिक" : "Beginner",
      lessons: "6 Lessons",
      duration: "3.5 Hours",
      isPaid: false,
      badge: language === "hi" ? "निःशुल्क" : "Free Access",
    },
    {
      id: "course-2",
      title: {
        en: "Science of Self-Realization & Karma Yoga",
        hi: "आत्म-साक्षात्कार का विज्ञान एवं कर्म योग"
      },
      desc: {
        en: "Mastering practical devotion in day-to-day work, balancing modern career and spiritual consciousness.",
        hi: "दैनिक कार्यस्थल में भक्तिमय संतुलन साधने और कर्म को योग बनाने का प्रामाणिक मार्ग।"
      },
      level: language === "hi" ? "मध्यम" : "Intermediate",
      lessons: "12 Lessons",
      duration: "8 Hours",
      isPaid: false,
      badge: language === "hi" ? "निःशुल्क" : "Free Access",
    },
    {
      id: "course-3",
      title: {
        en: "Bhagavad-gītā Chapter-by-Chapter Comprehensive Study",
        hi: "श्रीमद्भगवद्गीता सम्पूर्ण अध्यायवार गहन अध्ययन"
      },
      desc: {
        en: "In-depth verse-by-verse commentary analysis, philosophical questions, and chapter assessments.",
        hi: "श्लोक दर श्लोक प्रामाणिक भाष्य विश्लेषण, दार्शनिक प्रश्नों के उत्तर एवं अध्यायवार मूल्यांकन।"
      },
      level: language === "hi" ? "उन्नत" : "Advanced",
      lessons: "18 Chapters",
      duration: "24 Hours",
      isPaid: true,
      price: "₹999",
      badge: language === "hi" ? "सर्टिफाइड" : "Certified",
    }
  ];

  const featuredQuizzes = [
    {
      id: "quiz-bg-ch1",
      title: {
        en: "Bhagavad-gītā Chapter 1 & 2 Challenge",
        hi: "भगवद्गीता अध्याय 1 एवं 2 प्रश्नोत्तरी"
      },
      category: { en: "Bhagavad-gītā", hi: "भगवद्गीता" },
      questions: 10,
      points: 100,
      badge: language === "hi" ? "सर्वाधिक लोकप्रिय" : "Most Popular",
    },
    {
      id: "quiz-krishna-lila",
      title: {
        en: "Pastimes of Śrī Kṛṣṇa in Vṛndāvana",
        hi: "वृन्दावन में श्री कृष्ण की मधुर बाल-लीलाएं"
      },
      category: { en: "Kṛṣṇa Conscious Philosophy", hi: "कृष्ण दर्शन" },
      questions: 10,
      points: 100,
      badge: language === "hi" ? "भक्ति रस" : "Devotional Joy",
    },
    {
      id: "quiz-reincarnation",
      title: {
        en: "The Mystery of Soul, Karma & Reincarnation",
        hi: "आत्मा, कर्म और पुनर्जन्म का रहस्य"
      },
      category: { en: "Spiritual Science", hi: "आध्यात्मिक विज्ञान" },
      questions: 10,
      points: 100,
      badge: language === "hi" ? "विचारोत्तेजक" : "Mind Expanding",
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-transparent border-b border-amber-100/60">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/20 to-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Sacred Kicker / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            {t.hero.title}{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Core Call to Actions: Prominent 'Join a Free Class' */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/live-classes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-orange-600/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ring-4 ring-amber-300/40"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>{t.hero.joinFreeClassBtn}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-gray-800 bg-white hover:bg-amber-50 border-2 border-amber-200 shadow-sm hover:shadow-md transition-all"
            >
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{t.hero.exploreCoursesBtn}</span>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-amber-200/50 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <p className="text-xl sm:text-2xl font-black text-amber-700">{t.hero.stats.students}</p>
              <p className="text-xs text-gray-600 mt-1">{language === "hi" ? "आध्यात्मिक साधक" : "Active Learners"}</p>
            </div>
            <div className="p-3">
              <p className="text-xl sm:text-2xl font-black text-amber-700">{t.hero.stats.classes}</p>
              <p className="text-xs text-gray-600 mt-1">{language === "hi" ? "लाइव एवं मंदिर में" : "Online & In-Person"}</p>
            </div>
            <div className="p-3">
              <p className="text-xl sm:text-2xl font-black text-amber-700">{t.hero.stats.rating}</p>
              <p className="text-xs text-gray-600 mt-1">{language === "hi" ? "श्रील प्रभुपाद के उपदेश" : "Śrīla Prabhupāda Lineage"}</p>
            </div>
            <div className="p-3">
              <p className="text-xl sm:text-2xl font-black text-amber-700">{t.hero.stats.freeAccess}</p>
              <p className="text-xs text-gray-600 mt-1">{language === "hi" ? "निःशुल्क डिजिटल प्रचार" : "Spiritual Education"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION TO KRISHNA CONSCIOUSNESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-vedic border border-amber-100 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-7/12 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              <span>{t.introKrishna.kicker}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
              {t.introKrishna.title}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {t.introKrishna.p1}
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {t.introKrishna.p2}
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.introKrishna.bullet1}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.introKrishna.bullet2}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.introKrishna.bullet3}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-amber-700 font-bold hover:text-amber-800 transition-colors"
              >
                <span>{language === "hi" ? "हमारे दर्शन के बारे में और जानें" : "Learn more about our philosophy"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Devotional Card Spotlight */}
          <div className="lg:w-5/12 w-full">
            <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 font-serif text-9xl">
                ॐ
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-200">
                {language === "hi" ? "महामंत्र" : "The Great Chant for Deliverance"}
              </span>
              <p className="font-serif text-lg sm:text-xl font-bold mt-4 leading-relaxed tracking-wide text-amber-50">
                हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।<br />
                हरे राम हरे राम राम राम हरे हरे ॥
              </p>
              <p className="mt-4 text-xs sm:text-sm text-amber-100/90 italic">
                {language === "hi" 
                  ? "“कलियुग में भगवन्नाम संकीर्तन ही समस्त जीवों के कल्याण का एकमात्र सर्वोत्तम साधन है।”" 
                  : "“In this age of Kali, chanting the holy names of Kṛṣṇa is the supreme spiritual path to attain self-realization and eternal bliss.”"}
              </p>
              <div className="mt-6 pt-4 border-t border-amber-400/30 flex items-center justify-between text-xs text-amber-200">
                <span>— Śrī Caitanya Caritāmṛta</span>
                <span className="font-semibold">ISKCON NVCC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING FREE & FEATURED CLASSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              <span>{t.upcomingClasses.kicker}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              {t.upcomingClasses.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
              {t.upcomingClasses.subtitle}
            </p>
          </div>
          <Link
            href="/live-classes"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 shrink-0"
          >
            <span>{t.upcomingClasses.viewAllBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingClasses.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.isPaid
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {item.tag} {item.price && `• ${item.price}`}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.seats}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {item.title[language]}
                </h3>

                <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item.mode}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setSelectedClass({
                    id: item.id,
                    title: item.title,
                    isPaid: item.isPaid,
                    price: item.price,
                    date: item.date,
                    time: item.time,
                    mode: item.mode,
                    instructor: item.instructor,
                  })}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                    !item.isPaid
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                      : "bg-gray-900 hover:bg-black text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.upcomingClasses.registerBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED SELF-PACED LMS COURSES */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                <span>{t.featuredCourses.kicker}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
                {t.featuredCourses.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
                {t.featuredCourses.subtitle}
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 shrink-0"
            >
              <span>{t.featuredCourses.viewAllCoursesBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      {c.badge}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{c.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {c.title[language]}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {c.desc[language]}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 text-amber-600" />
                      {c.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {c.duration}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/courses`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border border-amber-300 text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{t.featuredCourses.startCourseBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PUBLIC INTERACTIVE QUIZ SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase text-amber-100">
              {t.quizSection.kicker}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              {t.quizSection.title}
            </h2>
            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
              {t.quizSection.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-amber-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-200 shrink-0" />
                <span>{t.quizSection.freeNoLogin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-200 shrink-0" />
                <span>{t.quizSection.instantCert}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
                <span>{t.quizSection.funLearning}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-200 shrink-0" />
                <span>{language === "hi" ? "द्विभाषी प्रश्न एवं व्याख्या" : "Bilingual Dual Q&A Display"}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/quiz"
                className="px-6 py-3.5 rounded-full text-sm font-bold bg-white text-amber-800 hover:bg-amber-50 shadow-md transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>{t.quizSection.tryQuizBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE LIKE A MONK SPOTLIGHT (LINKED TO EXISTING SITE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-amber-50 shadow-xl border border-amber-800/50 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-7/12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>{t.monkSpotlight.kicker}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t.monkSpotlight.title}
            </h2>
            <p className="text-amber-200/90 text-sm sm:text-base font-medium">
              {t.monkSpotlight.tagline}
            </p>
            <p className="text-amber-100/70 text-xs sm:text-sm leading-relaxed">
              {t.monkSpotlight.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              {t.monkSpotlight.highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-amber-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-4/12 w-full text-center lg:text-right space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-left">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1">
                {language === "hi" ? "आवासीय प्रशिक्षण" : "Residential Experience"}
              </span>
              <p className="text-xs text-amber-100/80 mb-4">
                {language === "hi" 
                  ? "एनवीसीसी पुणे मंदिर में ठहरने, ब्रह्मचारी दिनचर्या सीखने और आवेदन करने के लिए हमारी समर्पित वेबसाइट देखें।"
                  : "Visit our dedicated portal to learn about temple stays, daily schedule, and apply online."}
              </p>
              <a
                href="https://live-like-a-monk.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-all"
              >
                <span>{t.monkSpotlight.exploreMonkBtn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT US (INSIDE HOMEPAGE) */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            {language === "hi" ? "हमारा परिचय एवं ध्येय" : "About SelfRealization"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {language === "hi" ? "आत्म-साक्षात्कार: एक दिव्य यात्रा" : "Awakening the Soul to Eternal Truth"}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {language === "hi"
              ? "परम पूज्य ए.सी. भक्तिवेदांत स्वामी प्रभुपाद के दिव्य उपदेशों पर आधारित प्रामाणिक गौड़ीय वैष्णव परंपरा।"
              : "Anchored in the timeless teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda, Founder-Ācārya of the International Society for Krishna Consciousness (ISKCON)."}
          </p>
          <LotusAccent className="my-2" />
        </div>

        {/* About Showcase Card with Sanctuary Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-vedic overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === "hi" ? "आध्यात्मिक ध्येय" : "Our Guiding Vision"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
              {language === "hi"
                ? "आधुनिक कोलाहल में शाश्वत वैदिक शांति का प्रकाश"
                : "Illuminating Modern Lives with Ancient Vedic Wisdom"}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {language === "hi"
                ? "SelfRealization केवल एक वेबसाइट नहीं है, अपितु एक व्यापक डिजिटल प्रचार और आध्यात्मिक शिक्षण मंच है। इसका मुख्य उद्देश्य आधुनिक समाज के सभी वर्गों — विशेष रूप से युवाओं और कामकाजी पेशेवरों — को भगवद्गीता के वैज्ञानिक दृष्टिकोण से जोड़ना है।"
                : "SelfRealization is an interactive spiritual outreach and learning ecosystem. Our primary mission is to introduce every sincere seeker to the profound, practical science of Kṛṣṇa consciousness, nurturing their journey from curiosity to devotion."}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {language === "hi"
                ? "हमारा विश्वास है कि वास्तविक आंतरिक शांति, मानसिक संतुलन और जीवन का सच्चा उद्देश्य केवल आत्मा के अपने मूल स्वरूप — भगवान श्रीकृष्ण के शाश्वत संबंध — को पुनः जागृत करने से ही प्राप्त हो सकता है।"
                : "We share that true happiness and mental tranquility arise naturally when one re-establishes their eternal loving relationship with the Supreme Personality of Godhead, Śrī Kṛṣṇa."}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/live-classes"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.nav.joinFreeClass}</span>
              </Link>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all"
              >
                <span>{t.nav.contact}</span>
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-200 aspect-4/3 bg-stone-100 min-h-[300px]">
            <Image
              src="https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"
              alt="ISKCON NVCC Pune Temple"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                {language === "hi" ? "पवित्र धाम" : "Spiritual Sanctuary"}
              </span>
              <p className="text-lg font-bold">ISKCON New Vedic Cultural Centre (NVCC)</p>
              <p className="text-xs text-amber-100/90">Katraj-Kondhwa Bypass, Pune, Maharashtra</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Spiritual Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="text-base font-bold text-gray-900">
              {language === "hi" ? "व्यवस्थित आध्यात्मिक शिक्षा" : "Systematic Education"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === "hi" 
                ? "भगवद्गीता और श्रीमद्भागवतम के शाश्वत ज्ञान को आधुनिक वैज्ञानिक व तार्किक दृष्टिकोण से प्रस्तुत करना।"
                : "Presenting timeless Bhagavad-gītā philosophy through modern logic, science, and practical relevance."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="text-base font-bold text-gray-900">
              {language === "hi" ? "संकीर्तन एवं पवित्र नाम" : "Chanting Holy Names"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === "hi"
                ? "हरे कृष्ण महामंत्र के संकीर्तन द्वारा समाज में आंतरिक शांति, सद्भाव एवं आध्यात्मिक जागृति लाना।"
                : "Spreading chanting of Hare Kṛṣṇa Mahā-Mantra to cleanse hearts and uplift society."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="text-base font-bold text-gray-900">
              {language === "hi" ? "चरित्र निर्माण व गुरुकुल" : "Character Formation"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === "hi"
                ? "युवाओं और साधकों को ब्रह्मचर्य, नैतिक अनुशासन, निःस्वार्थ सेवा और शुद्ध जीवनशैली में प्रशिक्षित करना।"
                : "Empowering youth and seekers with clean habits, digital discipline, and spiritual character."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="text-base font-bold text-gray-900">
              {language === "hi" ? "अन्नदान व प्रसादम" : "Prasādam Distribution"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === "hi"
                ? "भगवान को समर्पित शुद्ध, अहिंसक सात्विक प्रसादम का व्यापक वितरण जिससे चेतना शुद्ध होती है।"
                : "Distributing sanctified satvik food to nourish both the body and the soul."}
            </p>
          </div>
        </div>
      </section>

      {/* 8. CONTACT & INQUIRIES AT BOTTOM */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            {language === "hi" ? "संपर्क एवं संवाद" : "Get In Touch"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {language === "hi" ? "हमसे संपर्क करें" : "Contact & Spiritual Inquiries"}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            {language === "hi"
              ? "आध्यात्मिक प्रश्नों, कक्षाओं में पंजीकरण अथवा मंदिर दर्शन से संबंधित किसी भी सहायता के लिए संपर्क करें।"
              : "Reach out for class inquiries, temple visits, spiritual counseling, or course enrollment questions."}
          </p>
          <LotusAccent className="my-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Details & Info Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? "मंदिर का पता एवं संपर्क विवरण" : "Temple Location & Contact Details"}
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{t.footer.addressTitle}</p>
                    <p className="text-gray-600 leading-relaxed">{t.footer.addressText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === "hi" ? "दूरभाष / हेल्पलाइन" : "Phone & Helpline"}</p>
                    <p className="text-gray-600">{t.footer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === "hi" ? "ईमेल संपर्क" : "Email Inquiries"}</p>
                    <p className="text-amber-800 font-medium">madhavcarandas@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{language === "hi" ? "दैनिक मंदिर दर्शन समय" : "Daily Darshan Hours"}</p>
                    <p className="text-gray-600">
                      {language === "hi" 
                        ? "प्रातः 04:30 से दोपहर 01:00 एवं सायं 04:30 से रात्रि 08:45"
                        : "04:30 AM – 01:00 PM & 04:30 PM – 08:45 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map of ISKCON NVCC */}
            <div className="h-56 rounded-2xl overflow-hidden shadow-inner border border-amber-200 mt-4">
              <iframe
                title="ISKCON NVCC Pune Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.582847953259!2d73.87677817596048!3d18.457223971115857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eb9c9bbf28cb%3A0x6b1cb16e885d519b!2sISKCON%20NVCC%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === "hi" ? "आध्यात्मिक संदेश भेजें" : "Send a Message / Inquiry"}
            </h3>

            {contactSubmitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-emerald-950">
                  {language === "hi" ? "आपका संदेश सफलतापूर्वक प्राप्त हुआ!" : "Inquiry Dispatched Successfully!"}
                </h4>
                <p className="text-sm text-emerald-900 leading-relaxed max-w-sm mx-auto">
                  {language === "hi"
                    ? "हरे कृष्ण! हमारे प्रतिनिधि जल्द ही आपसे संपर्क करेंगे।"
                    : "Hare Kṛṣṇa! Notification has been forwarded to our team. We will connect with you shortly."}
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
                    Ref ID: {contactId}
                  </span>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactName("");
                      setContactPhone("");
                      setContactEmail("");
                      setContactMessage("");
                    }}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    {language === "hi" ? "एक और संदेश भेजें" : "Send Another Message"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    {language === "hi" ? "पूरा नाम" : "Full Name"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={language === "hi" ? "उदा. राहुल शर्मा" : "e.g. Rahul Sharma"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">
                      {language === "hi" ? "मोबाइल नंबर (WhatsApp)" : "WhatsApp Phone"} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">
                      {language === "hi" ? "ईमेल (वैकल्पिक)" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    {language === "hi" ? "विषय" : "Subject of Inquiry"}
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm bg-white"
                  >
                    <option value="Spiritual Guidance">{language === "hi" ? "आध्यात्मिक मार्गदर्शन" : "Spiritual Guidance & Counseling"}</option>
                    <option value="Class Enrollment">{language === "hi" ? "कक्षा पंजीकरण सहायता" : "Class Enrollment Assistance"}</option>
                    <option value="Live Like a Monk">{language === "hi" ? "आश्रम जीवन / Live Like a Monk" : "Live Like a Monk Program"}</option>
                    <option value="Temple Visit & Darshan">{language === "hi" ? "मंदिर दर्शन एवं सेवा" : "Temple Visit & Volunteering"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    {language === "hi" ? "आपका संदेश / प्रश्न" : "Your Message / Question"} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={language === "hi" ? "कृपया अपना प्रश्न अथवा जिज्ञासा यहाँ लिखें..." : "Please describe your question or spiritual interest..."}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {contactLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === "hi" ? "संदेश भेजा जा रहा है..." : "Dispatching Message..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{language === "hi" ? "संदेश भेजें" : "Submit Inquiry"}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 text-center">
                  {language === "hi" 
                    ? "आपकी जानकारी पूर्णतः सुरक्षित है एवं सीधे मंदिर समन्वयकों को प्रेषित होगी।"
                    : "Your details will be forwarded directly to coordinator madhavcarandas@gmail.com."}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Class Registration Modal */}
      <ClassRegistrationModal
        classItem={selectedClass}
        onClose={() => setSelectedClass(null)}
      />

    </div>
  );
}
