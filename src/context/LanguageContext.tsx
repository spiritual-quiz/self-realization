"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  showLangModal: boolean;
  setShowLangModal: (show: boolean) => void;
  confirmInitialLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [showLangModal, setShowLangModal] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Check saved language preference from localStorage and cookie
    const saved = localStorage.getItem("sr_language") as Language | null;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
      setShowLangModal(false);
    } else {
      // First-time visitor: display language-selection popup
      setShowLangModal(true);
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sr_language", lang);
    document.cookie = `sr_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const confirmInitialLanguage = (lang: Language) => {
    setLanguage(lang);
    setShowLangModal(false);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        showLangModal: isInitialized ? showLangModal : false,
        setShowLangModal,
        confirmInitialLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
