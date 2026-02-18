/**
 * ChapterIcon — Unique visual identity for each chapter
 * Minimalist line art icons that match the printed book.
 * Inline SVGs for zero network overhead.
 */

import React from "react";

const GREEN = "#01D98D";
const DARK = "#1A1A1A";

interface ChapterIconProps {
  chapter: number;
  size?: number;
  colored?: boolean;
  className?: string;
}

export function ChapterIcon({ chapter, size = 40, colored = true, className = "" }: ChapterIconProps) {
  const accent = colored ? GREEN : DARK;
  const s = size;
  
  const icons: Record<number, React.ReactElement> = {
    // Prologue: Open book with radiating light
    0: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="55" r="35" fill={accent} opacity="0.08" stroke="none"/>
          <path d="M100 135 L100 55" stroke={DARK} strokeWidth="2.5"/>
          <path d="M100 55 C100 46, 60 38, 30 46 L30 126 C60 118, 100 126, 100 135" stroke={DARK} strokeWidth="3" fill="white" fillOpacity="0.5"/>
          <path d="M100 55 C100 46, 140 38, 170 46 L170 126 C140 118, 100 126, 100 135" stroke={DARK} strokeWidth="3" fill="white" fillOpacity="0.5"/>
          <line x1="100" y1="45" x2="100" y2="18" stroke={accent} strokeWidth="3"/>
          <line x1="78" y1="38" x2="62" y2="15" stroke={accent} strokeWidth="2.5"/>
          <line x1="122" y1="38" x2="138" y2="15" stroke={accent} strokeWidth="2.5"/>
          <line x1="58" y1="46" x2="40" y2="28" stroke={accent} strokeWidth="2"/>
          <line x1="142" y1="46" x2="160" y2="28" stroke={accent} strokeWidth="2"/>
          <circle cx="100" cy="12" r="3" fill={accent} stroke="none"/>
          <circle cx="60" cy="10" r="2" fill={accent} stroke="none" opacity="0.6"/>
          <circle cx="140" cy="10" r="2" fill={accent} stroke="none" opacity="0.6"/>
        </g>
      </svg>
    ),

    // Ch1: The Divine Gift — Hand with glowing orb
    1: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="98" cy="38" r="30" fill={accent} opacity="0.1" stroke="none"/>
          <path d="M62 128 C54 108, 46 90, 49 72 C52 60, 62 55, 70 64 L74 80" stroke={DARK} strokeWidth="3"/>
          <path d="M74 80 L78 60 C80 50, 88 47, 92 56 L90 80" stroke={DARK} strokeWidth="3"/>
          <path d="M90 80 L94 55 C96 45, 104 44, 108 54 L104 80" stroke={DARK} strokeWidth="3"/>
          <path d="M104 80 L108 62 C110 52, 118 52, 120 62 L116 84" stroke={DARK} strokeWidth="3"/>
          <path d="M116 84 C126 78, 132 82, 128 94 L120 112 C116 124, 100 132, 88 130 L62 128" stroke={DARK} strokeWidth="3"/>
          <circle cx="98" cy="34" r="18" stroke={accent} strokeWidth="3" fill={accent} fillOpacity="0.12"/>
          <circle cx="98" cy="34" r="10" fill={accent} opacity="0.25" stroke="none"/>
          <circle cx="98" cy="34" r="5" fill={accent} opacity="0.5" stroke="none"/>
          <line x1="98" y1="10" x2="98" y2="4" stroke={accent} strokeWidth="2.5"/>
          <line x1="114" y1="18" x2="120" y2="12" stroke={accent} strokeWidth="2.5"/>
          <line x1="82" y1="18" x2="76" y2="12" stroke={accent} strokeWidth="2.5"/>
        </g>
      </svg>
    ),

    // Ch2: The Unbreakable Law — Infinity loop
    2: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M100 85 C100 55, 145 35, 165 60 C185 85, 145 115, 100 85 C100 55, 55 35, 35 60 C15 85, 55 115, 100 85" stroke={accent} strokeWidth="12" opacity="0.08"/>
          <path d="M100 85 C100 55, 145 35, 165 60 C185 85, 145 115, 100 85 C100 55, 55 35, 35 60 C15 85, 55 115, 100 85" stroke={DARK} strokeWidth="3.5"/>
          <polygon points="140,48 152,52 146,60" fill={accent} stroke={accent} strokeWidth="2"/>
          <polygon points="60,122 48,118 54,110" fill={accent} stroke={accent} strokeWidth="2" opacity="0.6"/>
          <circle cx="100" cy="85" r="6" fill={accent} stroke="none"/>
          <circle cx="100" cy="85" r="10" fill={accent} opacity="0.15" stroke="none"/>
        </g>
      </svg>
    ),

    // Ch3: The Unfair Advantage — Diamond
    3: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="100,25 55,65 100,150 145,65" fill={accent} opacity="0.06" stroke="none"/>
          <polygon points="100,25 55,65 100,150 145,65" stroke={DARK} strokeWidth="3.5"/>
          <line x1="55" y1="65" x2="145" y2="65" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="25" x2="78" y2="65" stroke={DARK} strokeWidth="2.5"/>
          <line x1="100" y1="25" x2="122" y2="65" stroke={DARK} strokeWidth="2.5"/>
          <line x1="78" y1="65" x2="100" y2="150" stroke={DARK} strokeWidth="2" opacity="0.5"/>
          <line x1="122" y1="65" x2="100" y2="150" stroke={DARK} strokeWidth="2" opacity="0.5"/>
          <line x1="152" y1="30" x2="152" y2="18" stroke={accent} strokeWidth="2.5"/>
          <line x1="146" y1="24" x2="158" y2="24" stroke={accent} strokeWidth="2.5"/>
          <line x1="162" y1="48" x2="162" y2="40" stroke={accent} strokeWidth="2"/>
          <line x1="158" y1="44" x2="166" y2="44" stroke={accent} strokeWidth="2"/>
        </g>
      </svg>
    ),

    // Ch4: The Gravity of Choice — Scales
    4: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="100" y1="30" x2="100" y2="148" stroke={DARK} strokeWidth="3"/>
          <path d="M72 148 L128 148" stroke={DARK} strokeWidth="3.5"/>
          <polygon points="92,30 108,30 100,44" fill={DARK} stroke={DARK} strokeWidth="2"/>
          <line x1="30" y1="68" x2="170" y2="58" stroke={DARK} strokeWidth="3.5"/>
          <line x1="18" y1="72" x2="42" y2="72" stroke={DARK} strokeWidth="2"/>
          <path d="M14 72 Q30 98, 46 72" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="30" cy="82" r="6" fill={accent} stroke="none" opacity="0.4"/>
          <circle cx="30" cy="82" r="3" fill={accent} stroke="none"/>
          <line x1="158" y1="62" x2="182" y2="62" stroke={DARK} strokeWidth="2"/>
          <path d="M154 62 Q170 88, 186 62" stroke={DARK} strokeWidth="2.5"/>
        </g>
      </svg>
    ),

    // Ch5: The Crossroads — Forking paths
    5: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M100 170 L100 85" stroke={DARK} strokeWidth="3.5"/>
          <circle cx="100" cy="85" r="10" fill={accent} opacity="0.15" stroke="none"/>
          <circle cx="100" cy="85" r="7" fill={accent} stroke={accent} strokeWidth="2.5"/>
          <path d="M100 85 C85 68, 55 55, 28 28" stroke={DARK} strokeWidth="3" opacity="0.4"/>
          <path d="M100 85 C115 68, 145 55, 172 28" stroke={accent} strokeWidth="4"/>
          <polygon points="172,28 160,36 164,24" fill={accent} stroke="none"/>
          <path d="M100 85 C115 68, 145 55, 172 28" stroke={accent} strokeWidth="10" opacity="0.08"/>
          <line x1="100" y1="100" x2="100" y2="118" stroke={DARK} strokeWidth="3"/>
          <rect x="85" y="98" width="30" height="5" rx="1" fill={DARK} stroke="none" opacity="0.6"/>
        </g>
      </svg>
    ),

    // Ch6: The Phoenix Moment — Rising from flames
    6: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M55 148 C60 128, 68 132, 63 115 C68 125, 76 120, 70 105" stroke={accent} strokeWidth="2.5" opacity="0.5"/>
          <path d="M85 152 C90 125, 98 130, 95 108 C100 122, 108 115, 105 95" stroke={accent} strokeWidth="3"/>
          <path d="M120 150 C125 128, 133 132, 128 115 C133 125, 140 120, 136 105" stroke={accent} strokeWidth="2.5" opacity="0.5"/>
          <path d="M100 92 C92 72, 80 62, 55 42" stroke={DARK} strokeWidth="3.5"/>
          <path d="M100 92 C108 72, 120 62, 145 42" stroke={DARK} strokeWidth="3.5"/>
          <path d="M55 42 C48 35, 42 28, 35 18" stroke={DARK} strokeWidth="3"/>
          <path d="M145 42 C152 35, 158 28, 165 18" stroke={DARK} strokeWidth="3"/>
          <circle cx="100" cy="38" r="10" stroke={DARK} strokeWidth="3"/>
          <circle cx="100" cy="36" r="3.5" fill={accent} stroke="none"/>
          <path d="M96 28 L92 18" stroke={accent} strokeWidth="2.5"/>
          <path d="M100 28 L100 16" stroke={accent} strokeWidth="2.5"/>
          <path d="M104 28 L108 18" stroke={accent} strokeWidth="2.5"/>
          <circle cx="92" cy="16" r="2" fill={accent} stroke="none"/>
          <circle cx="100" cy="14" r="2" fill={accent} stroke="none"/>
          <circle cx="108" cy="16" r="2" fill={accent} stroke="none"/>
        </g>
      </svg>
    ),

    // Ch7: Marcus Aurelius — Laurel wreath + column
    7: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M88 140 C62 120, 40 92, 35 62 C32 42, 40 25, 58 16" stroke={DARK} strokeWidth="2.5"/>
          <path d="M48 92 C42 86, 38 78, 42 70" stroke={accent} strokeWidth="2.5"/>
          <path d="M42 72 C36 66, 34 58, 38 50" stroke={accent} strokeWidth="2.5"/>
          <path d="M40 52 C34 46, 34 38, 40 30" stroke={accent} strokeWidth="2.5"/>
          <path d="M112 140 C138 120, 160 92, 165 62 C168 42, 160 25, 142 16" stroke={DARK} strokeWidth="2.5"/>
          <path d="M152 92 C158 86, 162 78, 158 70" stroke={accent} strokeWidth="2.5"/>
          <path d="M158 72 C164 66, 166 58, 162 50" stroke={accent} strokeWidth="2.5"/>
          <path d="M160 52 C166 46, 166 38, 160 30" stroke={accent} strokeWidth="2.5"/>
          <rect x="88" y="55" width="24" height="60" rx="2" stroke={DARK} strokeWidth="3"/>
          <rect x="82" y="48" width="36" height="10" rx="2" stroke={DARK} strokeWidth="2.5"/>
          <rect x="82" y="115" width="36" height="10" rx="2" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="100" cy="20" r="6" fill={accent} stroke={accent} strokeWidth="2"/>
          <circle cx="100" cy="20" r="3" fill="white" stroke="none"/>
        </g>
      </svg>
    ),

    // Ch8: The Weight of Your Will — Atlas
    8: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="108" r="6" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="114" x2="100" y2="148" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="148" x2="82" y2="172" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="148" x2="118" y2="172" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="120" x2="75" y2="96" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="120" x2="125" y2="96" stroke={DARK} strokeWidth="3"/>
          <circle cx="100" cy="58" r="38" stroke={DARK} strokeWidth="3.5"/>
          <ellipse cx="100" cy="58" rx="38" ry="14" stroke={DARK} strokeWidth="1.5" opacity="0.3"/>
          <path d="M100 20 C88 35, 88 81, 100 96" stroke={DARK} strokeWidth="1.5" opacity="0.3"/>
          <path d="M100 20 C112 35, 112 81, 100 96" stroke={DARK} strokeWidth="1.5" opacity="0.3"/>
          <circle cx="100" cy="58" r="12" fill={accent} opacity="0.12" stroke="none"/>
          <circle cx="100" cy="58" r="6" fill={accent} opacity="0.3" stroke="none"/>
          <circle cx="100" cy="58" r="3" fill={accent} stroke="none"/>
        </g>
      </svg>
    ),

    // Ch9: The Alchemy of Will — Crucible + butterfly
    9: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M58 72 L48 140 C48 155, 152 155, 152 140 L142 72" stroke={DARK} strokeWidth="3.5"/>
          <path d="M58 72 C58 64, 142 64, 142 72" stroke={DARK} strokeWidth="3"/>
          <path d="M56 100 C75 92, 125 92, 144 100" stroke={accent} strokeWidth="2.5"/>
          <path d="M52 100 C75 90, 125 90, 148 100 L152 140 C152 155, 48 155, 48 140 Z" fill={accent} opacity="0.08" stroke="none"/>
          <path d="M85 58 C72 42, 62 25, 72 14 C80 6, 90 14, 92 28" stroke={accent} strokeWidth="3"/>
          <path d="M115 58 C128 42, 138 25, 128 14 C120 6, 110 14, 108 28" stroke={accent} strokeWidth="3"/>
          <line x1="100" y1="60" x2="100" y2="18" stroke={accent} strokeWidth="2"/>
          <path d="M85 58 C72 42, 62 25, 72 14 C80 6, 90 14, 92 28 L100 40 Z" fill={accent} opacity="0.1" stroke="none"/>
          <path d="M115 58 C128 42, 138 25, 128 14 C120 6, 110 14, 108 28 L100 40 Z" fill={accent} opacity="0.1" stroke="none"/>
          <circle cx="90" cy="7" r="2" fill={accent} stroke="none"/>
          <circle cx="110" cy="7" r="2" fill={accent} stroke="none"/>
        </g>
      </svg>
    ),

    // Ch10: The Surfer and the Wave
    10: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 100 C20 90, 45 45, 80 38 C105 32, 118 48, 128 65 C138 82, 155 92, 195 98" stroke={DARK} strokeWidth="4"/>
          <path d="M80 38 C88 30, 98 32, 96 45" stroke={DARK} strokeWidth="3"/>
          <circle cx="120" cy="60" r="6" stroke={DARK} strokeWidth="2.5"/>
          <line x1="120" y1="66" x2="120" y2="88" stroke={DARK} strokeWidth="2.5"/>
          <line x1="120" y1="74" x2="108" y2="66" stroke={DARK} strokeWidth="2.5"/>
          <line x1="120" y1="74" x2="132" y2="66" stroke={DARK} strokeWidth="2.5"/>
          <path d="M104 98 L138 94" stroke={accent} strokeWidth="4"/>
          <path d="M102 98 C100 97, 100 95, 104 94" stroke={accent} strokeWidth="2.5"/>
          <path d="M138 94 C142 93, 142 95, 140 96" stroke={accent} strokeWidth="2.5"/>
          <path d="M15 128 C30 122, 50 125, 70 122 C90 119, 110 122, 130 119 C150 116, 170 119, 190 116" stroke={DARK} strokeWidth="1.5" opacity="0.2"/>
        </g>
      </svg>
    ),

    // Ch11: The Paradox of Prayer — Hands + question
    11: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="100" cy="105" rx="40" ry="50" fill={accent} opacity="0.05" stroke="none"/>
          <path d="M88 148 C80 118, 76 100, 80 82 C82 72, 88 64, 94 60" stroke={DARK} strokeWidth="3"/>
          <path d="M112 148 C120 118, 124 100, 120 82 C118 72, 112 64, 106 60" stroke={DARK} strokeWidth="3"/>
          <path d="M94 60 L100 46 L106 60" stroke={DARK} strokeWidth="3"/>
          <line x1="82" y1="80" x2="118" y2="80" stroke={DARK} strokeWidth="1" opacity="0.2"/>
          <line x1="80" y1="90" x2="120" y2="90" stroke={DARK} strokeWidth="1" opacity="0.2"/>
          <path d="M88 32 C88 18, 112 18, 112 28 C112 36, 100 38, 100 46" stroke={accent} strokeWidth="3.5"/>
          <circle cx="100" cy="52" r="3" fill={accent} stroke="none"/>
          <circle cx="72" cy="24" r="2.5" fill={accent} stroke="none" opacity="0.4"/>
          <circle cx="128" cy="24" r="2.5" fill={accent} stroke="none" opacity="0.4"/>
        </g>
      </svg>
    ),

    // Ch12: The Myth of the Lone Genius — Network
    12: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="100" y1="45" x2="52" y2="90" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <line x1="100" y1="45" x2="148" y2="90" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <line x1="100" y1="45" x2="100" y2="120" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <line x1="52" y1="90" x2="100" y2="120" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <line x1="148" y1="90" x2="100" y2="120" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <line x1="52" y1="90" x2="148" y2="90" stroke={accent} strokeWidth="2" opacity="0.4"/>
          <circle cx="100" cy="45" r="16" fill="white" stroke={accent} strokeWidth="3"/>
          <circle cx="100" cy="41" r="6" stroke={DARK} strokeWidth="2.5"/>
          <path d="M90 50 C90 46, 110 46, 110 50" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="52" cy="90" r="12" fill="white" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="148" cy="90" r="12" fill="white" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="100" cy="120" r="12" fill="white" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="25" cy="135" r="8" fill="white" stroke={DARK} strokeWidth="2"/>
          <circle cx="175" cy="135" r="8" fill="white" stroke={DARK} strokeWidth="2"/>
        </g>
      </svg>
    ),

    // Ch13: The Architect of Destiny — Compass
    13: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="88" r="52" stroke={DARK} strokeWidth="3.5"/>
          <circle cx="100" cy="88" r="46" stroke={DARK} strokeWidth="1.2" opacity="0.25"/>
          <line x1="100" y1="36" x2="100" y2="28" stroke={DARK} strokeWidth="2.5"/>
          <line x1="100" y1="140" x2="100" y2="148" stroke={DARK} strokeWidth="2"/>
          <line x1="48" y1="88" x2="40" y2="88" stroke={DARK} strokeWidth="2"/>
          <line x1="152" y1="88" x2="160" y2="88" stroke={DARK} strokeWidth="2"/>
          <polygon points="100,36 93,88 100,94 107,88" fill={accent} stroke={accent} strokeWidth="1.5"/>
          <polygon points="100,140 93,88 100,82 107,88" fill={DARK} opacity="0.2" stroke={DARK} strokeWidth="1"/>
          <circle cx="100" cy="88" r="5" fill={DARK} stroke="none"/>
          <circle cx="100" cy="88" r="3" fill="white" stroke="none"/>
        </g>
      </svg>
    ),

    // Ch14: Your Invictus Moment — Ship's helm
    14: (
      <svg viewBox="0 0 200 200" width={s} height={s} className={className}>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="88" r="52" stroke={DARK} strokeWidth="3.5"/>
          <circle cx="100" cy="88" r="20" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="68" x2="100" y2="36" stroke={DARK} strokeWidth="3"/>
          <line x1="100" y1="108" x2="100" y2="140" stroke={DARK} strokeWidth="3"/>
          <line x1="80" y1="88" x2="48" y2="88" stroke={DARK} strokeWidth="3"/>
          <line x1="120" y1="88" x2="152" y2="88" stroke={DARK} strokeWidth="3"/>
          <line x1="86" y1="74" x2="63" y2="51" stroke={DARK} strokeWidth="2.5"/>
          <line x1="114" y1="102" x2="137" y2="125" stroke={DARK} strokeWidth="2.5"/>
          <line x1="114" y1="74" x2="137" y2="51" stroke={DARK} strokeWidth="2.5"/>
          <line x1="86" y1="102" x2="63" y2="125" stroke={DARK} strokeWidth="2.5"/>
          <circle cx="100" cy="30" r="6" fill={accent} stroke={DARK} strokeWidth="2"/>
          <circle cx="100" cy="146" r="6" fill={accent} stroke={DARK} strokeWidth="2"/>
          <circle cx="42" cy="88" r="6" fill={accent} stroke={DARK} strokeWidth="2"/>
          <circle cx="158" cy="88" r="6" fill={accent} stroke={DARK} strokeWidth="2"/>
          <circle cx="59" cy="47" r="5" fill={accent} stroke={DARK} strokeWidth="1.8" opacity="0.7"/>
          <circle cx="141" cy="129" r="5" fill={accent} stroke={DARK} strokeWidth="1.8" opacity="0.7"/>
          <circle cx="141" cy="47" r="5" fill={accent} stroke={DARK} strokeWidth="1.8" opacity="0.7"/>
          <circle cx="59" cy="129" r="5" fill={accent} stroke={DARK} strokeWidth="1.8" opacity="0.7"/>
          <circle cx="100" cy="88" r="7" fill={accent} stroke={DARK} strokeWidth="2"/>
          <circle cx="100" cy="88" r="3" fill="white" stroke="none"/>
        </g>
      </svg>
    ),
  };

  return icons[chapter] || icons[0];
}
