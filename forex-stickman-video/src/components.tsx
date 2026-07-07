import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Beat, beatOffsets, COLORS, Speaker, TOTAL_FRAMES, WIDTH } from "./timeline";

export const FONT =
  "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
export const FONT_HAND =
  "'Comic Sans MS', 'Segoe Print', 'Helvetica Neue', sans-serif";

export const fadeIn = (frame: number, start: number, len = 14) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const popIn = (frame: number, start: number, len = 16) =>
  interpolate(frame, [start, start + len], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Sketchbook-paper background with a faint grid, used behind every scene. */
export const PaperBG: React.FC<{ tint?: string }> = ({ tint }) => (
  <AbsoluteFill style={{ background: tint ?? COLORS.paper }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="grid" width={54} height={54} patternUnits="userSpaceOnUse">
          <path d="M 54 0 L 0 0 0 54" fill="none" stroke={COLORS.grid} strokeWidth={1.5} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </AbsoluteFill>
);

const SPEAKER_LABEL: Record<Exclude<Speaker, null>, string> = {
  alex: "ALEX",
  mentor: "MENTOR",
  narrator: "NARRATOR",
  system: "",
};

const speakerColor = (s: Exclude<Speaker, null>) =>
  s === "alex" ? COLORS.alex : s === "mentor" ? COLORS.mentor : s === "narrator" ? COLORS.narrator : COLORS.gold;

/** The animated caption / speech-bubble shown for the active beat. */
export const CaptionBubble: React.FC<{ speaker: Speaker; text: string; appearAt: number; hideAt?: number }> = ({
  speaker,
  text,
  appearAt,
  hideAt,
}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  if (local < 0 || (hideAt !== undefined && frame >= hideAt)) return null;
  const fadeOut = hideAt !== undefined ? 1 - fadeIn(frame, hideAt - 8, 8) : 1;
  const o = fadeIn(frame, appearAt, 10) * fadeOut;
  const rise = interpolate(frame, [appearAt, appearAt + 10], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isSystem = speaker === "system" || speaker === null;
  const color = speaker ? speakerColor(speaker) : COLORS.ink;
  const label = speaker ? SPEAKER_LABEL[speaker] : "";

  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 44,
        right: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: o,
        transform: `translateY(${rise}px)`,
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: 4,
            color,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          maxWidth: WIDTH - 88,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: isSystem ? 800 : 700,
          fontSize: isSystem ? 40 : 46,
          lineHeight: 1.28,
          color: isSystem ? COLORS.ink : "#fff",
          padding: isSystem ? "0" : "22px 34px",
          borderRadius: 20,
          background: isSystem ? "transparent" : color,
          boxShadow: isSystem ? "none" : "0 8px 24px rgba(0,0,0,0.25)",
          textTransform: isSystem ? "uppercase" : "none",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Renders every captioned beat of a scene, each timed from `beatOffsets`. */
export const SceneCaptions: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const offsets = beatOffsets(beats);
  return (
    <>
      {beats.map((b, i) =>
        b.text ? (
          <CaptionBubble
            key={i}
            speaker={b.speaker}
            text={b.text}
            appearAt={offsets[i]}
            hideAt={offsets[i] + b.frames}
          />
        ) : null,
      )}
    </>
  );
};

/** Scene number + title card, shown for the scene's opening beat. */
export const TitleCard: React.FC<{ sceneNumber: number | null; title: string; appearAt?: number }> = ({
  sceneNumber,
  title,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 12);
  const out = interpolate(frame, [appearAt + 30, appearAt + 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: o * out,
      }}
    >
      {sceneNumber !== null && (
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COLORS.gold }}>
          SCENE {sceneNumber}
        </div>
      )}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COLORS.ink, marginTop: 6 }}>{title}</div>
      <div style={{ margin: "14px auto 0", width: 120, height: 6, borderRadius: 3, background: COLORS.blue }} />
    </div>
  );
};

/** Thin overall-progress bar along the very bottom of the frame. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "rgba(26,26,26,0.08)" }}>
      <div style={{ width: `${w}%`, height: "100%", background: COLORS.blue }} />
    </div>
  );
};

/** A small labeled tag/chip (currency codes, checklist items, etc). */
export const Chip: React.FC<{
  children: React.ReactNode;
  appearAt: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, appearAt, color = COLORS.ink, style }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 12);
  const s = popIn(frame, appearAt, 12);
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${s})`,
        fontFamily: FONT,
        fontWeight: 800,
        color: "#fff",
        background: color,
        padding: "10px 22px",
        borderRadius: 999,
        fontSize: 30,
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Dollar/price tag used for account-balance readouts. */
export const StatCard: React.FC<{
  label: string;
  value: string;
  appearAt: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ label, value, appearAt, color = COLORS.ink, style }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 12);
  const s = popIn(frame, appearAt, 12);
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${s})`,
        fontFamily: FONT,
        textAlign: "center",
        background: "#fff",
        border: `4px solid ${color}`,
        borderRadius: 18,
        padding: "16px 26px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        ...style,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: COLORS.inkSoft, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 44, fontWeight: 900, color, marginTop: 2 }}>{value}</div>
    </div>
  );
};
