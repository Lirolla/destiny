import React, { createContext, useContext, useState, useCallback } from "react";

export type AppLanguage = "en" | "pt" | "es";

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (translations: { en: string; pt?: string; es?: string }) => string;
}

const LANGUAGE_STORAGE_KEY = "app-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectDeviceLanguage(): AppLanguage {
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.toLowerCase().substring(0, 2);
  if (langCode === "pt") return "pt";
  if (langCode === "es") return "es";
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "pt" || saved === "es") return saved;
    if (saved === "en") return "en";
    // No saved preference — auto-detect from device
    return detectDeviceLanguage();
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Also sync the old per-page keys for backward compatibility
    localStorage.setItem("audiobook-language", lang);
    localStorage.setItem("book-language", lang);
  }, []);

  const t = useCallback(
    (translations: { en: string; pt?: string; es?: string }) => {
      const text = translations[language];
      return text ?? translations.en; // Fallback to English if translation missing
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
