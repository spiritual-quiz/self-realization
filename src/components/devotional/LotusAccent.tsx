import React from "react";

export default function LotusAccent({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 ${className}`}>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-400" />
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-amber-500 animate-pulse"
      >
        <path d="M12 2C12 2 13.5 6 16.5 8C19.5 10 22 12 22 12C22 12 18.5 13.5 17 16.5C15.5 19.5 12 22 12 22C12 22 10.5 18.5 7.5 16.5C4.5 14.5 2 12 2 12C2 12 5.5 10.5 7 7.5C8.5 4.5 12 2 12 2Z" opacity="0.85" />
      </svg>
      <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-400" />
    </div>
  );
}
