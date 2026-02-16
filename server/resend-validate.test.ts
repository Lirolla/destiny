import { describe, it, expect } from "vitest";

describe("Resend API Key Validation", () => {
  it("should have RESEND_API_KEY configured", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(0);
    expect(key).toMatch(/^re_/); // Resend keys start with re_
  });

  it("should have RESEND_FROM_EMAIL configured", () => {
    const email = process.env.RESEND_FROM_EMAIL;
    expect(email).toBeDefined();
    expect(email!.length).toBeGreaterThan(0);
    expect(email).toContain("@");
  });

  it("should be able to import Resend and create a client", async () => {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    expect(resend).toBeDefined();
    expect(resend.emails).toBeDefined();
  });
});
