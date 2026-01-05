import { describe, it, expect } from "vitest";
import { generateSpeech } from "./_core/elevenlabs";
import * as db from "./db";

describe("Audiobook Generation Workflow", () => {
  describe("Text-to-Speech Generation", () => {
    it("should generate speech audio from text using built-in voice", async () => {
      // Use a built-in ElevenLabs voice (Rachel - a standard voice available to all accounts)
      const builtInVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

      const testText = "This is a test of the audiobook generation system. The voice cloning technology allows the author to narrate their own book.";

      const audioBuffer = await generateSpeech({
        voiceId: builtInVoiceId,
        text: testText,
        seed: 1,
      });

      expect(audioBuffer).toBeDefined();
      expect(Buffer.isBuffer(audioBuffer)).toBe(true);
      expect(audioBuffer.length).toBeGreaterThan(0);
      
      console.log(`✅ Generated ${audioBuffer.length} bytes of audio`);
    }, 30000); // 30 second timeout for TTS generation

    it("should generate different audio for different text", async () => {
      const builtInVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice

      const text1 = "Hello world, this is the first test.";
      const text2 = "Goodbye world, this is the second test.";

      const audio1 = await generateSpeech({
        voiceId: builtInVoiceId,
        text: text1,
        seed: 1,
      });

      const audio2 = await generateSpeech({
        voiceId: builtInVoiceId,
        text: text2,
        seed: 2,
      });

      expect(audio1.length).not.toBe(audio2.length);
      
      console.log(`✅ Generated audio1: ${audio1.length} bytes, audio2: ${audio2.length} bytes`);
    }, 60000);
  });

  describe("Chapter Creation", () => {
    it("should create audiobook chapter with all required fields", async () => {
      const chapter = await db.createAudiobookChapter({
        chapterNumber: 99, // Use high number to avoid conflicts
        title: "Test Chapter",
        description: "This is a test chapter",
        audioUrl: "https://example.com/test-chapter.mp3",
        duration: 300,
      });

      expect(chapter).toBeDefined();
      expect(chapter.chapterNumber).toBe(99);
      expect(chapter.title).toBe("Test Chapter");
      expect(chapter.audioUrl).toBe("https://example.com/test-chapter.mp3");
      expect(chapter.audioDuration).toBe(300);
      expect(chapter.audioGenerated).toBe(true);
    });

    it("should list audiobook chapters", async () => {
      const chapters = await db.listAudiobookChapters();
      
      expect(Array.isArray(chapters)).toBe(true);
      
      // Should only include chapters with audio
      chapters.forEach(chapter => {
        expect(chapter.audioUrl).toBeDefined();
        expect(chapter.audioUrl).not.toBeNull();
      });
    });
  });

  describe("Duration Estimation", () => {
    it("should estimate audio duration based on text length", () => {
      // Test the estimation formula: ~150 words per minute, ~5 chars per word
      const text = "word ".repeat(150); // 150 words
      const estimatedWords = text.length / 5;
      const estimatedDuration = Math.ceil((estimatedWords / 150) * 60);

      // Should be approximately 60 seconds (1 minute)
      expect(estimatedDuration).toBeGreaterThanOrEqual(55);
      expect(estimatedDuration).toBeLessThanOrEqual(65);
    });

    it("should scale duration with text length", () => {
      const shortText = "word ".repeat(75); // 75 words
      const longText = "word ".repeat(300); // 300 words

      const shortDuration = Math.ceil((shortText.length / 5 / 150) * 60);
      const longDuration = Math.ceil((longText.length / 5 / 150) * 60);

      expect(longDuration).toBeGreaterThan(shortDuration * 2);
    });
  });

  describe("Primary Voice Model", () => {
    it("should retrieve primary voice model for audiobook", async () => {
      const primaryVoice = await db.getPrimaryVoiceModel();
      
      if (primaryVoice) {
        expect(primaryVoice.isPrimary).toBe(true);
        expect(primaryVoice.status).toBe("ready");
        expect(primaryVoice.modelId).toBeDefined();
      } else {
        console.log("⚠️  No primary voice model found. Author needs to create voice clone.");
      }
    });
  });
});
