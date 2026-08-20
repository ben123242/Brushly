import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Polygon, Rect, Text as SvgText } from "react-native-svg";
import { Shape } from "../types";
import { centroidOf, estimateLabelBoxSize } from "../utils/shapeGeometry";
import { buildWhatToPaintText } from "../utils/zoneDescription";
import { colors, fonts, radii, spacing } from "../theme";

const FONT_SIZE = 18;
const LABEL_H_PADDING = 12;
const LABEL_V_PADDING = 7;
const MARGIN = spacing.lg;

interface Props {
  visible: boolean;
  onClose: () => void;
  photoUri: string;
  shapes: Shape[];
  activeZoneIds?: string[];
  stepTitle?: string;
}

export default function ZoneDetailModal({
  visible,
  onClose,
  photoUri,
  shapes,
  activeZoneIds,
  stepTitle,
}: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const activeSet = new Set(activeZoneIds ?? []);
  const size = Math.min(windowWidth - MARGIN * 2, windowHeight * 0.6);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.header}>
          {stepTitle && <Text style={styles.title}>{stepTitle}</Text>}
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>

        <View style={[styles.imageWrapper, { width: size, height: size }]}>
          <Image
            source={{ uri: photoUri }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
            {shapes.map((shape) => {
              const isActive = activeSet.has(shape.id);
              const points = shape.points
                .map(([x, y]) => `${x * size},${y * size}`)
                .join(" ");

              if (!isActive) {
                return (
                  <Polygon
                    key={shape.id}
                    points={points}
                    fill="#000000"
                    fillOpacity={0.35}
                    stroke="#ffffff"
                    strokeOpacity={0.25}
                    strokeWidth={1}
                  />
                );
              }

              const [cx0, cy0] = centroidOf(shape.points);
              const cx = cx0 * size;
              const cy = cy0 * size;
              const { width: labelWidth, height: labelHeight } = estimateLabelBoxSize(
                shape.label,
                FONT_SIZE,
                LABEL_H_PADDING,
                LABEL_V_PADDING
              );

              return (
                <React.Fragment key={shape.id}>
                  <Polygon
                    points={points}
                    fill={colors.gold}
                    fillOpacity={0.3}
                    stroke={colors.goldLight}
                    strokeWidth={3}
                  />
                  <Rect
                    x={cx - labelWidth / 2}
                    y={cy - labelHeight / 2}
                    width={labelWidth}
                    height={labelHeight}
                    rx={labelHeight / 2}
                    fill="rgba(11, 11, 13, 0.9)"
                    stroke={colors.goldLight}
                    strokeWidth={1.5}
                  />
                  <SvgText
                    x={cx}
                    y={cy + FONT_SIZE * 0.34}
                    fill="#FFFFFF"
                    fontSize={FONT_SIZE}
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {shape.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>

        <Text style={styles.caption}>
          {buildWhatToPaintText(activeZoneIds, shapes)}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(8, 8, 9, 0.96)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.lg,
  },
  title: {
    flex: 1,
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  closeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  closeButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.gold,
  },
  imageWrapper: {
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
