import { useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Circle, ArrowLeft, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Module Detail Page
 * 
 * Individual module learning interface with:
 * - Module content display
 * - Practice day tracking
 * - Challenge completion
 * - Reflection entries
 */

export default function ModuleDetail() {
  const { t } = useLanguage();
  const [, params] = useRoute("/modules/:id");
  const moduleId = params?.id ? parseInt(params.id) : 0;

  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");

  const { data: module, isLoading } = trpc.modules.getById.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );

  const utils = trpc.useUtils();

  const completeDay = trpc.modules.complete.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      utils.modules.list.invalidate();
    },
  });

  const completeChallenge = trpc.modules.completeChallenge.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      utils.modules.list.invalidate();
    },
  });

  const addReflection = trpc.modules.saveReflection.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      setShowReflection(false);
      setReflectionText("");
    },
  });

  const handleCompleteDay = (dayNumber: number) => {
    completeDay.mutate({ moduleId });
  };

  const handleCompleteChallenge = () => {
    completeChallenge.mutate({ moduleId });
  };

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    addReflection.mutate({
      moduleId,
      reflection: reflectionText,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">{t({ en: "Loading module...", pt: "Carregando módulo...", es: "Cargando módulo..." })}</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">{t({ en: "Module Not Found", pt: "Módulo Não Encontrado", es: "Módulo No Encontrado" })}</h2>
          <p className="text-muted-foreground mb-6">
            {t({ en: "The module you're looking for doesn't exist.", pt: "O módulo que você está procurando não existe.", es: "El módulo que estás buscando no existe." })}
          </p>
          <Button asChild>
            <Link href="/modules">{t({ en: "← Back to Learning Path", pt: "← Voltar para a Trilha de Aprendizagem", es: "← Volver al Camino de Aprendizaje" })}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (module as any).progress || { completedDays: 0, challengeCompleted: false, reflections: [] };
  const totalDays = (module as any).practiceDays || 7;
  const completionPercentage = (progress.completedDays / totalDays) * 100;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Module Detail", pt: "Detalhe do Módulo", es: "Detalle del Módulo" })} subtitle={t({ en: "Interactive learning", pt: "Aprendizagem interativa", es: "Aprendizaje interactivo" })} showBack />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Progress Overview */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t({ en: "Your Progress", pt: "Seu Progresso", es: "Tu Progreso" })}</h2>
            <span className="text-2xl font-bold text-primary">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="mb-4" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t({ en: "Days Completed", pt: "Dias Concluídos", es: "Días Completados" })}</p>
              <p className="text-2xl font-bold">
                {progress.completedDays}/{totalDays}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t({ en: "Challenge", pt: "Desafio", es: "Desafío" })}</p>
              <p className="text-2xl font-bold">
                {progress.challengeCompleted ? "✓" : "○"}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t({ en: "Reflections", pt: "Reflexões", es: "Reflexiones" })}</p>
              <p className="text-2xl font-bold">{(progress as any).reflections?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* Module Content */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">{t({ en: "Module Content", pt: "Conteúdo do Módulo", es: "Contenido del Módulo" })}</h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-4 text-foreground leading-relaxed">
              <div>
                <h3 className="font-bold mb-2">{t({ en: "Core Principle", pt: "Princípio Central", es: "Principio Básico" })}</h3>
                <p>{(module as any).corePrinciple}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">{t({ en: "Mental Model", pt: "Modelo Mental", es: "Modelo Mental" })}</h3>
                <p>{(module as any).mentalModel}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">{t({ en: "Daily Practice", pt: "Prática Diária", es: "Práctica Diaria" })}</h3>
                <p>{(module as any).dailyPractice}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Practice Days */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{t({ en: "Practice Days", pt: "Dias de Prática", es: "Días de Práctica" })}</h2>
          <p className="text-muted-foreground mb-6">
            {t({ en: `Complete one practice day each day for ${totalDays} days to internalize this module's teachings.`, pt: `Complete um dia de prática por dia durante ${totalDays} dias para internalizar os ensinamentos deste módulo.`, es: `Completa un día de práctica cada día durante ${totalDays} días para internalizar las enseñanzas de este módulo.` })}
          </p>
          <div className="space-y-3">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNumber) => {
              const isCompleted = progress.completedDays >= dayNumber;
              return (
                <div
                  key={dayNumber}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    isCompleted
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-semibold">{t({ en: `Day ${dayNumber}`, pt: `Dia ${dayNumber}`, es: `Día ${dayNumber}` })}</p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted ? t({ en: "Completed", pt: "Concluído", es: "Completado" }) : t({ en: "Not started", pt: "Não iniciado", es: "No empezado" })}
                      </p>
                    </div>
                  </div>
                  {!isCompleted && progress.completedDays === dayNumber - 1 && (
                    <Button
                      onClick={() => handleCompleteDay(dayNumber)}
                      disabled={completeDay.isPending}
                      size="sm"
                    >
                      {t({ en: `Complete Day ${dayNumber}`, pt: `Concluir Dia ${dayNumber}`, es: `Completar Día ${dayNumber}` })}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Challenge */}
        {(module as any).decisionChallenge && (
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t({ en: "Module Challenge", pt: "Desafio do Módulo", es: "Desafío del Módulo" })}</h2>
            </div>
            <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary mb-6">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {(module as any).decisionChallenge}
              </p>
            </div>
            {!progress.challengeCompleted ? (
              <Button
                onClick={handleCompleteChallenge}
                disabled={completeChallenge.isPending || progress.completedDays < totalDays}
                size="lg"
              >
                {progress.completedDays < totalDays
                  ? t({ en: `Complete all ${totalDays} practice days first`, pt: `Primeiro, conclua todos os ${totalDays} dias de prática`, es: `Completa primero los ${totalDays} días de práctica` })
                  : t({ en: "Mark Challenge as Complete", pt: "Marcar Desafio como Concluído", es: "Marcar Desafío como Completado" })}
              </Button>
            ) : (
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                <p className="font-semibold">{t({ en: "Challenge Completed!", pt: "Desafio Concluído!", es: "¡Desafío Completado!" })}</p>
              </div>
            )}
          </Card>
        )}

        {/* Reflections */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">{t({ en: "Your Reflections", pt: "Suas Reflexões", es: "Tus Reflexiones" })}</h2>
          
          {!showReflection && (
            <Button onClick={() => setShowReflection(true)} className="mb-6">
              {t({ en: "Add Reflection", pt: "Adicionar Reflexão", es: "Añadir Reflexión" })}
            </Button>
          )}

          {showReflection && (
            <form onSubmit={handleSubmitReflection} className="mb-8 space-y-4">
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder={t({ en: "What insights did you gain from this module? How will you apply these teachings?", pt: "Que insights você obteve com este módulo? Como você aplicará esses ensinamentos?", es: "¿Qué ideas obtuviste de este módulo? ¿Cómo aplicarás estas enseñanzas?" })}
                className="min-h-32"
                required
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={addReflection.isPending}>
                  {addReflection.isPending ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." }) : t({ en: "Save Reflection", pt: "Salvar Reflexão", es: "Guardar Reflexión" })}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReflection(false);
                    setReflectionText("");
                  }}
                >
                  {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                </Button>
              </div>
            </form>
          )}

          {(progress as any).reflections && (progress as any).reflections.length > 0 ? (
            <div className="space-y-4">
              {(progress as any).reflections.map((reflection: any, index: number) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(reflection.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-foreground">{reflection.text}</p>
                </div>
              ))}
            </div>
          ) : (
            !showReflection && (
              <p className="text-muted-foreground text-center py-8">
                {t({ en: "No reflections yet. Add your first reflection to track your insights.", pt: "Nenhuma reflexão ainda. Adicione sua primeira reflexão para acompanhar seus insights.", es: "Aún no hay reflexiones. Añade tu primera reflexión para hacer un seguimiento de tus ideas." })}
              </p>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
