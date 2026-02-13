import { db } from '../server/db.ts';
import { emotionalAxes, users } from '../drizzle/schema.ts';

console.log('Seeding 15 Axes of Free Will...\n');

// Get owner user
const allUsers = await db.select().from(users).limit(1);
if (!allUsers.length) {
  console.error('No users found!');
  process.exit(1);
}
const ownerId = allUsers[0].id;
console.log(`Owner ID: ${ownerId}\n`);

// Delete all existing axes
console.log('Deleting existing axes...');
await db.delete(emotionalAxes);
console.log('✓ Deleted\n');

const axes = [
  {
    axisNumber: 0,
    axisName: "The Will Axis",
    leftLabel: "Powerless",
    rightLabel: "Powerful",
    subtitle: "Is your will broken or alive?",
    emoji: "🔋",
    colorLow: "#8B0000",
    colorHigh: "#FFD700",
    description: "This is the master axis. It measures your overall sense of personal power — whether you feel like life is happening to you or through you. It reflects the core question of the book: is your will functioning, or has it stalled?",
    reflectionPrompt: "Right now, do I feel like the engine of my life is running, or has it stalled?",
    chapterRef: "Introduction: The Day I Lost My Will",
    contextTag: "core",
  },
  {
    axisNumber: 1,
    axisName: "The Ownership Axis",
    leftLabel: "Blame",
    rightLabel: "Ownership",
    subtitle: "Are you hiding in the bushes or standing in the open?",
    emoji: "🪞",
    colorLow: "#696969",
    colorHigh: "#228B22",
    description: "Inspired by God's question to Adam — \"Where are you?\" — this axis measures whether you are taking ownership of your choices or hiding behind blame, denial, and excuses. Free will is both a gift and a responsibility.",
    reflectionPrompt: "Am I owning my choices today, or am I blaming someone or something else?",
    chapterRef: "Chapter 1: The Divine Gift: The Awesome Power and Terrifying Responsibility of Free Will",
    contextTag: "responsibility",
  },
  {
    axisNumber: 2,
    axisName: "The Sowing Axis",
    leftLabel: "Reckless Sowing",
    rightLabel: "Intentional Sowing",
    subtitle: "What seeds are you planting today?",
    emoji: "🌱",
    colorLow: "#8B4513",
    colorHigh: "#32CD32",
    description: "Based on the Law of Sowing and Reaping — the fundamental operating system of life. Your reality is a direct harvest of the seeds you plant through your thoughts, actions, and emotions. This axis measures whether you are planting consciously or scattering seeds recklessly.",
    reflectionPrompt: "If my life in 5 years is a harvest of what I planted today, what am I growing?",
    chapterRef: "Chapter 2: The Unbreakable Law of Your Reality",
    contextTag: "action",
  },
  {
    axisNumber: 3,
    axisName: "The Meaning Axis",
    leftLabel: "Bitterness",
    rightLabel: "Meaning-Making",
    subtitle: "Are you being consumed by unfairness, or transforming it?",
    emoji: "⚗️",
    colorLow: "#4B0082",
    colorHigh: "#FF8C00",
    description: "Life is not fair. Bad things happen to good people. The question is not whether unfairness will visit you — it will — but whether you will let it poison you with bitterness or use it as raw material for meaning.",
    reflectionPrompt: "Am I letting my pain define me, or am I using it to refine me?",
    chapterRef: "Chapter 3: The Unfair Advantage: How to Find Meaning in a World of Unfairness",
    contextTag: "meaning",
  },
  {
    axisNumber: 4,
    axisName: "The Agency Axis",
    leftLabel: "Victimhood",
    rightLabel: "Agency",
    subtitle: "Are you defined by what was done to you, or by what you do next?",
    emoji: "⚖️",
    colorLow: "#2F4F4F",
    colorHigh: "#00CED1",
    description: "Abuse and victimisation are real. The wounds inflicted by others are not your fault. But remaining permanently identified as a victim is a choice that surrenders the very free will that can set you free. This axis measures whether you are stuck in victim identity or reclaiming your agency.",
    reflectionPrompt: "Am I giving someone from my past power over my present?",
    chapterRef: "Chapter 4: The Gravity of Choice: Navigating the Roles of Abuser and Victim",
    contextTag: "healing",
  },
  {
    axisNumber: 5,
    axisName: "The Decisiveness Axis",
    leftLabel: "Indecision",
    rightLabel: "Decisive Action",
    subtitle: "Are you standing at the crossroads, or walking a path?",
    emoji: "⚔️",
    colorLow: "#A9A9A9",
    colorHigh: "#DC143C",
    description: "Indecision is not caution — it is a silent killer of destiny. Every moment you refuse to choose, you are choosing by default. The cost of indecision is not just missed opportunities; it is the slow erosion of your confidence, your identity, and your sense of agency.",
    reflectionPrompt: "What decision am I avoiding right now, and what is it costing me?",
    chapterRef: "Chapter 5: The Crossroads of Choice: The Terrible Cost of Indecision",
    contextTag: "decision",
  },
  {
    axisNumber: 6,
    axisName: "The Phoenix Axis",
    leftLabel: "Trapped in Cycles",
    rightLabel: "Phoenix Rising",
    subtitle: "Are you repeating the cycle, or breaking it?",
    emoji: "🔥",
    colorLow: "#3C3C3C",
    colorHigh: "#FF4500",
    description: "Generational pain, trauma cycles, repeated patterns of self-destruction — these are the chains that bind free will across lifetimes. The Phoenix Moment is when you choose to be the person where the cycle ends. Not by denying your past, but by refusing to transmit it.",
    reflectionPrompt: "What pattern am I repeating that I have the power to end?",
    chapterRef: "Chapter 6: The Phoenix Moment: Rising from the Ashes of Your Past",
    contextTag: "transformation",
  },
  {
    axisNumber: 7,
    axisName: "The Stoic Axis",
    leftLabel: "Reactive",
    rightLabel: "Stoic Composure",
    subtitle: "Are you controlled by events, or by your principles?",
    emoji: "🏛️",
    colorLow: "#B22222",
    colorHigh: "#4682B4",
    description: "Marcus Aurelius ruled the most powerful empire on earth while practising the daily discipline of distinguishing between what he could and could not control. The Stoic path is not about suppressing emotion — it is about choosing your response rather than being hijacked by your reactions.",
    reflectionPrompt: "Today, was my inner state determined by me or by what happened to me?",
    chapterRef: "Chapter 7: Marcus Aurelius and the Stoic Path to Free Will",
    contextTag: "emotional",
  },
  {
    axisNumber: 8,
    axisName: "The Responsibility Axis",
    leftLabel: "Avoidance",
    rightLabel: "Radical Responsibility",
    subtitle: "Are you running from the weight, or carrying it with purpose?",
    emoji: "🎯",
    colorLow: "#808080",
    colorHigh: "#006400",
    description: "Responsibility is not blame. Blame looks backward and assigns fault. Responsibility looks forward and claims power. When you take radical responsibility, you stop asking \"whose fault is this?\" and start asking \"what am I going to do about it?\"",
    reflectionPrompt: "What am I avoiding right now that I know I need to face?",
    chapterRef: "Chapter 8: The Weight of Your Will: The Radical Power of Taking Responsibility",
    contextTag: "responsibility",
  },
  {
    axisNumber: 9,
    axisName: "The Alchemy Axis",
    leftLabel: "Suffering",
    rightLabel: "Strength",
    subtitle: "Is your suffering crushing you, or forging you?",
    emoji: "💎",
    colorLow: "#191970",
    colorHigh: "#FFD700",
    description: "Suffering is universal and unavoidable. But what you do with it is a choice. The alchemists sought to turn lead into gold. The Destiny Hacker turns suffering into strength, wisdom, and compassion. This axis measures whether your current suffering is destroying you or being transmuted into something valuable.",
    reflectionPrompt: "Is my suffering making me bitter or making me better?",
    chapterRef: "Chapter 9: The Alchemy of Will: Turning Suffering into Strength",
    contextTag: "resilience",
  },
  {
    axisNumber: 10,
    axisName: "The Flow Axis",
    leftLabel: "Fatalism",
    rightLabel: "Co-Creation",
    subtitle: "Are you drowning in fate, or surfing the wave?",
    emoji: "🏄",
    colorLow: "#2F4F4F",
    colorHigh: "#00BFFF",
    description: "You are not the ocean — you cannot control the waves. But you are not a piece of driftwood either. You are a surfer. Your free will operates in a dance with forces larger than yourself. This axis measures whether you are passively drowning or actively riding the wave.",
    reflectionPrompt: "Am I drowning, drifting, or surfing right now?",
    chapterRef: "Chapter 10: The Surfer and the Wave: The Dance of Free Will and Universal Balance",
    contextTag: "flow",
  },
  {
    axisNumber: 11,
    axisName: "The Faith Axis",
    leftLabel: "Spiritual Dependency",
    rightLabel: "Empowered Faith",
    subtitle: "Are you waiting for rescue, or partnering with the divine?",
    emoji: "🙏",
    colorLow: "#D2691E",
    colorHigh: "#9370DB",
    description: "This axis challenges the belief that God will fix everything if you just pray hard enough. True faith is not spiritual passivity. Prayer is not a substitute for action. This axis measures whether your spirituality empowers your free will or replaces it.",
    reflectionPrompt: "Am I praying for rescue, or praying for strength to act?",
    chapterRef: "Chapter 11: The Paradox of Prayer: Does Asking for Help Weaken Your Will?",
    contextTag: "spiritual",
  },
  {
    axisNumber: 12,
    axisName: "The Tribe Axis",
    leftLabel: "Isolation",
    rightLabel: "Tribe",
    subtitle: "Are you trying to do this alone?",
    emoji: "🤝",
    colorLow: "#556B2F",
    colorHigh: "#FF6347",
    description: "The myth of the lone genius — the self-made man, the solo hero — is one of the most dangerous lies in modern culture. You cannot hack your destiny alone. Your free will is amplified by your tribe: the people who challenge you, support you, hold you accountable, and believe in you.",
    reflectionPrompt: "Who is in my tribe, and am I actually letting them in?",
    chapterRef: "Chapter 12: The Myth of the Lone Genius: Why Your Will Needs a Tribe",
    contextTag: "social",
  },
  {
    axisNumber: 13,
    axisName: "The Architect Axis",
    leftLabel: "Drifting",
    rightLabel: "Architect of Destiny",
    subtitle: "Are you drifting through life, or building your cathedral?",
    emoji: "🏗️",
    colorLow: "#A0522D",
    colorHigh: "#1E90FF",
    description: "An architect does not hope a building appears — they draw the blueprint, choose the materials, and build it brick by brick. Your life is your cathedral. Every choice is a brick. Every habit is a load-bearing wall. This axis measures whether you have a blueprint for your life and are building intentionally.",
    reflectionPrompt: "What am I building with today's choices?",
    chapterRef: "Chapter 13: The Architect of Destiny: How Your Choices Build Your Cathedral",
    contextTag: "purpose",
  },
  {
    axisNumber: 14,
    axisName: "The Invictus Axis",
    leftLabel: "Passive Endurance",
    rightLabel: "Captain of My Soul",
    subtitle: "I am the master of my fate, I am the captain of my soul.",
    emoji: "👑",
    colorLow: "#000000",
    colorHigh: "#FFD700",
    description: "This is the culmination of the entire book. The Invictus Moment is when you claim your unconquerable soul — the realisation that no matter how dire the circumstances, there is one freedom that can never be taken from you: the freedom to choose your response.",
    reflectionPrompt: "Right now, in this moment — am I enduring my life or authoring it?",
    chapterRef: "Chapter 14: Your Invictus Moment: The Captain of Your Soul",
    contextTag: "mastery",
  },
];

console.log('Seeding 15 axes...\n');

for (const axis of axes) {
  await db.insert(emotionalAxes).values({
    userId: ownerId,
    axisNumber: axis.axisNumber,
    axisName: axis.axisName,
    leftLabel: axis.leftLabel,
    rightLabel: axis.rightLabel,
    subtitle: axis.subtitle,
    contextTag: axis.contextTag,
    emoji: axis.emoji,
    colorLow: axis.colorLow,
    colorHigh: axis.colorHigh,
    color: axis.colorHigh,
    description: axis.description,
    reflectionPrompt: axis.reflectionPrompt,
    chapterRef: axis.chapterRef,
    displayOrder: axis.axisNumber,
    isActive: true,
  });
  console.log(`✓ Axis ${axis.axisNumber}: ${axis.emoji} ${axis.axisName} (${axis.leftLabel} ↔ ${axis.rightLabel})`);
}

console.log('\n✅ All 15 axes seeded successfully!');

// Verify
const allAxes = await db.select().from(emotionalAxes);
console.log(`Total axes in database: ${allAxes.length}`);

process.exit(0);
