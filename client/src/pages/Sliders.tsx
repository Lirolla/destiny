import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Plus, Gauge } from "lucide-react";
import { toast } from "sonner";
import { useAutoAchievementCheck } from "@/hooks/useAchievements";
import { PageHeader } from "@/components/PageHeader";

export default function Sliders() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAxis, setNewAxis] = useState({
    leftLabel: "",
    rightLabel: "",
    contextTag: "",
    description: "",
  });

  // Fetch axes
  const { data: axes, isLoading: axesLoading } = trpc.sliders.listAxes.useQuery();

  // Fetch latest states
  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery();

  // Mutations
  const utils = trpc.useUtils();
  const createAxisMutation = trpc.sliders.createAxis.useMutation({
    onSuccess: () => {
      utils.sliders.listAxes.invalidate();
      setIsCreateDialogOpen(false);
      setNewAxis({ leftLabel: "", rightLabel: "", contextTag: "", description: "" });
      toast.success("Emotional axis created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create axis: ${error.message}`);
    },
  });

  const achievementCheck = useAutoAchievementCheck();
  
  const recordStateMutation = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getLatestStates.invalidate();
      toast.success("Calibration recorded");
      achievementCheck.onSuccess(); // Check for new achievements
    },
    onError: (error) => {
      toast.error(`Failed to record calibration: ${error.message}`);
    },
  });

  // Slider state management
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});

  const handleCreateAxis = () => {
    if (!newAxis.leftLabel || !newAxis.rightLabel) {
      toast.error("Both labels are required");
      return;
    }

    createAxisMutation.mutate({
      leftLabel: newAxis.leftLabel,
      rightLabel: newAxis.rightLabel,
      contextTag: newAxis.contextTag || undefined,
      description: newAxis.description || undefined,
    });
  };

  const handleCalibrate = (axisId: number) => {
    const value = sliderValues[axisId];
    if (value === undefined) {
      toast.error("Please set a value first");
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Emotional Sliders" subtitle="Calibrate your inner state" showBack />

      {/* Main Content */}
      <main className="px-4 py-4 pb-24">
        {axesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your axes...</p>
          </div>
        ) : !axes || axes.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>No Emotional Axes Yet</CardTitle>
              <CardDescription>
                Create your first emotional axis to start calibrating your state.
                Think of bipolar dimensions like Fear ← → Courage or Chaos ← → Order.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Axis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-sm text-muted-foreground">
              <strong>Instructions:</strong> Move each slider to calibrate your current emotional state.
              0 = fully left pole, 100 = fully right pole, 50 = neutral.
            </div>

            {axes.map((axis) => {
              const latestState = latestStates?.find((s) => s.axisId === axis.id);
              const currentValue = sliderValues[axis.id] ?? latestState?.value ?? 50;

              return (
                <Card key={axis.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {axis.leftLabel} ← → {axis.rightLabel}
                        </CardTitle>
                        {axis.contextTag && (
                          <div className="text-xs text-muted-foreground">
                            Context: {axis.contextTag}
                          </div>
                        )}
                        {axis.description && (
                          <CardDescription className="text-sm">
                            {axis.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{currentValue}</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Slider
                        value={[currentValue]}
                        onValueChange={(value) => {
                          setSliderValues({ ...sliderValues, [axis.id]: value[0] });
                        }}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{axis.leftLabel}</span>
                        <span>Neutral (50)</span>
                        <span>{axis.rightLabel}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {latestState ? (
                          <>
                            Last: {latestState.value} on{" "}
                            {new Date(latestState.clientTimestamp).toLocaleDateString()}
                          </>
                        ) : (
                          "No previous calibration"
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCalibrate(axis.id)}
                        disabled={recordStateMutation.isPending}
                      >
                        {recordStateMutation.isPending ? "Recording..." : "Record Calibration"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
