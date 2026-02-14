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

function interpolateColor(colorLow: string, colorHigh: string, value: number): string {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(colorLow.slice(1, 3)), g1 = hex(colorLow.slice(3, 5)), b1 = hex(colorLow.slice(5, 7));
  const r2 = hex(colorHigh.slice(1, 3)), g2 = hex(colorHigh.slice(3, 5)), b2 = hex(colorHigh.slice(5, 7));
  const t = value / 100;
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
}

function getTimeGreeting(): { greeting: string; icon: typeof Sun; period: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: "Good Morning, Pilot", icon: Sun, period: "morning" };
  if (hour < 17) return { greeting: "Midday Check-In", icon: Clock, period: "midday" };
  return { greeting: "Evening Reflection", icon: Moon, period: "evening" };
}

export default function DailyCycle() {
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
      toast.success("Morning calibration complete! ☀️");
      achievementCheck.onSuccess();
      setPhase("midday");
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const completeMiddayMutation = trpc.dailyCycle.completeMidday.useMutation({
    onSuccess: () => {
      refetchCycle();
      toast.success("Midday action committed! 🎯");
      setPhase("evening");
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const completeEveningMutation = trpc.dailyCycle.completeEvening.useMutation({
    onSuccess: () => {
      refetchCycle();
      utils.sliders.getLatestStates.invalidate();
      utils.sliders.getDestinyScore.invalidate();
      toast.success("Daily cycle complete! 🌙");
      achievementCheck.onSuccess();
      setPhase("complete");
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
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
      toast.error("Create at least one emotional axis first");
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
      toast.error("Enter your intended action");
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
      toast.error("Complete all required fields");
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

  const { greeting, icon: GreetingIcon } = getTimeGreeting();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Daily Will Cycle" subtitle={greeting} showBack />

      <main className="px-4 py-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Grace Period Banner */}
          {gracePeriod.available && gracePeriod.expiresAt && (
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-900 dark:text-orange-100">
                ⏰ Grace Period Active
              </AlertTitle>
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                Complete yesterday's cycle ({yesterdayDate}) within{" "}
                <strong>{formatGracePeriodExpiry(gracePeriod.expiresAt)}</strong> to keep your streak.
              </AlertDescription>
            </Alert>
          )}

          {/* Phase Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { id: "morning", icon: Sun, label: "Morning" },
              { id: "midday", icon: Clock, label: "Midday" },
              { id: "evening", icon: Moon, label: "Evening" },
            ].map((p, i) => {
              const isActive = phase === p.id;
              const isDone =
                (p.id === "morning" && todayCycle?.morningCompletedAt) ||
                (p.id === "midday" && todayCycle?.middayCompletedAt) ||
                (p.id === "evening" && todayCycle?.eveningCompletedAt);
              const Icon = p.icon;
              return (
                <div key={p.id} className="flex items-center gap-2 sm:gap-4">
                  {i > 0 && <div className="h-px w-6 sm:w-12 bg-border" />}
                  <div
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? "text-primary"
                        : isDone
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">{p.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destiny Score Summary */}
          {destinyScore?.score !== null && destinyScore?.score !== undefined && (
            <div className="text-center text-sm text-muted-foreground">
              Current Destiny Score:{" "}
              <span className="font-bold text-foreground">{destinyScore.score}%</span>
              <span className="mx-1">·</span>
              {destinyScore.calibratedCount}/{destinyScore.totalAxes} calibrated
            </div>
          )}

          {/* ==================== MORNING PHASE ==================== */}
          {phase === "morning" && (
            <Card className="border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-amber-500" />
                  <CardTitle>Morning Calibration</CardTitle>
                </div>
                <CardDescription>
                  Where are you right now? Calibrate all 15 axes honestly. This is measurement, not journaling.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {!axes || axes.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">No emotional axes found.</p>
                    <Button asChild>
                      <Link href="/sliders">Go to Sliders</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {axes.map((axis) => {
                      const axisData = axis as any;
                      const value = morningCalibrations[axis.id] ?? 50;
                      const colorLow = axisData.colorLow || "#696969";
                      const colorHigh = axisData.colorHigh || "#22C55E";
                      const sliderColor = interpolateColor(colorLow, colorHigh, value);
                      return (
                        <div key={axis.id} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium flex items-center gap-1.5">
                              <span>{axisData.emoji || "⚡"}</span>
                              <span>{axisData.axisName || `${axis.leftLabel} ↔ ${axis.rightLabel}`}</span>
                            </div>
                            <div
                              className="text-sm font-bold tabular-nums px-2 py-0.5 rounded"
                              style={{ color: sliderColor }}
                            >
                              {value}
                            </div>
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
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span style={{ color: colorLow }}>{axis.leftLabel}</span>
                            <span style={{ color: colorHigh }}>{axis.rightLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleMorningComplete}
                      disabled={startMorningMutation.isPending}
                    >
                      {startMorningMutation.isPending ? "Calibrating..." : "Complete Morning Calibration ☀️"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* ==================== MIDDAY PHASE ==================== */}
          {phase === "midday" && (
            <div className="space-y-4">
              {/* Lowest 3 Axes Focus */}
              {lowest3.length > 0 && (
                <Card className="border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-blue-500" />
                      <CardTitle className="text-lg">Focus Areas</CardTitle>
                    </div>
                    <CardDescription>
                      Your 3 lowest-scoring axes need attention. Recalibrate them after taking action.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lowest3.map((axis) => {
                      const axisData = axis as any;
                      const currentValue = latestStates?.find(s => s.axisId === axis.id)?.value ?? 50;
                      const newValue = middayCalibrations[axis.id] ?? currentValue;
                      const colorLow = axisData.colorLow || "#696969";
                      const colorHigh = axisData.colorHigh || "#22C55E";
                      const sliderColor = interpolateColor(colorLow, colorHigh, newValue);
                      const delta = newValue - currentValue;
                      return (
                        <div key={axis.id} className="space-y-1.5 p-3 rounded-lg bg-muted/30">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium flex items-center gap-1.5">
                              <span>{axisData.emoji || "⚡"}</span>
                              <span>{axisData.axisName || axis.rightLabel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">was {currentValue}</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span
                                className="text-sm font-bold tabular-nums"
                                style={{ color: sliderColor }}
                              >
                                {newValue}
                              </span>
                              {delta !== 0 && (
                                <span className={`text-xs font-medium ${delta > 0 ? "text-green-500" : "text-red-400"}`}>
                                  {delta > 0 ? `+${delta}` : delta}
                                </span>
                              )}
                            </div>
                          </div>
                          <Slider
                            value={[newValue]}
                            onValueChange={([val]) =>
                              setMiddayCalibrations((prev) => ({ ...prev, [axis.id]: val }))
                            }
                            min={0}
                            max={100}
                            step={1}
                          />
                          {axisData.reflectionPrompt && (
                            <p className="text-xs italic text-muted-foreground mt-1">
                              "{axisData.reflectionPrompt}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Decisive Action */}
              <Card className="border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <CardTitle>Decisive Action</CardTitle>
                  </div>
                  <CardDescription>
                    Commit to ONE specific action before evening. Not a wish — a command.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="intended-action" className="text-sm font-medium">
                      What will you do?
                    </label>
                    <Textarea
                      id="intended-action"
                      placeholder="e.g., Walk 15 minutes without my phone, have that difficult conversation, write 500 words..."
                      value={intendedAction}
                      onChange={(e) => setIntendedAction(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="ai-prompt" className="text-sm font-medium">
                        AI Decisive Prompt
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generatePrompt()}
                        disabled={promptLoading}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {promptLoading ? "Thinking..." : "Generate"}
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
                    {completeMiddayMutation.isPending ? "Committing..." : "Commit to Action 🎯"}
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
                    <CardTitle>Evening Recalibration</CardTitle>
                  </div>
                  <CardDescription>
                    How have your axes shifted since this morning? Recalibrate to track cause-effect.
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
                  <CardTitle className="text-lg">Cause-Effect Mapping</CardTitle>
                  <CardDescription>
                    {todayCycle?.intendedAction && (
                      <span className="block mb-2">
                        Your commitment: <strong className="text-foreground">"{todayCycle.intendedAction}"</strong>
                      </span>
                    )}
                    Map what happened and what changed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="action-taken" className="text-sm font-medium">
                      What did you actually do?
                    </label>
                    <Textarea
                      id="action-taken"
                      placeholder="Describe the action you took (or didn't take)..."
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="observed-effect" className="text-sm font-medium">
                      What was the effect?
                    </label>
                    <Textarea
                      id="observed-effect"
                      placeholder="What changed in your state, situation, or relationships?"
                      value={observedEffect}
                      onChange={(e) => setObservedEffect(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reflection" className="text-sm font-medium">
                      Deeper Reflection (Optional)
                    </label>
                    <Textarea
                      id="reflection"
                      placeholder="Any patterns you notice? Connections to your axes?"
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
                    {completeEveningMutation.isPending ? "Completing..." : "Complete Daily Cycle 🌙"}
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
                <h2 className="text-2xl font-bold">Daily Cycle Complete!</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You have exercised your free will today. The Pilot is in control.
                  Return tomorrow to continue building your streak.
                </p>
                {destinyScore?.score !== null && destinyScore?.score !== undefined && (
                  <div className="text-lg font-bold text-primary">
                    Destiny Score: {destinyScore.score}%
                  </div>
                )}
                <div className="flex gap-4 justify-center pt-4">
                  <Button asChild>
                    <Link href="/sliders">View Axes</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/history">View History</Link>
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
