"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  HelpCircle, 
  Clock, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  RotateCcw, 
  Download, 
  Calendar,
  Check,
  ChevronRight,
  Loader2,
  Flame,
  Music,
  Timer,
  Printer,
  ShieldCheck,
  FileText
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { parseCSVToQuestions, SAMPLE_CSV_CONTENT, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { generateQuizCertificatePdf } from "@/lib/pdf/certificateGenerator";

function QuizPlayInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("id");

  // Participant Entry State
  const [participantName, setParticipantName] = useState("");
  const [participantPhone, setParticipantPhone] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  // Quiz Content & Admin Config State
  const [quizTitle, setQuizTitle] = useState("Bhagavad-gītā Wisdom Challenge");
  const [questions, setQuestions] = useState<ParsedQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerDuration, setTimerDuration] = useState<number>(10);

  // Gaming & Timer State
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [floatingScore, setFloatingScore] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Interaction State
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answersLog, setAnswersLog] = useState<{ questionId: number; selected: string; correct: string; isCorrect: boolean }[]>([]);
  
  // Audio Controls
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);
  
  // Completion & Certificate State
  const [isComplete, setIsComplete] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [certificateId, setCertificateId] = useState("");
  const [printMode, setPrintMode] = useState<"cert-only" | "full-report">("cert-only");

  // Audio & Timer References
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // 4 Pastel Card Styles with High Contrast
  const pastelStyles = {
    A: "bg-[#E8F5E9] hover:bg-[#D4EDDA] border-[#C3E6CB] text-emerald-950",
    B: "bg-[#E1F5FE] hover:bg-[#CCE5FF] border-[#B8DAFF] text-blue-950",
    C: "bg-[#FFF3E0] hover:bg-[#FFE8CC] border-[#FFE2BD] text-amber-950",
    D: "bg-[#F3E5F5] hover:bg-[#EBD3F0] border-[#E5C7EB] text-purple-950",
  };

  // Load Quiz & Audio Setup
  useEffect(() => {
    correctAudioRef.current = new Audio("/audio/correct.mp3");
    wrongAudioRef.current = new Audio("/audio/wrong.mp3");
    bgAudioRef.current = new Audio("/audio/bg-music.mp3");
    if (bgAudioRef.current) {
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.35;
    }

    // Try loading custom uploaded quiz from localStorage or fall back to sample
    try {
      const stored = localStorage.getItem("sr_custom_quizzes");
      if (stored) {
        const list = JSON.parse(stored);
        if (list.length > 0) {
          const selected = quizIdParam ? list.find((q: any) => q.id === quizIdParam) || list[0] : list[0];
          setQuizTitle(selected.title?.[language] || selected.title?.en || "Bhagavad-gītā Wisdom Challenge");
          setQuestions(selected.questions || []);
          if (selected.timerSeconds !== undefined) {
            setTimerDuration(Number(selected.timerSeconds));
            setTimeLeft(Number(selected.timerSeconds));
          }
          return;
        }
      }
    } catch (e) {
      console.warn("Could not load custom quizzes from local storage:", e);
    }

    // Default built-in questions
    const res = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
    setQuestions(res.questions);
    setTimerDuration(10);
    setTimeLeft(10);

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [quizIdParam, language]);

  // Generate Unique Certificate ID on start
  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) return;

    const uniqueCertId = "SR-" + Math.floor(100000 + Math.random() * 900000);
    setCertificateId(uniqueCertId);
    setQuizStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setAnswersLog([]);
    setIsComplete(false);
    setIsAnswered(false);
    setSelectedOption(null);
    setTimeLeft(timerDuration);

    // Start background music
    if (bgAudioRef.current) {
      bgAudioRef.current.play().then(() => setBgMusicPlaying(true)).catch(() => {});
    }
  };

  // Toggle Background Music
  const toggleBgMusic = () => {
    if (!bgAudioRef.current) return;
    if (bgMusicPlaying) {
      bgAudioRef.current.pause();
      setBgMusicPlaying(false);
    } else {
      bgAudioRef.current.play().then(() => setBgMusicPlaying(true)).catch(() => {});
    }
  };

  // Sound FX Player
  const playFx = (type: "correct" | "wrong") => {
    if (!soundFxEnabled) return;
    try {
      if (type === "correct" && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0;
        correctAudioRef.current.play().catch(() => {});
      } else if (type === "wrong" && wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0;
        wrongAudioRef.current.play().catch(() => {});
      }
    } catch (e) {}
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (!quizStarted || isAnswered || isComplete || timerDuration === 0) return;

    setTimeLeft(timerDuration);
    setIsTimeUp(false);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentIndex, quizStarted, isAnswered, isComplete, timerDuration]);

  // Handle Timeout
  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsTimeUp(true);
    setStreak(0);
    playFx("wrong");

    const currentQ = questions[currentIndex];
    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: "TIMEOUT",
        correct: currentQ.correctAnswer,
        isCorrect: false,
      },
    ]);
  };

  // Handle Option Select
  const handleSelectOption = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

    setSelectedOption(optKey);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = optKey === currentQ.correctAnswer;

    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: optKey,
        correct: currentQ.correctAnswer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const pointsEarned = currentQ.points + (newStreak > 1 ? (newStreak - 1) * 2 : 0);
      setScore((s) => s + pointsEarned);
      setFloatingScore(pointsEarned);
      playFx("correct");

      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#F43F5E", "#10B981", "#8B5CF6"],
        shapes: ["circle"],
      });

      setTimeout(() => setFloatingScore(null), 1200);

      // Auto-advance within strictly 2 seconds on correct answer (no waiting for 10s)
      autoAdvanceRef.current = setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    } else {
      setStreak(0);
      playFx("wrong");
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimeUp(false);
      setTimeLeft(timerDuration);
    } else {
      // Quiz is finished!
      setIsComplete(true);

      // Explicitly stop background sound as soon as quiz completes
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
        setBgMusicPlaying(false);
      }

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  };

  // Button 1: Download Certificate Only (Single Page A4 PDF)
  const handleDownloadCertificate = async () => {
    setGeneratingPdf(true);
    try {
      const totalMarks = questions.reduce((a, b) => a + b.points, 0);
      const percentage = (score / totalMarks) * 100;

      const pdfBytes = await generateQuizCertificatePdf({
        certificateId,
        participantName: participantName.trim() || "Devotee Seeker",
        quizTitle,
        score,
        totalMarks,
        percentage,
        dateStr: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      });

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SelfRealization_${participantName.replace(/\s+/g, "_")}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e: any) {
      console.error("PDF generation error:", e);
      // Fallback: Browser Print in cert-only mode
      setPrintMode("cert-only");
      setTimeout(() => window.print(), 200);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Button 1 (Alternative / Browser Print): Print Certificate Only
  const handlePrintCertificateOnly = () => {
    setPrintMode("cert-only");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Button 2: Download Full Report (Certificate on Page 1, Score & Review on Page 2+)
  const handlePrintFullReport = () => {
    setPrintMode("full-report");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // If questions not loaded yet
  if (questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-700">Loading Vedic Quiz Arena...</p>
      </div>
    );
  }

  // SCREEN 1: REGISTRATION & NAME INPUT
  if (!quizStarted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20 font-serif font-black text-2xl">
            ॐ
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Vedic Interactive Assessment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {quizTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === "hi"
                ? "कृपया अपना नाम दर्ज करें ताकि आपका आधिकारिक वैदिक प्रमाण-पत्र जारी किया जा सके।"
                : "Enter your name to unlock the Gaming Quiz Arena and generate your personalized certificate."}
            </p>
            <LotusAccent className="my-1 opacity-70" />
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                {language === "hi" ? "प्रतिभागी का पूरा नाम" : "Full Name for Certificate"} *
              </label>
              <input
                type="text"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder={language === "hi" ? "उदा. अर्जुन शर्मा" : "e.g. Arjuna Sharma"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                {language === "hi" ? "व्हाट्सएप नंबर (वैकल्पिक)" : "WhatsApp Number (Optional)"}
              </label>
              <input
                type="tel"
                value={participantPhone}
                onChange={(e) => setParticipantPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>{language === "hi" ? "क्विज़ प्रारंभ करें" : "Start Quiz Challenge"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>✓ {questions.length} Questions</span>
            <span>•</span>
            <span>✓ {timerDuration}s per Question</span>
            <span>•</span>
            <span>✓ Printable Certificate</span>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: QUIZ COMPLETE — CERTIFICATE & REVIEW
  if (isComplete) {
    const totalMarks = questions.reduce((a, b) => a + b.points, 0);
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const dateFormatted = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    return (
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-fade-in ${printMode === "cert-only" ? "cert-only-mode" : "full-report-mode"}`}>
        
        {/* Print Stylesheet for exact 1-page certificate & report */}
        <style jsx global>{`
          @media print {
            header, footer, nav, .no-print-area {
              display: none !important;
            }
            body, html {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .cert-only-mode .hide-on-cert-only {
              display: none !important;
            }
            .cert-box-container {
              page-break-after: avoid !important;
              break-after: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              max-height: 96vh !important;
              width: 100% !important;
              border: 3px solid #d97706 !important;
              box-shadow: none !important;
              margin: 0 auto !important;
              padding: 16px !important;
            }
            .full-report-mode .cert-box-container {
              page-break-after: always !important;
              break-after: page !important;
            }
          }
        `}</style>

        {/* Action Bar (Top) */}
        <div className="no-print-area flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Another Quiz</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {/* Button 1: Download Certificate Only */}
            <button
              type="button"
              onClick={handleDownloadCertificate}
              disabled={generatingPdf}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{generatingPdf ? "Creating PDF..." : "Download Certificate Only (1 Page)"}</span>
            </button>

            {/* Button 2: Download Full Report */}
            <button
              type="button"
              onClick={handlePrintFullReport}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Download Full Report (Cert + Marks + Review)</span>
            </button>
          </div>
        </div>

        {/* Score Summary Banner */}
        <div className="hide-on-cert-only bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner text-3xl">
            🏆
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
              Devotional Perfection!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              Congratulations, {participantName}!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              You have completed {quizTitle} with sincerity and dedication.
            </p>
          </div>

          {/* Gaming Score HUD */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-around">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-700">{score}</p>
              <p className="text-[11px] text-gray-500 font-semibold uppercase mt-1">Total Score</p>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">{percentage.toFixed(0)}%</p>
              <p className="text-[11px] text-gray-500 font-semibold uppercase mt-1">Accuracy</p>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div>
              <p className="text-2xl sm:text-3xl font-black text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-500" />
                <span>{maxStreak}</span>
              </p>
              <p className="text-[11px] text-gray-500 font-semibold uppercase mt-1">Best Streak</p>
            </div>
          </div>
        </div>

        {/* STRICTLY SINGLE-PAGE OFFICIAL CERTIFICATE */}
        <div className="cert-box-container bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border-4 border-amber-600 shadow-2xl text-center space-y-4 overflow-hidden relative">
          <div className="border border-amber-300 rounded-2xl p-5 sm:p-7 space-y-4 bg-white relative">
            <div className="text-[11px] sm:text-xs font-bold tracking-widest text-amber-700 uppercase">
              SelfRealization • Digital Outreach Platform
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-amber-950 tracking-tight leading-snug">
              CERTIFICATE OF DEVOTIONAL EXCELLENCE
            </h3>

            <p className="text-xs italic text-gray-600 font-serif">
              This is proudly presented to
            </p>

            <div className="py-1">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-700 underline decoration-amber-400 decoration-2 underline-offset-8">
                {participantName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 max-w-xl mx-auto leading-relaxed">
              for successfully passing and demonstrating spiritual understanding in <br />
              <strong className="text-amber-900 text-sm">“{quizTitle}”</strong> <br />
              securing a score of <strong>{score} / {totalMarks} ({percentage.toFixed(1)}%)</strong>.
            </p>

            <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <div className="text-left font-mono text-[11px]">
                <p>Date: {dateFormatted}</p>
                <p className="text-gray-400">ID: {certificateId}</p>
              </div>

              <div className="w-10 h-10 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center text-amber-700 font-serif font-black text-sm">
                ॐ
              </div>

              <div className="text-right">
                <div className="w-32 h-px bg-amber-900 mx-auto sm:ml-auto mb-1" />
                <p className="font-bold text-amber-950 text-xs">Director of Outreach</p>
                <p className="text-[10px] text-gray-500">SelfRealization Platform</p>
              </div>
            </div>
          </div>

          {/* Dedicated Download Buttons Bar */}
          <div className="no-print-area flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {/* Button 1: Download Certificate Only */}
            <button
              type="button"
              onClick={handleDownloadCertificate}
              disabled={generatingPdf}
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>{generatingPdf ? "Creating PDF..." : "1. Download Certificate Only (A4 1-Page)"}</span>
            </button>

            {/* Button 2: Download Full Report */}
            <button
              type="button"
              onClick={handlePrintFullReport}
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>2. Download Full Report (Cert + Marks + Review)</span>
            </button>
          </div>
        </div>

        {/* DETAILED QUESTION & ANSWER REVIEW (Wrong Answer Analysis) */}
        <div className="hide-on-cert-only bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Detailed Question Review & Explanations</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Review your selections, correct answers, and scriptural purports.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              {questions.length} Total Questions
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const log = answersLog.find((a) => a.questionId === q.id);
              const isCorrect = log?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 space-y-3 ${
                    isCorrect
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? "bg-emerald-600" : "bg-rose-600"}`}>
                          {idx + 1}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                          {isCorrect ? "Correct Answer ✓" : "Incorrect Answer ✕"}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900">
                        {q.question.hi}
                      </h4>
                      <p className="text-xs text-gray-500 italic">
                        {q.question.en}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-1 rounded-md shrink-0">
                      {q.points} Pts
                    </span>
                  </div>

                  {/* Selected vs Correct Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className={`p-3 rounded-xl border ${isCorrect ? "bg-emerald-100/60 border-emerald-300 text-emerald-950" : "bg-rose-100/60 border-rose-300 text-rose-950"}`}>
                      <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5">Your Selected Answer:</p>
                      <p className="font-semibold">
                        {log?.selected && log.selected !== "TIMEOUT" ? (
                          <>
                            Option {log.selected}: {q.options[log.selected as 'A'|'B'|'C'|'D']?.hi}
                          </>
                        ) : (
                          "Timed Out (No Answer)"
                        )}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border bg-emerald-100/60 border-emerald-300 text-emerald-950">
                      <p className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-emerald-800">Correct Answer:</p>
                      <p className="font-semibold">
                        Option {q.correctAnswer}: {q.options[q.correctAnswer]?.hi}
                      </p>
                    </div>
                  </div>

                  {/* Explanation Note */}
                  {q.explanation.hi && (
                    <div className="p-3 bg-white/80 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-0.5">
                      <span className="font-bold text-amber-900 text-[11px] block">शास्त्रोक्त व्याख्या / Scriptural Explanation:</span>
                      <p>{q.explanation.hi}</p>
                      <p className="text-gray-500 italic text-[11px]">{q.explanation.en}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // SCREEN 2: ACTIVE QUESTION ARENA (COMPACT 2-COLUMN LAYOUT)
  const currentQ = questions[currentIndex];
  const timerFraction = timerDuration > 0 ? timeLeft / timerDuration : 1;
  const isTimerUrgent = timeLeft <= 3 && timerDuration > 0 && !isAnswered;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 animate-fade-in">
      
      {/* Top Gaming Dashboard (HUD) */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-amber-200 shadow-sm flex items-center justify-between gap-4">
        
        {/* Left: Progress & Question number */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-300">
            {currentIndex + 1}/{questions.length}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vedic Arena</p>
            <p className="text-sm font-black text-gray-900">{score} Points</p>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        {timerDuration > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200 bg-amber-50">
            <Timer className={`w-4 h-4 ${isTimerUrgent ? "text-rose-600 animate-spin" : "text-amber-700"}`} />
            <span className={`font-mono text-sm font-black ${isTimerUrgent ? "text-rose-600 animate-pulse text-base" : "text-amber-900"}`}>
              {timeLeft}s
            </span>
          </div>
        )}

        {/* Right: Streak & Music Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
              <span>{streak}x Streak!</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleBgMusic}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              bgMusicPlaying 
                ? "bg-amber-600 text-white border-amber-600 shadow-xs" 
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-amber-50"
            }`}
            title="Toggle Devotional Background Music"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{bgMusicPlaying ? "Music ON" : "Music OFF"}</span>
          </button>
        </div>
      </div>

      {/* Timer Progress Bar */}
      {timerDuration > 0 && (
        <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ${
              isTimerUrgent ? "bg-rose-500 animate-pulse" : "bg-gradient-to-r from-amber-500 to-orange-500"
            }`}
            style={{ width: `${timerFraction * 100}%` }}
          />
        </div>
      )}

      {/* MAIN 2-COLUMN QUIZ CONTAINER (PICTURE ON LEFT, QUESTION & ANSWERS ON RIGHT) */}
      <div className={`bg-white rounded-3xl p-5 sm:p-7 border border-amber-200 shadow-vedic relative overflow-hidden ${
        isAnswered && selectedOption !== currentQ.correctAnswer ? "animate-shake" : ""
      }`}>

        {/* Floating Score Animation on Correct Answer */}
        {floatingScore !== null && (
          <div className="absolute top-4 right-6 text-xl sm:text-2xl font-black text-amber-600 animate-float-score pointer-events-none z-30">
            +{floatingScore} XP! 🌸
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Picture / Artwork (Compact & responsive) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative w-full h-52 sm:h-64 lg:h-full min-h-[220px] rounded-2xl overflow-hidden border border-amber-200 shadow-inner bg-gradient-to-br from-amber-50 to-orange-50">
              <Image
                src={currentQ.imageUrl || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"}
                alt="Question illustration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider bg-black/40 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Question, 4 Pastel Options, and Action Bar (Fits in 1 shot!) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Question Text */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                {currentQ.question.hi}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium italic">
                {currentQ.question.en}
              </p>
            </div>

            {/* 4 Pastel Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const isSelected = selectedOption === optKey;
                const isCorrect = currentQ.correctAnswer === optKey;

                let cardStateClass = pastelStyles[optKey];
                if (isAnswered) {
                  if (isCorrect) {
                    cardStateClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-200";
                  } else if (isSelected && !isCorrect) {
                    cardStateClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-200 animate-shake";
                  } else {
                    cardStateClass = "opacity-40 bg-gray-100 border-gray-200 text-gray-500";
                  }
                }

                return (
                  <button
                    key={optKey}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(optKey)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all duration-150 flex items-start gap-2.5 transform active:scale-98 cursor-pointer ${cardStateClass}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isAnswered && isCorrect ? "bg-emerald-600 text-white" :
                      isAnswered && isSelected && !isCorrect ? "bg-rose-600 text-white" :
                      "bg-white/80 border border-current shadow-xs"
                    }`}>
                      {isAnswered && isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : optKey}
                    </span>

                    <div className="grow">
                      <p className="text-xs sm:text-sm font-bold leading-tight">
                        {currentQ.options[optKey].hi}
                      </p>
                      <p className="text-[11px] opacity-80 mt-0.5 font-medium leading-tight">
                        {currentQ.options[optKey].en}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button in same view without scrolling */}
            {isAnswered && (
              <div className="pt-2 border-t border-gray-100 space-y-2 animate-fade-in">
                {selectedOption === currentQ.correctAnswer ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-emerald-900">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
                      <span className="font-bold text-xs">Correct! Advancing in 2 seconds...</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                    >
                      Next Now ➔
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-xs text-amber-950">
                        {isTimeUp ? "⌛ Time is up!" : "✕ Incorrect. Correct answer is " + currentQ.correctAnswer}
                      </p>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-4 py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-sm cursor-pointer"
                      >
                        Next Question ➔
                      </button>
                    </div>
                    {currentQ.explanation.hi && (
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <strong className="text-amber-900">Explanation:</strong> {currentQ.explanation.hi} ({currentQ.explanation.en})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default function QuizPlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-700">Loading Vedic Quiz Arena...</p>
      </div>
    }>
      <QuizPlayInner />
    </Suspense>
  );
}
