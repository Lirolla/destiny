import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";
import { testElevenLabsConnection, listVoices } from "./_core/elevenlabs";

describe("Author Voice Cloning Workflow", () => {
  describe("ElevenLabs Integration", () => {
    it("should have valid ElevenLabs API connection", async () => {
      const isConnected = await testElevenLabsConnection();
      expect(isConnected).toBe(true);
    }, 10000);

    it("should be able to list available voices", async () => {
      const voices = await listVoices();
      expect(Array.isArray(voices)).toBe(true);
    }, 10000);
  });

  describe("Voice Model Database Operations", () => {
    let testVoiceModelId: string;

    it("should create a primary voice model", async () => {
      const voiceModel = await db.createVoiceModel({
        userId: 1, // Assuming admin user ID is 1
        modelId: `test_voice_${Date.now()}`,
        modelName: "Test Author Voice",
        sampleAudioUrl: "https://example.com/sample.webm",
        isPrimary: true,
      });

      expect(voiceModel).toBeDefined();
      expect(voiceModel.isPrimary).toBe(true);
      expect(voiceModel.modelName).toBe("Test Author Voice");
      
      testVoiceModelId = voiceModel.modelId;
    });

    it("should retrieve the primary voice model", async () => {
      const primaryVoice = await db.getPrimaryVoiceModel();
      
      expect(primaryVoice).toBeDefined();
      expect(primaryVoice?.isPrimary).toBe(true);
      expect(primaryVoice?.status).toBe("ready");
    });

    it("should list user voice models", async () => {
      const models = await db.getUserVoiceModels(1);
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it("should update voice model status", async () => {
      if (testVoiceModelId) {
        await db.updateVoiceModelStatus(testVoiceModelId, "ready");
        
        const models = await db.getUserVoiceModels(1);
        const updatedModel = models.find(m => m.modelId === testVoiceModelId);
        
        expect(updatedModel?.status).toBe("ready");
      }
    });
  });

  describe("Voice Model Schema", () => {
    it("should have isPrimary field in voice models", async () => {
      const models = await db.getUserVoiceModels(1);
      
      if (models.length > 0) {
        const model = models[0];
        expect(model).toHaveProperty("isPrimary");
        expect(typeof model.isPrimary).toBe("boolean");
      }
    });

    it("should have status field with correct enum values", async () => {
      const models = await db.getUserVoiceModels(1);
      
      if (models.length > 0) {
        const model = models[0];
        expect(model).toHaveProperty("status");
        expect(["pending", "training", "ready", "failed"]).toContain(model.status);
      }
    });
  });

  describe("Audiobook Chapter Integration", () => {
    it("should be able to create audiobook chapters", async () => {
      const chapter = await db.createAudiobookChapter({
        chapterNumber: 1,
        title: "Test Chapter",
        description: "Test chapter description",
        audioUrl: "https://example.com/chapter1.mp3",
        duration: 600,
      });

      expect(chapter).toBeDefined();
      expect(chapter.chapterNumber).toBe(1);
      expect(chapter.title).toBe("Test Chapter");
    });

    it("should list all audiobook chapters", async () => {
      const chapters = await db.listAudiobookChapters();
      
      expect(Array.isArray(chapters)).toBe(true);
      expect(chapters.length).toBeGreaterThan(0);
    });
  });
});
