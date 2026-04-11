import { useCallback, useEffect, useRef, useState } from "react";

interface UseReadingProgressOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

interface ReadingProgressResult {
  progress: number;
  hasReachedThreshold: boolean;
}

export function useReadingProgress({
  containerRef,
  threshold = 95,
}: UseReadingProgressOptions): ReadingProgressResult {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const calculateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const readDistance = scrollY + viewportHeight - containerTop;
    const totalReadable = containerHeight;

    if (totalReadable <= 0) return;

    const raw = Math.min(
      Math.max((readDistance / totalReadable) * 100, 0),
      100
    );
    const rounded = Math.round(raw);
    setProgress((prev) => (prev !== rounded ? rounded : prev));
  }, [containerRef]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    calculateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculateProgress]);

  return {
    progress,
    hasReachedThreshold: progress >= threshold,
  };
}
