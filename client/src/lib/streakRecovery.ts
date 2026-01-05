/**
 * Streak Recovery Utility
 * 
 * Handles grace period logic for missed daily cycles.
 * Users can complete yesterday's cycle within 24 hours to maintain streak.
 */

export interface GracePeriodStatus {
  available: boolean;
  expiresAt?: Date;
  hoursRemaining?: number;
}

/**
 * Calculate if grace period is available for a missed cycle
 */
export function calculateGracePeriod(missedDate: string): GracePeriodStatus {
  const missed = new Date(missedDate + 'T00:00:00');
  const now = new Date();
  
  // Grace period: 24 hours from the END of the missed day
  const gracePeriodEnd = new Date(missed);
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 2); // Next day at midnight
  
  const available = now < gracePeriodEnd;
  
  if (!available) {
    return { available: false };
  }
  
  const msRemaining = gracePeriodEnd.getTime() - now.getTime();
  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  
  return {
    available: true,
    expiresAt: gracePeriodEnd,
    hoursRemaining,
  };
}

/**
 * Format grace period expiry time
 */
export function formatGracePeriodExpiry(expiresAt: Date): string {
  const now = new Date();
  const msRemaining = expiresAt.getTime() - now.getTime();
  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hoursRemaining > 0) {
    return `${hoursRemaining}h ${minutesRemaining}m`;
  }
  
  return `${minutesRemaining}m`;
}

/**
 * Get yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

/**
 * Check if a date string is yesterday
 */
export function isYesterday(dateString: string): boolean {
  return dateString === getYesterdayDate();
}

/**
 * Calculate current streak accounting for grace period
 */
export function calculateStreakWithGracePeriod(
  cycles: Array<{ cycleDate: string; isComplete: boolean; completedViaGracePeriod?: boolean }>
): number {
  if (cycles.length === 0) return 0;
  
  // Sort by date descending (most recent first)
  const sorted = [...cycles].sort((a, b) => b.cycleDate.localeCompare(a.cycleDate));
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = getYesterdayDate();
  
  for (let i = 0; i < sorted.length; i++) {
    const cycle = sorted[i];
    
    // Only count completed cycles
    if (!cycle.isComplete) {
      // If this is today or yesterday and incomplete, check grace period
      if (cycle.cycleDate === today || cycle.cycleDate === yesterday) {
        const gracePeriod = calculateGracePeriod(cycle.cycleDate);
        if (!gracePeriod.available) {
          break; // Streak broken
        }
        // Grace period still available, continue checking
        continue;
      }
      break; // Streak broken
    }
    
    // Check if this cycle is consecutive
    if (i === 0) {
      // First cycle should be today or yesterday
      if (cycle.cycleDate !== today && cycle.cycleDate !== yesterday) {
        break;
      }
    } else {
      // Check if consecutive with previous
      const prevCycle = sorted[i - 1];
      const prevDate = new Date(prevCycle.cycleDate);
      const currDate = new Date(cycle.cycleDate);
      const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff !== 1) {
        break; // Not consecutive
      }
    }
    
    streak++;
  }
  
  return streak;
}
