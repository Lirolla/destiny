import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

// Mock user context
const createMockContext = (userId: number): Context => ({
  user: {
    id: userId,
    openId: `test-user-${userId}`,
    name: `Test User ${userId}`,
    email: `user${userId}@test.com`,
    role: "user",
    timezone: "UTC",
    dailyReminderTime: "09:00",
    notificationsEnabled: false,
    pushSubscription: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    loginMethod: "oauth",
  },
});

describe("Notifications", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should get notification settings", async () => {
    const settings = await caller.notifications.getSettings();
    
    expect(settings).toHaveProperty("enabled");
    expect(settings).toHaveProperty("reminderTime");
    expect(settings).toHaveProperty("timezone");
    expect(typeof settings.enabled).toBe("boolean");
  });

  it("should update notification settings", async () => {
    const result = await caller.notifications.updateSettings({
      enabled: true,
      reminderTime: "08:00",
      timezone: "America/New_York",
    });

    expect(result.success).toBe(true);
  });

  it("should validate reminder time format", async () => {
    await expect(
      caller.notifications.updateSettings({
        enabled: true,
        reminderTime: "invalid-time",
      })
    ).rejects.toThrow();
  });

  it("should save push subscription", async () => {
    const subscription = {
      endpoint: "https://fcm.googleapis.com/fcm/send/...",
      keys: {
        p256dh: "test-key",
        auth: "test-auth",
      },
    };

    const result = await caller.notifications.savePushSubscription({
      subscription,
    });

    expect(result.success).toBe(true);
  });
});

describe("Challenges", () => {
  const caller = appRouter.createCaller(createMockContext(1));

  it("should create a new challenge", async () => {
    const challenge = await caller.challenges.create({
      name: "30-Day Test Challenge",
      description: "Test challenge description",
      challengeType: "daily_consistency",
      startDate: "2025-01-01",
      endDate: "2025-01-30",
      isPrivate: true,
    });

    expect(challenge).toHaveProperty("id");
    expect(challenge.name).toBe("30-Day Test Challenge");
    expect(challenge.status).toBe("upcoming");
  });

  it("should list user challenges", async () => {
    const challenges = await caller.challenges.list();
    
    expect(challenges).toHaveProperty("created");
    expect(challenges).toHaveProperty("joined");
    expect(Array.isArray(challenges.created)).toBe(true);
    expect(Array.isArray(challenges.joined)).toBe(true);
  });

  it("should validate date format", async () => {
    await expect(
      caller.challenges.create({
        name: "Invalid Challenge",
        challengeType: "daily_consistency",
        startDate: "invalid-date",
        endDate: "2025-01-30",
        isPrivate: true,
      })
    ).rejects.toThrow();
  });

  it("should join a challenge", async () => {
    // First create a challenge
    const challenge = await caller.challenges.create({
      name: "Join Test Challenge",
      challengeType: "daily_consistency",
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      isPrivate: false,
    });

    // Create user 2 in database first and get their ID
    const { upsertUser, getUserByOpenId } = await import("./db");
    await upsertUser({
      openId: "test-user-join",
      name: "Test User Join",
      email: "userjoin@test.com",
    });

    const user2 = await getUserByOpenId("test-user-join");
    if (!user2) throw new Error("User not created");

    // Then join it with the actual user
    const caller2 = appRouter.createCaller(createMockContext(user2.id));
    const result = await caller2.challenges.join({
      sessionId: challenge.id,
    });

    expect(result.success).toBe(true);
  });

  it("should get challenge details", async () => {
    // Create a challenge
    const challenge = await caller.challenges.create({
      name: "Details Test Challenge",
      challengeType: "daily_consistency",
      startDate: "2025-03-01",
      endDate: "2025-03-30",
      isPrivate: true,
    });

    // Get its details
    const details = await caller.challenges.getById({ id: challenge.id });

    expect(details.session).toHaveProperty("id");
    expect(details.session.id).toBe(challenge.id);
    expect(Array.isArray(details.participants)).toBe(true);
  });

  it("should leave a challenge", async () => {
    // Create user 3 in database first and get their ID
    const { upsertUser, getUserByOpenId } = await import("./db");
    await upsertUser({
      openId: "test-user-leave",
      name: "Test User Leave",
      email: "userleave@test.com",
    });

    const user3 = await getUserByOpenId("test-user-leave");
    if (!user3) throw new Error("User not created");

    // Create and join a challenge
    const challenge = await caller.challenges.create({
      name: "Leave Test Challenge",
      challengeType: "daily_consistency",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      isPrivate: false,
    });

    const caller3 = appRouter.createCaller(createMockContext(user3.id));
    await caller3.challenges.join({ sessionId: challenge.id });

    // Leave the challenge
    const result = await caller3.challenges.leave({ sessionId: challenge.id });

    expect(result.success).toBe(true);
  });
});
