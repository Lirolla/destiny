import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Brain, CloudFog, Sparkles, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Bias Clearing Interface
 * 
 * Daily cognitive fog assessment with AI-generated prompts
 * to help users recognize and clear mental biases.
 */

export default function BiasClearing() {
  const { t, language } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [fogBefore, setFogBefore] = useState([5]);
  const [fogAfter, setFogAfter] = useState([3]);
  const [notes, setNotes] = useState("");
  const [biasType, setBiasType] = useState<string>("confirmation");

  const { data: prompt, isLoading: promptLoading } = trpc.biasClearing.getDailyPrompt.useQuery(
    undefined,
    { enabled: showPrompt }
  );
  
  // For now, we'll just show recent checks without a dedicated list endpoint
  const checks: any[] = [];
  const checksLoading = false;
  const utils = trpc.useUtils();

  const recordCheck = trpc.biasClearing.create.useMutation({
    onSuccess: () => {
      setShowPrompt(false);
      setFogBefore([5]);
      setFogAfter([3]);
      setNotes("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    recordCheck.mutate({
      checkDate: new Date().toISOString().split('T')[0],
      biasType,
      fogLevel: fogBefore[0],
    });
  };

  const biasTypes = [
    { value: "confirmation", label: t({ en: "Confirmation Bias", pt: "Viés de Confirmação", es: "Sesgo de Confirmación" }), description: t({ en: "Only seeing evidence that confirms existing beliefs", pt: "Ver apenas evidências que confirmam crenças existentes", es: "Ver solo evidencia que confirma creencias existentes" }) },
    { value: "availability", label: t({ en: "Availability Bias", pt: "Viés de Disponibilidade", es: "Sesgo de Disponibilidad" }), description: t({ en: "Overweighting recent or memorable information", pt: "Supervalorizar informações recentes ou memoráveis", es: "Sobreponderar información reciente o memorable" }) },
    { value: "anchoring", label: t({ en: "Anchoring Bias", pt: "Viés de Ancoragem", es: "Sesgo de Anclaje" }), description: t({ en: "Over-relying on the first piece of information", pt: "Confiar demais na primeira informação recebida", es: "Depender en exceso de la primera información" }) },
    { value: "sunk_cost", label: t({ en: "Sunk Cost Fallacy", pt: "Falácia do Custo Afundado", es: "Falacia del Costo Hundido" }), description: t({ en: "Continuing because of past investment", pt: "Continuar por causa do investimento passado", es: "Continuar debido a la inversión pasada" }) },
    { value: "negativity", label: t({ en: "Negativity Bias", pt: "Viés de Negatividade", es: "Sesgo de Negatividad" }), description: t({ en: "Focusing more on negative than positive", pt: "Focar mais no negativo do que no positivo", es: "Enfocarse más en lo negativo que en lo positivo" }) },
    { value: "other", label: t({ en: "Other", pt: "Outro", es: "Otro" }), description: t({ en: "Another type of cognitive bias", pt: "Outro tipo de viés cognitivo", es: "Otro tipo de sesgo cognitivo" }) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Bias Clearing", pt: "Limpeza de Viés", es: "Limpieza de Sesgos" })} subtitle={t({ en: "Clear mental fog & biases", pt: "Limpe a névoa mental e os vieses", es: "Despeja la niebla mental y los sesgos" })} showBack />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Start New Check */}
        {!showPrompt ? (
          <Card className="p-8 mb-8 text-center">
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t({ en: "Daily Bias Check", pt: "Verificação Diária de Viés", es: "Chequeo Diario de Sesgos" })}</h2>
            <p className="text-muted-foreground mb-6">
              {t({ en: "Take 3 minutes to identify and clear cognitive biases affecting your decisions today", pt: "Leve 3 minutos para identificar e limpar vieses cognitivos que afetam suas decisões hoje", es: "Tómate 3 minutos para identificar y despejar sesgos cognitivos que afectan tus decisiones hoy" })}
            </p>
            <Button onClick={() => setShowPrompt(true)} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              {t({ en: "Generate AI Prompt", pt: "Gerar Pergunta da IA", es: "Generar Indicación de IA" })}
            </Button>
          </Card>
        ) : (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t({ en: "Bias Clearing Exercise", pt: "Exercício de Limpeza de Viés", es: "Ejercicio de Limpieza de Sesgos" })}</h2>
            
            {/* AI-Generated Prompt */}
            {promptLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t({ en: "Generating personalized prompt...", pt: "Gerando pergunta personalizada...", es: "Generando indicación personalizada..." })}</p>
              </div>
            )}

            {prompt && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* The Prompt */}
                <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <h3 className="font-bold text-lg">{t({ en: "Today's Clearing Prompt", pt: "Pergunta de Limpeza de Hoje", es: "Indicación de Limpieza de Hoy" })}</h3>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {prompt}
                  </p>
                </div>

                {/* Bias Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t({ en: "What type of bias did you notice?", pt: "Que tipo de viés você notou?", es: "¿Qué tipo de sesgo notaste?" })}</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {biasTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setBiasType(type.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          biasType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold mb-1">{type.label}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fog Level Before */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CloudFog className="w-5 h-5 text-orange-500" />
                    <Label className="text-base font-semibold">
                      {t({ en: "Fog Level Before (1-10)", pt: "Nível de Névoa Antes (1-10)", es: "Nivel de Niebla Antes (1-10)" })}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "How clouded was your thinking before this exercise?", pt: "Quão nublado estava seu pensamento antes deste exercício?", es: "¿Cuán nublado estaba tu pensamiento antes de este ejercicio?" })}
                  </p>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={fogBefore}
                      onValueChange={setFogBefore}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-3xl font-bold text-primary w-12 text-center">
                      {fogBefore[0]}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t({ en: "Clear", pt: "Claro", es: "Claro" })}</span>
                    <span>{t({ en: "Very Foggy", pt: "Muito Nevoado", es: "Muy Nublado" })}</span>
                  </div>
                </div>

                {/* Fog Level After */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <Label className="text-base font-semibold">
                      {t({ en: "Fog Level After (1-10)", pt: "Nível de Névoa Depois (1-10)", es: "Nivel de Niebla Después (1-10)" })}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "How clear is your thinking now after recognizing the bias?", pt: "Quão claro está seu pensamento agora após reconhecer o viés?", es: "¿Cuán claro es tu pensamiento ahora después de reconocer el sesgo?" })}
                  </p>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={fogAfter}
                      onValueChange={setFogAfter}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-3xl font-bold text-green-600 w-12 text-center">
                      {fogAfter[0]}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t({ en: "Clear", pt: "Claro", es: "Claro" })}</span>
                    <span>{t({ en: "Very Foggy", pt: "Muito Nevoado", es: "Muy Nublado" })}</span>
                  </div>
                </div>

                {/* Improvement Badge */}
                {fogBefore[0] > fogAfter[0] && (
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      {t({ en: `✨ Clarity improved by ${fogBefore[0] - fogAfter[0]} points!`, pt: `✨ Clareza melhorada em ${fogBefore[0] - fogAfter[0]} pontos!`, es: `✨ ¡La claridad mejoró en ${fogBefore[0] - fogAfter[0]} puntos!` })}
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-semibold">
                    {t({ en: "Notes (Optional)", pt: "Notas (Opcional)", es: "Notas (Opcional)" })}
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t({ en: "What did you realize? How will this change your decisions?", pt: "O que você percebeu? Como isso mudará suas decisões?", es: "¿De qué te diste cuenta? ¿Cómo cambiará esto tus decisiones?" })}
                    className="min-h-32"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={recordCheck.isPending}>
                    {recordCheck.isPending ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." }) : t({ en: "Save Bias Check", pt: "Salvar Verificação de Viés", es: "Guardar Chequeo de Sesgo" })}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPrompt(false)}>
                    {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t({ en: "Bias Check History", pt: "Histórico de Verificação de Viés", es: "Historial de Chequeo de Sesgos" })}</h2>
          
          {checksLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t({ en: "Loading history...", pt: "Carregando histórico...", es: "Cargando historial..." })}</p>
            </div>
          )}

          {checks?.map((check: any) => (
            <Card key={check.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    {new Date(check.checkDate).toLocaleDateString(language, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {check.biasType.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t({ en: "Fog Reduction", pt: "Redução de Névoa", es: "Reducción de Niebla" })}</p>
                  <p className="text-2xl font-bold text-green-600">
                    -{check.fogLevelBefore - check.fogLevelAfter}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t({ en: "Before", pt: "Antes", es: "Antes" })}</p>
                  <p className="text-xl font-bold">{check.fogLevelBefore}/10</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t({ en: "After", pt: "Depois", es: "Después" })}</p>
                  <p className="text-xl font-bold text-green-600">{check.fogLevelAfter}/10</p>
                </div>
              </div>

              {check.notes && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">{t({ en: "Notes", pt: "Notas", es: "Notas" })}</p>
                  <p className="text-foreground">{check.notes}</p>
                </div>
              )}
            </Card>
          ))}

          {!checksLoading && checks?.length === 0 && !showPrompt && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {t({ en: "No bias checks yet. Start your first clearing exercise to improve decision-making.", pt: "Nenhuma verificação de viés ainda. Comece seu primeiro exercício de limpeza para melhorar a tomada de decisões.", es: "Aún no hay chequeos de sesgos. Comienza tu primer ejercicio de limpieza para mejorar la toma de decisiones." })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

