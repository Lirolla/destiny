import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, type AppLanguage } from "@/contexts/LanguageContext";

const LANGUAGES: { code: AppLanguage; flag: string; native: string }[] = [
  { code: "en", flag: "🇬🇧", native: "English" },
  { code: "pt", flag: "🇧🇷", native: "Português" },
  { code: "es", flag: "🇪🇸", native: "Español" },
];

interface GlobeLanguageDropdownProps {
  /** Additional CSS classes for the trigger button */
  className?: string;
  /** Whether to use light text (for dark backgrounds like landing page) */
  light?: boolean;
}

export function GlobeLanguageDropdown({ className = "", light = false }: GlobeLanguageDropdownProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === language)!;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-medium ${
          light
            ? "border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/50"
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.native}</span>
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50 overflow-hidden ${
            light
              ? "bg-zinc-900 border-zinc-700"
              : "bg-popover border-border"
          }`}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                language === lang.code
                  ? light
                    ? "bg-[#01D98D]/15 text-[#01D98D]"
                    : "bg-[#01D98D]/15 text-[#01D98D]"
                  : light
                    ? "text-zinc-300 hover:bg-zinc-800"
                    : "text-popover-foreground hover:bg-muted"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.native}</span>
              {language === lang.code && (
                <svg className="h-4 w-4 ml-auto text-[#01D98D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
