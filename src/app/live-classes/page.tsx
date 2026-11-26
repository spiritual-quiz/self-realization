"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Clock, MapPin, Sparkles, User, Users, Award, ArrowRight } from "lucide-react";
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
    description: {
      en: "A systematic chapter-by-chapter exploration of the Bhagavad-gītā with practical modern applications.",
      hi: "दैनिक जीवन में श्रीमद्भगवद्गीता के अमर सूत्रों का अध्यायवार व्यावहारिक अध्ययन।"
    },
    image: "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png",
    isPaid: false,
    date: "Dec 17, 2026",
    time: "06:00 PM – 07:30 PM IST",
    hours: "280 Hours",
    mode: "Temple Hall & Zoom Stream",
    venue: "ISKCON NVCC Temple, Katraj-Kondhwa Road",
    roomNumber: "Hall 204 (2nd Floor)",
    whatsappGroupUrl: "https://chat.whatsapp.com/GitaWisdomSelfRealization",
    instructor: "H.G. Gauranga Das",
  },
  {
    id: "class-wed-meditation",
    title: {
      en: "Mantra Meditation & Mind Control Workshop",
      hi: "मंत्र ध्यान एवं मन-नियंत्रण कार्यशाला"
    },
    description: {
      en: "Mastering concentration and stress relief through the sacred vibration of the Hare Kṛṣṇa Mahā-Mantra.",
      hi: "हरे कृष्ण महामंत्र के दिव्य कंपन द्वारा मानसिक शांति, एकाग्रता और तनाव-मुक्ति का अभ्यास।"
    },
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    isPaid: false,
    date: "Dec 20, 2026",
    time: "07:30 PM – 08:30 PM IST",
    hours: "12 Hours",
    mode: "Interactive Online Zoom",
    venue: "Online Global Classroom",
    roomNumber: "Zoom Room A",
    whatsappGroupUrl: "https://chat.whatsapp.com/MantraMeditationGroup",
    instructor: "H.G. Radheshyam Das",
  },
  {
    id: "class-sat-youth",
    title: {
      en: "VOICE Youth Forum: Focus, Purpose & Spiritual Life",
      hi: "युवा मंच (VOICE): एकाग्रता, जीवन का उद्देश्य और साधना"
    },
    description: {
      en: "Dynamic discussion circles for students & professionals on conquering bad habits, building character, and developing strong values.",
      hi: "युवाओं और कामकाजी पेशेवरों हेतु चरित्र निर्माण, बुरी आदतों पर विजय और जीवन उद्देश्य की खोज।"
    },
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=800&q=80",
    isPaid: false,
    date: "Every Saturday",
    time: "06:30 PM – 08:00 PM IST",
    hours: "36 Hours",
    mode: "NVCC Youth Center & Online",
    venue: "NVCC Youth Center Building",
    roomNumber: "Seminar Hall B",
    whatsappGroupUrl: "https://chat.whatsapp.com/VoiceYouthPune",
    instructor: "Resident Monks & Youth Mentors",
  },
  {
    id: "class-seminar-leadership",
    title: {
      en: "Vedic Wisdom for Modern Professionals (Leadership & Ethics)",
      hi: "आधुनिक पेशेवरों के लिए वैदिक नेतृत्व एवं कार्यकुशलता सूत्र"
    },
    description: {
      en: "An executive 3-hour masterclass decoding strategic leadership, decision-making integrity, and burnout resilience.",
      hi: "कॉर्पोरेट पेशेवरों हेतु तनाव-मुक्त कार्यकुशलता और निर्णय क्षमता का शास्त्रीय सूत्र।"
    },
    image: "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg",
    isPaid: true,
    price: "₹499",
    date: "Dec 25, 2026",
    time: "05:00 PM – 08:00 PM IST",
    hours: "3 Hours Intensive",
    mode: "Special 3-Hour Interactive Masterclass",
    venue: "Executive Conference Hall, ISKCON NVCC",
    roomNumber: "Conference Hall 1",
    whatsappGroupUrl: "https://chat.whatsapp.com/VedicLeadershipGroup",
    instructor: "Dr. Sumit Sharma (IIT-B Alumnus)",
  },
  {
    id: "class-seminar-relationships",
    title: {
      en: "Harmonious Relationships: Bhagavad-gītā in Family Life",
      hi: "पारिवारिक सद्भाव: गृहस्थ जीवन में भगवद्गीता के सिद्धांत"
    },
    description: {
      en: "Deepening empathy, resolving misunderstandings, and fostering a devotional home atmosphere.",
      hi: "पारिवारिक रिश्तों में मधुरता, समझ और आध्यात्मिक वातावरण निर्माण के व्यावहारिक सूत्र।"
    },
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    isPaid: true,
    price: "₹399",
    date: "Jan 05, 2027",
    time: "06:00 PM – 08:30 PM IST",
    hours: "6 Hours (2 Days)",
    mode: "Special Family Counseling & Q&A",
    venue: "Satsang Bhavan, ISKCON NVCC",
    roomNumber: "Room 102",
    whatsappGroupUrl: "https://chat.whatsapp.com/GitaFamilyLifeGroup",
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
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-emerald-500/30 shadow-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "सभी कक्षाएं" : "All Classes"} ({classList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("free")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === "free"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "निःशुल्क साप्ताहिक" : "Weekly Free"}
          </button>
          <button
            type="button"
            onClick={() => setFilter("paid")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === "paid"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-700 hover:text-emerald-700"
            }`}
          >
            {language === "hi" ? "विशेष सेमिनार" : "Special Seminars"}
          </button>
        </div>
      </div>

      {/* Courses Cards Grid (Matching Exact Uploaded Reference Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-b from-white via-white to-emerald-50/20 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* 1. Header Image Banner (Aspect 16:9 like reference) */}
              <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-slate-950 via-teal-950 to-stone-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"}
                  alt={item.title[language] || item.title.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-emerald-300 border border-emerald-400/30 uppercase tracking-wider shadow-sm">
                  SelfRealization Academy
                </div>
              </div>

              {/* 2. Card Content Body */}
              <div className="p-5 sm:p-6 space-y-3">
                
                {/* Course Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {item.title[language] || item.title.en}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description ? (item.description[language] || item.description.en) : "A detailed study of Vedic philosophy, devotional lifestyle, and Bhagavad-gita wisdom."}
                </p>

                {/* Speaker & Paid/Free Badge */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    By {item.instructor}
                  </p>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      item.isPaid
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {item.isPaid ? "PAID" : "FREE"}
                  </span>
                </div>

                {/* Hours & Start Date Row */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">{item.hours || "280 Hours"}</span>
                  <span className="text-sky-600 font-bold">Start date - {item.date}</span>
                </div>

                {/* Certificate Badge */}
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Certificate Course</span>
                </div>

                {/* Venue & Room Details */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.venue || "ISKCON NVCC Temple Hall"}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pl-5">
                    <span>Room: <strong>{item.roomNumber || "Hall 204"}</strong></span>
                    <span>Mode: <strong>{item.mode}</strong></span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Enroll Action Button with Color Hover Transition matching Quiz button */}
            <div className="p-5 sm:p-6 pt-0">
              <button
                type="button"
                onClick={() => setSelectedClass(item)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-black text-sky-900 bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-400 hover:from-emerald-600 hover:to-teal-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
