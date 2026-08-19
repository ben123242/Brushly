import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MEDIA, Medium } from "../types";
import { colors, fonts, radii, shadows, spacing, typography } from "../theme";

interface Props {
  value: Medium;
  onChange: (medium: Medium) => void;
}

export default function MediumSelector({ value, onChange }: Props) {
  return (
    <View>
      <Text style={typography.label}>Choose Your Medium</Text>
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
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  chipSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceElevated,
    ...shadows.goldSubtle,
  },
  chipLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
  chipLabelSelected: {
    fontFamily: fonts.bodySemiBold,
    color: colors.gold,
  },
});
