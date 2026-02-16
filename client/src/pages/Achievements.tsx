import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeShowcase } from "@/components/BadgeShowcase";
import { BADGE_DEFINITIONS, type BadgeType } from "@/lib/badges";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Achievements() {
  const { t } = useLanguage();

  // TODO: Implement achievements backend
  // For now, use mock data
  const achievements: Array<{ badgeType: string }> = [];
  const achievementsLoading = false;

  if (achievementsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">{t({ en: "Loading achievements...", pt: "Carregando conquistas...", es: "Cargando logros..." })}</p>
        </div>
      </div>
    );
  }

  const unlockedBadges = (achievements || []).map((a: any) => a.badgeType as BadgeType);
  const allBadges = Object.keys(BADGE_DEFINITIONS) as BadgeType[];
  const unlockedCount = unlockedBadges.length;
  const totalCount = allBadges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Group badges by category
  const categories = {
    calibration: allBadges.filter(b => BADGE_DEFINITIONS[b].category === "calibration"),
    streak: allBadges.filter(b => BADGE_DEFINITIONS[b].category === "streak"),
    learning: allBadges.filter(b => BADGE_DEFINITIONS[b].category === "learning"),
    social: allBadges.filter(b => BADGE_DEFINITIONS[b].category === "social"),
    insight: allBadges.filter(b => BADGE_DEFINITIONS[b].category === "insight"),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Achievements", pt: "Conquistas", es: "Logros" })} subtitle={t({ en: "Badges & milestones earned", pt: "Emblemas e marcos ganhos", es: "Insignias e hitos ganados" })} showBack />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>{t({ en: "Overall Progress", pt: "Progresso Geral", es: "Progreso General" })}</CardTitle>
            <CardDescription>
              {t({ en: `${unlockedCount} of ${totalCount} badges unlocked`, pt: `${unlockedCount} de ${totalCount} emblemas desbloqueados`, es: `${unlockedCount} de ${totalCount} insignias desbloqueadas` })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={completionPercentage} className="flex-1" />
              <span className="text-2xl font-bold">{completionPercentage}%</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
                <div className="text-xs text-muted-foreground">{t({ en: "Unlocked", pt: "Desbloqueado", es: "Desbloqueado" })}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">{totalCount - unlockedCount}</div>
                <div className="text-xs text-muted-foreground">{t({ en: "Locked", pt: "Bloqueado", es: "Bloqueado" })}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {unlockedBadges.filter((b: BadgeType) => BADGE_DEFINITIONS[b].rarity === "common").length}
                </div>
                <div className="text-xs text-muted-foreground">{t({ en: "Common", pt: "Comum", es: "Común" })}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {unlockedBadges.filter((b: BadgeType) => BADGE_DEFINITIONS[b].rarity === "rare").length}
                </div>
                <div className="text-xs text-muted-foreground">{t({ en: "Rare", pt: "Raro", es: "Raro" })}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">
                  {unlockedBadges.filter((b: BadgeType) => BADGE_DEFINITIONS[b].rarity === "epic").length}
                </div>
                <div className="text-xs text-muted-foreground">{t({ en: "Epic", pt: "Épico", es: "Épico" })}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calibration Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{t({ en: "📊 Calibration Badges", pt: "📊 Emblemas de Calibração", es: "📊 Insignias de Calibración" })}</h2>
            <span className="text-sm text-muted-foreground">
              ({categories.calibration.filter(b => unlockedBadges.includes(b)).length}/{categories.calibration.length})
            </span>
          </div>
          <BadgeShowcase
            unlockedBadges={unlockedBadges}
            allBadges={categories.calibration}
            showLocked={true}
          />
        </section>

        {/* Streak Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{t({ en: "🔥 Streak Badges", pt: "🔥 Emblemas de Sequência", es: "🔥 Insignias de Racha" })}</h2>
            <span className="text-sm text-muted-foreground">
              ({categories.streak.filter(b => unlockedBadges.includes(b)).length}/{categories.streak.length})
            </span>
          </div>
          <BadgeShowcase
            unlockedBadges={unlockedBadges}
            allBadges={categories.streak}
            showLocked={true}
          />
        </section>

        {/* Learning Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{t({ en: "📚 Learning Badges", pt: "📚 Emblemas de Aprendizagem", es: "📚 Insignias de Aprendizaje" })}</h2>
            <span className="text-sm text-muted-foreground">
              ({categories.learning.filter(b => unlockedBadges.includes(b)).length}/{categories.learning.length})
            </span>
          </div>
          <BadgeShowcase
            unlockedBadges={unlockedBadges}
            allBadges={categories.learning}
            showLocked={true}
          />
        </section>

        {/* Social Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{t({ en: "👥 Social Badges", pt: "👥 Emblemas Sociais", es: "👥 Insignias Sociales" })}</h2>
            <span className="text-sm text-muted-foreground">
              ({categories.social.filter(b => unlockedBadges.includes(b)).length}/{categories.social.length})
            </span>
          </div>
          <BadgeShowcase
            unlockedBadges={unlockedBadges}
            allBadges={categories.social}
            showLocked={true}
          />
        </section>

        {/* Insight Badges */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{t({ en: "💡 Insight Badges", pt: "💡 Emblemas de Insight", es: "💡 Insignias de Insight" })}</h2>
            <span className="text-sm text-muted-foreground">
              ({categories.insight.filter(b => unlockedBadges.includes(b)).length}/{categories.insight.length})
            </span>
          </div>
          <BadgeShowcase
            unlockedBadges={unlockedBadges}
            allBadges={categories.insight}
            showLocked={true}
          />
        </section>
      </main>
    </div>
  );
}
