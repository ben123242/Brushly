import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InstructionStep } from "../types";
import { colors, radii, spacing, typography } from "../theme";

export default function StepCard({ step }: { step: InstructionStep }) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step.step}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.heading,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.inkMuted,
    lineHeight: 21,
  },
});
