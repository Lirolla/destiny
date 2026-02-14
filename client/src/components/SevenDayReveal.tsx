import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PROLOGUE_PARAGRAPHS } from "../../../shared/prologue";

const STORAGE_KEY = "seven_day_reveal_shown";

interface SevenDayRevealProps {
  onClose: () => void;
}

/**
 * SevenDayReveal — full-screen overlay shown ONCE when a user completes
 * their 7th consecutive daily cycle. Presents the closing prologue paragraphs
 * with staged, cinematic fade-in animations.
 */
export function SevenDayReveal({ onClose }: SevenDayRevealProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: "One week ago, you began." — visible immediately
    // Stage 1: "Seven mornings..." — after 3s
    // Stage 2: Prologue paragraph 7 — after 6s
    // Stage 3: Prologue paragraph 8 — after 8.5s
    // Stage 4: Prologue paragraph 9 (final) — after 11s
    // Stage 5: Button — after 14s
    const timers = [
      setTimeout(() => setStage(1), 3000),
      setTimeout(() => setStage(2), 6000),
      setTimeout(() => setStage(3), 8500),
      setTimeout(() => setStage(4), 11000),
      setTimeout(() => setStage(5), 14000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    onClose();
  }, [onClose]);

  // The final three paragraphs of the prologue (indices 6, 7, 8)
  const prologueParagraph7 = PROLOGUE_PARAGRAPHS[6];
  const prologueParagraph8 = PROLOGUE_PARAGRAPHS[7];
  const prologueParagraph9 = PROLOGUE_PARAGRAPHS[8];

  // Split the final sentence from the last paragraph
  const finalSentence = "All that remains is for you to decide.";
  const lastParaWithoutFinal = prologueParagraph9.replace(finalSentence, "");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 px-6 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-2xl w-full py-16 space-y-8">
          {/* Stage 0: Opening line */}
          <motion.p
            className="text-xl md:text-2xl text-white text-center font-light italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            "One week ago, you began."
          </motion.p>

          {/* Stage 1: Seven mornings */}
          {stage >= 1 && (
            <motion.p
              className="text-lg md:text-xl text-white text-center font-light italic leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              "Seven mornings. Seven calibrations. Seven conscious choices to
              show up and exercise your will."
            </motion.p>
          )}

          {/* Divider */}
          {stage >= 2 && (
            <motion.div
              className="flex justify-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-px w-16 bg-white/20" />
            </motion.div>
          )}

          {/* Stage 2: Prologue paragraph 7 */}
          {stage >= 2 && (
            <motion.p
              className="text-base md:text-lg text-white/80 italic leading-relaxed text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              "{prologueParagraph7}"
            </motion.p>
          )}

          {/* Stage 3: Prologue paragraph 8 */}
          {stage >= 3 && (
            <motion.p
              className="text-base md:text-lg text-white/80 italic leading-relaxed text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              "{prologueParagraph8}"
            </motion.p>
          )}

          {/* Stage 4: Prologue paragraph 9 with highlighted final sentence */}
          {stage >= 4 && (
            <motion.p
              className="text-base md:text-lg text-white/80 italic leading-relaxed text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              "{lastParaWithoutFinal}
              <span className="text-[#01D98D] text-xl md:text-2xl font-semibold not-italic">
                {finalSentence}
              </span>
              "
            </motion.p>
          )}

          {/* Stage 5: Continue button */}
          {stage >= 5 && (
            <motion.div
              className="flex flex-col items-center gap-8 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-black font-semibold text-lg px-8 py-6"
              >
                Continue the Journey
              </Button>

              {/* Invictus quote at the bottom */}
              <p className="text-xs text-white/20 italic text-center max-w-md">
                "I am the master of my fate, I am the captain of my soul."
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Helper to check if the SevenDayReveal should be shown.
 * Returns true if streak >= 7 and the reveal hasn't been shown yet.
 */
export function shouldShowSevenDayReveal(streak: number): boolean {
  if (streak < 7) return false;
  return !localStorage.getItem(STORAGE_KEY);
}
