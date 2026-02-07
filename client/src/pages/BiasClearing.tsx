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

/**
 * Bias Clearing Interface
 * 
 * Daily cognitive fog assessment with AI-generated prompts
 * to help users recognize and clear mental biases.
 */

export default function BiasClearing() {
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
    { value: "confirmation", label: "Confirmation Bias", description: "Only seeing evidence that confirms existing beliefs" },
    { value: "availability", label: "Availability Bias", description: "Overweighting recent or memorable information" },
    { value: "anchoring", label: "Anchoring Bias", description: "Over-relying on the first piece of information" },
    { value: "sunk_cost", label: "Sunk Cost Fallacy", description: "Continuing because of past investment" },
    { value: "negativity", label: "Negativity Bias", description: "Focusing more on negative than positive" },
    { value: "other", label: "Other", description: "Another type of cognitive bias" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Bias Clearing" subtitle="Clear mental fog & biases" showBack />

      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Start New Check */}
        {!showPrompt ? (
          <Card className="p-8 mb-8 text-center">
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Daily Bias Check</h2>
            <p className="text-muted-foreground mb-6">
              Take 3 minutes to identify and clear cognitive biases affecting your decisions today
            </p>
            <Button onClick={() => setShowPrompt(true)} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Prompt
            </Button>
          </Card>
        ) : (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Bias Clearing Exercise</h2>
            
            {/* AI-Generated Prompt */}
            {promptLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating personalized prompt...</p>
              </div>
            )}

            {prompt && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* The Prompt */}
                <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <h3 className="font-bold text-lg">Today's Clearing Prompt</h3>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {prompt}
                  </p>
                </div>

                {/* Bias Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">What type of bias did you notice?</Label>
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
                      Fog Level Before (1-10)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How clouded was your thinking before this exercise?
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
                    <span>Clear</span>
                    <span>Very Foggy</span>
                  </div>
                </div>

                {/* Fog Level After */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <Label className="text-base font-semibold">
                      Fog Level After (1-10)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How clear is your thinking now after recognizing the bias?
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
                    <span>Clear</span>
                    <span>Very Foggy</span>
                  </div>
                </div>

                {/* Improvement Badge */}
                {fogBefore[0] > fogAfter[0] && (
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg text-center">
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      ✨ Clarity improved by {fogBefore[0] - fogAfter[0]} points!
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-semibold">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What did you realize? How will this change your decisions?"
                    className="min-h-32"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={recordCheck.isPending}>
                    {recordCheck.isPending ? "Saving..." : "Save Bias Check"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPrompt(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        )}

        {/* History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Bias Check History</h2>
          
          {checksLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          )}

          {checks?.map((check: any) => (
            <Card key={check.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    {new Date(check.checkDate).toLocaleDateString('en-US', { 
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
                  <p className="text-sm text-muted-foreground">Fog Reduction</p>
                  <p className="text-2xl font-bold text-green-600">
                    -{check.fogLevelBefore - check.fogLevelAfter}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Before</p>
                  <p className="text-xl font-bold">{check.fogLevelBefore}/10</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">After</p>
                  <p className="text-xl font-bold text-green-600">{check.fogLevelAfter}/10</p>
                </div>
              </div>

              {check.notes && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Notes</p>
                  <p className="text-foreground">{check.notes}</p>
                </div>
              )}
            </Card>
          ))}

          {!checksLoading && checks?.length === 0 && !showPrompt && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No bias checks yet. Start your first clearing exercise to improve decision-making.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
