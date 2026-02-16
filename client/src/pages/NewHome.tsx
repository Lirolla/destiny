import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Onboarding } from "@/components/Onboarding";
import { InitialCalibration } from "@/components/InitialCalibration";
import { FirstImpression } from "@/components/FirstImpression";
import { PullToRefresh } from "@/components/PullToRefresh";
import { DoctrineCard } from "@/components/DoctrineCard";
import { QuickCalibrate } from "@/components/QuickCalibrate";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Layers,
  ScrollText,
  Brain,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

/* ── Quick Access Grid Items ────────────────────────────────── */
const QUICK_ACCESS_ITEMS = [
  { Icon: Layers, labelKey: "Sliders", path: "/sliders", bg: "bg-blue-500/10", color: "text-blue-500" },
  { Icon: ScrollText, labelKey: "Philosophy", path: "/philosophy", bg: "bg-emerald-500/10", color: "text-emerald-500" },
  { Icon: Brain, labelKey: "AI Coach", path: "/insights", bg: "bg-sky-500/10", color: "text-sky-500" },
  { Icon: TrendingUp, labelKey: "Progress", path: "/progress", bg: "bg-teal-500/10", color: "text-teal-500" },
  { Icon: Trophy, labelKey: "Badges", path: "/achievements", bg: "bg-yellow-500/10", color: "text-yellow-500" },
  { Icon: Zap, labelKey: "Flashcards", path: "/flashcards", bg: "bg-orange-500/10", color: "text-orange-500" },
];

const quickAccessTranslations: Record<string, { en: string; pt: string; es: string }> = {
  Sliders: { en: "Sliders", pt: "Controles", es: "Controles" },
  Philosophy: { en: "Philosophy", pt: "Filosofia", es: "Filosofía" },
  "AI Coach": { en: "AI Coach", pt: "Coach IA", es: "Coach IA" },
  Progress: { en: "Progress", pt: "Progresso", es: "Progreso" },
  Badges: { en: "Badges", pt: "Medalhas", es: "Insignias" },
  Flashcards: { en: "Flashcards", pt: "Cartões", es: "Tarjetas" },
};

export default function NewHome() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { language, t } = useLanguage();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: todayCycle } = trpc.dailyCycle.getToday.useQuery();
  const { data: axes } = trpc.sliders.listAxes.useQuery();
  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();
  const { data: recentCycles } = trpc.dailyCycle.getHistory.useQuery({ days: 30 });
  const { data: lowest3 } = trpc.sliders.getLowest3.useQuery();

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      utils.dailyCycle.getToday.invalidate(),
      utils.sliders.listAxes.invalidate(),
      utils.sliders.getDestinyScore.invalidate(),
      utils.dailyCycle.getHistory.invalidate(),
      utils.sliders.getLowest3.invalidate(),
    ]);
  }, [utils]);

  /* ── First-time user flow ─────────────────────────────────── */
  const [showFirstImpression, setShowFirstImpression] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInitialCalibration, setShowInitialCalibration] = useState(false);
  const [showQuickCalibrate, setShowQuickCalibrate] = useState(false);

  useEffect(() => {
    if (user) {
      const hasSeenFirstImpression = localStorage.getItem("first_impression_seen");
      const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
      if (!hasSeenFirstImpression) {
        setShowFirstImpression(true);
      } else if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const handleFirstImpressionComplete = () => {
    localStorage.setItem("first_impression_seen", "true");
    setShowFirstImpression(false);
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    const hasCalibrated = localStorage.getItem("initial_calibration_completed");
    if (!hasCalibrated && axes && axes.length > 0) {
      setShowInitialCalibration(true);
    }
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    const hasCalibrated = localStorage.getItem("initial_calibration_completed");
    if (!hasCalibrated && axes && axes.length > 0) {
      setShowInitialCalibration(true);
    }
  };

  const handleCalibrationComplete = () => {
    localStorage.setItem("initial_calibration_completed", "true");
    setShowInitialCalibration(false);
  };

  /* ── Derived data ─────────────────────────────────────────── */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t({ en: "Good Morning", pt: "Bom Dia", es: "Buenos Días" });
    if (hour < 17) return t({ en: "Good Afternoon", pt: "Boa Tarde", es: "Buenas Tardes" });
    return t({ en: "Good Evening", pt: "Boa Noite", es: "Buenas Noches" });
  }, [t]);

  const streak = useMemo(() => {
    if (!recentCycles || recentCycles.length === 0) return 0;
    const sortedCycles = [...recentCycles]
      .filter(c => c.isComplete)
      .sort((a, b) => new Date(b.cycleDate).getTime() - new Date(a.cycleDate).getTime());
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sortedCycles.length; i++) {
      const cycleDate = new Date(sortedCycles[i].cycleDate);
      cycleDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      if (cycleDate.getTime() === expectedDate.getTime()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [recentCycles]);

  const axesCount = axes?.length ?? 15;
  const score = destinyScore?.score ?? 0;

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      {/* Modals — unchanged */}
      {showFirstImpression && (
        <FirstImpression onBegin={handleFirstImpressionComplete} />
      )}
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}
      <QuickCalibrate open={showQuickCalibrate} onClose={() => setShowQuickCalibrate(false)} />
      {showInitialCalibration && (
        <InitialCalibration open={showInitialCalibration} onComplete={handleCalibrationComplete} />
      )}

      <PullToRefresh onRefresh={handleRefresh} className="min-h-screen bg-background">
        <div className="flex flex-col" style={{ minHeight: "calc(100dvh - 64px)" }}>

          {/* ═══ Section 1: HERO ═══ */}
          <div
            className="flex items-center gap-4 px-5 py-4"
            style={{
              background:
                "linear-gradient(160deg, rgba(1,217,141,0.06) 0%, rgba(14,189,202,0.04) 60%, transparent 100%)",
            }}
          >
            {/* Score Ring — 68px, tappable for Quick Calibrate */}
            <button
              onClick={() => setShowQuickCalibrate(true)}
              className="relative w-[68px] h-[68px] flex-shrink-0 active:scale-95 transition-transform"
              aria-label={t({ en: "Quick Calibrate", pt: "Calibração Rápida", es: "Calibración Rápida" })}
            >
              <svg width="68" height="68" className="-rotate-90">
                <circle
                  cx="34" cy="34" r="28"
                  stroke="currentColor"
                  className="text-muted-foreground/15"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="34" cy="34" r="28"
                  stroke="#01D98D"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground leading-none">{score}</span>
                <span className="text-[7px] font-semibold text-muted-foreground mt-0.5 tracking-wide">
                  DESTINY
                </span>
              </div>
            </button>

            {/* Greeting + Stats */}
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-bold text-foreground leading-tight truncate">
                {greeting}, {t({ en: "Captain", pt: "Capitão", es: "Capitán" })}.
              </p>
              <div className="flex gap-3.5 mt-1.5">
                {streak > 0 && (
                  <span className="text-[13px] text-muted-foreground">
                    🔥 <strong className="text-foreground">{streak}</strong> {t({ en: "days", pt: "dias", es: "días" })}
                  </span>
                )}
                <span className="text-[13px] text-muted-foreground">
                  📊 <strong className="text-foreground">{axesCount}</strong> {t({ en: "axes", pt: "eixos", es: "ejes" })}
                </span>
              </div>
            </div>
          </div>

          {/* ═══ Section 2: DOCTRINE OF THE WEEK ═══ */}
          <div className="px-4 pt-1.5">
            <DoctrineCard />
          </div>

          {/* ═══ Section 3: DAILY CYCLE ═══ */}
          <div className="px-4 pt-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted-foreground/60 mb-2 ml-0.5">
              {t({ en: "Daily Cycle", pt: "Ciclo Diário", es: "Ciclo Diario" })}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { emoji: "🌅", label: t({ en: "Morning", pt: "Manhã", es: "Mañana" }), phase: "morning", done: !!todayCycle?.morningCompletedAt },
                { emoji: "☀️", label: t({ en: "Midday", pt: "Meio-dia", es: "Mediodía" }), phase: "midday", done: !!todayCycle?.middayCompletedAt },
                { emoji: "🌙", label: t({ en: "Evening", pt: "Noite", es: "Noche" }), phase: "evening", done: !!todayCycle?.eveningCompletedAt },
              ].map((p) => (
                <Link key={p.phase} href={`/daily-cycle?phase=${p.phase}`}>
                  <div
                    className={`rounded-[14px] py-3 px-1.5 text-center cursor-pointer transition-all active:scale-95 ${
                      p.done
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-card border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                    }`}
                  >
                    <div className="text-[26px] mb-0.5">{p.emoji}</div>
                    <p className="text-[13px] font-semibold text-foreground">{p.label}</p>
                    {p.done ? (
                      <p className="text-[10px] text-primary font-semibold mt-0.5">
                        ✓ {t({ en: "Done", pt: "Feito", es: "Hecho" })}
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        {t({ en: "tap to start", pt: "toque para iniciar", es: "toca para iniciar" })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ═══ Section 4: QUICK ACCESS 2×3 GRID ═══ */}
          <div className="px-4 pt-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted-foreground/60 mb-2 ml-0.5">
              {t({ en: "Quick Access", pt: "Acesso Rápido", es: "Acceso Rápido" })}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {QUICK_ACCESS_ITEMS.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`${item.bg} rounded-[14px] py-4 px-1.5 text-center cursor-pointer border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 transition-transform`}
                  >
                    <item.Icon className={`w-7 h-7 mx-auto mb-1 ${item.color}`} />
                    <p className="text-xs font-semibold text-foreground/80">
                      {t(quickAccessTranslations[item.labelKey])}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ═══ Section 5: INVICTUS QUOTE (flex-1 fills remaining space) ═══ */}
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            <p className="text-[11px] italic text-muted-foreground/30 text-center leading-relaxed">
              "I am the master of my fate, I am the captain of my soul."
            </p>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
}
