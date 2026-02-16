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
import { DoctrineCard } from "@/components/DoctrineCard";
import { DestinyScoreExport } from "@/components/DestinyScoreExport";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();
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
    if (hour < 12) return t({ en: "Good Morning", pt: "Bom Dia", es: "Buenos Días" });
    if (hour < 17) return t({ en: "Good Afternoon", pt: "Boa Tarde", es: "Buenas Tardes" });
    return t({ en: "Good Evening", pt: "Boa Noite", es: "Buenas Noches" });
  }, [t]);

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
      <PageHeader title={t({ en: "Command Bridge", pt: "Ponte de Comando", es: "Puente de Mando" })} subtitle={t({ en: "Master your free will", pt: "Domine seu livre arbítrio", es: "Domina tu libre albedrío" })} showBack />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Mission Briefing Greeting */}
        <div className="px-1 py-2">
          <h2 className="text-xl font-bold">
            {greeting}, Captain.
          </h2>
          {destinyScore?.score !== null && destinyScore?.score !== undefined ? (
            <p className="text-sm text-muted-foreground mt-1">
              {t({ en: "Your Free Will is operating at", pt: "Seu Livre Arbítrio está operando em", es: "Tu Libre Albedrío está operando al" })} <strong className="text-primary">{destinyScore.score}%</strong>.
              {streak > 0 && <> {t({ en: "Day", pt: "Dia", es: "Día" })} <strong className="text-primary">{streak}</strong> {t({ en: "of your streak.", pt: "da sua sequência.", es: "de tu racha." })}</>}
              {lowestAxis && <> {t({ en: "Your lowest axis today is", pt: "Seu eixo mais baixo hoje é", es: "Tu eje más bajo hoy es" })} {(lowestAxis as any).emoji} <strong>{(lowestAxis as any).rightLabel}</strong> — {t({ en: "what will you do about it?", pt: "o que você fará a respeito?", es: "¿qué harás al respecto?" })}</>}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              {t({ en: "Begin your journey to becoming the captain of your soul.", pt: "Comece sua jornada para se tornar o capitão de sua alma.", es: "Comienza tu viaje para convertirte en el capitán de tu alma." })}
            </p>
          )}
        </div>

        {/* Doctrine of the Week */}
        <DoctrineCard />

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
                    — {(lowestAxis as any).name || `${(lowestAxis as any).leftLabel} ↔ ${(lowestAxis as any).rightLabel}`} · {t({ en: "Score", pt: "Pontuação", es: "Puntuación" })}: {(lowestAxis as any).value}/100
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
                      <p className="font-medium text-sm">{t({ en: "Morning Calibration Awaits", pt: "Calibração Matinal Aguarda", es: "Calibración Matutina Pendiente" })}</p>
                      <p className="text-xs text-muted-foreground">{t({ en: "Start your day by calibrating all 15 axes", pt: "Comece seu dia calibrando todos os 15 eixos", es: "Empieza tu día calibrando los 15 ejes" })}</p>
                    </div></>
                  )}
                  {checkInStatus.period === 'midday' && checkInStatus.morningDone && !checkInStatus.middayDone && (
                    <><Target className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{t({ en: "Midday Focus Time", pt: "Momento de Foco do Meio-dia", es: "Tiempo de Enfoque de Mediodía" })}</p>
                      <p className="text-xs text-muted-foreground">{t({ en: "Recalibrate your 3 lowest axes & commit to action", pt: "Recalibre seus 3 eixos mais baixos e comprometa-se com a ação", es: "Recalibra tus 3 ejes más bajos y comprométete a la acción" })}</p>
                    </div></>
                  )}
                  {checkInStatus.period === 'evening' && checkInStatus.middayDone && !checkInStatus.eveningDone && (
                    <><Moon className="h-6 w-6 text-indigo-400" />
                    <div>
                      <p className="font-medium text-sm">{t({ en: "Evening Reflection", pt: "Reflexão Noturna", es: "Reflexión Nocturna" })}</p>
                      <p className="text-xs text-muted-foreground">{t({ en: "Map cause-effect and complete your cycle", pt: "Mapeie causa-efeito e complete seu ciclo", es: "Mapa causa-efecto y completa tu ciclo" })}</p>
                    </div></>
                  )}
                  {!checkInStatus.cycleExists && (
                    <><Sun className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-medium text-sm">{t({ en: "Start Today's Cycle", pt: "Comece o Ciclo de Hoje", es: "Comenzar el Ciclo de Hoy" })}</p>
                      <p className="text-xs text-muted-foreground">{t({ en: "Begin with your morning calibration", pt: "Comece com sua calibração matinal", es: "Empieza con tu calibración matutina" })}</p>
                    </div></>
                  )}
                </div>
                <Button size="sm" asChild>
                  <Link href="/daily-cycle">{t({ en: "Go", pt: "Ir", es: "Ir" })}</Link>
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
                  <CardTitle className="text-lg">{t({ en: "Destiny Score", pt: "Pontuação de Destino", es: "Puntuación de Destino" })}</CardTitle>
                  <CardDescription>{t({ en: "Your overall free will mastery", pt: "Seu domínio geral do livre arbítrio", es: "Tu dominio general del libre albedrío" })}</CardDescription>
                </div>
                <div className="text-3xl font-bold text-primary">{destinyScore.score}%</div>
              </div>
            </CardHeader>
            <CardContent>
              <DestinyRadarChart axes={axes} currentStates={latestStates} height={280} />
              <div className="flex justify-end mt-4">
                <DestinyScoreExport />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t({ en: "Your Progress", pt: "Seu Progresso", es: "Tu Progreso" })}</h2>
          <ShareProgress
            summary={{
              weekStreak: streak,
              totalCalibrations: latestStates?.length || 0,
              modulesCompleted: modulesCompleted,
              cyclesCompleted: recentCycles?.filter(c => c.isComplete).length || 0,
              destinyScore: destinyScore?.score ?? undefined,
              topAxis: axes && axes.length > 0 ? `${axes[0].leftLabel} ↔ ${axes[0].rightLabel}` : undefined,
              improvement: streak >= 7 ? `${streak}-day streak maintained!` : undefined,
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t({ en: "Daily Streak", pt: "Sequência Diária", es: "Racha Diaria" })}</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{t({ en: `${streak} days`, pt: `${streak} dias`, es: `${streak} días` })}</div>
              <p className="text-xs text-muted-foreground">
                {streak > 0 ? t({ en: "Keep going!", pt: "Continue assim!", es: "¡Sigue así!" }) : t({ en: "Start today", pt: "Comece hoje", es: "Empieza hoy" })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t({ en: "Emotional Axes", pt: "Eixos Emocionais", es: "Ejes Emocionales" })}</CardTitle>
              <Gauge className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{axes?.length || 0}</div>
              <p className="text-xs text-muted-foreground">{t({ en: "Total Axes", pt: "Eixos Totais", es: "Ejes Totales" })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t({ en: "Modules Completed", pt: "Módulos Concluídos", es: "Módulos Completados" })}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{modulesCompleted}</div>
              <p className="text-xs text-muted-foreground">{t({ en: "Keep learning", pt: "Continue aprendendo", es: "Sigue aprendiendo" })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t({ en: "Cycles Completed", pt: "Ciclos Concluídos", es: "Ciclos Completados" })}</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentCycles?.filter(c => c.isComplete).length || 0}</div>
              <p className="text-xs text-muted-foreground">{t({ en: "In the last 30 days", pt: "Nos últimos 30 dias", es: "En los últimos 30 días" })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/daily-cycle">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-4">
                    <Sun className="h-6 w-6 mb-2 text-amber-500" />
                    <span className="text-center text-sm font-medium">{t({ en: "Daily Cycle", pt: "Ciclo Diário", es: "Ciclo Diario" })}</span>
                </Button>
            </Link>
            <Link href="/axes">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-4">
                    <Gauge className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-center text-sm font-medium">{t({ en: "View All Axes", pt: "Ver Todos os Eixos", es: "Ver Todos los Ejes" })}</span>
                </Button>
            </Link>
            <Link href="/modules">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-4">
                    <Brain className="h-6 w-6 mb-2 text-teal-500" />
                    <span className="text-center text-sm font-medium">{t({ en: "Explore Modules", pt: "Explorar Módulos", es: "Explorar Módulos" })}</span>
                </Button>
            </Link>
            <Link href="/community">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-4">
                    <Users className="h-6 w-6 mb-2 text-rose-500" />
                    <span className="text-center text-sm font-medium">{t({ en: "Community", pt: "Comunidade", es: "Comunidad" })}</span>
                </Button>
            </Link>
        </div>

        {/* Recent Insights */}
        {insights && insights.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t({ en: "Recent Insights", pt: "Insights Recentes", es: "Perspectivas Recientes" })}</CardTitle>
                  <CardDescription>{t({ en: "Your latest learnings from calibration", pt: "Seus últimos aprendizados da calibração", es: "Tus últimos aprendizajes de la calibración" })}</CardDescription>
                </div>
                {unreadInsights > 0 && (
                  <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {t({ en: `${unreadInsights} New`, pt: `${unreadInsights} Novos`, es: `${unreadInsights} Nuevos` })}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights.map(insight => (
                  <li key={insight.id}>
                    <Link href={`/insights/${insight.id}`}>
                      <div className={`p-3 rounded-lg transition-colors ${insight.isRead ? 'bg-secondary/50' : 'bg-primary/10 hover:bg-primary/20'}`}>
                        <div className="flex items-center justify-between">
                          <p className={`font-medium text-sm ${!insight.isRead && 'text-primary'}`}>{insight.title}</p>
                          {!insight.isRead && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(insight.createdAt).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/insights">{t({ en: "View All Insights", pt: "Ver Todos os Insights", es: "Ver Todas las Perspectivas" })}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 30-Day History */}
        {recentCycles && recentCycles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "30-Day Calibration History", pt: "Histórico de Calibração de 30 Dias", es: "Historial de Calibración de 30 Días" })}</CardTitle>
              <CardDescription>{t({ en: "Your progress over the last month", pt: "Seu progresso no último mês", es: "Tu progreso durante el último mes" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <SliderHistoryChart />
            </CardContent>
          </Card>
        )}

        {/* Settings Link */}
        <Card className="mt-6">
          <CardContent className="py-4">
            <Link href="/settings">
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t({ en: "Settings", pt: "Configurações", es: "Ajustes" })}</p>
                    <p className="text-sm text-muted-foreground">{t({ en: "Fine-tune your Destiny Hacking experience.", pt: "Ajuste sua experiência no Destiny Hacking.", es: "Ajusta tu experiencia en Destiny Hacking." })}</p>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <InvictusFooter />
      </main>
    </div>
  );
}
