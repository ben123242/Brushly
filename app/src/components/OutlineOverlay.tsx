import React from "react";
import Svg, { Polygon, Rect, Text as SvgText } from "react-native-svg";
import { Shape } from "../types";

const PALETTE = ["#E6C878", "#F1E9D8", "#6FA39A", "#C97B5F", "#A67BC9", "#7B93A6"];

const FONT_SIZE = 15;
const LABEL_H_PADDING = 9;
const LABEL_V_PADDING = 5;
const CHAR_WIDTH_ESTIMATE = FONT_SIZE * 0.62;

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

        const labelWidth =
          shape.label.length * CHAR_WIDTH_ESTIMATE + LABEL_H_PADDING * 2;
        const labelHeight = FONT_SIZE + LABEL_V_PADDING * 2;

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
            <Rect
              x={cx - labelWidth / 2}
              y={cy - labelHeight / 2}
              width={labelWidth}
              height={labelHeight}
              rx={labelHeight / 2}
              fill="rgba(11, 11, 13, 0.88)"
              stroke={color}
              strokeWidth={1.25}
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
  );
}
