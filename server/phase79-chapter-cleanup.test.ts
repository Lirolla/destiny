import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.resolve(__dirname, "db.ts");
const ROUTERS_PATH = path.resolve(__dirname, "routers.ts");
const dbContent = fs.readFileSync(DB_PATH, "utf-8");
const routersContent = fs.readFileSync(ROUTERS_PATH, "utf-8");

describe("Phase 79: Test Chapter Cleanup", () => {
  describe("Step 2: Defensive filters in db.ts", () => {
    it("listAudiobookChapters excludes 'Test Chapter' title", () => {
      const fnMatch = dbContent.match(
        /export async function listAudiobookChapters[\s\S]*?(?=\nexport )/
      );
      expect(fnMatch).toBeTruthy();
      const fn = fnMatch![0];
      expect(fn).toContain("Test Chapter");
    });

    it("listAudiobookChapters excludes example.com URLs", () => {
      const fnMatch = dbContent.match(
        /export async function listAudiobookChapters[\s\S]*?(?=\nexport )/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("example.com");
    });

    it("listAudiobookChapters filters chapterNumber BETWEEN 1 AND 14", () => {
      const fnMatch = dbContent.match(
        /export async function listAudiobookChapters[\s\S]*?(?=\nexport )/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("BETWEEN 1 AND 14");
    });

    it("listPdfChapters excludes 'Test Chapter' title", () => {
      const fnMatch = dbContent.match(
        /export async function listPdfChapters[\s\S]*?(?=\nexport )/
      );
      expect(fnMatch).toBeTruthy();
      const fn = fnMatch![0];
      expect(fn).toContain("Test Chapter");
    });

    it("listPdfChapters filters chapterNumber BETWEEN 1 AND 14", () => {
      const fnMatch = dbContent.match(
        /export async function listPdfChapters[\s\S]*?(?=\nexport )/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("BETWEEN 1 AND 14");
    });
  });

  describe("Step 3: Admin-only cleanupTestChapters endpoint", () => {
    it("cleanupTestChapters function exists in db.ts", () => {
      expect(dbContent).toContain("export async function cleanupTestChapters");
    });

    it("cleanupTestChapters deletes rows with title 'Test Chapter'", () => {
      const fnMatch = dbContent.match(
        /export async function cleanupTestChapters[\s\S]*$/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("Test Chapter");
    });

    it("cleanupTestChapters deletes rows with example.com URLs", () => {
      const fnMatch = dbContent.match(
        /export async function cleanupTestChapters[\s\S]*$/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("example.com");
    });

    it("cleanupTestChapters deletes rows with chapterNumber > 14 or < 1", () => {
      const fnMatch = dbContent.match(
        /export async function cleanupTestChapters[\s\S]*$/
      );
      const fn = fnMatch![0];
      expect(fn).toContain("chapterNumber");
      expect(fn).toContain("14");
    });

    it("cleanupTestChapters endpoint exists in routers.ts", () => {
      expect(routersContent).toContain("cleanupTestChapters");
    });

    it("cleanupTestChapters endpoint requires admin role", () => {
      // Find the cleanupTestChapters section
      const idx = routersContent.indexOf("cleanupTestChapters");
      const section = routersContent.substring(idx, idx + 400);
      expect(section).toContain("admin");
      expect(section).toContain("FORBIDDEN");
    });

    it("cleanupTestChapters endpoint uses protectedProcedure", () => {
      const idx = routersContent.indexOf("cleanupTestChapters");
      const before = routersContent.substring(Math.max(0, idx - 100), idx + 50);
      expect(before).toContain("protectedProcedure");
    });

    it("cleanupTestChapters endpoint calls db.cleanupTestChapters", () => {
      const idx = routersContent.indexOf("cleanupTestChapters: protectedProcedure");
      const section = routersContent.substring(idx, idx + 400);
      expect(section).toContain("db.cleanupTestChapters()");
    });
  });
});
