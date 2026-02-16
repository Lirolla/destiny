import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Target, 
  Calendar,
  ArrowRight 
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InvictusFooter } from "@/components/InvictusFooter";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Book Modules Page
 * 
 * Displays the 14 interactive learning modules in a gamified structure.
 * Each module unlocks after completing the previous one + required practice days.
 */

export default function Modules() {
  const { t } = useLanguage();
  const { data: modulesWithProgress, isLoading } = trpc.modules.list.useQuery();
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const selectedModule = modulesWithProgress?.find(m => m.id === selectedModuleId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t({ en: "Practice", pt: "Prática", es: "Práctica" })} subtitle={t({ en: "14 modules to master", pt: "14 módulos para dominar", es: "14 módulos para dominar" })} showBack />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Practice", pt: "Prática", es: "Práctica" })} subtitle={t({ en: "14 modules to master your free will", pt: "14 módulos para dominar seu livre arbítrio", es: "14 módulos para dominar tu libre albedrío" })} showBack />

      <div className="px-4 py-4">
        {/* Module List */}
        <div className="space-y-2 mb-6">
          {modulesWithProgress?.map((item) => {
          const module = item;
          const progress = item.progress;
            const isLocked = progress?.status === "locked" || !progress;
            const isUnlocked = progress?.status === "unlocked";
            const isInProgress = progress?.status === "in_progress";
            const isCompleted = progress?.status === "completed";
            
            const statusIcon = isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : isLocked ? (
              <Lock className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Circle className="w-5 h-5 text-primary" />
            );

            return (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all active:scale-[0.98] ${
                  selectedModuleId === module.id ? 'ring-1 ring-primary bg-primary/5' : 'border-border/50'
                } ${isLocked ? 'opacity-50' : ''}`}
                onClick={() => !isLocked && setSelectedModuleId(module.id)}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-green-500/15' : isLocked ? 'bg-muted' : 'bg-primary/15'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <span className="text-sm font-bold">{module.moduleNumber}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{module.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{t({ en: `${module.estimatedMinutes} min`, pt: `${module.estimatedMinutes} min`, es: `${module.estimatedMinutes} min` })}</span>
                      {progress && progress.progressPercentage > 0 && (
                        <span className="text-[10px] text-primary">{progress.progressPercentage}%</span>
                      )}
                      {progress && progress.practiceDaysCompleted > 0 && (
                        <span className="text-[10px] text-muted-foreground">{t({ en: `${progress.practiceDaysCompleted}d practiced`, pt: `${progress.practiceDaysCompleted}d praticados`, es: `${progress.practiceDaysCompleted}d practicados` })}</span>
                      )}
                    </div>
                    {progress && progress.progressPercentage > 0 && (
                      <Progress value={progress.progressPercentage} className="h-1 mt-1.5" />
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Module Detail Panel */}
        {selectedModule && (
          <ModuleDetail
            module={selectedModule}
            progress={selectedModule.progress}
            onClose={() => setSelectedModuleId(null)}
          />
        )}

        <InvictusFooter />
      </div>
    </div>
  );
}

interface DecisionOption {
  choice: string;
  impact: Record<string, number>;
  outcome: string;
}

interface DecisionChallenge {
  scenario: string;
  options: DecisionOption[];
}

function DecisionChallengeView({
  challenge,
  isCompleted,
  onComplete,
  isPending,
}: {
  challenge: any;
  isCompleted: boolean;
  onComplete: () => void;
  isPending: boolean;
}) {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  // Parse the challenge data
  const data: DecisionChallenge | null = typeof challenge === 'string'
    ? (() => { try { return JSON.parse(challenge); } catch { return null; } })()
    : challenge;

  if (!data || !data.scenario) {
    return <p className="text-sm text-muted-foreground">{t({ en: "No challenge available.", pt: "Nenhum desafio disponível.", es: "No hay desafíos disponibles." })}</p>;
  }

  const handleSelect = (index: number) => {
    if (isCompleted || showOutcome) return;
    setSelectedOption(index);
    setShowOutcome(true);
  };

  return (
    <div className="space-y-3">
      {/* Scenario */}
      <div className="bg-muted/30 rounded-lg p-3">
        <p className="text-sm font-medium text-foreground">{data.scenario}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {data.options.map((option, i) => {
          const isSelected = selectedOption === i;
          const impactSum = Object.values(option.impact).reduce((a, b) => a + b, 0);
          const isPositive = impactSum > 0;
          const isNeutral = impactSum === 0;

          return (
            <div key={i}>
              <button
                onClick={() => handleSelect(i)}
                disabled={isCompleted || showOutcome}
                className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                  isSelected
                    ? isPositive
                      ? 'border-green-500 bg-green-500/10'
                      : isNeutral
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-red-500 bg-red-500/10'
                    : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                } ${isCompleted ? 'opacity-60 cursor-default' : ''}`}
              >
                <span className="font-medium">{option.choice}</span>
              </button>
              {isSelected && showOutcome && (
                <div className={`mt-1 ml-2 p-2 rounded text-xs ${
                  isPositive ? 'text-green-600 dark:text-green-400' : isNeutral ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {option.outcome}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      {showOutcome && !isCompleted && (
        <Button size="sm" onClick={onComplete} disabled={isPending}>
          {isPending ? t({ en: "Completing...", pt: "Concluindo...", es: "Completando..." }) : t({ en: "Mark Challenge Complete", pt: "Marcar Desafio como Concluído", es: "Marcar Desafío como Completado" })}
        </Button>
      )}
      {isCompleted && (
        <Badge className="bg-green-500 text-xs">{t({ en: "Challenge Completed", pt: "Desafio Concluído", es: "Desafío Completado" })}</Badge>
      )}
    </div>
  );
}

interface ModuleDetailProps {
  module: any;
  progress: any;
  onClose: () => void;
}

function ModuleDetail({ module, progress, onClose }: ModuleDetailProps) {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const [reflection, setReflection] = useState(progress?.reflectionEntry || "");

  const startModule = trpc.modules.start.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
    },
  });

  const recordPractice = trpc.modules.recordPractice.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
    },
  });

  const completeChallenge = trpc.modules.completeChallenge.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
    },
  });

  const saveReflection = trpc.modules.saveReflection.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
    },
  });

  const completeModule = trpc.modules.complete.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
      onClose();
    },
  });

  const handleStart = () => {
    startModule.mutate({ moduleId: module.id });
  };

  const handleRecordPractice = () => {
    recordPractice.mutate({ moduleId: module.id });
  };

  const handleCompleteChallenge = () => {
    completeChallenge.mutate({ moduleId: module.id });
  };

  const handleSaveReflection = () => {
    saveReflection.mutate({ 
      moduleId: module.id, 
      reflection 
    });
  };

  const handleComplete = () => {
    completeModule.mutate({ moduleId: module.id });
  };

  const isLocked = !progress || progress.status === "locked";
  const isCompleted = progress?.status === "completed";

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <PageHeader
        title={t({ en: `Module ${module.moduleNumber}`, pt: `Módulo ${module.moduleNumber}`, es: `Módulo ${module.moduleNumber}` })}
        subtitle={module.title}
        showBack
        backPath="#"
        rightAction={
          <div className="flex items-center gap-2">
            {isCompleted && <Badge className="bg-green-500 text-xs">{t({ en: "Done", pt: "Feito", es: "Hecho" })}</Badge>}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <span className="text-lg">✕</span>
            </Button>
          </div>
        }
      />
      <div className="px-4 py-4">

      {isLocked ? (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-base font-semibold mb-1">{t({ en: "Module Locked", pt: "Módulo Bloqueado", es: "Módulo Bloqueado" })}</p>
          <p className="text-sm text-muted-foreground">
            {t({ en: `Complete the previous module and practice for ${module.requiredPracticeDays} days to unlock.`, pt: `Conclua o módulo anterior e pratique por ${module.requiredPracticeDays} dias para desbloquear.`, es: `Completa el módulo anterior y practica durante ${module.requiredPracticeDays} días para desbloquear.` })}
          </p>
          <Button onClick={onClose} className="mt-4">{t({ en: "Back to Modules", pt: "Voltar aos Módulos", es: "Volver a los Módulos" })}</Button>
        </div>
      ) : (
        <div className="space-y-6 pb-24">
          {/* 1. Read Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">{t({ en: "Read", pt: "Ler", es: "Leer" })}</h2>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-foreground/90">
              <p>{module.content}</p>
            </div>
            {progress?.status === "unlocked" && (
              <Button onClick={handleStart} disabled={startModule.isPending}>
                {startModule.isPending ? t({ en: "Starting...", pt: "Iniciando...", es: "Iniciando..." }) : t({ en: "Start Module", pt: "Iniciar Módulo", es: "Iniciar Módulo" })}
              </Button>
            )}
          </div>

          {progress?.status !== "unlocked" && (
            <>
              {/* 2. Decision Challenge */}
              {module.challenge && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">{t({ en: "Decision Challenge", pt: "Desafio de Decisão", es: "Desafío de Decisión" })}</h2>
                  </div>
                  <DecisionChallengeView 
                    challenge={module.challenge} 
                    isCompleted={progress?.challengeCompleted} 
                    onComplete={handleCompleteChallenge}
                    isPending={completeChallenge.isPending}
                  />
                </div>
              )}

              {/* 3. Daily Practice */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">{t({ en: "Daily Practice", pt: "Prática Diária", es: "Práctica Diaria" })}</h2>
                </div>
                <Card className="bg-muted/30">
                  <div className="p-4">
                    <p className="text-sm font-medium mb-2">{t({ en: `Practice for ${module.requiredPracticeDays} days`, pt: `Pratique por ${module.requiredPracticeDays} dias`, es: `Practica durante ${module.requiredPracticeDays} días` })}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress value={(progress?.practiceDaysCompleted / module.requiredPracticeDays) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1.5">{t({ en: `${progress?.practiceDaysCompleted || 0} of ${module.requiredPracticeDays} days completed`, pt: `${progress?.practiceDaysCompleted || 0} de ${module.requiredPracticeDays} dias concluídos`, es: `${progress?.practiceDaysCompleted || 0} de ${module.requiredPracticeDays} días completados` })}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handleRecordPractice} 
                        disabled={recordPractice.isPending || progress?.practiceToday}
                      >
                        {progress?.practiceToday ? t({ en: "Practiced Today", pt: "Praticado Hoje", es: "Practicado Hoy" }) : t({ en: "Record Practice", pt: "Registrar Prática", es: "Registrar Práctica" })}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 4. Reflection */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">{t({ en: "Reflection", pt: "Reflexão", es: "Reflexión" })}</h2>
                <Textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder={t({ en: "What did you learn? How did you apply it?", pt: "O que você aprendeu? Como você aplicou?", es: "¿Qué aprendiste? ¿Cómo lo aplicaste?" })}
                  className="min-h-[100px]"
                />
                <Button size="sm" onClick={handleSaveReflection} disabled={saveReflection.isPending || !reflection.trim()}>
                  {saveReflection.isPending ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." }) : t({ en: "Save Reflection", pt: "Salvar Reflexão", es: "Guardar Reflexión" })}
                </Button>
              </div>

              {/* 5. Complete Module */}
              <div className="pt-4 border-t border-border/50">
                <Button 
                  onClick={handleComplete} 
                  disabled={completeModule.isPending || !progress?.canComplete}
                  className="w-full"
                >
                  {completeModule.isPending ? t({ en: "Completing Module...", pt: "Concluindo Módulo...", es: "Completando Módulo..." }) : t({ en: "Complete Module", pt: "Concluir Módulo", es: "Completar Módulo" })}
                </Button>
                {!progress?.canComplete && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {t({ en: "You must complete the challenge and all practice days to finish the module.", pt: "Você deve completar o desafio e todos os dias de prática para finalizar o módulo.", es: "Debes completar el desafío y todos los días de práctica para finalizar el módulo." })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

