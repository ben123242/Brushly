# Brushly

Brushly turns a photo of a real-world scene into a beginner-friendly painting lesson. Take or upload a photo, pick your medium (watercolor, acrylic, or oil), and Brushly uses Claude's vision API to:

1. Overlay a simplified outline of the main shapes/zones to paint on top of your photo.
2. Generate step-by-step instructions tailored to your chosen medium.

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

`POST /api/analyze` on the server accepts `{ imageBase64, mimeType, medium }` and calls Claude with
a forced tool call (`return_painting_analysis`) so the response is always well-formed JSON:

```json
{
  "shapes": [
    { "id": "sky", "label": "Sky", "points": [[0.0, 0.0], [1.0, 0.0], [1.0, 0.35], [0.0, 0.4]], "colorHint": "#7EC8E3" }
  ],
  "instructions": [
    { "step": 1, "title": "Block in the sky", "description": "...", "zoneIds": ["sky"] }
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

- The mobile app deliberately keeps the UI simple: three screens, large buttons, minimal choices.
- `expo-image-picker` is used for both "take a photo" and "choose from library" — no custom camera
  viewfinder is built, keeping the capture flow reliable across devices.
- This is a scaffold meant to be extended (e.g. persisting past paintings, auth, sharing).
