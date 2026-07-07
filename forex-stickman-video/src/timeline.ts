// Central timing config. Since this build has no recorded voiceover (see
// README), scene/caption durations are derived from reading speed rather
// than measured narration — see `beat()` below.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type Speaker = "alex" | "mentor" | "narrator" | "system" | null;

export type Beat = {
  speaker: Speaker;
  text?: string;
  frames: number;
};

export type SceneInput = {
  key: string;
  sceneNumber: number | null;
  title: string;
  beats: Beat[];
};

export type SceneDef = SceneInput & {
  from: number;
  durationInFrames: number;
};

const WORDS_PER_SECOND = 2.5;
const READ_PAD_FRAMES = 20;
const MIN_SPEECH_FRAMES = 42;
const TITLE_FRAMES = 46;

// Fast-cut caption pacing alone lands well under the "6-8 minute" target
// runtime the script calls for, so every beat is stretched by this factor
// to give each visual room to breathe at a watchable pace.
const PACE_STRETCH = 2.2;

const words = (s: string) => s.trim().split(/\s+/).length;

/** A spoken/captioned beat, sized from word count so pacing stays consistent. */
const say = (speaker: Speaker, text: string, holdExtra = 0): Beat => ({
  speaker,
  text,
  frames: Math.round(
    (Math.max(MIN_SPEECH_FRAMES, Math.round((words(text) / WORDS_PER_SECOND) * FPS) + READ_PAD_FRAMES) + holdExtra) *
      PACE_STRETCH,
  ),
});

/** A pure-visual beat with no caption. */
const visual = (frames: number): Beat => ({ speaker: null, frames: Math.round(frames * PACE_STRETCH) });

/** The scene's title card, shown as the first beat. */
const title = (): Beat => ({ speaker: null, frames: Math.round(TITLE_FRAMES * PACE_STRETCH) });

const scenes: SceneInput[] = [
  {
    key: "dream",
    sceneNumber: 1,
    title: "THE DREAM",
    beats: [
      title(),
      say("alex", "I'm broke...", 10),
      visual(50), // phone lights up, ad appears
      say("system", "MAKE $10,000 A DAY TRADING FOREX!", 10),
      say("alex", "That's it! I'll be rich tomorrow!"),
      visual(60), // rocket launches
    ],
  },
  {
    key: "reality",
    sceneNumber: 2,
    title: "REALITY",
    beats: [
      title(),
      visual(40), // Alex deposits $100
      say("alex", "BUY!!", 6),
      visual(50), // chart crashes, balance $38
      say("alex", "What?!", 10),
      visual(30), // mentor appears
      say("mentor", "You didn't lose because Forex is a scam."),
      say("mentor", "You lost because you don't understand the market."),
    ],
  },
  {
    key: "whatIsForex",
    sceneNumber: 3,
    title: "WHAT IS FOREX?",
    beats: [
      title(),
      visual(60), // world map, currencies fly in
      say("mentor", "Forex means Foreign Exchange."),
      say("mentor", "You're simply trading one currency against another."),
      visual(30), // EUR/USD appears
      say("mentor", "If you think the Euro gets stronger..."),
      say("mentor", "You BUY.", 8),
      say("mentor", "If you think the Dollar gets stronger..."),
      say("mentor", "You SELL.", 8),
    ],
  },
  {
    key: "buySell",
    sceneNumber: 4,
    title: "BUY & SELL",
    beats: [
      title(),
      visual(56), // pushes box uphill, BUY = price goes up
      visual(56), // pushes box downhill, SELL = price goes down
      say("mentor", "In Forex..."),
      say("mentor", "You can make money whether prices rise..."),
      say("mentor", "...or fall."),
    ],
  },
  {
    key: "theChart",
    sceneNumber: 5,
    title: "THE CHART",
    beats: [
      title(),
      visual(40), // green + red candles appear
      say("mentor", "Every candle tells a story."),
      visual(46), // Green = buyers won / Red = sellers won labels
      visual(34), // long wick
      say("mentor", "Those shadows?"),
      say("mentor", "They show rejection."),
    ],
  },
  {
    key: "bigMistake",
    sceneNumber: 6,
    title: "THE BIG MISTAKE",
    beats: [
      title(),
      visual(30), // Alex sees one green candle
      say("alex", "BUY!", 6),
      visual(46), // bear monster punches price down, Alex loses
      say("mentor", "No.", 8),
      say("mentor", "One candle means nothing."),
      say("mentor", "You need confirmation."),
    ],
  },
  {
    key: "supportResistance",
    sceneNumber: 7,
    title: "SUPPORT & RESISTANCE",
    beats: [
      title(),
      visual(40), // price bounces off floor
      say("mentor", "This is SUPPORT."),
      visual(36), // price hits ceiling
      say("mentor", "This is RESISTANCE."),
      visual(40), // price keeps bouncing
      say("alex", "So the market has memory?"),
      say("mentor", "Exactly.", 8),
    ],
  },
  {
    key: "trend",
    sceneNumber: 8,
    title: "TREND",
    beats: [
      title(),
      visual(40), // arrow up, HH HL HH HL
      say("mentor", "Never fight the trend."),
      say("mentor", "If price keeps making Higher Highs..."),
      say("mentor", "It's an uptrend."),
      visual(40), // arrow down, LH LL
      say("mentor", "It's a downtrend."),
    ],
  },
  {
    key: "riskManagement",
    sceneNumber: 9,
    title: "RISK MANAGEMENT",
    beats: [
      title(),
      visual(36), // Alex wants to trade, mentor stops him
      visual(46), // Account = $100, Risk = 1%, Loss = $1
      say("alex", "Only one dollar?"),
      say("mentor", "Professionals protect money."),
      say("mentor", "Gamblers chase money."),
    ],
  },
  {
    key: "stopLoss",
    sceneNumber: 10,
    title: "STOP LOSS",
    beats: [
      title(),
      visual(36), // Alex enters a trade
      visual(46), // price goes wrong, stop loss closes it
      say("mentor", "You'll never win every trade."),
      say("mentor", "But a Stop Loss keeps one mistake from destroying your account."),
    ],
  },
  {
    key: "riskReward",
    sceneNumber: 11,
    title: "RISK TO REWARD",
    beats: [
      title(),
      visual(46), // lose $10 / win $30 bars
      say("mentor", "If you lose..."),
      say("mentor", "$10.", 8),
      say("mentor", "But when you win..."),
      say("mentor", "You make $30.", 8),
      say("mentor", "You don't need to win every trade."),
    ],
  },
  {
    key: "emotions",
    sceneNumber: 12,
    title: "EMOTIONS",
    beats: [
      title(),
      say("alex", "I'm a genius!", 8),
      visual(50), // trades bigger, loses everything
      say("mentor", "The biggest enemy..."),
      say("mentor", "...isn't the market."),
      say("mentor", "It's YOU.", 14),
    ],
  },
  {
    key: "tradingPlan",
    sceneNumber: 13,
    title: "TRADING PLAN",
    beats: [
      title(),
      visual(70), // checklist appears item by item
      say("mentor", "If one item is missing..."),
      say("mentor", "No trade.", 12),
    ],
  },
  {
    key: "patience",
    sceneNumber: 14,
    title: "PATIENCE",
    beats: [
      title(),
      visual(60), // Alex sits, nothing happens, hours pass
      say("mentor", "The best traders..."),
      say("mentor", "...are patient."),
    ],
  },
  {
    key: "ending",
    sceneNumber: 15,
    title: "MONTHS LATER...",
    beats: [
      title(),
      visual(90), // account slowly grows $100 -> 150 -> 300 -> 700 -> 2000
      say("system", "No rockets. No Lamborghinis. Just consistency.", 10),
      say("mentor", "Forex isn't a get-rich-quick game."),
      say("mentor", "It's a skill."),
      say("mentor", "And skills..."),
      say("mentor", "...pay forever.", 12),
    ],
  },
  {
    key: "finalMessage",
    sceneNumber: null,
    title: "THE END",
    beats: [
      visual(30),
      say("narrator", "Most beginners focus on making money."),
      say("narrator", "Professionals focus on protecting capital."),
      say("narrator", "If you master risk, discipline, and patience..."),
      say("narrator", "The profits will follow.", 30),
      visual(50), // THE END card
    ],
  },
];

let cursor = 0;
export const SCENES: SceneDef[] = scenes.map((s) => {
  const durationInFrames = s.beats.reduce((sum, b) => sum + b.frames, 0);
  const scene: SceneDef = { ...s, from: cursor, durationInFrames };
  cursor += durationInFrames;
  return scene;
});

export const TOTAL_FRAMES = cursor;

/** Cumulative start frame (relative to scene start) for each beat in a scene. */
export const beatOffsets = (beats: Beat[]): number[] => {
  const offsets: number[] = [];
  let c = 0;
  for (const b of beats) {
    offsets.push(c);
    c += b.frames;
  }
  return offsets;
};

export const scene = (key: string): SceneDef => {
  const found = SCENES.find((s) => s.key === key);
  if (!found) throw new Error(`Unknown scene key: ${key}`);
  return found;
};

// Palette — clean whiteboard-explainer look with a trading-desk accent.
export const COLORS = {
  paper: "#f4f1e8",
  paperDark: "#e8e2d0",
  ink: "#1a1a1a",
  inkSoft: "#4a4a4a",
  blue: "#2456d1",
  red: "#d1352b",
  green: "#1f9d55",
  gold: "#e0a526",
  purple: "#7a4fd1",
  grid: "rgba(26,26,26,0.08)",
  alex: "#2456d1",
  mentor: "#1a1a1a",
  narrator: "#4a4a4a",
};
