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
  FileText,
  Leaf,
  Infinity as InfinityIcon,
  FlaskConical,
  RefreshCw,
  Trophy
} from "lucide-react";
import LotusAccent from "@/components/devotional/LotusAccent";
import { parseCSVToQuestions, SAMPLE_CSV_CONTENT, ParsedQuizQuestion } from "@/lib/csvQuizHelper";
import { generateQuizCertificatePdf } from "@/lib/pdf/certificateGenerator";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

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

  // 4 Pastel Pill Styles matching uploaded design
  const pillStyles = {
    A: {
      bg: "bg-[#EBF7EE] hover:bg-[#DDF2E2] border-[#B7E4C4] text-[#144723]",
      circle: "bg-[#2E7D32] text-white",
      icon: <Leaf className="w-5 h-5 text-[#2E7D32]/80 shrink-0" />
    },
    B: {
      bg: "bg-[#E6F7FA] hover:bg-[#D5F2F7] border-[#ADE4EE] text-[#0A434F]",
      circle: "bg-[#0288D1] text-white",
      icon: <InfinityIcon className="w-5 h-5 text-[#0288D1]/80 shrink-0" />
    },
    C: {
      bg: "bg-[#FFF6E9] hover:bg-[#FFEECF] border-[#FFDFAD] text-[#613A05]",
      circle: "bg-[#E67E22] text-white",
      icon: <FlaskConical className="w-5 h-5 text-[#E67E22]/80 shrink-0" />
    },
    D: {
      bg: "bg-[#F6EEFA] hover:bg-[#EFE2F6] border-[#DFBFEF] text-[#481A5D]",
      circle: "bg-[#8E44AD] text-white",
      icon: <RefreshCw className="w-4 h-4 text-[#8E44AD]/80 shrink-0" />
    },
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

    const loadData = async () => {
      try {
        const stored = localStorage.getItem("sr_custom_quizzes");
        if (stored) {
          const list = JSON.parse(stored);
          if (list.length > 0) {
            const selected = quizIdParam ? list.find((q: any) => q.id === quizIdParam) : list[0];
            if (selected) {
              setQuizTitle(selected.title?.[language] || selected.title?.en || "Bhagavad-gītā Wisdom Challenge");
              setQuestions(selected.questions || []);
              if (selected.timerSeconds !== undefined) {
                setTimerDuration(Number(selected.timerSeconds));
                setTimeLeft(Number(selected.timerSeconds));
              }
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Could not load custom quizzes from local storage:", e);
      }

      if (quizIdParam) {
        try {
          const snap = await getDoc(doc(db, "quizzes", quizIdParam));
          if (snap.exists()) {
            const data: any = snap.data();
            setQuizTitle(data.title?.[language] || data.title?.en || "Bhagavad-gītā Wisdom Challenge");
            setQuestions(data.questions || []);
            if (data.timerSeconds !== undefined) {
              setTimerDuration(Number(data.timerSeconds));
              setTimeLeft(Number(data.timerSeconds));
            }
            return;
          }
        } catch (e) {
          console.warn("Could not fetch quiz from Firestore", e);
        }
      }

      const res = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
      setQuestions(res.questions);
      setTimerDuration(10);
      setTimeLeft(10);
    };

    loadData();

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [quizIdParam, language]);

  // Start Quiz
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
      setIsComplete(true);

      // Stop background sound upon quiz completion
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

  // Button 1: Download Certificate Only (Exact Landscape A4 PDF)
  const handleDownloadCertificateOnly = async () => {
    setGeneratingPdf(true);
    const cleanName = (participantName || "Devotee Seeker")
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    try {
      const certElem = document.getElementById("official-devotional-certificate");
      if (certElem) {
        const html2canvasModule = await import("html2canvas");
        const html2canvas = html2canvasModule.default;
        const canvas = await html2canvas(certElem, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#FFFDF7",
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const { PDFDocument } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.create();
        // Exact certificate aspect ratio matching 1024x615
        const page = pdfDoc.addPage([842, 506]);
        const jpgImage = await pdfDoc.embedJpg(imgData);
        page.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: 842,
          height: 506,
        });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SelfRealization_Certificate_${cleanName.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        return;
      }
    } catch (e: any) {
      console.warn("html2canvas capture warning, falling back to direct PDF generation:", e);
    }

    try {
      const totalMarks = questions.reduce((a, b) => a + b.points, 0);
      const percentage = (score / totalMarks) * 100;

      const pdfBytes = await generateQuizCertificatePdf({
        certificateId,
        participantName: cleanName,
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
      // Differentiated filename for Certificate Only
      a.download = `SelfRealization_Certificate_${cleanName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e: any) {
      console.error("PDF generation error:", e);
      setPrintMode("cert-only");
      setTimeout(() => window.print(), 200);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Button 2: Download Full Report (Certificate on Page 1, Score & Review on Page 2+)
  const handleDownloadFullReport = () => {
    setPrintMode("full-report");
    setTimeout(() => {
      window.print();
    }, 150);
  };

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
          
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/images/logo.png"
              alt="SelfRealization Logo"
              fill
              className="object-contain"
              priority
            />
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
                <span>Start Quiz</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>✓ {questions.length} Questions</span>
            <span>•</span>
            <span>✓ {timerDuration}s per Question</span>
            <span>•</span>
            <span>✓ Official Certificate</span>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: QUIZ COMPLETE — EXACT CERTIFICATE & REVIEW
  if (isComplete) {
    const totalMarks = questions.reduce((a, b) => a + b.points, 0);
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const dateFormatted = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const formattedParticipantName = (participantName || "Devotee Seeker")
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    return (
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in ${printMode === "cert-only" ? "cert-only-mode" : "full-report-mode"}`}>
        
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
            .official-cert-card {
              page-break-after: avoid !important;
              break-after: avoid !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              width: 100% !important;
              max-width: 100% !important;
              aspect-ratio: 1024 / 615 !important;
              box-shadow: none !important;
              border: 0 !important;
              margin: 0 auto !important;
              padding: 0 !important;
            }
            .full-report-mode .official-cert-card {
              page-break-after: always !important;
              break-after: page !important;
            }
          }
        `}</style>

        {/* Top Control Bar */}
        <div className="no-print-area flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Another Quiz</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {/* Button 1: Download Only Certificate */}
            <button
              type="button"
              onClick={handleDownloadCertificateOnly}
              disabled={generatingPdf}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>{generatingPdf ? "Generating..." : "Download Only Certificate"}</span>
            </button>

            {/* Button 2: Download Full Report */}
            <button
              type="button"
              onClick={handleDownloadFullReport}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Download Full Report</span>
            </button>
          </div>
        </div>

        {/* Score Summary Banner */}
        <div className="hide-on-cert-only bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner text-2xl">
            🏆
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Congratulations, {formattedParticipantName}!
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              You have completed {quizTitle} with devotion and sincerity.
            </p>
          </div>

          {/* Gaming Score HUD */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-around max-w-lg mx-auto">
            <div>
              <p className="text-2xl font-black text-amber-700">{score}</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Score</p>
            </div>
            <div className="h-7 w-px bg-amber-200" />
            <div>
              <p className="text-2xl font-black text-emerald-600">{percentage.toFixed(0)}%</p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Accuracy</p>
            </div>
            <div className="h-7 w-px bg-amber-200" />
            <div>
              <p className="text-2xl font-black text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{maxStreak}</span>
              </p>
              <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">Best Streak</p>
            </div>
          </div>
        </div>

        {/* OFFICIAL DEVOTIONAL CERTIFICATE (EXACT TEMPLATE & EXACT SIZE) */}
        <div 
          id="official-devotional-certificate"
          className="official-cert-card relative w-full aspect-[1024/615] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600 bg-[#FAF8F5]"
        >
          {/* Official Clean Blank Certificate Template */}
          <Image
            src="/images/certificate-template-blank.jpg"
            alt="Official Certificate"
            fill
            className="object-cover"
            priority
          />

          {/* Dynamic Content Layer Overlaid with Precise Center Alignment */}
          <div className="absolute inset-0 pointer-events-none select-none">
            
            {/* Blank Zone 1: Participant Name (Curvy, Stylish Italic Calligraphy, Middle of Gap, Size Calibrated) */}
            <div className="absolute inset-x-0 top-[47%] -translate-y-1/2 text-center px-16 sm:px-28">
              <span 
                className="text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-[#381105] tracking-normal drop-shadow-xs italic inline-block leading-tight select-text"
                style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive, serif" }}
              >
                {formattedParticipantName}
              </span>
            </div>

            {/* Blank Zone 2: Course / Quiz Title */}
            <div className="absolute inset-x-0 top-[61.5%] -translate-y-1/2 text-center px-16 sm:px-28">
              <p className="text-xs sm:text-base md:text-lg lg:text-xl font-serif font-black text-[#8c1414] tracking-tight">
                “{quizTitle}”
              </p>
            </div>

            {/* Blank Zone 2b: Score Line (Moved up so it does NOT touch the bottom logo) */}
            <div className="absolute inset-x-0 top-[66%] -translate-y-1/2 text-center px-16 sm:px-28">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800">
                securing a score of <strong>{score} / {totalMarks} ({percentage.toFixed(1)}%)</strong>.
              </p>
            </div>

            {/* Bottom-Left Metadata: Date (Aligned directly next to 📅 :) */}
            <div className="absolute left-[16.2%] top-[78.8%] -translate-y-1/2 text-left">
              <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-[#3d1d07] font-mono leading-none">
                {dateFormatted}
              </span>
            </div>

            {/* Bottom-Left Metadata: ID (Aligned directly next to 🪪 :) */}
            <div className="absolute left-[16.2%] top-[83.6%] -translate-y-1/2 text-left">
              <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-[#3d1d07] font-mono leading-none">
                {certificateId}
              </span>
            </div>

          </div>
        </div>

        {/* Buttons underneath Certificate */}
        <div className="no-print-area flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            type="button"
            onClick={handleDownloadCertificateOnly}
            disabled={generatingPdf}
            className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span>{generatingPdf ? "Generating..." : "Download Only Certificate"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFullReport}
            className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>Download Full Report</span>
          </button>
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

  // SCREEN 2: ACTIVE QUESTION ARENA (COMPACT, 100% ZERO-SCROLL FOR DESKTOP & MOBILE)
  const currentQ = questions[currentIndex];
  const timerFraction = timerDuration > 0 ? timeLeft / timerDuration : 1;
  const isTimerUrgent = timeLeft <= 3 && timerDuration > 0 && !isAnswered;

  return (
    <div className="fixed inset-0 z-50 bg-[#120822] text-white flex flex-col justify-between overflow-hidden select-none p-2 sm:p-4">
      
      {/* Devotional Panoramic Background with Yamuna & Golden Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#120822]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-[#221035] to-[#0D0417]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0D0417] via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col h-full justify-between gap-1 sm:gap-2 relative z-10">
        
        {/* 1. COMPACT STREAMLINED ROYAL HUD BAR */}
        <div className="shrink-0 bg-gradient-to-r from-[#20103A] via-[#2D164E] to-[#20103A] border-2 border-amber-400/80 rounded-2xl px-3 sm:px-5 py-1.5 sm:py-2 shadow-xl flex items-center justify-between gap-2 text-white">
          
          {/* Left: Exit Link & Progress Pill */}
          <div className="flex items-center gap-2">
            <Link
              href="/quiz"
              onClick={() => {
                if (bgAudioRef.current) {
                  bgAudioRef.current.pause();
                  bgAudioRef.current.currentTime = 0;
                }
              }}
              className="text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
            >
              ← Exit
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300 text-amber-200 text-xs font-black">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Center: Open Gita Plaque & Live Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-amber-900/60 border border-amber-400/60 px-3 py-0.5 rounded-xl shadow-xs">
              <span className="text-xs">📖</span>
              <span className="text-xs font-serif font-black text-amber-200 tracking-wide">{quizTitle}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 px-3 py-0.5 rounded-full border border-amber-300 shadow-inner">
              <span className="text-amber-300 text-xs hidden sm:inline">🌿</span>
              <Timer className={`w-3.5 h-3.5 ${isTimerUrgent ? "text-rose-400 animate-spin" : "text-amber-300"}`} />
              <span className={`font-mono font-black text-xs sm:text-sm ${isTimerUrgent ? "text-rose-300 animate-pulse" : "text-amber-100"}`}>
                {timeLeft}s
              </span>
              <span className="text-amber-300 text-xs hidden sm:inline">🌿</span>
            </div>
          </div>

          {/* Right: Score & Audio Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-300/60 px-2.5 py-0.5 rounded-xl">
              <Trophy className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="font-black text-amber-300 text-xs">{score} Pts</span>
            </div>

            <button
              type="button"
              onClick={toggleBgMusic}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                bgMusicPlaying 
                  ? "bg-amber-500/30 text-amber-200 border-amber-300 shadow-sm" 
                  : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
              }`}
            >
              <Music className="w-3 h-3" />
              <span className="hidden sm:inline">{bgMusicPlaying ? "Music ON" : "Music OFF"}</span>
            </button>
          </div>
        </div>

        {/* 2. THIN NEON PROGRESS BAR */}
        <div className="shrink-0 w-full h-1.5 bg-amber-950/70 border border-amber-400/40 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
            style={{ width: `${timerFraction * 100}%` }}
          />
        </div>

        {/* 3. CENTER QUESTION & OPTIONS CARD (100% ZERO-SCROLL) */}
        <div className={`grow flex flex-col justify-center bg-[#FDFBF7] text-gray-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-2 sm:border-4 border-amber-400/90 shadow-2xl relative overflow-hidden my-auto ${
          isAnswered && selectedOption !== currentQ.correctAnswer ? "animate-shake" : ""
        }`}>
          
          {/* Floating Score Alert */}
          {floatingScore !== null && (
            <div className="absolute top-2 right-4 text-base sm:text-xl font-black text-emerald-600 animate-float-score pointer-events-none z-30">
              +{floatingScore} Points! 🌸
            </div>
          )}

          {/* DESKTOP LAYOUT (2 Columns) vs MOBILE LAYOUT (Compact Stack) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center">
            
            {/* PICTURE COLUMN (Left on desktop, Top preview on mobile) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative w-full h-24 sm:h-32 lg:h-[270px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-stone-100">
                <Image
                  src={currentQ.imageUrl || "https://www.iskconpune.com/wp-content/uploads/2026/06/1-1024x683.png"}
                  alt="Question illustration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 450px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 sm:p-2 flex justify-center">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-200 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/50 backdrop-blur-xs">
                    QUESTION {currentIndex + 1} OF {questions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* QUESTION & 4 OPTIONS COLUMN */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-2 sm:space-y-3">
              
              {/* Question Text */}
              <div className="space-y-0.5 text-center lg:text-left">
                <h2 className="text-sm sm:text-lg lg:text-xl font-black text-[#361505] leading-snug">
                  {currentQ.question.hi}
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium italic line-clamp-1">
                  {currentQ.question.en}
                </p>
              </div>

              {/* 4 Capsule Pill Options Grid (2x2 on mobile, single stack on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const isSelected = selectedOption === optKey;
                  const isCorrect = currentQ.correctAnswer === optKey;
                  const style = pillStyles[optKey];

                  let cardStateClass = style.bg;
                  if (isAnswered) {
                    if (isCorrect) {
                      cardStateClass = "bg-emerald-100 border-2 border-emerald-600 text-emerald-950 shadow-md ring-2 ring-emerald-300";
                    } else if (isSelected && !isCorrect) {
                      cardStateClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-300 animate-shake";
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
                      className={`w-full p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-full border-2 text-left transition-all duration-150 flex items-center justify-between gap-2 sm:gap-3 shadow-xs transform active:scale-98 cursor-pointer ${cardStateClass}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 grow overflow-hidden">
                        {/* Option Circle */}
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black shrink-0 ${
                          isAnswered && isCorrect ? "bg-emerald-600 text-white" :
                          isAnswered && isSelected && !isCorrect ? "bg-rose-600 text-white" :
                          style.circle
                        }`}>
                          {isAnswered && isCorrect ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : optKey}
                        </span>

                        {/* Option Text */}
                        <div className="leading-tight overflow-hidden">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {currentQ.options[optKey].hi}
                          </p>
                          <p className="text-[10px] sm:text-[11px] opacity-75 font-medium italic truncate">
                            {currentQ.options[optKey].en}
                          </p>
                        </div>
                      </div>

                      {/* Thematic Icon (Desktop only) */}
                      <div className="hidden lg:block shrink-0 pr-1">
                        {style.icon}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Instant In-Card Feedback & Next Action */}
              {isAnswered && (
                <div className="pt-1 border-t border-gray-100 animate-fade-in">
                  {selectedOption === currentQ.correctAnswer ? (
                    <div className="p-2 sm:p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
                        <span className="font-bold text-xs">Correct! Advancing in 2s...</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Next ➔
                      </button>
                    </div>
                  ) : (
                    <div className="p-2 sm:p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-2">
                      <div className="text-xs text-amber-950 truncate">
                        <span className="font-bold">
                          {isTimeUp ? "⌛ Time up!" : "✕ Correct: " + currentQ.correctAnswer + " - " + currentQ.options[currentQ.correctAnswer].hi}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="px-3 py-1 rounded-lg font-black text-xs bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-xs shrink-0 cursor-pointer"
                      >
                        Next ➔
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

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
