const CHAR_WIDTH_RATIO = 0.62;

export function centroidOf(points: [number, number][]): [number, number] {
  const sum = points.reduce<[number, number]>(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0]
  );
  return [sum[0] / points.length, sum[1] / points.length];
}

export interface LabelBoxSize {
  width: number;
  height: number;
}

/** Rough label pill size for a given label/font size, since RN SVG text has no layout measurement API. */
export function estimateLabelBoxSize(
  label: string,
  fontSize: number,
  hPadding: number,
  vPadding: number
): LabelBoxSize {
  return {
    width: label.length * fontSize * CHAR_WIDTH_RATIO + hPadding * 2,
    height: fontSize + vPadding * 2,
  };
}
