"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import LotusAccent from "@/components/devotional/LotusAccent";
import { CheckCircle2, Heart, BookOpen, Users, Compass } from "lucide-react";

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "हमारा परिचय एवं ध्येय" : "About SelfRealization"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t.nav.about}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi"
            ? "परम पूज्य ए.सी. भक्तिवेदांत स्वामी प्रभुपाद के दिव्य उपदेशों पर आधारित प्रामाणिक गौड़ीय वैष्णव परंपरा।"
            : "Anchored in the timeless teachings of His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda, Founder-Ācārya of ISKCON."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-sm space-y-8">
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
          <p>
            {language === "hi"
              ? "SelfRealization केवल एक वेबसाइट नहीं है, अपितु एक व्यापक डिजिटल प्रचार और आध्यात्मिक शिक्षण मंच है। इसका मुख्य उद्देश्य आधुनिक समाज के सभी वर्गों — विशेष रूप से युवाओं और पेशेवरों — को भगवद्गीता के वैज्ञानिक दृष्टिकोण से परिचित कराना है।"
              : "SelfRealization is not merely a website; it is an integrated digital outreach and spiritual learning platform designed to connect modern seekers with the sublime, scientific wisdom of Bhagavad-gītā."}
          </p>
          <p>
            {language === "hi"
              ? "हमारा विश्वास है कि वास्तविक शांति, मानसिक स्थिरता और जीवन का सच्चा आनंद केवल आत्मा के अपने मूल स्वरूप — भगवान श्रीकृष्ण के शाश्वत संबंध — को पुनः जागृत करने से ही प्राप्त हो सकता है।"
              : "We believe that lasting peace, mental clarity, and profound joy can only be realized when the soul awakens to its constitutional position of eternal loving service unto the Supreme Lord, Śrī Kṛṣṇa."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">1. Authenticity</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Directly aligned with authorized Vedic scriptures and the commentary of genuine spiritual masters.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">2. Practicality</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Applying transcendental wisdom directly to manage corporate stress, family life, and modern distractions.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">3. Free Outreach</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Unrestricted access to core spiritual classes, public quizzes, and guidance at zero barrier to entry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
