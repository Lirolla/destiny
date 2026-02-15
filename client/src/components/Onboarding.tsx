import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Compass, Gauge, Calendar, BookOpen, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Onboarding Flow Component
 * 
 * 3-step tutorial for new users explaining:
 * 1. The Bridge — Your command centre
 * 2. Calibrate — The 15 Axes of Free Will
 * 3. Daily Will Cycle — Morning → Midday → Evening practice
 */

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    {
      icon: Compass,
      title: t("The Bridge", "A Ponte"),
      description: t("Your command centre", "O teu centro de comando"),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t(
              "The Bridge is your daily cockpit. Everything you need is one tap away:",
              "A Ponte é o teu cockpit diário. Tudo o que precisas está a um toque:"
            )}
          </p>
          <div className="space-y-3">
            <div className="bg-[#01D98D]/10 p-4 rounded-lg border-l-4 border-[#01D98D]">
              <p className="font-semibold text-sm mb-1">{t("Destiny Score", "Pontuação do Destino")}</p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Your overall free will health — the average of all 15 axes. Track it daily.",
                  "A saúde geral da tua vontade livre — a média de todos os 15 eixos. Acompanha diariamente."
                )}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold text-sm mb-1">{t("Doctrine of the Week", "Doutrina da Semana")}</p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "A rotating philosophical principle from the Prologue to anchor your week.",
                  "Um princípio filosófico rotativo do Prólogo para ancorar a tua semana."
                )}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold text-sm mb-1">{t("Quick Access Grid", "Grelha de Acesso Rápido")}</p>
              <p className="text-sm text-muted-foreground">
                {t(
                  "16 features at your fingertips — calibrate, listen, read, reflect, challenge, and more.",
                  "16 funcionalidades ao teu alcance — calibrar, ouvir, ler, refletir, desafiar e mais."
                )}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic text-center">
            {t(
              "\"The captain who knows their bridge commands the voyage.\"",
              "\"O capitão que conhece a sua ponte comanda a viagem.\""
            )}
          </p>
        </div>
      )
    },
    {
      icon: Gauge,
      title: t("The 15 Axes of Free Will", "Os 15 Eixos da Vontade Livre"),
      description: t("Calibrate your will with precision", "Calibra a tua vontade com precisão"),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t(
              "Your free will operates across 15 measurable dimensions. Each axis is a bipolar spectrum — from where you are to where you could be:",
              "A tua vontade livre opera em 15 dimensões mensuráveis. Cada eixo é um espectro bipolar — de onde estás para onde poderias estar:"
            )}
          </p>
          <div className="bg-[#01D98D]/10 p-6 rounded-lg border-l-4 border-[#01D98D]">
            <div className="text-center mb-4">
              <p className="text-2xl mb-1">🔋</p>
              <p className="text-lg font-semibold">{t("Axis 0: The Will Axis", "Eixo 0: O Eixo da Vontade")}</p>
              <p className="text-sm text-muted-foreground">{t("Powerless ↔ Powerful", "Impotente ↔ Poderoso")}</p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                {t("\"The master axis — the engine of all change\"", "\"O eixo mestre — o motor de toda a mudança\"")}
              </p>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #8B0000, #01D98D)' }}>
              <div className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border-2 border-[#01D98D] rounded-full shadow-lg" style={{ left: '65%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{t("Powerless", "Impotente")}</span>
              <span className="font-bold text-[#01D98D]">65</span>
              <span>{t("Powerful", "Poderoso")}</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#01D98D] mt-1">•</span>
              <span>{t(
                "15 axes mapped to the 14 chapters of the book, plus the master Will Axis",
                "15 eixos mapeados aos 14 capítulos do livro, mais o Eixo da Vontade mestre"
              )}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#01D98D] mt-1">•</span>
              <span>{t(
                "Your Destiny Score is the average of all 15 axes — your overall free will health",
                "A tua Pontuação do Destino é a média de todos os 15 eixos — a saúde geral da tua vontade livre"
              )}</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      icon: Calendar,
      title: t("Daily Will Cycle", "Ciclo Diário da Vontade"),
      description: t("Operationalise free will with structured practice", "Operacionaliza a vontade livre com prática estruturada"),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t(
              "Transform awareness into action through a three-phase daily practice:",
              "Transforma consciência em ação através de uma prática diária em três fases:"
            )}
          </p>
          <div className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">🌅</div>
                <h4 className="font-semibold">{t("Morning Calibration", "Calibração Matinal")}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t(
                  "Calibrate all 15 axes. Set your intention. Know where your will stands before the day begins.",
                  "Calibra todos os 15 eixos. Define a tua intenção. Sabe onde está a tua vontade antes do dia começar."
                )}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">⚡</div>
                <h4 className="font-semibold">{t("Midday Decisive Action", "Ação Decisiva ao Meio-dia")}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t(
                  "Focus on your 3 lowest axes. The Stoic Strategist generates a decisive action. Commit to one concrete choice.",
                  "Foca-te nos teus 3 eixos mais baixos. O Estrategista Estoico gera uma ação decisiva. Compromete-te com uma escolha concreta."
                )}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg">🌙</div>
                <h4 className="font-semibold">{t("Evening Reflection", "Reflexão Noturna")}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t(
                  "Recalibrate. Map cause and effect: What did you sow today? What did you reap? The AI analyses patterns.",
                  "Recalibra. Mapeia causa e efeito: O que semeaste hoje? O que colheste? A IA analisa padrões."
                )}
              </p>
            </div>
          </div>
          <div className="bg-[#01D98D]/10 p-4 rounded-lg text-center border border-[#01D98D]/20">
            <p className="text-sm font-medium">
              {t(
                "Complete cycles build your streak and move you toward the Invictus Moment",
                "Ciclos completos constroem a tua sequência e movem-te em direção ao Momento Invictus"
              )}
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-[#01D98D]/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-[#01D98D]" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("Step", "Passo")} {currentStep + 1} {t("of", "de")} {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("Previous", "Anterior")}
            </Button>

            <Button variant="link" onClick={onSkip} className="text-muted-foreground">
              {t("Skip Tutorial", "Saltar Tutorial")}
            </Button>

            <Button onClick={handleNext} className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-black">
              {currentStep === steps.length - 1 ? t("Get Started", "Começar") : t("Next", "Seguinte")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
