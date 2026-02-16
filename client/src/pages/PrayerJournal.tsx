import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Lightbulb, Zap, Target, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Prayer Journal
 * 
 * Four-Part Prayer Protocol:
 * 1. Gratitude - What am I grateful for?
 * 2. Clarity - What do I need to see clearly?
 * 3. Strength - What do I need courage/power for?
 * 4. Alignment - How can I align with truth/purpose?
 */

export default function PrayerJournal() {
  const { t, language } = useLanguage();
  const [gratitude, setGratitude] = useState("");
  const [clarity, setClarity] = useState("");
  const [strength, setStrength] = useState("");
  const [alignment, setAlignment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: todaysPrayer } = trpc.prayer.getToday.useQuery();
  const { data: entries, isLoading } = trpc.prayer.list.useQuery({ limit: 20 });
  const utils = trpc.useUtils();

  const deleteMutation = trpc.prayer.delete.useMutation({
    onSuccess: () => {
      utils.prayer.list.invalidate();
      utils.prayer.getToday.invalidate();
      toast.success(t({ en: "Prayer entry deleted", pt: "Oração excluída", es: "Oración eliminada" }));
    },
  });

  const createEntry = trpc.prayer.create.useMutation({
    onSuccess: () => {
      utils.prayer.list.invalidate();
      utils.prayer.getToday.invalidate();
      setGratitude("");
      setClarity("");
      setStrength("");
      setAlignment("");
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createEntry.mutate({
      prayerDate: new Date().toISOString().split('T')[0],
      gratitude: gratitude || undefined,
      clarity: clarity || undefined,
      strength: strength || undefined,
      alignment: alignment || undefined,
    });
  };

  const hasTodaysPrayer = !!todaysPrayer;

  const dateLocale = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t({ en: "Prayer Journal", pt: "Diário de Oração", es: "Diario de Oración" })}
        subtitle={t({ en: "Four-part prayer protocol", pt: "Protocolo de oração em quatro partes", es: "Protocolo de oración en cuatro partes" })}
        showBack
      />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Today's Prayer */}
        {hasTodaysPrayer && !showForm && (
          <Card className="p-8 mb-8 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t({ en: "Today's Prayer", pt: "Oração de Hoje", es: "Oración de Hoy" })}</h2>
              <Badge variant="default">{t({ en: "Complete", pt: "Completa", es: "Completa" })}</Badge>
            </div>
            <PrayerContent prayer={todaysPrayer} t={t} />
          </Card>
        )}

        {/* Create New Entry */}
        {!hasTodaysPrayer && !showForm && (
          <Card className="p-8 mb-8 text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t({ en: "Today's Prayer", pt: "Oração de Hoje", es: "Oración de Hoy" })}</h2>
            <p className="text-muted-foreground mb-6">
              {t({ en: "Take a moment to connect with gratitude, clarity, strength, and alignment", pt: "Reserve um momento para se conectar com gratidão, clareza, força e alinhamento", es: "Tómate un momento para conectar con gratitud, claridad, fuerza y alineación" })}
            </p>
            <Button onClick={() => setShowForm(true)} size="lg">
              {t({ en: "Begin Prayer Protocol", pt: "Iniciar Protocolo de Oração", es: "Iniciar Protocolo de Oración" })}
            </Button>
          </Card>
        )}

        {showForm && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{t({ en: "Four-Part Prayer Protocol", pt: "Protocolo de Oração em Quatro Partes", es: "Protocolo de Oración en Cuatro Partes" })}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Gratitude */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <Label htmlFor="gratitude" className="text-lg font-bold">
                    {t({ en: "1. Gratitude", pt: "1. Gratidão", es: "1. Gratitud" })}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t({ en: "What am I grateful for today? What blessings do I acknowledge?", pt: "Pelo que sou grato hoje? Que bênçãos reconheço?", es: "¿Por qué estoy agradecido hoy? ¿Qué bendiciones reconozco?" })}
                </p>
                <Textarea
                  id="gratitude"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  placeholder={t({ en: "I'm grateful for...", pt: "Sou grato por...", es: "Estoy agradecido por..." })}
                  className="min-h-24"
                />
              </div>

              {/* 2. Clarity */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <Label htmlFor="clarity" className="text-lg font-bold">
                    {t({ en: "2. Clarity", pt: "2. Clareza", es: "2. Claridad" })}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t({ en: "What do I need to see clearly? Where am I confused or uncertain?", pt: "O que preciso ver com clareza? Onde estou confuso ou incerto?", es: "¿Qué necesito ver con claridad? ¿Dónde estoy confundido o inseguro?" })}
                </p>
                <Textarea
                  id="clarity"
                  value={clarity}
                  onChange={(e) => setClarity(e.target.value)}
                  placeholder={t({ en: "Help me see...", pt: "Ajude-me a ver...", es: "Ayúdame a ver..." })}
                  className="min-h-24"
                />
              </div>

              {/* 3. Strength */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <Label htmlFor="strength" className="text-lg font-bold">
                    {t({ en: "3. Strength", pt: "3. Força", es: "3. Fuerza" })}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t({ en: "What do I need courage or power for? Where do I need to act?", pt: "Para que preciso de coragem ou poder? Onde preciso agir?", es: "¿Para qué necesito coraje o poder? ¿Dónde necesito actuar?" })}
                </p>
                <Textarea
                  id="strength"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder={t({ en: "Give me strength to...", pt: "Dê-me força para...", es: "Dame fuerza para..." })}
                  className="min-h-24"
                />
              </div>

              {/* 4. Alignment */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <Label htmlFor="alignment" className="text-lg font-bold">
                    {t({ en: "4. Alignment", pt: "4. Alinhamento", es: "4. Alineación" })}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t({ en: "How can I align my will with truth and purpose? What is the right path?", pt: "Como posso alinhar minha vontade com a verdade e o propósito? Qual é o caminho certo?", es: "¿Cómo puedo alinear mi voluntad con la verdad y el propósito? ¿Cuál es el camino correcto?" })}
                </p>
                <Textarea
                  id="alignment"
                  value={alignment}
                  onChange={(e) => setAlignment(e.target.value)}
                  placeholder={t({ en: "Align me with...", pt: "Alinhe-me com...", es: "Alinéame con..." })}
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={createEntry.isPending}>
                  {createEntry.isPending
                    ? t({ en: "Saving...", pt: "Salvando...", es: "Guardando..." })
                    : t({ en: "Save Prayer", pt: "Salvar Oração", es: "Guardar Oración" })}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Prayer History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t({ en: "Prayer History", pt: "Histórico de Orações", es: "Historial de Oraciones" })}</h2>
          
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t({ en: "Loading prayers...", pt: "Carregando orações...", es: "Cargando oraciones..." })}</p>
            </div>
          )}

          {entries?.map((entry) => {
            const isToday = entry.prayerDate === new Date().toISOString().split('T')[0];
            if (isToday && hasTodaysPrayer) return null;
            
            return (
              <Card key={entry.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">
                    {new Date(entry.prayerDate).toLocaleDateString(dateLocale, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-muted-foreground/40 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t({ en: "Delete Prayer Entry", pt: "Excluir Oração", es: "Eliminar Oración" })}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t({ en: "Are you sure you want to delete this prayer entry? This action cannot be undone.", pt: "Tem certeza de que deseja excluir esta oração? Esta ação não pode ser desfeita.", es: "¿Estás seguro de que deseas eliminar esta oración? Esta acción no se puede deshacer." })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: entry.id })}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t({ en: "Delete", pt: "Excluir", es: "Eliminar" })}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <PrayerContent prayer={entry} t={t} />
              </Card>
            );
          })}

          {!isLoading && entries?.length === 0 && !showForm && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {t({ en: "No prayers yet. Begin your first prayer to start your journal.", pt: "Nenhuma oração ainda. Comece sua primeira oração para iniciar seu diário.", es: "Aún no hay oraciones. Comienza tu primera oración para iniciar tu diario." })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface PrayerContentProps {
  prayer: any;
  t: (labels: { en: string; pt?: string; es?: string }) => string;
}

function PrayerContent({ prayer, t }: PrayerContentProps) {
  return (
    <div className="space-y-6">
      {prayer.gratitude && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <h4 className="font-semibold">{t({ en: "Gratitude", pt: "Gratidão", es: "Gratitud" })}</h4>
          </div>
          <p className="text-muted-foreground pl-6">{prayer.gratitude}</p>
        </div>
      )}

      {prayer.clarity && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold">{t({ en: "Clarity", pt: "Clareza", es: "Claridad" })}</h4>
          </div>
          <p className="text-muted-foreground pl-6">{prayer.clarity}</p>
        </div>
      )}

      {prayer.strength && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <h4 className="font-semibold">{t({ en: "Strength", pt: "Força", es: "Fuerza" })}</h4>
          </div>
          <p className="text-muted-foreground pl-6">{prayer.strength}</p>
        </div>
      )}

      {prayer.alignment && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <h4 className="font-semibold">{t({ en: "Alignment", pt: "Alinhamento", es: "Alineación" })}</h4>
          </div>
          <p className="text-muted-foreground pl-6">{prayer.alignment}</p>
        </div>
      )}
    </div>
  );
}
