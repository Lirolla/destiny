/**
 * Regenerate Chapter 2 Only (Test)
 * 
 * This script regenerates only Chapter 2 using Chatterbox TTS
 * with the voice clone to test quality before regenerating all chapters.
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { db } from '../server/db';
import { bookChapters } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { storagePut } from '../server/storage';

const VOICE_SAMPLE_PATH = '/tmp/voice_sample.wav';
const CHAPTER_DIR = join(process.cwd(), 'manuscript-chapters');

/**
 * Execute Python script and return stdout
 */
function executePythonScript(script: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['-c', script]);
    
    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data); // Show progress
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data); // Show errors
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    python.on('error', (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });
  });
}

/**
 * Generate audio for a text chunk using Chatterbox TTS
 */
async function generateChatterboxAudio(
  text: string,
  voiceSamplePath: string,
  outputPath: string
): Promise<{ duration: number; sampleRate: number }> {
  const tempTextFile = join(tmpdir(), `chatterbox-text-${randomBytes(8).toString('hex')}.txt`);
  
  try {
    // Write text to temporary file
    writeFileSync(tempTextFile, text, 'utf-8');

    const pythonScript = `
import sys
import torch
import torchaudio as ta
from chatterbox.tts_turbo import ChatterboxTurboTTS

print("Loading Chatterbox model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model = ChatterboxTurboTTS.from_pretrained(device=device)

print("Reading text...")
with open("${tempTextFile.replace(/\\/g, '/')}", "r") as f:
    text = f.read()

print(f"Generating audio for {len(text)} characters...")
wav = model.generate(
    text,
    audio_prompt_path="${voiceSamplePath.replace(/\\/g, '/')}",
    exaggeration=0.5,
    cfg_weight=0.5
)

print("Saving audio...")
ta.save("${outputPath.replace(/\\/g, '/')}", wav, model.sr)

duration = wav.shape[-1] / model.sr
print(f"DURATION:{duration}")
print(f"SAMPLE_RATE:{model.sr}")
print("Done!")
`;

    const result = await executePythonScript(pythonScript);
    
    // Parse metadata
    const durationMatch = result.match(/DURATION:([\d.]+)/);
    const sampleRateMatch = result.match(/SAMPLE_RATE:(\d+)/);
    
    if (!durationMatch || !sampleRateMatch) {
      throw new Error('Failed to parse audio metadata');
    }

    return {
      duration: parseFloat(durationMatch[1]),
      sampleRate: parseInt(sampleRateMatch[1], 10),
    };
  } finally {
    if (existsSync(tempTextFile)) {
      unlinkSync(tempTextFile);
    }
  }
}

/**
 * Split text into sentence-aware chunks
 */
function splitIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Concatenate WAV files
 */
async function concatenateWavFiles(inputFiles: string[], outputFile: string): Promise<void> {
  const pythonScript = `
import wave
import sys

def concatenate_wav_files(input_files, output_file):
    data = []
    params = None
    
    for filename in input_files:
        with wave.open(filename, 'rb') as w:
            if params is None:
                params = w.getparams()
            data.append(w.readframes(w.getnframes()))
    
    with wave.open(output_file, 'wb') as output:
        output.setparams(params)
        for d in data:
            output.writeframes(d)

input_files = ${JSON.stringify(inputFiles)}
concatenate_wav_files(input_files, "${outputFile.replace(/\\/g, '/')}")
print("Concatenation complete")
`;

  await executePythonScript(pythonScript);
}

/**
 * Main execution
 */
async function main() {
  console.log('🎙️  Chatterbox Chapter 2 Regeneration (Test)');
  console.log('='.repeat(80));
  console.log();

  // Check voice sample
  if (!existsSync(VOICE_SAMPLE_PATH)) {
    console.error(`❌ Voice sample not found at: ${VOICE_SAMPLE_PATH}`);
    process.exit(1);
  }

  console.log(`✅ Voice sample found: ${VOICE_SAMPLE_PATH}`);

  // Get Chapter 2
  const chapters = await db
    .select()
    .from(bookChapters)
    .where(eq(bookChapters.chapterNumber, 2));

  if (chapters.length === 0) {
    console.error('❌ Chapter 2 not found in database');
    process.exit(1);
  }

  const chapter = chapters[0];
  console.log(`\nProcessing Chapter ${chapter.chapterNumber}: ${chapter.title}\n`);

  // Read chapter text
  const textFilename = `chapter_${String(chapter.chapterNumber).padStart(2, '0')}.txt`;
  const textPath = join(CHAPTER_DIR, textFilename);
  if (!existsSync(textPath)) {
    throw new Error(`Chapter text file not found: ${textPath}`);
  }

  const fullText = readFileSync(textPath, 'utf-8');
  console.log(`Text length: ${fullText.length} characters`);

  // Split into chunks
  const chunks = splitIntoChunks(fullText, 4000);
  console.log(`Split into ${chunks.length} chunks`);

  // Generate audio for each chunk
  const tempDir = tmpdir();
  const chunkFiles: string[] = [];
  let totalDuration = 0;

  for (let i = 0; i < chunks.length; i++) {
    console.log(`\nGenerating chunk ${i + 1}/${chunks.length}...`);
    const chunkFile = join(tempDir, `chapter2_chunk${i}.wav`);
    
    const { duration } = await generateChatterboxAudio(
      chunks[i],
      VOICE_SAMPLE_PATH,
      chunkFile
    );
    
    chunkFiles.push(chunkFile);
    totalDuration += duration;
    console.log(`Chunk ${i + 1} duration: ${duration.toFixed(2)}s`);
  }

  console.log(`\nTotal duration: ${(totalDuration / 60).toFixed(2)} minutes`);

  // Concatenate chunks
  console.log('\nConcatenating audio chunks...');
  const finalWavFile = join(tempDir, 'chapter2_final.wav');
  await concatenateWavFiles(chunkFiles, finalWavFile);

  // Upload to S3
  console.log('\nUploading to S3...');
  const audioBuffer = readFileSync(finalWavFile);
  const fileKey = `audiobook/chapter_02_chatterbox_test.wav`;
  const { url } = await storagePut(fileKey, audioBuffer, 'audio/wav');
  
  console.log(`Uploaded: ${url}`);

  // Update database
  console.log('\nUpdating database...');
  await db
    .update(bookChapters)
    .set({
      audioUrl: url,
      audioDuration: Math.round(totalDuration),
    })
    .where(eq(bookChapters.id, chapter.id));

  // Cleanup temporary files
  console.log('\nCleaning up temporary files...');
  for (const file of [...chunkFiles, finalWavFile]) {
    if (existsSync(file)) {
      unlinkSync(file);
    }
  }

  console.log(`\n✅ Chapter 2 regeneration complete!`);
  console.log(`\n🎧 Test the audio at: ${url}`);
  console.log('\nIf quality is good, run the full regeneration script for all chapters.');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
