import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Onboarding } from "@/components/Onboarding";
import { InitialCalibration } from "@/components/InitialCalibration";
import {
  BookOpen,
  Headphones,
  GraduationCap,
  TrendingUp,
  Flame,
  ChevronRight,
  Play,
  Sparkles,
} from "lucide-react";

export default function NewHome() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: overallProgress } = trpc.progress.getOverallProgress.useQuery();
  const { data: todayCycle } = trpc.dailyCycle.getToday.useQuery();
  const { data: axes } = trpc.sliders.listAxes.useQuery();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInitialCalibration, setShowInitialCalibration] = useState(false);

  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      {showOnboarding && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {showInitialCalibration && (
        <InitialCalibration
          open={showInitialCalibration}
          onComplete={handleCalibrationComplete}
        />
      )}

      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background px-4 pt-6 pb-8">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {greeting()}
                </p>
                <h1 className="text-2xl font-bold mt-0.5">Destiny Hacking</h1>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted/30" />
                  <circle
                    cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - (overallProgress?.overall || 0) / 100)}`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{overallProgress?.overall || 0}%</span>
                </div>
              </div>
            </div>

            {overallProgress && overallProgress.overall > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-primary ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">Continue Learning</p>
                    <p className="text-xs text-muted-foreground">{overallProgress.overall}% complete</p>
                    <Progress value={overallProgress.overall} className="h-1.5 mt-1.5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Main Content Cards */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Learn & Grow</h2>

            <Link href="/audiobook">
              <Card className="overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer border-border/50">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-7 h-7 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">Audiobook</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">14 chapters in English & Portuguese</p>
                    {overallProgress?.audiobook && (
                      <div className="mt-2">
                        <Progress value={overallProgress.audiobook.percent} className="h-1" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {overallProgress.audiobook.completed}/{overallProgress.audiobook.total} chapters
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/book">
              <Card className="overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer border-border/50">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">Read Book</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Interactive PDF with highlights</p>
                    {overallProgress?.pdf && (
                      <div className="mt-2">
                        <Progress value={overallProgress.pdf.percent} className="h-1" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Page {overallProgress.pdf.currentPage}/{overallProgress.pdf.totalPages}
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/modules">
              <Card className="overflow-hidden hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer border-border/50">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">Practice Modules</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">14 interactive learning exercises</p>
                    {overallProgress?.modules && (
                      <div className="mt-2">
                        <Progress value={overallProgress.modules.percent} className="h-1" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {overallProgress.modules.completed}/{overallProgress.modules.total} modules
                        </p>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>
          </div>

          {/* Daily Practice */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Daily Practice</h2>
            <div className="grid grid-cols-3 gap-3">
              <Link href="/daily-cycle?phase=morning">
                <Card className={`p-3 text-center hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer ${todayCycle?.morningCompletedAt ? "bg-primary/10 border-primary/30" : "border-border/50"}`}>
                  <div className="text-2xl mb-1">🌅</div>
                  <p className="text-xs font-medium">Morning</p>
                  <p className="text-[10px] text-muted-foreground">5 min</p>
                  {todayCycle?.morningCompletedAt && (
                    <div className="w-4 h-4 rounded-full bg-primary mx-auto mt-1 flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground">✓</span>
                    </div>
                  )}
                </Card>
              </Link>
              <Link href="/daily-cycle?phase=midday">
                <Card className={`p-3 text-center hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer ${todayCycle?.middayCompletedAt ? "bg-primary/10 border-primary/30" : "border-border/50"}`}>
                  <div className="text-2xl mb-1">☀️</div>
                  <p className="text-xs font-medium">Midday</p>
                  <p className="text-[10px] text-muted-foreground">2 min</p>
                  {todayCycle?.middayCompletedAt && (
                    <div className="w-4 h-4 rounded-full bg-primary mx-auto mt-1 flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground">✓</span>
                    </div>
                  )}
                </Card>
              </Link>
              <Link href="/daily-cycle?phase=evening">
                <Card className={`p-3 text-center hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer ${todayCycle?.eveningCompletedAt ? "bg-primary/10 border-primary/30" : "border-border/50"}`}>
                  <div className="text-2xl mb-1">🌙</div>
                  <p className="text-xs font-medium">Evening</p>
                  <p className="text-[10px] text-muted-foreground">5 min</p>
                  {todayCycle?.eveningCompletedAt && (
                    <div className="w-4 h-4 rounded-full bg-primary mx-auto mt-1 flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground">✓</span>
                    </div>
                  )}
                </Card>
              </Link>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Quick Tools</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/sliders">
                <Card className="p-4 hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sliders</p>
                      <p className="text-[10px] text-muted-foreground">Calibrate state</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/flashcards">
                <Card className="p-4 hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Flashcards</p>
                      <p className="text-[10px] text-muted-foreground">Review concepts</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/achievements">
                <Card className="p-4 hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Achievements</p>
                      <p className="text-[10px] text-muted-foreground">Your badges</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/progress">
                <Card className="p-4 hover:shadow-md active:scale-[0.97] transition-all duration-200 cursor-pointer border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-[10px] text-muted-foreground">Full dashboard</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Today's Intention */}
          {todayCycle?.intendedAction && (
            <Card className="p-4 bg-card/50 border-border/50">
              <div className="flex items-start gap-3">
                <div className="text-lg">🎯</div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Intention</p>
                  <p className="text-sm mt-1">{todayCycle.intendedAction}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
