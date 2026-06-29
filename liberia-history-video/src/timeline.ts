// Central timing config. Frame numbers were derived from the measured
// duration of each synthesized narration segment (see README) so the
// on-screen animation stays in sync with the voiceover.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 1800; // 60s

// The narration track starts 2s into the video (after the cold-open title beat).
export const AUDIO_OFFSET = 60;

export type Scene = {
  key: string;
  from: number; // absolute start frame
  durationInFrames: number;
  text: string; // subtitle / narration line for this scene
  subtitleDelay: number; // frames to wait (within the scene) before the line is spoken
};

export const SCENES: Scene[] = [
  {
    key: "origins",
    from: 0,
    durationInFrames: 439,
    subtitleDelay: AUDIO_OFFSET,
    text: "Long before it had a name on any map, this coast was home to thriving peoples — the Gola, Kpelle, Bassa, Kru and Vai.",
  },
  {
    key: "graincoast",
    from: 439,
    durationInFrames: 278,
    subtitleDelay: 0,
    text: "To European traders, these shores were the Grain Coast, prized for the fiery malaguetta pepper.",
  },
  {
    key: "acs",
    from: 717,
    durationInFrames: 205,
    subtitleDelay: 0,
    text: "In 1816, the American Colonization Society set out to resettle free Black Americans in Africa.",
  },
  {
    key: "elizabeth",
    from: 922,
    durationInFrames: 180,
    subtitleDelay: 0,
    text: "In 1820, the ship Elizabeth crossed the Atlantic, carrying the first 86 emigrants.",
  },
  {
    key: "monrovia",
    from: 1102,
    durationInFrames: 227,
    subtitleDelay: 0,
    text: "By 1822, settlers founded a colony at Cape Mesurado — Monrovia, named for President James Monroe.",
  },
  {
    key: "liberia",
    from: 1329,
    durationInFrames: 103,
    subtitleDelay: 0,
    text: "They called their new home Liberia — the land of the free.",
  },
  {
    key: "toward1847",
    from: 1432,
    durationInFrames: 222,
    subtitleDelay: 0,
    text: "Through hardship, disease and the meeting of two worlds, a nation took shape — as 1847 drew near.",
  },
];

export const OUTRO = {
  from: 1654,
  durationInFrames: TOTAL_FRAMES - 1654, // 146
};

// Brand palette (warm atlas / documentary).
export const COLORS = {
  night: "#0b1f33",
  nightDeep: "#06121f",
  ocean: "#13476b",
  oceanLight: "#2c7da0",
  gold: "#e9b949",
  goldSoft: "#f2d488",
  sand: "#f5ead2",
  terracotta: "#c75b39",
  red: "#bf1d2d",
  star: "#f5ead2",
  ink: "#08111c",
};
