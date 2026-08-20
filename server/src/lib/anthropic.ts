import Anthropic from "@anthropic-ai/sdk";
import { Medium, SkillLevel, AnalysisResult } from "../types";
import { buildSystemPrompt, USER_PROMPT_TEXT } from "../prompt";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set on the server.");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

const ANALYSIS_TOOL = {
  name: "return_painting_analysis",
  description:
    "Return the simplified shape outlines and step-by-step painting instructions for the analyzed photo.",
  input_schema: {
    type: "object" as const,
    properties: {
      shapes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Short unique identifier, e.g. 'sky'." },
            label: { type: "string", description: "Human-readable label, e.g. 'Sky'." },
            points: {
              type: "array",
              description: "Polygon points as [x, y], normalized 0-1.",
              items: {
                type: "array",
                items: { type: "number" },
                minItems: 2,
                maxItems: 2,
              },
              minItems: 3,
            },
            colorHint: { type: "string", description: "Approximate hex color, e.g. '#7EC8E3'." },
          },
          required: ["id", "label", "points"],
        },
      },
      instructions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            zoneIds: { type: "array", items: { type: "string" } },
            colorMix: {
              type: "string",
              description:
                "Exact paint colors and mixing ratio for this step, e.g. 'Titanium White + Cerulean Blue, 3:1 ratio'.",
            },
            swatchHex: {
              type: "string",
              description: "Approximate resulting hex color of the mix, e.g. '#9FC6DE', for a small preview swatch.",
            },
            brush: {
              type: "string",
              description: "Brush type and size, e.g. 'Flat brush, size 12' or 'Round brush, size 4 (detail)'.",
            },
            technique: {
              type: "string",
              description:
                "The specific stroke technique and direction, e.g. 'Long horizontal strokes, light pressure'.",
            },
            duration: {
              type: "string",
              description: "Roughly how long this step should take, e.g. '10-15 minutes'.",
            },
          },
          required: ["step", "title", "description", "colorMix", "brush", "technique", "duration"],
        },
      },
      summary: { type: "string" },
    },
    required: ["shapes", "instructions"],
  },
};

export async function analyzePhotoWithClaude(
  imageBase64: string,
  mimeType: string,
  medium: Medium,
  skillLevel: SkillLevel
): Promise<AnalysisResult> {
  const anthropic = getClient();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: buildSystemPrompt(medium, skillLevel),
    tools: [ANALYSIS_TOOL],
    tool_choice: { type: "tool", name: ANALYSIS_TOOL.name },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data: imageBase64,
            },
          },
          { type: "text", text: USER_PROMPT_TEXT },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claude did not return a structured analysis.");
  }

  return toolUse.input as AnalysisResult;
}
