import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, AnalysisResult } from "../types";
import { colors, radii, spacing, typography } from "../theme";
import { analyzePainting } from "../services/api";
import OutlineOverlay from "../components/OutlineOverlay";
import StepCard from "../components/StepCard";
import PrimaryButton from "../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export default function ResultsScreen({ navigation, route }: Props) {
  const { photoUri, base64, mimeType, medium } = route.params;
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    analyzePainting({ base64, mimeType, medium })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [base64, mimeType, medium]);

  function onImageLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setImageSize({ width, height });
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.subtitle, { marginTop: spacing.md }]}>
          Analyzing your scene...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !result) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={typography.heading}>Couldn't analyze this photo</Text>
        <Text style={[typography.subtitle, styles.errorText]}>{error}</Text>
        <View style={styles.retryButton}>
          <PrimaryButton label="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mediumLabel}>{medium.toUpperCase()}</Text>
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

        <Text style={[typography.heading, styles.stepsTitle]}>
          Painting Steps
        </Text>
        {result.instructions.map((step) => (
          <StepCard key={step.step} step={step} />
        ))}

        <View style={styles.footerButton}>
          <PrimaryButton
            label="Paint Another Scene"
            variant="secondary"
            onPress={() => navigation.popToTop()}
          />
        </View>
      </ScrollView>
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
  errorText: {
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  retryButton: {
    width: "100%",
  },
  scrollContent: {
    padding: spacing.lg,
  },
  mediumLabel: {
    ...typography.label,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  summary: {
    ...typography.body,
    color: colors.inkMuted,
    fontStyle: "italic",
    marginBottom: spacing.lg,
  },
  stepsTitle: {
    marginBottom: spacing.sm,
  },
  footerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
