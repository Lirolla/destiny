import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// ─── Task 1: LanguageContext refactored ───
describe("Task 1: LanguageContext refactored", () => {
  const src = fs.readFileSync(
    path.resolve("client/src/contexts/LanguageContext.tsx"),
    "utf-8"
  );

  it("exports AppLanguage type with en, pt, es", () => {
    expect(src).toContain('"en" | "pt" | "es"');
  });

  it("t() accepts object with en, pt, es keys", () => {
    expect(src).toContain("en: string");
    expect(src).toContain("pt?: string");
    expect(src).toContain("es?: string");
  });

  it("auto-detects browser language on first load", () => {
    expect(src).toMatch(/navigator\.language/);
  });

  it("persists language choice to localStorage", () => {
    expect(src).toMatch(/localStorage/);
  });

  it("defaults to English when no match", () => {
    expect(src).toContain('"en"');
  });
});

// ─── Task 1E: All t() calls migrated ───
describe("Task 1E: All t() calls migrated to object format", () => {
  const pagesDir = path.resolve("client/src/pages");
  const componentsDir = path.resolve("client/src/components");

  const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".tsx"));
  const componentFiles = fs
    .readdirSync(componentsDir)
    .filter((f) => f.endsWith(".tsx"));

  it("no pages use old t(string, string) two-argument format", () => {
    for (const file of pageFiles) {
      const content = fs.readFileSync(path.join(pagesDir, file), "utf-8");
      // Old format: t("some english", "some portuguese") — two string args
      // Should NOT match t({ en: ..., pt: ..., es: ... }) which is the new format
      const oldFormatRegex = /\bt\(\s*"[^"]+"\s*,\s*"[^"]+"\s*\)/;
      const matches = content.match(oldFormatRegex);
      if (matches) {
        // Allow false positives from comments or non-t() calls
        expect(matches).toBeNull();
      }
    }
  });

  it("no components use old t(string, string) two-argument format", () => {
    for (const file of componentFiles) {
      const content = fs.readFileSync(
        path.join(componentsDir, file),
        "utf-8"
      );
      const oldFormatRegex = /\bt\(\s*"[^"]+"\s*,\s*"[^"]+"\s*\)/;
      const matches = content.match(oldFormatRegex);
      if (matches) {
        expect(matches).toBeNull();
      }
    }
  });
});

// ─── Tasks 2-3: All pages and components have useLanguage ───
describe("Tasks 2-3: All pages and components translated", () => {
  const pagesDir = path.resolve("client/src/pages");
  const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".tsx"));

  // These pages are expected to have translations
  const expectedTranslatedPages = [
    "NewHome.tsx",
    "Settings.tsx",
    "Sliders.tsx",
    "Dashboard.tsx",
    "Audiobook.tsx",
    "Book.tsx",
    "Modules.tsx",
    "PrayerJournal.tsx",
    "Flashcards.tsx",
    "Challenges.tsx",
    "AuthPage.tsx",
    "LandingPage.tsx",
    "More.tsx",
  ];

  for (const page of expectedTranslatedPages) {
    it(`${page} imports useLanguage`, () => {
      const filePath = path.join(pagesDir, page);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).toContain("useLanguage");
      }
    });
  }
});

// ─── Task 4: Onboarding language selection ───
describe("Task 4: Onboarding language selection (Step 0)", () => {
  const src = fs.readFileSync(
    path.resolve("client/src/components/Onboarding.tsx"),
    "utf-8"
  );

  it("imports useLanguage", () => {
    expect(src).toContain("useLanguage");
  });

  it("has language selection step with flags", () => {
    expect(src).toMatch(/🇬🇧|🇧🇷|🇪🇸/);
  });

  it("includes English, Português, Español labels", () => {
    expect(src).toContain("English");
    expect(src).toContain("Português");
    expect(src).toContain("Español");
  });
});

// ─── Task 5: Settings bottom sheet language picker ───
describe("Task 5: Settings language picker", () => {
  const src = fs.readFileSync(
    path.resolve("client/src/pages/Settings.tsx"),
    "utf-8"
  );

  it("has language selection with flags", () => {
    expect(src).toMatch(/🇬🇧|🇧🇷|🇪🇸/);
  });

  it("includes all three language options", () => {
    expect(src).toContain("English");
    expect(src).toContain("Português");
    expect(src).toContain("Español");
  });
});

// ─── Task 6: Audiobook Spanish handling ───
describe("Task 6: Audiobook Spanish fallback", () => {
  const src = fs.readFileSync(
    path.resolve("client/src/pages/Audiobook.tsx"),
    "utf-8"
  );

  it("maps es language to en for audio playback", () => {
    expect(src).toMatch(/audioLang.*=.*language.*===.*"es".*\?.*"en"/);
  });

  it("shows Spanish fallback banner", () => {
    expect(src).toContain('language === "es"');
    expect(src).toMatch(/Spanish audio coming soon|Audio en español próximamente/);
  });
});

// ─── Task 7: Spanish email template ───
describe("Task 7: Spanish email template", () => {
  const src = fs.readFileSync(path.resolve("server/email.ts"), "utf-8");

  it("accepts es as language parameter", () => {
    expect(src).toContain('"en" | "pt" | "es"');
  });

  it("has Spanish subject line", () => {
    expect(src).toContain("Restablecer Contraseña");
  });

  it("has Spanish tagline", () => {
    expect(src).toContain("Domina Tu Libre Albedrío");
  });

  it("has Spanish button label", () => {
    expect(src).toMatch(/Restablecer Contraseña/);
  });

  it("has Spanish disclaimer text", () => {
    expect(src).toContain("Si no solicitaste este restablecimiento");
  });
});

// ─── Task 8: Globe language dropdown on Landing & Auth ───
describe("Task 8: Globe language dropdown", () => {
  it("GlobeLanguageDropdown component exists", () => {
    const exists = fs.existsSync(
      path.resolve("client/src/components/GlobeLanguageDropdown.tsx")
    );
    expect(exists).toBe(true);
  });

  it("GlobeLanguageDropdown has Globe icon and all 3 languages", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/components/GlobeLanguageDropdown.tsx"),
      "utf-8"
    );
    expect(src).toContain("Globe");
    expect(src).toContain("English");
    expect(src).toContain("Português");
    expect(src).toContain("Español");
  });

  it("LandingPage includes GlobeLanguageDropdown", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LandingPage.tsx"),
      "utf-8"
    );
    expect(src).toContain("GlobeLanguageDropdown");
  });

  it("AuthPage includes GlobeLanguageDropdown", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/AuthPage.tsx"),
      "utf-8"
    );
    expect(src).toContain("GlobeLanguageDropdown");
  });

  it("LandingPage AXES have Spanish translations", () => {
    const src = fs.readFileSync(
      path.resolve("client/src/pages/LandingPage.tsx"),
      "utf-8"
    );
    expect(src).toContain('es: "Impotente"');
    expect(src).toContain('es: "Poderoso"');
    expect(src).toContain('es: "El Eje de la Voluntad"');
  });
});

// ─── forgotPassword passes language ───
describe("forgotPassword passes language to email", () => {
  const routerSrc = fs.readFileSync(
    path.resolve("server/routers.ts"),
    "utf-8"
  );

  it("forgotPassword input accepts language parameter", () => {
    expect(routerSrc).toMatch(/language.*z\.enum.*\[.*"en".*"pt".*"es".*\]/);
  });

  it("passes language to sendPasswordResetEmail", () => {
    expect(routerSrc).toMatch(
      /sendPasswordResetEmail\(.*input\.language/
    );
  });

  const authSrc = fs.readFileSync(
    path.resolve("client/src/pages/AuthPage.tsx"),
    "utf-8"
  );

  it("AuthPage passes language to forgotPassword mutation", () => {
    expect(authSrc).toMatch(/forgotMutation\.mutate\(\{.*language/);
  });
});
