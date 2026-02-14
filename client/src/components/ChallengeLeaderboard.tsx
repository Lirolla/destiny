import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Flame, Users, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChallengeLeaderboardProps {
  challengeId: number;
}

export function ChallengeLeaderboard({ challengeId }: ChallengeLeaderboardProps) {
  const { data: stats } = trpc.challenges.getStats.useQuery({ challengeId });
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Group Progress", "Progresso do Grupo")}</CardTitle>
          <CardDescription>{t("Loading stats...", "Carregando estatísticas...")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { participants, totalCompletions, averageStreak, topStreak, leaderboard, challengeDays } = stats as any;

  const getRankIcon = (index: number) => {
    if (index === 0) return <span className="text-lg">🥇</span>;
    if (index === 1) return <span className="text-lg">🥈</span>;
    if (index === 2) return <span className="text-lg">🥉</span>;
    return <span className="text-sm text-muted-foreground font-mono w-6 text-center">{index + 1}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {t("Group Progress", "Progresso do Grupo")}
            </CardTitle>
            <CardDescription>{t("Collective accountability metrics", "Métricas coletivas de responsabilidade")}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            {participants} {t("Members", "Membros")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <p className="text-sm font-medium text-muted-foreground">{t("Top Streak", "Maior Sequência")}</p>
            </div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {topStreak} {t("days", "dias")}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <p className="text-sm font-medium text-muted-foreground">{t("Avg Streak", "Sequência Média")}</p>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {typeof averageStreak === 'number' ? averageStreak.toFixed ? averageStreak.toFixed(1) : averageStreak : 0} {t("days", "dias")}
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-muted-foreground">{t("Total Completions", "Total de Conclusões")}</p>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalCompletions}
            </p>
          </div>
        </div>

        {/* Per-Participant Leaderboard */}
        {leaderboard && leaderboard.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {t("Leaderboard", "Ranking")}
            </h4>
            {leaderboard.map((entry: any, index: number) => {
              const isCurrentUser = user && entry.userId === user.id;
              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                    isCurrentUser
                      ? "bg-[#01D98D]/10 border border-[#01D98D]/20"
                      : "bg-muted/20 hover:bg-muted/30"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center shrink-0">
                    {getRankIcon(index)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrentUser ? "text-[#01D98D]" : ""}`}>
                      {entry.displayName}
                      {isCurrentUser && (
                        <span className="text-[10px] ml-1 text-muted-foreground">
                          ({t("you", "você")})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-semibold">{entry.completedDays}d</p>
                      <p className="text-[10px] text-muted-foreground">{t("done", "feito")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {entry.currentStreak}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{t("streak", "seq.")}</p>
                    </div>
                    <div className="w-10 text-right">
                      <p className="text-xs font-bold text-[#01D98D]">{entry.completionRate}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completion Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">{t("Group Completion Rate", "Taxa de Conclusão do Grupo")}</p>
            <p className="text-sm text-muted-foreground">
              {participants > 0 && challengeDays ? Math.round((totalCompletions / (participants * challengeDays)) * 100) : 0}%
            </p>
          </div>
          <Progress 
            value={participants > 0 && challengeDays ? (totalCompletions / (participants * challengeDays)) * 100 : 0} 
            className="h-3"
          />
        </div>

        {/* Privacy Notice */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>{t("Privacy First:", "Privacidade Primeiro:")}</strong> {t(
              "This leaderboard shows collective progress only. Individual emotional states and personal reflections remain private.",
              "Este ranking mostra apenas o progresso coletivo. Estados emocionais individuais e reflexões pessoais permanecem privados."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
