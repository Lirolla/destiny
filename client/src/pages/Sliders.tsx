import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Gauge, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAutoAchievementCheck } from "@/hooks/useAchievements";
import { PageHeader } from "@/components/PageHeader";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Link } from "wouter";
import { DestinyRadarChart } from "@/components/DestinyRadarChart";
import { InvictusMoment } from "@/components/InvictusMoment";
import { AxisHistoryChart } from "@/components/AxisHistoryChart";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Sliders() {
  const { t } = useLanguage();

  const LEVEL_CONFIG = {
    uncalibrated: { label: t({ en: "Not Calibrated", pt: "Não Calibrado", es: "No Calibrado" }), color: "#666", bgClass: "bg-muted" },
    critical: { label: t({ en: "Critical", pt: "Crítico", es: "Crítico" }), color: "#DC2626", bgClass: "bg-red-500/10" },
    needs_work: { label: t({ en: "Needs Work", pt: "Requer Atenção", es: "Necesita Trabajo" }), color: "#F97316", bgClass: "bg-orange-500/10" },
    growing: { label: t({ en: "Growing", pt: "Crescendo", es: "Creciendo" }), color: "#EAB308", bgClass: "bg-yellow-500/10" },
    strong: { label: t({ en: "Strong", pt: "Forte", es: "Fuerte" }), color: "#22C55E", bgClass: "bg-green-500/10" },
    mastery: { label: t({ en: "Mastery", pt: "Maestria", es: "Maestría" }), color: "#FFD700", bgClass: "bg-yellow-400/10" },
  } as const;

  function interpolateColor(colorLow: string, colorHigh: string, value: number): string {
    const hex = (c: string) => parseInt(c, 16);
    const r1 = hex(colorLow.slice(1, 3)), g1 = hex(colorLow.slice(3, 5)), b1 = hex(colorLow.slice(5, 7));
    const r2 = hex(colorHigh.slice(1, 3)), g2 = hex(colorHigh.slice(3, 5)), b2 = hex(colorHigh.slice(5, 7));
    const t = value / 100;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function getScoreLabel(value: number): string {
    if (value <= 30) return t({ en: "Clouded", pt: "Nublado", es: "Nublado" });
    if (value <= 50) return t({ en: "Transitional", pt: "Em Transição", es: "Transicional" });
    if (value <= 70) return t({ en: "Awakening", pt: "Despertando", es: "Despertar" });
    if (value <= 85) return t({ en: "Clear", pt: "Claro", es: "Claro" });
    return t({ en: "Mastery", pt: "Maestria", es: "Maestría" });
  }

  const [expandedAxis, setExpandedAxis] = useState<number | null>(null);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [showInvictus, setShowInvictus] = useState(false);

  const { data: axes, isLoading: axesLoading } = trpc.sliders.listAxes.useQuery();
  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery();
  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();

  const utils = trpc.useUtils();
  const achievementCheck = useAutoAchievementCheck();

  const recordStateMutation = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
      toast.success(t({ en: "Calibration recorded", pt: "Calibração registrada", es: "Calibración registrada" }));
      achievementCheck.onSuccess();
      setTimeout(() => {
        const allStates = utils.sliders.getLatestStates.getData();
        if (allStates && allStates.length >= 15 && allStates.every(s => s.value >= 70)) {
          const hasSeenInvictus = sessionStorage.getItem('invictus_shown_today');
          if (!hasSeenInvictus) {
            setShowInvictus(true);
            sessionStorage.setItem('invictus_shown_today', 'true');
          }
        }
      }, 500);
    },
    onError: (error) => {
      toast.error(`${t({ en: "Failed to record:", pt: "Falha ao registrar:", es: "Fallo al registrar:" })} ${error.message}`);
    },
  });

  const lowAxes = useMemo(() => {
    if (!axes || !latestStates) return [];
    return axes.filter((axis) => {
      const state = latestStates.find((s) => s.axisId === axis.id);
      return state && state.value <= 30;
    });
  }, [axes, latestStates]);

  const handleCalibrate = (axisId: number) => {
    const value = sliderValues[axisId];
    if (value === undefined) {
      toast.error(t({ en: "Please move the slider first", pt: "Por favor, mova o controle deslizante primeiro", es: "Por favor, mueva el deslizador primero" }));
      return;
    }
    recordStateMutation.mutate({
      axisId,
      value,
      calibrationType: "manual",
    });
  };

  if (axesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">{t({ en: "Loading your axes...", pt: "Carregando seus eixos...", es: "Cargando tus ejes..." })}</p>
        </div>
      </div>
    );
  }

  const levelConfig = destinyScore?.level ? LEVEL_CONFIG[destinyScore.level] : LEVEL_CONFIG.uncalibrated;

  return (
    <>
    <PullToRefresh
      onRefresh={async () => {
        await Promise.all([
          utils.sliders.listAxes.invalidate(),
          utils.sliders.getLatestStates.invalidate(),
          utils.sliders.getDestinyScore.invalidate(),
        ]);
      }}
      className="min-h-screen bg-background"
    >
      <PageHeader title={t({ en: "15 Axes of Free Will", pt: "15 Eixos do Livre Arbítrio", es: "15 Ejes del Libre Albedrío" })} subtitle={t({ en: "Calibrate your destiny", pt: "Calibre seu destino", es: "Calibra tu destino" })} showBack />

      <main className="px-4 py-4 pb-24 max-w-2xl mx-auto space-y-6">
        <Card className={`${levelConfig.bgClass} border-0 overflow-hidden`}>
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {t({ en: "Overall Destiny Score", pt: "Pontuação de Destino Geral", es: "Puntuación de Destino General" })}
              </div>
              {destinyScore?.score !== null && destinyScore?.score !== undefined ? (
                <>
                  <div
                    className="text-6xl font-black tabular-nums"
                    style={{ color: levelConfig.color }}
                  >
                    {destinyScore.score}%
                  </div>
                  <div
                    className="text-lg font-semibold"
                    style={{ color: levelConfig.color }}
                  >
                    {levelConfig.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t({ en: `Your Free Will is operating at ${destinyScore.score}% — ${destinyScore.calibratedCount}/${destinyScore.totalAxes} axes calibrated`, pt: `Seu Livre Arbítrio está operando a ${destinyScore.score}% — ${destinyScore.calibratedCount}/${destinyScore.totalAxes} eixos calibrados`, es: `Tu Libre Albedrío está operando al ${destinyScore.score}% — ${destinyScore.calibratedCount}/${destinyScore.totalAxes} ejes calibrados` })}
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${destinyScore.score}%`,
                        background: `linear-gradient(90deg, #DC2626, #F97316, #EAB308, #22C55E, #FFD700)`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-muted-foreground">—</div>
                  <div className="text-sm text-muted-foreground">
                    {t({ en: "Calibrate your axes below to see your Destiny Score", pt: "Calibre seus eixos abaixo para ver sua Pontuação de Destino", es: "Calibra tus ejes a continuación para ver tu Puntuación de Destino" })}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {lowAxes.length > 0 && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-400">
                    {t({ en: `${lowAxes.length} ${lowAxes.length === 1 ? "axis is" : "axes are"} in the red zone`, pt: `${lowAxes.length} ${lowAxes.length === 1 ? "eixo está" : "eixos estão"} na zona vermelha`, es: `${lowAxes.length} ${lowAxes.length === 1 ? "eje está" : "ejes están"} en la zona roja` })}
                  </div>
                  {lowAxes.map((axis) => {
                    const chapterNum = (axis as any).axisNumber;
                    return (
                      <div key={axis.id} className="text-xs text-muted-foreground">
                        {(axis as any).emoji} <strong>{(axis as any).axisName}</strong> —{" "}
                        <Link href="/audiobook" className="text-primary underline">
                          {chapterNum === 0 ? t({ en: "Listen to the Introduction", pt: "Ouça a Introdução", es: "Escuchar la Introducción" }) : t({ en: `Go to Chapter ${chapterNum}`, pt: `Ir para o Capítulo ${chapterNum}`, es: `Ir al Capítulo ${chapterNum}` })}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {axes && axes.length > 0 && latestStates && latestStates.length > 0 && (
          <Card className="border-0 bg-card/50 overflow-hidden">
            <CardContent className="pt-6 pb-4">
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t({ en: "Your Free Will Radar", pt: "Seu Radar do Livre Arbítrio", es: "Tu Radar de Libre Albedrío" })}
                </div>
              </div>
              <DestinyRadarChart
                axes={axes}
                currentStates={latestStates}
                height={320}
              />
            </CardContent>
          </Card>
        )}

        <div className="text-sm text-muted-foreground text-center px-4" dangerouslySetInnerHTML={{ __html: t({ en: "Move each slider to where you honestly feel you are <strong>right now</strong>.", pt: "Mova cada controle deslizante para onde você honestamente sente que está <strong>agora</strong>.", es: "Mueve cada deslizador a donde honestamente sientas que estás <strong>ahora mismo</strong>." }) }} />
        <div className="text-sm text-muted-foreground text-center px-4">
          {t({ en: "0 = Clouded State · 50 = Neutral · 100 = Clear State", pt: "0 = Estado Nublado · 50 = Neutro · 100 = Estado Claro", es: "0 = Estado Nublado · 50 = Neutral · 100 = Estado Claro" })}
        </div>

        {!axes || axes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Gauge className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t({ en: "No axes configured yet.", pt: "Nenhum eixo configurado ainda.", es: "Aún no hay ejes configurados." })}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {axes.map((axis) => {
              const latestState = latestStates?.find((s) => s.axisId === axis.id);
              const currentValue = sliderValues[axis.id] ?? latestState?.value ?? 50;
              const isExpanded = expandedAxis === axis.id;
              const axisData = axis as any;
              const colorLow = axisData.colorLow || "#696969";
              const colorHigh = axisData.colorHigh || "#22C55E";
              const sliderColor = interpolateColor(colorLow, colorHigh, currentValue);
              const isLow = currentValue <= 30;

              return (
                <Card
                  key={axis.id}
                  className="overflow-hidden transition-all duration-200"
                  style={{
                    borderLeft: `4px solid ${sliderColor}`,
                  }}
                >
                  <CardContent className="pt-4 pb-4 space-y-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedAxis(isExpanded ? null : axis.id)}>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{axisData.emoji}</span>
                        <div className="flex-1">
                          <div className="font-bold text-base leading-tight">{axisData.axisName}</div>
                          <div className="text-xs text-muted-foreground">{axisData.dailyCycle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <div className="font-bold text-lg tabular-nums" style={{ color: sliderColor }}>{Math.round(currentValue)}</div>
                          <div className="text-xs text-muted-foreground">{getScoreLabel(currentValue)}</div>
                        </div>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-4 space-y-4">
                        <div className="text-sm text-muted-foreground italic px-1">
                          {axisData.description}
                        </div>
                        <div className="relative">
                          <Slider
                            aria-label={t({ en: `Calibrate ${axisData.axisName}`, pt: `Calibrar ${axisData.axisName}`, es: `Calibrar ${axisData.axisName}` })}
                            value={[currentValue]}
                            onValueChange={(val) => setSliderValues({ ...sliderValues, [axis.id]: val[0] })}
                            max={100}
                            step={1}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{t({ en: "Clouded", pt: "Nublado", es: "Nublado" })}</span>
                            <span>{t({ en: "Clear", pt: "Claro", es: "Claro" })}</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedAxis(null)}
                          >
                            {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCalibrate(axis.id)}
                            disabled={recordStateMutation.isPending}
                            style={{ background: sliderColor, color: isLow ? '#fff' : '#000' }}
                          >
                            {t({ en: "Calibrate", pt: "Calibrar", es: "Calibrar" })}
                          </Button>
                        </div>
                        <AxisHistoryInline
                          axisId={axis.id}
                          colorLow={colorLow}
                          colorHigh={colorHigh}
                          axisName={axisData.axisName || "Axis"}
                          leftLabel={axis.leftLabel}
                          rightLabel={axis.rightLabel}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {showInvictus && (
          <InvictusMoment onComplete={() => setShowInvictus(false)} />
        )}
      </main>
    </PullToRefresh>
    </>
  );
}

/** Inline wrapper that fetches history for a single axis */
function AxisHistoryInline({
  axisId,
  colorLow,
  colorHigh,
  axisName,
  leftLabel,
  rightLabel,
}: {
  axisId: number;
  colorLow: string;
  colorHigh: string;
  axisName: string;
  leftLabel: string;
  rightLabel: string;
}) {
  const { t } = useLanguage();
  const { data: history } = trpc.sliders.getHistory.useQuery(
    { axisId, days: 30 },
    { staleTime: 60_000 }
  );
  if (!history || history.length === 0) return null;
  return (
    <div className="bg-muted/20 rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {t({ en: "30-Day History", pt: "Histórico de 30 Dias", es: "Historial de 30 Días" })}
      </div>
      <AxisHistoryChart
        history={history}
        colorLow={colorLow}
        colorHigh={colorHigh}
        axisName={axisName}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
      />
    </div>
  );
}
