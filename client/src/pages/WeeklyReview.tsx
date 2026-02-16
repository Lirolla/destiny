import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Target, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CauseEffectMap } from "@/components/CauseEffectMap";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Weekly Review Screen
 * 
 * AI-powered pattern recognition and behavioral change tracking.
 * Users generate weekly summaries and track identity shifts.
 */

export default function WeeklyReview() {
  const { t } = useLanguage();
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  const { data: reviews, isLoading } = trpc.weeklyReviews.list.useQuery({ limit: 10 });
  const utils = trpc.useUtils();

  const generateReview = trpc.weeklyReviews.generate.useMutation({
    onSuccess: () => {
      utils.weeklyReviews.list.invalidate();
      setShowGenerator(false);
      setWeekStartDate("");
      setWeekEndDate("");
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekStartDate || !weekEndDate) return;

    generateReview.mutate({
      weekStartDate,
      weekEndDate,
    });
  };

  // Auto-fill current week
  const fillCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    setWeekStartDate(monday.toISOString().split('T')[0]);
    setWeekEndDate(sunday.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Weekly Review", pt: "Revisão Semanal", es: "Revisión Semanal" })} subtitle={t({ en: "Reflect on your week", pt: "Reflita sobre sua semana", es: "Reflexiona sobre tu semana" })} showBack />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Generate New Review */}
        {!showGenerator ? (
          <Card className="p-8 mb-8 text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t({ en: "Generate Weekly Review", pt: "Gerar Revisão Semanal", es: "Generar Revisión Semanal" })}</h2>
            <p className="text-muted-foreground mb-6">
              {t({ en: "AI analyzes your emotional patterns, daily cycles, and behavioral changes", pt: "A IA analisa seus padrões emocionais, ciclos diários e mudanças de comportamento", es: "La IA analiza tus patrones emocionales, ciclos diarios y cambios de comportamiento" })}
            </p>
            <Button onClick={() => { setShowGenerator(true); fillCurrentWeek(); }} size="lg">
              {t({ en: "Generate This Week's Review", pt: "Gerar Revisão Desta Semana", es: "Generar Revisión de Esta Semana" })}
            </Button>
          </Card>
        ) : (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t({ en: "New Weekly Review", pt: "Nova Revisão Semanal", es: "Nueva Revisión Semanal" })}</h2>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weekStartDate">{t({ en: "Week Start (Monday)", pt: "Início da Semana (Segunda-feira)", es: "Inicio de Semana (Lunes)" })}</Label>
                  <Input
                    id="weekStartDate"
                    type="date"
                    value={weekStartDate}
                    onChange={(e) => setWeekStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weekEndDate">{t({ en: "Week End (Sunday)", pt: "Fim da Semana (Domingo)", es: "Fin de Semana (Domingo)" })}</Label>
                  <Input
                    id="weekEndDate"
                    type="date"
                    value={weekEndDate}
                    onChange={(e) => setWeekEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t({ en: "The AI will analyze your slider calibrations, daily cycle completions, and insights from this time period to identify patterns and suggest adjustments.", pt: "A IA analisará suas calibrações de controle deslizante, conclusões de ciclo diário e insights deste período para identificar padrões e sugerir ajustes.", es: "La IA analizará las calibraciones de tus controles deslizantes, las finalizaciones de los ciclos diarios y los conocimientos de este período para identificar patrones y sugerir ajustes." })}
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={generateReview.isPending}>
                  {generateReview.isPending ? t({ en: "Generating...", pt: "Gerando...", es: "Generando..." }) : t({ en: "Generate Review", pt: "Gerar Revisão", es: "Generar Revisión" })}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowGenerator(false)}>
                  {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t({ en: "Past Reviews", pt: "Revisões Anteriores", es: "Revisiones Anteriores" })}</h2>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t({ en: "Loading reviews...", pt: "Carregando revisões...", es: "Cargando revisiones..." })}</p>
            </div>
          )}

          {reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {!isLoading && reviews?.length === 0 && !showGenerator && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {t({ en: "No reviews yet. Generate your first weekly review to track patterns.", pt: "Nenhuma revisão ainda. Gere sua primeira revisão semanal para acompanhar os padrões.", es: "Aún no hay revisiones. Genera tu primera revisión semanal para seguir los patrones." })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReviewCardProps {
  review: any;
}

function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useLanguage();
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [identityShiftOld, setIdentityShiftOld] = useState(review.identityShiftOld || "");
  const [identityShiftNew, setIdentityShiftNew] = useState(review.identityShiftNew || "");

  const utils = trpc.useUtils();
  const updateIdentity = trpc.weeklyReviews.updateIdentityShift.useMutation({
    onSuccess: () => {
      utils.weeklyReviews.list.invalidate();
      setShowIdentityForm(false);
    },
  });

  const handleSubmitIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateIdentity.mutate({
      reviewId: review.id,
      identityShiftOld,
      identityShiftNew,
    });
  };

  const weekStart = new Date(review.weekStartDate).toLocaleDateString();
  const weekEnd = new Date(review.weekEndDate).toLocaleDateString();

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-bold text-lg">{t({ en: `Week of ${weekStart}`, pt: `Semana de ${weekStart}`, es: `Semana del ${weekStart}` })}</h3>
            <p className="text-sm text-muted-foreground">{weekStart} - {weekEnd}</p>
          </div>
        </div>
        <Badge variant="secondary">
          {t({ en: `${review.completionRate}% Complete`, pt: `${review.completionRate}% Completo`, es: `${review.completionRate}% Completo` })}
        </Badge>
      </div>

      {/* Pattern Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="font-bold">{t({ en: "Pattern Summary", pt: "Resumo de Padrões", es: "Resumen de Patrones" })}</h4>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-foreground whitespace-pre-wrap">{review.patternSummary}</p>
        </div>
      </div>

      {/* Behavioral Metrics */}
      {review.behavioralMetrics && (
        <div className="mb-6">
          <h4 className="font-bold mb-3">{t({ en: "Behavioral Metrics", pt: "Métricas Comportamentais", es: "Métricas de Comportamiento" })}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(review.behavioralMetrics as Record<string, any>).map(([key, value]) => (
              <div key={key} className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm font-semibold text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-lg font-bold">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cause-Effect Map */}
      <CauseEffectSection
        weekStartDate={review.weekStartDate}
        weekEndDate={review.weekEndDate}
        patternSummary={review.patternSummary}
      />

      {/* Adjustment Recommendations */}
      {review.adjustmentRecommendations && (
        <div className="mb-6">
          <h4 className="font-bold mb-3">{t({ en: "Recommendations", pt: "Recomendações", es: "Recomendaciones" })}</h4>
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-foreground whitespace-pre-wrap">{review.adjustmentRecommendations}</p>
          </div>
        </div>
      )}

      {/* Identity Shift */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h4 className="font-bold">{t({ en: "Identity Shift", pt: "Mudança de Identidade", es: "Cambio de Identidad" })}</h4>
        </div>

        {!review.identityShiftOld && !showIdentityForm && (
          <Button onClick={() => setShowIdentityForm(true)} variant="outline" size="sm">
            {t({ en: "Record Identity Shift", pt: "Registrar Mudança de Identidade", es: "Registrar Cambio de Identidad" })}
          </Button>
        )}

        {showIdentityForm && (
          <form onSubmit={handleSubmitIdentity} className="space-y-4">
            <div>
              <Label htmlFor="identityShiftOld">{t({ en: "Old Identity (Who I was)", pt: "Identidade Antiga (Quem eu era)", es: "Identidad Antigua (Quién era yo)" })}</Label>
              <Input
                id="identityShiftOld"
                value={identityShiftOld}
                onChange={(e) => setIdentityShiftOld(e.target.value)}
                placeholder={t({ en: "e.g., Reactive victim", pt: "ex: Vítima reativa", es: "ej: Víctima reactiva" })}
                required
              />
            </div>
            <div>
              <Label htmlFor="identityShiftNew">{t({ en: "New Identity (Who I'm becoming)", pt: "Nova Identidade (Quem estou me tornando)", es: "Nueva Identidad (En quién me estoy convirtiendo)" })}</Label>
              <Input
                id="identityShiftNew"
                value={identityShiftNew}
                onChange={(e) => setIdentityShiftNew(e.target.value)}
                placeholder={t({ en: "e.g., Intentional creator", pt: "ex: Criador intencional", es: "ej: Creador intencional" })}
                required
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" size="sm" disabled={updateIdentity.isPending}>
                {updateIdentity.isPending ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." }) : t({ en: "Save Identity Shift", pt: "Salvar Mudança de Identidade", es: "Guardar Cambio de Identidad" })}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowIdentityForm(false)}>
                {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
              </Button>
            </div>
          </form>
        )}

        {review.identityShiftOld && (
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{t({ en: "From", pt: "De", es: "De" })}</p>
              <p className="font-semibold">{review.identityShiftOld}</p>
            </div>
            <div className="text-2xl text-primary">→</div>
            <div className="flex-1 bg-primary/10 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{t({ en: "To", pt: "Para", es: "A" })}</p>
              <p className="font-semibold">{review.identityShiftNew}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

/** Fetches cycles for the review period and renders the CauseEffectMap */
function CauseEffectSection({
  weekStartDate,
  weekEndDate,
  patternSummary,
}: {
  weekStartDate: string;
  weekEndDate: string;
  patternSummary?: string;
}) {
  const { t } = useLanguage();
  const { data: cycles, isLoading } = trpc.weeklyReviews.getCycles.useQuery(
    { weekStartDate, weekEndDate },
    { staleTime: 60_000 }
  );

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!cycles || cycles.length === 0) return null;

  return (
    <div className="mb-6">
      <CauseEffectMap cycles={cycles} patterns={patternSummary} />
    </div>
  );
}
