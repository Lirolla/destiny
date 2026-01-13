import { db } from '../server/_core/db.js';
import { voiceModels } from '../drizzle/schema';
import { desc } from 'drizzle-orm';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('Fetching latest voice model from database...');
  
  const models = await db.select().from(voiceModels).orderBy(desc(voiceModels.id)).limit(1);
  
  if (models.length === 0) {
    console.error('❌ No voice models found in database');
    console.error('Please upload a voice sample at: https://destinyhack-fsrnwghw.manus.space/record-voice');
    process.exit(1);
  }

  const model = models[0];
  console.log(`✅ Found voice model: ${model.modelName || 'Unnamed'}`);
  console.log(`📍 Sample URL: ${model.sampleAudioUrl}`);
  
  // Download the voice sample
  console.log('\n📥 Downloading voice sample...');
  try {
    await execAsync(`curl -L "${model.sampleAudioUrl}" -o /tmp/voice_sample.wav`);
    console.log('✅ Downloaded to /tmp/voice_sample.wav');
    
    // Check file size
    const { stdout } = await execAsync('ls -lh /tmp/voice_sample.wav');
    console.log(stdout.trim());
    
    // Check duration with ffprobe if available
    try {
      const { stdout: duration } = await execAsync('ffprobe -i /tmp/voice_sample.wav -show_entries format=duration -v quiet -of csv="p=0"');
      const seconds = parseFloat(duration);
      console.log(`⏱️  Duration: ${seconds.toFixed(2)} seconds`);
      
      if (seconds < 10) {
        console.warn('\n⚠️  Warning: Voice sample is less than 10 seconds. For best results, use 10+ seconds of clear speech.');
      }
    } catch (e) {
      // ffprobe not available, skip duration check
    }
    
    console.log('\n✅ Voice sample ready for audiobook regeneration!');
  } catch (error) {
    console.error('❌ Failed to download voice sample:', error);
    process.exit(1);
  }
}

main();
