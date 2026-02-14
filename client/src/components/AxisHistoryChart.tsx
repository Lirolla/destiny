import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface HistoryEntry {
  value: number;
  createdAt: string | Date;
}

interface AxisHistoryChartProps {
  history: HistoryEntry[];
  colorLow: string;
  colorHigh: string;
  axisName: string;
  leftLabel: string;
  rightLabel: string;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3)), g1 = hex(color1.slice(3, 5)), b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3)), g2 = hex(color2.slice(3, 5)), b2 = hex(color2.slice(5, 7));
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

export function AxisHistoryChart({
  history,
  colorLow,
  colorHigh,
  axisName,
  leftLabel,
  rightLabel,
}: AxisHistoryChartProps) {
  const chartData = useMemo(() => {
    const sorted = [...history].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const labels = sorted.map((entry) => {
      const d = new Date(entry.createdAt);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    });

    const values = sorted.map((e) => e.value);
    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 50;
    const lineColor = interpolateColor(colorLow, colorHigh, avgValue / 100);

    return {
      labels,
      datasets: [
        {
          label: axisName,
          data: values,
          borderColor: lineColor,
          backgroundColor: lineColor.replace("rgb", "rgba").replace(")", ", 0.15)"),
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: lineColor,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [history, colorLow, colorHigh, axisName]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (ctx: any) => `${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: "rgba(255,255,255,0.4)",
            font: { size: 10 },
            callback: (value: number | string) => {
              if (value === 0) return leftLabel;
              if (value === 100) return rightLabel;
              return `${value}`;
            },
          },
          grid: {
            color: "rgba(255,255,255,0.06)",
          },
        },
        x: {
          ticks: {
            color: "rgba(255,255,255,0.4)",
            font: { size: 9 },
            maxRotation: 45,
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    [leftLabel, rightLabel]
  );

  if (history.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
        No calibration history yet. Start calibrating to see your progress.
      </div>
    );
  }

  return (
    <div className="h-48">
      <Line data={chartData} options={options as any} />
    </div>
  );
}
