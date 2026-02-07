import { useState, useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

/**
 * PullToRefresh - Native-style pull-to-refresh for mobile pages.
 * Wraps content and shows a spinner when pulled down from the top.
 */
export function PullToRefresh({ children, onRefresh, className = "" }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const pullDistance = useMotionValue(0);

  const spinnerOpacity = useTransform(pullDistance, [0, PULL_THRESHOLD * 0.5, PULL_THRESHOLD], [0, 0.5, 1]);
  const spinnerScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const spinnerRotation = useTransform(pullDistance, [0, MAX_PULL], [0, 360]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    const container = containerRef.current;
    if (!container) return;

    // Only activate if scrolled to top
    // Check the container itself and its first scrollable child
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
      // Apply resistance - pull gets harder as you go further
      const dampedDiff = Math.min(diff * 0.5, MAX_PULL);
      pullDistance.set(dampedDiff);
    }
  }, [isRefreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    const currentPull = pullDistance.get();

    if (currentPull >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true);
      pullDistance.set(60); // Hold at spinner position

      try {
        await onRefresh();
      } catch (error) {
        console.error("Pull-to-refresh error:", error);
      } finally {
        setIsRefreshing(false);
        pullDistance.set(0);
      }
    } else {
      // Snap back
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
      {/* Pull indicator */}
      <motion.div
        className="absolute left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
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
