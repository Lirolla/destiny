import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserPlus, CheckCircle2, Clock, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export default function InnerCircle() {
  const { t } = useLanguage();

  // Fetch data
  const { data: connections, isLoading: connectionsLoading } = trpc.innerCircle.listConnections.useQuery(
    undefined,
    {  }
  );

  const { data: sharedStates } = trpc.innerCircle.getSharedStates.useQuery(
    undefined,
    {  }
  );

  // Mutations
  const utils = trpc.useUtils();
  const acceptInviteMutation = trpc.innerCircle.acceptInvite.useMutation({
    onSuccess: () => {
      utils.innerCircle.listConnections.invalidate();
      utils.innerCircle.getSharedStates.invalidate();
      toast.success(t({ en: "Connection accepted", pt: "Conexão aceita", es: "Conexión aceptada" }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAcceptInvite = (connectionId: number) => {
    acceptInviteMutation.mutate({ connectionId });
  };

  const pendingInvites = connections?.filter(c => c.status === "pending") || [];
  const activeConnections = connections?.filter(c => c.status === "accepted") || [];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t({ en: "Inner Circle", pt: "Círculo Íntimo", es: "Círculo Íntimo" })} subtitle={t({ en: "Accountability partners", pt: "Parceiros de responsabilidade", es: "Socios de responsabilidad" })} showBack />

      {/* Main Content */}
      <main className="px-4 py-4 space-y-4 pb-24">
        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t({ en: "Pending Invites", pt: "Convites Pendentes", es: "Invitaciones Pendientes" })}</CardTitle>
              <CardDescription>{t({ en: "Connection requests waiting for your response", pt: "Pedidos de conexão aguardando sua resposta", es: "Solicitudes de conexión esperando tu respuesta" })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingInvites.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{t({ en: "Connection Request", pt: "Pedido de Conexão", es: "Solicitud de Conexión" })}</div>
                        <div className="text-xs text-muted-foreground">
                          User ID: {connection.invitedBy}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvite(connection.id)}
                      disabled={acceptInviteMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t({ en: "Accept", pt: "Aceitar", es: "Aceptar" })}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Connections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t({ en: "Active Connections", pt: "Conexões Ativas", es: "Conexiones Activas" })}</CardTitle>
                <CardDescription>
                  {t({ en: "People you share emotional state summaries with", pt: "Pessoas com quem você compartilha resumos de estado emocional", es: "Personas con las que compartes resúmenes de estado emocional" })}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {activeConnections.length} {activeConnections.length === 1 ? t({ en: "connection", pt: "conexão", es: "conexión" }) : t({ en: "connections", pt: "conexões", es: "conexiones" })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {connectionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">{t({ en: "Loading connections...", pt: "Carregando conexões...", es: "Cargando conexiones..." })}</p>
              </div>
            ) : activeConnections.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium mb-1">{t({ en: "No connections yet", pt: "Nenhuma conexão ainda", es: "Aún no hay conexiones" })}</p>
                  <p className="text-sm text-muted-foreground">
                    {t({ en: "Inner Circle is invite-only. Share state summaries (not content) with trusted accountability partners.", pt: "O Círculo Íntimo é apenas para convidados. Compartilhe resumos de estado (não conteúdo) com parceiros de responsabilidade confiáveis.", es: "El Círculo Íntimo es solo por invitación. Comparte resúmenes de estado (no contenido) con socios de responsabilidad de confianza." })}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground max-w-md mx-auto">
                  <strong>{t({ en: "Note:", pt: "Nota:", es: "Nota:" })}</strong> {t({ en: "Connection invites are currently sent by user ID. A full invite system with email/codes will be added in a future update.", pt: "Os convites de conexão são enviados atualmente por ID de usuário. Um sistema de convite completo com e-mail/códigos será adicionado em uma atualização futura.", es: "Las invitaciones de conexión se envían actualmente por ID de usuario. Se agregará un sistema de invitación completo con correo electrónico/códigos en una futura actualización." })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeConnections.map((connection) => {
                  const sharedState = sharedStates?.find(
                    s => s.userId === connection.connectedUserId
                  );

                  return (
                    <Card key={connection.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                User {connection.connectedUserId}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {t({ en: "Connected since", pt: "Conectado desde", es: "Conectado desde" })}{' '}
                                {connection.acceptedAt
                                  ? new Date(connection.acceptedAt).toLocaleDateString()
                                  : t({ en: "recently", pt: "recentemente", es: "recientemente" })}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {sharedState ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t({ en: "Today's Cycle:", pt: "Ciclo Diário:", es: "Ciclo Diario:" })}</span>
                              {sharedState.cycleCompleted ? (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  {t({ en: "Complete", pt: "Completo", es: "Completo" })}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {t({ en: "In Progress", pt: "Em Progresso", es: "En Progreso" })}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{t({ en: "Emotional Axes:", pt: "Eixos Emocionais:", es: "Ejes Emocionales:" })}</span>
                              <span className="font-medium">{sharedState.axisCount}</span>
                            </div>
                            {sharedState.lastActive && (
                              <div className="text-xs text-muted-foreground">
                                {t({ en: "Last active:", pt: "Última atividade:", es: "Última actividad:" })}{' '}
                                {new Date(sharedState.lastActive).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {t({ en: "No shared state available", pt: "Nenhum estado compartilhado disponível", es: "No hay estado compartido disponible" })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Challenges CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{t({ en: "Group Challenges", pt: "Desafios em Grupo", es: "Desafíos de Grupo" })}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t({ en: "Create or join accountability challenges with your Inner Circle. Track collective progress toward shared goals without exposing individual content.", pt: "Crie ou participe de desafios de responsabilidade com seu Círculo Íntimo. Acompanhe o progresso coletivo em direção a metas compartilhadas sem expor o conteúdo individual.", es: "Crea o únete a desafíos de responsabilidad con tu Círculo Íntimo. Sigue el progreso colectivo hacia metas compartidas sin exponer el contenido individual." })}
            </p>
            <Button asChild className="w-full">
              <Link href="/challenges">
                <Trophy className="h-4 w-4 mr-2" />
                {t({ en: "View Challenges", pt: "Ver Desafios", es: "Ver Desafíos" })}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">{t({ en: "How Inner Circle Works", pt: "Como o Círculo Íntimo Funciona", es: "Cómo Funciona el Círculo Íntimo" })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <p>
                <strong>{t({ en: "State, not content:", pt: "Estado, não conteúdo:", es: "Estado, no contenido:" })}</strong> {t({ en: "Connections see your cycle completion status and axis count—not your actual calibrations or reflections.", pt: "As conexões veem o status de conclusão do seu ciclo e a contagem de eixos—não suas calibrações ou reflexões reais.", es: "Las conexiones ven el estado de finalización de tu ciclo y el recuento de ejes, no tus calibraciones o reflexiones reales." })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <p>
                <strong>{t({ en: "Invite-only:", pt: "Apenas para convidados:", es: "Solo por invitación:" })}</strong> {t({ en: "No discovery, no feeds, no likes. You control who sees your practice summary.", pt: "Sem descoberta, sem feeds, sem curtidas. Você controla quem vê o resumo da sua prática.", es: "Sin descubrimientos, sin feeds, sin 'me gusta'. Tú controlas quién ve el resumen de tu práctica." })}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <p>
                <strong>{t({ en: "Mutual accountability:", pt: "Responsabilidade mútua:", es: "Responsabilidad mutua:" })}</strong> {t({ en: "See if your circle completed their daily practice. No judgment, just mechanical observation.", pt: "Veja se o seu círculo completou a prática diária. Sem julgamento, apenas observação mecânica.", es: "Ve si tu círculo completó su práctica diaria. Sin juicios, solo observación mecánica." })}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
