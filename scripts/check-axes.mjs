import { db } from '../server/db.ts';
import { emotionalAxes } from '../drizzle/schema.ts';

const axes = await db.select().from(emotionalAxes);
console.log('Current Emotional Axes:');
console.log('======================');
axes.forEach(axis => {
  console.log(`ID: ${axis.id}`);
  console.log(`Name: ${axis.name}`);
  console.log(`${axis.negativeLabel} ↔ ${axis.positiveLabel}`);
  console.log(`Description: ${axis.description}`);
  console.log('---');
});
console.log(`\nTotal axes: ${axes.length}`);
process.exit(0);
