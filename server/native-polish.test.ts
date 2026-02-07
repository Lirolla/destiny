import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * Tests to verify the native app polish features:
 * - Page transition animations (Framer Motion)
 * - Splash screen / loading animation
 * - Pull-to-refresh on key pages
 */

const clientSrc = path.join(__dirname, "../client/src");
const componentsDir = path.join(clientSrc, "components");
const pagesDir = path.join(clientSrc, "pages");

describe("Page Transition Animations", () => {
  it("should have AnimatedRoutes component", () => {
    const filePath = path.join(componentsDir, "AnimatedRoutes.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("framer-motion");
    expect(content).toContain("AnimatePresence");
    expect(content).toContain("motion.div");
  });

  it("should define tab order for slide direction", () => {
    const filePath = path.join(componentsDir, "AnimatedRoutes.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("TAB_ORDER");
    expect(content).toContain('"/": 0');
    expect(content).toContain('"/book": 1');
    expect(content).toContain('"/audiobook": 2');
    expect(content).toContain('"/modules": 3');
    expect(content).toContain('"/more": 4');
  });

  it("should use AnimatedRoutes in App.tsx Router", () => {
    const filePath = path.join(clientSrc, "App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("AnimatedRoutes");
    expect(content).toContain("<AnimatedRoutes>");
    expect(content).toContain("</AnimatedRoutes>");
  });
});

describe("Splash Screen", () => {
  it("should have SplashScreen component", () => {
    const filePath = path.join(componentsDir, "SplashScreen.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("framer-motion");
    expect(content).toContain("AnimatePresence");
  });

  it("should use sessionStorage to show splash only once per session", () => {
    const filePath = path.join(componentsDir, "SplashScreen.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("sessionStorage");
    expect(content).toContain("splash_shown");
  });

  it("should display app branding", () => {
    const filePath = path.join(componentsDir, "SplashScreen.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("Destiny Hacking");
    expect(content).toContain("Master Your Free Will");
  });

  it("should have animated logo and loading bar", () => {
    const filePath = path.join(componentsDir, "SplashScreen.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("motion.svg");
    expect(content).toContain("Loading bar");
  });

  it("should be included in App.tsx", () => {
    const filePath = path.join(clientSrc, "App.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("SplashScreen");
    expect(content).toContain("<SplashScreen />");
  });
});

describe("Pull-to-Refresh", () => {
  it("should have PullToRefresh component", () => {
    const filePath = path.join(componentsDir, "PullToRefresh.tsx");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("framer-motion");
    expect(content).toContain("onRefresh");
    expect(content).toContain("PULL_THRESHOLD");
  });

  it("should handle touch events for pull gesture", () => {
    const filePath = path.join(componentsDir, "PullToRefresh.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("handleTouchStart");
    expect(content).toContain("handleTouchMove");
    expect(content).toContain("handleTouchEnd");
    expect(content).toContain("onTouchStart");
    expect(content).toContain("onTouchMove");
    expect(content).toContain("onTouchEnd");
  });

  it("should show RefreshCw spinner icon", () => {
    const filePath = path.join(componentsDir, "PullToRefresh.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("RefreshCw");
    expect(content).toContain("animate-spin");
  });

  it("should be used in NewHome page", () => {
    const filePath = path.join(pagesDir, "NewHome.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("PullToRefresh");
    expect(content).toContain("handleRefresh");
  });

  it("should be used in Sliders page", () => {
    const filePath = path.join(pagesDir, "Sliders.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("PullToRefresh");
    expect(content).toContain("onRefresh");
  });

  it("NewHome should invalidate queries on refresh", () => {
    const filePath = path.join(pagesDir, "NewHome.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("utils.progress.getOverallProgress.invalidate");
    expect(content).toContain("utils.dailyCycle.getToday.invalidate");
  });

  it("Sliders should invalidate queries on refresh", () => {
    const filePath = path.join(pagesDir, "Sliders.tsx");
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("utils.sliders.listAxes.invalidate");
    expect(content).toContain("utils.sliders.getLatestStates.invalidate");
  });
});

describe("Framer Motion dependency", () => {
  it("should be listed in package.json", () => {
    const pkgPath = path.join(__dirname, "../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    expect(pkg.dependencies["framer-motion"]).toBeDefined();
  });
});
