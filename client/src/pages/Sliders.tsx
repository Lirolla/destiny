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

// Destiny Score level config
const LEVEL_CONFIG = {
  uncalibrated: { label: "Not Calibrated", color: "#666", bgClass: "bg-muted" },
  critical: { label: "Critical", color: "#DC2626", bgClass: "bg-red-500/10" },
  needs_work: { label: "Needs Work", color: "#F97316", bgClass: "bg-orange-500/10" },
  growing: { label: "Growing", color: "#EAB308", bgClass: "bg-yellow-500/10" },
  strong: { label: "Strong", color: "#22C55E", bgClass: "bg-green-500/10" },
  mastery: { label: "Mastery", color: "#FFD700", bgClass: "bg-yellow-400/10" },
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
  if (value <= 30) return "Clouded";
  if (value <= 50) return "Transitional";
  if (value <= 70) return "Awakening";
  if (value <= 85) return "Clear";
  return "Mastery";
}

export default function Sliders() {
  const [expandedAxis, setExpandedAxis] = useState<number | null>(null);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});

  // Fetch data
  const { data: axes, isLoading: axesLoading } = trpc.sliders.listAxes.useQuery();
  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery();
  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();

  const utils = trpc.useUtils();
  const achievementCheck = useAutoAchievementCheck();

  const recordStateMutation = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
      toast.success("Calibration recorded");
      achievementCheck.onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to record: ${error.message}`);
    },
  });

  // Low-scoring axes for chapter linking
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
      toast.error("Please move the slider first");
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
          <p className="text-muted-foreground">Loading your axes...</p>
        </div>
      </div>
    );
  }

  const levelConfig = destinyScore?.level ? LEVEL_CONFIG[destinyScore.level] : LEVEL_CONFIG.uncalibrated;

  return (
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
      <PageHeader title="15 Axes of Free Will" subtitle="Calibrate your destiny" showBack />

      <main className="px-4 py-4 pb-24 max-w-2xl mx-auto space-y-6">
        {/* Overall Destiny Score */}
        <Card className={`${levelConfig.bgClass} border-0 overflow-hidden`}>
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Overall Destiny Score
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
                    Your Free Will is operating at {destinyScore.score}% — {destinyScore.calibratedCount}/{destinyScore.totalAxes} axes calibrated
                  </div>
                  {/* Score bar */}
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
                    Calibrate your axes below to see your Destiny Score
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low-scoring axes alert */}
        {lowAxes.length > 0 && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-red-400">
                    {lowAxes.length} {lowAxes.length === 1 ? "axis is" : "axes are"} in the red zone
                  </div>
                  {lowAxes.map((axis) => {
                    const chapterNum = (axis as any).axisNumber;
                    return (
                      <div key={axis.id} className="text-xs text-muted-foreground">
                        {(axis as any).emoji} <strong>{(axis as any).axisName}</strong> —{" "}
                        <Link href="/audiobook" className="text-primary underline">
                          {chapterNum === 0 ? "Listen to the Introduction" : `Go to Chapter ${chapterNum}`}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Radar Chart */}
        {axes && axes.length > 0 && latestStates && latestStates.length > 0 && (
          <Card className="border-0 bg-card/50 overflow-hidden">
            <CardContent className="pt-6 pb-4">
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Your Free Will Radar
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

        {/* Instructions */}
        <div className="text-sm text-muted-foreground text-center px-4">
          Move each slider to where you honestly feel you are <strong>right now</strong>.
          0 = Clouded State · 50 = Neutral · 100 = Clear State
        </div>

        {/* Axes */}
        {!axes || axes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Gauge className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No axes configured yet.</p>
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
                    {/* Header row */}
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedAxis(isExpanded ? null : axis.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{axisData.emoji || "⚡"}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {axisData.axisName || `${axis.leftLabel} ↔ ${axis.rightLabel}`}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {axisData.subtitle || `${axis.leftLabel} ↔ ${axis.rightLabel}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <div
                            className="text-xl font-bold tabular-nums"
                            style={{ color: sliderColor }}
                          >
                            {currentValue}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {getScoreLabel(currentValue)}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-1.5 px-1">
                      <div
                        className="relative"
                        style={{
                          // @ts-ignore
                          "--slider-color": sliderColor,
                        }}
                      >
                        <Slider
                          value={[currentValue]}
                          onValueChange={(value) => {
                            setSliderValues({ ...sliderValues, [axis.id]: value[0] });
                          }}
                          max={100}
                          step={1}
                          className="w-full [&_[role=slider]]:border-2 [&_[role=slider]]:shadow-md"
                          style={{
                            // @ts-ignore
                            "--tw-ring-color": sliderColor,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span style={{ color: colorLow }}>{axis.leftLabel}</span>
                        <span style={{ color: colorHigh }}>{axis.rightLabel}</span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-border/50">
                        {/* Description */}
                        {axisData.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {axisData.description}
                          </p>
                        )}

                        {/* Reflection prompt */}
                        {axisData.reflectionPrompt && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                              Reflection
                            </div>
                            <p className="text-sm italic text-foreground/80">
                              "{axisData.reflectionPrompt}"
                            </p>
                          </div>
                        )}

                        {/* Chapter reference */}
                        {axisData.chapterRef && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3" />
                            <span>Source: {axisData.chapterRef}</span>
                          </div>
                        )}

                        {/* Low score warning */}
                        {isLow && (
                          <div className="bg-red-500/10 rounded-lg p-3 text-xs">
                            <span className="text-red-400 font-medium">
                              Your {axisData.axisName || "axis"} is in the red zone.
                            </span>{" "}
                            <Link href="/audiobook" className="text-primary underline">
                              {axisData.axisNumber === 0
                                ? "The Introduction"
                                : `Chapter ${axisData.axisNumber}`}{" "}
                              was written for exactly this moment.
                            </Link>
                          </div>
                        )}

                        {/* Last calibration info */}
                        <div className="text-xs text-muted-foreground">
                          {latestState ? (
                            <>
                              Last calibrated: {latestState.value} on{" "}
                              {new Date(latestState.clientTimestamp).toLocaleDateString()}
                            </>
                          ) : (
                            "No previous calibration"
                          )}
                        </div>
                      </div>
                    )}

                    {/* Record button */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCalibrate(axis.id)}
                        disabled={recordStateMutation.isPending || sliderValues[axis.id] === undefined}
                        className="text-xs h-8"
                        style={{
                          borderColor: sliderColor,
                          color: sliderColor,
                        }}
                      >
                        {recordStateMutation.isPending ? "Recording..." : "Record"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Invictus quote */}
        <div className="text-center py-6 space-y-2">
          <p className="text-sm italic text-muted-foreground">
            "I am the master of my fate, I am the captain of my soul."
          </p>
          <p className="text-xs text-muted-foreground/60">— William Ernest Henley, Invictus</p>
        </div>
      </main>
    </PullToRefresh>
  );
}
