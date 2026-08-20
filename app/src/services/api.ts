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
        "Paint the sky area first. Start from the top of your paper and work downward. Wet the paper with a clean, damp brush, then load your large flat wash brush with Cerulean Blue that's been diluted with plenty of water. Make long, smooth horizontal strokes going left to right — because the paper is wet, the edges of each stroke will bleed softly into the next, which is exactly what you want.",
    },
    {
      colorMix: "Yellow Ochre + Sap Green, roughly 1:1, kept fairly diluted",
      swatchHex: "#9CAA5E",
      brush: "Medium round brush, size 8",
      technique:
        "Wet-on-dry: apply in loose, broken strokes following the horizon line so some paper texture shows through.",
      duration: "10-12 minutes",
      description:
        "Once the sky is completely dry to the touch, paint the rolling hills sitting just below it. Load a medium round brush (size 8) with Yellow Ochre and Sap Green mixed roughly half and half, diluted with water to a mid-strength wash. This time work on dry paper (called \"wet-on-dry\"), and make loose, slightly broken strokes that follow the up-and-down curve of the hills — don't cover every bit of paper solidly, since small gaps of texture showing through make distant hills look soft and hazy.",
    },
    {
      colorMix: "Burnt Sienna + Ultramarine Blue, 2:1, for a warm neutral brown",
      swatchHex: "#8C6B52",
      brush: "Medium round brush, size 8",
      technique: "Wet-on-dry with confident, slightly diagonal strokes to suggest ground texture.",
      duration: "10 minutes",
      description:
        "Now paint the dirt path across the lower third of your paper. Mix Burnt Sienna with a smaller amount of Ultramarine Blue (about 2 parts sienna to 1 part blue) to make a warm brown, and load it onto your size 8 round brush. Starting at the left edge, pull confident strokes on a slight diagonal all the way across. Leave a few tiny untouched specks of white paper here and there — those little gaps read as sunlight catching the ground.",
    },
    {
      colorMix: "Burnt Sienna + Alizarin Crimson, 1:1, undiluted for strong color",
      swatchHex: "#A9503B",
      brush: "Small round brush, size 4",
      technique:
        "Wet-on-dry with short, deliberate strokes, building up two light layers rather than one heavy one.",
      duration: "12-15 minutes, with a short dry in between layers",
      description:
        "Paint the red barn last, once everything around it is fully dry. Mix Burnt Sienna and Alizarin Crimson in equal parts, undiluted, for a strong red-brown. Using a small round brush (size 4), start at the top of the barn shape and paint short, deliberate strokes downward to fill in its outline. Let this first layer dry for a few minutes, then repeat with a second light layer over the same area — two thin layers stay bright and clean, where one heavy layer would look muddy.",
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
        "Paint the sky area first. Start from the top of your canvas and work downward. Use a large flat brush (size 12) loaded with a mix of Titanium White and Cerulean Blue in a 3:1 ratio — mostly white with a little blue. Make long, smooth horizontal strokes going left to right, covering the whole sky area evenly before the paint starts to dry (acrylic dries fast, so keep moving).",
    },
    {
      colorMix: "Titanium White + Sap Green + a touch of Yellow Ochre, 2:2:1",
      swatchHex: "#A3B074",
      brush: "Flat brush, size 10",
      technique: "Short horizontal dabs to suggest distant, soft-edged foliage.",
      duration: "10 minutes",
      description:
        "Once the sky is touch-dry, paint the rolling hills that sit just below it. Mix Titanium White, Sap Green, and a small amount of Yellow Ochre in roughly a 2:2:1 ratio and load it onto a size 10 flat brush. Working left to right along the horizon line, use short horizontal dabbing strokes rather than long sweeps — this breaks up the edge and makes the hills read as soft and slightly out of focus, since they're far away.",
    },
    {
      colorMix: "Burnt Umber + Titanium White, 1:1, mixed to a mid-brown",
      swatchHex: "#9C7A61",
      brush: "Flat brush, size 12",
      technique: "Confident, slightly overlapping horizontal strokes across the whole ground plane.",
      duration: "10-12 minutes",
      description:
        "Paint the dirt path across the bottom third of your canvas. Mix Burnt Umber and Titanium White in equal parts to get a mid-brown, and load your size 12 flat brush fully. Starting at the left edge, pull confident horizontal strokes all the way to the right, each stroke overlapping the one above it slightly so there are no gaps of bare canvas.",
    },
    {
      colorMix: "Cadmium Red + Burnt Sienna, 1:1, undiluted for full opacity",
      swatchHex: "#B65B42",
      brush: "Round brush, size 6 for shaping, size 2 for edges",
      technique: "Build the form with layered dabs, then sharpen the outline with a thin brush once dry.",
      duration: "15 minutes",
      description:
        "Paint the red barn on top of the now-dry background. Mix Cadmium Red and Burnt Sienna in equal parts, undiluted, and load a size 6 round brush. Build up the barn's shape with layered dabbing strokes, working from the large flat walls first, then switch to a thin size 2 brush once that's dry to paint in the sharp straight edges of the roofline and corners.",
    },
    {
      colorMix: "Titanium White, straight from the tube, for highlights",
      swatchHex: "#FFFFFF",
      brush: "Small round or liner brush, size 1-2",
      technique: "Tiny, precise dashes only where light would actually catch a surface.",
      duration: "5-8 minutes",
      description:
        "Finish with a few small highlights. Load a tiny amount of Titanium White, straight from the tube with no mixing, onto a small liner brush (size 1-2). Add short, precise dashes only along the top edge of the barn's roof and one side of its walls — the sides that would actually catch sunlight. A little goes a long way here, so resist covering more than a few small spots.",
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
        "Paint the sky area first. Start from the top of your canvas and work downward. Mix Titanium White and Cerulean Blue and thin it with solvent so it's loose and workable — this first layer needs to stay thin so later, thicker layers can go on top without cracking (painters call this working \"fat over lean\", meaning fatty, oily paint always goes over leaner, thinner paint, never the other way around). Use a large flat bristle brush and make long, loose horizontal strokes left to right.",
    },
    {
      colorMix: "Yellow Ochre + Sap Green + a touch of White, 1:1:1",
      swatchHex: "#A8AE6E",
      brush: "Medium filbert brush, size 8",
      technique: "Soft, blended dabs, working wet-into-wet with the sky's edge for a hazy transition.",
      duration: "12 minutes",
      description:
        "While the sky is still wet, paint the rolling hills just below it. Mix Yellow Ochre, Sap Green, and a touch of White in roughly equal parts, and load a medium filbert brush (size 8). Use soft dabbing strokes along the horizon, gently blending the top edge of the hills into the wet sky above (called working \"wet-into-wet\") so the transition between them looks hazy rather than sharp.",
    },
    {
      colorMix: "Burnt Umber + Ultramarine Blue, 2:1, for a rich neutral",
      swatchHex: "#7C6650",
      brush: "Medium filbert brush, size 8",
      technique: "Broad, slightly diagonal strokes with visible brush texture for interest.",
      duration: "12-15 minutes",
      description:
        "Paint the dirt path across the bottom of your canvas. Mix Burnt Umber with a smaller amount of Ultramarine Blue (2 parts umber to 1 part blue) for a rich brown, using slightly thicker, oilier paint than you used for the sky. Load your size 8 filbert brush and pull broad strokes on a slight diagonal across the whole path, letting the bristle marks stay visible in the paint for texture.",
    },
    {
      colorMix: "Cadmium Red + Burnt Sienna, 1:1, full-bodied straight from the tube",
      swatchHex: "#B95B42",
      brush: "Round brush, size 6, switching to a size 2 liner for edges",
      technique: "Build form with layered wet-into-wet blending, softening edges with a dry brush pass.",
      duration: "20 minutes",
      description:
        "Paint the red barn with the thickest, most vibrant paint of the whole piece. Mix Cadmium Red and Burnt Sienna in equal parts, full-bodied straight from the tube, and load a size 6 round brush. Build up the walls and roof with layered strokes while the background is still workable, blending the barn's edges softly into the ground where they meet, then switch to a size 2 liner brush to paint in the sharp lines of the roof edge and corners.",
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
    "Sketch the shapes",
    "Paint the sky",
    "Paint the rolling hills",
    "Paint the dirt path",
    "Paint the red barn",
    "Add final highlights",
  ];

  const sketchStep: InstructionStep = {
    step: 1,
    title: titles[0],
    description:
      skillLevel === "beginner"
        ? "Before touching any paint, lightly sketch the four shapes shown in the photo above using a pencil: the sky at the top, the rolling hills below it, the dirt path along the bottom, and the red barn in the middle. Keep your pencil lines light and loose — you're just marking where each area goes on your canvas, not drawing details, so don't worry about getting the lines perfectly accurate yet."
        : skillLevel === "intermediate"
        ? "Rough in the sky, hills, path, and barn shapes from the photo above to establish proportions before you start painting."
        : "Rough in proportions for the sky, hills, path, and barn from the photo above; keep it minimal.",
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
        label: "Clear blue sky",
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
        label: "Rolling green hills",
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
        label: "Dirt path foreground",
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
        label: "Red barn",
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
