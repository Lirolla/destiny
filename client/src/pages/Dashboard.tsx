import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Calendar, Brain, Users, TrendingUp, CheckCircle2, Flame, Settings, Sun, Clock, Moon, Target } from "lucide-react";
import { SliderHistoryChart } from "@/components/SliderHistoryChart";
import { ShareProgress } from "@/components/ShareProgress";
import type { ProgressSummary } from "@/lib/socialShare";
import { PageHeader } from "@/components/PageHeader";
import { DestinyRadarChart } from "@/components/DestinyRadarChart";
import { InvictusFooter } from "@/components/InvictusFooter";

export default function Dashboard() {
  // Guest users are auto-created

  // Fetch data
  const { data: todayCycle } = trpc.dailyCycle.getToday.useQuery(undefined, {
    
  });

  const { data: recentCycles } = trpc.dailyCycle.getHistory.useQuery(
    { days: 30 },
    {  }
  );

  const { data: axes } = trpc.sliders.listAxes.useQuery(undefined, {
    
  });

  const { data: latestStates } = trpc.sliders.getLatestStates.useQuery(undefined, {
    
  });

  const { data: insights } = trpc.insights.list.useQuery(
    { limit: 5 },
    {  }
  );

  const { data: destinyScore } = trpc.sliders.getDestinyScore.useQuery();
  const { data: checkInStatus } = trpc.sliders.getCheckInStatus.useQuery();
  const { data: modulesList } = trpc.modules.list.useQuery();
  const { data: lowest3 } = trpc.sliders.getLowest3.useQuery();

  const modulesCompleted = useMemo(() => {
    if (!modulesList) return 0;
    return modulesList.filter((m: any) => m.status === 'completed').length;
  }, [modulesList]);

  // Get the lowest axis for Reflection Prompt of the Day
  const lowestAxis = useMemo(() => {
    if (!lowest3 || lowest3.length === 0 || !axes) return null;
    const lowestState = lowest3[0];
    const axis = axes.find((a: any) => a.id === lowestState.axisId);
    if (!axis) return null;
    return { ...axis, value: lowestState.value };
  }, [lowest3, axes]);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Calculate streak
  const calculateStreak = () => {
    if (!recentCycles || recentCycles.length === 0) return 0;
    
    const sortedCycles = [...recentCycles]
      .filter(c => c.isComplete)
      .sort((a, b) => new Date(b.cycleDate).getTime() - new Date(a.cycleDate).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedCycles.length; i++) {
      const cycleDate = new Date(sortedCycles[i].cycleDate);
      cycleDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (cycleDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();
  const unreadInsights = insights?.filter(i => !i.isRead).length || 0;



  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Command Bridge" subtitle="Master your free will" showBack />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Mission Briefing Greeting */}
        <div className="px-1 py-2">
          <h2 className="text-xl font-bold">
            {greeting}, Captain.
          </h2>
          {destinyScore?.score !== null && destinyScore?.score !== undefined ? (
            <p className="text-sm text-muted-foreground mt-1">
              Your Free Will is operating at <strong className="text-primary">{destinyScore.score}%</strong>.
              {streak > 0 && <> Day <strong className="text-primary">{streak}</strong> of your streak.</>}
              {lowestAxis && <> Your lowest axis today is {(lowestAxis as any).emoji} <strong>{(lowestAxis as any).rightLabel}</strong> — what will you do about it?</>}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Begin your journey to becoming the captain of your soul.
            </p>
          )}
        </div>

        {/* Reflection Prompt of the Day */}
        {lowestAxis && (lowestAxis as any).reflectionPrompt && (
          <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{(lowestAxis as any).emoji}</span>
                <div>
                  <p className="text-sm italic text-foreground leading-relaxed">
                    "{(lowestAxis as any).reflectionPrompt}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    — {(lowestAxis as any).name || `${(lowestAxis as any).leftLabel} ↔ ${(lowestAxis as any).rightLabel}`} · Score: {(lowestAxis as any).value}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Check-In Prompt Banner */}
        {checkInStatus && !checkInStatus.isComplete && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {checkInStatus.period === 'morning' && !checkInStatus.morningDone && (
                    <><Sun className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-medium text-sm">Morning Calibration Awaits</p>
                      <p className="text-xs text-muted-foreground">Start your day by calibrating all 15 axes</p>
                    </div></>
                  )}
                  {checkInStatus.period === 'midday' && checkInStatus.morningDone && !checkInStatus.middayDone && (
                    <><Target className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Midday Focus Time</p>
                      <p className="text-xs text-muted-foreground">Recalibrate your 3 lowest axes & commit to action</p>
                    </div></>
                  )}
                  {checkInStatus.period === 'evening' && checkInStatus.middayDone && !checkInStatus.eveningDone && (
                    <><Moon className="h-6 w-6 text-indigo-400" />
                    <div>
                      <p className="font-medium text-sm">Evening Reflection</p>
                      <p className="text-xs text-muted-foreground">Map cause-effect and complete your cycle</p>
                    </div></>
                  )}
                  {!checkInStatus.cycleExists && (
                    <><Sun className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-medium text-sm">Start Today's Cycle</p>
                      <p className="text-xs text-muted-foreground">Begin with your morning calibration</p>
                    </div></>
                  )}
                </div>
                <Button size="sm" asChild>
                  <Link href="/daily-cycle">Go</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Destiny Score + Radar */}
        {destinyScore?.score !== null && destinyScore?.score !== undefined && axes && latestStates && latestStates.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Destiny Score</CardTitle>
                  <CardDescription>Your overall free will mastery</CardDescription>
                </div>
                <div className="text-3xl font-bold text-primary">{destinyScore.score}%</div>
              </div>
            </CardHeader>
            <CardContent>
              <DestinyRadarChart axes={axes} currentStates={latestStates} height={280} />
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <ShareProgress
            summary={{
              weekStreak: streak,
              totalCalibrations: latestStates?.length || 0,
              modulesCompleted: modulesCompleted,
              cyclesCompleted: recentCycles?.filter(c => c.isComplete).length || 0,
              topAxis: axes && axes.length > 0 ? `${axes[0].leftLabel} ↔ ${axes[0].rightLabel}` : undefined,
              improvement: streak >= 7 ? `${streak}-day streak maintained!` : undefined,
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} days</div>
              <p className="text-xs text-muted-foreground">
                {streak > 0 ? "Keep going!" : "Start today"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Emotional Axes</CardTitle>
              <Gauge className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{axes?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active dimensions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Cycles</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentCycles?.filter(c => c.isComplete).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Insights</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadInsights}</div>
              <p className="text-xs text-muted-foreground">
                Unread observations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Cycle Status */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Practice</CardTitle>
            <CardDescription>Your daily will cycle progress</CardDescription>
          </CardHeader>
          <CardContent>
            {!todayCycle ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">You haven't started today's cycle yet.</p>
                <Button asChild>
                  <Link href="/daily-cycle">Start Morning Calibration</Link>
                </Button>
              </div>
            ) : todayCycle.isComplete ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium">Today's cycle complete!</p>
                  <p className="text-sm text-muted-foreground">
                    You've operationalized your free will today.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/insights">View Insights</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex-1 h-2 rounded-full ${todayCycle.morningCompletedAt ? 'bg-primary' : 'bg-muted'}`} />
                  <div className={`flex-1 h-2 rounded-full ${todayCycle.middayCompletedAt ? 'bg-primary' : 'bg-muted'}`} />
                  <div className={`flex-1 h-2 rounded-full ${todayCycle.eveningCompletedAt ? 'bg-primary' : 'bg-muted'}`} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className={todayCycle.morningCompletedAt ? 'text-primary' : 'text-muted-foreground'}>
                    Morning ✓
                  </span>
                  <span className={todayCycle.middayCompletedAt ? 'text-primary' : 'text-muted-foreground'}>
                    Midday {todayCycle.middayCompletedAt ? '✓' : ''}
                  </span>
                  <span className={todayCycle.eveningCompletedAt ? 'text-primary' : 'text-muted-foreground'}>
                    Evening {todayCycle.eveningCompletedAt ? '✓' : ''}
                  </span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/daily-cycle">Continue Cycle</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emotional State Overview */}
        {latestStates && latestStates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Current Emotional State</CardTitle>
              <CardDescription>Latest calibrations across all axes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestStates.map((state) => {
                  const axis = axes?.find(a => a.id === state.axisId);
                  if (!axis) return null;

                  return (
                    <div key={state.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {axis.leftLabel} ← → {axis.rightLabel}
                        </span>
                        <span className="text-primary font-bold">{state.value}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${state.value}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(state.clientTimestamp).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emotional Trends Chart */}
        <SliderHistoryChart />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/sliders">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Emotional Sliders</CardTitle>
                <CardDescription className="text-xs">
                  Calibrate your current state
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/daily-cycle">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Daily Cycle</CardTitle>
                <CardDescription className="text-xs">
                  Morning → Midday → Evening
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/insights">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">AI Insights</CardTitle>
                <CardDescription className="text-xs">
                  Pattern analysis & strategy
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/inner-circle">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Inner Circle</CardTitle>
                <CardDescription className="text-xs">
                  Connections & accountability
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/monthly-report">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Monthly Report</CardTitle>
                <CardDescription className="text-xs">
                  Before & after comparison
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Settings</CardTitle>
                <CardDescription className="text-xs">
                  Notifications & preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Insights */}
        {insights && insights.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Insights</CardTitle>
                  <CardDescription>AI-generated observations</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/insights">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{insight.title}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {insight.content}
                        </p>
                      </div>
                      {!insight.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <InvictusFooter />
    </div>
  );
}
