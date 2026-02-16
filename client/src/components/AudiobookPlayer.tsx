import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Bookmark,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Timer,
  X,
  ListEnd
} from "lucide-react";
import { toast } from "sonner";
import { getChapterTitle } from "@shared/chapterTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudiobookPlayerProps {
  chapterId: number;
  language: "en" | "pt" | "es";
  onChapterChange?: (newChapterId: number) => void;
  onChapterEnded?: () => void;
}

export function AudiobookPlayer({ chapterId, language, onChapterChange, onChapterEnded }: AudiobookPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [syncMode, setSyncMode] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number>(0); // seconds
  const [autoPlay, setAutoPlay] = useState(() => {
    return localStorage.getItem('audiobook-autoplay') !== 'false'; // default true
  });

  // Track whether we've already restored position for this chapter+language combo
  // This prevents the progress query from repeatedly resetting currentTime during playback
  const hasRestoredPosition = useRef(false);
  const currentChapterLanguageKey = useRef("");

  // Fetch chapter data
  const { data: chapter } = trpc.audiobook.getChapter.useQuery({ chapterId });
  const { data: progress } = trpc.audiobook.getProgress.useQuery({ chapterId });

  // Determine the correct audio URL based on language
  const audioUrl = chapter
    ? language === "pt"
      ? (chapter as any).audioUrlPt || (chapter as any).audioUrl
      : (chapter as any).audioUrl
    : null;

  // Update progress mutation - don't invalidate the query to avoid re-triggering position restore
  const updateProgress = trpc.audiobook.updateProgress.useMutation();
  const utils = trpc.useUtils();

  // Create bookmark mutation
  const createBookmark = trpc.audiobook.createBookmark.useMutation({
    onSuccess: () => {
      toast.success(t({ en: "Bookmark added", pt: "Marcador adicionado", es: "Marcador añadido" }));
    },
  });

  // Reset the restore flag when chapter or language changes
  useEffect(() => {
    const key = `${chapterId}-${language}`;
    if (currentChapterLanguageKey.current !== key) {
      hasRestoredPosition.current = false;
      currentChapterLanguageKey.current = key;
    }
  }, [chapterId, language]);

  // Load saved position ONLY ONCE when chapter first loads
  // This runs when progress data arrives, but only restores position once per chapter+language
  useEffect(() => {
    if (progress && audioRef.current && !hasRestoredPosition.current) {
      const savedPosition = progress.currentPosition || 0;
      // Only restore if we have a meaningful saved position
      if (savedPosition > 0) {
        audioRef.current.currentTime = savedPosition;
        setCurrentTime(savedPosition);
      }
      setPlaybackSpeed(parseFloat(progress.playbackSpeed as any) || 1.0);
      hasRestoredPosition.current = true;
    }
  }, [progress]);

  // Handle language change - pause and reset when language switches
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      // After the new source loads, resume if was playing
      if (wasPlaying) {
        const handleCanPlay = () => {
          audioRef.current?.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Autoplay might be blocked
          });
          audioRef.current?.removeEventListener('canplay', handleCanPlay);
        };
        audioRef.current.addEventListener('canplay', handleCanPlay);
      }
    }
  }, [language]);

  // Update playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Save progress periodically - uses a ref to avoid stale closures
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlayingRef.current && audioRef.current) {
        const position = Math.floor(audioRef.current.currentTime);
        updateProgress.mutate({
          chapterId,
          currentPosition: position,
          playbackSpeed: playbackSpeedRef.current,
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [chapterId]);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimer === null) return;

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev <= 1) {
          // Timer expired
          if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          setSleepTimer(null);
          toast.info(t({ en: "Sleep timer expired - playback paused", pt: "Temporizador zerado - reprodução pausada", es: "Temporizador de apagado expirado - reproducción pausada" }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        toast.error(t({ en: "Unable to play audio", pt: "Não foi possível reproduzir o áudio", es: "No se puede reproducir el audio" }));
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [t]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Broadcast position for sync mode
      if (syncMode && chapter) {
        localStorage.setItem('audiobook-sync', JSON.stringify({
          chapterId: chapter.id,
          chapterNumber: (chapter as any).chapterNumber,
          currentTime: audioRef.current.currentTime,
          duration: duration,
          timestamp: Date.now()
        }));
      }
    }
  }, [syncMode, chapter, duration]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Apply playback speed to newly loaded audio
      audioRef.current.playbackRate = playbackSpeedRef.current;
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const skip = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  }, []);

  const handleAddBookmark = useCallback(() => {
    createBookmark.mutate({
      chapterId,
      position: Math.floor(currentTime),
      title: t({ en: `Bookmark at ${formatTime(currentTime)}`, pt: `Marcador em ${formatTime(currentTime)}`, es: `Marcador en ${formatTime(currentTime)}` }),
    });
  }, [chapterId, currentTime, t]);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  }, [playbackSpeed]);

  const setSleepTimerMinutes = useCallback((minutes: number) => {
    setSleepTimer(minutes);
    setSleepTimerRemaining(minutes * 60);
    toast.success(t({ en: `Sleep timer set for ${minutes} minutes`, pt: `Temporizador definido para ${minutes} minutos`, es: `Temporizador programado para ${minutes} minutos` }));
  }, [t]);

  const cancelSleepTimer = useCallback(() => {
    setSleepTimer(null);
    setSleepTimerRemaining(0);
    toast.info(t({ en: "Sleep timer cancelled", pt: "Temporizador cancelado", es: "Temporizador de apagado cancelado" }));
  }, [t]);

  const formatTimerRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Save progress when user pauses
  const saveCurrentPosition = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 0) {
      updateProgress.mutate({
        chapterId,
        currentPosition: Math.floor(audioRef.current.currentTime),
        playbackSpeed: playbackSpeedRef.current,
      });
    }
  }, [chapterId]);

  // Save position when component unmounts or chapter changes
  useEffect(() => {
    return () => {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        // Fire-and-forget save on cleanup
        updateProgress.mutate({
          chapterId,
          currentPosition: Math.floor(audioRef.current.currentTime),
          playbackSpeed: playbackSpeedRef.current,
        });
      }
    };
  }, [chapterId]);

  // Save position before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        // Use sendBeacon for reliable save on page close
        const data = JSON.stringify({
          chapterId,
          currentPosition: Math.floor(audioRef.current.currentTime),
          playbackSpeed: playbackSpeedRef.current,
        });
        navigator.sendBeacon(`/api/trpc/audiobook.updateProgress?batch=1`, data);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chapterId]);

  const handleChapterEnded = useCallback(() => {
    if (onChapterEnded) {
      onChapterEnded();
    } else if (autoPlay && onChapterChange && chapter && (chapter as any).nextChapterId) {
      onChapterChange((chapter as any).nextChapterId);
    }
  }, [onChapterEnded, autoPlay, onChapterChange, chapter]);

  if (!chapter) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t({ en: "Loading...", pt: "Carregando...", es: "Cargando..." })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            {t({ en: "Please wait while the audio loads.", pt: "Por favor, aguarde enquanto o áudio carrega.", es: "Por favor, espere mientras se carga el audio." })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <audio
        ref={audioRef}
        src={audioUrl || ""}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleChapterEnded}
        onPause={saveCurrentPosition}
        className="hidden"
      />

      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight leading-snug">
          {getChapterTitle((chapter as any).chapterNumber, language, (chapter as any).title)}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {t({ en: "Destiny Hacking Audiobook", pt: "Audiobook Destiny Hacking", es: "Audiolibro Destiny Hacking" })}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChapterChange && onChapterChange((chapter as any).prevChapterId)}
            disabled={!(chapter as any).prevChapterId}
            aria-label={t({ en: "Go to previous chapter", pt: "Ir para o capítulo anterior", es: "Ir al capítulo anterior" })}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="h-16 w-16 rounded-full shadow-lg"
            onClick={togglePlay}
            aria-label={t({ en: "Play/Pause", pt: "Reproduzir/Pausar", es: "Reproducir/Pausar" })}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChapterChange && onChapterChange((chapter as any).nextChapterId)}
            disabled={!(chapter as any).nextChapterId}
            aria-label={t({ en: "Go to next chapter", pt: "Ir para o próximo capítulo", es: "Ir al siguiente capítulo" })}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Seek Bar */}
        <div className="space-y-1.5">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            onValueChange={handleSeek}
            aria-label={t({ en: "Seek audio", pt: "Buscar no áudio", es: "Buscar en el audio" })}
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume and Secondary Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? t({ en: "Unmute", pt: "Ativar som", es: "Reactivar sonido" }) : t({ en: "Mute", pt: "Silenciar", es: "Silenciar" })}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.05}
              onValueChange={handleVolumeChange}
              className="w-24"
              aria-label={t({ en: "Change volume", pt: "Mudar volume", es: "Cambiar volumen" })}
            />
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => skip(-10)} aria-label={t({ en: "Rewind 10 seconds", pt: "Retroceder 10 segundos", es: "Retroceder 10 segundos" })}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => skip(30)} aria-label={t({ en: "Fast-forward 30 seconds", pt: "Avançar 30 segundos", es: "Adelantar 30 segundos" })}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleAddBookmark} aria-label={t({ en: "Add bookmark", pt: "Adicionar marcador", es: "Añadir marcador" })}>
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cycleSpeed} aria-label={t({ en: "Change playback speed", pt: "Mudar velocidade de reprodução", es: "Cambiar velocidad de reproducción" })}>
              <div className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-current">
                {playbackSpeed.toFixed(2).replace(/\.00|0$/,'x')}
              </div>
            </Button>
          </div>
        </div>

        {/* Extra Features */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newVal = !autoPlay;
              setAutoPlay(newVal);
              localStorage.setItem('audiobook-autoplay', String(newVal));
              toast.success(newVal 
                ? t({ en: "Auto-play enabled", pt: "Reprodução automática ativada", es: "Reproducción automática activada" })
                : t({ en: "Auto-play disabled", pt: "Reprodução automática desativada", es: "Reproducción automática desactivada" }));
            }}
            className="h-10 text-xs font-medium justify-start px-3"
          >
            <ListEnd className="h-4 w-4 mr-2 flex-shrink-0" />
            {t({ en: "Auto-play", pt: "Auto-reprodução", es: "Reproducción automática" })}: {autoPlay ? t({ en: "ON", pt: "LIGADO", es: "SÍ" }) : t({ en: "OFF", pt: "DESLIGADO", es: "NO" })}
          </Button>

          <Button
            variant={syncMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (!syncMode && chapter) {
                const pdfUrl = `/book?chapter=${(chapter as any).chapterNumber}&sync=true`;
                window.open(pdfUrl, 'pdf-sync', 'width=1200,height=800');
                setSyncMode(true);
                toast.success(t({ en: "Sync mode enabled - PDF will follow audio", pt: "Modo sincronizado ativado - O PDF acompanhará o áudio", es: "Modo de sincronización activado: el PDF seguirá al audio" }));
              } else {
                setSyncMode(false);
                toast.info(t({ en: "Sync mode disabled", pt: "Modo sincronizado desativado", es: "Modo de sincronización desactivado" }));
              }
            }}
            className="h-10 text-xs font-medium justify-start px-3"
          >
            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
            {syncMode ? t({ en: "Syncing", pt: "Sincronizando", es: "Sincronizando" }) : t({ en: "Follow Along", pt: "Acompanhar", es: "Seguir" })}
          </Button>
        </div>

        {/* Sleep Timer */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium">{t({ en: "Sleep Timer", pt: "Temporizador", es: "Temporizador de apagado" })}</span>
          </div>
          
          {sleepTimer === null ? (
            <div className="flex gap-1.5">
              {[5, 10, 15, 30, 60].map((m) => (
                <Button
                  key={m}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setSleepTimerMinutes(m)}
                >
                  {m}m
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm font-mono">
                {formatTimerRemaining(sleepTimerRemaining)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={cancelSleepTimer}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
