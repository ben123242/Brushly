import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, MEDIA, Medium, SKILL_LEVELS, SkillLevel } from "../types";
import { colors, radii, shadows, spacing, typography } from "../theme";
import ChipSelector from "../components/ChipSelector";
import PrimaryButton from "../components/PrimaryButton";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [medium, setMedium] = useState<Medium>("watercolor");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={typography.logo}>Brushly</Text>
        <View style={styles.rule} />
        <Text style={typography.subtitle}>
          Photograph any scene and receive a simplified outline plus a
          step-by-step painting guide, tailored to your experience.
        </Text>
      </View>

      <View style={styles.card}>
        <ChipSelector
          label="Choose Your Medium"
          options={MEDIA}
          value={medium}
          onChange={setMedium}
        />
        <View style={styles.divider} />
        <ChipSelector
          label="Your Skill Level"
          options={SKILL_LEVELS}
          value={skillLevel}
          onChange={setSkillLevel}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Start a New Painting"
          onPress={() =>
            navigation.navigate("Capture", { medium, skillLevel })
          }
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
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  rule: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  footer: {
    marginBottom: spacing.md,
  },
});
