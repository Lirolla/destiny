import { describe, it, expect } from "vitest";
import { testElevenLabsConnection, listVoices } from "./_core/elevenlabs";

describe("ElevenLabs API Integration", () => {
  it("should connect to ElevenLabs API with valid key", async () => {
    const isConnected = await testElevenLabsConnection();
    expect(isConnected).toBe(true);
  }, 10000); // 10 second timeout for API call

  it("should list available voices", async () => {
    const voices = await listVoices();
    expect(Array.isArray(voices)).toBe(true);
  }, 10000);
});
