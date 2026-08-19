export type Medium = "watercolor" | "acrylic" | "oil";

export const MEDIA: { value: Medium; label: string }[] = [
  { value: "watercolor", label: "Watercolor" },
  { value: "acrylic", label: "Acrylic" },
  { value: "oil", label: "Oil" },
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
}

export interface AnalysisResult {
  shapes: Shape[];
  instructions: InstructionStep[];
  summary?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Capture: { medium: Medium };
  Results: {
    photoUri: string;
    base64: string;
    mimeType: string;
    medium: Medium;
  };
};
