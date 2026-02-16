import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, RotateCcw, CheckCircle2, XCircle, Minus, Plus, PlusCircle, Trash2, List, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function Flashcards() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardDeck, setNewCardDeck] = useState("Destiny Hacking");
  const [viewMode, setViewMode] = useState<"review" | "browse">("review");
  const [browseFilter, setBrowseFilter] = useState<"all" | "due" | "reviewed">("all");
  
  const { data: dueCards, refetch: refetchDue } = trpc.flashcards.getDue.useQuery({ limit: 20 });
  const { data: stats, refetch: refetchStats } = trpc.flashcards.getStats.useQuery();
  const reviewMutation = trpc.flashcards.review.useMutation();
  const utils = trpc.useUtils();
  
  const { data: allCards, isLoading: browseLoading } = trpc.flashcards.listAll.useQuery(
    { filter: browseFilter, limit: 200 },
    { enabled: viewMode === "browse" }
  );

  const deleteMutation = trpc.flashcards.delete.useMutation({
    onSuccess: () => {
      utils.flashcards.listAll.invalidate();
      utils.flashcards.getStats.invalidate();
      utils.flashcards.getDue.invalidate();
      refetchStats();
      toast.success(t({ en: "Flashcard deleted", pt: "Flashcard excluído", es: "Tarjeta eliminada" }));
    },
    onError: (error) => {
      toast.error(`${t({ en: "Failed to delete:", pt: "Falha ao excluir:", es: "Error al eliminar:" })} ${error.message}`);
    },
  });
  
  const createMutation = trpc.flashcards.create.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Flashcard created!", pt: "Flashcard criado!", es: "¡Tarjeta creada!" }));
      setShowCreateDialog(false);
      setNewCardFront("");
      setNewCardBack("");
      refetchDue();
      refetchStats();
      if (viewMode === "browse") {
        utils.flashcards.listAll.invalidate();
      }
    },
    onError: (error) => {
      toast.error(`${t({ en: "Failed to create flashcard:", pt: "Falha ao criar flashcard:", es: "Error al crear la tarjeta:" })} ${error.message}`);
    },
  });
  
  // Handle URL parameters for creating flashcard from highlight
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("create") === "true") {
      setNewCardFront(params.get("front") || "");
      setNewCardBack(params.get("back") || "");
      setShowCreateDialog(true);
      // Clean URL
      window.history.replaceState({}, "", "/flashcards");
    }
  }, [location]);
  
  const currentCard = dueCards?.[currentIndex];
  const totalDue = dueCards?.length || 0;
  const progress = totalDue > 0 ? ((currentIndex / totalDue) * 100) : 0;
  
  const handleReview = async (quality: number) => {
    if (!currentCard) return;
    
    try {
      await reviewMutation.mutateAsync({
        flashcardId: currentCard.id,
        quality,
      });
      
      // Move to next card
      if (currentIndex < totalDue - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Review session complete
        toast.success(t({ en: "Review session complete!", pt: "Sessão de revisão completa!", es: "¡Sesión de revisión completa!" }));
        refetchDue();
        refetchStats();
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      toast.error(t({ en: "Failed to submit review", pt: "Falha ao enviar revisão", es: "Error al enviar la revisión" }));
    }
  };

  
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t({ en: "Flashcards", pt: "Flashcards", es: "Tarjetas" })}
        subtitle={t({ en: "Spaced repetition learning", pt: "Aprendizado por repetição espaçada", es: "Aprendizaje por repetición espaciada" })}
        showBack
        rightAction={
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (viewMode === "browse") {
                  setViewMode("review");
                } else {
                  setViewMode("browse");
                  setBrowseFilter("all");
                }
              }}
              className="gap-1 h-8"
            >
              {viewMode === "browse" ? (
                <>
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t({ en: "Review", pt: "Revisar", es: "Revisar" })}
                </>
              ) : (
                <>
                  <List className="h-3.5 w-3.5" />
                  {t({ en: "Browse", pt: "Navegar", es: "Explorar" })}
                </>
              )}
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-1 h-8">
              <PlusCircle className="h-3.5 w-3.5" />
              {t({ en: "New", pt: "Novo", es: "Nuevo" })}
            </Button>
          </div>
        }
      />
      <div className="px-4 py-4 space-y-4 pb-24">
      
      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t({ en: "Create New Flashcard", pt: "Criar Novo Flashcard", es: "Crear Nueva Tarjeta" })}</DialogTitle>
            <DialogDescription>
              {t({ en: "Add a new flashcard to your collection", pt: "Adicione um novo flashcard à sua coleção", es: "Añade una nueva tarjeta a tu colección" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t({ en: "Front (Question)", pt: "Frente (Pergunta)", es: "Frente (Pregunta)" })}</label>
              <Textarea
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder={t({ en: "What is the question?", pt: "Qual é a pergunta?", es: "¿Cuál es la pregunta?" })}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t({ en: "Back (Answer)", pt: "Verso (Resposta)", es: "Reverso (Respuesta)" })}</label>
              <Textarea
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder={t({ en: "What is the answer?", pt: "Qual é a resposta?", es: "¿Cuál es la respuesta?" })}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t({ en: "Deck Name (Optional)", pt: "Nome do Baralho (Opcional)", es: "Nombre del Mazo (Opcional)" })}</label>
              <Input
                value={newCardDeck}
                onChange={(e) => setNewCardDeck(e.target.value)}
                placeholder="Destiny Hacking"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}
              </Button>
              <Button
                onClick={() => {
                  if (!newCardFront.trim() || !newCardBack.trim()) {
                    toast.error(t({ en: "Please fill in both front and back", pt: "Por favor, preencha a frente e o verso", es: "Por favor, rellena el anverso y el reverso" }));
                    return;
                  }
                  createMutation.mutate({
                    front: newCardFront,
                    back: newCardBack,
                    deckName: newCardDeck || undefined,
                  });
                }}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? t({ en: "Creating...", pt: "Criando...", es: "Creando..." }) : t({ en: "Create Flashcard", pt: "Criar Flashcard", es: "Crear Tarjeta" })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Stats Overview — clickable to browse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => { setViewMode("browse"); setBrowseFilter("all"); }}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats?.totalCards || 0}</div>
              <div className="text-sm text-muted-foreground">{t({ en: "Total Cards", pt: "Total de Cartões", es: "Total de Tarjetas" })}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card
          className="cursor-pointer hover:border-orange-500 transition-colors"
          onClick={() => { setViewMode("browse"); setBrowseFilter("due"); }}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{stats?.dueCount || 0}</div>
              <div className="text-sm text-muted-foreground">{t({ en: "Due for Review", pt: "Para Revisar", es: "Pendientes de Revisión" })}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card
          className="cursor-pointer hover:border-green-500 transition-colors"
          onClick={() => { setViewMode("browse"); setBrowseFilter("reviewed"); }}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{stats?.reviewedCount || 0}</div>
              <div className="text-sm text-muted-foreground">{t({ en: "Reviewed", pt: "Revisados", es: "Revisadas" })}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{stats?.avgEaseFactor.toFixed(1) || "2.5"}</div>
              <div className="text-sm text-muted-foreground">{t({ en: "Avg Ease Factor", pt: "Fator de Facilidade Médio", es: "Factor de Facilidad Promedio" })}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Browse View */}
      {viewMode === "browse" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {browseFilter === "all" ? t({ en: "All Cards", pt: "Todos os Cartões", es: "Todas las Tarjetas" }) : browseFilter === "due" ? t({ en: "Due for Review", pt: "Para Revisar", es: "Pendientes de Revisión" }) : t({ en: "Reviewed Cards", pt: "Cartões Revisados", es: "Tarjetas Revisadas" })}
            </h3>
            <div className="flex gap-2">
              {(['all', 'due', 'reviewed'] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={browseFilter === f ? "default" : "outline"}
                  onClick={() => setBrowseFilter(f)}
                  className="capitalize"
                >
                  {f === 'all' ? t({ en: "All", pt: "Todos", es: "Todos" }) : f === 'due' ? t({ en: "Due", pt: "Pendentes", es: "Pendientes" }) : t({ en: "Reviewed", pt: "Revisados", es: "Revisadas" })}
                </Button>
              ))}
            </div>
          </div>
          {browseLoading ? (
            <p>{t({ en: "Loading cards...", pt: "Carregando cartões...", es: "Cargando tarjetas..." })}</p>
          ) : allCards && allCards.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] items-center bg-muted/50 font-medium text-sm text-muted-foreground">
                <div className="px-4 py-2">{t({ en: "Front", pt: "Frente", es: "Frente" })}</div>
                <div className="px-4 py-2 border-l">{t({ en: "Back", pt: "Verso", es: "Reverso" })}</div>
                <div className="px-4 py-2 border-l">{t({ en: "Deck", pt: "Baralho", es: "Mazo" })}</div>
                <div className="px-4 py-2 border-l">{t({ en: "Next Review", pt: "Próxima Revisão", es: "Próxima Revisión" })}</div>
                <div className="px-4 py-2 border-l"></div>
              </div>
              {allCards.map((card) => (
                <div key={card.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] items-center border-t text-sm">
                  <div className="px-4 py-2 truncate">{card.front}</div>
                  <div className="px-4 py-2 truncate border-l">{card.back}</div>
                  <div className="px-4 py-2 truncate border-l">{card.deckName}</div>
                  <div className="px-4 py-2 truncate border-l">{card.nextReviewDate ? new Date(card.nextReviewDate).toLocaleDateString() : '-'}</div>
                  <div className="px-4 py-2 border-l text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t({ en: "Are you sure?", pt: "Você tem certeza?", es: "¿Estás seguro?" })}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t({ en: "This will permanently delete the flashcard. This action cannot be undone.", pt: "Isso excluirá permanentemente o flashcard. Esta ação não pode ser desfeita.", es: "Esto eliminará permanentemente la tarjeta. Esta acción no se puede deshacer." })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate({ flashcardId: card.id })}>
                            {t({ en: "Delete", pt: "Excluir", es: "Eliminar" })}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t({ en: "No cards to display.", pt: "Nenhum cartão para exibir.", es: "No hay tarjetas para mostrar." })}</p>
            </div>
          )}
        </div>
      )}

      {/* Review View */}
      {viewMode === "review" && (
        <>
          {totalDue > 0 && currentCard ? (
            <div className="space-y-4">
              <Card className="min-h-[250px] flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{t({ en: "Review Session", pt: "Sessão de Revisão", es: "Sesión de Revisión" })}</CardTitle>
                    <Badge variant="outline">{currentIndex + 1} / {totalDue}</Badge>
                  </div>
                  <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center px-6">
                  <p className="text-2xl font-semibold">{currentCard.front}</p>
                </CardContent>
              </Card>

              {showAnswer && (
                <Card className="min-h-[150px] bg-muted/30">
                  <CardContent className="flex items-center justify-center text-center p-6">
                    <p className="text-xl">{currentCard.back}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center gap-2">
                {showAnswer ? (
                  <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                    <Button onClick={() => handleReview(1)} variant="destructive" className="gap-1">
                      <XCircle className="h-4 w-4" /> {t({ en: "Again", pt: "De Novo", es: "Otra Vez" })}
                    </Button>
                    <Button onClick={() => handleReview(3)} className="bg-orange-500 hover:bg-orange-600 gap-1">
                      <Minus className="h-4 w-4" /> {t({ en: "Hard", pt: "Difícil", es: "Difícil" })}
                    </Button>
                    <Button onClick={() => handleReview(5)} className="bg-green-500 hover:bg-green-600 gap-1">
                      <Plus className="h-4 w-4" /> {t({ en: "Good", pt: "Bom", es: "Bien" })}
                    </Button>
                    <Button onClick={() => handleReview(7)} className="bg-blue-500 hover:bg-blue-600 gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {t({ en: "Easy", pt: "Fácil", es: "Fácil" })}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setShowAnswer(true)} size="lg" className="w-full max-w-md">
                    {t({ en: "Show Answer", pt: "Mostrar Resposta", es: "Mostrar Respuesta" })}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Brain className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">{t({ en: "All Caught Up!", pt: "Tudo em Dia!", es: "¡Todo al Día!" })}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t({ en: "You have no flashcards due for review today.", pt: "Você não tem flashcards para revisar hoje.", es: "No tienes tarjetas para revisar hoy." })}
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <Button onClick={() => refetchDue()}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t({ en: "Check Again", pt: "Verificar Novamente", es: "Comprobar de Nuevo" })}
                  </Button>
                  <Button onClick={() => { setViewMode("browse"); setBrowseFilter("all"); }} variant="secondary">
                    <List className="mr-2 h-4 w-4" />
                    {t({ en: "Browse All Cards", pt: "Navegar por Todos os Cartões", es: "Explorar Todas las Tarjetas" })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      </div>
    </div>
  );
}
