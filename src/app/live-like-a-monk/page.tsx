"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Compass, ExternalLink, CheckCircle2, Clock, MapPin, Heart, Sparkles } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function LiveLikeAMonkPage() {
  const { t, language } = useLanguage();

  const monkTracks = [
    {
      title: language === "hi" ? "कार्यरत पेशेवर (Working Professionals)" : "Working Professionals Track",
      desc: language === "hi" 
        ? "नौकरी के साथ-साथ प्रातःकालीन मंगला आरती, जप साधना एवं सप्ताहांत मंदिर सेवा का संतुलन।"
        : "Balance professional work with early morning sadhana, evening sanga, and weekend temple seva.",
      tag: "Flexible"
    },
    {
      title: language === "hi" ? "मंदिर स्वयंसेवक (Temple Volunteers)" : "Temple Volunteers Track",
      desc: language === "hi"
        ? "मंदिर के विभिन्न विभागों में निष्काम सेवा, ग्रंथ वितरण एवं भक्तों के संग में आध्यात्मिक प्रगति।"
        : "Immerse in selfless temple seva, book distribution, and deep association with resident monks.",
      tag: "Full Immersion"
    },
    {
      title: language === "hi" ? "ब्रह्मचर्य आश्रम प्रशिक्षण (Aspiring Celibates)" : "Ashram Training & Celibacy Track",
      desc: language === "hi"
        ? "आजीवन संन्यास एवं प्रचारक जीवन हेतु व्यवस्थित शास्त्रीय अध्ययन, गुरुकुल अनुशासन एवं साधना।"
        : "Formal gurukula training, Vedabase study, and personal screening for dedicated spiritual life.",
      tag: "Dedicated"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>{language === "hi" ? "आवासीय गुरुकुल प्रशिक्षण" : "Residential Gurukul Training Course"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          Live Like a Monk
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi"
            ? "इस्कॉन एनवीसीसी पुणे (ISKCON NVCC Pune) में मंदिर आश्रम जीवन की पावन शांति और अनुशासन का प्रत्यक्ष अनुभव करें।"
            : "Experience the profound tranquility, discipline, and devotional joy of resident temple life at ISKCON NVCC Pune."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Hero Showcase Card */}
      <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-amber-800/60 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
            {language === "hi" ? "समर्पित आधिकारिक पोर्टल" : "Dedicated Official Portal"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
            {language === "hi"
              ? "आवासीय गुरुकुल प्रशिक्षण पाठ्यक्रम"
              : "Residential Gurukul Training Course"}
          </h2>
          <p className="text-sm text-amber-200/80 leading-relaxed">
            {language === "hi"
              ? "पात्रता, दैनिक कार्यक्रम, आहार, डिजिटल अनुशासन एवं ऑनलाइन आवेदन के लिए हमारी आधिकारिक समर्पित वेबसाइट पर पधारें।"
              : "Explore eligibility rules, daily temple timetable, dietary guidelines, and submit your application on our dedicated platform."}
          </p>

          <div className="pt-2">
            <a
              href="https://live-like-a-monk.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-all"
            >
              <span>{language === "hi" ? "Live Like a Monk वेबसाइट खोलें" : "Visit Live Like a Monk Website"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="w-full md:w-5/12 bg-white/10 rounded-2xl p-6 border border-white/15 backdrop-blur-md space-y-3 text-xs sm:text-sm text-amber-100">
          <p className="font-bold text-amber-300 text-sm mb-1">
            {language === "hi" ? "आश्रम की दैनिक रूपरेखा" : "Daily Ashram Timetable"}
          </p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>04:30 AM — Maṅgala Ārati & Tulasi Pūjā</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>05:15 AM — Japa Meditation (Hare Kṛṣṇa Mahā-Mantra)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>07:30 AM — Śrīmad-Bhāgavatam Class</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>08:30 AM — Satvik Prasadam Breakfast</span>
          </div>
        </div>
      </div>

      {/* 3 Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {monkTracks.map((trk, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-3"
          >
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
              {trk.tag}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{trk.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{trk.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
