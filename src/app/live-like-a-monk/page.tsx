"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LiveLikeAMonkClient from "./LiveLikeAMonkClient";

export default function LiveLikeAMonkPage() {
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FFFDF9] flex flex-col overflow-y-auto">
      
      {/* Top Navigation Ribbon with Back Button */}
      <div className="sticky top-0 z-[100] bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-200 px-4 sm:px-6 py-2 flex items-center justify-between border-b border-amber-800/60 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/80 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all transform active:scale-95 border border-amber-500/40"
          >
            <ArrowLeft className="w-4 h-4 text-amber-200" />
            <span>← Back to Self Realization</span>
          </Link>
          <span className="hidden sm:inline text-xs font-medium text-amber-300/80">
            | Live Like a Monk • ISKCON NVCC Residential Ashram Immersion
          </span>
        </div>

        <div className="text-[11px] text-amber-300/90 font-medium hidden md:block">
          Official NVCC Pune Ashram Portal
        </div>
      </div>

      {/* 100% Native Live Like a Monk Application with Synced Language */}
      <div className="grow w-full bg-[#FFFDF9]">
        <LiveLikeAMonkClient />
      </div>
    </div>
  );
}
