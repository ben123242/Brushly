import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { Shape } from "../types";
import { colors, radii } from "../theme";

interface Props {
  photoUri: string;
  shapes: Shape[];
  activeZoneIds?: string[];
  size?: number;
}

const DEFAULT_SIZE = 60;

export default function ZoneThumbnail({
  photoUri,
  shapes,
  activeZoneIds,
  size = DEFAULT_SIZE,
}: Props) {
  const activeSet = new Set(activeZoneIds ?? []);
  const hasActive = activeSet.size > 0;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
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
          return (
            <Polygon
              key={shape.id}
              points={points}
              fill={isActive ? colors.gold : "#000000"}
              fillOpacity={isActive ? 0.4 : 0}
              stroke={isActive ? colors.goldLight : "#ffffff"}
              strokeOpacity={isActive ? 1 : hasActive ? 0.12 : 0.3}
              strokeWidth={isActive ? 2 : 1}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.sm,
    overflow: "hidden",
    backgroundColor: colors.surfaceElevated,
  },
});
