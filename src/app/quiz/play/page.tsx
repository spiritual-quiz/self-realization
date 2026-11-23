"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
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
  Loader2
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

  // Quiz Content State
  const [quizTitle, setQuizTitle] = useState("Bhagavad-gītā Wisdom Challenge");
  const [questions, setQuestions] = useState<ParsedQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interaction State
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ questionId: number; selected: string; correct: string; isCorrect: boolean }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThinking, setShowThinking] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Audio References
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pastel Card Colors
  const pastelStyles = {
    A: "bg-[#E8F5E9] hover:bg-[#D4EDDA] border-[#C3E6CB] text-emerald-950",
    B: "bg-[#E1F5FE] hover:bg-[#CCE5FF] border-[#B8DAFF] text-blue-950",
    C: "bg-[#FFF3E0] hover:bg-[#FFE8CC] border-[#FFE2BD] text-amber-950",
    D: "bg-[#F3E5F5] hover:bg-[#EBD3F0] border-[#E5C7EB] text-purple-950",
  };

  // Load Quiz data (From custom upload in localStorage or sample 10-questions)
  useEffect(() => {
    // Audio initializations
    correctAudioRef.current = new Audio("/audio/correct.mp3");
    wrongAudioRef.current = new Audio("/audio/wrong.mp3");
    bgAudioRef.current = new Audio("/audio/bg-music.mp3");

    // Check localStorage for custom uploaded quiz matching ID
    const localQuizzes = JSON.parse(localStorage.getItem("sr_custom_quizzes") || "[]");
    const found = localQuizzes.find((q: any) => q.id === quizIdParam);

    if (found && found.questions?.length > 0) {
      setQuizTitle(found.title.en);
      setQuestions(found.questions);
    } else {
      // Default to the 10-question verified sample bank
      const parsed = parseCSVToQuestions(SAMPLE_CSV_CONTENT);
      setQuestions(parsed.questions);
    }
  }, [quizIdParam]);

  // Thinking Animation timer (triggers after 8 seconds of hesitation)
  useEffect(() => {
    if (quizStarted && !isAnswered && !isComplete) {
      setShowThinking(false);
      thinkingTimerRef.current = setTimeout(() => {
        setShowThinking(true);
      }, 8000);
    }
    return () => {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    };
  }, [currentIndex, quizStarted, isAnswered, isComplete]);

  // Play Sound helper
  const playSound = (type: "correct" | "wrong" | "bg") => {
    if (!soundEnabled) return;
    try {
      if (type === "correct" && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0;
        correctAudioRef.current.play().catch(() => {});
      } else if (type === "wrong" && wrongAudioRef.current) {
        wrongAudioRef.current.currentTime = 0;
        wrongAudioRef.current.play().catch(() => {});
      } else if (type === "bg" && bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.volume = 0.4;
        bgAudioRef.current.play().catch(() => {});
      }
    } catch (e) {
      // Browser autoplay policies handled gracefully
    }
  };

  // Handle Option Select
  const handleSelectOption = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    setSelectedOption(optKey);
    setIsAnswered(true);
    setShowThinking(false);

    const currentQ = questions[currentIndex];
    const isCorrect = optKey === currentQ.correctAnswer;

    // Log answer
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
      setScore((s) => s + currentQ.points);
      playSound("correct");

      // Falling Petals / Floral Confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#F43F5E", "#EC4899", "#10B981", "#D97706"],
        shapes: ["circle"],
      });

      // Auto-advance after 2.8 seconds on correct answer
      setTimeout(() => {
        handleNextQuestion();
      }, 2800);
    } else {
      playSound("wrong");
      // Wait for manual click on Continue for wrong answer
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
      playSound("bg");
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  // Download PDF Certificate
  const handleDownloadCertificate = async () => {
    setGeneratingPdf(true);
    try {
      const totalMarks = questions.reduce((a, b) => a + b.points, 0);
      const percentage = (score / totalMarks) * 100;
      const certId = "SR-Q-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      const pdfBytes = await generateQuizCertificatePdf({
        certificateId: certId,
        participantName: participantName || "Sincere Spiritual Seeker",
        quizTitle,
        score,
        totalMarks,
        percentage,
        dateStr: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      });

      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SelfRealization_Certificate_${certId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // 1. Participant Entry Gate (No Password or Login Required)
  if (!quizStarted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto shadow-md">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              100% Free • No Login Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              {quizTitle}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Test your understanding of timeless Vedic wisdom. Earn flowers, points, and a downloadable certificate!
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (participantName.trim()) setQuizStarted(true);
            }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">
                Your Name (for Certificate) *
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
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>Start Quiz Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="text-[11px] text-gray-400">
            Bilingual dual Q&A display • Sound FX • Instant Verification
          </p>
        </div>
      </div>
    );
  }

  // 2. Completion Screen
  if (isComplete) {
    const totalMarks = questions.reduce((a, b) => a + b.points, 0);
    const percentage = (score / totalMarks) * 100;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner text-4xl">
            🏆
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Quiz Completed!
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Congratulations, {participantName}!
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              You have completed the {quizTitle} with great devotion.
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-around">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-700">{score}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Points Earned</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">{percentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Accuracy</p>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <p className="text-3xl sm:text-4xl font-black text-purple-700">{questions.length}</p>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-1">Total Questions</p>
            </div>
          </div>

          {/* Download Certificate CTA */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadCertificate}
              disabled={generatingPdf}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5 text-amber-200" />
              <span>{generatingPdf ? "Generating Official Certificate..." : "Download Official Certificate (PDF)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setReviewMode(!reviewMode)}
              className="w-full py-3 px-5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              {reviewMode ? "Hide Answer Review" : "Review All Answers & Explanations"}
            </button>
          </div>

          {/* Prominent Invitation to Join Free Class */}
          <div className="p-6 bg-amber-950 text-white rounded-2xl border border-amber-800 text-left space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Next Devotional Step</span>
            <h4 className="text-lg font-bold text-amber-50">Deepen your realization with our Weekly Free Class</h4>
            <p className="text-xs text-amber-200/80">
              Join live interactive Zoom sessions and in-person discussions with senior practitioners every week.
            </p>
            <Link
              href="/live-classes"
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl transition-colors"
            >
              <span>Join a Free Class</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Answer Review Section */}
        {reviewMode && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900">Question & Answer Review</h3>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const log = answersLog.find((a) => a.questionId === q.id);
                return (
                  <div key={q.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 space-y-2 text-xs">
                    <p className="font-bold text-gray-900">{idx + 1}. {q.question.hi} / {q.question.en}</p>
                    <div className="flex gap-4">
                      <span className="text-gray-500">Your choice: <strong className={log?.isCorrect ? "text-emerald-700" : "text-rose-700"}>{log?.selected}</strong></span>
                      <span className="text-emerald-700">Correct: <strong>{q.correctAnswer}</strong></span>
                    </div>
                    {q.explanation.hi && (
                      <p className="text-amber-900 bg-white p-2 rounded-lg border border-amber-200">
                        <strong>Explanation:</strong> {q.explanation.hi} / {q.explanation.en}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Active Quiz Arena
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top Header: Progress & Sound Control */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-bold text-gray-500">
            Score: {score} Pts
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card (Bilingual Dual Display) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-vedic space-y-4 relative overflow-hidden">
        
        {/* Thinking Encouragement Prompt */}
        {showThinking && !isAnswered && (
          <div className="p-3 bg-amber-100/80 rounded-2xl border border-amber-300 flex items-center gap-2.5 text-xs text-amber-900 animate-fade-in">
            <Smile className="w-5 h-5 text-amber-700 shrink-0 animate-bounce" />
            <span>Take your time! Reflect on the teachings of the Gita; truth is eternal.</span>
          </div>
        )}

        <div className="space-y-2">
          {/* Hindi Question */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {currentQ.question.hi}
          </h2>
          {/* English Question */}
          <p className="text-sm sm:text-base text-gray-600 font-medium italic">
            {currentQ.question.en}
          </p>
        </div>

        {/* 4 Pastel Answer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const isSelected = selectedOption === optKey;
            const isCorrect = currentQ.correctAnswer === optKey;

            let cardStateClass = pastelStyles[optKey];
            if (isAnswered) {
              if (isCorrect) {
                cardStateClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 shadow-md";
              } else if (isSelected && !isCorrect) {
                cardStateClass = "bg-rose-100 border-2 border-rose-500 text-rose-950 animate-shake";
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
                className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-start gap-3 transform active:scale-98 ${cardStateClass}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAnswered && isCorrect ? "bg-emerald-600 text-white" :
                  isAnswered && isSelected && !isCorrect ? "bg-rose-600 text-white" :
                  "bg-white/80 border border-current"
                }`}>
                  {isAnswered && isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : optKey}
                </span>

                <div className="grow">
                  <p className="text-sm font-bold leading-snug">
                    {currentQ.options[optKey].hi}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {currentQ.options[optKey].en}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Section */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-4 animate-fade-in">
            {selectedOption === currentQ.correctAnswer ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>अद्भुत! सही उत्तर! / Correct Answer! (+{currentQ.points} Points)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>पुनः विचार करें! / Not quite right. The correct option is {currentQ.correctAnswer}.</span>
              </div>
            )}

            {currentQ.explanation.hi && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-gray-800 space-y-1">
                <p className="font-bold text-amber-900">व्याख्या / Explanation:</p>
                <p>{currentQ.explanation.hi}</p>
                <p className="text-gray-600 italic">{currentQ.explanation.en}</p>
              </div>
            )}

            {/* If wrong answer, wait for manual continue button */}
            {selectedOption !== currentQ.correctAnswer && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="py-3 px-6 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center gap-2"
                >
                  <span>Continue / आगे बढ़ें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
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
