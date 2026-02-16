import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Sun, Clock, Moon, CheckCircle2, Sparkles, AlertCircle, Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { calculateGracePeriod, formatGracePeriodExpiry, getYesterdayDate } from "@/lib/streakRecovery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/PageHeader";
import { useAutoAchievementCheck } from "@/hooks/useAchievements";
import { InvictusFooter } from "@/components/InvictusFooter";
import { SevenDayReveal, shouldShowSevenDayReveal } from "@/components/SevenDayReveal";
import { useLanguage } from "@/contexts/LanguageContext";

function interpolateColor(colorLow: string, colorHigh: string, value: number): string {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(colorLow.slice(1, 3)), g1 = hex(colorLow.slice(3, 5)), b1 = hex(colorLow.slice(5, 7));
  const r2 = hex(colorHigh.slice(1, 3)), g2 = hex(colorHigh.slice(3, 5)), b2 = hex(colorHigh.slice(5, 7));
  const t = value / 100;
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
}

function getTimeGreeting(t: (opts: { en: string; pt: string; es: string }) => string): { greeting: string; icon: typeof Sun; period: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: t({ en: "Good Morning, Pilot", pt: "Bom Dia, Piloto", es: "Buenos Días, Piloto" }), icon: Sun, period: "morning" };
  if (hour < 17) return { greeting: t({ en: "Midday Check-In", pt: "Check-In do Meio-Dia", es: "Registro de Mediodía" }), icon: Clock, period: "midday" };
  return { greeting: t({ en: "Evening Reflection", pt: "Reflexão Noturna", es: "Reflexión Nocturna" }), icon: Moon, period: "evening" };
}

export default function DailyCycle() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<"morning" | "midday" | "evening" | "complete">("morning");
  const achievementCheck = useAutoAchievementCheck();

  // Fetch today's cycle
  const { data: todayCycle, isLoading: cycleLoading, refetch: refetchCycle } = trpc.dailyCycle.getToday.useQuery();

  // Fetch yesterday's cycle for grace period
  const yesterdayDate = getYesterdayDate();
  const { data: recentCycles } = trpc.dailyCycle.getHistory.useQuery({ days: 2 });
  const yesterdayCycle = recentCycles?.find(c => c.cycleDate === yesterdayDate);

  // Grace period
  const gracePeriod = yesterdayCycle && !yesterdayCycle.isComplete
    ? calculateGracePeriod(yesterdayDate)
    : { available: false };

  // Fetch axes for morning calibration
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery();
  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();

  // Get 3 lowest axes for midday focus
  const lowest3 = useMemo(() => {
    if (!axes || !latestStates) return [];
    const stateMap = new Map(latestStates.map(s => [s.axisId, s.value]));
    return [...axes]
      .filter(a => stateMap.has(a.id))
      .sort((a, b) => (stateMap.get(a.id) ?? 50) - (stateMap.get(b.id) ?? 50))
      .slice(0, 3);
  }, [axes, latestStates]);

  // Determine current phase
  useEffect(() => {
    if (todayCycle) {
      if (todayCycle.isComplete || todayCycle.eveningCompletedAt) {
        setPhase("complete");
      } else if (todayCycle.middayCompletedAt) {
        setPhase("evening");
      } else if (todayCycle.morningCompletedAt) {
        setPhase("midday");
      } else {
        setPhase("morning");
      }
    }
  }, [todayCycle]);

  // Morning state
  const [morningCalibrations, setMorningCalibrations] = useState<Record<number, number>>({});

  // Midday state - now includes recalibration of lowest 3
  const [intendedAction, setIntendedAction] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [middayCalibrations, setMiddayCalibrations] = useState<Record<number, number>>({});

  // Evening state
  const [actionTaken, setActionTaken] = useState("");
  const [observedEffect, setObservedEffect] = useState("");
  const [reflection, setReflection] = useState("");
  const [eveningCalibrations, setEveningCalibrations] = useState<Record<number, number>>({});

  // Initialize midday calibrations from latest states
  useEffect(() => {
    if (lowest3.length > 0 && latestStates) {
      const initial: Record<number, number> = {};
      lowest3.forEach(axis => {
        const state = latestStates.find(s => s.axisId === axis.id);
        initial[axis.id] = state?.value ?? 50;
      });
      setMiddayCalibrations(initial);
    }
  }, [lowest3, latestStates]);

  // Initialize evening calibrations from latest states
  useEffect(() => {
    if (axes && latestStates) {
      const initial: Record<number, number> = {};
      axes.forEach(axis => {
        const state = latestStates.find(s => s.axisId === axis.id);
        initial[axis.id] = state?.value ?? 50;
      });
      setEveningCalibrations(initial);
    }
  }, [axes, latestStates]);

  // Mutations
  const utils = trpc.useUtils();
  const startMorningMutation = trpc.dailyCycle.startMorning.useMutation({
    onSuccess: () => {
      refetchCycle();
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
      toast.success(t({ en: "Morning calibration complete! ☀️", pt: "Calibração da manhã completa! ☀️", es: "¡Calibración matutina completa! ☀️" }));
      achievementCheck.onSuccess();
      setPhase("midday");
    },
    onError: (error) => toast.error(`${t({ en: "Failed", pt: "Falhou", es: "Falló" })}: ${error.message}`),
  });

  const completeMiddayMutation = trpc.dailyCycle.completeMidday.useMutation({
    onSuccess: () => {
      refetchCycle();
      toast.success(t({ en: "Midday action committed! 🎯", pt: "Ação do meio-dia comprometida! 🎯", es: "¡Acción de mediodía comprometida! 🎯" }));
      setPhase("evening");
    },
    onError: (error) => toast.error(`${t({ en: "Failed", pt: "Falhou", es: "Falló" })}: ${error.message}`),
  });

  const [showSevenDayReveal, setShowSevenDayReveal] = useState(false);

  const completeEveningMutation = trpc.dailyCycle.completeEvening.useMutation({
    onSuccess: () => {
      refetchCycle();
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
      toast.success(t({ en: "Daily cycle complete! 🌙", pt: "Ciclo diário completo! 🌙", es: "¡Ciclo diario completo! 🌙" }));
      achievementCheck.onSuccess();
      // Check if this is the 7th consecutive day for the SevenDayReveal
      const { data: history } = trpc.useUtils().dailyCycle.getHistory.getData({ days: 30 }) as any || {};
      if (history) {
        const completedCycles = [...(Array.isArray(history) ? history : [])]
          .filter((c: any) => c.isComplete)
          .sort((a: any, b: any) => new Date(b.cycleDate).getTime() - new Date(a.cycleDate).getTime());
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < completedCycles.length; i++) {
          const d = new Date(completedCycles[i].cycleDate);
          d.setHours(0, 0, 0, 0);
          const expected = new Date(today);
          expected.setDate(today.getDate() - i);
          if (d.getTime() === expected.getTime()) streak++;
          else break;
        }
        // Include today's just-completed cycle
        if (streak === 0) streak = 1;
        if (shouldShowSevenDayReveal(streak)) {
          setShowSevenDayReveal(true);
          return;
        }
      } else {
        // Fallback: just check localStorage-based simple count
        // The reveal will be checked on next load
      }
      setPhase("complete");
    },
    onError: (error) => toast.error(`${t({ en: "Failed", pt: "Falhou", es: "Falló" })}: ${error.message}`),
  });

  const recordStateMutation = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
    },
  });

  // AI prompt generation
  const { data: promptData, refetch: generatePrompt, isLoading: promptLoading } = trpc.aiCoach.generatePrompt.useQuery(undefined, {
    enabled: false,
  });

  useEffect(() => {
    if (promptData?.prompt) setAiPrompt(promptData.prompt);
  }, [promptData]);

  const handleMorningComplete = () => {
    if (!axes || axes.length === 0) {
      toast.error(t({ en: "Create at least one emotional axis first", pt: "Crie pelo menos um eixo emocional primeiro", es: "Crea al menos un eje emocional primero" }));
      return;
    }
    const calibrations = axes.map(axis => ({
      axisId: axis.id,
      value: morningCalibrations[axis.id] ?? 50,
    }));
    startMorningMutation.mutate({ axisCalibrations: calibrations });
  };

  const handleMiddayComplete = () => {
    if (!intendedAction.trim()) {
      toast.error(t({ en: "Enter your intended action", pt: "Insira sua ação pretendida", es: "Ingresa tu acción prevista" }));
      return;
    }
    // Record midday recalibrations for the 3 lowest axes
    for (const axis of lowest3) {
      const value = middayCalibrations[axis.id];
      if (value !== undefined) {
        recordStateMutation.mutate({
          axisId: axis.id,
          value,
          calibrationType: "midday",
        });
      }
    }
    completeMiddayMutation.mutate({
      decisivePrompt: aiPrompt || undefined,
      intendedAction: intendedAction.trim(),
    });
  };

  const handleEveningComplete = () => {
    if (!actionTaken.trim() || !observedEffect.trim()) {
      toast.error(t({ en: "Complete all required fields", pt: "Preencha todos os campos obrigatórios", es: "Completa todos los campos requeridos" }));
      return;
    }
    // Record evening recalibrations for all axes
    if (axes) {
      for (const axis of axes) {
        const value = eveningCalibrations[axis.id];
        if (value !== undefined) {
          recordStateMutation.mutate({
            axisId: axis.id,
            value,
            calibrationType: "evening",
          });
        }
      }
    }
    completeEveningMutation.mutate({
      actionTaken: actionTaken.trim(),
      observedEffect: observedEffect.trim(),
      reflection: reflection.trim() || undefined,
    });
  };

  const { greeting, icon: GreetingIcon } = getTimeGreeting(t);

  return (
    <div className="min-h-screen bg-background">
      {showSevenDayReveal && (
        <SevenDayReveal onClose={() => { setShowSevenDayReveal(false); setPhase("complete"); }} />
      )}
      <PageHeader title={t({ en: "Daily Will Cycle", pt: "Ciclo Diário de Vontade", es: "Ciclo Diario de Voluntad" })} subtitle={greeting} showBack />

      <main className="px-4 py-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Grace Period Banner */}
          {gracePeriod.available && gracePeriod.expiresAt && (
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-700">{t({ en: "Grace Period Active", pt: "Período de Carência Ativo", es: "Período de Gracia Activo" })}</AlertTitle>
              <AlertDescription className="text-orange-600">
                {t({ en: "You have a grace period to complete yesterday's cycle and maintain your streak.", pt: "Você tem um período de carência para completar o ciclo de ontem e manter sua sequência.", es: "Tienes un período de gracia para completar el ciclo de ayer y mantener tu racha." })}
                <div className="mt-2 flex items-center justify-between">
                  <Button variant="link" className="p-0 h-auto text-orange-700 font-bold" asChild>
                    <Link href={`/cycle/${yesterdayDate}`}>{t({ en: "Complete Yesterday's Cycle", pt: "Completar Ciclo de Ontem", es: "Completar el Ciclo de Ayer" })}</Link>
                  </Button>
                  <span className="text-xs font-medium">{t({ en: "Expires:", pt: "Expira em:", es: "Expira:" })} {formatGracePeriodExpiry(gracePeriod.expiresAt)}</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Destiny Score */}
          {destinyScore?.score !== null && destinyScore?.score !== undefined && (
            <Card className="relative overflow-hidden border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">{t({ en: "Your Destiny Score is", pt: "Sua Pontuação de Destino é", es: "Tu Puntuación de Destino es" })}</CardTitle>
                <CardDescription>
                  {t({ en: "This score reflects your overall alignment with your defined axes. Calibrate daily to increase it.", pt: "Esta pontuação reflete seu alinhamento geral com seus eixos definidos. Calibre diariamente para aumentá-la.", es: "Esta puntuación refleja tu alineación general con tus ejes definidos. Calibra a diario para aumentarla." })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-6xl font-bold text-primary tabular-nums">{destinyScore.score}%</div>
                  <Button asChild>
                    <Link href="/sliders">
                      {t({ en: "View Your Axes", pt: "Ver Seus Eixos", es: "Ver Tus Ejes" })}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================== MORNING PHASE ==================== */}
          {phase === "morning" && (
            <Card className="border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-amber-400" />
                  <CardTitle>{t({ en: "Morning Calibration", pt: "Calibração da Manhã", es: "Calibración Matutina" })}</CardTitle>
                </div>
                <CardDescription>
                  {t({ en: "Calibrate your emotional axes to set your baseline for the day.", pt: "Calibre seus eixos emocionais para definir sua linha de base para o dia.", es: "Calibra tus ejes emocionales para establecer tu línea de base para el día." })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cycleLoading && <p>Loading...</p>}
                {!cycleLoading && !axes?.length && (
                  <div className="text-center text-muted-foreground py-8 space-y-4">
                    <p>{t({ en: "No axes defined yet.", pt: "Nenhum eixo definido ainda.", es: "Aún no has definido ejes." })}</p>
                    <Button asChild>
                      <Link href="/sliders/new">{t({ en: "Create Your First Axis", pt: "Crie Seu Primeiro Eixo", es: "Crea Tu Primer Eje" })}</Link>
                    </Button>
                  </div>
                )}
                {axes?.map((axis) => {
                  const axisData = axis as any;
                  const value = morningCalibrations[axis.id] ?? 50;
                  const colorLow = axisData.colorLow || "#696969";
                  const colorHigh = axisData.colorHigh || "#22C55E";
                  const sliderColor = interpolateColor(colorLow, colorHigh, value);
                  return (
                    <div key={axis.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{axisData.emoji || "⚡"}</span>
                          <span>{axisData.axisName || axis.rightLabel}</span>
                        </div>
                        <span className="font-bold tabular-nums" style={{ color: sliderColor }}>{value}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([val]) =>
                          setMorningCalibrations((prev) => ({ ...prev, [axis.id]: val }))
                        }
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  );
                })}
                {!!axes?.length && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleMorningComplete}
                    disabled={startMorningMutation.isPending}
                  >
                    {startMorningMutation.isPending ? t({ en: "Calibrating...", pt: "Calibrando...", es: "Calibrando..." }) : t({ en: "Complete Morning Calibration", pt: "Completar Calibração da Manhã", es: "Completar Calibración Matutina" })}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* ==================== MIDDAY PHASE ==================== */}
          {phase === "midday" && (
            <div className="space-y-4">
              <Card className="border-sky-500/20 bg-gradient-to-b from-sky-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-sky-400" />
                    <CardTitle>{t({ en: "Midday Action", pt: "Ação do Meio-Dia", es: "Acción de Mediodía" })}</CardTitle>
                  </div>
                  <CardDescription>
                    {t({ en: "Focus on your 3 lowest-scoring axes. Define a single, decisive action to improve one of them.", pt: "Concentre-se nos seus 3 eixos de menor pontuação. Defina uma única ação decisiva para melhorar um deles.", es: "Concéntrate en tus 3 ejes con la puntuación más baja. Define una única acción decisiva para mejorar uno de ellos." })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">{t({ en: "Your 3 Lowest-Scoring Axes", pt: "Seus 3 Eixos de Menor Pontuação", es: "Tus 3 Ejes con Menor Puntuación" })}</h4>
                    {lowest3.map((axis) => (
                      <div key={axis.id} className="p-3 bg-background rounded-lg border text-sm flex items-center justify-between gap-4">
                        <span className="font-medium flex items-center gap-2">{axis.emoji || "⚡"} {axis.axisName}</span>
                        <span className="text-muted-foreground font-bold tabular-nums">{latestStates?.find(s => s.axisId === axis.id)?.value ?? "N/A"}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-semibold text-sm">{t({ en: "Recalibrate your focus axes based on your intention.", pt: "Recalibre seus eixos de foco com base em sua intenção.", es: "Recalibra tus ejes de enfoque según tu intención." })}</h4>
                    {lowest3.map((axis) => {
                      const axisData = axis as any;
                      const value = middayCalibrations[axis.id] ?? 50;
                      const colorLow = axisData.colorLow || "#696969";
                      const colorHigh = axisData.colorHigh || "#22C55E";
                      const sliderColor = interpolateColor(colorLow, colorHigh, value);
                      return (
                        <div key={axis.id} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                              <span>{axisData.emoji || "⚡"}</span>
                              <span>{axisData.axisName || axis.rightLabel}</span>
                            </div>
                            <span className="font-bold tabular-nums" style={{ color: sliderColor }}>{value}</span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([val]) =>
                              setMiddayCalibrations((prev) => ({ ...prev, [axis.id]: val }))
                            }
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label htmlFor="intended-action" className="text-sm font-medium">
                      {t({ en: "Intended Action", pt: "Ação Pretendida", es: "Acción Prevista" })}
                    </label>
                    <Textarea
                      id="intended-action"
                      placeholder={t({ en: "What single, decisive action will you take before evening to raise one of these axes?", pt: "Que ação única e decisiva você tomará antes da noite para elevar um desses eixos?", es: "¿Qué acción única y decisiva tomarás antes de la noche para elevar uno de estos ejes?" })}
                      value={intendedAction}
                      onChange={(e) => setIntendedAction(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">{t({ en: "Need a spark?", pt: "Precisa de uma faísca?", es: "¿Necesitas una chispa?" })}</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generatePrompt()}
                        disabled={promptLoading}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {promptLoading ? t({ en: "Thinking...", pt: "Pensando...", es: "Pensando..." }) : t({ en: "Generate", pt: "Gerar", es: "Generar" })}
                      </Button>
                    </div>
                    {aiPrompt && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm italic">
                        "{aiPrompt}"
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleMiddayComplete}
                    disabled={completeMiddayMutation.isPending}
                  >
                    {completeMiddayMutation.isPending ? t({ en: "Committing...", pt: "Confirmando...", es: "Confirmando..." }) : t({ en: "Commit to Action 🎯", pt: "Comprometer-se com a Ação 🎯", es: "Comprometerse a la Acción 🎯" })}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== EVENING PHASE ==================== */}
          {phase === "evening" && (
            <div className="space-y-4">
              {/* Evening Recalibration */}
              <Card className="border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Moon className="h-6 w-6 text-indigo-400" />
                    <CardTitle>{t({ en: "Evening Recalibration", pt: "Recalibração Noturna", es: "Recalibración Nocturna" })}</CardTitle>
                  </div>
                  <CardDescription>
                    {t({ en: "How have your axes shifted since this morning? Recalibrate to track cause-effect.", pt: "Como seus eixos mudaram desde esta manhã? Recalibre para rastrear causa e efeito.", es: "¿Cómo han cambiado tus ejes desde esta mañana? Recalibra para rastrear la causa y el efecto." })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {axes?.map((axis) => {
                    const axisData = axis as any;
                    const morningValue = latestStates?.find(s => s.axisId === axis.id)?.value ?? 50;
                    const value = eveningCalibrations[axis.id] ?? morningValue;
                    const colorLow = axisData.colorLow || "#696969";
                    const colorHigh = axisData.colorHigh || "#22C55E";
                    const sliderColor = interpolateColor(colorLow, colorHigh, value);
                    const delta = value - morningValue;
                    return (
                      <div key={axis.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="text-xs font-medium flex items-center gap-1">
                            <span>{axisData.emoji || "⚡"}</span>
                            <span>{axisData.axisName || axis.rightLabel}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="text-xs font-bold tabular-nums"
                              style={{ color: sliderColor }}
                            >
                              {value}
                            </span>
                            {delta !== 0 && (
                              <span className={`text-[10px] font-medium ${delta > 0 ? "text-green-500" : "text-red-400"}`}>
                                {delta > 0 ? `+${delta}` : delta}
                              </span>
                            )}
                          </div>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([val]) =>
                            setEveningCalibrations((prev) => ({ ...prev, [axis.id]: val }))
                          }
                          min={0}
                          max={100}
                          step={1}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Evening Reflection */}
              <Card className="border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">{t({ en: "Cause-Effect Mapping", pt: "Mapeamento Causa-Efeito", es: "Mapeo Causa-Efecto" })}</CardTitle>
                  <CardDescription>
                    {todayCycle?.intendedAction && (
                      <span className="block mb-2">
                        {t({ en: "Your commitment:", pt: "Seu compromisso:", es: "Tu compromiso:" })} <strong className="text-foreground">"{todayCycle.intendedAction}"</strong>
                      </span>
                    )}
                    {t({ en: "Map what happened and what changed.", pt: "Mapeie o que aconteceu e o que mudou.", es: "Mapea lo que sucedió y lo que cambió." })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="action-taken" className="text-sm font-medium">
                      {t({ en: "What did you actually do?", pt: "O que você realmente fez?", es: "¿Qué hiciste realmente?" })}
                    </label>
                    <Textarea
                      id="action-taken"
                      placeholder={t({ en: "Describe the action you took (or didn't take)...", pt: "Descreva a ação que você tomou (ou não tomou)...", es: "Describe la acción que tomaste (o no tomaste)..." })}
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="observed-effect" className="text-sm font-medium">
                      {t({ en: "What was the effect?", pt: "Qual foi o efeito?", es: "¿Cuál fue el efecto?" })}
                    </label>
                    <Textarea
                      id="observed-effect"
                      placeholder={t({ en: "What changed in your state, situation, or relationships?", pt: "O que mudou em seu estado, situação ou relacionamentos?", es: "¿Qué cambió en tu estado, situación o relaciones?" })}
                      value={observedEffect}
                      onChange={(e) => setObservedEffect(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reflection" className="text-sm font-medium">
                      {t({ en: "Deeper Reflection (Optional)", pt: "Reflexão Mais Profunda (Opcional)", es: "Reflexión Más Profunda (Opcional)" })}
                    </label>
                    <Textarea
                      id="reflection"
                      placeholder={t({ en: "Any patterns you notice? Connections to your axes?", pt: "Você nota algum padrão? Conexões com seus eixos?", es: "¿Notas algún patrón? ¿Conexiones con tus ejes?" })}
                      value={reflection}
                      onChange={(e) => setReflection(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleEveningComplete}
                    disabled={completeEveningMutation.isPending}
                  >
                    {completeEveningMutation.isPending ? t({ en: "Completing...", pt: "Completando...", es: "Completando..." }) : t({ en: "Complete Daily Cycle 🌙", pt: "Completar Ciclo Diário 🌙", es: "Completar Ciclo Diario 🌙" })}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================== COMPLETE PHASE ==================== */}
          {phase === "complete" && (
            <Card className="text-center py-12 border-green-500/20 bg-gradient-to-b from-green-500/5 to-transparent">
              <CardContent className="space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">{t({ en: "Daily Cycle Complete!", pt: "Ciclo Diário Completo!", es: "¡Ciclo Diario Completo!" })}</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {t({ en: "You have exercised your free will today. The Pilot is in control.", pt: "Você exerceu seu livre arbítrio hoje. O Piloto está no controle.", es: "Has ejercido tu libre albedrío hoy. El Piloto está en control." })} 
                  {t({ en: "Return tomorrow to continue building your streak.", pt: "Volte amanhã para continuar construindo sua sequência.", es: "Vuelve mañana para seguir construyendo tu racha." })}
                </p>
                {destinyScore?.score !== null && destinyScore?.score !== undefined && (
                  <div className="text-lg font-bold text-primary">
                    {t({ en: "Destiny Score:", pt: "Pontuação de Destino:", es: "Puntuación de Destino:" })} {destinyScore.score}%
                  </div>
                )}
                <div className="flex gap-4 justify-center pt-4">
                  <Button asChild>
                    <Link href="/sliders">{t({ en: "View Axes", pt: "Ver Eixos", es: "Ver Ejes" })}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/history">{t({ en: "View History", pt: "Ver Histórico", es: "Ver Historial" })}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <InvictusFooter />
        </div>
      </main>
    </div>
  );
}

