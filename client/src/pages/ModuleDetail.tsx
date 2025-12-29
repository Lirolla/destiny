import { useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Circle, ArrowLeft, Target } from "lucide-react";

/**
 * Module Detail Page
 * 
 * Individual module learning interface with:
 * - Module content display
 * - Practice day tracking
 * - Challenge completion
 * - Reflection entries
 */

export default function ModuleDetail() {
  const [, params] = useRoute("/modules/:id");
  const moduleId = params?.id ? parseInt(params.id) : 0;

  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState("");

  const { data: module, isLoading } = trpc.modules.getById.useQuery(
    { moduleId },
    { enabled: moduleId > 0 }
  );

  const utils = trpc.useUtils();

  const completeDay = trpc.modules.complete.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      utils.modules.list.invalidate();
    },
  });

  const completeChallenge = trpc.modules.completeChallenge.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      utils.modules.list.invalidate();
    },
  });

  const addReflection = trpc.modules.saveReflection.useMutation({
    onSuccess: () => {
      utils.modules.getById.invalidate();
      setShowReflection(false);
      setReflectionText("");
    },
  });

  const handleCompleteDay = (dayNumber: number) => {
    completeDay.mutate({ moduleId });
  };

  const handleCompleteChallenge = () => {
    completeChallenge.mutate({ moduleId });
  };

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    addReflection.mutate({
      moduleId,
      reflection: reflectionText,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The module you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/modules">← Back to Learning Path</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (module as any).progress || { completedDays: 0, challengeCompleted: false, reflections: [] };
  const totalDays = (module as any).practiceDays || 7;
  const completionPercentage = (progress.completedDays / totalDays) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/modules">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{(module as any).title}</h1>
                  <Badge variant="secondary">Module {(module as any).moduleNumber}</Badge>
                </div>
                <p className="text-muted-foreground">{(module as any).corePrinciple || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {/* Progress Overview */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Progress</h2>
            <span className="text-2xl font-bold text-primary">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress value={completionPercentage} className="mb-4" />
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Days Completed</p>
              <p className="text-2xl font-bold">
                {progress.completedDays}/{totalDays}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Challenge</p>
              <p className="text-2xl font-bold">
                {progress.challengeCompleted ? "✓" : "○"}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Reflections</p>
              <p className="text-2xl font-bold">{(progress as any).reflections?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* Module Content */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Module Content</h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-4 text-foreground leading-relaxed">
              <div>
                <h3 className="font-bold mb-2">Core Principle</h3>
                <p>{(module as any).corePrinciple}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Mental Model</h3>
                <p>{(module as any).mentalModel}</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Daily Practice</h3>
                <p>{(module as any).dailyPractice}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Practice Days */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Practice Days</h2>
          <p className="text-muted-foreground mb-6">
            Complete one practice day each day for {totalDays} days to internalize this module's teachings.
          </p>
          <div className="space-y-3">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNumber) => {
              const isCompleted = progress.completedDays >= dayNumber;
              return (
                <div
                  key={dayNumber}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    isCompleted
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-semibold">Day {dayNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {isCompleted ? "Completed" : "Not started"}
                      </p>
                    </div>
                  </div>
                  {!isCompleted && progress.completedDays === dayNumber - 1 && (
                    <Button
                      onClick={() => handleCompleteDay(dayNumber)}
                      disabled={completeDay.isPending}
                      size="sm"
                    >
                      Complete Day {dayNumber}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Challenge */}
        {(module as any).decisionChallenge && (
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Module Challenge</h2>
            </div>
            <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary mb-6">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {(module as any).decisionChallenge}
              </p>
            </div>
            {!progress.challengeCompleted ? (
              <Button
                onClick={handleCompleteChallenge}
                disabled={completeChallenge.isPending || progress.completedDays < totalDays}
                size="lg"
              >
                {progress.completedDays < totalDays
                  ? `Complete all ${totalDays} practice days first`
                  : "Mark Challenge as Complete"}
              </Button>
            ) : (
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                <p className="font-semibold">Challenge Completed!</p>
              </div>
            )}
          </Card>
        )}

        {/* Reflections */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Your Reflections</h2>
          
          {!showReflection && (
            <Button onClick={() => setShowReflection(true)} className="mb-6">
              Add Reflection
            </Button>
          )}

          {showReflection && (
            <form onSubmit={handleSubmitReflection} className="mb-8 space-y-4">
              <Textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="What insights did you gain from this module? How will you apply these teachings?"
                className="min-h-32"
                required
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={addReflection.isPending}>
                  {addReflection.isPending ? "Saving..." : "Save Reflection"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReflection(false);
                    setReflectionText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {(progress as any).reflections && (progress as any).reflections.length > 0 ? (
            <div className="space-y-4">
              {(progress as any).reflections.map((reflection: any, index: number) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(reflection.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-foreground">{reflection.text}</p>
                </div>
              ))}
            </div>
          ) : (
            !showReflection && (
              <p className="text-muted-foreground text-center py-8">
                No reflections yet. Add your first reflection to track your insights.
              </p>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
