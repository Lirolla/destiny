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

  it("getDestinyScore returns valid structure", async () => {
    const caller = createCaller(999);
    const result = await caller.sliders.getDestinyScore();
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("calibratedCount");
    expect(result).toHaveProperty("totalAxes");
    expect(["uncalibrated", "critical", "needs_work", "growing", "strong", "mastery"]).toContain(result.level);
  });

  it("getLowest3 returns at most 3 axes", async () => {
    const caller = createCaller(999);
    const result = await caller.sliders.getLowest3();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("getCheckInStatus returns valid period", async () => {
    const caller = createCaller(999);
    const result = await caller.sliders.getCheckInStatus();
    expect(result).toHaveProperty("period");
    expect(["morning", "midday", "evening"]).toContain(result.period);
    expect(result).toHaveProperty("morningDone");
    expect(result).toHaveProperty("middayDone");
    expect(result).toHaveProperty("eveningDone");
    expect(typeof result.morningDone).toBe("boolean");
  });
});
