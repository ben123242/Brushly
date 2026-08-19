import React from "react";
import Svg, { Polygon, Text as SvgText } from "react-native-svg";
import { Shape } from "../types";

const PALETTE = ["#D97B5F", "#5C8D7D", "#4A7FA7", "#C9A227", "#8E5B9A", "#B85F45"];

interface Props {
  shapes: Shape[];
  width: number;
  height: number;
}

export default function OutlineOverlay({ shapes, width, height }: Props) {
  if (!width || !height) return null;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {shapes.map((shape, index) => {
        const color = shape.colorHint || PALETTE[index % PALETTE.length];
        const scaledPoints = shape.points
          .map(([x, y]) => `${x * width},${y * height}`)
          .join(" ");
        const centroid = shape.points.reduce(
          (acc, [x, y]) => [acc[0] + x, acc[1] + y],
          [0, 0]
        );
        const cx = (centroid[0] / shape.points.length) * width;
        const cy = (centroid[1] / shape.points.length) * height;

        return (
          <React.Fragment key={shape.id}>
            <Polygon
              points={scaledPoints}
              fill={color}
              fillOpacity={0.12}
              stroke={color}
              strokeWidth={2.5}
              strokeDasharray="6,4"
            />
            <SvgText
              x={cx}
              y={cy}
              fill={color}
              fontSize={13}
              fontWeight="700"
              textAnchor="middle"
              stroke="#fff"
              strokeWidth={3}
            >
              {shape.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
