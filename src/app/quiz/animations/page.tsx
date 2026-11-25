"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, AlertCircle } from "lucide-react";

export default function AnimationsPreviewPage() {
  const [activeSimulation, setActiveSimulation] = useState<{
    src: string;
    mode: "wrong" | "correct";
  } | null>(null);

  const wrongOptions = [
    {
      id: "opt-emoticon-cry",
      title: "Option 1 (Active): Loudly Crying Emoticon",
      description: "High-definition animated crying emoticon with streaming water fountains. Clean and universal.",
      src: "/images/quiz/emoticon_cry.gif",
      badge: "Option 1 (Active)",
    },
    {
      id: "opt-emoticon-sad",
      title: "Option 2: Sad Tearful Emoticon",
      description: "Gentle weeping emoticon with falling tear drop.",
      src: "/images/quiz/emoticon_sad.gif",
      badge: "Option 2",
    },
    {
      id: "opt-1",
      title: "Option 3: Sadness (Inside Out)",
      description: "Iconic blue character crying fountain of tears. Highly expressive.",
      src: "/images/quiz/cry_option1_sadness.gif",
      badge: "Option 3",
    },
  ];

  const correctOptions = [
    {
      id: "dance-emoticon-party",
      title: "Option A (Active): Partying Celebration Emoticon",
      description: "Joyful party emoticon with festive horn and floating confetti celebration! Pairs with flowers.",
      src: "/images/quiz/emoticon_party.gif",
      badge: "Option A (Active)",
    },
    {
      id: "dance-emoticon-stars",
      title: "Option B: Star-Struck Grinning Emoticon",
      description: "Radiant star-eyed cheering emoticon expressing victory and excitement.",
      src: "/images/quiz/emoticon_stars.gif",
      badge: "Option B",
    },
    {
      id: "dance-b",
      title: "Option C: Snoopy Celebration Dance",
      description: "Classic joyful cartoon celebration dance, lighthearted and cheerful.",
      src: "/images/quiz/dance_option1_snoopy.gif",
      badge: "Option C",
    },
  ];

  const handleSimulate = (src: string, mode: "wrong" | "correct") => {
    setActiveSimulation({ src, mode });
    setTimeout(() => {
      setActiveSimulation(null);
    }, mode === "correct" ? 2000 : 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1c1005] via-[#2a1708] to-[#120903] text-amber-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation back */}
        <Link 
          href="/quiz"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 mb-6 bg-white/5 px-3 py-1.5 rounded-full border border-amber-500/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quiz / क्विज़ पर वापस</span>
        </Link>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
            ANIMATION SELECTOR • एनिमेषन चयन
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-amber-200 mt-3 font-serif">
            Quiz Answer Animations
          </h1>
          <p className="text-sm text-amber-100/80 mt-2">
            Click &quot;Test In-Quiz Simulation&quot; on any card below to see how it appears floating inside the quiz!
          </p>
        </div>

        {/* SECTION 1: WRONG ANSWER (CRYING) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-500/30 mb-6">
            <span className="text-2xl">😢</span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif">
              Wrong Answer: Crying Animation Options (1.5s Display)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wrongOptions.map((opt) => (
              <div 
                key={opt.id}
                className="bg-white/5 border-2 border-amber-500/30 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center backdrop-blur-md shadow-xl transition-all hover:-translate-y-1"
              >
                <span className="px-3 py-1 rounded-full bg-amber-500 text-gray-950 font-black text-xs mb-3">
                  {opt.badge}
                </span>

                <div className="relative w-48 h-48 my-3 rounded-2xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center p-2">
                  <Image
                    src={opt.src}
                    alt={opt.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  {opt.title}
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 mb-4 grow">
                  {opt.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleSimulate(opt.src, "wrong")}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-gray-950 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  ▶ Test Simulation (1.5s)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: CORRECT ANSWER (DANCING) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-500/30 mb-6">
            <span className="text-2xl">🌸🕺</span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif">
              Correct Answer: Dancing Animation Options (2.0s with Flowers)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {correctOptions.map((opt) => (
              <div 
                key={opt.id}
                className="bg-white/5 border-2 border-amber-500/30 hover:border-amber-400 rounded-3xl p-5 flex flex-col items-center text-center backdrop-blur-md shadow-xl transition-all hover:-translate-y-1"
              >
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs mb-3">
                  {opt.badge}
                </span>

                <div className="relative w-48 h-48 my-3 rounded-2xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center p-2">
                  <Image
                    src={opt.src}
                    alt={opt.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <h3 className="text-base font-bold text-white mt-2">
                  {opt.title}
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 mb-4 grow">
                  {opt.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleSimulate(opt.src, "correct")}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  ▶ Test Simulation (2.0s)
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* In-Quiz Live Simulation Modal */}
      {activeSimulation && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setActiveSimulation(null)}
        >
          {activeSimulation.mode === "correct" && (
            <div className="text-lg sm:text-2xl font-black text-emerald-400 mb-3 animate-bounce">
              🌸 +10 Points! 🌸
            </div>
          )}

          <div className="relative w-56 h-56 sm:w-72 sm:h-72 drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] animate-pop-grow">
            <Image
              src={activeSimulation.src}
              alt="Simulated Animation"
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          <p className="text-xs text-amber-300 font-bold mt-4 bg-black/50 px-4 py-1.5 rounded-full border border-amber-400/40">
            {activeSimulation.mode === "correct" ? "Disappearing in 2.0s..." : "Disappearing in 1.5s..."}
          </p>
        </div>
      )}
    </div>
  );
}
