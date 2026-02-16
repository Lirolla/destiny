import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * ChapterBridge — A moment of intention before diving into chapter content
 * 
 * Shown when a user taps a chapter link from a red-zone axis warning.
 * Creates emotional weight connecting the slider score to the book content.
 */

interface ChapterBridgeProps {
  emoji: string;
  axisName: string;
  leftLabel: string;
  rightLabel: string;
  chapterRef: string;
  chapterNumber: number;
  bridgeQuote: string;
  onListen: () => void;
  onRead: () => void;
  onDismiss: () => void;
}

export function ChapterBridge({
  emoji,
  axisName,
  leftLabel,
  rightLabel,
  chapterRef,
  chapterNumber,
  bridgeQuote,
  onListen,
  onRead,
  onDismiss,
}: ChapterBridgeProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji + Axis Name */}
        <div className="space-y-2">
          <span className="text-5xl">{emoji}</span>
          <h2 className="text-white text-xl font-bold">
            {axisName}: {leftLabel} → {rightLabel}
          </h2>
        </div>

        {/* Bridge Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/70 text-base italic leading-relaxed px-4"
        >
          "{bridgeQuote}"
        </motion.p>

        {/* Chapter reference */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[#01D98D] text-sm font-medium"
        >
          {t({ en: `${chapterRef} was written for exactly this moment.`, pt: `${chapterRef} foi escrito exatamente para este momento.`, es: `${chapterRef} fue escrito exactamente para este momento.` })}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex gap-4 justify-center pt-4"
        >
          <Button
            onClick={onListen}
            className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-[#0A0A0A] font-semibold gap-2"
          >
            <Headphones className="h-4 w-4" />
            {t({ en: "Listen Now", pt: "Ouvir Agora", es: "Escuchar Ahora" })}
          </Button>
          <Button
            onClick={onRead}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {t({ en: "Read Instead", pt: "Ler em Vez Disso", es: "Leer en su Lugar" })}
          </Button>
        </motion.div>

        {/* Invictus footer */}
        <p className="text-white/20 text-xs italic pt-6">
          {t({ en: '"I am the master of my fate, I am the captain of my soul."', pt: '"I am the master of my fate, I am the captain of my soul."', es: '"I am the master of my fate, I am the captain of my soul."' })}
        </p>
      </motion.div>
    </motion.div>
  );
}

