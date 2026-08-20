# Brushly

Brushly turns a photo of a real-world scene into a painting lesson tailored to your medium and skill
level. Take or upload a photo, pick your medium (watercolor, acrylic, or oil) and skill level
(beginner, intermediate, or advanced), and Brushly uses Claude's vision API to:

1. Overlay a simplified outline of the main shapes/zones to paint on top of your photo, each labeled
   with a specific, photo-grounded name (e.g. "Palace building", "Cobblestone ground", "Cloudy sky")
   rather than a generic placeholder.
2. Generate detailed, sequential step-by-step instructions — each with the exact colors and mixing
   ratio, brush type and size, stroke technique, and roughly how long the step should take, written as
   a fully spelled-out, jargon-free narrative a first-time painter could follow with no other context.
   Skill level changes step count and scope (beginners get more, smaller steps; advanced painters get
   fewer, larger ones) but never drops the plain-English clarity bar.

## Architecture

```
Brushly/
  app/      React Native (Expo) client — Home, Capture, Results screens
  server/   Node/Express backend — proxies image analysis requests to the Claude API
```

The vision API key lives only on the server. The mobile app never talks to Claude directly — it
sends the photo (base64) + chosen medium to the backend, and the backend calls Claude and returns
structured JSON (shape outlines + instructions). Keeping the key server-side avoids shipping a
secret inside the app bundle.

If `EXPO_PUBLIC_API_URL` isn't set, the app falls back to a local mock response so you can run and
demo the UI without standing up the backend.

## Getting started

### 1. Backend (`server/`)

```bash
cd server
cp .env.example .env      # add your ANTHROPIC_API_KEY
npm install
npm run dev                # starts on http://localhost:4000
```

### 2. Mobile app (`app/`)

```bash
cd app
cp .env.example .env      # set EXPO_PUBLIC_API_URL to your backend
                           # e.g. http://192.168.1.20:4000 (use your LAN IP for a physical device;
                           # http://localhost:4000 only works in a simulator on the same machine)
npm install
npm start                  # opens Expo dev tools — press i / a, or scan the QR code with Expo Go
```

## How analysis works

`POST /api/analyze` on the server accepts `{ imageBase64, mimeType, medium, skillLevel }` and calls
Claude with a forced tool call (`return_painting_analysis`) so the response is always well-formed
JSON:

```json
{
  "shapes": [
    { "id": "palace", "label": "Palace building", "points": [[0.1, 0.1], [0.9, 0.1], [0.9, 0.6], [0.1, 0.55]], "colorHint": "#D8C7A8" }
  ],
  "instructions": [
    {
      "step": 1,
      "title": "Paint the sky",
      "description": "Paint the sky area first. Start from the top of your canvas and work downward. Use a large flat brush loaded with a mix of Titanium White and Cerulean Blue. Make long, smooth horizontal strokes going left to right.",
      "zoneIds": ["sky"],
      "colorMix": "Titanium White + Cerulean Blue, 3:1 ratio",
      "swatchHex": "#9FC6DE",
      "brush": "Flat brush, size 12",
      "technique": "Long horizontal strokes, blending top to bottom",
      "duration": "10 minutes"
    }
  ]
}
```

`points` are normalized (0–1) coordinates relative to the photo's width/height, so the app can scale
the outline to however the photo is actually rendered on screen (`app/src/components/OutlineOverlay.tsx`).

## Swapping in GPT-4o instead of Claude

The Claude-specific code is isolated in `server/src/lib/anthropic.ts` and `server/src/routes/analyze.ts`.
To use GPT-4o instead, replace the Anthropic client call with an OpenAI `chat.completions.create` call
using a JSON-schema/function-call response format, keeping the same `AnalysisResult` shape so nothing
in the app needs to change.

## Notes

- `app/assets/icon.png` (1024x1024, opaque) and `app/assets/adaptive-icon.png` (1024x1024, transparent
  foreground) are the app icons, referenced from `app.json` via `expo.icon` and
  `expo.android.adaptiveIcon`. Both were generated from a single SVG source (a paintbrush with a
  colorful paint-stroke gradient in the app's own accent palette, gold metal ferrule/handle, on the
  app's dark background) — the adaptive icon's artwork is scaled down further so it survives Android's
  circular/squircle launcher mask safe zone.
- The mobile app deliberately keeps the UI simple: three screens, large buttons, minimal choices.
- `expo-image-picker` is used for both "take a photo" and "choose from library" — no custom camera
  viewfinder is built, keeping the capture flow reliable across devices. The picker itself is asked
  for a URI only (not base64); `app/src/utils/imageProcessing.ts` then resizes the photo to a max
  width of 1200px and re-encodes it as a JPEG at quality 0.8 via `expo-image-manipulator` before it's
  sent to the backend — encoding a full-resolution camera capture directly is what made the picker
  feel sluggish on Android.
- Each step card shows a large, tappable thumbnail of the photo with that step's zone(s) highlighted
  (`app/src/components/ZoneThumbnail.tsx`, sized responsively to the card's full width), reusing the
  same shape polygons as the main outline. Tapping it opens `app/src/components/ZoneDetailModal.tsx`,
  a fullscreen view of the photo with the zone boldly highlighted and labeled. Each card also has a
  "What to Paint Here" callout (`app/src/utils/zoneDescription.ts`) that deterministically turns a
  step's `zoneIds` into a plain-English sentence naming the zone and roughly where it sits in the
  photo — this is derived client-side from the real shape data rather than AI-generated, so it can't
  be inaccurate. Shared centroid/label-sizing math lives in `app/src/utils/shapeGeometry.ts`, used by
  both `OutlineOverlay` and `ZoneDetailModal`.
- This is a scaffold meant to be extended (e.g. persisting past paintings, auth, sharing).
