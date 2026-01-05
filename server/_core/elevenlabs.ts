/**
 * ElevenLabs Voice Cloning & Text-to-Speech Integration
 * 
 * Provides helpers for:
 * - Voice cloning from audio samples
 * - Text-to-speech generation with cloned voices
 */

import { ENV } from "./env";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io";

/**
 * Test ElevenLabs API connection by fetching available voices
 */
export async function testElevenLabsConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices`, {
      method: "GET",
      headers: {
        "xi-api-key": ENV.elevenLabsApiKey,
      },
    });

    if (!response.ok) {
      console.error("ElevenLabs API test failed:", response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("ElevenLabs API connection error:", error);
    return false;
  }
}

/**
 * Create an Instant Voice Clone from audio samples
 * 
 * @param name - Display name for the voice
 * @param audioFileUrl - URL to the audio sample file (10-15 minutes recommended)
 * @param description - Optional description of the voice
 * @returns Voice ID and verification status
 */
export async function createVoiceClone(params: {
  name: string;
  audioFileUrl: string;
  description?: string;
}): Promise<{
  voiceId: string;
  requiresVerification: boolean;
}> {
  // Download audio file from URL
  const audioResponse = await fetch(params.audioFileUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio file: ${audioResponse.statusText}`);
  }

  const audioBlob = await audioResponse.blob();

  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append("name", params.name);
  formData.append("files", audioBlob, "voice_sample.webm");
  
  if (params.description) {
    formData.append("description", params.description);
  }

  // Call ElevenLabs voice cloning API
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices/add`, {
    method: "POST",
    headers: {
      "xi-api-key": ENV.elevenLabsApiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Voice cloning failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  return {
    voiceId: result.voice_id,
    requiresVerification: result.requires_verification,
  };
}

/**
 * Generate speech audio from text using a cloned voice
 * 
 * @param voiceId - ID of the cloned voice
 * @param text - Text to convert to speech
 * @param options - Optional generation parameters
 * @returns Audio buffer (MP3 format)
 */
export async function generateSpeech(params: {
  voiceId: string;
  text: string;
  modelId?: string;
  previousText?: string;
  nextText?: string;
  seed?: number;
}): Promise<Buffer> {
  const requestBody = {
    text: params.text,
    model_id: params.modelId || "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  };

  // Add optional context for continuity
  if (params.previousText) {
    (requestBody as any).previous_text = params.previousText;
  }
  if (params.nextText) {
    (requestBody as any).next_text = params.nextText;
  }
  if (params.seed !== undefined) {
    (requestBody as any).seed = params.seed;
  }

  const response = await fetch(
    `${ELEVENLABS_API_BASE}/v1/text-to-speech/${params.voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ENV.elevenLabsApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Speech generation failed: ${response.status} ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * List all voices available in the account
 */
export async function listVoices(): Promise<any[]> {
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices`, {
    method: "GET",
    headers: {
      "xi-api-key": ENV.elevenLabsApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list voices: ${response.statusText}`);
  }

  const result = await response.json();
  return result.voices || [];
}

/**
 * Delete a voice clone
 */
export async function deleteVoice(voiceId: string): Promise<void> {
  const response = await fetch(`${ELEVENLABS_API_BASE}/v1/voices/${voiceId}`, {
    method: "DELETE",
    headers: {
      "xi-api-key": ENV.elevenLabsApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete voice: ${response.statusText}`);
  }
}
