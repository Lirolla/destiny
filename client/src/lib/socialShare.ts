/**
 * Social Sharing Utility
 * 
 * Generates anonymized progress summaries and handles sharing to social platforms.
 * Privacy-first: shares only aggregate stats, never specific emotional content.
 */

export interface ProgressSummary {
  weekStreak: number;
  totalCalibrations: number;
  modulesCompleted: number;
  cyclesCompleted: number;
  topAxis?: string;
  improvement?: string;
}

/**
 * Generate shareable text for progress summary
 */
export function generateShareText(summary: ProgressSummary): string {
  const lines = [
    `🎯 My Destiny Hacking Progress:`,
    ``,
  ];

  if (summary.weekStreak > 0) {
    lines.push(`🔥 ${summary.weekStreak}-day streak`);
  }

  if (summary.totalCalibrations > 0) {
    lines.push(`📊 ${summary.totalCalibrations} emotional calibrations`);
  }

  if (summary.cyclesCompleted > 0) {
    lines.push(`☀️ ${summary.cyclesCompleted} daily cycles completed`);
  }

  if (summary.modulesCompleted > 0) {
    lines.push(`📚 ${summary.modulesCompleted} modules mastered`);
  }

  if (summary.improvement) {
    lines.push(``, `📈 ${summary.improvement}`);
  }

  lines.push(``, `Training my free will with Destiny Hacking 💪`);

  return lines.join('\n');
}

/**
 * Generate shareable URL with encoded summary
 */
export function generateShareUrl(summary: ProgressSummary): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    streak: summary.weekStreak.toString(),
    calibrations: summary.totalCalibrations.toString(),
    modules: summary.modulesCompleted.toString(),
    cycles: summary.cyclesCompleted.toString(),
  });

  return `${baseUrl}/share?${params.toString()}`;
}

/**
 * Share using Web Share API (mobile-friendly)
 */
export async function shareViaWebAPI(summary: ProgressSummary): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: 'My Destiny Hacking Progress',
      text: generateShareText(summary),
      url: generateShareUrl(summary),
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Share to Twitter/X
 */
export function shareToTwitter(summary: ProgressSummary): void {
  const text = encodeURIComponent(generateShareText(summary));
  const url = encodeURIComponent(generateShareUrl(summary));
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(summary: ProgressSummary): void {
  const url = encodeURIComponent(generateShareUrl(summary));
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
}

/**
 * Share to LinkedIn
 */
export function shareToLinkedIn(summary: ProgressSummary): void {
  const url = encodeURIComponent(generateShareUrl(summary));
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
}

/**
 * Copy share text to clipboard
 */
export async function copyShareText(summary: ProgressSummary): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(generateShareText(summary) + '\n\n' + generateShareUrl(summary));
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

/**
 * Generate Open Graph meta tags for shared links
 */
export function generateOGMetaTags(summary: ProgressSummary): Record<string, string> {
  return {
    'og:title': 'My Destiny Hacking Progress',
    'og:description': `${summary.weekStreak}-day streak • ${summary.totalCalibrations} calibrations • ${summary.modulesCompleted} modules completed`,
    'og:type': 'website',
    'og:image': `${window.location.origin}/og-image.png`,
    'twitter:card': 'summary_large_image',
    'twitter:title': 'My Destiny Hacking Progress',
    'twitter:description': `Training my free will with ${summary.weekStreak}-day streak`,
  };
}
