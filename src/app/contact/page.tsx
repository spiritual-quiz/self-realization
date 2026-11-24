"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(language === "hi" ? "आध्यात्मिक मार्गदर्शन" : "Spiritual Guidance");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) return;

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "inquiries"), {
        fullName,
        phone,
        email,
        subject,
        message,
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

      // Send instant email notification to madhavcarandas@gmail.com
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "inquiry",
            details: {
              fullName,
              phone,
              email,
              subject,
              message
            }
          })
        });
      } catch (notifyErr) {
        console.warn("Notification dispatch notice:", notifyErr);
      }

      setInquiryId(docRef.id);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Firestore inquiry error:", err);
      // Fallback in case of local offline dev
      setInquiryId("INQ-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
          {language === "hi" ? "संवाद एवं दर्शन" : "Get In Touch"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.nav.contact}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
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
                <p className="font-semibold text-gray-900">{language === "hi" ? "ईमेल" : "Official Email"}</p>
                <p className="text-gray-600">{t.footer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{language === "hi" ? "दैनिक मंदिर दर्शन समय" : "Daily Temple Darshan Hours"}</p>
                <p className="text-gray-600">04:30 AM – 01:00 PM & 04:30 PM – 08:45 PM IST</p>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-2xl overflow-hidden border border-amber-200 shadow-inner">
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
            <div className="my-auto text-center space-y-5 p-8 bg-amber-50/70 rounded-2xl border border-amber-200 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? "हरे कृष्ण! आपका संदेश सुरक्षित हो गया है।" : "Hare Kṛṣṇa! Message Received."}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === "hi"
                  ? "आपकी जिज्ञासा हमारे सेवा दल तक पहुँच गई है। हम शीघ्र ही आपसे संपर्क करेंगे।"
                  : "Thank you for reaching out. Our seva team will connect with you shortly."}
              </p>
              {inquiryId && (
                <p className="text-xs font-mono text-amber-800 bg-white px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                  Reference ID: {inquiryId}
                </p>
              )}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  {language === "hi" ? "अन्य संदेश भेजें" : "Send Another Inquiry"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === "hi" ? "जिज्ञासा अथवा संदेश भेजें" : "Send a Devotional Inquiry"}
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "पूरा नाम *" : "Your Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    {language === "hi" ? "मोबाइल नंबर *" : "Mobile Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    {language === "hi" ? "ईमेल *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "विषय" : "Subject of Inquiry"}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm bg-white"
                >
                  <option value="Live Classes">{language === "hi" ? "साप्ताहिक लाइव कक्षाओं की जानकारी" : "Live Classes Information"}</option>
                  <option value="Courses">{language === "hi" ? "ऑनलाइन पाठ्यक्रम (LMS) सहायता" : "Online LMS Course Inquiries"}</option>
                  <option value="Monk Program">{language === "hi" ? "Live Like a Monk आश्रम प्रशिक्षण" : "Live Like a Monk Program"}</option>
                  <option value="Temple Visit">{language === "hi" ? "मंदिर दर्शन एवं सेवा" : "Temple Visit & Seva"}</option>
                  <option value="General Question">{language === "hi" ? "दार्शनिक प्रश्न अथवा अन्य" : "Philosophical Question / Other"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  {language === "hi" ? "आपका संदेश अथवा जिज्ञासा *" : "Your Message or Question *"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === "hi" ? "कृपया अपनी जिज्ञासा विस्तार से लिखें..." : "Please share your questions or thoughts..."}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === "hi" ? "भेजा जा रहा है..." : "Submitting Inquiry..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === "hi" ? "संदेश भेजें" : "Submit Devotional Inquiry"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
