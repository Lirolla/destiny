import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  BookOpen,
  Wand2
} from "lucide-react";
import { toast } from "sonner";

export function AudiobookGeneration() {
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  const { data: primaryVoice } = trpc.voice.getPrimaryModel.useQuery();
  const { data: chapters } = trpc.audiobook.listChapters.useQuery();
  
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState("");
  const [manuscriptText, setManuscriptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateChapterMutation = trpc.audiobook.generateChapter.useMutation({
    onSuccess: () => {
      toast.success("Chapter audio generated successfully!");
      setManuscriptText("");
      setChapterTitle("");
      setChapterNumber(prev => prev + 1);
      setIsGenerating(false);
      setGenerationProgress(0);
    },
    onError: (error) => {
      toast.error(`Failed to generate audio: ${error.message}`);
      setIsGenerating(false);
      setGenerationProgress(0);
    },
  });

  // Only allow admin to access this page
  if (userLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Restricted:</strong> This page is only accessible to the book author for audiobook generation.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!manuscriptText.trim() || !chapterTitle.trim()) {
      toast.error("Please provide chapter title and manuscript text");
      return;
    }

    if (!primaryVoice) {
      toast.error("No voice model found. Please create your voice clone first.");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 3000);

      // Call backend to generate audio
      await generateChapterMutation.mutateAsync({
        chapterNumber,
        title: chapterTitle,
        manuscriptText,
      });
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
    } catch (error) {
      console.error("Generation error:", error);
      // Error handling is done in mutation onError
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Audiobook Generation</h1>
            <p className="text-muted-foreground">
              Generate audiobook chapters using your cloned voice
            </p>
          </div>
        </div>
      </div>

      {/* Voice Status */}
      <Alert>
        {primaryVoice ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <strong>Voice Ready:</strong> Using "{primaryVoice.modelName}" for narration
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>No Voice Model:</strong> Please create your voice clone in the Voice Cloning page first
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Generation Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Chapter Audio</CardTitle>
          <CardDescription>
            Paste your manuscript text and generate the audiobook narration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chapterNumber">Chapter Number</Label>
              <Input
                id="chapterNumber"
                type="number"
                min={1}
                max={14}
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value))}
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapterTitle">Chapter Title</Label>
              <Input
                id="chapterTitle"
                placeholder="e.g., The Emotional Sliders"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manuscript">Manuscript Text</Label>
            <Textarea
              id="manuscript"
              placeholder="Paste the chapter manuscript here..."
              value={manuscriptText}
              onChange={(e) => setManuscriptText(e.target.value)}
              disabled={isGenerating}
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {manuscriptText.length} characters • ~{Math.ceil(manuscriptText.length / 1000)} minutes of audio
            </p>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generating audio...</span>
                <span className="font-medium">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !primaryVoice || !manuscriptText.trim() || !chapterTitle.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Audio...
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Generate Chapter {chapterNumber}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Chapters */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Chapters</CardTitle>
          <CardDescription>
            All audiobook chapters with generated narration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!chapters || chapters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No chapters generated yet. Start by generating Chapter 1 above.
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter: any) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        Chapter {chapter.chapterNumber}: {chapter.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {chapter.duration ? `${Math.floor(chapter.duration / 60)} minutes` : "Duration unknown"}
                      </div>
                    </div>
                  </div>
                  {chapter.audioUrl && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
