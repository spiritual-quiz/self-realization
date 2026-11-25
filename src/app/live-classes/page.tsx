"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Clock, MapPin, Sparkles, User, Users } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import ClassRegistrationModal, { ClassItem } from "@/components/common/ClassRegistrationModal";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "class-sunday-gita",
    title: {
      en: "Bhagavad-gītā Unveiled: The Science of Soul & Karma",
      hi: "श्रीमद्भगवद्गीता का रहस्य: आत्मा एवं कर्म का विज्ञान"
    },
    isPaid: false,
    date: "Every Sunday",
    time: "06:00 PM – 07:30 PM IST",
    mode: "Temple Hall & Zoom Stream",
    instructor: "H.G. Gauranga Das",
  },
  {
    id: "class-wed-meditation",
    title: {
      en: "Mantra Meditation & Mind Control Workshop",
      hi: "मंत्र ध्यान एवं मन-नियंत्रण कार्यशाला"
    },
    isPaid: false,
    date: "Every Wednesday",
    time: "07:30 PM – 08:30 PM IST",
    mode: "Interactive Online Zoom",
    instructor: "H.G. Radheshyam Das",
  },
  {
    id: "class-sat-youth",
    title: {
      en: "VOICE Youth Forum: Focus, Purpose & Spiritual Life",
      hi: "युवा मंच (VOICE): एकाग्रता, जीवन का उद्देश्य और साधना"
    },
    isPaid: false,
    date: "Every Saturday",
    time: "06:30 PM – 08:00 PM IST",
    mode: "NVCC Youth Center & Online",
    instructor: "Resident Monks & Youth Mentors",
  },
  {
    id: "class-seminar-leadership",
    title: {
      en: "Vedic Wisdom for Modern Professionals (Leadership & Ethics)",
      hi: "आधुनिक पेशेवरों के लिए वैदिक नेतृत्व एवं कार्यकुशलता सूत्र"
    },
    isPaid: true,
    price: "₹499",
    date: "Dec 12, 2026",
    time: "05:00 PM – 08:00 PM IST",
    mode: "Special 3-Hour Interactive Masterclass",
    instructor: "Dr. Sumit Sharma (IIT-B Alumnus)",
  },
  {
    id: "class-seminar-relationships",
    title: {
      en: "Harmonious Relationships: Bhagavad-gītā in Family Life",
      hi: "पारिवारिक सद्भाव: गृहस्थ जीवन में भगवद्गीता के सिद्धांत"
    },
    isPaid: true,
    price: "₹399",
    date: "Dec 20, 2026",
    time: "06:00 PM – 08:30 PM IST",
    mode: "Special Family Counseling & Q&A",
    instructor: "Senior Grhastha Counselors",
  }
];

export default function LiveClassesPage() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [classList, setClassList] = useState<ClassItem[]>(INITIAL_CLASSES);

  useEffect(() => {
    // 1. Check local storage cache from Admin
    const cached = localStorage.getItem("sr_ongoing_classes");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted: ClassItem[] = parsed.map((item: any) => ({
            id: item.id || `class-${Date.now()}`,
            title: typeof item.title === "object" ? item.title : { en: item.title, hi: item.title },
            isPaid: Boolean(item.isPaid),
            price: item.price || (item.isPaid ? "₹499" : undefined),
            date: item.date || "Every Sunday",
            time: item.time || "06:00 PM IST",
            mode: item.mode || "Online Zoom & Hall",
            instructor: item.instructor || "Resident Faculty",
          }));
          setClassList(formatted);
        }
      } catch (e) {
        console.warn("Could not parse cached classes:", e);
      }
    }

    // 2. Fetch from Firestore
    async function fetchClasses() {
      try {
        const snap = await getDocs(collection(db, "classes"));
        if (!snap.empty) {
          const list: ClassItem[] = [];
          snap.forEach((d) => {
            const data = d.data();
            list.push({
              id: d.id,
              title: typeof data.title === "object" ? data.title : { en: data.title || "Course", hi: data.title || "Course" },
              isPaid: Boolean(data.isPaid),
              price: data.price || (data.isPaid ? "₹499" : undefined),
              date: data.date || "Upcoming",
              time: data.time || "06:00 PM IST",
              mode: data.mode || "Online / Temple Hall",
              instructor: data.instructor || "Vedic Faculty",
            });
          });
          setClassList(list);
          localStorage.setItem("sr_ongoing_classes", JSON.stringify(list));
        }
      } catch (e) {
        // Fallback to local cache or INITIAL_CLASSES
      }
    }
    fetchClasses();
  }, []);

  const filteredClasses = classList.filter((c) => {
    if (filter === "free") return !c.isPaid;
    if (filter === "paid") return c.isPaid;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Page Title & Sacred Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{language === "hi" ? "आध्यात्मिक ज्ञान सत्र" : "Live Interactive Wisdom Sessions"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.nav.classes}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {language === "hi" 
            ? "भगवद्गीता के शाश्वत सूत्रों को अपने दैनिक जीवन में उतारने के लिए हमारे साप्ताहिक निःशुल्क और विशेष गहन सत्रों में भाग लें।"
            : "Connect directly with experienced teachers, ask questions in real time, and cultivate a steady spiritual lifestyle."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === "all"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "सभी कक्षाएं" : "All Classes"} ({classList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("free")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === "free"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "निःशुल्क साप्ताहिक" : "Weekly Free"}
          </button>
          <button
            type="button"
            onClick={() => setFilter("paid")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === "paid"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-900 hover:text-amber-700"
            }`}
          >
            {language === "hi" ? "विशेष सेमिनार" : "Special Seminars"}
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-amber-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.isPaid
                      ? "bg-purple-100 text-purple-900 border border-purple-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {item.isPaid ? `${language === "hi" ? "विशेष" : "Masterclass"} • ${item.price}` : (language === "hi" ? "100% निःशुल्क" : "100% Free Entry")}
                </span>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {item.isPaid ? "40 Seats" : "Open Access"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-amber-700 transition-colors">
                {item.title[language]}
              </h3>

              <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-gray-800">{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.mode}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-amber-800 font-medium">
                  <User className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{language === "hi" ? "प्रवक्ता:" : "Speaker:"} {item.instructor}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSelectedClass(item)}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 ${
                  !item.isPaid
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-500/20"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>
                  {item.isPaid 
                    ? (language === "hi" ? `सीट बुक करें (${item.price})` : `Book Seat (${item.price})`)
                    : (language === "hi" ? "निःशुल्क पंजीकरण करें" : "Register For Free")}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal connected to Firestore */}
      <ClassRegistrationModal
        classItem={selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  );
}
