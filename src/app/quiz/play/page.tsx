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
  Share2, 
  Calendar,
  Check,
  ChevronRight,
  BrainCircuit,
  Smile,
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
  const [showThinking, setShowThinking] = useState(false);

  // Audio References
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    // Check custom uploaded quizzes
    const localQuizzes = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
    const found = localQuizzes.find((q: any) => q.id === quizIdParam);

    if (found && found.questions?.length > 0) {
      setQuizTitle(found.title.en);
      setQuestions(found.questions);
      if (typeof found.timerSeconds === "number") {
        setTimerDuration(found.timerSeconds);
        setTimeLeft(found.timerSeconds);
      }
    } else {
      const parsed = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
      setQuestions(parsed.questions);
      setTimerDuration(10);
      setTimeLeft(10);
    }

    setCertificateId("SR-" + Math.random().toString(36).substring(2, 8).toUpperCase());

    return () => {
      if (bgAudioRef.current) bgAudioRef.current.pause();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [quizIdParam]);

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

  // Sound Effects helper
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

    setSelectedOption(optKey);
    setIsAnswered(true);
    setShowThinking(false);

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
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#F43F5E", "#10B981", "#8B5CF6"],
        shapes: ["circle"],
      });

      setTimeout(() => setFloatingScore(null), 1200);

      // Auto-advance after 2.8 seconds on correct
      setTimeout(() => {
        handleNextQuestion();
      }, 2800);
    } else {
      setStreak(0);
      playFx("wrong");
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimeUp(false);
      setTimeLeft(timerDuration);
    } else {
      setIsComplete(true);
      if (bgAudioRef.current) {
        bgAudioRef.current.play().catch(() => {});
        setBgMusicPlaying(true);
      }
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  };

  // Reliable PDF Certificate Generator & Downloader
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

      // Safe Uint8Array buffer creation for mobile & desktop
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
      // Fallback: window.print()
      window.print();
    } finally {
      setGeneratingPdf(false);
    }
  };

  // 1. Participant Entry Gate (Public Access)
  if (!quizStarted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              ⚡ Live Vedic Gaming Arena
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              {quizTitle}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Bilingual dual-display • {timerDuration > 0 ? `${timerDuration}s Timer` : "Unlimited Time"} • Question Images • Instant Certificate
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (participantName.trim()) {
                setQuizStarted(true);
                if (bgAudioRef.current) {
                  bgAudioRef.current.play().then(() => setBgMusicPlaying(true)).catch(() => {});
                }
              }
            }}
            className="space-y-4 text-left pt-2"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Participant Name (Printed on Certificate) *
              </label>
              <input
                type="text"
                required
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                WhatsApp Mobile Number (Optional)
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
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-orange-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Enter Quiz Arena & Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>🎵 Devotional Audio</span>
            <span>🌸 Falling Blossoms</span>
            <span>📜 Verifiable PDF</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Completion Screen with On-Screen Certificate & Detailed Wrong Answers Breakdown
  if (isComplete) {
    const totalMarks = questions.reduce((a, b) => a + b.points, 0);
    const percentage = (score / totalMarks) * 100;
    const dateFormatted = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-10 pb-28">
        
        {/* Score Summary Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner text-4xl animate-bounce">
            🏆
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
              Devotional Perfection!
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Congratulations, {participantName}!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              You have completed the {quizTitle} with sincerity and dedication.
            </p>
          </div>

          {/* Gaming Score HUD */}
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-around">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-700">{score}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Total Score</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">{percentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Accuracy</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 fill-orange-500" />
                <span>{maxStreak}</span>
              </p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Best Streak</p>
            </div>
          </div>
        </div>

        {/* ON-SCREEN OFFICIAL CERTIFICATE (Guaranteed to render & print in all browsers) */}
        <div className="bg-[#FAF8F5] p-6 sm:p-10 rounded-3xl border-4 border-amber-600 shadow-2xl relative text-center space-y-6 overflow-hidden">
          {/* Inner Golden Border */}
          <div className="border border-amber-300 rounded-2xl p-6 sm:p-8 space-y-5 bg-white relative">
            <div className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              SelfRealization • Digital Outreach Platform
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-black text-amber-950 tracking-tight">
              CERTIFICATE OF DEVOTIONAL EXCELLENCE
            </h3>

            <p className="text-xs sm:text-sm italic text-gray-600 font-serif">
              This is proudly presented to
            </p>

            <div className="py-2">
              <span className="text-2xl sm:text-4xl font-bold font-serif text-amber-700 underline decoration-amber-400 decoration-2 underline-offset-8">
                {participantName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 max-w-xl mx-auto leading-relaxed">
              for successfully passing and demonstrating spiritual understanding in <br />
              <strong className="text-amber-900 text-sm sm:text-base">“{quizTitle}”</strong> <br />
              securing a score of <strong>{score} / {totalMarks} ({percentage.toFixed(1)}%)</strong>.
            </p>

            <div className="pt-6 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <div className="text-left font-mono">
                <p>Date: {dateFormatted}</p>
                <p className="text-[10px] text-gray-400">Certificate ID: {certificateId}</p>
              </div>

              <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center text-amber-700 font-serif font-black text-sm">
                ॐ
              </div>

              <div className="text-right">
                <div className="w-36 h-px bg-amber-900 mx-auto sm:ml-auto mb-1" />
                <p className="font-bold text-amber-950">Director of Outreach</p>
                <p className="text-[10px] text-gray-500">SelfRealization Platform</p>
              </div>
            </div>
          </div>

          {/* Certificate Download & Print Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              disabled={generatingPdf}
              className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 text-white shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>{generatingPdf ? "Creating PDF..." : "Download Official PDF Certificate"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="py-3.5 px-6 rounded-2xl font-bold text-sm bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 shadow-sm flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* DETAILED QUESTION & ANSWER REVIEW (Wrong Answer Analysis) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg space-y-6">
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

          <div className="space-y-5">
            {questions.map((q, idx) => {
              const log = answersLog.find((a) => a.questionId === q.id);
              const isCorrect = log?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 space-y-3 ${
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
                      <p className="text-sm font-bold text-gray-900 pt-1">{q.question.hi}</p>
                      <p className="text-xs text-gray-600 italic">{q.question.en}</p>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white border border-gray-200 shrink-0">
                      {isCorrect ? `+${q.points} Pts` : "0 Pts"}
                    </span>
                  </div>

                  {/* Options Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const wasSelected = log?.selected === opt;
                      const isTargetCorrect = q.correctAnswer === opt;

                      let pillClass = "bg-white border-gray-200 text-gray-600";
                      if (isTargetCorrect) {
                        pillClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold";
                      } else if (wasSelected && !isTargetCorrect) {
                        pillClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold line-through";
                      }

                      return (
                        <div key={opt} className={`p-2.5 rounded-xl border flex items-center gap-2 ${pillClass}`}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/80 border shrink-0">
                            {opt}
                          </span>
                          <span className="truncate">{q.options[opt].hi} / {q.options[opt].en}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Full Scriptural Purport / Explanation */}
                  {q.explanation.hi && (
                    <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-gray-800 space-y-1">
                      <p className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">व्याख्या / Explanation:</p>
                      <p className="leading-relaxed">{q.explanation.hi}</p>
                      <p className="text-gray-600 italic leading-relaxed">{q.explanation.en}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Free Class Invitation */}
        <div className="p-6 bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl border border-amber-800 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Next Step</span>
            <h4 className="text-xl font-bold text-amber-50">Join our Weekly Free Bhagavad-gītā Class</h4>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl">
              Meet experienced mentors, clarify spiritual doubts, and experience the bliss of Vaishnava sanga.
            </p>
          </div>
          <Link
            href="/live-classes"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Join a Free Class</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    );
  }

  // 3. Active Gaming Quiz Arena
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const timerFraction = timerDuration > 0 ? timeLeft / timerDuration : 1;
  const isTimerUrgent = timeLeft <= 3 && timerDuration > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 pb-36">
      
      {/* Top Gaming Dashboard (HUD) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm flex items-center justify-between gap-4">
        
        {/* Left: Progress & Question number */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-300">
            {currentIndex + 1}/{questions.length}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vedic Arena</p>
            <p className="text-sm font-black text-gray-900">{score} Points</p>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        {timerDuration > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-200 bg-amber-50">
            <Timer className={`w-4 h-4 ${isTimerUrgent ? "text-rose-600 animate-spin" : "text-amber-700"}`} />
            <span className={`font-mono text-sm font-black ${isTimerUrgent ? "text-rose-600 animate-pulse text-base" : "text-amber-900"}`}>
              {timeLeft}s
            </span>
          </div>
        )}

        {/* Right: Streak & Background Music Controls */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black animate-bounce">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
              <span>{streak}x Streak!</span>
            </div>
          )}

          {/* BG Music Toggle */}
          <button
            type="button"
            onClick={toggleBgMusic}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
              bgMusicPlaying 
                ? "bg-amber-600 text-white border-amber-600 shadow-sm" 
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-amber-50"
            }`}
            title="Toggle Devotional Background Music"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{bgMusicPlaying ? "Music ON" : "Music OFF"}</span>
            {bgMusicPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-white rounded-full equalizer-bar-1" />
                <span className="w-1 bg-white rounded-full equalizer-bar-2" />
                <span className="w-1 bg-white rounded-full equalizer-bar-3" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Timer Progress Bar */}
      {timerDuration > 0 && (
        <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ${
              isTimerUrgent ? "bg-rose-500 animate-pulse" : "bg-gradient-to-r from-amber-500 to-orange-500"
            }`}
            style={{ width: `${timerFraction * 100}%` }}
          />
        </div>
      )}

      {/* Main Question & Pastel Answer Cards Area */}
      <div className={`bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-vedic space-y-6 relative overflow-hidden ${
        isAnswered && selectedOption !== currentQ.correctAnswer ? "animate-shake" : ""
      }`}>

        {/* Floating Score Animation on Correct Answer */}
        {floatingScore !== null && (
          <div className="absolute top-6 right-8 text-2xl font-black text-amber-600 animate-float-score pointer-events-none z-30">
            +{floatingScore} XP! 🌸
          </div>
        )}

        {/* Optional Question Image */}
        {currentQ.imageUrl && (
          <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-amber-200 shadow-inner bg-stone-100">
            <Image
              src={currentQ.imageUrl}
              alt="Question illustration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Question Text (Bilingual Dual Display) */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
            {currentQ.question.hi}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium italic">
            {currentQ.question.en}
          </p>
        </div>

        {/* 4 Pastel Answer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const isSelected = selectedOption === optKey;
            const isCorrect = currentQ.correctAnswer === optKey;

            let cardStateClass = pastelStyles[optKey];
            if (isAnswered) {
              if (isCorrect) {
                cardStateClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 shadow-lg scale-[1.02] ring-4 ring-emerald-200";
              } else if (isSelected && !isCorrect) {
                cardStateClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 ring-4 ring-rose-200 animate-shake";
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
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-3.5 transform active:scale-98 ${cardStateClass}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isAnswered && isCorrect ? "bg-emerald-600 text-white" :
                  isAnswered && isSelected && !isCorrect ? "bg-rose-600 text-white" :
                  "bg-white/80 border border-current shadow-xs"
                }`}>
                  {isAnswered && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : optKey}
                </span>

                <div className="grow">
                  <p className="text-sm sm:text-base font-bold leading-snug">
                    {currentQ.options[optKey].hi}
                  </p>
                  <p className="text-xs opacity-80 mt-1 font-medium">
                    {currentQ.options[optKey].en}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Gaming Animation Banner & Explanation */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-4 animate-pop-in">
            {selectedOption === currentQ.correctAnswer ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-black text-base">🌸 अद्भुत! HARI BOL! CORRECT ANSWER!</p>
                  <p className="text-xs text-emerald-800">Advancing automatically in a moment...</p>
                </div>
              </div>
            ) : isTimeUp ? (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3 text-amber-950">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-base">⌛ TIME IS UP! (समय समाप्त)</p>
                  <p className="text-xs text-amber-800">Correct Answer is option {currentQ.correctAnswer}. Review explanation below and click Continue.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-rose-950">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-base">🙏 पुनः विचार करें! (INCORRECT ANSWER)</p>
                  <p className="text-xs text-rose-800">The correct answer is highlighted in green. Read the explanation and click Continue below.</p>
                </div>
              </div>
            )}

            {/* Explanation Card */}
            {currentQ.explanation.hi && (
              <div className="p-4 sm:p-5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs sm:text-sm text-gray-800 space-y-1">
                <p className="font-bold text-amber-900 uppercase tracking-wider text-xs">व्याख्या / Scriptural Explanation:</p>
                <p className="leading-relaxed font-medium">{currentQ.explanation.hi}</p>
                <p className="text-gray-600 italic leading-relaxed">{currentQ.explanation.en}</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* PROMINENT FIXED FLOATING BOTTOM BAR FOR CONTINUE ACTION */}
      {isAnswered && (selectedOption !== currentQ.correctAnswer || isTimeUp) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 p-4 shadow-2xl animate-fade-in">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-700">Take a breath, absorb the knowledge, and move forward.</p>
            </div>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Continue to Next Question / आगे बढ़ें</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function QuizPlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Loading Vedic Quiz Arena...</p>
        </div>
      }
    >
      <QuizPlayInner />
    </Suspense>
  );
}
