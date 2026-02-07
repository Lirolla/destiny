import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Sun, Clock, Moon, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { calculateGracePeriod, formatGracePeriodExpiry, getYesterdayDate } from "@/lib/streakRecovery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/PageHeader";

export default function DailyCycle() {
  const [phase, setPhase] = useState<"morning" | "midday" | "evening" | "complete">("morning");

  // Fetch today's cycle
  const { data: todayCycle, isLoading: cycleLoading, refetch: refetchCycle } = trpc.dailyCycle.getToday.useQuery(undefined, {
    
  });

  // Fetch yesterday's cycle for grace period
  const yesterdayDate = getYesterdayDate();
  const { data: recentCycles } = trpc.dailyCycle.getHistory.useQuery(
    { days: 2 },
    {  }
  );
  const yesterdayCycle = recentCycles?.find(c => c.cycleDate === yesterdayDate);

  // Calculate grace period status
  const gracePeriod = yesterdayCycle && !yesterdayCycle.isComplete
    ? calculateGracePeriod(yesterdayDate)
    : { available: false };

  // Fetch axes for morning calibration
  const { data: axes } = trpc.sliders.listAxes.useQuery(undefined, {
    
  });

  // Determine current phase based on cycle data
  useEffect(() => {
    if (todayCycle) {
      if (todayCycle.isComplete) {
        setPhase("complete");
      } else if (todayCycle.eveningCompletedAt) {
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

  // Midday state
  const [intendedAction, setIntendedAction] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  // Evening state
  const [actionTaken, setActionTaken] = useState("");
  const [observedEffect, setObservedEffect] = useState("");
  const [reflection, setReflection] = useState("");

  // Mutations
  const utils = trpc.useUtils();
  const startMorningMutation = trpc.dailyCycle.startMorning.useMutation({
    onSuccess: () => {
      refetchCycle();
      toast.success("Morning calibration complete");
      setPhase("midday");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const completeMiddayMutation = trpc.dailyCycle.completeMidday.useMutation({
    onSuccess: () => {
      refetchCycle();
      toast.success("Midday action committed");
      setPhase("evening");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const completeEveningMutation = trpc.dailyCycle.completeEvening.useMutation({
    onSuccess: () => {
      refetchCycle();
      toast.success("Daily cycle complete!");
      setPhase("complete");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  // AI prompt generation
  const { data: promptData, refetch: generatePrompt, isLoading: promptLoading } = trpc.aiCoach.generatePrompt.useQuery(undefined, {
    enabled: false, // Manual trigger
  });

  useEffect(() => {
    if (promptData?.prompt) {
      setAiPrompt(promptData.prompt);
    }
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

    completeEveningMutation.mutate({
      actionTaken: actionTaken.trim(),
      observedEffect: observedEffect.trim(),
      reflection: reflection.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Daily Cycle" subtitle="Morning, midday & evening rituals" showBack />

      {/* Main Content */}
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
                You can still complete yesterday's cycle ({yesterdayDate}) within the next{" "}
                <strong>{formatGracePeriodExpiry(gracePeriod.expiresAt)}</strong> to maintain your streak.
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-orange-600 text-orange-900 hover:bg-orange-100 dark:text-orange-100 dark:hover:bg-orange-900/50"
                  onClick={() => {
                    toast.info("Yesterday's cycle feature coming soon!");
                  }}
                >
                  Complete Yesterday
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {/* Phase Indicator */}
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${phase === "morning" ? "text-primary" : "text-muted-foreground"}`}>
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Morning</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className={`flex items-center gap-2 ${phase === "midday" ? "text-primary" : "text-muted-foreground"}`}>
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Midday</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className={`flex items-center gap-2 ${phase === "evening" ? "text-primary" : "text-muted-foreground"}`}>
              <Moon className="h-5 w-5" />
              <span className="text-sm font-medium">Evening</span>
            </div>
          </div>

          {/* Morning Phase */}
          {phase === "morning" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-primary" />
                  <CardTitle>Morning Calibration</CardTitle>
                </div>
                <CardDescription>
                  Calibrate your current emotional state. This is measurement, not journaling.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!axes || axes.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">No emotional axes found.</p>
                    <Button asChild>
                      <Link href="/sliders">Create Your First Axis</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {axes.map((axis) => {
                      const value = morningCalibrations[axis.id] ?? 50;
                      return (
                        <div key={axis.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">
                              {axis.leftLabel} ← → {axis.rightLabel}
                            </div>
                            <div className="text-xs font-mono px-2 py-1 rounded-md bg-muted tabular-nums">
                              {value}
                            </div>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={([val]) => setMorningCalibrations(prev => ({ ...prev, [axis.id]: val }))}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      );
                    })}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleMorningComplete}
                      disabled={startMorningMutation.isPending}
                    >
                      {startMorningMutation.isPending ? "Calibrating..." : "Complete Morning Calibration"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Midday Phase */}
          {phase === "midday" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle>Midday Action</CardTitle>
                </div>
                <CardDescription>
                  Define a single, decisive action to take before your evening reflection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="intended-action" className="font-medium">Intended Action</label>
                  <Textarea
                    id="intended-action"
                    placeholder="e.g., Go for a 15-minute walk without my phone"
                    value={intendedAction}
                    onChange={(e) => setIntendedAction(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="ai-prompt" className="font-medium">AI Decisive Prompt (Optional)</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generatePrompt()}
                      disabled={promptLoading}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {promptLoading ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  <Textarea
                    id="ai-prompt"
                    placeholder="Let the AI generate a prompt to help you commit to your action..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="bg-muted/50"
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleMiddayComplete}
                  disabled={completeMiddayMutation.isPending}
                >
                  {completeMiddayMutation.isPending ? "Committing..." : "Commit to Action"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Evening Phase */}
          {phase === "evening" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Moon className="h-6 w-6 text-primary" />
                  <CardTitle>Evening Reflection</CardTitle>
                </div>
                <CardDescription>
                  Reflect on the action you took and its effect on your state.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="action-taken" className="font-medium">Action Taken</label>
                  <Textarea
                    id="action-taken"
                    placeholder="What did you do?"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="observed-effect" className="font-medium">Observed Effect</label>
                  <Textarea
                    id="observed-effect"
                    placeholder="What was the immediate result?"
                    value={observedEffect}
                    onChange={(e) => setObservedEffect(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="reflection" className="font-medium">Deeper Reflection (Optional)</label>
                  <Textarea
                    id="reflection"
                    placeholder="Any further thoughts or connections?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleEveningComplete}
                  disabled={completeEveningMutation.isPending}
                >
                  {completeEveningMutation.isPending ? "Completing..." : "Complete Daily Cycle"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Complete Phase */}
          {phase === "complete" && (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Daily Cycle Complete!</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You have successfully completed your will cycle for the day. Return tomorrow to continue building your streak.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/history">View History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
