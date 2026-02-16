import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronRight } from "lucide-react";

interface QuickCalibrateProps {
  open: boolean;
  onClose: () => void;
}

export function QuickCalibrate({ open, onClose }: QuickCalibrateProps) {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: lowest3 } = trpc.sliders.getLowest3.useQuery();
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const recordState = trpc.sliders.recordState.useMutation({
    onSuccess: () => {
      utils.sliders.getDestinyScore.invalidate();
      utils.sliders.getLowest3.invalidate();
      utils.sliders.getLatestStates.invalidate();
    },
  });

  const [values, setValues] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  // Build the 3 lowest axes with their data
  const lowestAxes = (lowest3 ?? []).slice(0, 3).map((state: any) => {
    const axis = (axes ?? []).find((a: any) => a.id === state.axisId);
    return {
      axisId: state.axisId,
      value: values[state.axisId] ?? state.value,
      originalValue: state.value,
      leftLabel: axis?.leftLabel ?? "Low",
      rightLabel: axis?.rightLabel ?? "High",
      axisName: axis?.axisName ?? "",
      emoji: axis?.emoji ?? "⚖️",
    };
  });

  const handleSliderChange = useCallback((axisId: number, newValue: number) => {
    setValues(prev => ({ ...prev, [axisId]: newValue }));
    setSaved(prev => ({ ...prev, [axisId]: false }));
  }, []);

  const handleSave = useCallback(async (axisId: number, value: number) => {
    await recordState.mutateAsync({
      axisId,
      value,
      calibrationType: "manual",
    });
    setSaved(prev => ({ ...prev, [axisId]: true }));
  }, [recordState]);

  const handleSaveAll = useCallback(async () => {
    for (const axis of lowestAxes) {
      if (values[axis.axisId] !== undefined && values[axis.axisId] !== axis.originalValue) {
        await recordState.mutateAsync({
          axisId: axis.axisId,
          value: values[axis.axisId],
          calibrationType: "manual",
        });
      }
    }
    onClose();
  }, [lowestAxes, values, recordState, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-card border-t border-border rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t({ en: "Quick Calibrate", pt: "Calibração Rápida", es: "Calibración Rápida" })}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t({ en: "Adjust your 3 lowest axes", pt: "Ajuste seus 3 eixos mais baixos", es: "Ajusta tus 3 ejes más bajos" })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Sliders */}
        <div className="px-5 pb-4 space-y-4">
          {lowestAxes.map((axis) => (
            <div key={axis.axisId} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {axis.emoji} {axis.axisName || `${axis.leftLabel} ↔ ${axis.rightLabel}`}
                </span>
                <span className={`text-xs font-bold tabular-nums ${
                  axis.value < 35 ? "text-red-400" : axis.value < 65 ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {axis.value}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-muted-foreground w-14 text-right truncate">{axis.leftLabel}</span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={axis.value}
                    onChange={(e) => handleSliderChange(axis.axisId, parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
                    style={{
                      background: `linear-gradient(to right, #01D98D ${axis.value}%, hsl(var(--muted)) ${axis.value}%)`,
                    }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground w-14 truncate">{axis.rightLabel}</span>
              </div>
              {saved[axis.axisId] && (
                <p className="text-[10px] text-primary text-center">✓ {t({ en: "Saved", pt: "Salvo", es: "Guardado" })}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 pb-6 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
          </button>
          <button
            onClick={handleSaveAll}
            disabled={recordState.isPending}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {recordState.isPending ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                {t({ en: "Save All", pt: "Salvar Tudo", es: "Guardar Todo" })}
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
