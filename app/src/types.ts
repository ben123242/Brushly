export type Medium = "watercolor" | "acrylic" | "oil";

export const MEDIA: { value: Medium; label: string }[] = [
  { value: "watercolor", label: "Watercolor" },
  { value: "acrylic", label: "Acrylic" },
  { value: "oil", label: "Oil" },
];

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export interface Shape {
  id: string;
  label: string;
  /** Normalized (0-1) [x, y] points relative to the photo's width/height. */
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

export type RootStackParamList = {
  Home: undefined;
  Capture: { medium: Medium; skillLevel: SkillLevel };
  Results: {
    photoUri: string;
    base64: string;
    mimeType: string;
    medium: Medium;
    skillLevel: SkillLevel;
  };
};
