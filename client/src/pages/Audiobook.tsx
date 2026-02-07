import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { AudiobookPlayer } from "@/components/AudiobookPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, BookOpen, FileText, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";
import { PageHeader } from "@/components/PageHeader";

type AudioLanguage = "en" | "pt";

const LANGUAGE_STORAGE_KEY = "audiobook-language";

export function Audiobook() {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [language, setLanguage] = useState<AudioLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved === "pt" ? "pt" : "en") as AudioLanguage;
  });

  const { data: chapters, isLoading } = trpc.audiobook.listChapters.useQuery();
  
  // Get current chapter number for format switching
  const currentChapter = chapters?.find((ch: any) => ch.id === selectedChapterId);
  const currentChapterNumber = currentChapter?.chapterNumber;

  // Persist language preference
  const handleLanguageChange = (lang: AudioLanguage) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };
  
  // Auto-select chapter from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chapterParam = urlParams.get('chapter');
    
    if (chapterParam && chapters && !selectedChapterId) {
      const chapterNumber = parseInt(chapterParam);
      const chapter = chapters.find((ch: any) => ch.chapterNumber === chapterNumber);
      if (chapter && chapter.audioUrl) {
        setSelectedChapterId(chapter.id);
      }
    }
  }, [chapters, selectedChapterId]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Audiobook" subtitle="Listen to the complete book" showBack />
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">Loading audiobook chapters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Audiobook"
        subtitle="Listen to the complete book"
        showBack
        rightAction={
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={currentChapterNumber ? `/book?chapter=${currentChapterNumber}` : "/book"}>
                <BookOpen className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={currentChapterNumber ? `/modules/${currentChapterNumber}` : "/modules"}>
                <FileText className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="px-4 py-4 space-y-4">

      {/* Language Switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center bg-muted/60 rounded-full p-1 gap-0.5">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              language === "en"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-base leading-none">🇬🇧</span>
            <span>English</span>
          </button>
          <button
            onClick={() => handleLanguageChange("pt")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              language === "pt"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-base leading-none">🇧🇷</span>
            <span>Português</span>
          </button>
        </div>
      </div>

      {/* Current Player */}
      {selectedChapterId && (
        <AudiobookPlayer
          chapterId={selectedChapterId}
          language={language}
          onChapterChange={(newId) => {
            const validChapter = chapters?.find(c => c.id === newId);
            if (validChapter) {
              setSelectedChapterId(newId);
            }
          }}
        />
      )}

      {/* Chapter List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Chapters</h2>
          <Badge variant="secondary">
            {chapters?.length || 0} chapters
          </Badge>
        </div>

        {!chapters || chapters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-muted">
                  <Headphones className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Audiobook Chapters Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Clone your voice and generate audiobook narration to get started.
                </p>
                <Button asChild>
                  <Link href="/voice-cloning">
                    Set Up Voice Cloning
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {chapters.map((chapter) => {
              const isSelected = selectedChapterId === chapter.id;
              const hasAudio = language === "pt"
                ? !!(chapter as any).audioUrlPt || !!chapter.audioUrl
                : !!chapter.audioUrl;

              return (
                <Card
                  key={chapter.id}
                  className={`cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : "border-border/50"
                  }`}
                  onClick={() => hasAudio && setSelectedChapterId(chapter.id)}
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      hasAudio ? "bg-primary/15" : "bg-muted"
                    }`}>
                      <span className="text-sm font-bold">{chapter.chapterNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{chapter.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {hasAudio ? (
                          <span className="text-[10px] text-primary flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Ready
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Not generated</span>
                        )}
                        {hasAudio && chapter.audioDuration && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {formatDuration(chapter.audioDuration)}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
