import { db } from '../server/db.ts';
import { emotionalAxes, users } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

console.log('Fixing Emotional Axes...\n');

// Step 1: Get the owner user ID
const owner = await db.select().from(users).limit(1);
if (!owner.length) {
  console.error('No users found in database!');
  process.exit(1);
}
const ownerId = owner[0].id;
console.log(`Owner ID: ${ownerId}\n`);

// Step 2: Delete all existing axes
console.log('Deleting all existing emotional axes...');
await db.delete(emotionalAxes);
console.log('✓ Deleted\n');

// Step 3: Create the 5 correct bipolar axes
console.log('Creating 5 distinct bipolar axes...\n');

const correctAxes = [
  {
    userId: ownerId,
    leftLabel: 'Anxiety',
    rightLabel: 'Calm',
    contextTag: 'work',
    description: 'Measures your emotional state from anxious to calm',
    displayOrder: 1,
    color: '#10b981', // green
    isActive: true,
  },
  {
    userId: ownerId,
    leftLabel: 'Sad',
    rightLabel: 'Happy',
    contextTag: 'general',
    description: 'Measures your mood from sad to happy',
    displayOrder: 2,
    color: '#f59e0b', // amber
    isActive: true,
  },
  {
    userId: ownerId,
    leftLabel: 'Tired',
    rightLabel: 'Energized',
    contextTag: 'physical',
    description: 'Measures your energy level from tired to energized',
    displayOrder: 3,
    color: '#3b82f6', // blue
    isActive: true,
  },
  {
    userId: ownerId,
    leftLabel: 'Confused',
    rightLabel: 'Clear',
    contextTag: 'mental',
    description: 'Measures mental clarity from confused to clear',
    displayOrder: 4,
    color: '#8b5cf6', // purple
    isActive: true,
  },
  {
    userId: ownerId,
    leftLabel: 'Reactive',
    rightLabel: 'Intentional',
    contextTag: 'decision',
    description: 'Measures conscious choice from reactive to intentional',
    displayOrder: 5,
    color: '#ec4899', // pink
    isActive: true,
  },
];

for (const axis of correctAxes) {
  await db.insert(emotionalAxes).values(axis);
  console.log(`✓ Created: ${axis.leftLabel} ↔ ${axis.rightLabel}`);
}

console.log('\n✅ Successfully created 5 distinct emotional axes!');

// Verify
const allAxes = await db.select().from(emotionalAxes);
console.log(`\nTotal axes in database: ${allAxes.length}`);

process.exit(0);
