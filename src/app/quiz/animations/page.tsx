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
      id: "w1",
      title: "Option W1: 😭 Loudly Crying Face",
      description: "Dramatic fountains of tears streaming down. High-definition 3D animated emoticon.",
      src: "/images/quiz/wrong_1_loudcry.gif",
      badge: "Option W1",
    },
    {
      id: "w2",
      title: "Option W2 (Active): 😢 Gentle Tear Weeping Face",
      description: "Frowning sad face with a single tear rolling down the cheek. Mild and sympathetic.",
      src: "/images/quiz/wrong_2_tearsad.gif",
      badge: "Option W2 (Active)",
    },
    {
      id: "w3",
      title: "Option W3: 🥺 Pleading Puppy-Eyes Face",
      description: "Big glossy pleading eyes quivering with a sad cute expression. Very lovable.",
      src: "/images/quiz/wrong_3_pleading.gif",
      badge: "Option W3",
    },
    {
      id: "w4",
      title: "Option W4: 😔 Downcast Sighing Face",
      description: "Eyes closed in gentle regretful contemplation. Mature and calm.",
      src: "/images/quiz/wrong_4_downcast.gif",
      badge: "Option W4",
    },
    {
      id: "w5",
      title: "Option W5: 😞 Disappointed Frowning Face",
      description: "Classic disappointed frown looking down. Clear and direct feedback.",
      src: "/images/quiz/wrong_5_disappointed.gif",
      badge: "Option W5",
    },
    {
      id: "w6",
      title: "Option W6: 😣 Squeezed Eyes 'So Close!' Face",
      description: "Tight squeezed eyes with an 'Argh, almost got it!' energetic expression.",
      src: "/images/quiz/wrong_6_frustrated.gif",
      badge: "Option W6",
    },
  ];

  const correctOptions = [
    {
      id: "r1",
      title: "Option R1: 🥳 Partying Celebration Face",
      description: "Party hat, blowing noisemaker horn with floating colorful confetti. Highly festive!",
      src: "/images/quiz/correct_1_party.gif",
      badge: "Option R1",
    },
    {
      id: "r2",
      title: "Option R2 (Active): 🤩 Star-Struck Victory Face",
      description: "Spinning golden stars in eyes with a wide victory smile. Very rewarding!",
      src: "/images/quiz/correct_2_stars.gif",
      badge: "Option R2 (Active)",
    },
    {
      id: "r3",
      title: "Option R3: 😃 Beaming Joyful Grin",
      description: "Warm, energetic laughing emoticon with sparkling eyes. Clean and friendly.",
      src: "/images/quiz/correct_3_beaming.gif",
      badge: "Option R3",
    },
    {
      id: "r4",
      title: "Option R4: 😎 Cool Sunglasses Champion",
      description: "Confident nodding emoticon wearing shades with a smooth winner grin.",
      src: "/images/quiz/correct_4_cool.gif",
      badge: "Option R4",
    },
    {
      id: "r5",
      title: "Option R5: 👍 Energetic Thumbs-Up",
      description: "Animated bouncing thumbs up gesture indicating approval and a great job.",
      src: "/images/quiz/correct_5_thumbsup.gif",
      badge: "Option R5",
    },
    {
      id: "r6",
      title: "Option R6: 👏 Applause / Clapping Hands",
      description: "Enthusiastic animated clapping hands celebrating a wise and correct answer.",
      src: "/images/quiz/correct_6_clapping.gif",
      badge: "Option R6",
    },
  ];

  const thinkingOptions = [
    {
      id: "t1",
      title: "Option T1 (Active): 🤔 Classic Chin-Stroke Face",
      description: "Finger on chin, furrowed brow, looking up in thought. The universal standard thinking emoticon.",
      src: "/images/quiz/thinking_1_classic.gif",
      badge: "Option T1 (Active)",
    },
    {
      id: "t2",
      title: "Option T2: 🧐 Scholar Monocle Face",
      description: "Wearing a golden monocle, scrutinizing the question deeply like a scholar or detective.",
      src: "/images/quiz/thinking_2_monocle.gif",
      badge: "Option T2",
    },
    {
      id: "t3",
      title: "Option T3: 🤨 Raised Eyebrow Pondering",
      description: "One eyebrow raised high, weighing choices and questioning possibilities with intense contemplation.",
      src: "/images/quiz/thinking_3_eyebrow.gif",
      badge: "Option T3",
    },
    {
      id: "t4",
      title: "Option T4: 😕 Puzzled & Wondering Face",
      description: "Slightly confused slanted expression, searching memory for the right scripture reference.",
      src: "/images/quiz/thinking_4_confused.gif",
      badge: "Option T4",
    },
    {
      id: "t5",
      title: "Option T5: 🧠 Cognitive Brainpower",
      description: "3D pulsating animated brain, symbolizing deep intellect, memory recall, and Vedic contemplation.",
      src: "/images/quiz/thinking_5_brain.gif",
      badge: "Option T5",
    },
    {
      id: "t6",
      title: "Option T6: 💡 Glowing Light Bulb / Idea",
      description: "Shining yellow filament light bulb, blinking with inspiration as the player thinks through the answer.",
      src: "/images/quiz/thinking_6_bulb.gif",
      badge: "Option T6",
    },
  ];

  const handleSimulate = (src: string, mode: "wrong" | "correct" | "thinking") => {
    setActiveSimulation({ src, mode: mode === "thinking" ? "correct" : mode });
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

        {/* SECTION 3: THINKING CONTEMPLATION (T1 to T6) */}
        <div className="mb-14">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-500/30 mb-6">
            <span className="text-2xl">🤔</span>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif">
              Thinking / Contemplation Animation Options (Shown after 5s)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {thinkingOptions.map((opt) => (
              <div 
                key={opt.id}
                className={`rounded-3xl p-5 flex flex-col items-center text-center backdrop-blur-md shadow-xl transition-all hover:-translate-y-1 ${
                  opt.id === "t1" 
                    ? "bg-amber-500/15 border-2 border-amber-400 ring-2 ring-amber-400/30" 
                    : "bg-white/5 border-2 border-amber-500/30 hover:border-amber-400"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    opt.id === "t1" 
                      ? "bg-amber-400 text-amber-950 font-black shadow-xs" 
                      : "bg-amber-900/40 text-amber-300 border border-amber-500/30"
                  }`}>
                    {opt.badge}
                  </span>
                  {opt.id === "t1" && (
                    <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Check className="w-3 h-3 text-amber-400" /> Active
                    </span>
                  )}
                </div>

                {/* Animated GIF Display */}
                <div className="relative w-36 h-36 my-2 flex items-center justify-center p-2 rounded-2xl bg-black/30 border border-white/5">
                  <Image
                    src={opt.src}
                    alt={opt.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <h3 className="font-bold text-amber-100 text-base mt-2">
                  {opt.title}
                </h3>
                <p className="text-xs text-amber-200/70 mt-1 mb-4 flex-1">
                  {opt.description}
                </p>

                <button
                  type="button"
                  onClick={() => handleSimulate(opt.src, "thinking")}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md cursor-pointer transition-all transform active:scale-95"
                >
                  ▶ Test Simulation
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
