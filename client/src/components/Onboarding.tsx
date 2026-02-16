import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Compass, Gauge, Calendar, BookOpen, ArrowRight, ArrowLeft, X, Globe } from "lucide-react";
import { useLanguage, type AppLanguage } from "@/contexts/LanguageContext";

/**
 * Onboarding Flow Component
 * 
 * 4-step tutorial for new users:
 * 0. Language Selection — Duolingo-style flag picker
 * 1. The Bridge — Your command centre
 * 2. Calibrate — The 15 Axes of Free Will
 * 3. Daily Will Cycle — Morning → Midday → Evening practice
 */

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const LANGUAGES: { code: AppLanguage; flag: string; label: string; native: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English", native: "English" },
  { code: "pt", flag: "🇧🇷", label: "Portuguese", native: "Português" },
  { code: "es", flag: "🇪🇸", label: "Spanish", native: "Español" },
];

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t, language, setLanguage } = useLanguage();

  // Step 0: Language Selection
  const languageStep = {
    icon: Globe,
    title: "Choose Your Language",
    description: "Escolha seu idioma · Elige tu idioma",
    content: (
      <div className="space-y-6">
        <p className="text-center text-muted-foreground text-sm">
          Select the language you'd like to use throughout the app.
        </p>
        <div className="grid gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                language === lang.code
                  ? "border-[#01D98D] bg-[#01D98D]/10 shadow-md shadow-[#01D98D]/10"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              }`}
            >
              <span className="text-4xl">{lang.flag}</span>
              <div className="text-left flex-1">
                <p className="font-semibold text-lg">{lang.native}</p>
                <p className="text-sm text-muted-foreground">{lang.label}</p>
              </div>
              {language === lang.code && (
                <div className="h-6 w-6 rounded-full bg-[#01D98D] flex items-center justify-center">
                  <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {t({ en: "You can change this anytime in Settings.", pt: "Pode alterar isto a qualquer momento nas Configurações.", es: "Puedes cambiar esto en cualquier momento en Configuración." })}
        </p>
      </div>
    ),
  };

  // Steps 1-3: Tutorial steps
  const tutorialSteps = [
    {
      icon: Compass,
      title: t({ en: "The Bridge", pt: "A Ponte", es: "El Puente" }),
      description: t({ en: "Your command centre", pt: "O teu centro de comando", es: "Tu centro de mando" }),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t({ en: "The Bridge is your daily cockpit. Everything you need is one tap away:", pt: "A Ponte é o teu cockpit diário. Tudo o que precisas está a um toque:", es: "El Puente es tu cabina diaria. Todo lo que necesitas está a un toque de distancia:" })}
          </p>
          <div className="space-y-3">
            <div className="bg-[#01D98D]/10 p-4 rounded-lg border-l-4 border-[#01D98D]">
              <p className="font-semibold text-sm mb-1">{t({ en: "Destiny Score", pt: "Pontuação do Destino", es: "Puntuación de Destino" })}</p>
              <p className="text-sm text-muted-foreground">
                {t({ en: "Your overall free will health — the average of all 15 axes. Track it daily.", pt: "A saúde geral da tua vontade livre — a média de todos os 15 eixos. Acompanha diariamente.", es: "La salud general de tu libre albedrío: el promedio de los 15 ejes. Dale seguimiento a diario." })}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold text-sm mb-1">{t({ en: "Doctrine of the Week", pt: "Doutrina da Semana", es: "Doctrina de la Semana" })}</p>
              <p className="text-sm text-muted-foreground">
                {t({ en: "A rotating philosophical principle from the Prologue to anchor your week.", pt: "Um princípio filosófico rotativo do Prólogo para ancorar a tua semana.", es: "Un principio filosófico rotativo del Prólogo para anclar tu semana." })}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold text-sm mb-1">{t({ en: "Quick Access Grid", pt: "Grelha de Acesso Rápido", es: "Cuadrícula de Acceso Rápido" })}</p>
              <p className="text-sm text-muted-foreground">
                {t({ en: "16 features at your fingertips — calibrate, listen, read, reflect, challenge, and more.", pt: "16 funcionalidades ao teu alcance — calibrar, ouvir, ler, refletir, desafiar e mais.", es: "16 funciones al alcance de tu mano: calibra, escucha, lee, reflexiona, desafía y más." })}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic text-center">
            {t({ en: "\"The captain who knows their bridge commands the voyage.\"", pt: "\"O capitão que conhece a sua ponte comanda a viagem.\"", es: "\"El capitán que conoce su puente comanda el viaje.\"" })}
          </p>
        </div>
      )
    },
    {
      icon: Gauge,
      title: t({ en: "Calibrate", pt: "Calibrar", es: "Calibrar" }),
      description: t({ en: "The 15 Axes of Free Will", pt: "Os 15 Eixos da Vontade Livre", es: "Los 15 Ejes del Libre Albedrío" }),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t({ en: "The 15 Axes are the compass of your soul. Each axis is a spectrum between two extremes:", pt: "Os 15 Eixos são a bússola da tua alma. Cada eixo é um espectro entre dois extremos:", es: "Los 15 Ejes son la brújula de tu alma. Cada eje es un espectro entre dos extremos:" })}
          </p>
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">{t({ en: "Powerless", pt: "Impotente", es: "Impotente" })}</span>
              <div className="flex-1 mx-3 h-2 bg-gradient-to-r from-red-500/50 via-muted to-green-500/50 rounded-full" />
              <span className="text-green-400">{t({ en: "Powerful", pt: "Poderoso", es: "Poderoso" })}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">{t({ en: "Blame", pt: "Culpa", es: "Culpa" })}</span>
              <div className="flex-1 mx-3 h-2 bg-gradient-to-r from-red-500/50 via-muted to-green-500/50 rounded-full" />
              <span className="text-green-400">{t({ en: "Ownership", pt: "Responsabilidade", es: "Responsabilidad" })}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400">{t({ en: "Victimhood", pt: "Vitimismo", es: "Victimismo" })}</span>
              <div className="flex-1 mx-3 h-2 bg-gradient-to-r from-red-500/50 via-muted to-green-500/50 rounded-full" />
              <span className="text-green-400">{t({ en: "Agency", pt: "Agência", es: "Agencia" })}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t({ en: "...and 12 more axes covering forgiveness, clarity, faith, courage, and more", pt: "...e mais 12 eixos cobrindo perdão, clareza, fé, coragem e mais", es: "...y 12 ejes más que cubren perdón, claridad, fe, coraje y más" })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {t({ en: "Move each slider honestly. There are no wrong answers — only honest self-observation.", pt: "Move cada cursor honestamente. Não há respostas erradas — apenas auto-observação honesta.", es: "Mueve cada deslizador honestamente. No hay respuestas incorrectas, solo autoobservación honesta." })}
          </p>
        </div>
      )
    },
    {
      icon: Calendar,
      title: t({ en: "Daily Will Cycle", pt: "Ciclo Diário da Vontade", es: "Ciclo Diario de la Voluntad" }),
      description: t({ en: "Operationalise free will with structured practice", pt: "Operacionaliza a vontade livre com prática estruturada", es: "Operacionaliza el libre albedrío con práctica estructurada" }),
      content: (
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t({ en: "Transform awareness into action through a three-phase daily practice:", pt: "Transforma consciência em ação através de uma prática diária em três fases:", es: "Transforma la conciencia en acción a través de una práctica diaria de tres fases:" })}
          </p>
          <div className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">🌅</div>
                <h4 className="font-semibold">{t({ en: "Morning Calibration", pt: "Calibração Matinal", es: "Calibración Matutina" })}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t({ en: "Calibrate all 15 axes. Set your intention. Know where your will stands before the day begins.", pt: "Calibra todos os 15 eixos. Define a tua intenção. Sabe onde está a tua vontade antes do dia começar.", es: "Calibra los 15 ejes. Fija tu intención. Conoce el estado de tu voluntad antes de que comience el día." })}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-lg">⚡</div>
                <h4 className="font-semibold">{t({ en: "Midday Decisive Action", pt: "Ação Decisiva ao Meio-dia", es: "Acción Decisiva de Mediodía" })}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t({ en: "Focus on your 3 lowest axes. The Stoic Strategist generates a decisive action. Commit to one concrete choice.", pt: "Foca-te nos teus 3 eixos mais baixos. O Estrategista Estoico gera uma ação decisiva. Compromete-te com uma escolha concreta.", es: "Concéntrate en tus 3 ejes más bajos. El Estratega Estoico genera una acción decisiva. Comprométete con una elección concreta." })}
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg">🌙</div>
                <h4 className="font-semibold">{t({ en: "Evening Reflection", pt: "Reflexão Noturna", es: "Reflexión Nocturna" })}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                {t({ en: "Recalibrate. Map cause and effect: What did you sow today? What did you reap? The AI analyses patterns.", pt: "Recalibra. Mapeia causa e efeito: O que semeaste hoje? O que colheste? A IA analisa padrões.", es: "Recalibra. Mapea causa y efecto: ¿Qué sembraste hoy? ¿Qué cosechaste? La IA analiza los patrones." })}
              </p>
            </div>
          </div>
          <div className="bg-[#01D98D]/10 p-4 rounded-lg text-center border border-[#01D98D]/20">
            <p className="text-sm font-medium">
              {t({ en: "Complete cycles build your streak and move you toward the Invictus Moment", pt: "Ciclos completos constroem a tua sequência e movem-te em direção ao Momento Invictus", es: "Los ciclos completos construyen tu racha y te acercan al Momento Invictus" })}
            </p>
          </div>
        </div>
      )
    }
  ];

  // Combine: Step 0 = language, Steps 1-3 = tutorial
  const allSteps = [languageStep, ...tutorialSteps];
  const currentStepData = allSteps[currentStep];
  const Icon = currentStepData.icon;
  const totalSteps = allSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
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
              <span>{t({ en: "Step", pt: "Passo", es: "Paso" })} {currentStep + 1} {t({ en: "of", pt: "de", es: "de" })} {totalSteps}</span>
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
              {t({ en: "Previous", pt: "Anterior", es: "Anterior" })}
            </Button>

            <Button variant="link" onClick={onSkip} className="text-muted-foreground">
              {t({ en: "Skip Tutorial", pt: "Saltar Tutorial", es: "Saltar Tutorial" })}
            </Button>

            <Button onClick={handleNext} className="bg-[#01D98D] hover:bg-[#01D98D]/90 text-black">
              {currentStep === 0
                ? t({ en: "Continue", pt: "Continuar", es: "Continuar" })
                : currentStep === totalSteps - 1
                  ? t({ en: "Get Started", pt: "Começar", es: "Comenzar" })
                  : t({ en: "Next", pt: "Seguinte", es: "Siguiente" })
              }
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
