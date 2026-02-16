import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * InvictusMoment — Full-screen celebration animation
 * 
 * Triggered when a user first achieves all 15 axes above 70.
 * The poem appears line by line, then the golden crown, then the radar chart.
 * This should give the user chills. It's a graduation, not a game achievement.
 */

interface InvictusMomentProps {
  onComplete: () => void;
}

export function InvictusMoment({ onComplete }: InvictusMomentProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(0);
  // Phase 0: black screen
  // Phase 1-4: poem lines
  // Phase 5: final two lines in gold
  // Phase 6: crown + achievement text
  // Phase 7: particles + dismiss

  useEffect(() => {
    const timings = [1000, 3500, 6000, 8500, 11000, 14000, 17000];
    const timers = timings.map((t, i) =>
      setTimeout(() => setPhase(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const poemLines = [
    "Out of the night that covers me,",
    "Black as the pit from pole to pole,",
    "I thank whatever gods may be",
    "For my unconquerable soul.",
  ];

  const finalLines = [
    "I am the master of my fate,",
    "I am the captain of my soul.",
  ];

  // Simple confetti particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 4 + Math.random() * 8,
    color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#01D98D' : '#FFA500',
  }));

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      {/* Subtle radial glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 5 ? 0.3 : 0 }}
        transition={{ duration: 3 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,215,0,0.15) 0%, transparent 60%)',
        }}
      />

      {/* Confetti particles */}
      {phase >= 7 && particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          className="absolute top-0 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: 0,
          }}
        />
      ))}

      <div className="max-w-lg mx-auto px-8 text-center space-y-6 relative z-10">
        {/* Poem lines 1-4 */}
        <AnimatePresence>
          {phase >= 1 && phase < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              {poemLines.map((line, i) => (
                phase >= i + 1 && (
                  <motion.p
                    key={`poem-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-white/80 text-lg md:text-xl italic font-light leading-relaxed"
                  >
                    {line}
                  </motion.p>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final two lines in gold */}
        {phase >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="space-y-3"
          >
            {finalLines.map((line, i) => (
              <motion.p
                key={`final-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: i * 0.8, ease: "easeOut" }}
                className="text-[#FFD700] text-2xl md:text-3xl font-bold leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* Crown + Achievement text */}
        {phase >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="space-y-4 mt-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              👑
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="text-[#FFD700] text-xl font-semibold"
            >
              {t({ en: "You have reached your Invictus Moment.", pt: "Você alcançou seu Momento Invictus.", es: "Has alcanzado tu Momento Invictus." })}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-white/60 text-sm"
            >
              {t({ en: "All 15 axes of your free will are operating above 70%.", pt: "Todos os 15 eixos do seu livre arbítrio estão operando acima de 70%.", es: "Los 15 ejes de tu libre albedrío están operando por encima del 70%." })}
            </motion.p>
          </motion.div>
        )}

        {/* Dismiss button */}
        {phase >= 7 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            onClick={onComplete}
            className="mt-8 px-8 py-3 bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] rounded-full hover:bg-[#FFD700]/30 transition-colors font-medium"
          >
            {t({ en: "Continue Your Journey", pt: "Continue Sua Jornada", es: "Continúa Tu Viaje" })}
          </motion.button>
        )}
      </div>
    </div>
  );
}
