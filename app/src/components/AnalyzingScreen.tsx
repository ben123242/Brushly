import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Medium } from "../types";
import { colors, fonts, radii, spacing } from "../theme";
import {
  AnalysisPhase,
  ProgressStage,
  useAnalysisProgress,
} from "../hooks/useAnalysisProgress";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_SIZE = 176;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  medium: Medium;
  phase: AnalysisPhase;
  onFinishComplete: () => void;
}

function mediumLabel(medium: Medium): string {
  return medium.charAt(0).toUpperCase() + medium.slice(1);
}

export default function AnalyzingScreen({
  medium,
  phase,
  onFinishComplete,
}: Props) {
  const stages: ProgressStage[] = [
    { key: "scene", label: "Analyzing your scene" },
    { key: "shapes", label: "Identifying shapes & zones" },
    { key: "outline", label: "Generating outline" },
    { key: "guide", label: `Creating your ${mediumLabel(medium)} guide` },
  ];

  const { progress, activeIndex, secondsRemaining } = useAnalysisProgress(
    stages.length,
    phase
  );
  const isFinishing = phase === "finishing";

  const labelOpacity = useRef(new Animated.Value(1)).current;
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeIndex !== displayedIndex) {
      Animated.sequence([
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      setDisplayedIndex(activeIndex);
    }
  }, [activeIndex, displayedIndex, labelOpacity]);

  useEffect(() => {
    if (phase !== "finishing") return;
    const popTimer = setTimeout(() => {
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }, 380);
    const doneTimer = setTimeout(onFinishComplete, 950);
    return () => {
      clearTimeout(popTimer);
      clearTimeout(doneTimer);
    };
  }, [phase, checkScale, onFinishComplete]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <LinearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.goldLight} />
              <Stop offset="100%" stopColor={colors.gold} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.borderSubtle}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="url(#goldRing)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            rotation={-90}
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          {isFinishing ? (
            <Animated.Text
              style={[styles.checkmark, { transform: [{ scale: checkScale }] }]}
            >
              ✓
            </Animated.Text>
          ) : (
            <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
          )}
        </View>
      </View>

      <Animated.Text style={[styles.stageLabel, { opacity: labelOpacity }]}>
        {stages[displayedIndex].label}
        {isFinishing ? "" : "…"}
      </Animated.Text>

      <Text style={styles.timeRemaining}>
        {isFinishing ? "Finishing up" : `About ${secondsRemaining}s remaining`}
      </Text>

      <View style={styles.stageList}>
        {stages.map((stage, index) => {
          const isDone = index < displayedIndex || isFinishing;
          const isActive = !isFinishing && index === displayedIndex;
          return (
            <View key={stage.key} style={styles.stageRow}>
              <View
                style={[
                  styles.stageDot,
                  isActive && styles.stageDotActive,
                  isDone && styles.stageDotDone,
                ]}
              >
                {isDone && <Text style={styles.stageDotCheck}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.stageRowLabel,
                  (isActive || isDone) && styles.stageRowLabelActive,
                ]}
              >
                {stage.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginBottom: spacing.lg,
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.textPrimary,
  },
  checkmark: {
    fontFamily: fonts.display,
    fontSize: 52,
    color: colors.gold,
  },
  stageLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  timeRemaining: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  stageList: {
    width: "100%",
    gap: spacing.md,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  stageDot: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stageDotActive: {
    borderColor: colors.gold,
  },
  stageDotDone: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
  stageDotCheck: {
    fontSize: 12,
    color: colors.background,
    fontFamily: fonts.bodyBold,
  },
  stageRowLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  stageRowLabelActive: {
    color: colors.textSecondary,
  },
});
