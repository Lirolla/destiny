import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Phase 70 Tests
 * 
 * Verify that:
 * 1. All confirm() calls have been replaced with AlertDialog in the 3 pages
 * 2. AlertDialog imports are present
 * 3. PDF export component uses white background
 */

function readClientFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, "..", "client", "src", relativePath), "utf-8");
}

describe("Phase 70: AlertDialog Replacement", () => {
  describe("PrayerJournal.tsx", () => {
    const content = readClientFile("pages/PrayerJournal.tsx");

    it("does not use confirm()", () => {
      expect(content).not.toMatch(/\bconfirm\(/);
    });

    it("imports AlertDialog components", () => {
      expect(content).toContain("AlertDialog");
      expect(content).toContain("AlertDialogAction");
      expect(content).toContain("AlertDialogCancel");
      expect(content).toContain("AlertDialogContent");
      expect(content).toContain("AlertDialogTrigger");
    });

    it("has AlertDialogTitle with 'Delete Prayer Entry'", () => {
      expect(content).toContain('t({ en: "Delete Prayer Entry"');
    });

    it("has a Cancel button in the dialog", () => {
      expect(content).toContain("AlertDialogCancel");
      expect(content).toContain('t({ en: "Cancel"');
    });

    it("has a destructive Delete action", () => {
      expect(content).toContain("bg-destructive");
      expect(content).toContain('t({ en: "Delete"');
    });
  });

  describe("Flashcards.tsx", () => {
    const content = readClientFile("pages/Flashcards.tsx");

    it("does not use confirm()", () => {
      expect(content).not.toMatch(/\bconfirm\(/);
    });

    it("imports AlertDialog components", () => {
      expect(content).toContain("AlertDialog");
      expect(content).toContain("AlertDialogAction");
      expect(content).toContain("AlertDialogCancel");
      expect(content).toContain("AlertDialogContent");
      expect(content).toContain("AlertDialogTrigger");
    });

    it("has AlertDialogTitle with delete flashcard text", () => {
      expect(content).toContain('t({ en: "Delete');
    });

    it("has a Cancel button in the dialog", () => {
      expect(content).toContain("AlertDialogCancel");
      expect(content).toContain('t({ en: "Cancel"');
    });

    it("has a destructive Delete action", () => {
      expect(content).toContain("text-destructive");
      expect(content).toContain("AlertDialogAction");
    });

    it("no longer has handleDeleteCard function with confirm", () => {
      expect(content).not.toContain("handleDeleteCard");
    });
  });

  describe("Challenges.tsx", () => {
    const content = readClientFile("pages/Challenges.tsx");

    it("does not use confirm()", () => {
      expect(content).not.toMatch(/\bconfirm\(/);
    });

    it("imports AlertDialog components", () => {
      expect(content).toContain("AlertDialog");
      expect(content).toContain("AlertDialogAction");
      expect(content).toContain("AlertDialogCancel");
      expect(content).toContain("AlertDialogContent");
      expect(content).toContain("AlertDialogTrigger");
    });

    it("has AlertDialogTitle with 'Delete Challenge'", () => {
      expect(content).toContain('t({ en: "Delete Challenge"');
    });

    it("shows the challenge name in the confirmation message", () => {
      expect(content).toContain("{challenge.name}");
    });

    it("has a destructive Delete action", () => {
      expect(content).toContain("bg-destructive");
    });
  });
});

describe("Phase 70: PDF Export White Background", () => {
  const content = readClientFile("components/DestinyScoreExport.tsx");

  it("sets white background on canvas", () => {
    expect(content).toContain('"#FFFFFF"');
    expect(content).toContain("fillRect(0, 0, width, height)");
  });

  it("sets white background on PDF page", () => {
    expect(content).toContain("setFillColor(255, 255, 255)");
  });

  it("uses dark text colors for readability", () => {
    expect(content).toContain("setTextColor(30, 30, 30)");
  });

  it("uses dark green header instead of bright green", () => {
    expect(content).toContain("setTextColor(1, 140, 90)");
  });

  it("uses grey for axis labels on canvas", () => {
    expect(content).toContain('"#333333"');
  });
});
