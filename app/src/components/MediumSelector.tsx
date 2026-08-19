import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MEDIA, Medium } from "../types";
import { colors, radii, spacing, typography } from "../theme";

interface Props {
  value: Medium;
  onChange: (medium: Medium) => void;
}

export default function MediumSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text style={styles.label}>Choose your medium</Text>
      <View style={styles.row}>
        {MEDIA.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipLabel, selected && styles.chipLabelSelected]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FBEAE2",
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.inkMuted,
  },
  chipLabelSelected: {
    color: colors.primaryDark,
  },
});
