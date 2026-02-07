import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { sdk } from "./sdk";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { randomUUID } from "crypto";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

/**
 * Auto-create an anonymous guest user when no session exists.
 * This allows the app to work without any login flow.
 */
async function getOrCreateGuestUser(
  req: CreateExpressContextOptions["req"],
  res: CreateExpressContextOptions["res"]
): Promise<User | null> {
  try {
    // First, try to authenticate with existing session cookie
    const user = await sdk.authenticateRequest(req);
    if (user) return user;
  } catch {
    // No valid session - create a guest user
  }

  try {
    // Generate a unique guest ID
    const guestOpenId = `guest_${randomUUID()}`;
    const guestName = "Reader";

    // Create the guest user in the database
    await db.upsertUser({
      openId: guestOpenId,
      name: guestName,
      email: null,
      loginMethod: "guest",
      lastSignedIn: new Date(),
    });

    // Create a session token for the guest
    const sessionToken = await sdk.createSessionToken(guestOpenId, {
      name: guestName,
      expiresInMs: ONE_YEAR_MS,
    });

    // Set the session cookie so subsequent requests are authenticated
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

    // Fetch and return the newly created user
    const newUser = await db.getUserByOpenId(guestOpenId);
    return newUser;
  } catch (error) {
    console.error("[Auth] Failed to create guest user:", error);
    return null;
  }
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const user = await getOrCreateGuestUser(opts.req, opts.res);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
