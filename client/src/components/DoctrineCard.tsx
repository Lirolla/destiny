import { useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { DOCTRINE_CARDS } from "../../../shared/prologue";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * DoctrineCard — displays one philosophical principle from the prologue per week.
 * Rotates weekly using the week number of the year modulo 8.
 */
export function DoctrineCard() {
  const { t, language } = useLanguage();

  const currentDoctrine = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekOfYear = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return DOCTRINE_CARDS[weekOfYear % DOCTRINE_CARDS.length];
  }, []);

  return (
    <Card className="relative overflow-hidden border-[#01D98D]/20 bg-gradient-to-br from-[#01D98D]/5 via-transparent to-transparent">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#01D98D]/60" />

      <CardContent className="py-3 pl-5 pr-4">
        <div className="flex items-start gap-2.5">
          <span className="text-xl mt-0.5 shrink-0">{currentDoctrine.emoji}</span>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#01D98D]/80">
              {t({ en: "Doctrine of the Week", pt: "Doutrina da Semana", es: "Doctrina de la Semana" })}
            </p>
            <p className="text-sm italic text-foreground/90 leading-snug line-clamp-2">
              "{language === 'pt' ? currentDoctrine.doctrinePt : currentDoctrine.doctrine}"
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground truncate">
                — {language === 'pt' ? currentDoctrine.sourcePt : currentDoctrine.source}
              </p>
              <Link
                href="/philosophy"
                className="text-[10px] text-[#01D98D] hover:text-[#01D98D]/80 transition-colors whitespace-nowrap ml-2"
              >
                {t({ en: "Read Philosophy →", pt: "Ler Filosofia →", es: "Leer Filosofía →" })}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
