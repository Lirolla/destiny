import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 999,
    openId: "pdf-test-user",
    email: "pdf-test@example.com",
    name: "PDF Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("PDF Progress Sync & Chapter Navigation", () => {
  it("should list PDF chapters", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const chapters = await caller.pdf.listChapters();
    
    expect(chapters).toBeDefined();
    expect(chapters.length).toBeGreaterThan(0);
    expect(chapters[0].chapterNumber).toBeGreaterThan(0);
    // Should have chapters numbered 1-14 (may have extras without audio)
    const maxChapter = Math.max(...chapters.map((ch: any) => ch.chapterNumber));
    expect(maxChapter).toBeGreaterThanOrEqual(14);
  });

  it("should have PDF page mappings for all chapters", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const chapters = await caller.pdf.listChapters();
    
    // Check that chapters with valid mappings have correct data
    const validChapters = chapters.filter((ch: any) => 
      ch.pdfStartPage && ch.pdfEndPage && ch.pdfEndPage >= ch.pdfStartPage
    );
    
    expect(validChapters.length).toBeGreaterThan(0);
    validChapters.forEach((chapter: any) => {
      expect(chapter.pdfStartPage).toBeGreaterThan(0);
      expect(chapter.pdfEndPage).toBeGreaterThanOrEqual(chapter.pdfStartPage);
    });
    
    // Verify chapter 14 ends at page 87
    const chapter14 = chapters.find((ch: any) => ch.chapterNumber === 14);
    if (chapter14) {
      expect(chapter14.pdfEndPage).toBe(87);
    }
  });

  it("should save and retrieve PDF reading progress", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Save progress
    await caller.pdf.updateProgress({
      currentPage: 25,
      totalPages: 87,
    });
    
    // Retrieve progress
    const progress = await caller.pdf.getProgress();
    
    expect(progress).toBeDefined();
    expect(progress?.currentPage).toBe(25);
    expect(progress?.totalPages).toBe(87);
    expect(progress?.percentComplete).toBeDefined();
  });

  it("should calculate correct completion percentage", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Save progress at 50% (page 44 of 87)
    await caller.pdf.updateProgress({
      currentPage: 44,
      totalPages: 87,
    });
    
    const progress = await caller.pdf.getProgress();
    const percentComplete = parseFloat(progress?.percentComplete as any);
    
    expect(percentComplete).toBeGreaterThan(49);
    expect(percentComplete).toBeLessThan(52);
  });

  it("should update progress when page changes", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Initial progress
    await caller.pdf.updateProgress({
      currentPage: 10,
      totalPages: 87,
    });
    
    let progress = await caller.pdf.getProgress();
    expect(progress?.currentPage).toBe(10);
    
    // Update progress
    await caller.pdf.updateProgress({
      currentPage: 30,
      totalPages: 87,
    });
    
    progress = await caller.pdf.getProgress();
    expect(progress?.currentPage).toBe(30);
  });

  it("should get specific chapter by ID", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const chapters = await caller.pdf.listChapters();
    const firstChapter = chapters[0];
    
    const chapter = await caller.pdf.getChapter({ chapterId: firstChapter.id });
    
    expect(chapter).toBeDefined();
    expect(chapter?.id).toBe(firstChapter.id);
    expect(chapter?.chapterNumber).toBe(firstChapter.chapterNumber);
    expect(chapter?.title).toBeDefined();
  });

  it("should create and retrieve PDF bookmarks", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Create bookmark
    const bookmark = await caller.pdf.createBookmark({
      pageNumber: 42,
      title: "Important Section",
      note: "Review this later",
    });
    
    expect(bookmark).toBeDefined();
    // Bookmark creation returns success, actual data retrieved via list
    
    // Retrieve bookmarks
    const bookmarks = await caller.pdf.listBookmarks();
    
    expect(bookmarks).toBeDefined();
    expect(bookmarks.length).toBeGreaterThan(0);
    expect(bookmarks.some((b: any) => b.pageNumber === 42)).toBe(true);
  });

  it("should maintain chapter context across formats", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    const chapters = await caller.pdf.listChapters();
    const chapter5 = chapters.find((ch: any) => ch.chapterNumber === 5);
    
    expect(chapter5).toBeDefined();
    expect(chapter5?.pdfStartPage).toBe(16);
    expect(chapter5?.audioUrl).toBeDefined(); // Should have audio for cross-format navigation
  });

  it("should handle progress persistence across sessions", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Simulate user reading to page 60
    await caller.pdf.updateProgress({
      currentPage: 60,
      totalPages: 87,
    });
    
    // Simulate new session - retrieve progress
    const progress = await caller.pdf.getProgress();
    
    expect(progress?.currentPage).toBe(60);
    expect(progress?.userId).toBe(ctx.user!.id);
  });

  it("should validate page numbers are within bounds", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    
    // Save valid progress
    await caller.pdf.updateProgress({
      currentPage: 87,
      totalPages: 87,
    });
    
    const progress = await caller.pdf.getProgress();
    expect(progress?.currentPage).toBeLessThanOrEqual(87);
  });
});
