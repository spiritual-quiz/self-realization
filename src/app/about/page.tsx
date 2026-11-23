"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LotusAccent from "@/components/devotional/LotusAccent";
import { CheckCircle2, Heart, BookOpen, Users, Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { t, language } = useLanguage();

  const templeImg = "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png";
  const deityImg = "https://www.iskconpune.com/wp-content/uploads/2023/02/radha-vrindavanchandra-1024x683.jpeg";

  const pillars = [
    {
      num: "01",
      title: language === "hi" ? "आध्यात्मिक ज्ञान का वैज्ञानिक प्रचार" : "Systematic Spiritual Education",
      desc: language === "hi"
        ? "भगवद्गीता और श्रीमद्भागवतम के शाश्वत ज्ञान को आधुनिक वैज्ञानिक व तार्किक दृष्टिकोण से प्रस्तुत करना।"
        : "Presenting timeless Bhagavad-gītā and Śrīmad-Bhāgavatam philosophy through modern logic, science, and practical relevance."
    },
    {
      num: "02",
      title: language === "hi" ? "संकीर्तन एवं पवित्र नाम का प्रसार" : "Chanting the Holy Names (Saṅkīrtana)",
      desc: language === "hi"
        ? "हरे कृष्ण महामंत्र के सामूहिक संकीर्तन द्वारा समाज में आंतरिक शांति, सद्भाव एवं आध्यात्मिक जागृति लाना।"
        : "Spreading congregational chanting of the Hare Kṛṣṇa Mahā-Mantra to cleanse hearts and uplift society."
    },
    {
      num: "03",
      title: language === "hi" ? "चरित्र निर्माण एवं आश्रम प्रशिक्षण" : "Character Formation & Ashram Life",
      desc: language === "hi"
        ? "युवाओं और साधकों को ब्रह्मचर्य, नैतिक अनुशासन, निःस्वार्थ सेवा और शुद्ध जीवनशैली में प्रशिक्षित करना।"
        : "Empowering youth and seekers with clean habits, digital discipline, selfless seva, and spiritual character."
    },
    {
      num: "04",
      title: language === "hi" ? "अन्नदान एवं सात्विक प्रसादम वितरण" : "Prasādam Distribution (Food for Life)",
      desc: language === "hi"
        ? "भगवान को समर्पित शुद्ध, अहिंसक सात्विक प्रसादम का व्यापक वितरण जिससे चेतना शुद्ध होती है।"
        : "Distributing sanctified satvik vegetarian food to nourish both the body and the soul."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "हमारा परिचय एवं ध्येय" : "About SelfRealization"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {language === "hi" ? "आत्म-साक्षात्कार: एक दिव्य यात्रा" : "Awakening the Soul to Eternal Truth"}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {language === "hi"
            ? "परम पूज्य ए.सी. भक्तिवेदांत स्वामी प्रभुपाद के दिव्य उपदेशों पर आधारित प्रामाणिक गौड़ीय वैष्णव परंपरा।"
            : "Anchored in the timeless teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda, Founder-Ācārya of the International Society for Krishna Consciousness (ISKCON)."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      {/* Hero Showcase with Official Deity & Temple Imagery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-vedic overflow-hidden">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            <span>{language === "hi" ? "आध्यात्मिक ध्येय" : "Our Guiding Vision"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
            {language === "hi"
              ? "आधुनिक कोलाहल में शाश्वत वैदिक शांति का प्रकाश"
              : "Illuminating Modern Lives with Ancient Vedic Wisdom"}
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {language === "hi"
              ? "SelfRealization केवल एक वेबसाइट नहीं है, अपितु एक व्यापक डिजिटल प्रचार और आध्यात्मिक शिक्षण मंच है। इसका मुख्य उद्देश्य आधुनिक समाज के सभी वर्गों — विशेष रूप से युवाओं और कामकाजी पेशेवरों — को भगवद्गीता के वैज्ञानिक दृष्टिकोण से जोड़ना है।"
              : "SelfRealization is not a conventional educational website; it is an interactive spiritual outreach ecosystem. Our primary mission is to introduce every sincere seeker to the profound, practical science of Kṛṣṇa consciousness, nurturing their journey from curiosity to devotion."}
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {language === "hi"
              ? "हमारा विश्वास है कि वास्तविक आंतरिक शांति, मानसिक संतुलन और जीवन का सच्चा उद्देश्य केवल आत्मा के अपने मूल स्वरूप — भगवान श्रीकृष्ण के शाश्वत संबंध — को पुनः जागृत करने से ही प्राप्त हो सकता है।"
              : "We teach that true happiness and mental tranquility are not products of material accumulation, but arise naturally when one re-establishes their eternal loving relationship with the Supreme Personality of Godhead, Śrī Kṛṣṇa."}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/live-classes"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.joinFreeClass}</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all"
            >
              <span>{t.nav.contact}</span>
            </Link>
          </div>
        </div>

        {/* Beautiful Temple & Deities Collage */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-200 aspect-4/3 bg-stone-100">
          <Image
            src={templeImg}
            alt="ISKCON NVCC Pune Temple"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
              {language === "hi" ? "पवित्र धाम" : "Spiritual Sanctuary"}
            </span>
            <p className="text-lg font-bold">ISKCON New Vedic Cultural Centre (NVCC)</p>
            <p className="text-xs text-amber-100/90">Katraj-Kondhwa Bypass, Pune, Maharashtra</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Devotional Outreach */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {language === "hi" ? "हमारे चार मुख्य स्तंभ" : "The Four Pillars of Our Outreach"}
          </h2>
          <p className="text-sm text-gray-600">
            {language === "hi" ? "वैदिक संस्कृति के संवर्धन और मानव कल्याण हेतु समर्पित" : "Dedicated to uplifting individual lives and community consciousness"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-7 border border-amber-100 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-serif text-amber-600">{p.num}</span>
                <span className="w-8 h-1 bg-amber-500 rounded-full" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Srila Prabhupada Dedication Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white border border-amber-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-600/30 border-2 border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300 font-serif text-4xl">
          ॐ
        </div>
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Founder-Ācārya
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-50 font-serif">
            His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed italic max-w-3xl">
            “Human life is meant for self-realization. If one simply works hard like the animals for eating, sleeping, mating, and defending, he wastes this valuable opportunity. One must inquire: Who am I? Why am I suffering? What is my ultimate destination?”
          </p>
        </div>
      </div>

    </div>
  );
}
