import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

// Helper to read a file relative to project root
const readFile = (filePath: string) =>
  fs.readFileSync(path.resolve(__dirname, "..", filePath), "utf-8");

describe("Phase 75: Password Reset Email via Resend", () => {
  it("should have email.ts helper module", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("import { Resend }");
    expect(content).toContain("sendPasswordResetEmail");
    expect(content).toContain("RESEND_API_KEY");
    expect(content).toContain("RESEND_FROM_EMAIL");
  });

  it("should export sendPasswordResetEmail function", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("export async function sendPasswordResetEmail");
  });

  it("should support bilingual email templates (EN and PT)", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("Redefinir Senha");
    expect(content).toContain("Reset Your Password");
    expect(content).toContain("language === \"pt\"");
  });

  it("should include company info in email footer", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("Merx Digital Solutions Ltd");
    expect(content).toContain("128 City Road, London, EC1V 2NX");
  });

  it("should have branded email with Destiny Hacking styling", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("Destiny Hacking");
    expect(content).toContain("#10b981"); // emerald green brand color
    expect(content).toContain("#0a0a0a"); // dark background
  });

  it("should build reset URL from token", () => {
    const content = readFile("server/email.ts");
    expect(content).toContain("resetToken");
    expect(content).toContain("/auth?mode=reset&token=");
  });

  it("should import sendPasswordResetEmail in routers.ts", () => {
    const content = readFile("server/routers.ts");
    expect(content).toContain('import { sendPasswordResetEmail } from "./email"');
  });

  it("should call sendPasswordResetEmail in forgotPassword endpoint", () => {
    const content = readFile("server/routers.ts");
    expect(content).toContain("sendPasswordResetEmail(input.email, token)");
  });

  it("should no longer have console.log for reset token in forgotPassword", () => {
    const content = readFile("server/routers.ts");
    // The old console.log lines should be replaced
    expect(content).not.toContain("console.log(`[Auth] Password reset token for");
    expect(content).not.toContain("console.log(`[Auth] Reset link:");
  });

  it("should handle email send failure gracefully", () => {
    const content = readFile("server/routers.ts");
    expect(content).toContain("console.warn(`[Auth] Failed to send reset email");
  });
});

describe("Phase 75: App Store URLs via Environment Variables", () => {
  it("should read VITE_APPLE_APP_STORE_URL from env in AppStoreBadges", () => {
    const content = readFile("client/src/components/AppStoreBadges.tsx");
    expect(content).toContain("import.meta.env.VITE_APPLE_APP_STORE_URL");
  });

  it("should read VITE_GOOGLE_PLAY_URL from env in AppStoreBadges", () => {
    const content = readFile("client/src/components/AppStoreBadges.tsx");
    expect(content).toContain("import.meta.env.VITE_GOOGLE_PLAY_URL");
  });

  it("should prefer props over env vars", () => {
    const content = readFile("client/src/components/AppStoreBadges.tsx");
    // Props come first in the || chain
    expect(content).toContain("appleUrl || import.meta.env.VITE_APPLE_APP_STORE_URL");
    expect(content).toContain("googleUrl || import.meta.env.VITE_GOOGLE_PLAY_URL");
  });

  it("should show Coming Soon toast when URL is empty", () => {
    const content = readFile("client/src/components/AppStoreBadges.tsx");
    expect(content).toContain("Coming soon");
    expect(content).toContain("Em breve");
  });
});

describe("Phase 75: Audiobook Mini-Player", () => {
  it("should have AudiobookMiniPlayer component", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("export function AudiobookMiniPlayer");
  });

  it("should use localStorage for now-playing state", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("audiobook-now-playing");
    expect(content).toContain("localStorage.getItem(STORAGE_KEY)");
    expect(content).toContain("localStorage.removeItem(STORAGE_KEY)");
  });

  it("should listen for custom events for same-tab communication", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("CustomEvent");
    expect(content).toContain("audiobook-now-playing");
  });

  it("should hide on audiobook page to avoid double player", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("isOnAudiobookPage");
    expect(content).toContain('/audiobook');
  });

  it("should have play/pause, skip forward, and close controls", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("togglePlay");
    expect(content).toContain("skipForward");
    expect(content).toContain("handleClose");
    expect(content).toContain("Play");
    expect(content).toContain("Pause");
    expect(content).toContain("SkipForward");
    expect(content).toContain("X");
  });

  it("should show progress bar", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("progress");
    expect(content).toContain("width:");
  });

  it("should show chapter info with tap to navigate", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("navigateToAudiobook");
    expect(content).toContain("chapterNumber");
    expect(content).toContain("getChapterTitle");
  });

  it("should format time correctly", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("function formatTime");
    expect(content).toContain("padStart(2,");
  });

  it("should be positioned above bottom nav with correct z-index", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("fixed bottom-16");
    expect(content).toContain("z-[9989]");
  });

  it("should be included in AppShell", () => {
    const content = readFile("client/src/components/AppShell.tsx");
    expect(content).toContain("AudiobookMiniPlayer");
    expect(content).toContain("import { AudiobookMiniPlayer }");
  });

  it("should broadcast now-playing state from Audiobook page", () => {
    const content = readFile("client/src/pages/Audiobook.tsx");
    expect(content).toContain("broadcastNowPlaying");
    expect(content).toContain("audiobook-now-playing");
    expect(content).toContain("localStorage.setItem");
  });

  it("should use bilingual chapter labels", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("Cap.");
    expect(content).toContain("Ch.");
    expect(content).toContain("useLanguage");
  });

  it("should have an audio element for playback", () => {
    const content = readFile("client/src/components/AudiobookMiniPlayer.tsx");
    expect(content).toContain("<audio");
    expect(content).toContain("audioRef");
    expect(content).toContain("onTimeUpdate");
    expect(content).toContain("onLoadedMetadata");
    expect(content).toContain("onEnded");
  });
});
