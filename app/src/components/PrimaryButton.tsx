import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, radii, shadows, spacing } from "../theme";

interface Props {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: Props) {
  const isSecondary = variant === "secondary";
  const isDisabled = disabled || loading;

  if (isSecondary) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          styles.secondary,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressedSecondary,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.gold} />
        ) : (
          <Text style={[styles.label, styles.labelSecondary]}>{label}</Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressedPrimary,
      ]}
    >
      <LinearGradient
        colors={[colors.goldLight, colors.gold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, shadows.gold]}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.label, styles.labelPrimary]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  disabled: {
    opacity: 0.45,
  },
  pressedPrimary: {
    opacity: 0.9,
  },
  pressedSecondary: {
    opacity: 0.65,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: colors.background,
  },
  labelSecondary: {
    color: colors.gold,
  },
});
