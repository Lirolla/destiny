import { ReactNode, useRef } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedRoutesProps {
  children: ReactNode;
}

/**
 * Tab index map for determining slide direction.
 * Lower index = left, higher index = right.
 */
const TAB_ORDER: Record<string, number> = {
  "/": 0,
  "/book": 1,
  "/audiobook": 2,
  "/modules": 3,
  "/more": 4,
};

function getTabIndex(path: string): number {
  // Exact match first
  if (TAB_ORDER[path] !== undefined) return TAB_ORDER[path];
  // Sub-pages of "more" section
  return 4;
}

/**
 * AnimatedRoutes wraps the router to provide smooth page transitions.
 * - Tab-to-tab: horizontal slide (left/right based on tab order)
 * - Sub-page navigation: subtle fade + slide up
 */
export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const [location] = useLocation();
  const prevLocationRef = useRef(location);

  const prevIndex = getTabIndex(prevLocationRef.current);
  const currIndex = getTabIndex(location);

  // Determine direction: positive = slide from right, negative = slide from left
  const direction = currIndex >= prevIndex ? 1 : -1;

  // Update ref after calculating direction
  if (prevLocationRef.current !== location) {
    prevLocationRef.current = location;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, x: direction * 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -30 }}
        transition={{
          type: "tween",
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
        }}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
