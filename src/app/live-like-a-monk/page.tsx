"use client";

import React, { useState } from "react";
import { ExternalLink, RefreshCw, Maximize2, Minimize2, Sparkles, Compass } from "lucide-react";

export default function LiveLikeAMonkPage() {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={`w-full flex flex-col bg-stone-950 ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "min-h-[calc(100vh-80px)]"}`}>
      
      {/* Top Experience Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-200/90 px-4 sm:px-6 py-2.5 text-xs flex items-center justify-between border-b border-amber-800/40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-[10px] font-bold">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white text-xs sm:text-sm">Live Like a Monk</span>
            <span className="hidden md:inline text-amber-300/70 text-xs ml-2">
              • Official ISKCON NVCC Ashram Immersion Experience
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            title="Reload Page"
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>

          <a
            href="https://live-like-a-monk.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs"
          >
            <span>Open Dedicated Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Embedded Application Container */}
      <div className="relative flex-1 w-full bg-stone-900">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950 text-amber-100 z-10 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white tracking-wide">
                Loading Live Like a Monk...
              </p>
              <p className="text-xs text-amber-300/80">
                Connecting to ISKCON NVCC Residential Portal
              </p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="https://live-like-a-monk.vercel.app/"
          className={`w-full border-0 block ${isFullscreen ? "h-[calc(100vh-42px)]" : "h-[calc(100vh-125px)] sm:h-[calc(100vh-135px)]"}`}
          title="Live Like a Monk"
          onLoad={() => setLoading(false)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    </div>
  );
}
