import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Play, Pause, SkipForward, X } from "lucide-react";
import { useLocation } from "wouter";
import { getChapterTitle } from "@shared/chapterTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * AudiobookMiniPlayer — a persistent "Now Playing" bar that sits above the bottom nav.
 * It reads from localStorage to know which chapter is playing (set by the Audiobook page).
 * When visible, it provides play/pause, skip forward, and tap-to-navigate-to-audiobook.
 */

interface NowPlayingState {
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string;
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

const STORAGE_KEY = "audiobook-now-playing";

export function AudiobookMiniPlayer() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location, setLocation] = useLocation();
  const { t, language } = useLanguage();

  // Don't show mini-player on the audiobook page itself
  const isOnAudiobookPage = location.startsWith("/audiobook");

  // Listen for storage events from the Audiobook page
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue) {
          try {
            const state = JSON.parse(e.newValue) as NowPlayingState;
            setNowPlaying(state);
          } catch {
            // ignore
          }
        } else {
          setNowPlaying(null);
        }
      }
    };

    // Also check on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state = JSON.parse(stored) as NowPlayingState;
        setNowPlaying(state);
      } catch {
        // ignore
      }
    }

    // Listen for custom event (same-tab communication)
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail) {
        setNowPlaying(e.detail as NowPlayingState);
      } else {
        setNowPlaying(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("audiobook-now-playing" as any, handleCustomEvent as any);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("audiobook-now-playing" as any, handleCustomEvent as any);
    };
  }, []);

  // Sync audio element with nowPlaying state
  useEffect(() => {
    if (!nowPlaying || !audioRef.current) return;

    const audio = audioRef.current;

    // If the source changed, update it
    if (audio.src !== nowPlaying.audioUrl) {
      audio.src = nowPlaying.audioUrl;
      audio.currentTime = nowPlaying.currentTime || 0;
      if (nowPlaying.isPlaying) {
        audio.play().catch(() => {});
      }
    }

    setIsPlaying(nowPlaying.isPlaying);
    setCurrentTime(nowPlaying.currentTime || 0);
    setDuration(nowPlaying.duration || 0);
  }, [nowPlaying]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // Update storage
    if (nowPlaying) {
      const updated = { ...nowPlaying, isPlaying: !audioRef.current.paused };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [nowPlaying]);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
    }
  }, []);

  const handleClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setNowPlaying(null);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("audiobook-now-playing", { detail: null }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const navigateToAudiobook = useCallback(() => {
    if (nowPlaying) {
      setLocation(`/audiobook?chapter=${nowPlaying.chapterNumber}`);
    }
  }, [nowPlaying, setLocation]);

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Don't render if nothing is playing or we're on the audiobook page
  if (!nowPlaying || isOnAudiobookPage) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleClose}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Mini-player bar — fixed above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 z-[9989] safe-area-bottom">
        {/* Progress bar at top edge */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-card/95 backdrop-blur-lg border-t border-border px-3 py-2">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            {/* Chapter info — tap to navigate */}
            <button
              onClick={navigateToAudiobook}
              className="flex-1 min-w-0 text-left"
            >
              <p className="text-xs font-medium truncate text-foreground">
                {t({ en: "Ch.", pt: "Cap.", es: "Cap." })} {nowPlaying.chapterNumber}: {getChapterTitle(nowPlaying.chapterNumber, language, nowPlaying.chapterTitle)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
                aria-label={isPlaying ? t({ en: "Pause", pt: "Pausar", es: "Pausar" }) : t({ en: "Play", pt: "Tocar", es: "Reproducir" })}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); skipForward(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t({ en: "Skip 15s", pt: "Pular 15s", es: "Saltar 15s" })}
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t({ en: "Close", pt: "Fechar", es: "Cerrar" })}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
