"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";

export default function LiveLikeAMonkPage() {
  const [loading, setLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#0d0c0a] flex flex-col overflow-hidden">
      
      {/* Sleek Top Navigation Ribbon with prominent Back Button */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-200 px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-amber-800/60 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-800/80 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all transform active:scale-95 border border-amber-500/40"
          >
            <ArrowLeft className="w-4 h-4 text-amber-200" />
            <span>Back to Self Realization</span>
          </Link>
          <span className="hidden sm:inline text-xs font-medium text-amber-300/80">
            | Live Like a Monk • ISKCON NVCC Ashram Immersion
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            title="Reload Application"
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://live-like-a-monk.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all shadow-xs"
          >
            <span>Open Dedicated Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 100% Full-Screen Embedded Application (Only Live Like a Monk Menu is shown) */}
      <div className="relative flex-1 w-full h-[calc(100vh-48px)] bg-[#0d0c0a]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0c0a] text-amber-100 z-10 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white tracking-wide">
                Loading Live Like a Monk...
              </p>
              <p className="text-xs text-amber-300/80">
                Opening ISKCON NVCC Residential Ashram Portal
              </p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="https://live-like-a-monk.vercel.app/"
          className="w-full h-full border-0 block"
          title="Live Like a Monk"
          onLoad={() => setLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </div>
  );
}
