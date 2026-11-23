"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "संवाद एवं दर्शन" : "Get In Touch"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
          {t.nav.contact}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          {language === "hi"
            ? "आध्यात्मिक प्रश्नों, कक्षाओं में पंजीकरण अथवा मंदिर दर्शन से संबंधित किसी भी सहायता के लिए संपर्क करें।"
            : "Reach out for class inquiries, temple visits, spiritual counseling, or course enrollment questions."}
        </p>
        <LotusAccent className="my-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === "hi" ? "मंदिर का पता एवं संपर्क विवरण" : "Temple Location & Contact Details"}
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{t.footer.addressTitle}</p>
                <p className="text-gray-600">{t.footer.addressText}</p>
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
                <p className="font-semibold text-gray-900">{language === "hi" ? "ईमेल" : "Official Email"}</p>
                <p className="text-gray-600">{t.footer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{language === "hi" ? "दैनिक मंदिर समय" : "Daily Temple Hours"}</p>
                <p className="text-gray-600">04:30 AM – 01:00 PM & 04:30 PM – 08:45 PM IST</p>
              </div>
            </div>
          </div>

          <div className="h-56 rounded-2xl overflow-hidden border border-amber-200 shadow-inner">
            <iframe
              title="Temple Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.582847953259!2d73.87677817596048!3d18.457223971115857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eb9c9bbf28cb%3A0x6b1cb16e885d519b!2sISKCON%20NVCC%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm flex flex-col justify-between">
          {submitted ? (
            <div className="my-auto text-center space-y-4 p-8 bg-amber-50 rounded-2xl border border-amber-200 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {language === "hi" ? "हरे कृष्ण! आपका संदेश प्राप्त हुआ।" : "Hare Kṛṣṇa! Message Received."}
              </h3>
              <p className="text-sm text-gray-600">
                {language === "hi"
                  ? "हमारे सेवक शीघ्र ही आपसे संपर्क करेंगे।"
                  : "Our team will get back to you shortly."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? "जिज्ञासा अथवा संदेश भेजें" : "Send an Inquiry"}
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "पूरा नाम *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "मोबाइल नंबर *" : "Mobile Number *"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "ईमेल (वैकल्पिक)" : "Email (Optional)"}
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "संदेश अथवा प्रश्न *" : "Message / Question *"}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={language === "hi" ? "आपकी जिज्ञासा अथवा प्रश्न..." : "How can we assist your spiritual journey?"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{language === "hi" ? "संदेश भेजें" : "Submit Inquiry"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
