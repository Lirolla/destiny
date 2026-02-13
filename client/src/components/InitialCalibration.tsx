import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";


interface InitialCalibrationProps {
  open: boolean;
  onComplete: () => void;
}

export function InitialCalibration({ open, onComplete }: InitialCalibrationProps) {
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [calibrations, setCalibrations] = useState<Record<number, number>>({});

  const utils = trpc.useUtils();
  const recordStateMutation = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getLatestStates.invalidate();
    },
  });

  const currentAxis = axes?.[currentIndex];
  const totalAxes = axes?.length || 0;
  const progress = totalAxes > 0 ? ((currentIndex + 1) / totalAxes) * 100 : 0;

  const handleSliderChange = (value: number[]) => {
    if (currentAxis) {
      setCalibrations(prev => ({ ...prev, [currentAxis.id]: value[0] }));
    }
  };

  const handleNext = async () => {
    if (!currentAxis) return;

    const value = calibrations[currentAxis.id] ?? 50;

    try {
      // Record the calibration
      await recordStateMutation.mutateAsync({
        axisId: currentAxis.id,
        value,
        calibrationType: "manual",
      });

      if (currentIndex < totalAxes - 1) {
        // Move to next axis
        setCurrentIndex(prev => prev + 1);
      } else {
        // All axes calibrated
        toast.success("Initial calibration complete!");
        onComplete();
      }
    } catch (error) {
      toast.error("Failed to save calibration");
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalAxes - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!axes || axes.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Initial Calibration</DialogTitle>
          <DialogDescription>
            Let's establish your baseline emotional state across all 5 dimensions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Axis {currentIndex + 1} of {totalAxes}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Current Axis */}
          {currentAxis && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">
                  {currentAxis.leftLabel} ↔ {currentAxis.rightLabel}
                </h3>
                {currentAxis.description && (
                  <p className="text-muted-foreground">{currentAxis.description}</p>
                )}
              </div>

              {/* Slider */}
              <div className="bg-muted/30 rounded-lg p-8 space-y-4">
                <Slider
                  value={[calibrations[currentAxis.id] ?? 50]}
                  onValueChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{currentAxis.leftLabel}</span>
                  <span className="text-2xl font-bold text-primary">
                    {calibrations[currentAxis.id] ?? 50}
                  </span>
                  <span className="text-muted-foreground">{currentAxis.rightLabel}</span>
                </div>
              </div>

              {/* Guidance */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>How to calibrate:</strong> Move the slider to where you honestly are right now, not where you wish to be. 
                  There are no "good" or "bad" positions—only accurate or inaccurate measurements.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip This One
            </Button>
            <Button
              onClick={handleNext}
              disabled={recordStateMutation.isPending}
            >
              {currentIndex < totalAxes - 1 ? "Next Axis" : "Complete Setup"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
