import { useState, useRef, useCallback, ReactNode, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

const INVICTUS_QUOTES = [
  "I am the master of my fate, I am the captain of my soul.",
  "My head is bloody, but unbowed.",
  "Beyond this place of wrath and tears looms but the Horror of the shade.",
  "In the fell clutch of circumstance I have not winced nor cried aloud.",
  "It matters not how strait the gate, how charged with punishments the scroll.",
  "Under the bludgeonings of chance my head is bloody, but unbowed.",
  "Out of the night that covers me, black as the pit from pole to pole.",
  "I thank whatever gods may be for my unconquerable soul.",
];

/**
 * PullToRefresh - Native-style pull-to-refresh with Invictus quotes.
 * Wraps content and shows a spinner + quote when pulled down from the top.
 */
export function PullToRefresh({ children, onRefresh, className = "" }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const pullDistance = useMotionValue(0);

  const quote = useMemo(
    () => INVICTUS_QUOTES[Math.floor(Math.random() * INVICTUS_QUOTES.length)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRefreshing]
  );

  const spinnerOpacity = useTransform(pullDistance, [0, PULL_THRESHOLD * 0.5, PULL_THRESHOLD], [0, 0.5, 1]);
  const spinnerScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const spinnerRotation = useTransform(pullDistance, [0, MAX_PULL], [0, 360]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      const dampedDiff = Math.min(diff * 0.5, MAX_PULL);
      pullDistance.set(dampedDiff);
    }
  }, [isRefreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    const currentPull = pullDistance.get();

    if (currentPull >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      pullDistance.set(60);

      try {
        await onRefresh();
      } catch (error) {
        console.error("Pull-to-refresh error:", error);
      } finally {
        setIsRefreshing(false);
        pullDistance.set(0);
      }
    } else {
      pullDistance.set(0);
    }
  }, [isRefreshing, onRefresh, pullDistance]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator with Invictus quote */}
      <motion.div
        className="absolute left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none gap-2"
        style={{
          top: 0,
          height: pullDistance,
        }}
      >
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border shadow-lg"
          style={{
            opacity: spinnerOpacity,
            scale: spinnerScale,
          }}
        >
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <motion.div style={{ rotate: spinnerRotation }}>
              <RefreshCw className="w-5 h-5 text-primary" />
            </motion.div>
          )}
        </motion.div>
        {isRefreshing && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground italic text-center px-8 max-w-xs"
          >
            "{quote}"
          </motion.p>
        )}
      </motion.div>

      {/* Content with pull offset */}
      <motion.div
        style={{
          y: pullDistance,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
