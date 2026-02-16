import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, "..", filePath), "utf-8");
}

describe("Phase 78: Cookie Consent Banner", () => {
  const content = readFile("client/src/components/CookieConsent.tsx");

  it("exists as a component file", () => {
    expect(content).toBeTruthy();
  });

  it("imports useLanguage for trilingual support", () => {
    expect(content).toContain("useLanguage");
  });

  it("uses localStorage key 'cookie_notice_dismissed'", () => {
    expect(content).toContain("cookie_notice_dismissed");
  });

  it("has a 1.5 second delay before showing", () => {
    expect(content).toContain("1500");
    expect(content).toContain("setTimeout");
  });

  it("has dismiss function that sets localStorage", () => {
    expect(content).toContain("localStorage.setItem");
    expect(content).toContain("dismiss");
  });

  it("has English translation for cookie notice", () => {
    expect(content).toContain("essential cookies and local storage");
  });

  it("has Portuguese translation for cookie notice", () => {
    expect(content).toContain("cookies essenciais e armazenamento local");
  });

  it("has Spanish translation for cookie notice", () => {
    expect(content).toContain("cookies esenciales y almacenamiento local");
  });

  it("links to Privacy Policy", () => {
    expect(content).toContain('href="/privacy"');
  });

  it("has Got it button with translations", () => {
    expect(content).toContain('en: "Got it"');
    expect(content).toContain('pt: "Entendi"');
    expect(content).toContain('es: "Entendido"');
  });

  it("has X close button", () => {
    expect(content).toContain("lucide-react");
    expect(content).toContain("<X");
  });

  it("uses slide-in animation", () => {
    expect(content).toContain("animate-in");
    expect(content).toContain("slide-in-from-bottom");
  });

  it("adjusts position based on auth state", () => {
    expect(content).toContain("bottom-20");
    expect(content).toContain("bottom-4");
    expect(content).toContain("isAuthenticated");
  });

  it("uses dark theme styling", () => {
    expect(content).toContain("bg-zinc-900");
    expect(content).toContain("border-zinc-700");
  });

  it("has emerald-colored action button", () => {
    expect(content).toContain("bg-emerald-600");
  });
});

describe("Phase 78: Cookie Consent in App.tsx", () => {
  const content = readFile("client/src/App.tsx");

  it("imports CookieConsent component", () => {
    expect(content).toContain('import { CookieConsent }');
  });

  it("renders CookieConsent inside LanguageProvider", () => {
    const langProviderStart = content.indexOf("<LanguageProvider>");
    const langProviderEnd = content.indexOf("</LanguageProvider>");
    const cookieConsentPos = content.indexOf("<CookieConsent />");
    expect(cookieConsentPos).toBeGreaterThan(langProviderStart);
    expect(cookieConsentPos).toBeLessThan(langProviderEnd);
  });
});

describe("Phase 78: Arsenal/More Page Cleanup", () => {
  const content = readFile("client/src/pages/More.tsx");

  // Removed features should NOT be present
  it("does NOT contain Emotional Sliders link", () => {
    expect(content).not.toContain('path: "/sliders"');
  });

  it("does NOT contain Progress Dashboard link", () => {
    expect(content).not.toContain('path: "/progress"');
  });

  it("does NOT contain Command Bridge link", () => {
    expect(content).not.toContain('path: "/dashboard"');
  });

  it("does NOT contain Achievements link", () => {
    expect(content).not.toContain('path: "/achievements"');
  });

  it("does NOT contain Flashcards link", () => {
    expect(content).not.toContain('path: "/flashcards"');
  });

  it("does NOT contain AI Insights link", () => {
    expect(content).not.toContain('path: "/insights"');
  });

  it("does NOT contain Philosophy link", () => {
    expect(content).not.toContain('path: "/philosophy"');
  });

  it("does NOT contain Privacy & Data link", () => {
    expect(content).not.toContain("Privacy & Data");
    expect(content).not.toContain("Privacidade e Dados");
  });

  // Kept features should be present
  it("contains Daily Cycle", () => {
    expect(content).toContain('path: "/daily-cycle"');
  });

  it("contains Bias Clearing", () => {
    expect(content).toContain('path: "/bias-clearing"');
  });

  it("contains Prayer Journal", () => {
    expect(content).toContain('path: "/prayer-journal"');
  });

  it("contains Weekly Review", () => {
    expect(content).toContain('path: "/weekly-review"');
  });

  it("contains Monthly Report", () => {
    expect(content).toContain('path: "/monthly-report"');
  });

  it("contains Sowing & Reaping", () => {
    expect(content).toContain('path: "/sowing-reaping"');
  });

  it("contains Inner Circle", () => {
    expect(content).toContain('path: "/inner-circle"');
  });

  it("contains Challenges", () => {
    expect(content).toContain('path: "/challenges"');
  });

  // Group titles
  it("has Daily Practice group title", () => {
    expect(content).toContain('en: "Daily Practice"');
    expect(content).toContain('pt: "Prática Diária"');
    expect(content).toContain('es: "Práctica Diaria"');
  });

  it("has Growth & Community group title", () => {
    expect(content).toContain('en: "Growth & Community"');
    expect(content).toContain('pt: "Crescimento e Comunidade"');
    expect(content).toContain('es: "Crecimiento y Comunidad"');
  });

  // Updated header
  it("has Arsenal as page title", () => {
    expect(content).toContain('en: "Arsenal"');
  });

  it("has updated subtitle about Bridge", () => {
    expect(content).toContain('en: "Tools not on your Bridge"');
    expect(content).toContain('pt: "Ferramentas fora da sua Ponte"');
    expect(content).toContain('es: "Herramientas fuera de tu Puente"');
  });

  // Has exactly 2 menu sections (groups)
  it("has exactly 2 menu section groups", () => {
    const sectionMatches = content.match(/title: t\(\{/g);
    // 2 group titles + header title = we check the menuSections array has 2 objects
    const menuSectionsMatch = content.match(/\{\s*title:/g);
    expect(menuSectionsMatch).toBeTruthy();
    // Should have 2 section objects in menuSections array
    expect(menuSectionsMatch!.length).toBe(2);
  });

  // Settings section still exists
  it("still has Settings link", () => {
    expect(content).toContain('href="/settings"');
  });

  // Language toggle includes ES
  it("has Spanish language toggle option", () => {
    expect(content).toContain('setLanguage("es")');
    expect(content).toContain("🇪🇸");
  });
});
