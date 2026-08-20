import { Shape } from "../types";
import { centroidOf } from "./shapeGeometry";

/** Buckets a normalized (0-1) coordinate into a 3-way low/mid/high position. */
function bucket(value: number): "low" | "mid" | "high" {
  if (value < 1 / 3) return "low";
  if (value > 2 / 3) return "high";
  return "mid";
}

/** Describes roughly where a shape sits in the photo, from its centroid. */
export function describeZonePosition(shape: Shape): string {
  const [cx, cy] = centroidOf(shape.points);
  const col = bucket(cx);
  const row = bucket(cy);

  if (row === "mid" && col === "mid") return "in the center of your photo";
  if (row === "mid") {
    return col === "low" ? "on the left side of your photo" : "on the right side of your photo";
  }
  if (col === "mid") {
    return row === "low" ? "across the top of your photo" : "across the bottom of your photo";
  }
  const rowWord = row === "low" ? "upper" : "lower";
  const colWord = col === "low" ? "left" : "right";
  return `in the ${rowWord}-${colWord} area of your photo`;
}

function joinLabels(labels: string[]): string {
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

/** Plain-English "what to paint here" text tying a step's zoneIds back to the highlighted photo area. */
export function buildWhatToPaintText(
  zoneIds: string[] | undefined,
  shapes: Shape[]
): string {
  const ids = zoneIds ?? [];
  const matched = ids
    .map((id) => shapes.find((shape) => shape.id === id))
    .filter((shape): shape is Shape => !!shape);

  if (matched.length === 0) {
    return "This step covers your whole canvas rather than one specific area — there's no single zone highlighted for it.";
  }

  if (matched.length === 1) {
    const shape = matched[0];
    return `Focus on the ${shape.label} — it's ${describeZonePosition(shape)}, marked in gold on the photo above.`;
  }

  const labels = joinLabels(matched.map((shape) => shape.label));
  return `This step covers the ${labels} — these are the areas highlighted in gold on the photo above.`;
}
