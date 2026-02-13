import { useMemo } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Axis {
  id: number;
  leftLabel: string;
  rightLabel: string;
  emoji?: string | null;
  axisName?: string | null;
  colorHigh?: string | null;
  [key: string]: any;
}

interface State {
  axisId: number;
  value: number;
}

interface DestinyRadarChartProps {
  axes: Axis[];
  currentStates: State[];
  previousStates?: State[];
  height?: number;
}

export function DestinyRadarChart({
  axes,
  currentStates,
  previousStates,
  height = 300,
}: DestinyRadarChartProps) {
  const chartData = useMemo(() => {
    const labels = axes.map((a) => {
      const name = (a as any).axisName || a.rightLabel;
      const emoji = (a as any).emoji || "";
      return `${emoji} ${name}`.trim();
    });

    const currentValues = axes.map((a) => {
      const state = currentStates.find((s) => s.axisId === a.id);
      return state?.value ?? 0;
    });

    const datasets: any[] = [
      {
        label: "Current",
        data: currentValues,
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ];

    if (previousStates && previousStates.length > 0) {
      const prevValues = axes.map((a) => {
        const state = previousStates.find((s) => s.axisId === a.id);
        return state?.value ?? 0;
      });

      datasets.push({
        label: "Previous",
        data: prevValues,
        backgroundColor: "rgba(148, 163, 184, 0.08)",
        borderColor: "rgba(148, 163, 184, 0.4)",
        borderWidth: 1,
        borderDash: [4, 4],
        pointBackgroundColor: "rgba(148, 163, 184, 0.6)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 2,
        pointHoverRadius: 4,
      });
    }

    return { labels, datasets };
  }, [axes, currentStates, previousStates]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: !!previousStates && previousStates.length > 0,
          position: "bottom" as const,
          labels: {
            color: "rgba(148, 163, 184, 0.8)",
            font: { size: 11 },
            padding: 16,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          titleColor: "#fff",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(148, 163, 184, 0.2)",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              let label = "";
              if (value <= 30) label = "Clouded";
              else if (value <= 50) label = "Transitional";
              else if (value <= 70) label = "Awakening";
              else if (value <= 85) label = "Clear";
              else label = "Mastery";
              return `${context.dataset.label}: ${value} (${label})`;
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: "rgba(148, 163, 184, 0.4)",
            backdropColor: "transparent",
            font: { size: 9 },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.12)",
            circular: true,
          },
          angleLines: {
            color: "rgba(148, 163, 184, 0.12)",
          },
          pointLabels: {
            color: "rgba(226, 232, 240, 0.7)",
            font: { size: 10, weight: "bold" as const },
            padding: 8,
          },
        },
      },
    }),
    [previousStates]
  );

  return (
    <div style={{ height }} className="w-full">
      <Radar data={chartData} options={options} />
    </div>
  );
}
