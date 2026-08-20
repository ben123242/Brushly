export type Medium = "watercolor" | "acrylic" | "oil";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Shape {
  id: string;
  label: string;
  points: [number, number][];
  colorHint?: string;
}

export interface InstructionStep {
  step: number;
  title: string;
  description: string;
  zoneIds?: string[];
  /** Exact colors and mixing ratio, e.g. "Titanium White + Cerulean Blue, 3:1 ratio". */
  colorMix?: string;
  /** Approximate resulting hex color of the mix, for a small preview swatch. */
  swatchHex?: string;
  /** Brush type and size, e.g. "Flat brush, size 12". */
  brush?: string;
  /** The specific stroke technique, e.g. "Long horizontal strokes, light pressure". */
  technique?: string;
  /** Roughly how long this step should take, e.g. "10-15 minutes". */
  duration?: string;
}

export interface AnalysisResult {
  shapes: Shape[];
  instructions: InstructionStep[];
  summary?: string;
}

export interface AnalyzeRequestBody {
  imageBase64: string;
  mimeType?: string;
  medium: Medium;
  skillLevel: SkillLevel;
}
