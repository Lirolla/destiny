import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { bookChapters } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = '9SMbtbEswwG78xP75Lqm'; // User's cloned voice

async function generateAudioChunk(text: string, outputPath: string): Promise<void> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputPath, buffer);
}

function chunkText(text: string, maxChunkSize: number = 4500): string[] {
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

async function normalizeAudio(inputPath: string, outputPath: string): Promise<void> {
  // Use ffmpeg to normalize audio volume using loudnorm filter
  const command = `ffmpeg -i "${inputPath}" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -y "${outputPath}"`;
  
  try {
    await execAsync(command);
    console.log(`✓ Normalized audio: ${outputPath}`);
  } catch (error) {
    console.error('Error normalizing audio:', error);
    throw error;
  }
}

async function main() {
  console.log('🎙️  Regenerating Chapter 14 Portuguese audio with volume normalization...\n');

  // Read the Portuguese text
  const textPath = '/home/ubuntu/destiny-hacking-app/manuscript-chapters-pt/chapter_14.txt';
  const text = fs.readFileSync(textPath, 'utf-8');
  
  console.log(`📖 Text length: ${text.length} characters`);
  
  // Create temp directory
  const tempDir = '/tmp/chapter14-pt-regeneration';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Chunk the text
  const chunks = chunkText(text);
  console.log(`📝 Split into ${chunks.length} chunks\n`);

  // Generate audio for each chunk
  const chunkFiles: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = path.join(tempDir, `chunk_${i}.mp3`);
    console.log(`Generating chunk ${i + 1}/${chunks.length}...`);
    await generateAudioChunk(chunks[i], chunkPath);
    chunkFiles.push(chunkPath);
    
    // Rate limiting
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n✓ All chunks generated');

  // Concatenate chunks
  const concatListPath = path.join(tempDir, 'concat_list.txt');
  const concatList = chunkFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(concatListPath, concatList);

  const rawOutputPath = path.join(tempDir, 'chapter_14_pt_raw.mp3');
  console.log('\n🔗 Concatenating audio chunks...');
  await execAsync(`ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy -y "${rawOutputPath}"`);
  console.log('✓ Concatenation complete');

  // Normalize the audio to fix volume fluctuations
  const normalizedPath = path.join(tempDir, 'chapter_14_pt_normalized.mp3');
  console.log('\n🔊 Normalizing audio volume...');
  await normalizeAudio(rawOutputPath, normalizedPath);

  // Get audio duration
  const { stdout } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${normalizedPath}"`);
  const duration = Math.round(parseFloat(stdout.trim()));
  console.log(`\n⏱️  Duration: ${duration} seconds (${Math.floor(duration / 60)}m ${duration % 60}s)`);

  // Upload to S3 using manus-upload-file
  console.log('\n☁️  Uploading to S3...');
  const { stdout: uploadOutput } = await execAsync(`manus-upload-file "${normalizedPath}"`);
  const audioUrl = uploadOutput.trim();
  console.log(`✓ Uploaded: ${audioUrl}`);

  // Update database
  console.log('\n💾 Updating database...');
  await db.update(bookChapters)
    .set({ 
      audioUrlPt: audioUrl,
      duration: duration
    })
    .where(eq(bookChapters.chapterNumber, 14));
  
  console.log('✓ Database updated');

  // Cleanup
  console.log('\n🧹 Cleaning up temp files...');
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('\n✅ Chapter 14 Portuguese audio regenerated successfully!');
  console.log(`   New URL: ${audioUrl}`);
  console.log(`   Duration: ${duration}s`);
}

main().catch(console.error);
