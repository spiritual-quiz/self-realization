"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LiveLikeAMonkClient from "./LiveLikeAMonkClient";

export default function LiveLikeAMonkPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#FFFDF9]">
      
      {/* Top Navigation Ribbon with Back Button (PERMANENTLY FROZEN / FIXED AT TOP) */}
      <header className="fixed top-0 left-0 right-0 z-[99999] h-12 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-200 px-4 sm:px-6 flex items-center justify-between border-b border-amber-800/80 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800 hover:bg-amber-700 text-white text-xs font-black shadow-md transition-all transform active:scale-95 border border-amber-500/50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-200" />
            <span>← Back to Self Realization</span>
          </Link>
          <span className="hidden sm:inline text-xs font-bold text-amber-300/90">
            | Live Like a Monk • ISKCON NVCC Residential Ashram Immersion
          </span>
        </div>

        <div className="text-[11px] text-amber-300 font-bold hidden md:block">
          Official NVCC Pune Ashram Portal
        </div>
      </header>

      {/* 100% Native Live Like a Monk Application with top padding to clear frozen bar */}
      <div className="pt-12 w-full">
        <LiveLikeAMonkClient />
      </div>
    </div>
  );
}
