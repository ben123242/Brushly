import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export interface ProgressStage {
  key: string;
  label: string;
}

export type AnalysisPhase = "loading" | "finishing";

const TOTAL_DURATION_MS = 15000;
const PROGRESS_CAP = 0.93;

export function useAnalysisProgress(
  stageCount: number,
  phase: AnalysisPhase
) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);
  const finishingStarted = useRef(false);

  useEffect(() => {
    const listenerId = animatedProgress.addListener(({ value }) =>
      setProgress(value)
    );
    return () => animatedProgress.removeListener(listenerId);
  }, [animatedProgress]);

  useEffect(() => {
    if (phase === "loading") {
      Animated.timing(animatedProgress, {
        toValue: PROGRESS_CAP,
        duration: TOTAL_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else if (phase === "finishing" && !finishingStarted.current) {
      finishingStarted.current = true;
      Animated.timing(animatedProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [phase, animatedProgress]);

  const activeIndex =
    phase === "finishing"
      ? stageCount - 1
      : Math.min(stageCount - 1, Math.floor(progress * stageCount));

  const secondsRemaining =
    phase === "finishing"
      ? 0
      : Math.max(
          1,
          Math.ceil(
            ((PROGRESS_CAP - progress) / PROGRESS_CAP) *
              (TOTAL_DURATION_MS / 1000)
          )
        );

  return { progress, activeIndex, secondsRemaining };
}
