import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

/**
 * MonthlyReport — Before/After comparison for all 15 axes
 * 
 * Shows the user's first calibration of the month vs their latest,
 * with colour-coded deltas and an overall Destiny Score trend.
 */

interface AxisSnapshot {
  axisId: number;
  emoji: string;
  name: string;
  leftLabel: string;
  rightLabel: string;
  firstValue: number;
  latestValue: number;
}

interface MonthlyReportProps {
  monthLabel: string; // e.g. "January 2026"
  axes: AxisSnapshot[];
  destinyScoreStart: number;
  destinyScoreEnd: number;
  totalCalibrations: number;
  streakDays: number;
}

export function MonthlyReport({
  monthLabel,
  axes,
  destinyScoreStart,
  destinyScoreEnd,
  totalCalibrations,
  streakDays,
}: MonthlyReportProps) {
  const destinyDelta = destinyScoreEnd - destinyScoreStart;

  const improved = axes.filter(a => a.latestValue > a.firstValue).length;
  const declined = axes.filter(a => a.latestValue < a.firstValue).length;
  const stable = axes.filter(a => a.latestValue === a.firstValue).length;

  const sortedAxes = useMemo(() => {
    return [...axes].sort((a, b) => {
      const deltaA = a.latestValue - a.firstValue;
      const deltaB = b.latestValue - b.firstValue;
      return deltaB - deltaA; // Biggest improvements first
    });
  }, [axes]);

  const getDeltaColor = (delta: number) => {
    if (delta > 10) return "text-green-400";
    if (delta > 0) return "text-green-300";
    if (delta === 0) return "text-muted-foreground";
    if (delta > -10) return "text-red-300";
    return "text-red-400";
  };

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="w-4 h-4" />;
    if (delta < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#FFD700]";
    if (score >= 60) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    if (score >= 20) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{monthLabel}</span>
          </div>
          <CardTitle className="text-xl">Monthly Progress Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Destiny Score</p>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(destinyScoreEnd)}`}>
                  {destinyScoreEnd}%
                </span>
                <span className={`text-sm font-medium ${destinyDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {destinyDelta >= 0 ? '+' : ''}{destinyDelta}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Started at {destinyScoreStart}%
              </p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <div className="text-sm space-y-1">
                <p><strong className="text-green-400">{improved}</strong> axes improved</p>
                <p><strong className="text-red-400">{declined}</strong> axes declined</p>
                <p><strong className="text-muted-foreground">{stable}</strong> stable</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>{totalCalibrations} calibrations</span>
            <span>{streakDays}-day best streak</span>
          </div>
        </CardContent>
      </Card>

      {/* Axis-by-axis breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Axis-by-Axis Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedAxes.map((axis) => {
            const delta = axis.latestValue - axis.firstValue;
            return (
              <div key={axis.axisId} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <span className="text-lg w-8 text-center">{axis.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {axis.leftLabel} → {axis.rightLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Before bar */}
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative">
                      <div
                        className="absolute h-full bg-muted-foreground/30 rounded-full"
                        style={{ width: `${axis.firstValue}%` }}
                      />
                      <div
                        className="absolute h-full bg-primary rounded-full"
                        style={{ width: `${axis.latestValue}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                  <span className="text-xs text-muted-foreground">{axis.firstValue}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs font-bold">{axis.latestValue}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${getDeltaColor(delta)}`}>
                    {getDeltaIcon(delta)}
                    {delta >= 0 ? '+' : ''}{delta}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Invictus quote */}
      <p className="text-center text-xs text-muted-foreground/50 italic py-2">
        "I am the master of my fate, I am the captain of my soul."
      </p>
    </div>
  );
}
