import React, { createContext, useContext, useState, useCallback } from "react";

export type AppLanguage = "en" | "pt";

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (en: string, pt: string) => string;
}

const LANGUAGE_STORAGE_KEY = "app-language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "pt" ? "pt" : "en";
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Also sync the old per-page keys for backward compatibility
    localStorage.setItem("audiobook-language", lang);
    localStorage.setItem("book-language", lang);
  }, []);

  const t = useCallback(
    (en: string, pt: string) => (language === "pt" ? pt : en),
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
