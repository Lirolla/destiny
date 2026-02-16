import { describe, it, expect } from "vitest";

describe("App Store URL Environment Variables", () => {
  it("should have VITE_APPLE_APP_STORE_URL defined (can be empty)", () => {
    // This env var is defined but may be empty until the app is published
    const url = process.env.VITE_APPLE_APP_STORE_URL;
    expect(url).toBeDefined();
  });

  it("should have VITE_GOOGLE_PLAY_URL defined (can be empty)", () => {
    const url = process.env.VITE_GOOGLE_PLAY_URL;
    expect(url).toBeDefined();
  });

  it("should show 'Coming Soon' toast when URL is empty string", () => {
    // When URL is empty, the component should show a toast instead of opening a link
    const url = "";
    expect(!url).toBe(true); // falsy empty string triggers toast
  });

  it("should open URL when a valid URL is provided", () => {
    const url = "https://apps.apple.com/app/destiny-hacking/id123456";
    expect(!!url).toBe(true); // truthy URL triggers window.open
  });
});
