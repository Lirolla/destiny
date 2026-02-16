import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Plus, Users, Calendar, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Challenges() {
  const { t } = useLanguage();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  // Fetch challenges
  const { data: challenges, isLoading: challengesLoading } = trpc.challenges.list.useQuery(
    undefined,
    {  }
  );

  // Mutations
  const utils = trpc.useUtils();
  const createMutation = trpc.challenges.create.useMutation({
    onSuccess: () => {
      utils.challenges.list.invalidate();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success(t({ en: "Challenge created", pt: "Desafio criado", es: "Desafío creado" }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const joinMutation = trpc.challenges.join.useMutation({
    onSuccess: () => {
      utils.challenges.list.invalidate();
      toast.success(t({ en: "Joined challenge", pt: "Entrou no desafio", es: "Te uniste al desafío" }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = trpc.challenges.deleteChallenge.useMutation({
    onSuccess: () => {
      utils.challenges.list.invalidate();
      toast.success(t({ en: "Challenge deleted", pt: "Desafio excluído", es: "Desafío eliminado" }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setIsPrivate(true);
  };

  const handleCreate = () => {
    if (!name || !startDate || !endDate) {
      toast.error(t({ en: "Please fill in all required fields", pt: "Preencha todos os campos obrigatórios", es: "Por favor completa todos los campos requeridos" }));
      return;
    }

    createMutation.mutate({
      name,
      description,
      challengeType: "daily_consistency",
      startDate,
      endDate,
      isPrivate,
    });
  };

  if (challengesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">{t({ en: "Loading challenges...", pt: "Carregando desafios...", es: "Cargando desafíos..." })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t({ en: "Challenges", pt: "Desafios", es: "Desafíos" })}
        subtitle={t({ en: "Group challenges & competitions", pt: "Desafios em grupo e competições", es: "Desafíos grupales y competencias" })}
        showBack
      />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Challenges You Created */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t({ en: "Your Challenges", pt: "Seus Desafios", es: "Tus Desafíos" })}</h2>
          {challenges?.created && challenges.created.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.created.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{challenge.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {challenge.description || t({ en: "No description", pt: "Sem descrição", es: "Sin descripción" })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="text-muted-foreground/40 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t({ en: "Delete Challenge", pt: "Excluir Desafio", es: "Eliminar Desafío" })}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t({ en: `Are you sure you want to delete "${challenge.name}"? This action cannot be undone.`, pt: `Tem certeza que deseja excluir "${challenge.name}"? Esta ação não pode ser desfeita.`, es: `¿Estás seguro de que deseas eliminar "${challenge.name}"? Esta acción no se puede deshacer.` })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t({ en: "Cancel", pt: "Cancelar", es: "Cancelar" })}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate({ id: challenge.id })}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {t({ en: "Delete", pt: "Excluir", es: "Eliminar" })}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{t({ en: "Private challenge", pt: "Desafio privado", es: "Desafío privado" })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{challenge.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {t({ en: "You haven't created any challenges yet", pt: "Você ainda não criou nenhum desafio", es: "Aún no has creado ningún desafío" })}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t({ en: "Create Your First Challenge", pt: "Crie Seu Primeiro Desafio", es: "Crea Tu Primer Desafío" })}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Challenges You Joined */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t({ en: "Joined Challenges", pt: "Desafios que Participou", es: "Desafíos Unidos" })}</h2>
          {challenges?.joined && challenges.joined.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.joined.map((participation) => (
                <Card key={participation.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{t({ en: "Challenge", pt: "Desafio", es: "Desafío" })} #{participation.sessionId}</CardTitle>
                    <CardDescription className="text-xs">
                      {t({ en: "Status", pt: "Status", es: "Estado" })}: {participation.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {t({ en: "Joined", pt: "Entrou em", es: "Se unió el" })}: {new Date(participation.joinedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t({ en: "You haven't joined any challenges yet", pt: "Você ainda não participou de nenhum desafio", es: "Aún no te has unido a ningún desafío" })}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">{t({ en: "How Group Challenges Work", pt: "Como Funcionam os Desafios em Grupo", es: "Cómo Funcionan los Desafíos Grupales" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <p>
                <strong>{t({ en: "Create or join:", pt: "Crie ou participe:", es: "Crea o únete:" })}</strong>{" "}
                {t({ en: "Set up a challenge with specific start/end dates, or join one created by your Inner Circle.", pt: "Configure um desafio com datas de início/fim, ou participe de um criado pelo seu Círculo Interno.", es: "Configura un desafío con fechas de inicio/fin, o únete a uno creado por tu Círculo Interno." })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <p>
                <strong>{t({ en: "Daily practice:", pt: "Prática diária:", es: "Práctica diaria:" })}</strong>{" "}
                {t({ en: "Complete your daily will cycles during the challenge period to track progress.", pt: "Complete seus ciclos diários de vontade durante o período do desafio para acompanhar o progresso.", es: "Completa tus ciclos diarios de voluntad durante el período del desafío para seguir tu progreso." })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <p>
                <strong>{t({ en: "Collective accountability:", pt: "Responsabilidade coletiva:", es: "Responsabilidad colectiva:" })}</strong>{" "}
                {t({ en: "See group progress without exposing individual content—mechanical observation, not social comparison.", pt: "Veja o progresso do grupo sem expor conteúdo individual—observação mecânica, não comparação social.", es: "Ve el progreso del grupo sin exponer contenido individual—observación mecánica, no comparación social." })}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
