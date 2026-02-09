import { db } from '../server/db';
import { bookChapters } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const chapter = await db.select().from(bookChapters).where(eq(bookChapters.chapterNumber, 14)).limit(1);
  
  if (chapter.length === 0) {
    console.log('Chapter 14 not found');
    process.exit(1);
  }
  
  console.log('Chapter 14 Info:');
  console.log('Title:', chapter[0].title);
  console.log('Audio URL PT:', chapter[0].audioUrlPt);
  console.log('Duration:', chapter[0].duration, 'seconds');
  console.log('Text length:', chapter[0].text.length, 'characters');
  console.log('\nFirst 200 chars of text:');
  console.log(chapter[0].text.substring(0, 200));
}

main().catch(console.error);
