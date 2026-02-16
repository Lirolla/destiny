import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * FirstImpression — "The Day I Lost My Will"
 * 
 * Shown once to first-time users before any tutorial or slider.
 * Sets the emotional tone for the entire app experience.
 * Dark background. Slow fade-in. No chrome. Just the words.
 */

interface FirstImpressionProps {
  onBegin: () => void;
}

export function FirstImpression({ onBegin }: FirstImpressionProps) {
  const { t } = useLanguage();
  const [visibleParagraph, setVisibleParagraph] = useState(-1);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Paragraph 1 appears after 1s
    const t1 = setTimeout(() => setVisibleParagraph(0), 1000);
    // Paragraph 2 appears after 5s
    const t2 = setTimeout(() => setVisibleParagraph(1), 5000);
    // Paragraph 3 (Marco's words) appears after 9s
    const t3 = setTimeout(() => setVisibleParagraph(2), 9000);
    // "Begin" button appears after 12s
    const t4 = setTimeout(() => setShowButton(true), 12000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const paragraphs = [
    t({ en: `"It was a Tuesday. I remember that because I had a client meeting at 9 a.m. that I was about to miss. I was sitting on the edge of my bed, fully dressed in a suit and tie, but I couldn't move. It wasn't a physical paralysis. It was something deeper, more terrifying. It was a paralysis of the will."`, pt: `"Era uma terça-feira. Lembro-me disso porque tinha uma reunião com um cliente às 9h que estava prestes a perder. Estava sentado na beira da minha cama, totalmente vestido de terno e gravata, mas não conseguia me mover. Não era uma paralisia física. Era algo mais profundo, mais aterrorizante. Era uma paralisia da vontade."`, es: `"Era un martes. Lo recuerdo porque tenía una reunión con un cliente a las 9 a.m. a la que estaba a punto de faltar. Estaba sentado al borde de mi cama, completamente vestido con traje y corbata, pero no podía moverme. No era una parálisis física. Era algo más profundo, más aterrador. Era una parálisis de la voluntad."` }),
    t({ en: `This app was born from that moment. It exists because I believe the most powerful gift you have — your free will — deserves a user's manual.`, pt: `Este aplicativo nasceu daquele momento. Ele existe porque acredito que o presente mais poderoso que você tem — seu livre arbítrio — merece um manual do usuário.`, es: `Esta aplicación nació de ese momento. Existe porque creo que el regalo más poderoso que tienes — tu libre albedrío — merece un manual de usuario.` }),
    t({ en: `— Marco, Creator of Destiny Hacking`, pt: `— Marco, Criador do Destiny Hacking`, es: `— Marco, Creador de Destiny Hacking` }),
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-8 text-center space-y-8">
        <AnimatePresence>
          {visibleParagraph >= 0 && (
            <motion.p
              key="p1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-white/90 text-lg md:text-xl leading-relaxed italic font-light"
            >
              {paragraphs[0]}
            </motion.p>
          )}

          {visibleParagraph >= 1 && (
            <motion.p
              key="p2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-white/80 text-base md:text-lg leading-relaxed"
            >
              {paragraphs[1]}
            </motion.p>
          )}

          {visibleParagraph >= 2 && (
            <motion.p
              key="p3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[#01D98D] text-sm md:text-base font-medium"
            >
              {paragraphs[2]}
            </motion.p>
          )}

          {showButton && (
            <motion.div
              key="btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Button
                onClick={onBegin}
                size="lg"
                className="mt-8 bg-[#01D98D] hover:bg-[#01D98D]/90 text-[#0A0A0A] font-semibold text-lg px-12 py-6 rounded-full"
              >
                {t({ en: "Begin.", pt: "Começar.", es: "Empezar." })}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invictus quote at the bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: visibleParagraph >= 2 ? 0.3 : 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-white/30 text-xs mt-16 italic"
        >
          "I am the master of my fate, I am the captain of my soul."
        </motion.p>
      </div>
    </div>
  );
}
