import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { InstructionStep, Shape } from "../types";
import { colors, fonts, radii, shadows, spacing } from "../theme";
import ZoneThumbnail from "./ZoneThumbnail";
import { buildWhatToPaintText } from "../utils/zoneDescription";

interface Props {
  step: InstructionStep;
  photoUri: string;
  shapes: Shape[];
  onExpand?: () => void;
}

export default function StepCard({ step, photoUri, shapes, onExpand }: Props) {
  const hasDetails = step.colorMix || step.brush || step.technique;
  const [thumbSize, setThumbSize] = useState(0);

  function onThumbnailLayout(event: LayoutChangeEvent) {
    setThumbSize(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{step.step}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{step.title}</Text>
          {step.duration && (
            <Text style={styles.duration}>{step.duration}</Text>
          )}
        </View>
      </View>

      <Pressable
        onPress={onExpand}
        onLayout={onThumbnailLayout}
        style={styles.thumbnailPressable}
      >
        {thumbSize > 0 && (
          <ZoneThumbnail
            photoUri={photoUri}
            shapes={shapes}
            activeZoneIds={step.zoneIds}
            size={thumbSize}
          />
        )}
        <View style={styles.enlargeChip}>
          <Text style={styles.enlargeChipText}>Tap to enlarge</Text>
        </View>
      </Pressable>

      <View style={styles.whatToPaintBlock}>
        <Text style={styles.whatToPaintLabel}>What to Paint Here</Text>
        <Text style={styles.whatToPaintText}>
          {buildWhatToPaintText(step.zoneIds, shapes)}
        </Text>
      </View>

      {hasDetails && (
        <View style={styles.detailsBlock}>
          {step.colorMix && (
            <DetailRow
              label="Colors"
              value={step.colorMix}
              swatchHex={step.swatchHex}
            />
          )}
          {step.brush && <DetailRow label="Brush" value={step.brush} />}
          {step.technique && (
            <DetailRow label="Technique" value={step.technique} />
          )}
        </View>
      )}

      <Text style={styles.description}>{step.description}</Text>
    </View>
  );
}

function DetailRow({
  label,
  value,
  swatchHex,
}: {
  label: string;
  value: string;
  swatchHex?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueRow}>
        {swatchHex && (
          <View style={[styles.swatch, { backgroundColor: swatchHex }]} />
        )}
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    color: colors.background,
    fontSize: 13,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  duration: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.gold,
  },
  thumbnailPressable: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  enlargeChip: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: "rgba(11, 11, 13, 0.78)",
  },
  enlargeChipText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.gold,
  },
  whatToPaintBlock: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: 2,
  },
  whatToPaintLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.gold,
  },
  whatToPaintText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  detailsBlock: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  detailLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textMuted,
    width: 68,
    marginTop: 2,
  },
  detailValueRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 2,
  },
  detailValue: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
