import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./timeline";

const FONT_SERIF =
  "'Georgia', 'Times New Roman', 'Iowan Old Style', serif";
const FONT_SANS =
  "'Helvetica Neue', 'Segoe UI', system-ui, sans-serif";
export { FONT_SERIF, FONT_SANS };

/** Soft cinematic vignette + film grain feel. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Subtle drifting starfield for the night-sky backdrops. */
export const StarField: React.FC<{ count?: number; seed?: number }> = ({
  count = 70,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const rand = (n: number) => {
    const x = Math.sin(n * 999.13 + seed * 57.3) * 43758.5453;
    return x - Math.floor(x);
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = rand(i) * 100;
        const y = rand(i + 100) * 100;
        const size = 1 + rand(i + 200) * 2.2;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 22 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: COLORS.goldSoft,
              opacity: tw * 0.7,
              boxShadow: `0 0 ${size * 2}px ${COLORS.goldSoft}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Animated layered ocean at the bottom of the frame. */
export const Ocean: React.FC<{ topPct?: number }> = ({ topPct = 70 }) => {
  const frame = useCurrentFrame();
  const wave = (amp: number, len: number, speed: number, phase: number) => {
    let d = `M 0 ${HEIGHT}`;
    const yBase = (topPct / 100) * HEIGHT;
    for (let x = 0; x <= WIDTH; x += 20) {
      const y =
        yBase + Math.sin(x / len + frame / speed + phase) * amp;
      d += ` L ${x} ${y}`;
    }
    d += ` L ${WIDTH} ${HEIGHT} Z`;
    return d;
  };
  const WIDTH = 1920;
  const HEIGHT = 1080;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <path d={wave(16, 150, 35, 0)} fill={COLORS.ocean} opacity={0.55} />
      <path
        d={wave(22, 220, 50, 1.5)}
        fill={COLORS.oceanLight}
        opacity={0.35}
      />
      <path d={wave(12, 110, 28, 3)} fill={COLORS.night} opacity={0.85} />
    </svg>
  );
};

/** Five-pointed star (the lone star motif). */
export const Star: React.FC<{
  size: number;
  color?: string;
  glow?: boolean;
}> = ({ size, color = COLORS.star, glow = true }) => {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const outer = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    points.push(
      `${Math.cos(outer) * 50 + 50},${Math.sin(outer) * 50 + 50}`,
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ filter: glow ? `drop-shadow(0 0 ${size / 6}px ${color})` : "none" }}
    >
      <polygon points={points.join(" ")} fill={color} />
    </svg>
  );
};

/** Lower-third subtitle synced to the narration. */
export const Subtitle: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 12], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (local < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 38,
          lineHeight: 1.35,
          color: COLORS.sand,
          padding: "14px 30px",
          borderRadius: 14,
          background: "rgba(6,18,31,0.55)",
          backdropFilter: "blur(2px)",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** A small caption chip used to label things on the map. */
export const Label: React.FC<{
  children: React.ReactNode;
  appearAt: number;
  style?: React.CSSProperties;
}> = ({ children, appearAt, style }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appearAt, appearAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = interpolate(frame, [appearAt, appearAt + 14], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${s})`,
        fontFamily: FONT_SANS,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
