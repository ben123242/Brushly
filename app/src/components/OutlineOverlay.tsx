import React from "react";
import Svg, { Polygon, Rect, Text as SvgText } from "react-native-svg";
import { Shape } from "../types";
import { centroidOf, estimateLabelBoxSize } from "../utils/shapeGeometry";

const PALETTE = ["#E6C878", "#F1E9D8", "#6FA39A", "#C97B5F", "#A67BC9", "#7B93A6"];

const FONT_SIZE = 15;
const LABEL_H_PADDING = 9;
const LABEL_V_PADDING = 5;

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
        const [centroidX, centroidY] = centroidOf(shape.points);
        const cx = centroidX * width;
        const cy = centroidY * height;

        const { width: labelWidth, height: labelHeight } = estimateLabelBoxSize(
          shape.label,
          FONT_SIZE,
          LABEL_H_PADDING,
          LABEL_V_PADDING
        );

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
