import { describe, it, expect } from "vitest";

/**
 * ChapterIcon integration tests
 * Validates that the chapter icon system is properly set up:
 * - ChapterIcon component exists with correct exports
 * - All 15 chapters (0-14) have icon definitions
 * - Component is imported in Book.tsx, Audiobook.tsx, and ChapterBridge.tsx
 */

import fs from "fs";
import path from "path";

const clientSrc = path.resolve(__dirname, "../client/src");

describe("ChapterIcon component", () => {
  const iconFile = fs.readFileSync(
    path.join(clientSrc, "components/ChapterIcon.tsx"),
    "utf-8"
  );

  it("exports ChapterIcon function", () => {
    expect(iconFile).toContain("export function ChapterIcon");
  });

  it("accepts chapter, size, colored, and className props", () => {
    expect(iconFile).toContain("chapter: number");
    expect(iconFile).toContain("size?: number");
    expect(iconFile).toContain("colored?: boolean");
    expect(iconFile).toContain("className?: string");
  });

  it("defines GREEN and DARK color constants", () => {
    expect(iconFile).toContain('const GREEN = "#01D98D"');
    expect(iconFile).toContain('const DARK = "#1A1A1A"');
  });

  it("has icon definitions for all 15 chapters (0 through 14)", () => {
    // Check Prologue comment
    expect(iconFile).toContain("// Prologue:");
    // Check chapter comments for 1-14
    for (let i = 1; i <= 14; i++) {
      expect(iconFile).toContain(`// Ch${i}:`);
    }
    // Check numeric keys 0-14
    expect(iconFile).toMatch(/0:\s*\(/);
    expect(iconFile).toMatch(/1:\s*\(/);
    expect(iconFile).toMatch(/14:\s*\(/);
  });

  it("uses inline SVGs (no image imports or network requests)", () => {
    expect(iconFile).not.toContain("import.*\\.svg");
    expect(iconFile).not.toContain("import.*\\.png");
    expect(iconFile).not.toContain("fetch(");
    expect(iconFile).not.toContain("http://");
    expect(iconFile).not.toContain("https://");
  });

  it("returns fallback icon for unknown chapter numbers", () => {
    expect(iconFile).toContain("icons[chapter] || icons[0]");
  });
});

describe("ChapterIcon integration in Book.tsx", () => {
  const bookFile = fs.readFileSync(
    path.join(clientSrc, "pages/Book.tsx"),
    "utf-8"
  );

  it("imports ChapterIcon", () => {
    expect(bookFile).toContain(
      'import { ChapterIcon } from "@/components/ChapterIcon"'
    );
  });

  it("uses ChapterIcon with chapter.chapterNumber and size={28}", () => {
    expect(bookFile).toContain(
      "<ChapterIcon chapter={chapter.chapterNumber} size={28} />"
    );
  });

  it("uses w-10 h-10 container (not w-8 h-8)", () => {
    expect(bookFile).toContain("w-10 h-10");
    expect(bookFile).not.toMatch(
      /w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0/
    );
  });

  it("uses bg-primary/10 and bg-muted/50 for icon container", () => {
    expect(bookFile).toContain("bg-primary/10");
    expect(bookFile).toContain("bg-muted/50");
  });
});

describe("ChapterIcon integration in Audiobook.tsx", () => {
  const audiobookFile = fs.readFileSync(
    path.join(clientSrc, "pages/Audiobook.tsx"),
    "utf-8"
  );

  it("imports ChapterIcon", () => {
    expect(audiobookFile).toContain(
      'import { ChapterIcon } from "@/components/ChapterIcon"'
    );
  });

  it("uses ChapterIcon with size={24} for hasStarted state", () => {
    expect(audiobookFile).toContain(
      "<ChapterIcon chapter={chapter.chapterNumber} size={24} />"
    );
  });

  it("uses ChapterIcon with size={26} for default state", () => {
    expect(audiobookFile).toContain(
      "<ChapterIcon chapter={chapter.chapterNumber} size={26} />"
    );
  });

  it("still uses CheckCircle2 for completed state", () => {
    expect(audiobookFile).toContain("CheckCircle2");
  });
});

describe("ChapterIcon integration in ChapterBridge.tsx", () => {
  const bridgeFile = fs.readFileSync(
    path.join(clientSrc, "components/ChapterBridge.tsx"),
    "utf-8"
  );

  it("imports ChapterIcon", () => {
    expect(bridgeFile).toContain(
      'import { ChapterIcon } from "@/components/ChapterIcon"'
    );
  });

  it("uses ChapterIcon with size={56} and colored prop", () => {
    expect(bridgeFile).toContain(
      "<ChapterIcon chapter={chapterNumber} size={56} colored />"
    );
  });

  it("wraps icon in a backdrop-blur container", () => {
    expect(bridgeFile).toContain("backdrop-blur-sm");
    expect(bridgeFile).toContain("bg-white/10");
  });

  it("no longer uses emoji span", () => {
    expect(bridgeFile).not.toContain('className="text-5xl"');
    expect(bridgeFile).not.toContain("{emoji}</span>");
  });

  it("uses motion.div for icon animation", () => {
    expect(bridgeFile).toContain("initial={{ opacity: 0, scale: 0.5 }}");
    expect(bridgeFile).toContain("animate={{ opacity: 1, scale: 1 }}");
  });
});
