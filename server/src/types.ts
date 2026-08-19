export type Medium = "watercolor" | "acrylic" | "oil";

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
}
