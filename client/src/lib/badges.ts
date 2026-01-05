/**
 * Achievement Badges System
 * 
 * Defines all badge types, unlock conditions, and display metadata.
 * Badges are unlocked automatically when conditions are met.
 */

export type BadgeType =
  | "first_calibration"
  | "streak_7"
  | "streak_30"
  | "streak_100"
  | "first_module"
  | "modules_5"
  | "modules_all"
  | "calibrations_100"
  | "calibrations_500"
  | "calibrations_1000"
  | "first_cycle"
  | "cycles_30"
  | "cycles_100"
  | "first_insight"
  | "insights_50"
  | "first_connection"
  | "connections_10"
  | "first_challenge"
  | "challenges_5";

export interface BadgeDefinition {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "calibration" | "streak" | "learning" | "social" | "insight";
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  // Calibration Badges
  first_calibration: {
    type: "first_calibration",
    name: "First Steps",
    description: "Completed your first emotional calibration",
    icon: "🎯",
    rarity: "common",
    category: "calibration",
  },
  calibrations_100: {
    type: "calibrations_100",
    name: "Centurion",
    description: "Completed 100 emotional calibrations",
    icon: "💯",
    rarity: "rare",
    category: "calibration",
  },
  calibrations_500: {
    type: "calibrations_500",
    name: "Master Calibrator",
    description: "Completed 500 emotional calibrations",
    icon: "⚡",
    rarity: "epic",
    category: "calibration",
  },
  calibrations_1000: {
    type: "calibrations_1000",
    name: "Emotional Architect",
    description: "Completed 1000 emotional calibrations",
    icon: "👑",
    rarity: "legendary",
    category: "calibration",
  },

  // Streak Badges
  streak_7: {
    type: "streak_7",
    name: "Week Warrior",
    description: "Maintained a 7-day practice streak",
    icon: "🔥",
    rarity: "common",
    category: "streak",
  },
  streak_30: {
    type: "streak_30",
    name: "Month Master",
    description: "Maintained a 30-day practice streak",
    icon: "🌟",
    rarity: "rare",
    category: "streak",
  },
  streak_100: {
    type: "streak_100",
    name: "Unstoppable",
    description: "Maintained a 100-day practice streak",
    icon: "💎",
    rarity: "legendary",
    category: "streak",
  },

  // Daily Cycle Badges
  first_cycle: {
    type: "first_cycle",
    name: "Will Awakened",
    description: "Completed your first full daily cycle",
    icon: "☀️",
    rarity: "common",
    category: "calibration",
  },
  cycles_30: {
    type: "cycles_30",
    name: "Cycle Veteran",
    description: "Completed 30 full daily cycles",
    icon: "🌙",
    rarity: "rare",
    category: "calibration",
  },
  cycles_100: {
    type: "cycles_100",
    name: "Will Forged",
    description: "Completed 100 full daily cycles",
    icon: "⚔️",
    rarity: "epic",
    category: "calibration",
  },

  // Learning Badges
  first_module: {
    type: "first_module",
    name: "Student",
    description: "Completed your first learning module",
    icon: "📚",
    rarity: "common",
    category: "learning",
  },
  modules_5: {
    type: "modules_5",
    name: "Scholar",
    description: "Completed 5 learning modules",
    icon: "🎓",
    rarity: "rare",
    category: "learning",
  },
  modules_all: {
    type: "modules_all",
    name: "Philosopher King",
    description: "Completed all 14 learning modules",
    icon: "🏛️",
    rarity: "legendary",
    category: "learning",
  },

  // Insight Badges
  first_insight: {
    type: "first_insight",
    name: "Pattern Seeker",
    description: "Received your first AI insight",
    icon: "💡",
    rarity: "common",
    category: "insight",
  },
  insights_50: {
    type: "insights_50",
    name: "Wisdom Collector",
    description: "Collected 50 AI insights",
    icon: "🧠",
    rarity: "rare",
    category: "insight",
  },

  // Social Badges
  first_connection: {
    type: "first_connection",
    name: "Connected",
    description: "Made your first Inner Circle connection",
    icon: "🤝",
    rarity: "common",
    category: "social",
  },
  connections_10: {
    type: "connections_10",
    name: "Circle Builder",
    description: "Connected with 10 people in your Inner Circle",
    icon: "👥",
    rarity: "rare",
    category: "social",
  },
  first_challenge: {
    type: "first_challenge",
    name: "Challenger",
    description: "Joined your first group challenge",
    icon: "🎯",
    rarity: "common",
    category: "social",
  },
  challenges_5: {
    type: "challenges_5",
    name: "Challenge Champion",
    description: "Completed 5 group challenges",
    icon: "🏆",
    rarity: "rare",
    category: "social",
  },
};

/**
 * Get badge definition by type
 */
export function getBadgeDefinition(type: BadgeType): BadgeDefinition {
  return BADGE_DEFINITIONS[type];
}

/**
 * Get all badges in a category
 */
export function getBadgesByCategory(category: BadgeDefinition["category"]): BadgeDefinition[] {
  return Object.values(BADGE_DEFINITIONS).filter((badge) => badge.category === category);
}

/**
 * Get badge rarity color
 */
export function getBadgeRarityColor(rarity: BadgeDefinition["rarity"]): string {
  switch (rarity) {
    case "common":
      return "text-gray-500";
    case "rare":
      return "text-blue-500";
    case "epic":
      return "text-purple-500";
    case "legendary":
      return "text-yellow-500";
  }
}

/**
 * Check if user should unlock a badge based on stats
 */
export interface UserStats {
  totalCalibrations: number;
  currentStreak: number;
  totalCycles: number;
  completedModules: number;
  totalInsights: number;
  totalConnections: number;
  completedChallenges: number;
}

export function checkBadgeUnlocks(stats: UserStats, unlockedBadges: BadgeType[]): BadgeType[] {
  const toUnlock: BadgeType[] = [];

  // Calibration badges
  if (stats.totalCalibrations >= 1 && !unlockedBadges.includes("first_calibration")) {
    toUnlock.push("first_calibration");
  }
  if (stats.totalCalibrations >= 100 && !unlockedBadges.includes("calibrations_100")) {
    toUnlock.push("calibrations_100");
  }
  if (stats.totalCalibrations >= 500 && !unlockedBadges.includes("calibrations_500")) {
    toUnlock.push("calibrations_500");
  }
  if (stats.totalCalibrations >= 1000 && !unlockedBadges.includes("calibrations_1000")) {
    toUnlock.push("calibrations_1000");
  }

  // Streak badges
  if (stats.currentStreak >= 7 && !unlockedBadges.includes("streak_7")) {
    toUnlock.push("streak_7");
  }
  if (stats.currentStreak >= 30 && !unlockedBadges.includes("streak_30")) {
    toUnlock.push("streak_30");
  }
  if (stats.currentStreak >= 100 && !unlockedBadges.includes("streak_100")) {
    toUnlock.push("streak_100");
  }

  // Cycle badges
  if (stats.totalCycles >= 1 && !unlockedBadges.includes("first_cycle")) {
    toUnlock.push("first_cycle");
  }
  if (stats.totalCycles >= 30 && !unlockedBadges.includes("cycles_30")) {
    toUnlock.push("cycles_30");
  }
  if (stats.totalCycles >= 100 && !unlockedBadges.includes("cycles_100")) {
    toUnlock.push("cycles_100");
  }

  // Module badges
  if (stats.completedModules >= 1 && !unlockedBadges.includes("first_module")) {
    toUnlock.push("first_module");
  }
  if (stats.completedModules >= 5 && !unlockedBadges.includes("modules_5")) {
    toUnlock.push("modules_5");
  }
  if (stats.completedModules >= 14 && !unlockedBadges.includes("modules_all")) {
    toUnlock.push("modules_all");
  }

  // Insight badges
  if (stats.totalInsights >= 1 && !unlockedBadges.includes("first_insight")) {
    toUnlock.push("first_insight");
  }
  if (stats.totalInsights >= 50 && !unlockedBadges.includes("insights_50")) {
    toUnlock.push("insights_50");
  }

  // Social badges
  if (stats.totalConnections >= 1 && !unlockedBadges.includes("first_connection")) {
    toUnlock.push("first_connection");
  }
  if (stats.totalConnections >= 10 && !unlockedBadges.includes("connections_10")) {
    toUnlock.push("connections_10");
  }
  if (stats.completedChallenges >= 1 && !unlockedBadges.includes("first_challenge")) {
    toUnlock.push("first_challenge");
  }
  if (stats.completedChallenges >= 5 && !unlockedBadges.includes("challenges_5")) {
    toUnlock.push("challenges_5");
  }

  return toUnlock;
}
