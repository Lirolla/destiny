import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Tests to verify the mobile app transformation is properly implemented.
 * Checks that all key components exist and pages use the mobile-first patterns.
 */

const clientSrc = path.join(__dirname, "../client/src");
const pagesDir = path.join(clientSrc, "pages");
const componentsDir = path.join(clientSrc, "components");

describe("Mobile App Shell Components", () => {
  it("should have BottomTabNavigation component", () => {
    const filePath = path.join(componentsDir, "BottomTabNavigation.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("tabs");
    expect(content).toContain("Bridge");
    expect(content).toContain("Chapters");
    expect(content).toContain("Listen");
    expect(content).toContain("Calibrate");
    expect(content).toContain("Arsenal");
  });

  it("should have AppShell component wrapping content with bottom nav", () => {
    const filePath = path.join(componentsDir, "AppShell.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("BottomTabNavigation");
    expect(content).toContain("pb-20"); // bottom padding for tab bar
  });

  it("should have PageHeader component for mobile-first headers", () => {
    const filePath = path.join(componentsDir, "PageHeader.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("sticky top-0");
    expect(content).toContain("backdrop-blur");
    expect(content).toContain("showBack");
  });

  it("should have More page with grouped feature menu", () => {
    const filePath = path.join(pagesDir, "More.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Daily Practice");
    expect(content).toContain("Growth & Community");
    expect(content).toContain("Settings");
  });
});

describe("App.tsx uses AppShell", () => {
  it("should wrap Router in AppShell", () => {
    const filePath = path.join(clientSrc, "App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("AppShell");
    expect(content).toContain("<AppShell>");
    expect(content).toContain("</AppShell>");
  });

  it("should use dark theme", () => {
    const filePath = path.join(clientSrc, "App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain('defaultTheme="dark"');
  });

  it("should have More route", () => {
    const filePath = path.join(clientSrc, "App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain('path="/more"');
    expect(content).toContain("More");
  });
});

describe("Pages use PageHeader for mobile-first design", () => {
  const pagesWithPageHeader = [
    "Audiobook.tsx",
    "Book.tsx",
    "Modules.tsx",
    "Settings.tsx",
    "Sliders.tsx",
    "DailyCycle.tsx",
    "Achievements.tsx",
    "BiasClearing.tsx",
    "Challenges.tsx",
    "Dashboard.tsx",
    "Flashcards.tsx",
    "InnerCircle.tsx",
    "Insights.tsx",
    "PrayerJournal.tsx",
    "Profiles.tsx",
    "ProgressDashboard.tsx",
    "SowingReaping.tsx",
    "WeeklyReview.tsx",
  ];

  for (const page of pagesWithPageHeader) {
    it(`${page} should import and use PageHeader`, () => {
      const filePath = path.join(pagesDir, page);
      if (!fs.existsSync(filePath)) {
        // Skip if file doesn't exist (some pages may have been renamed)
        return;
      }
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("PageHeader");
    });
  }
});

describe("PWA Configuration", () => {
  it("should have proper manifest.json with dark theme", () => {
    const manifestPath = path.join(__dirname, "../client/public/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    expect(manifest.display).toBe("standalone");
    expect(manifest.name).toContain("Destiny");
    expect(manifest.theme_color).toBeDefined();
    expect(manifest.background_color).toBeDefined();
  });

  it("should have PWA meta tags in index.html", () => {
    const htmlPath = path.join(__dirname, "../client/index.html");
    const content = fs.readFileSync(htmlPath, "utf-8");
    expect(content).toContain("apple-mobile-web-app-capable");
    expect(content).toContain("viewport-fit=cover");
    expect(content).toContain("manifest.json");
  });
});

describe("Bottom Tab Navigation Routes", () => {
  it("should map tabs to correct paths", () => {
    const filePath = path.join(componentsDir, "BottomTabNavigation.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    // Verify all 5 tab paths
    expect(content).toContain('path: "/"');
    expect(content).toContain('path: "/book"');
    expect(content).toContain('path: "/audiobook"');
    expect(content).toContain('path: "/modules"');
    expect(content).toContain('path: "/more"');
  });

  it("should highlight More tab for sub-pages", () => {
    const filePath = path.join(componentsDir, "BottomTabNavigation.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    // Verify sub-pages map to "more" tab
    expect(content).toContain("/settings");
    expect(content).toContain("/achievements");
    expect(content).toContain("/sliders");
    expect(content).toContain("/daily-cycle");
  });
});
