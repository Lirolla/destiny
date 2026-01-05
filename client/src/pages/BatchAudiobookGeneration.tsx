import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wand2,
  FileText,
  Play
} from "lucide-react";
import { toast } from "sonner";

interface ChapterManuscript {
  chapterNumber: number;
  title: string;
  text: string;
  status: "pending" | "generating" | "completed" | "error";
  error?: string;
}

export function BatchAudiobookGeneration() {
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  const { data: primaryVoice } = trpc.voice.getPrimaryModel.useQuery();
  
  const [manuscriptsText, setManuscriptsText] = useState("");
  const [chapters, setChapters] = useState<ChapterManuscript[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  const generateChapterMutation = trpc.audiobook.generateChapter.useMutation();

  const parseManuscripts = () => {
    // Expected format:
    // === Chapter 1: Title ===
    // manuscript text...
    // === Chapter 2: Title ===
    // manuscript text...

    const chapterRegex = /===\s*Chapter\s+(\d+):\s*(.+?)\s*===\s*\n([\s\S]+?)(?=\n===\s*Chapter|\n*$)/gi;
    const matches = Array.from(manuscriptsText.matchAll(chapterRegex));

    if (matches.length === 0) {
      toast.error("No chapters found. Please use the format: === Chapter 1: Title ===");
      return;
    }

    const parsedChapters: ChapterManuscript[] = matches.map(match => ({
      chapterNumber: parseInt(match[1]),
      title: match[2].trim(),
      text: match[3].trim(),
      status: "pending"
    }));

    setChapters(parsedChapters);
    toast.success(`Parsed ${parsedChapters.length} chapters`);
  };

  const generateAll = async () => {
    if (chapters.length === 0) {
      toast.error("Please parse manuscripts first");
      return;
    }

    if (!primaryVoice) {
      toast.error("No voice model found. Please create your voice clone first.");
      return;
    }

    setIsGenerating(true);
    setCurrentChapter(0);

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      setCurrentChapter(i + 1);

      // Update status to generating
      setChapters(prev => prev.map((c, idx) => 
        idx === i ? { ...c, status: "generating" } : c
      ));

      try {
        await generateChapterMutation.mutateAsync({
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          manuscriptText: chapter.text,
        });

        // Update status to completed
        setChapters(prev => prev.map((c, idx) => 
          idx === i ? { ...c, status: "completed" } : c
        ));

        toast.success(`Chapter ${chapter.chapterNumber} generated successfully`);
      } catch (error: any) {
        // Update status to error
        setChapters(prev => prev.map((c, idx) => 
          idx === i ? { ...c, status: "error", error: error.message } : c
        ));

        toast.error(`Failed to generate Chapter ${chapter.chapterNumber}: ${error.message}`);
        
        // Ask if user wants to continue
        const shouldContinue = confirm(`Chapter ${chapter.chapterNumber} failed. Continue with remaining chapters?`);
        if (!shouldContinue) {
          break;
        }
      }
    }

    setIsGenerating(false);
    setCurrentChapter(0);
    toast.success("Batch generation complete!");
  };

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

  const completedCount = chapters.filter(c => c.status === "completed").length;
  const progressPercentage = chapters.length > 0 ? (completedCount / chapters.length) * 100 : 0;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Wand2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Batch Audiobook Generation</h1>
            <p className="text-muted-foreground">
              Generate all 14 chapters at once from your manuscript
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

      {/* Instructions */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Manuscript Format:</strong> Use the following format to separate chapters:
          <pre className="mt-2 p-2 bg-muted rounded text-xs font-mono">
{`=== Chapter 1: The Emotional Sliders ===
Your chapter text here...

=== Chapter 2: Daily Calibration ===
Your chapter text here...`}
          </pre>
        </AlertDescription>
      </Alert>

      {/* Manuscript Input */}
      <Card>
        <CardHeader>
          <CardTitle>Paste All Manuscripts</CardTitle>
          <CardDescription>
            Paste all 14 chapters in the format shown above
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manuscripts">Complete Manuscript</Label>
            <Textarea
              id="manuscripts"
              placeholder="Paste all chapters here using the === Chapter N: Title === format..."
              value={manuscriptsText}
              onChange={(e) => setManuscriptsText(e.target.value)}
              disabled={isGenerating}
              rows={20}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {manuscriptsText.length} characters total
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={parseManuscripts}
              disabled={!manuscriptsText.trim() || isGenerating}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Parse Chapters
            </Button>

            {chapters.length > 0 && (
              <Button
                onClick={generateAll}
                disabled={isGenerating || !primaryVoice}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating ({currentChapter}/{chapters.length})
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Generate All {chapters.length} Chapters
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Progress</CardTitle>
            <CardDescription>
              {completedCount} of {chapters.length} chapters completed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />

            <div className="space-y-2">
              {chapters.map((chapter, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm text-muted-foreground">
                      Ch {chapter.chapterNumber}
                    </div>
                    <div>
                      <div className="font-medium">{chapter.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {chapter.text.length} characters • ~{Math.ceil(chapter.text.length / 1000)} min
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={
                      chapter.status === "completed"
                        ? "default"
                        : chapter.status === "generating"
                        ? "secondary"
                        : chapter.status === "error"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {chapter.status === "generating" && (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    {chapter.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
