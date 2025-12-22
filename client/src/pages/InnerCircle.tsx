import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserPlus, CheckCircle2, Clock, XCircle, Trophy } from "lucide-react";
import { toast } from "sonner";

export default function InnerCircle() {
  const { user, isLoading: authLoading } = useAuth();

  // Fetch data
  const { data: connections, isLoading: connectionsLoading } = trpc.innerCircle.listConnections.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: sharedStates } = trpc.innerCircle.getSharedStates.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Mutations
  const utils = trpc.useUtils();
  const acceptInviteMutation = trpc.innerCircle.acceptInvite.useMutation({
    onSuccess: () => {
      utils.innerCircle.listConnections.invalidate();
      utils.innerCircle.getSharedStates.invalidate();
      toast.success("Connection accepted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAcceptInvite = (connectionId: number) => {
    acceptInviteMutation.mutate({ connectionId });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>Sign in to access your Inner Circle</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" asChild>
              <a href="/api/oauth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingInvites = connections?.filter(c => c.status === "pending") || [];
  const activeConnections = connections?.filter(c => c.status === "accepted") || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Inner Circle</h1>
                <p className="text-sm text-muted-foreground">
                  Mutual accountability, not social media
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
              <CardDescription>Connection requests waiting for your response</CardDescription>
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
                        <div className="font-medium">Connection Request</div>
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
                      Accept
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
                <CardTitle>Active Connections</CardTitle>
                <CardDescription>
                  People you share emotional state summaries with
                </CardDescription>
              </div>
              <Badge variant="outline">
                {activeConnections.length} {activeConnections.length === 1 ? "connection" : "connections"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {connectionsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Loading connections...</p>
              </div>
            ) : activeConnections.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium mb-1">No connections yet</p>
                  <p className="text-sm text-muted-foreground">
                    Inner Circle is invite-only. Share state summaries (not content) with trusted
                    accountability partners.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground max-w-md mx-auto">
                  <strong>Note:</strong> Connection invites are currently sent by user ID. A full
                  invite system with email/codes will be added in a future update.
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
                                Connected since{" "}
                                {connection.acceptedAt
                                  ? new Date(connection.acceptedAt).toLocaleDateString()
                                  : "recently"}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {sharedState ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Today's Cycle:</span>
                              {sharedState.cycleCompleted ? (
                                <Badge variant="default" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Complete
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  In Progress
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Emotional Axes:</span>
                              <span className="font-medium">{sharedState.axisCount}</span>
                            </div>
                            {sharedState.lastActive && (
                              <div className="text-xs text-muted-foreground">
                                Last active:{" "}
                                {new Date(sharedState.lastActive).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No shared state available
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
              <CardTitle className="text-base">Group Challenges</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create or join accountability challenges with your Inner Circle. Track collective
              progress toward shared goals without exposing individual content.
            </p>
            <Button asChild className="w-full">
              <Link href="/challenges">
                <Trophy className="h-4 w-4 mr-2" />
                View Challenges
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">How Inner Circle Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <p>
                <strong>State, not content:</strong> Connections see your cycle completion status
                and axis count—not your actual calibrations or reflections.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <p>
                <strong>Invite-only:</strong> No discovery, no feeds, no likes. You control who
                sees your practice summary.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <p>
                <strong>Mutual accountability:</strong> See if your circle completed their daily
                practice. No judgment, just mechanical observation.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
