import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
      utils.sliders.getDestinyScore.invalidate();
    },
  });

  const currentAxis = axes?.[currentIndex];
  const totalAxes = axes?.length || 0;
  const progress = totalAxes > 0 ? ((currentIndex + 1) / totalAxes) * 100 : 0;

  const axisData = currentAxis as any;
  const colorLow = axisData?.colorLow || "#696969";
  const colorHigh = axisData?.colorHigh || "#22C55E";
  const currentValue = currentAxis ? (calibrations[currentAxis.id] ?? 50) : 50;
  const sliderColor = interpolateColor(colorLow, colorHigh, currentValue);

  const handleSliderChange = (value: number[]) => {
    if (currentAxis) {
      setCalibrations(prev => ({ ...prev, [currentAxis.id]: value[0] }));
    }
  };

  const handleNext = async () => {
    if (!currentAxis) return;

    const value = calibrations[currentAxis.id] ?? 50;

    try {
      await recordStateMutation.mutateAsync({
        axisId: currentAxis.id,
        value,
        calibrationType: "manual",
      });

      if (currentIndex < totalAxes - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        toast.success("Initial calibration complete! Your Destiny Score has been calculated.");
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
      <DialogContent className="max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {axisData?.emoji && <span className="text-2xl mr-2">{axisData.emoji}</span>}
            Initial Calibration
          </DialogTitle>
          <DialogDescription className="text-center">
            Calibrate your free will across all 15 dimensions of the Destiny Hacking system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
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
              {/* Axis title with emoji */}
              <div className="text-center space-y-1">
                <div className="text-3xl mb-1">{axisData?.emoji || "⚡"}</div>
                <h3 className="text-xl font-bold">
                  {axisData?.axisName || `${currentAxis.leftLabel} ↔ ${currentAxis.rightLabel}`}
                </h3>
                {axisData?.subtitle && (
                  <p className="text-sm text-muted-foreground italic">
                    "{axisData.subtitle}"
                  </p>
                )}
              </div>

              {/* Description */}
              {axisData?.description && (
                <p className="text-xs text-muted-foreground leading-relaxed text-center px-2">
                  {axisData.description}
                </p>
              )}

              {/* Slider area with colour gradient */}
              <div
                className="rounded-lg p-6 space-y-3"
                style={{
                  background: `linear-gradient(135deg, ${colorLow}15, ${colorHigh}15)`,
                  border: `1px solid ${sliderColor}30`,
                }}
              >
                <Slider
                  value={[currentValue]}
                  onValueChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: colorLow }}>
                    {currentAxis.leftLabel}
                  </span>
                  <span
                    className="text-3xl font-black tabular-nums"
                    style={{ color: sliderColor }}
                  >
                    {currentValue}
                  </span>
                  <span className="text-xs font-medium" style={{ color: colorHigh }}>
                    {currentAxis.rightLabel}
                  </span>
                </div>
              </div>

              {/* Reflection prompt */}
              {axisData?.reflectionPrompt && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Reflect
                  </div>
                  <p className="text-sm italic text-foreground/80">
                    "{axisData.reflectionPrompt}"
                  </p>
                </div>
              )}

              {/* Guidance */}
              <p className="text-[11px] text-muted-foreground text-center">
                Move the slider to where you honestly are <strong>right now</strong>. 
                There are no good or bad positions — only accurate or inaccurate measurements.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              disabled={recordStateMutation.isPending}
              style={{
                backgroundColor: sliderColor,
                borderColor: sliderColor,
              }}
            >
              {recordStateMutation.isPending
                ? "Saving..."
                : currentIndex < totalAxes - 1
                ? "Next Axis →"
                : "Complete Calibration ✓"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
