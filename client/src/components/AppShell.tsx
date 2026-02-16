import { ReactNode } from "react";
import { BottomTabNavigation } from "./BottomTabNavigation";
import { AudiobookMiniPlayer } from "./AudiobookMiniPlayer";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell wraps the entire app in a native mobile app-like container.
 * - Bottom tab navigation
 * - Safe area padding
 * - Full-screen feel
 * - Smooth scrolling
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell min-h-[100dvh] flex flex-col bg-background">
      {/* Main content area with bottom padding for tab bar */}
      <main className="flex-1 pb-20 overflow-y-auto overscroll-contain">
        {children}
      </main>

      {/* Now Playing mini-player */}
      <AudiobookMiniPlayer />

      {/* Bottom tab navigation */}
      <BottomTabNavigation />
    </div>
  );
}
