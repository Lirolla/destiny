import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, RotateCcw, CheckCircle2, XCircle, Minus, Plus, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function Flashcards() {
  const [location] = useLocation();
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardDeck, setNewCardDeck] = useState("Destiny Hacking");
  
  const { data: dueCards, refetch: refetchDue } = trpc.flashcards.getDue.useQuery({ limit: 20 });
  const { data: stats, refetch: refetchStats } = trpc.flashcards.getStats.useQuery();
  const reviewMutation = trpc.flashcards.review.useMutation();
  
  const createMutation = trpc.flashcards.create.useMutation({
    onSuccess: () => {
      toast.success("Flashcard created!");
      setShowCreateDialog(false);
      setNewCardFront("");
      setNewCardBack("");
      refetchDue();
      refetchStats();
    },
    onError: (error) => {
      toast.error(`Failed to create flashcard: ${error.message}`);
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
        toast.success("Review session complete!");
        refetchDue();
        refetchStats();
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };
  
  const getQualityLabel = (quality: number) => {
    const labels = {
      0: "Complete Blackout",
      1: "Incorrect",
      2: "Incorrect (Easy Recall)",
      3: "Correct (Hard)",
      4: "Correct (Hesitation)",
      5: "Perfect",
    };
    return labels[quality as keyof typeof labels];
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Flashcard Review</h1>
              <p className="text-muted-foreground">
                Spaced repetition learning from your highlights
              </p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Flashcard
          </Button>
        </div>
      </div>
      
      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Flashcard</DialogTitle>
            <DialogDescription>
              Add a new flashcard to your collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Front (Question)</label>
              <Textarea
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder="What is the question?"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Back (Answer)</label>
              <Textarea
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder="What is the answer?"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Deck Name (Optional)</label>
              <Input
                value={newCardDeck}
                onChange={(e) => setNewCardDeck(e.target.value)}
                placeholder="Destiny Hacking"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!newCardFront.trim() || !newCardBack.trim()) {
                    toast.error("Please fill in both front and back");
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
                {createMutation.isPending ? "Creating..." : "Create Flashcard"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats?.totalCards || 0}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{stats?.dueCount || 0}</div>
              <div className="text-sm text-muted-foreground">Due for Review</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{stats?.reviewedCount || 0}</div>
              <div className="text-sm text-muted-foreground">Reviewed</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{stats?.avgEaseFactor.toFixed(1) || "2.5"}</div>
              <div className="text-sm text-muted-foreground">Avg Ease Factor</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Review Session */}
      {totalDue > 0 ? (
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Card {currentIndex + 1} of {totalDue}
              </span>
              <span className="font-medium">{progress.toFixed(0)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Flashcard */}
          <Card className="min-h-[400px]">
            <CardContent className="p-12 flex flex-col items-center justify-center space-y-8">
              {/* Card Content */}
              <div className="text-center space-y-6 w-full max-w-2xl">
                <Badge variant="outline">
                  {showAnswer ? "Answer" : "Question"}
                </Badge>
                
                <div className="text-2xl font-medium leading-relaxed">
                  {showAnswer ? currentCard?.back : currentCard?.front}
                </div>
                
                {currentCard?.pageNumber && (
                  <div className="text-sm text-muted-foreground">
                    Page {currentCard.pageNumber}
                  </div>
                )}
              </div>
              
              {/* Flip Button */}
              {!showAnswer && (
                <Button
                  size="lg"
                  onClick={() => setShowAnswer(true)}
                  className="gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Show Answer
                </Button>
              )}
              
              {/* Rating Buttons */}
              {showAnswer && (
                <div className="space-y-4 w-full max-w-2xl">
                  <div className="text-sm text-center text-muted-foreground">
                    How well did you remember?
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleReview(0)}
                      className="flex-col h-auto py-4 gap-2 hover:bg-red-500/10 hover:border-red-500"
                    >
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold">Again</span>
                      <span className="text-xs text-muted-foreground">Complete blackout</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleReview(2)}
                      className="flex-col h-auto py-4 gap-2 hover:bg-orange-500/10 hover:border-orange-500"
                    >
                      <Minus className="h-5 w-5 text-orange-500" />
                      <span className="font-semibold">Hard</span>
                      <span className="text-xs text-muted-foreground">Difficult recall</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleReview(3)}
                      className="flex-col h-auto py-4 gap-2 hover:bg-yellow-500/10 hover:border-yellow-500"
                    >
                      <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">Good</span>
                      <span className="text-xs text-muted-foreground">Some hesitation</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleReview(4)}
                      className="flex-col h-auto py-4 gap-2 hover:bg-blue-500/10 hover:border-blue-500"
                    >
                      <Plus className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">Easy</span>
                      <span className="text-xs text-muted-foreground">Quick recall</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleReview(5)}
                      className="flex-col h-auto py-4 gap-2 hover:bg-green-500/10 hover:border-green-500 md:col-span-2"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">Perfect</span>
                      <span className="text-xs text-muted-foreground">Instant recall</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold">All caught up!</h3>
              <p className="text-muted-foreground mt-2">
                No flashcards due for review right now. Great job!
              </p>
            </div>
            <Button onClick={() => refetchDue()} variant="outline">
              Check Again
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Spaced Repetition</CardTitle>
          <CardDescription>
            This system uses the SM-2 algorithm to optimize your learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Flashcards are automatically scheduled for review at optimal intervals based on how well you remember them. 
            The better you know a card, the longer the interval before you see it again.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Rating Guide:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Again:</strong> Couldn't remember at all</li>
                <li>• <strong>Hard:</strong> Remembered with difficulty</li>
                <li>• <strong>Good:</strong> Remembered correctly</li>
                <li>• <strong>Easy:</strong> Remembered easily</li>
                <li>• <strong>Perfect:</strong> Instant recall</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Review Intervals:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• First review: 1 day</li>
                <li>• Second review: 6 days</li>
                <li>• Subsequent: Multiplied by ease factor</li>
                <li>• Failed cards: Reset to 1 day</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
