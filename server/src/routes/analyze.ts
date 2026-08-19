import { Router } from "express";
import { AnalyzeRequestBody, Medium } from "../types";
import { analyzePhotoWithClaude } from "../lib/anthropic";

const VALID_MEDIA: Medium[] = ["watercolor", "acrylic", "oil"];

export const analyzeRouter = Router();

analyzeRouter.post("/analyze", async (req, res) => {
  const body = req.body as Partial<AnalyzeRequestBody>;

  if (!body.imageBase64 || typeof body.imageBase64 !== "string") {
    return res.status(400).json({ error: "imageBase64 is required." });
  }
  if (!body.medium || !VALID_MEDIA.includes(body.medium)) {
    return res
      .status(400)
      .json({ error: `medium must be one of: ${VALID_MEDIA.join(", ")}` });
  }

  const mimeType = body.mimeType || "image/jpeg";

  try {
    const result = await analyzePhotoWithClaude(
      body.imageBase64,
      mimeType,
      body.medium
    );
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    console.error("Analysis failed:", message);
    return res.status(502).json({ error: `Analysis failed: ${message}` });
  }
});
