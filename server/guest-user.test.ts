import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createGuestContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 999,
    openId: "guest-test-user-123",
    email: null,
    name: "Guest",
    loginMethod: "guest",
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
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("guest user access", () => {
  it("guest user can access auth.me endpoint", async () => {
    const { ctx } = createGuestContext();
    const caller = appRouter.createCaller(ctx);

    // auth.me returns ctx.user directly (not wrapped in { user })
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.openId).toBe("guest-test-user-123");
    expect(result?.name).toBe("Guest");
  });

  it("guest user can access public procedures", async () => {
    const { ctx } = createGuestContext();
    const caller = appRouter.createCaller(ctx);

    const meResult = await caller.auth.me();
    expect(meResult).toBeTruthy();
  });

  it("guest user has user role", async () => {
    const { ctx } = createGuestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result?.role).toBe("user");
  });

  it("guest user has loginMethod set to guest", async () => {
    const { ctx } = createGuestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result?.loginMethod).toBe("guest");
  });
});
