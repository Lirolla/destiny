import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Phase 68: Bridge V2 Redesign + Follow-ups
 * Tests verify the structural correctness of the rewritten components.
 */

const CLIENT_SRC = path.resolve(__dirname, "../client/src");

describe("Phase 68: Bridge V2 Redesign", () => {
  const newHomePath = path.join(CLIENT_SRC, "pages/NewHome.tsx");
  const newHomeContent = fs.readFileSync(newHomePath, "utf-8");

  it("NewHome.tsx exists and is non-empty", () => {
    expect(newHomeContent.length).toBeGreaterThan(100);
  });

  it("Hero section has Destiny Score ring with SVG circle", () => {
    expect(newHomeContent).toContain("strokeDasharray");
    expect(newHomeContent).toContain("strokeDashoffset");
    expect(newHomeContent).toContain("DESTINY");
  });

  it("Hero shows greeting with Captain", () => {
    expect(newHomeContent).toContain('t({ en: "Captain"');
    expect(newHomeContent).toContain("greeting");
  });

  it("Doctrine of the Week section uses DoctrineCard component", () => {
    expect(newHomeContent).toContain("<DoctrineCard");
    expect(newHomeContent).toContain('import { DoctrineCard }');
  });

  it("Daily Cycle section has 3 phases (morning, midday, evening)", () => {
    expect(newHomeContent).toContain('"morning"');
    expect(newHomeContent).toContain('"midday"');
    expect(newHomeContent).toContain('"evening"');
  });

  it("Quick Access grid has exactly 6 items (2×3)", () => {
    expect(newHomeContent).toContain("QUICK_ACCESS_ITEMS");
    // Count the items in the array
    const matches = newHomeContent.match(/Icon:\s*(Layers|ScrollText|Brain|TrendingUp|Trophy|Zap)/g);
    expect(matches).toHaveLength(6);
  });

  it("Quick Access uses Lucide icons, not emoji", () => {
    expect(newHomeContent).toContain("import {");
    expect(newHomeContent).toContain("Layers");
    expect(newHomeContent).toContain("ScrollText");
    expect(newHomeContent).toContain("Brain");
    expect(newHomeContent).toContain("TrendingUp");
    expect(newHomeContent).toContain("Trophy");
    expect(newHomeContent).toContain("Zap");
  });

  it("Invictus quote is present as flex-1 spacer", () => {
    expect(newHomeContent).toContain("flex-1 flex items-center justify-center");
    expect(newHomeContent).toContain("I am the master of my fate");
  });

  it("No large cards remain (Audiobook, Book, Modules, Quick Tools)", () => {
    // These were removed in Bridge V2
    expect(newHomeContent).not.toContain("getLastListened");
    expect(newHomeContent).not.toContain("pdfProgress");
    expect(newHomeContent).not.toContain("hasLastListened");
    expect(newHomeContent).not.toContain("hasBookProgress");
  });

  it("Modals are preserved (FirstImpression, Onboarding, InitialCalibration)", () => {
    expect(newHomeContent).toContain("showFirstImpression");
    expect(newHomeContent).toContain("showOnboarding");
    expect(newHomeContent).toContain("showInitialCalibration");
    expect(newHomeContent).toContain("<FirstImpression");
    expect(newHomeContent).toContain("<Onboarding");
    expect(newHomeContent).toContain("<InitialCalibration");
  });

  it("QuickCalibrate overlay is integrated", () => {
    expect(newHomeContent).toContain("<QuickCalibrate");
    expect(newHomeContent).toContain("showQuickCalibrate");
    expect(newHomeContent).toContain("setShowQuickCalibrate(true)");
  });

  it("PullToRefresh wrapper is present", () => {
    expect(newHomeContent).toContain("<PullToRefresh");
    expect(newHomeContent).toContain("handleRefresh");
  });

  it("Layout uses flex column with min-height for zero-scroll", () => {
    expect(newHomeContent).toContain("flex flex-col");
    expect(newHomeContent).toContain("minHeight");
    expect(newHomeContent).toContain("100dvh");
  });

  it("All text is bilingual (uses t() function)", () => {
    // Check key bilingual pairs
    expect(newHomeContent).toContain('t({ en: "Daily Cycle"');
    expect(newHomeContent).toContain('t({ en: "Quick Access"');
    expect(newHomeContent).toContain('t({ en: "Morning"');
    expect(newHomeContent).toContain('t({ en: "Evening"');
  });
});

describe("Phase 68: Theme Toggle in Settings", () => {
  const settingsPath = path.join(CLIENT_SRC, "pages/Settings.tsx");
  const settingsContent = fs.readFileSync(settingsPath, "utf-8");

  it("Settings page imports useTheme", () => {
    expect(settingsContent).toContain("useTheme");
    expect(settingsContent).toContain("@/contexts/ThemeContext");
  });

  it("Settings page has theme toggle button", () => {
    expect(settingsContent).toContain("toggleTheme");
    expect(settingsContent).toContain("Moon");
    expect(settingsContent).toContain("Sun");
  });

  it("Settings page has language switcher", () => {
    expect(settingsContent).toContain("setLanguage");
    expect(settingsContent).toContain("Globe");
    expect(settingsContent).toContain('setLanguage');
  });

  it("Settings page has Appearance card", () => {
    expect(settingsContent).toContain("Palette");
    expect(settingsContent).toContain("Appearance");
    expect(settingsContent).toContain("Aparência");
  });

  it("Settings page labels are bilingual", () => {
    expect(settingsContent).toContain('t({ en: "Settings"');
    expect(settingsContent).toContain('t({ en: "Data Export"');
    expect(settingsContent).toContain('t({ en: "Privacy');
  });
});

describe("Phase 68: DoctrineCard Compactness", () => {
  const doctrinePath = path.join(CLIENT_SRC, "components/DoctrineCard.tsx");
  const doctrineContent = fs.readFileSync(doctrinePath, "utf-8");

  it("DoctrineCard has compact padding", () => {
    expect(doctrineContent).toContain("py-3");
    expect(doctrineContent).toContain("pl-5");
    expect(doctrineContent).toContain("pr-4");
  });

  it("DoctrineCard text is compact (text-sm, line-clamp-2)", () => {
    expect(doctrineContent).toContain("text-sm");
    expect(doctrineContent).toContain("line-clamp-2");
  });

  it("DoctrineCard has Read Philosophy link", () => {
    expect(doctrineContent).toContain('href="/philosophy"');
    expect(doctrineContent).toContain("Read Philosophy");
    expect(doctrineContent).toContain("Ler Filosofia");
  });
});

describe("Phase 68: QuickCalibrate Component", () => {
  const qcPath = path.join(CLIENT_SRC, "components/QuickCalibrate.tsx");
  const qcContent = fs.readFileSync(qcPath, "utf-8");

  it("QuickCalibrate has open/onClose props", () => {
    expect(qcContent).toContain("open: boolean");
    expect(qcContent).toContain("onClose: () => void");
  });

  it("QuickCalibrate fetches lowest 3 axes", () => {
    expect(qcContent).toContain("getLowest3");
  });

  it("QuickCalibrate has Save All button", () => {
    expect(qcContent).toContain("handleSaveAll");
    expect(qcContent).toContain('t({ en: "Save All"');
  });

  it("QuickCalibrate renders range sliders", () => {
    expect(qcContent).toContain('type="range"');
    expect(qcContent).toContain("min={0}");
    expect(qcContent).toContain("max={100}");
  });
});
