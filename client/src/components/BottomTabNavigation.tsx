import { useLocation } from "wouter";
import { Home, BookOpen, Headphones, GraduationCap, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const tabs = [
  { id: "home", labelEn: "Bridge", labelPt: "Ponte", icon: Home, path: "/" },
  { id: "book", labelEn: "Chapters", labelPt: "Capítulos", icon: BookOpen, path: "/book" },
  { id: "audio", labelEn: "Listen", labelPt: "Ouvir", icon: Headphones, path: "/audiobook" },
  { id: "practice", labelEn: "Calibrate", labelPt: "Calibrar", icon: GraduationCap, path: "/modules" },
  { id: "more", labelEn: "Arsenal", labelPt: "Arsenal", icon: MoreHorizontal, path: "/more" },
];

export function BottomTabNavigation() {
  const [location, setLocation] = useLocation();
  const { language } = useLanguage();

  const getActiveTab = () => {
    if (location === "/") return "home";
    if (location.startsWith("/book")) return "book";
    if (location.startsWith("/audiobook")) return "audio";
    if (location.startsWith("/modules")) return "practice";
    // "More" section pages
    if (
      location.startsWith("/more") ||
      location.startsWith("/settings") ||
      location.startsWith("/achievements") ||
      location.startsWith("/progress") ||
      location.startsWith("/flashcards") ||
      location.startsWith("/daily-cycle") ||
      location.startsWith("/sliders") ||
      location.startsWith("/insights") ||
      location.startsWith("/inner-circle") ||
      location.startsWith("/challenges") ||
      location.startsWith("/sowing-reaping") ||
      location.startsWith("/profiles") ||
      location.startsWith("/weekly-review") ||
      location.startsWith("/prayer-journal") ||
      location.startsWith("/bias-clearing") ||
      location.startsWith("/dashboard")
    )
      return "more";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9990] bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setLocation(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all duration-200 relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={language === 'pt' ? tab.labelPt : tab.labelEn}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-200" />
              )}
              <Icon
                className={`transition-all duration-200 ${
                  isActive ? "w-6 h-6" : "w-5 h-5"
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-medium transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {language === 'pt' ? tab.labelPt : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
