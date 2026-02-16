import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Sowing & Reaping Simulator
 * 
 * AI-powered cause-effect prediction tool.
 * Users describe an action (seed), AI predicts outcomes (harvest).
 * Later, users record actual results and rate AI accuracy.
 */

export default function SowingReaping() {
  const { t } = useLanguage();
  const [seedDescription, setSeedDescription] = useState("");
  const [seedDate, setSeedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  const { data: entries, isLoading } = trpc.sowingReaping.list.useQuery({ limit: 20 });
  const utils = trpc.useUtils();

  const createEntry = trpc.sowingReaping.create.useMutation({
    onSuccess: () => {
      utils.sowingReaping.list.invalidate();
      setSeedDescription("");
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedDescription.trim()) return;

    createEntry.mutate({
      seedDescription,
      seedDate,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Sowing & Reaping", pt: "Semear & Colher", es: "Sembrar & Cosechar" })} subtitle={t({ en: "Track cause-effect relationships", pt: "Acompanhe as relações de causa e efeito", es: "Rastrea las relaciones de causa y efecto" })} showBack />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Create New Entry */}
        {!showForm ? (
          <Card className="p-8 mb-8 text-center">
            <Sprout className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t({ en: "Plant a Seed", pt: "Plante uma Semente", es: "Planta una Semilla" })}</h2>
            <p className="text-muted-foreground mb-6">
              {t({ en: "Describe an intentional action you're taking. The AI will predict the likely harvest.", pt: "Descreva uma ação intencional que você está realizando. A IA preverá a colheita provável.", es: "Describe una acción intencional que estás tomando. La IA predecirá la cosecha probable." })}
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              {t({ en: "Create New Entry", pt: "Criar Nova Entrada", es: "Crear Nueva Entrada" })}
            </Button>
          </Card>
        ) : (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t({ en: "New Seed", pt: "Nova Semente", es: "Nueva Semilla" })}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="seedDate">{t({ en: "Date", pt: "Data", es: "Fecha" })}</Label>
                <Input
                  id="seedDate"
                  type="date"
                  value={seedDate}
                  onChange={(e) => setSeedDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="seedDescription">{t({ en: "What action are you taking? (The Seed)", pt: "Que ação você está realizando? (A Semente)", es: "¿Qué acción estás tomando? (La Semilla)" })}</Label>
                <Textarea
                  id="seedDescription"
                  value={seedDescription}
                  onChange={(e) => setSeedDescription(e.target.value)}
                  placeholder={t({ en: "Example: I'm committing to wake up at 5am every day for 30 days to work on my side project before my day job starts.", pt: "Exemplo: Estou me comprometendo a acordar às 5h todos os dias durante 30 dias para trabalhar no meu projeto paralelo antes do início do meu trabalho diário.", es: "Ejemplo: Me comprometo a despertarme a las 5 am todos los días durante 30 días para trabajar en mi proyecto paralelo antes de que comience mi trabajo diario." })}
                  className="min-h-32"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t({ en: "Be specific. The AI will analyze cause-effect patterns to predict outcomes.", pt: "Seja específico. A IA analisará os padrões de causa e efeito para prever os resultados.", es: "Sé específico. La IA analizará los patrones de causa y efecto para predecir los resultados." })}
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createEntry.isPending}>
                  {createEntry.isPending ? t({ en: "Generating Prediction...", pt: "Gerando Previsão...", es: "Generando Predicción..." }) : t({ en: "Generate AI Prediction", pt: "Gerar Previsão da IA", es: "Generar Predicción de IA" })}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Entries List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t({ en: "Your Seeds & Harvests", pt: "Suas Sementes & Colheitas", es: "Tus Semillas & Cosechas" })}</h2>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t({ en: "Loading entries...", pt: "Carregando entradas...", es: "Cargando entradas..." })}</p>
            </div>
          )}

          {entries?.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}

          {!isLoading && entries?.length === 0 && !showForm && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {t({ en: "No entries yet. Create your first seed to see AI predictions.", pt: "Nenhuma entrada ainda. Crie sua primeira semente para ver as previsões da IA.", es: "No hay entradas todavía. Crea tu primera semilla para ver las predicciones de la IA." })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface EntryCardProps {
  entry: any;
}

function EntryCard({ entry }: EntryCardProps) {
  const { t } = useLanguage();
  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [actualHarvest, setActualHarvest] = useState(entry.actualHarvest || "");
  const [outcomeMatch, setOutcomeMatch] = useState<string>(entry.outcomeMatch || "");
  const [userReflection, setUserReflection] = useState(entry.userReflection || "");
  const [accuracyRating, setAccuracyRating] = useState<number>(entry.accuracyRating || 3);

  const utils = trpc.useUtils();
  const recordHarvest = trpc.sowingReaping.recordHarvest.useMutation({
    onSuccess: () => {
      utils.sowingReaping.list.invalidate();
      setShowHarvestForm(false);
    },
  });

  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    recordHarvest.mutate({
      entryId: entry.id,
      actualHarvest,
      outcomeMatch: outcomeMatch as any,
      userReflection,
      accuracyRating,
    });
  };

  const hasHarvest = !!entry.actualHarvest;

  return (
    <Card className="p-6">
      {/* Seed */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sprout className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-lg">{t({ en: "Seed (Action Taken)", pt: "Semente (Ação Tomada)", es: "Semilla (Acción Tomada)" })}</h3>
          <Badge variant="outline">{new Date(entry.seedDate).toLocaleDateString()}</Badge>
        </div>
        <p className="text-foreground">{entry.seedDescription}</p>
      </div>

      {/* AI Prediction */}
      <div className="mb-6 bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold">{t({ en: "AI Predicted Harvest", pt: "Colheita Prevista pela IA", es: "Cosecha Predicha por la IA" })}</h3>
          <Badge variant="secondary">{t({ en: `${entry.predictionConfidence}% confidence`, pt: `${entry.predictionConfidence}% de confiança`, es: `${entry.predictionConfidence}% de confianza` })}</Badge>
        </div>
        <p className="text-foreground whitespace-pre-wrap">{entry.predictedHarvest}</p>
      </div>

      {/* Actual Harvest */}
      {!hasHarvest && !showHarvestForm && (
        <Button onClick={() => setShowHarvestForm(true)} variant="outline">
          {t({ en: "Record Actual Harvest", pt: "Registrar Colheita Real", es: "Registrar Cosecha Real" })}
        </Button>
      )}

      {showHarvestForm && (
        <form onSubmit={handleSubmitHarvest} className="space-y-4 border-t pt-6">
          <h3 className="font-bold text-lg">{t({ en: "Record Actual Harvest", pt: "Registrar Colheita Real", es: "Registrar Cosecha Real" })}</h3>
          
          <div>
            <Label htmlFor="actualHarvest">{t({ en: "What actually happened?", pt: "O que realmente aconteceu?", es: "¿Qué pasó realmente?" })}</Label>
            <Textarea
              id="actualHarvest"
              value={actualHarvest}
              onChange={(e) => setActualHarvest(e.target.value)}
              placeholder={t({ en: "Describe the real outcomes...", pt: "Descreva os resultados reais...", es: "Describe los resultados reales..." })}
              className="min-h-24"
              required
            />
          </div>

          <div>
            <Label htmlFor="outcomeMatch">{t({ en: "How did it compare to the prediction?", pt: "Como se comparou com a previsão?", es: "¿Cómo se comparó con la predicción?" })}</Label>
            <Select value={outcomeMatch} onValueChange={setOutcomeMatch} required>
              <SelectTrigger>
                <SelectValue placeholder={t({ en: "Select outcome match", pt: "Selecione a correspondência de resultado", es: "Seleccionar coincidencia de resultado" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="better">{t({ en: "Better than predicted", pt: "Melhor do que o previsto", es: "Mejor de lo previsto" })}</SelectItem>
                <SelectItem value="as_predicted">{t({ en: "As predicted", pt: "Conforme previsto", es: "Según lo previsto" })}</SelectItem>
                <SelectItem value="worse">{t({ en: "Worse than predicted", pt: "Pior do que o previsto", es: "Peor de lo previsto" })}</SelectItem>
                <SelectItem value="mixed">{t({ en: "Mixed results", pt: "Resultados mistos", es: "Resultados mixtos" })}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accuracyRating">{t({ en: "AI Accuracy Rating (1-5)", pt: "Classificação de Precisão da IA (1-5)", es: "Calificación de Precisión de la IA (1-5)" })}</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setAccuracyRating(rating)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    accuracyRating === rating
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="userReflection">{t({ en: "Your Reflection (Optional)", pt: "Sua Reflexão (Opcional)", es: "Tu Reflexión (Opcional)" })}</Label>
            <Textarea
              id="userReflection"
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              placeholder={t({ en: "What did you learn from this?", pt: "O que você aprendeu com isso?", es: "¿Qué aprendiste de esto?" })}
              className="min-h-20"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={recordHarvest.isPending}>
              {recordHarvest.isPending ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." }) : t({ en: "Save Harvest", pt: "Salvar Colheita", es: "Guardar Cosecha" })}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowHarvestForm(false)}>
              {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
            </Button>
          </div>
        </form>
      )}

      {hasHarvest && (
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-bold">{t({ en: "Actual Harvest", pt: "Colheita Real", es: "Cosecha Real" })}</h3>
            {entry.outcomeMatch && (
              <Badge variant={
                entry.outcomeMatch === 'better' ? 'default' :
                entry.outcomeMatch === 'as_predicted' ? 'secondary' :
                'outline'
              }>
                {entry.outcomeMatch.replace('_', ' ')}
              </Badge>
            )}
            {entry.accuracyRating && (
              <Badge variant="outline">
                {t({ en: `AI Accuracy: ${entry.accuracyRating}/5`, pt: `Precisão da IA: ${entry.accuracyRating}/5`, es: `Precisión de la IA: ${entry.accuracyRating}/5` })}
              </Badge>
            )}
          </div>
          <p className="text-foreground mb-4">{entry.actualHarvest}</p>
          
          {entry.userReflection && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">{t({ en: "Your Reflection:", pt: "Sua Reflexão:", es: "Tu Reflexión:" })}</p>
              <p className="text-sm text-muted-foreground">{entry.userReflection}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
