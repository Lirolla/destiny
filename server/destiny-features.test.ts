import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-destiny",
    email: "test@destiny.com",
    name: "Test Pilot",
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

  return { ctx };
}

describe("sliders.getLowest3", () => {
  it("returns an array (possibly empty if no calibrations)", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sliders.getLowest3();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(3);
  });
});

describe("sliders.getCheckInStatus", () => {
  it("returns a valid check-in status object", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sliders.getCheckInStatus();
    expect(result).toHaveProperty("period");
    expect(["morning", "midday", "evening"]).toContain(result.period);
    expect(typeof result.morningDone).toBe("boolean");
    expect(typeof result.middayDone).toBe("boolean");
    expect(typeof result.eveningDone).toBe("boolean");
    expect(typeof result.isComplete).toBe("boolean");
    expect(typeof result.cycleExists).toBe("boolean");
  });
});

describe("sliders.getDestinyScore", () => {
  it("returns a valid destiny score object", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sliders.getDestinyScore();
    expect(result).toHaveProperty("calibratedCount");
    expect(result).toHaveProperty("totalAxes");
    expect(result).toHaveProperty("level");
    expect(typeof result.totalAxes).toBe("number");
    expect(typeof result.calibratedCount).toBe("number");
  });

  it("returns uncalibrated when no states exist", async () => {
    const { ctx } = createAuthContext();
    // Use a user ID that has no data
    ctx.user = { ...ctx.user!, id: 99999 };
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sliders.getDestinyScore();
    expect(result.level).toBe("uncalibrated");
    expect(result.score).toBeNull();
  });
});

describe("achievements.list", () => {
  it("includes mastery badges in the list", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const badges = await caller.achievements.list();
    expect(Array.isArray(badges)).toBe(true);

    // Check that mastery badges exist
    const masteryBadges = badges.filter(b => b.category === "mastery");
    expect(masteryBadges.length).toBeGreaterThanOrEqual(7);

    // Check specific badges
    const invictus = badges.find(b => b.id === "invictus");
    expect(invictus).toBeDefined();
    expect(invictus?.name).toBe("Invictus");
    expect(invictus?.rarity).toBe("legendary");
    expect(invictus?.icon).toBe("👑");

    const risingPilot = badges.find(b => b.id === "axis_above_70_any");
    expect(risingPilot).toBeDefined();
    expect(risingPilot?.name).toBe("Rising Pilot");

    const destinyScore80 = badges.find(b => b.id === "destiny_score_80");
    expect(destinyScore80).toBeDefined();
    expect(destinyScore80?.name).toBe("High Destiny");

    const destinyScore90 = badges.find(b => b.id === "destiny_score_90");
    expect(destinyScore90).toBeDefined();
    expect(destinyScore90?.name).toBe("Transcendent");
  });

  it("all badges have required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const badges = await caller.achievements.list();
    for (const badge of badges) {
      expect(badge).toHaveProperty("id");
      expect(badge).toHaveProperty("name");
      expect(badge).toHaveProperty("description");
      expect(badge).toHaveProperty("category");
      expect(badge).toHaveProperty("rarity");
      expect(badge).toHaveProperty("icon");
      expect(badge).toHaveProperty("unlocked");
      expect(typeof badge.unlocked).toBe("boolean");
    }
  });
});

describe("achievements.checkAndUnlock", () => {
  it("returns a newlyUnlocked array", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.achievements.checkAndUnlock();
    expect(result).toHaveProperty("newlyUnlocked");
    expect(Array.isArray(result.newlyUnlocked)).toBe(true);
  });
});
