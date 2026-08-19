import { AnalysisResult, Medium } from "../types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface AnalyzeParams {
  base64: string;
  mimeType: string;
  medium: Medium;
}

export async function analyzePainting({
  base64,
  mimeType,
  medium,
}: AnalyzeParams): Promise<AnalysisResult> {
  if (!API_URL) {
    return getMockAnalysis(medium);
  }

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64, mimeType, medium }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Analysis failed (${response.status}): ${text || response.statusText}`
    );
  }

  return response.json();
}

const MEDIUM_TIPS: Record<Medium, string[]> = {
  watercolor: [
    "Sketch the main shapes lightly in pencil first — watercolor can't cover mistakes.",
    "Work light to dark, and leave the palest areas of the paper untouched (that's your white).",
    "Wet your paper first for the sky/background so the color spreads softly.",
    "Let each layer dry before adding darker details on top, so colors stay clean.",
  ],
  acrylic: [
    "Block in each shape with its base color first — acrylic dries fast, so work in stages.",
    "Start with the background zones, then paint mid-ground shapes over them.",
    "Mix your darkest and lightest values before you start, so you're not guessing mid-painting.",
    "Add fine details last, once the base layers are fully dry.",
  ],
  oil: [
    "Block in loose, thin shapes first (fat over lean — thin paint now, thicker later).",
    "Work background to foreground so closer shapes overlap the ones behind them.",
    "Blend edges while the paint is still wet for soft transitions.",
    "Save the smallest, sharpest details for last, using a thin brush and thicker paint.",
  ],
};

function getMockAnalysis(medium: Medium): Promise<AnalysisResult> {
  const tips = MEDIUM_TIPS[medium];
  const result: AnalysisResult = {
    summary:
      "Demo mode: this is sample data. Set EXPO_PUBLIC_API_URL to your backend to analyze real photos.",
    shapes: [
      {
        id: "sky",
        label: "Sky",
        points: [
          [0.0, 0.0],
          [1.0, 0.0],
          [1.0, 0.38],
          [0.0, 0.42],
        ],
        colorHint: "#7EC8E3",
      },
      {
        id: "background",
        label: "Distant hills",
        points: [
          [0.0, 0.42],
          [0.35, 0.35],
          [0.7, 0.44],
          [1.0, 0.38],
          [1.0, 0.58],
          [0.0, 0.58],
        ],
        colorHint: "#8FAE7C",
      },
      {
        id: "ground",
        label: "Ground / foreground",
        points: [
          [0.0, 0.58],
          [1.0, 0.58],
          [1.0, 1.0],
          [0.0, 1.0],
        ],
        colorHint: "#B08858",
      },
      {
        id: "focal",
        label: "Main subject",
        points: [
          [0.38, 0.5],
          [0.62, 0.48],
          [0.66, 0.82],
          [0.34, 0.84],
        ],
        colorHint: "#D97B5F",
      },
    ],
    instructions: [
      {
        step: 1,
        title: "Map the shapes",
        description:
          "Lightly sketch the four zones shown in the outline: sky, distant background, ground, and the main subject. Keep the lines loose — you're just placing shapes.",
        zoneIds: ["sky", "background", "ground", "focal"],
      },
      {
        step: 2,
        title: "Block in the sky and background",
        description: tips[0],
        zoneIds: ["sky", "background"],
      },
      {
        step: 3,
        title: "Establish the ground",
        description: tips[1],
        zoneIds: ["ground"],
      },
      {
        step: 4,
        title: "Paint the main subject",
        description: tips[2],
        zoneIds: ["focal"],
      },
      {
        step: 5,
        title: "Add final details",
        description: tips[3],
        zoneIds: ["focal", "ground"],
      },
    ],
  };

  return new Promise((resolve) => setTimeout(() => resolve(result), 900));
}
