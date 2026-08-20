import React, { useEffect, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, AnalysisResult, InstructionStep } from "../types";
import { colors, fonts, radii, shadows, spacing, typography } from "../theme";
import { analyzePainting } from "../services/api";
import OutlineOverlay from "../components/OutlineOverlay";
import StepCard from "../components/StepCard";
import PrimaryButton from "../components/PrimaryButton";
import AnalyzingScreen from "../components/AnalyzingScreen";
import ZoneDetailModal from "../components/ZoneDetailModal";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;
type Phase = "loading" | "finishing" | "done" | "error";

export default function ResultsScreen({ navigation, route }: Props) {
  const { photoUri, base64, mimeType, medium, skillLevel } = route.params;
  const [phase, setPhase] = useState<Phase>("loading");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [expandedStep, setExpandedStep] = useState<InstructionStep | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    setError(null);
    analyzePainting({ base64, mimeType, medium, skillLevel })
      .then((data) => {
        if (cancelled) return;
        setResult(data);
        setPhase("finishing");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message ?? "Something went wrong.");
        setPhase("error");
      });
    return () => {
      cancelled = true;
    };
  }, [base64, mimeType, medium, skillLevel]);

  function onImageLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  }

  if (phase === "loading" || phase === "finishing") {
    return (
      <AnalyzingScreen
        medium={medium}
        phase={phase}
        onFinishComplete={() => setPhase("done")}
      />
    );
  }

  if (phase === "error" || !result) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorTitle}>Couldn't analyze this photo</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <View style={styles.retryButton}>
          <PrimaryButton label="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={typography.label}>
          {skillLevel.toUpperCase()} · {medium.toUpperCase()}
        </Text>
        <View style={styles.imageWrapper} onLayout={onImageLayout}>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <OutlineOverlay
            shapes={result.shapes}
            width={imageSize.width}
            height={imageSize.height}
          />
        </View>

        {result.summary && (
          <Text style={styles.summary}>{result.summary}</Text>
        )}

        <Text style={[typography.title, styles.stepsTitle]}>
          Painting Steps
        </Text>
        {result.instructions.map((step) => (
          <StepCard
            key={step.step}
            step={step}
            photoUri={photoUri}
            shapes={result.shapes}
            onExpand={() => setExpandedStep(step)}
          />
        ))}

        <View style={styles.footerButton}>
          <PrimaryButton
            label="Paint Another Scene"
            variant="secondary"
            onPress={() => navigation.popToTop()}
          />
        </View>
      </ScrollView>

      <ZoneDetailModal
        visible={!!expandedStep}
        onClose={() => setExpandedStep(null)}
        photoUri={photoUri}
        shapes={result.shapes}
        activeZoneIds={expandedStep?.zoneIds}
        stepTitle={expandedStep?.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  errorTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    width: "100%",
  },
  scrollContent: {
    padding: spacing.lg,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    marginBottom: spacing.lg,
    lineHeight: 21,
  },
  stepsTitle: {
    marginBottom: spacing.md,
  },
  footerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
