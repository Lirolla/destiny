import { describe, it, expect } from "vitest";
import {
  PROLOGUE_PARAGRAPHS,
  HIGHLIGHT_PHRASES,
  MARCUS_AURELIUS_QUOTE,
  DOCTRINE_CARDS,
  SHARE_QUOTES,
  type BilingualText,
} from "../shared/prologue";

describe("Phase 59: Portuguese Prologue Translations", () => {
  it("all PROLOGUE_PARAGRAPHS have both en and pt fields", () => {
    expect(PROLOGUE_PARAGRAPHS.length).toBe(9);
    for (const para of PROLOGUE_PARAGRAPHS) {
      expect(typeof para.en).toBe("string");
      expect(typeof para.pt).toBe("string");
      expect(para.en.length).toBeGreaterThan(50);
      expect(para.pt.length).toBeGreaterThan(50);
    }
  });

  it("all HIGHLIGHT_PHRASES have both en and pt fields", () => {
    expect(HIGHLIGHT_PHRASES.length).toBe(9);
    for (const phrase of HIGHLIGHT_PHRASES) {
      expect(typeof phrase.en).toBe("string");
      expect(typeof phrase.pt).toBe("string");
      expect(phrase.en.length).toBeGreaterThan(0);
      expect(phrase.pt.length).toBeGreaterThan(0);
    }
  });

  it("MARCUS_AURELIUS_QUOTE has both en and pt fields", () => {
    expect(typeof MARCUS_AURELIUS_QUOTE.en).toBe("string");
    expect(typeof MARCUS_AURELIUS_QUOTE.pt).toBe("string");
    expect(MARCUS_AURELIUS_QUOTE.en).toContain("power over your mind");
    expect(MARCUS_AURELIUS_QUOTE.pt).toContain("poder sobre a tua mente");
  });

  it("all DOCTRINE_CARDS have doctrinePt and sourcePt fields", () => {
    expect(DOCTRINE_CARDS.length).toBe(8);
    for (const card of DOCTRINE_CARDS) {
      expect(typeof card.doctrine).toBe("string");
      expect(typeof card.doctrinePt).toBe("string");
      expect(typeof card.source).toBe("string");
      expect(typeof card.sourcePt).toBe("string");
      expect(card.doctrinePt.length).toBeGreaterThan(10);
      expect(card.sourcePt.length).toBeGreaterThan(5);
    }
  });

  it("all SHARE_QUOTES have both en and pt fields", () => {
    expect(SHARE_QUOTES.length).toBe(8);
    for (const quote of SHARE_QUOTES) {
      expect(typeof quote.en).toBe("string");
      expect(typeof quote.pt).toBe("string");
      expect(quote.en.length).toBeGreaterThan(10);
      expect(quote.pt.length).toBeGreaterThan(10);
    }
  });

  it("English highlight phrases appear in English paragraphs", () => {
    const allEnText = PROLOGUE_PARAGRAPHS.map((p) => p.en).join(" ");
    // At least 7 of 9 phrases should appear (some are sub-phrases of quotes)
    let found = 0;
    for (const phrase of HIGHLIGHT_PHRASES) {
      if (allEnText.includes(phrase.en)) found++;
    }
    expect(found).toBeGreaterThanOrEqual(7);
  });

  it("Portuguese highlight phrases appear in Portuguese paragraphs", () => {
    const allPtText = PROLOGUE_PARAGRAPHS.map((p) => p.pt).join(" ");
    let found = 0;
    for (const phrase of HIGHLIGHT_PHRASES) {
      if (allPtText.includes(phrase.pt)) found++;
    }
    expect(found).toBeGreaterThanOrEqual(7);
  });

  it("Portuguese text contains key philosophical terms", () => {
    const allPtText = PROLOGUE_PARAGRAPHS.map((p) => p.pt).join(" ");
    expect(allPtText).toContain("livre-arbítrio");
    expect(allPtText).toContain("equilíbrio universal");
    expect(allPtText).toContain("Marco Aurélio");
  });
});

describe("Phase 59: PWA Manifest", () => {
  it("manifest.json exists and has required fields", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const manifestPath = path.resolve(__dirname, "../client/public/manifest.json");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);

    expect(manifest.name).toBe("Destiny Hacking");
    expect(manifest.short_name).toBe("Destiny Hacking");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#01D98D");
    expect(manifest.background_color).toBe("#0a0a0f");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons).toHaveLength(2);
    expect(manifest.icons[0].sizes).toBe("192x192");
    expect(manifest.icons[1].sizes).toBe("512x512");
  });

  it("service worker file exists and has notification handling", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const swPath = path.resolve(__dirname, "../client/public/sw.js");
    const swContent = fs.readFileSync(swPath, "utf-8");

    expect(swContent).toContain("SCHEDULE_REMINDER");
    expect(swContent).toContain("CANCEL_REMINDER");
    expect(swContent).toContain("CANCEL_ALL_REMINDERS");
    expect(swContent).toContain("showNotification");
    expect(swContent).toContain("notificationclick");
    expect(swContent).toContain("scheduleDailyReminder");
    expect(swContent).toContain("msUntilNextOccurrence");
  });

  it("index.html registers the service worker", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const htmlPath = path.resolve(__dirname, "../client/index.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");

    expect(htmlContent).toContain("serviceWorker");
    expect(htmlContent).toContain("register('/sw.js')");
    expect(htmlContent).toContain("apple-touch-icon");
    expect(htmlContent).toContain("manifest.json");
  });
});

describe("Phase 59: Anthropic API Format", () => {
  it("llm.ts contains Anthropic-specific headers and conversion logic", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const llmPath = path.resolve(__dirname, "./_core/llm.ts");
    const llmContent = fs.readFileSync(llmPath, "utf-8");

    // Check for Anthropic-specific code
    expect(llmContent).toContain("anthropic-version");
    expect(llmContent).toContain("x-api-key");
    expect(llmContent).toContain("buildAnthropicPayload");
    expect(llmContent).toContain("convertAnthropicResponse");
    expect(llmContent).toContain("/v1/messages");
  });

  it("Anthropic payload builder separates system messages", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const llmPath = path.resolve(__dirname, "./_core/llm.ts");
    const llmContent = fs.readFileSync(llmPath, "utf-8");

    // Verify system message extraction logic
    expect(llmContent).toContain('messages.filter((m) => m.role === "system")');
    expect(llmContent).toContain('messages.filter((m) => m.role !== "system")');
    expect(llmContent).toContain("payload.system = systemText");
  });

  it("Anthropic response converter maps stop_reason to finish_reason", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const llmPath = path.resolve(__dirname, "./_core/llm.ts");
    const llmContent = fs.readFileSync(llmPath, "utf-8");

    expect(llmContent).toContain("stop_reason");
    expect(llmContent).toContain("end_turn");
    expect(llmContent).toContain("tool_use");
    expect(llmContent).toContain("input_tokens");
    expect(llmContent).toContain("output_tokens");
  });

  it("env.ts has LLM provider configuration variables", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const envPath = path.resolve(__dirname, "./_core/env.ts");
    const envContent = fs.readFileSync(envPath, "utf-8");

    expect(envContent).toContain("llmProvider");
    expect(envContent).toContain("openaiApiKey");
    expect(envContent).toContain("anthropicApiKey");
    expect(envContent).toContain("llmModel");
  });
});
