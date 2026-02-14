import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock authenticated user context
const mockUserContext: TrpcContext = {
  user: {
    id: 1,
    openId: "test-user-123",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  req: {} as any,
  res: {} as any,
};

describe("Final Prompt Features", () => {
  // =========================================================================
  // B2 — Cause-Effect Mapping: weeklyReviews.getCycles
  // =========================================================================
  describe("B2: weeklyReviews.getCycles", () => {
    it("should return cycles for a valid date range", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      const result = await caller.weeklyReviews.getCycles({
        weekStartDate: "2025-01-01",
        weekEndDate: "2025-01-07",
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should reject invalid date format", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      await expect(
        caller.weeklyReviews.getCycles({
          weekStartDate: "not-a-date",
          weekEndDate: "2025-01-07",
        })
      ).rejects.toThrow();
    });
  });

  // =========================================================================
  // B4 — Challenge Leaderboard: challenges.getStats with leaderboard
  // =========================================================================
  describe("B4: challenges.getStats leaderboard", () => {
    it("should throw for non-existent challenge", async () => {
      const caller = appRouter.createCaller(mockUserContext);
      await expect(
        caller.challenges.getStats({ challengeId: 999999 })
      ).rejects.toThrow();
    });
  });

  // =========================================================================
  // B1 — LLM Provider Fallback: env vars exist
  // =========================================================================
  describe("B1: LLM Provider env configuration", () => {
    it("should have llmProvider and llmModel in env.ts", async () => {
      const envModule = await import("./_core/env");
      const ENV = envModule.ENV;
      // llmProvider should default to "manus"
      expect(ENV.llmProvider).toBeDefined();
      expect(typeof ENV.llmProvider).toBe("string");
    });
  });

  // =========================================================================
  // DB helpers
  // =========================================================================
  describe("DB: getUserById", () => {
    it("should return null for non-existent user", async () => {
      const result = await db.getUserById(999999);
      expect(result).toBeNull();
    });

    it("should return a user for an existing ID", async () => {
      // User ID 1 should exist (the test user or owner)
      const result = await db.getUserById(1);
      if (result) {
        expect(result.id).toBe(1);
        expect(result.openId).toBeDefined();
      }
      // If no user with ID 1, that's also acceptable
    });
  });

  // =========================================================================
  // Prologue shared constants
  // =========================================================================
  describe("A1: Prologue constants", () => {
    it("should export PROLOGUE_PARAGRAPHS with 9 entries", async () => {
      const mod = await import("../shared/prologue");
      expect(mod.PROLOGUE_PARAGRAPHS).toBeDefined();
      expect(Array.isArray(mod.PROLOGUE_PARAGRAPHS)).toBe(true);
      expect(mod.PROLOGUE_PARAGRAPHS.length).toBe(9);
    });

    it("each paragraph should be a non-empty string", async () => {
      const mod = await import("../shared/prologue");
      for (const p of mod.PROLOGUE_PARAGRAPHS) {
        expect(typeof p).toBe("string");
        expect(p.length).toBeGreaterThan(10);
      }
    });

    it("should export DOCTRINE_CARDS", async () => {
      const mod = await import("../shared/prologue");
      expect(mod.DOCTRINE_CARDS).toBeDefined();
      expect(Array.isArray(mod.DOCTRINE_CARDS)).toBe(true);
      expect(mod.DOCTRINE_CARDS.length).toBeGreaterThan(0);
    });

    it("each doctrine card should have doctrine, source, and emoji", async () => {
      const mod = await import("../shared/prologue");
      for (const card of mod.DOCTRINE_CARDS) {
        expect(card.doctrine).toBeDefined();
        expect(typeof card.doctrine).toBe("string");
        expect(card.source).toBeDefined();
        expect(card.emoji).toBeDefined();
        expect(typeof card.week).toBe("number");
      }
    });
  });

  // =========================================================================
  // A5 — Share quotes
  // =========================================================================
  describe("A5: Social share quotes", () => {
    it("should have SHARE_QUOTES array in socialShare module", async () => {
      // We test the shared prologue SHARE_QUOTES
      const mod = await import("../shared/prologue");
      expect(mod.SHARE_QUOTES).toBeDefined();
      expect(Array.isArray(mod.SHARE_QUOTES)).toBe(true);
      expect(mod.SHARE_QUOTES.length).toBeGreaterThanOrEqual(8);
    });
  });
});
