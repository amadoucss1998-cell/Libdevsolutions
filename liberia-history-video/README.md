# Liberia Before 1847 — Animated History (Remotion)

A ~60-second animated explainer with voiceover on the history of Liberia
**before independence in 1847**, built with [Remotion](https://remotion.dev).

> The finished render lives at [`out/liberia-before-1847.mp4`](out/liberia-before-1847.mp4)
> (1920×1080, 30 fps, H.264 + AAC, with narration and a music bed).

## What it covers

1. **Origins** — the indigenous peoples of the coast (Gola, Kpelle, Bassa, Kru, Vai …)
2. **The Grain Coast** — the malaguetta-pepper trade that drew European ships
3. **1816** — the founding of the American Colonization Society
4. **1820** — the voyage of the ship *Elizabeth* across the Atlantic
5. **1822** — settlement at Cape Mesurado; the founding of Monrovia
6. **Liberia** — "the land of the free"
7. **Toward 1847** — a timeline closing on the eve of independence

## Voiceover

The narration is generated locally with [Piper TTS](https://github.com/rhasspy/piper)
(`en_US-ryan-high`) and lightly mastered with ffmpeg (loudness-normalised, with a
synthesized ambient pad underneath). The script is reproduced in
[`public/`](public) as audio; the spoken lines also appear as on-screen subtitles.

The animation timing in [`src/timeline.ts`](src/timeline.ts) is derived from the
measured duration of each narration segment, so the visuals stay in sync with the
voice.

### Swapping in a different voice

To use another voice (e.g. a Higgsfield preset such as **Andre**), generate an MP3
of the same script, drop it in as `public/narration.mp3`, re-measure the per-segment
durations, update the frame numbers in `src/timeline.ts`, and re-render.

## Project layout

```
src/
  index.ts          # registerRoot
  Root.tsx          # <Composition> definition
  LiberiaVideo.tsx  # timeline: scenes + audio + subtitles
  timeline.ts       # fps, frames, palette, per-scene timings
  components.tsx     # reusable bits (subtitles, ocean, stars, vignette)
  Scenes.tsx        # the seven scenes + outro
public/
  narration.mp3     # voiceover
  music.mp3         # ambient bed
out/
  liberia-before-1847.mp4
```

## Run it

```bash
npm install
npm run dev      # open Remotion Studio to preview/scrub
npm run render   # render to out/liberia-before-1847.mp4
```

`npm run render` points Remotion at the environment's pre-installed Chromium
headless shell. On a normal machine, drop the `--browser-executable` flag and
Remotion will download its own.

## A note on the history

This is a short, high-level overview. The settlement of Liberia by the American
Colonization Society was bound up with the lives of the indigenous nations who
already lived on the coast — including land cessions made under pressure — and the
relationship between the new settlers (the Americo-Liberians) and those communities
shaped the country for generations. The video aims to introduce the period, not to
be a complete account.
