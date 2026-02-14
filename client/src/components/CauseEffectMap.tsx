import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface CauseEffectEntry {
  action: string;
  effect: string;
  axisImpact?: string;
  direction?: "up" | "down" | "neutral";
}

interface CauseEffectMapProps {
  /** Daily cycles from the review period */
  cycles: Array<{
    cycleDate: string;
    intendedAction?: string | null;
    actionTaken?: string | null;
    observedEffect?: string | null;
    morningCompletedAt?: Date | string | null;
    eveningCompletedAt?: Date | string | null;
    isComplete?: boolean;
  }>;
  /** Optional: AI-generated pattern connections */
  patterns?: string;
}

/**
 * CauseEffectMap — visual representation of action → effect chains
 * from daily cycles. Renders as a vertical timeline with connected nodes.
 */
export function CauseEffectMap({ cycles, patterns }: CauseEffectMapProps) {
  const { t } = useLanguage();

  const entries: CauseEffectEntry[] = useMemo(() => {
    return cycles
      .filter(c => c.actionTaken && c.observedEffect)
      .sort((a, b) => new Date(a.cycleDate).getTime() - new Date(b.cycleDate).getTime())
      .map(c => ({
        action: c.actionTaken!,
        effect: c.observedEffect!,
        direction: "neutral" as const,
      }));
  }, [cycles]);

  if (entries.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground text-sm">
          {t(
            "Complete daily cycles with actions and observed effects to see your cause-effect map.",
            "Complete ciclos diários com ações e efeitos observados para ver seu mapa de causa-efeito."
          )}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-[#01D98D]/20 flex items-center justify-center">
          <span className="text-xs">🔗</span>
        </div>
        <h4 className="font-bold text-base">
          {t("Cause → Effect Map", "Mapa Causa → Efeito")}
        </h4>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

        {entries.map((entry, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            {/* Node dot */}
            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 border-[#01D98D] bg-background z-10" />

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Action (cause) */}
              <div className="bg-muted/40 rounded-lg p-3 border-l-2 border-blue-500/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/80 mb-1">
                  {t("Action", "Ação")}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{entry.action}</p>
              </div>

              {/* Arrow on desktop */}
              <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                <span className="text-muted-foreground text-lg">→</span>
              </div>

              {/* Effect */}
              <div className="bg-[#01D98D]/5 rounded-lg p-3 border-l-2 border-[#01D98D]/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#01D98D]/80 mb-1">
                  {t("Observed Effect", "Efeito Observado")}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{entry.effect}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Pattern Analysis */}
      {patterns && (
        <Card className="p-4 mt-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">🧠</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 mb-1">
                {t("AI Pattern Analysis", "Análise de Padrões IA")}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {patterns}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500/50" />
          <span>{t("Action (Cause)", "Ação (Causa)")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-[#01D98D]/50" />
          <span>{t("Effect (Ripple)", "Efeito (Onda)")}</span>
        </div>
      </div>
    </div>
  );
}
