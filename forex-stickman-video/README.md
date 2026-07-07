# Forex Trading for Beginners — The Truth (Stickman Animation)

A fast-cut, caption-driven stickman explainer built with [Remotion](https://remotion.dev),
adapting the "Forex Trading for Beginners" script into a ~7.5 minute vertical
(1080×1920) video for YouTube Shorts / TikTok-style delivery.

> The finished render lives at
> [`out/forex-trading-for-beginners.mp4`](out/forex-trading-for-beginners.mp4)
> (1080×1920, 30 fps, H.264 + AAC, with an ambient background music bed).

## What it covers

All 15 scenes from the script plus the closing message: the "get rich quick"
hook, the reality-check loss, what Forex actually is, buy vs. sell, reading a
candlestick chart, the one-candle mistake, support & resistance, trend, risk
management, stop loss, risk:reward, trading psychology, a trading-plan
checklist, patience, and the slow, unglamorous account growth at the end.

## Why captions instead of a recorded voiceover

The companion `liberia-history-video` project in this repo used Piper TTS for
narration. That path wasn't available in the sandbox this was built in:
Piper's voice models are hosted on `huggingface.co`, which this environment's
network egress policy blocks outright. Higgsfield's hosted voice generation
(`generate_audio`) was evaluated as an alternative and does work — a same
account balance and a preflight cost check confirmed it — but the resulting
audio is hosted on `cloudfront.net`, which is likewise blocked by egress
policy, so the generated files can't be pulled into this session no matter
the credit balance.

Given that, the video is driven entirely by animated on-screen dialogue —
a speech-bubble caption for every line, color-coded and labeled by speaker
(Alex / Mentor / Narrator), timed from each line's word count rather than a
measured narration track. An ambient background bed is synthesized locally
with `ffmpeg` (layered sine tones + soft pink noise, loudness-normalized) so
the video isn't silent.

### Adding a real voiceover later

If narration becomes available (a locally downloaded Piper voice, an
unblocked Higgsfield/other TTS pipeline, or a recorded track):

1. Generate one audio file per scene (or one full-script track) and drop it
   into `public/`.
2. Re-measure each line's actual spoken duration and update the frame counts
   in the `beats` arrays in `src/timeline.ts` (the `say()` / `visual()`
   helpers currently size beats from reading speed — swap those numbers for
   measured durations).
3. Add an `<Audio src={staticFile(...)} />` sequence in
   `src/ForexStickmanVideo.tsx` alongside the existing music bed.

## Project layout

```
src/
  index.ts               # registerRoot
  Root.tsx                # <Composition> definition (1080x1920 @ 30fps)
  ForexStickmanVideo.tsx   # top-level timeline: scenes + music
  timeline.ts              # scene/beat definitions, frame-timing, palette
  StickFigure.tsx          # the animated stick-figure character (Alex/Mentor)
  components.tsx           # captions, title cards, chips, stat cards, progress bar
  graphics.tsx             # scene-specific visuals: candles, monsters, charts,
                            #   trend lines, checklist, currency globe, etc.
  Scenes.tsx               # all 16 scenes (15 numbered + final message)
public/
  music.mp3                # ffmpeg-synthesized ambient background bed
out/
  forex-trading-for-beginners.mp4
```

## Run it

```bash
npm install
npm run dev      # open Remotion Studio to preview/scrub
npm run render   # render to out/forex-trading-for-beginners.mp4
npm run still    # render a single frame to out/still.png
```

`npm run render` points Remotion at the environment's pre-installed Chromium
headless shell. On a normal machine, drop the `--browser-executable` flag and
Remotion will download its own.

## Regenerating the music bed

The ambient loop was synthesized with a single offline `ffmpeg` command
(layered `sine` oscillators + `anoisesrc` pink noise, faded and loudness
normalized) — no network or samples required:

```bash
ffmpeg -y -filter_complex "
sine=frequency=110:duration=32:sample_rate=44100 [a1];
sine=frequency=164.81:duration=32:sample_rate=44100 [a2];
sine=frequency=220:duration=32:sample_rate=44100 [a3];
anoisesrc=duration=32:color=pink:amplitude=0.02:sample_rate=44100 [n1];
[a1] volume=0.10 [a1v];
[a2] volume=0.07 [a2v];
[a3] volume=0.05 [a3v];
[a1v][a2v]amix=inputs=2:duration=first[m1];
[m1][a3v]amix=inputs=2:duration=first[m2];
[m2][n1]amix=inputs=2:duration=first:weights='1 0.4'[m3];
[m3] afade=t=in:st=0:d=2,afade=t=out:st=29:d=3,loudnorm=I=-20:TP=-2:LRA=7 [out]
" -map "[out]" -ar 44100 -ac 2 -b:a 160k public/music.mp3
```

`<Audio loop>` in `ForexStickmanVideo.tsx` repeats it for the full runtime.

## Educational disclaimer

This video dramatizes common beginner mistakes for illustration. It is not
financial advice, and the numbers used (account sizes, risk percentages,
dollar amounts) are simplified teaching examples, not guarantees or
projections of real trading outcomes.
