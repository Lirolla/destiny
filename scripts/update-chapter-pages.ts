import { db } from "../server/db.js";
import { bookChapters } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

/**
 * Update book chapters with PDF page mappings
 * Based on extracted page numbers from the 87-page PDF
 */

const chapterPageMappings = [
  { chapterNumber: 1, pdfStartPage: 2, pdfEndPage: 4 },
  { chapterNumber: 2, pdfStartPage: 5, pdfEndPage: 11 },
  { chapterNumber: 3, pdfStartPage: 12, pdfEndPage: 11 }, // Note: Chapter 3 text appears on page 12
  { chapterNumber: 4, pdfStartPage: 12, pdfEndPage: 15 },
  { chapterNumber: 5, pdfStartPage: 16, pdfEndPage: 18 },
  { chapterNumber: 6, pdfStartPage: 19, pdfEndPage: 22 },
  { chapterNumber: 7, pdfStartPage: 23, pdfEndPage: 25 },
  { chapterNumber: 8, pdfStartPage: 26, pdfEndPage: 28 },
  { chapterNumber: 9, pdfStartPage: 29, pdfEndPage: 32 },
  { chapterNumber: 10, pdfStartPage: 33, pdfEndPage: 35 },
  { chapterNumber: 11, pdfStartPage: 36, pdfEndPage: 38 },
  { chapterNumber: 12, pdfStartPage: 39, pdfEndPage: 41 },
  { chapterNumber: 13, pdfStartPage: 42, pdfEndPage: 44 },
  { chapterNumber: 14, pdfStartPage: 45, pdfEndPage: 87 }, // Final chapter goes to end of book
];

async function updateChapterPages() {
  console.log("Updating chapter PDF page mappings...\n");
  
  for (const mapping of chapterPageMappings) {
    try {
      await db
        .update(bookChapters)
        .set({
          pdfStartPage: mapping.pdfStartPage,
          pdfEndPage: mapping.pdfEndPage,
        })
        .where(eq(bookChapters.chapterNumber, mapping.chapterNumber));
      
      console.log(`✓ Chapter ${mapping.chapterNumber}: Pages ${mapping.pdfStartPage}-${mapping.pdfEndPage}`);
    } catch (error) {
      console.error(`✗ Failed to update Chapter ${mapping.chapterNumber}:`, error);
    }
  }
  
  console.log("\n✅ All chapter page mappings updated!");
}

updateChapterPages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
