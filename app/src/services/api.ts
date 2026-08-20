import { AnalysisResult, InstructionStep, Medium, SkillLevel } from "../types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface AnalyzeParams {
  base64: string;
  mimeType: string;
  medium: Medium;
  skillLevel: SkillLevel;
}

export async function analyzePainting({
  base64,
  mimeType,
  medium,
  skillLevel,
}: AnalyzeParams): Promise<AnalysisResult> {
  if (!API_URL) {
    return getMockAnalysis(medium, skillLevel);
  }

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64, mimeType, medium, skillLevel }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Analysis failed (${response.status}): ${text || response.statusText}`
    );
  }

  return response.json();
}

interface MediumStepDetails {
  colorMix: string;
  swatchHex: string;
  brush: string;
  technique: string;
  duration: string;
  description: string;
}

const MEDIUM_STEP_DETAILS: Record<Medium, MediumStepDetails[]> = {
  watercolor: [
    {
      colorMix: "Cerulean Blue + a generous amount of water (very light wash)",
      swatchHex: "#BEE0EE",
      brush: "Large flat wash brush, 1 inch",
      technique:
        "Wet the paper first, then lay long horizontal strokes and let the color bleed softly at the edges (wet-on-wet).",
      duration: "8-10 minutes, plus drying time",
      description:
        "Sketch the main shapes lightly in pencil first — watercolor can't cover mistakes. Then wet the sky area and drop in a very light wash, letting it settle unevenly for a natural look.",
    },
    {
      colorMix: "Yellow Ochre + Sap Green, roughly 1:1, kept fairly diluted",
      swatchHex: "#9CAA5E",
      brush: "Medium round brush, size 8",
      technique:
        "Wet-on-dry: apply in loose, broken strokes following the horizon line so some paper texture shows through.",
      duration: "10-12 minutes",
      description:
        "Once the sky is fully dry, block in the distant background shapes with a mid-value green-gold wash. Keep edges soft here — anything far away should look slightly hazy.",
    },
    {
      colorMix: "Burnt Sienna + Ultramarine Blue, 2:1, for a warm neutral brown",
      swatchHex: "#8C6B52",
      brush: "Medium round brush, size 8",
      technique: "Wet-on-dry with confident, slightly diagonal strokes to suggest ground texture.",
      duration: "10 minutes",
      description:
        "Establish the ground plane with a warm neutral wash. Leave a few tiny gaps of untouched white paper for sparkle where light would catch the surface.",
    },
    {
      colorMix: "Burnt Sienna + Alizarin Crimson, 1:1, undiluted for strong color",
      swatchHex: "#A9503B",
      brush: "Small round brush, size 4",
      technique:
        "Wet-on-dry with short, deliberate strokes, building up two light layers rather than one heavy one.",
      duration: "12-15 minutes, with a short dry in between layers",
      description:
        "Paint the main subject last, once everything around it is dry. Build the color in two thin layers so it stays luminous instead of muddy.",
    },
  ],
  acrylic: [
    {
      colorMix: "Titanium White + Cerulean Blue, 3:1 ratio",
      swatchHex: "#BBDCEC",
      brush: "Flat brush, size 12",
      technique: "Long horizontal strokes, blending top to bottom while the paint is still wet.",
      duration: "10 minutes",
      description:
        "Block in the sky first with flat, even coverage. Acrylic dries fast, so work the whole area before it starts to set.",
    },
    {
      colorMix: "Titanium White + Sap Green + a touch of Yellow Ochre, 2:2:1",
      swatchHex: "#A3B074",
      brush: "Flat brush, size 10",
      technique: "Short horizontal dabs to suggest distant, soft-edged foliage.",
      duration: "10 minutes",
      description:
        "Once the sky area is touch-dry, block in the background shapes over it. Keep this layer slightly lighter in value than the foreground will be.",
    },
    {
      colorMix: "Burnt Umber + Titanium White, 1:1, mixed to a mid-brown",
      swatchHex: "#9C7A61",
      brush: "Flat brush, size 12",
      technique: "Confident, slightly overlapping horizontal strokes across the whole ground plane.",
      duration: "10-12 minutes",
      description:
        "Cover the ground with flat, opaque color. Don't worry about texture yet — that comes in a later detail pass.",
    },
    {
      colorMix: "Cadmium Red + Burnt Sienna, 1:1, undiluted for full opacity",
      swatchHex: "#B65B42",
      brush: "Round brush, size 6 for shaping, size 2 for edges",
      technique: "Build the form with layered dabs, then sharpen the outline with a thin brush once dry.",
      duration: "15 minutes",
      description:
        "Paint the main subject on top of the now-dry background, working from the largest masses down to the smallest defining edges.",
    },
    {
      colorMix: "Titanium White, straight from the tube, for highlights",
      swatchHex: "#FFFFFF",
      brush: "Small round or liner brush, size 1-2",
      technique: "Tiny, precise dashes only where light would actually catch a surface.",
      duration: "5-8 minutes",
      description:
        "Finish with a few small, bright highlights and any last dark accents. A little goes a long way — resist adding too much.",
    },
  ],
  oil: [
    {
      colorMix: "Titanium White + Cerulean Blue, thinned with solvent (fat-over-lean: thin now)",
      swatchHex: "#C6DEEC",
      brush: "Large flat bristle brush, 1 inch",
      technique: "Long, loose horizontal strokes, keeping the paint thin and workable.",
      duration: "10 minutes",
      description:
        "Block in the sky loosely and thin — this early layer should stay thin so later, thicker layers can go on top without cracking (fat over lean).",
    },
    {
      colorMix: "Yellow Ochre + Sap Green + a touch of White, 1:1:1",
      swatchHex: "#A8AE6E",
      brush: "Medium filbert brush, size 8",
      technique: "Soft, blended dabs, working wet-into-wet with the sky's edge for a hazy transition.",
      duration: "12 minutes",
      description:
        "Add the distant background while the sky is still workable, blending the two together slightly at the horizon.",
    },
    {
      colorMix: "Burnt Umber + Ultramarine Blue, 2:1, for a rich neutral",
      swatchHex: "#7C6650",
      brush: "Medium filbert brush, size 8",
      technique: "Broad, slightly diagonal strokes with visible brush texture for interest.",
      duration: "12-15 minutes",
      description:
        "Establish the ground with thicker, more textured paint than the sky — this is where you can start adding a bit more oil to the mix.",
    },
    {
      colorMix: "Cadmium Red + Burnt Sienna, 1:1, full-bodied straight from the tube",
      swatchHex: "#B95B42",
      brush: "Round brush, size 6, switching to a size 2 liner for edges",
      technique: "Build form with layered wet-into-wet blending, softening edges with a dry brush pass.",
      duration: "20 minutes",
      description:
        "Paint the main subject with the thickest, most vibrant paint of the piece, blending edges into the background while everything is still wet.",
    },
  ],
};

const SKILL_LEVEL_INTRO: Record<SkillLevel, string> = {
  beginner:
    "Demo mode: this is sample data with beginner-friendly, highly detailed steps. Set EXPO_PUBLIC_API_URL to your backend to analyze real photos.",
  intermediate:
    "Demo mode: this is sample data with intermediate-level steps. Set EXPO_PUBLIC_API_URL to your backend to analyze real photos.",
  advanced:
    "Demo mode: this is sample data with concise, advanced-level steps. Set EXPO_PUBLIC_API_URL to your backend to analyze real photos.",
};

function buildMockSteps(
  medium: Medium,
  skillLevel: SkillLevel,
  zoneOrder: string[]
): InstructionStep[] {
  const details = MEDIUM_STEP_DETAILS[medium];
  const titles = [
    "Map the shapes",
    "Block in the sky",
    "Establish the background",
    "Build the ground",
    "Paint the main subject",
    "Add final highlights",
  ];

  const sketchStep: InstructionStep = {
    step: 1,
    title: titles[0],
    description:
      skillLevel === "beginner"
        ? "Lightly sketch the shapes shown in the outline before touching any paint. Keep the lines loose and just place where each zone goes — accuracy isn't important yet."
        : skillLevel === "intermediate"
        ? "Rough in the main shapes from the outline to establish proportions before painting."
        : "Rough in proportions from the outline; keep it minimal.",
    zoneIds: zoneOrder,
    brush: "Pencil or a thin round brush, size 2",
    technique: "Light, loose lines — just enough to see where each zone begins and ends.",
    duration: skillLevel === "beginner" ? "5 minutes" : "2-3 minutes",
  };

  const detailSteps: InstructionStep[] = details
    .slice(0, skillLevel === "advanced" ? details.length - 1 : details.length)
    .map((detail, index) => ({
      step: index + 2,
      title: titles[index + 1] ?? `Step ${index + 2}`,
      description: detail.description,
      zoneIds: [zoneOrder[Math.min(index, zoneOrder.length - 1)]],
      colorMix: detail.colorMix,
      swatchHex: detail.swatchHex,
      brush: detail.brush,
      technique: detail.technique,
      duration: detail.duration,
    }));

  return [sketchStep, ...detailSteps];
}

function getMockAnalysis(
  medium: Medium,
  skillLevel: SkillLevel
): Promise<AnalysisResult> {
  const zoneOrder = ["sky", "background", "ground", "focal"];
  const result: AnalysisResult = {
    summary: SKILL_LEVEL_INTRO[skillLevel],
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
    instructions: buildMockSteps(medium, skillLevel, zoneOrder),
  };

  return new Promise((resolve) => setTimeout(() => resolve(result), 900));
}
