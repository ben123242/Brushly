import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Medium } from "../types";
import { colors, spacing, typography } from "../theme";
import MediumSelector from "../components/MediumSelector";
import PrimaryButton from "../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [medium, setMedium] = useState<Medium>("watercolor");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🎨 Brushly</Text>
        <Text style={typography.subtitle}>
          Photograph any scene and get a simplified outline plus step-by-step
          painting instructions — made for beginners.
        </Text>
      </View>

      <View style={styles.card}>
        <MediumSelector value={medium} onChange={setMedium} />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Start a New Painting"
          onPress={() => navigation.navigate("Capture", { medium })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  hero: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  logo: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  footer: {
    marginBottom: spacing.md,
  },
});
