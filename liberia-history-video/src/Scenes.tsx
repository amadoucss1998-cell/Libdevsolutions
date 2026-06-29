import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS } from "./timeline";
import {
  FONT_SANS,
  FONT_SERIF,
  Label,
  Ocean,
  Star,
  StarField,
} from "./components";

const fadeIn = (frame: number, start: number, len = 16) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** A reusable, stylised West-African coastline (the Liberia bulge). */
const CoastPath: React.FC<{ stroke?: string; fill?: string; width?: number }> = ({
  stroke = COLORS.gold,
  fill = "rgba(233,185,73,0.08)",
  width = 4,
}) => (
  <path
    d="M 120 250
       C 320 210, 520 230, 700 300
       C 840 355, 980 430, 1180 470
       C 1360 505, 1560 520, 1760 470
       L 1760 760 L 120 760 Z"
    fill={fill}
    stroke={stroke}
    strokeWidth={width}
    strokeLinejoin="round"
  />
);

/* ------------------------------------------------------------------ */
/* Scene 1 — Origins: the indigenous peoples                           */
/* ------------------------------------------------------------------ */
export const SceneOrigins: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cold-open title lives in the first ~2s, then recedes.
  const titleIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const titleOut = interpolate(frame, [60, 95], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleIn * titleOut;

  const peoples = ["Gola", "Kpelle", "Bassa", "Kru", "Vai", "Mande", "Dei"];
  const positions = [
    { x: "20%", y: "40%" },
    { x: "37%", y: "55%" },
    { x: "52%", y: "44%" },
    { x: "64%", y: "60%" },
    { x: "78%", y: "47%" },
    { x: "30%", y: "30%" },
    { x: "70%", y: "33%" },
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={80} seed={3} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <CoastPath />
      </svg>
      <Ocean topPct={70} />

      {/* peoples names */}
      {peoples.map((p, i) => {
        const start = 70 + i * 26;
        return (
          <Label
            key={p}
            appearAt={start}
            style={{
              position: "absolute",
              left: positions[i].x,
              top: positions[i].y,
              transform: "translate(-50%,-50%)",
              color: COLORS.sand,
              fontSize: 40,
              fontFamily: FONT_SERIF,
              fontStyle: "italic",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            <span style={{ color: COLORS.goldSoft }}>•</span> {p}
          </Label>
        );
      })}

      {/* cold-open title */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: titleOpacity,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT_SANS,
              letterSpacing: 14,
              fontSize: 30,
              color: COLORS.gold,
              textTransform: "uppercase",
            }}
          >
            Before 1847
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: 92,
              color: COLORS.sand,
              fontWeight: 700,
              marginTop: 10,
              textShadow: "0 4px 24px rgba(0,0,0,0.8)",
            }}
          >
            The Land That Became Liberia
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — The Grain Coast                                           */
/* ------------------------------------------------------------------ */
const Ship: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={220 * scale} height={200 * scale} viewBox="0 0 220 200">
    {/* sails */}
    <path d="M110 20 L110 120 L40 120 Z" fill={COLORS.sand} opacity={0.9} />
    <path d="M118 35 L118 120 L185 120 Z" fill={COLORS.goldSoft} opacity={0.85} />
    <rect x="108" y="20" width="5" height="115" fill={COLORS.ink} />
    {/* hull */}
    <path d="M30 130 L190 130 L165 175 L55 175 Z" fill={COLORS.ink} />
  </svg>
);

export const SceneGrainCoast: React.FC = () => {
  const frame = useCurrentFrame();
  const shipX = interpolate(frame, [0, 278], [-260, 1500], {
    extrapolateRight: "clamp",
  });
  const bob = Math.sin(frame / 14) * 8;

  const grains = new Array(14).fill(0).map((_, i) => {
    const r = (n: number) => {
      const x = Math.sin(n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      x: r(i) * 1700 + 110,
      y: 120 + r(i + 5) * 260,
      d: 60 + i * 9,
      s: 8 + r(i + 9) * 10,
    };
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.night}, ${COLORS.ocean})` }}>
      <StarField count={40} seed={7} />
      <Label
        appearAt={10}
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_SERIF,
          fontSize: 70,
          letterSpacing: 4,
          color: COLORS.goldSoft,
          textShadow: "0 2px 16px rgba(0,0,0,0.7)",
        }}
      >
        The Grain Coast
      </Label>

      {/* floating malaguetta "grains of paradise" */}
      {grains.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.x,
            top: g.y + Math.sin(frame / 18 + i) * 10,
            width: g.s,
            height: g.s,
            borderRadius: "40% 60% 55% 45%",
            background: COLORS.terracotta,
            opacity: fadeIn(frame, g.d) * 0.85,
            boxShadow: `0 0 10px ${COLORS.terracotta}`,
          }}
        />
      ))}

      <Label
        appearAt={130}
        style={{
          position: "absolute",
          top: 215,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 30,
          letterSpacing: 8,
          color: COLORS.sand,
          textTransform: "uppercase",
        }}
      >
        Malaguetta — “grains of paradise”
      </Label>

      <div style={{ position: "absolute", left: shipX, top: 470 + bob }}>
        <Ship scale={1.1} />
      </div>
      <Ocean topPct={62} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — American Colonization Society, 1816                       */
/* ------------------------------------------------------------------ */
const Person: React.FC<{ delay: number; x: number }> = ({ delay, x }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, delay, 18);
  const y = interpolate(frame, [delay, delay + 18], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g transform={`translate(${x}, ${y}) `} opacity={o}>
      <circle cx="0" cy="0" r="16" fill={COLORS.sand} />
      <path d="M-20 75 C-20 35, 20 35, 20 75 Z" fill={COLORS.sand} />
    </g>
  );
};

export const SceneACS: React.FC = () => {
  const frame = useCurrentFrame();
  const yearScale = spring({
    frame,
    fps: 30,
    config: { damping: 14, stiffness: 90 },
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${COLORS.ocean}, ${COLORS.nightDeep})` }}>
      <StarField count={36} seed={11} />
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_SERIF,
          fontSize: 200,
          fontWeight: 800,
          color: COLORS.gold,
          transform: `scale(${0.6 + yearScale * 0.4})`,
          textShadow: "0 6px 30px rgba(0,0,0,0.6)",
        }}
      >
        1816
      </div>
      <Label
        appearAt={26}
        style={{
          position: "absolute",
          top: 430,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 44,
          color: COLORS.sand,
          letterSpacing: 3,
        }}
      >
        The American Colonization Society
      </Label>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(660,720)">
          {new Array(9).fill(0).map((_, i) => (
            <Person key={i} delay={55 + i * 8} x={i * 75} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4 — The Elizabeth crosses the Atlantic, 1820                  */
/* ------------------------------------------------------------------ */
export const SceneElizabeth: React.FC = () => {
  const frame = useCurrentFrame();
  // Arc from the Americas (left) to West Africa (right).
  const t = interpolate(frame, [25, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ax = 470;
  const ay = 560;
  const bx = 1360;
  const by = 470;
  const cx = 915;
  const cy = 250; // control point (arc apex)
  const bez = (p0: number, p1: number, p2: number, tt: number) =>
    (1 - tt) * (1 - tt) * p0 + 2 * (1 - tt) * tt * p1 + tt * tt * p2;
  const sx = bez(ax, cx, bx, t);
  const sy = bez(ay, cy, by, t);
  const dashLen = interpolate(frame, [25, 165], [0, 1600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={45} seed={5} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {/* Americas */}
        <path d="M250 380 C 330 330, 430 360, 470 470 C 500 560, 430 640, 360 660 C 300 640, 250 560, 250 380 Z"
          fill="rgba(245,234,210,0.10)" stroke={COLORS.sand} strokeWidth={2} />
        {/* West Africa */}
        <path d="M1300 360 C 1480 340, 1640 400, 1660 520 C 1660 620, 1560 660, 1440 640 C 1360 620, 1300 520, 1300 360 Z"
          fill="rgba(233,185,73,0.12)" stroke={COLORS.gold} strokeWidth={2} />
        {/* voyage arc */}
        <path
          d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`}
          fill="none"
          stroke={COLORS.goldSoft}
          strokeWidth={4}
          strokeDasharray="10 12"
          strokeDashoffset={1600 - dashLen}
          opacity={0.9}
        />
        <circle cx={ax} cy={ay} r={9} fill={COLORS.sand} />
        <circle cx={bx} cy={by} r={9} fill={COLORS.gold} />
        {/* moving ship marker */}
        <g transform={`translate(${sx - 18},${sy - 26})`}>
          <path d="M0 30 L36 30 L29 44 L7 44 Z" fill={COLORS.ink} stroke={COLORS.sand} strokeWidth={1.5} />
          <rect x="16" y="2" width="3" height="28" fill={COLORS.sand} />
          <path d="M18 4 L18 28 L2 28 Z" fill={COLORS.sand} />
        </g>
      </svg>
      <Label appearAt={8} style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 64, color: COLORS.goldSoft }}>
        1820 · The <span style={{ fontStyle: "italic" }}>Elizabeth</span>
      </Label>
      <Label appearAt={170} style={{ position: "absolute", top: 690, left: 1280, fontFamily: FONT_SANS, fontSize: 30, color: COLORS.sand }}>
        West Africa
      </Label>
      <Label appearAt={40} style={{ position: "absolute", top: 690, left: 300, fontFamily: FONT_SANS, fontSize: 30, color: COLORS.sand }}>
        North America
      </Label>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 5 — Cape Mesurado / Monrovia, 1822                            */
/* ------------------------------------------------------------------ */
export const SceneMonrovia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - 40, fps, config: { damping: 12, stiffness: 120 } });
  const pinY = interpolate(drop, [0, 1], [-260, 0]);
  const ripple = interpolate(frame, [70, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.night}, ${COLORS.ocean})` }}>
      <StarField count={36} seed={9} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <CoastPath stroke={COLORS.gold} fill="rgba(233,185,73,0.10)" />
        {/* ripple around the cape */}
        <circle cx={900} cy={470} r={20 + ripple * 120} fill="none" stroke={COLORS.goldSoft} strokeWidth={3} opacity={(1 - ripple) * 0.8} />
        <circle cx={900} cy={470} r={20 + ripple * 70} fill="none" stroke={COLORS.sand} strokeWidth={2} opacity={(1 - ripple) * 0.6} />
        {/* the pin */}
        <g transform={`translate(900, ${470 + pinY})`}>
          <path d="M0 0 C -26 -36, -26 -78, 0 -94 C 26 -78, 26 -36, 0 0 Z" fill={COLORS.red} stroke={COLORS.sand} strokeWidth={2} />
          <circle cx="0" cy="-60" r="12" fill={COLORS.sand} />
        </g>
      </svg>
      <Ocean topPct={72} />
      <Label appearAt={95} style={{ position: "absolute", top: 360, left: 980, fontFamily: FONT_SANS, fontSize: 30, color: COLORS.sand, letterSpacing: 2 }}>
        ◦ Cape Mesurado
      </Label>
      <Label appearAt={110} style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 78, color: COLORS.goldSoft, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>
        Monrovia, 1822
      </Label>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 6 — Liberia, the land of the free                             */
/* ------------------------------------------------------------------ */
export const SceneLiberia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 16, stiffness: 70 } });
  const starY = interpolate(rise, [0, 1], [120, 0]);
  const letters = "LIBERIA".split("");
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, ${COLORS.ocean}, ${COLORS.nightDeep})`, justifyContent: "center", alignItems: "center" }}>
      <StarField count={70} seed={13} />
      <div style={{ transform: `translateY(${starY}px)`, opacity: rise, marginBottom: 20 }}>
        <Star size={150} color={COLORS.sand} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {letters.map((c, i) => {
          const o = fadeIn(frame, 10 + i * 6, 14);
          const yy = interpolate(frame, [10 + i * 6, 24 + i * 6], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_SERIF,
                fontWeight: 800,
                fontSize: 150,
                color: COLORS.goldSoft,
                opacity: o,
                transform: `translateY(${yy}px)`,
                textShadow: "0 6px 30px rgba(0,0,0,0.6)",
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
      <Label appearAt={60} style={{ marginTop: 18, fontFamily: FONT_SANS, fontSize: 40, letterSpacing: 10, color: COLORS.sand, textTransform: "uppercase" }}>
        The Land of the Free
      </Label>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 7 — Toward 1847                                               */
/* ------------------------------------------------------------------ */
export const SceneToward1847: React.FC = () => {
  const frame = useCurrentFrame();
  const years = [
    { y: "1816", x: 250 },
    { y: "1820", x: 600 },
    { y: "1822", x: 950 },
    { y: "1847", x: 1620 },
  ];
  const progress = interpolate(frame, [20, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });
  const lineStart = 250;
  const lineEnd = 1620;
  const markerX = lineStart + (lineEnd - lineStart) * progress;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={50} seed={17} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={lineStart} y1={520} x2={lineEnd} y2={520} stroke="rgba(245,234,210,0.3)" strokeWidth={4} />
        <line x1={lineStart} y1={520} x2={markerX} y2={520} stroke={COLORS.gold} strokeWidth={6} />
        {years.map((yr, i) => {
          const reached = markerX >= yr.x - 4;
          const isFinal = yr.y === "1847";
          return (
            <g key={yr.y}>
              <circle cx={yr.x} cy={520} r={isFinal ? 16 : 11} fill={reached ? COLORS.gold : COLORS.night} stroke={COLORS.sand} strokeWidth={3} />
              <text x={yr.x} y={isFinal ? 600 : 588} textAnchor="middle" fontFamily={FONT_SERIF} fontSize={isFinal ? 64 : 40} fontWeight={isFinal ? 800 : 500} fill={reached ? COLORS.goldSoft : "rgba(245,234,210,0.5)"}>
                {yr.y}
              </text>
            </g>
          );
        })}
        <g transform={`translate(${markerX},520)`}>
          <Star size={1} />
        </g>
      </svg>
      {/* travelling lone star marker (DOM for glow) */}
      <div style={{ position: "absolute", left: markerX - 22, top: 498, width: 44, height: 44 }}>
        <Star size={44} color={COLORS.sand} />
      </div>
      <Label appearAt={6} style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 50, color: COLORS.sand }}>
        A nation taking shape…
      </Label>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Outro                                                               */
/* ------------------------------------------------------------------ */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, 6, 24);
  const fadeOut = interpolate(frame, [110, 146], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: COLORS.nightDeep, justifyContent: "center", alignItems: "center", opacity: o * fadeOut }}>
      <StarField count={60} seed={21} />
      <div style={{ marginBottom: 24 }}>
        <Star size={96} color={COLORS.sand} />
      </div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 64, color: COLORS.goldSoft, textAlign: "center" }}>
        A story older than its name.
      </div>
      <div style={{ marginTop: 16, fontFamily: FONT_SANS, fontSize: 28, letterSpacing: 6, color: COLORS.sand, textTransform: "uppercase" }}>
        Liberia · before 1847
      </div>
    </AbsoluteFill>
  );
};
