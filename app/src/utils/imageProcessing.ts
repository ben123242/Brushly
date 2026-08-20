import * as ImageManipulator from "expo-image-manipulator";

const MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.8;

export interface ProcessedPhoto {
  uri: string;
  base64: string;
  mimeType: string;
}

/**
 * Resizes (max 1200px width, preserving aspect ratio) and re-encodes a picked
 * photo as a compressed JPEG off the image picker's own base64 path — a full
 * base64 encode of a raw camera capture (often 4000px+ wide) is what makes
 * the picker feel sluggish on Android, so the picker is asked for a uri only
 * and this does the resize + encode as a separate, smaller step.
 */
export async function processPickedImage(
  uri: string,
  originalWidth?: number
): Promise<ProcessedPhoto> {
  const actions: ImageManipulator.Action[] =
    originalWidth && originalWidth > MAX_WIDTH
      ? [{ resize: { width: MAX_WIDTH } }]
      : [];

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  if (!result.base64) {
    throw new Error("Failed to process the selected photo.");
  }

  return {
    uri: result.uri,
    base64: result.base64,
    mimeType: "image/jpeg",
  };
}
