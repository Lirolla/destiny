/**
 * The Prologue — Marco's original philosophical text.
 * Used VERBATIM across the app. Do NOT edit, paraphrase, rewrite, or shorten.
 * Every word was chosen deliberately.
 */

export const PROLOGUE_PARAGRAPHS = [
  `In the grand tapestry of existence, there is a single thread that defines us, empowers us, and binds us to the course of our lives: free will. It is the gift that distinguishes humanity, the force that gives our choices weight and our actions meaning. Yet, this profound power is often misunderstood, overlooked, or even abandoned in the face of life's trials. It is easier to blame circumstances, to wait for salvation, or to surrender to despair than to confront the reality that most of the struggles we face are, at their core, within our control to change.`,

  `This book is not just a philosophical exploration or a spiritual guide; it is a wake-up call. It challenges you to examine your life and recognise the immense power you hold to shape it. Free will is the ability to choose your path, and the universal balance—a system of accountability woven into the fabric of existence—ensures that every choice you make has meaning, rippling through the universe with consequences that reflect its nature.`,

  `Consider this balance not as an external force that punishes or rewards, but as a natural order designed to guide us, to teach us, and to hold us accountable. It is impartial, unwavering, and unyielding. For every act of kindness, there is a ripple of goodwill. For every choice made in selfishness or malice, there is an eventual reckoning. This is not divine retribution, but the inevitable result of living in a connected and interdependent world.`,

  `Too often, people wait for divine intervention to fix their lives, forgetting that the power to act has already been granted. This book is here to remind you that while God observes, He does not micromanage the lives of men and women. Instead, He has bestowed upon us the ultimate gift: the freedom to choose, to act, to grow. Alongside this gift, He created the universal balance—not to punish, but to empower. It is a system of cause and effect, a mirror reflecting the choices we make and urging us to align our actions with virtue and purpose.`,

  `This journey is not just for those who seek to understand life's greater mysteries but also for those who feel trapped by their circumstances. Whether it is the pain of a broken relationship, the weight of past mistakes, or the fear of an uncertain future, this book will guide you to reclaim your life by harnessing the power of free will. You will discover how to break free from cycles of suffering, to embrace responsibility, and to find redemption through intentional action.`,

  `Through the teachings of philosophy, biblical wisdom, and real-life examples, you will learn that every moment holds the potential for transformation. Marcus Aurelius, the Stoic philosopher-emperor, once wrote, "You have power over your mind—not outside events. Realise this, and you will find strength." His words echo across centuries, reminding us that true freedom lies not in controlling the external world, but in mastering our inner selves.`,

  `Yet, this is not a purely philosophical or religious exercise. It is deeply practical. You will explore what it means to align your life with the balance, to take responsibility for your actions, and to create harmony both within yourself and with the world around you. You will confront the difficult truth that the key to your destiny has always been in your hands. The question is: Are you ready to use it?`,

  `As you embark on this journey, take a moment to reflect on the challenges you face. Ask yourself: Am I waiting for change, or am I willing to create it? The answer will shape not just the pages you are about to read, but the life you are about to live. Free will is your tool, and the universal balance is your guide. Together, they offer the promise of a life lived with purpose, harmony, and fulfilment.`,

  `This is your moment. Step forward boldly, and embrace the gift you've been given. The power to change, to grow, and to create a meaningful life is yours. All that remains is for you to decide.`,
] as const;

/**
 * Key phrases to highlight in the prologue text.
 * These should be rendered in the app's primary colour or bold.
 */
export const HIGHLIGHT_PHRASES = [
  "free will",
  "the universal balance",
  "a wake-up call",
  "while God observes, He does not micromanage the lives of men and women",
  "the freedom to choose, to act, to grow",
  "You have power over your mind—not outside events. Realise this, and you will find strength.",
  "the key to your destiny has always been in your hands",
  "Am I waiting for change, or am I willing to create it?",
  "This is your moment.",
] as const;

/**
 * The Marcus Aurelius quote from paragraph 6, displayed as a blockquote.
 */
export const MARCUS_AURELIUS_QUOTE =
  "You have power over your mind—not outside events. Realise this, and you will find strength.";

/**
 * Doctrine Cards — one per paragraph, each distilled to its core sentence.
 * Rotated weekly on the Dashboard.
 */
export const DOCTRINE_CARDS = [
  {
    week: 0,
    doctrine: "Most of the struggles we face are, at their core, within our control to change.",
    source: "Prologue, Paragraph 1",
    emoji: "🧵",
  },
  {
    week: 1,
    doctrine: "Every choice you make has meaning, rippling through the universe with consequences that reflect its nature.",
    source: "Prologue, Paragraph 2 — The Universal Balance",
    emoji: "🌊",
  },
  {
    week: 2,
    doctrine: "For every act of kindness, there is a ripple of goodwill. For every choice made in selfishness or malice, there is an eventual reckoning.",
    source: "Prologue, Paragraph 3 — The Natural Order",
    emoji: "⚖️",
  },
  {
    week: 3,
    doctrine: "While God observes, He does not micromanage the lives of men and women. He has bestowed upon us the ultimate gift: the freedom to choose, to act, to grow.",
    source: "Prologue, Paragraph 4 — The Divine Gift",
    emoji: "✨",
  },
  {
    week: 4,
    doctrine: "Whether it is the pain of a broken relationship, the weight of past mistakes, or the fear of an uncertain future — you will discover how to break free.",
    source: "Prologue, Paragraph 5 — Breaking Free",
    emoji: "🔓",
  },
  {
    week: 5,
    doctrine: "You have power over your mind — not outside events. Realise this, and you will find strength.",
    source: "Marcus Aurelius, quoted in Prologue",
    emoji: "🏛️",
  },
  {
    week: 6,
    doctrine: "The key to your destiny has always been in your hands. The question is: Are you ready to use it?",
    source: "Prologue, Paragraph 7 — The Confrontation",
    emoji: "🔑",
  },
  {
    week: 7,
    doctrine: "Am I waiting for change, or am I willing to create it?",
    source: "Prologue, Paragraph 8 — The Question",
    emoji: "🪞",
  },
] as const;

/**
 * Shareable quotes drawn from the prologue for social sharing.
 */
export const SHARE_QUOTES = [
  "Free will is the gift that distinguishes humanity.",
  "Every choice you make has meaning, rippling through the universe.",
  "The key to your destiny has always been in your hands.",
  "Am I waiting for change, or am I willing to create it?",
  "True freedom lies not in controlling the external world, but in mastering our inner selves.",
  "This is your moment. Step forward boldly.",
  "The power to change, to grow, and to create a meaningful life is yours.",
  "While God observes, He does not micromanage. The freedom to choose is yours.",
] as const;
