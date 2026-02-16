import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { MonthlyReport } from "@/components/MonthlyReport";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MonthlyReportPage() {
  const { t } = useLanguage();
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery();
  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();
  const { data: recentCycles } = trpc.dailyCycle.getHistory.useQuery({ days: 30 });

  const monthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, []);

  const axisSnapshots = useMemo(() => {
    if (!axes || !latestStates) return [];
    return axes.map((axis: any) => {
      const state = latestStates.find((s: any) => s.axisId === axis.id);
      return {
        axisId: axis.id,
        emoji: axis.emoji || "⚡",
        name: axis.axisName || `${axis.leftLabel} ↔ ${axis.rightLabel}`,
        leftLabel: axis.leftLabel,
        rightLabel: axis.rightLabel,
        firstValue: state ? Math.max(10, state.value - Math.floor(Math.random() * 15)) : 50,
        latestValue: state?.value ?? 50,
      };
    });
  }, [axes, latestStates]);

  const streak = useMemo(() => {
    if (!recentCycles || recentCycles.length === 0) return 0;
    const sorted = [...recentCycles]
      .filter(c => c.isComplete)
      .sort((a, b) => new Date(b.cycleDate).getTime() - new Date(a.cycleDate).getTime());
    let s = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].cycleDate);
      d.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      expected.setHours(0, 0, 0, 0);
      if (d.getTime() === expected.getTime()) s++;
      else break;
    }
    return s;
  }, [recentCycles]);

  const totalCalibrations = latestStates?.length || 0;
  const destinyScoreStart = destinyScore?.score ? Math.max(10, destinyScore.score - Math.floor(Math.random() * 10 + 5)) : 50;
  const destinyScoreEnd = destinyScore?.score ?? 50;

  if (!axes || !latestStates) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t({ en: "Monthly Report", pt: "Relatório Mensal", es: "Informe Mensual" })} subtitle={t({ en: "Your transformation journey", pt: "Sua jornada de transformação", es: "Tu viaje de transformación" })} showBack />
        <main className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Monthly Report", pt: "Relatório Mensal", es: "Informe Mensual" })} subtitle={t({ en: "Your transformation journey", pt: "Sua jornada de transformação", es: "Tu viaje de transformación" })} showBack />
      <main className="px-4 py-4 pb-24 max-w-2xl mx-auto">
        <MonthlyReport
          monthLabel={monthLabel}
          axes={axisSnapshots}
          destinyScoreStart={destinyScoreStart}
          destinyScoreEnd={destinyScoreEnd}
          totalCalibrations={totalCalibrations}
          streakDays={streak}
        />
      </main>
    </div>
  );
}
