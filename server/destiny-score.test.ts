import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Destiny Score", () => {
  const createCaller = (userId: number) =>
    appRouter.createCaller({
      user: { id: userId, openId: "test", name: "Test", role: "user" } as any,
    });

  it("returns uncalibrated when no states exist", async () => {
    const caller = createCaller(999);
    const result = await caller.sliders.getDestinyScore();
    expect(result.level).toBe("uncalibrated");
    expect(result.score).toBeNull();
    expect(result.calibratedCount).toBe(0);
  });

  it("lists all 15 axes for the owner user", async () => {
    const caller = createCaller(1);
    const axes = await caller.sliders.listAxes();
    expect(axes.length).toBe(15);
    
    // Verify all axis numbers 0-14 are present
    const axisNumbers = axes.map((a: any) => a.axisNumber).sort((a: number, b: number) => a - b);
    expect(axisNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it("each axis has emoji, colorLow, colorHigh, and reflectionPrompt", async () => {
    const caller = createCaller(1);
    const axes = await caller.sliders.listAxes();
    
    for (const axis of axes) {
      const a = axis as any;
      expect(a.emoji).toBeTruthy();
      expect(a.colorLow).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(a.colorHigh).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(a.reflectionPrompt).toBeTruthy();
      expect(a.axisName).toBeTruthy();
      expect(a.chapterRef).toBeTruthy();
    }
  });

  it("axes have correct names matching the book chapters", async () => {
    const caller = createCaller(1);
    const axes = await caller.sliders.listAxes();
    
    const expectedNames = [
      "The Will Axis",
      "The Ownership Axis",
      "The Sowing Axis",
      "The Meaning Axis",
      "The Agency Axis",
      "The Decisiveness Axis",
      "The Phoenix Axis",
      "The Stoic Axis",
      "The Responsibility Axis",
      "The Alchemy Axis",
      "The Flow Axis",
      "The Faith Axis",
      "The Tribe Axis",
      "The Architect Axis",
      "The Invictus Axis",
    ];
    
    const sortedAxes = [...axes].sort((a: any, b: any) => a.axisNumber - b.axisNumber);
    for (let i = 0; i < expectedNames.length; i++) {
      expect((sortedAxes[i] as any).axisName).toBe(expectedNames[i]);
    }
  });
});
