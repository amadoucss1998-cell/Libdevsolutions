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
import { Character } from "./Characters";

const fadeIn = (frame: number, start: number, len = 16) =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Top of a character so its feet land on `groundY`. */
const feetY = (groundY: number, scale: number) => groundY - 310 * scale;

/** A character that fades/rises in at `appearAt`. */
const Actor: React.FC<
  React.ComponentProps<typeof Character> & { appearAt?: number }
> = ({ appearAt = 0, ...props }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 14);
  const rise = interpolate(frame, [appearAt, appearAt + 14], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < appearAt) return null;
  return (
    <div style={{ position: "absolute", opacity: o, transform: `translateY(${rise}px)` }}>
      <Character {...props} />
    </div>
  );
};

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

  const titleIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const titleOut = interpolate(frame, [58, 92], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOpacity = titleIn * titleOut;

  const sc = 0.74;
  const g = 712;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={80} seed={3} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <CoastPath />
      </svg>

      {/* villagers along the shore */}
      <Actor appearAt={66} x={120} y={feetY(g, sc)} scale={sc} action="drum" skin="#6f4326" outfit="#b5651d" hair="short" />
      <Actor appearAt={80} x={430} y={feetY(g, sc)} scale={sc} action="idle" skin="#a06a43" outfit="#2c7da0" hair="wrap" />
      <Actor appearAt={94} x={760} y={feetY(g, sc + 0.05)} scale={sc + 0.05} action="wave" skin="#7a4a2a" outfit="#4a8c5a" hair="wrap" />
      <Actor appearAt={108} x={1090} y={feetY(g, sc)} scale={sc} action="idle" skin="#9a6238" outfit="#c75b39" hair="short" facing={-1} />
      <Actor appearAt={122} x={1410} y={feetY(g, sc)} scale={sc} action="point" skin="#6f4326" outfit="#7d5ba6" hair="wrap" facing={-1} />

      <Ocean topPct={73} />

      {/* peoples roll-call */}
      <Label appearAt={150} style={{ position: "absolute", bottom: 175, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 34, color: COLORS.goldSoft, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
        Gola · Kpelle · Bassa · Kru · Vai
      </Label>

      {/* cold-open title */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: titleOpacity }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT_SANS, letterSpacing: 14, fontSize: 30, color: COLORS.gold, textTransform: "uppercase" }}>
            Before 1847
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 92, color: COLORS.sand, fontWeight: 700, marginTop: 10, textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>
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
    <path d="M110 20 L110 120 L40 120 Z" fill={COLORS.sand} opacity={0.9} />
    <path d="M118 35 L118 120 L185 120 Z" fill={COLORS.goldSoft} opacity={0.85} />
    <rect x="108" y="20" width="5" height="115" fill={COLORS.ink} />
    <path d="M30 130 L190 130 L165 175 L55 175 Z" fill={COLORS.ink} />
  </svg>
);

export const SceneGrainCoast: React.FC = () => {
  const frame = useCurrentFrame();
  const shipX = interpolate(frame, [0, 278], [-260, 1500], { extrapolateRight: "clamp" });
  const bob = Math.sin(frame / 14) * 8;

  const grains = new Array(12).fill(0).map((_, i) => {
    const r = (n: number) => {
      const x = Math.sin(n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    return { x: r(i) * 1600 + 160, y: 120 + r(i + 5) * 200, d: 60 + i * 9, s: 8 + r(i + 9) * 10 };
  });

  const g = 1015;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.night}, ${COLORS.ocean})` }}>
      <StarField count={40} seed={7} />
      <Label appearAt={10} style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 70, letterSpacing: 4, color: COLORS.goldSoft, textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>
        The Grain Coast
      </Label>

      {grains.map((gr, i) => (
        <div key={i} style={{ position: "absolute", left: gr.x, top: gr.y + Math.sin(frame / 18 + i) * 10, width: gr.s, height: gr.s, borderRadius: "40% 60% 55% 45%", background: COLORS.terracotta, opacity: fadeIn(frame, gr.d) * 0.85, boxShadow: `0 0 10px ${COLORS.terracotta}` }} />
      ))}

      <Label appearAt={130} style={{ position: "absolute", top: 190, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SANS, fontSize: 28, letterSpacing: 8, color: COLORS.sand, textTransform: "uppercase" }}>
        Malaguetta — “grains of paradise”
      </Label>

      <div style={{ position: "absolute", left: shipX, top: 360 + bob }}>
        <Ship scale={1.05} />
      </div>

      <Ocean topPct={64} />

      {/* traders on the shore in the foreground */}
      <Actor appearAt={40} x={1230} y={feetY(g, 1.05)} scale={1.05} action="point" skin="#7a4a2a" outfit="#c75b39" hair="wrap" facing={-1} />
      <Actor appearAt={60} x={1500} y={feetY(g, 1.0)} scale={1.0} action="idle" skin="#9a6238" outfit="#2c7da0" hair="hat" />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — American Colonization Society, 1816                       */
/* ------------------------------------------------------------------ */
export const SceneACS: React.FC = () => {
  const frame = useCurrentFrame();
  const yearScale = spring({ frame, fps: 30, config: { damping: 14, stiffness: 90 } });
  const g = 980;
  const people = [
    { x: 470, sc: 0.78, act: "idle" as const, skin: "#6f4326", outfit: "#2c7da0", hair: "hat" as const, f: 1 as const },
    { x: 700, sc: 0.82, act: "wave" as const, skin: "#9a6238", outfit: "#c75b39", hair: "short" as const, f: 1 as const },
    { x: 940, sc: 0.8, act: "idle" as const, skin: "#7a4a2a", outfit: "#e9b949", hair: "hat" as const, f: -1 as const },
    { x: 1170, sc: 0.84, act: "walk" as const, skin: "#a06a43", outfit: "#4a8c5a", hair: "short" as const, f: 1 as const },
    { x: 1410, sc: 0.78, act: "idle" as const, skin: "#6f4326", outfit: "#7d5ba6", hair: "hat" as const, f: -1 as const },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 28%, ${COLORS.ocean}, ${COLORS.nightDeep})` }}>
      <StarField count={36} seed={11} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 190, fontWeight: 800, color: COLORS.gold, transform: `scale(${0.6 + yearScale * 0.4})`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
        1816
      </div>
      <Label appearAt={26} style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SANS, fontSize: 44, color: COLORS.sand, letterSpacing: 3 }}>
        The American Colonization Society
      </Label>
      {people.map((p, i) => (
        <Actor key={i} appearAt={50 + i * 9} x={p.x} y={feetY(g, p.sc)} scale={p.sc} action={p.act} skin={p.skin} outfit={p.outfit} hair={p.hair} facing={p.f} phase={i * 7} />
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4 — The Elizabeth crosses the Atlantic, 1820                  */
/* ------------------------------------------------------------------ */
export const SceneElizabeth: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [25, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ax = 470, ay = 540, bx = 1360, by = 460, cx = 915, cy = 240;
  const bez = (p0: number, p1: number, p2: number, tt: number) => (1 - tt) * (1 - tt) * p0 + 2 * (1 - tt) * tt * p1 + tt * tt * p2;
  const sx = bez(ax, cx, bx, t);
  const sy = bez(ay, cy, by, t);
  const dashLen = interpolate(frame, [25, 165], [0, 1600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={45} seed={5} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M250 360 C 330 310, 430 340, 470 450 C 500 540, 430 620, 360 640 C 300 620, 250 540, 250 360 Z" fill="rgba(245,234,210,0.10)" stroke={COLORS.sand} strokeWidth={2} />
        <path d="M1300 340 C 1480 320, 1640 380, 1660 500 C 1660 600, 1560 640, 1440 620 C 1360 600, 1300 500, 1300 340 Z" fill="rgba(233,185,73,0.12)" stroke={COLORS.gold} strokeWidth={2} />
        <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`} fill="none" stroke={COLORS.goldSoft} strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={1600 - dashLen} opacity={0.9} />
        <circle cx={ax} cy={ay} r={9} fill={COLORS.sand} />
        <circle cx={bx} cy={by} r={9} fill={COLORS.gold} />
        <g transform={`translate(${sx - 18},${sy - 26})`}>
          <path d="M0 30 L36 30 L29 44 L7 44 Z" fill={COLORS.ink} stroke={COLORS.sand} strokeWidth={1.5} />
          <rect x="16" y="2" width="3" height="28" fill={COLORS.sand} />
          <path d="M18 4 L18 28 L2 28 Z" fill={COLORS.sand} />
        </g>
      </svg>
      <Label appearAt={8} style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 64, color: COLORS.goldSoft }}>
        1820 · The <span style={{ fontStyle: "italic" }}>Elizabeth</span>
      </Label>
      <Label appearAt={40} style={{ position: "absolute", top: 660, left: 300, fontFamily: FONT_SANS, fontSize: 28, color: COLORS.sand }}>
        North America
      </Label>
      <Label appearAt={150} style={{ position: "absolute", top: 640, left: 1300, fontFamily: FONT_SANS, fontSize: 28, color: COLORS.sand }}>
        West Africa
      </Label>

      {/* emigrants waving farewell from the American shore */}
      <Actor appearAt={20} x={300} y={feetY(1010, 0.8)} scale={0.8} action="wave" skin="#6f4326" outfit="#c75b39" hair="short" />
      <Actor appearAt={34} x={520} y={feetY(1010, 0.85)} scale={0.85} action="wave" skin="#9a6238" outfit="#2c7da0" hair="wrap" phase={9} />
      <Actor appearAt={48} x={760} y={feetY(1010, 0.78)} scale={0.78} action="idle" skin="#7a4a2a" outfit="#4a8c5a" hair="hat" facing={-1} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 5 — Cape Mesurado / Monrovia, 1822                            */
/* ------------------------------------------------------------------ */
export const SceneMonrovia: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - 30, fps, config: { damping: 12, stiffness: 120 } });
  const pinY = interpolate(drop, [0, 1], [-260, 0]);
  const ripple = interpolate(frame, [60, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.night}, ${COLORS.ocean})` }}>
      <StarField count={36} seed={9} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <CoastPath stroke={COLORS.gold} fill="rgba(233,185,73,0.10)" />
        <circle cx={900} cy={470} r={20 + ripple * 120} fill="none" stroke={COLORS.goldSoft} strokeWidth={3} opacity={(1 - ripple) * 0.8} />
        <circle cx={900} cy={470} r={20 + ripple * 70} fill="none" stroke={COLORS.sand} strokeWidth={2} opacity={(1 - ripple) * 0.6} />
        <g transform={`translate(900, ${470 + pinY})`}>
          <path d="M0 0 C -26 -36, -26 -78, 0 -94 C 26 -78, 26 -36, 0 0 Z" fill={COLORS.red} stroke={COLORS.sand} strokeWidth={2} />
          <circle cx="0" cy="-60" r="12" fill={COLORS.sand} />
        </g>
      </svg>

      {/* settlers arriving + a local greeting them, on the coast */}
      <Actor appearAt={70} x={560} y={feetY(720, 0.62)} scale={0.62} action="walk" skin="#6f4326" outfit="#2c7da0" hair="hat" />
      <Actor appearAt={84} x={690} y={feetY(720, 0.6)} scale={0.6} action="cheer" skin="#9a6238" outfit="#c75b39" hair="short" />
      <Actor appearAt={100} x={1080} y={feetY(720, 0.62)} scale={0.62} action="wave" skin="#7a4a2a" outfit="#4a8c5a" hair="wrap" facing={-1} />

      <Ocean topPct={74} />
      <Label appearAt={95} style={{ position: "absolute", top: 350, left: 980, fontFamily: FONT_SANS, fontSize: 30, color: COLORS.sand, letterSpacing: 2 }}>
        ◦ Cape Mesurado
      </Label>
      <Label appearAt={110} style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontSize: 78, color: COLORS.goldSoft, textShadow: "0 3px 18px rgba(0,0,0,0.7)" }}>
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
  const g = 1010;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${COLORS.ocean}, ${COLORS.nightDeep})` }}>
      <StarField count={70} seed={13} />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `translateY(${starY}px)`, opacity: rise }}>
          <Star size={130} color={COLORS.sand} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
        {letters.map((c, i) => {
          const o = fadeIn(frame, 10 + i * 6, 14);
          const yy = interpolate(frame, [10 + i * 6, 24 + i * 6], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={i} style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 140, color: COLORS.goldSoft, opacity: o, transform: `translateY(${yy}px)`, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
              {c}
            </span>
          );
        })}
      </div>

      {/* a community standing together, cheering */}
      <Actor appearAt={40} x={430} y={feetY(g, 0.82)} scale={0.82} action="cheer" skin="#6f4326" outfit="#c75b39" hair="wrap" phase={0} />
      <Actor appearAt={50} x={690} y={feetY(g, 0.86)} scale={0.86} action="idle" skin="#9a6238" outfit="#2c7da0" hair="short" phase={5} />
      <Actor appearAt={60} x={960} y={feetY(g, 0.9)} scale={0.9} action="cheer" skin="#7a4a2a" outfit="#e9b949" hair="hat" phase={3} />
      <Actor appearAt={50} x={1230} y={feetY(g, 0.86)} scale={0.86} action="idle" skin="#a06a43" outfit="#4a8c5a" hair="wrap" facing={-1} phase={8} />
      <Actor appearAt={40} x={1470} y={feetY(g, 0.82)} scale={0.82} action="cheer" skin="#6f4326" outfit="#7d5ba6" hair="short" facing={-1} phase={2} />
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
  const progress = interpolate(frame, [20, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
  const lineStart = 250, lineEnd = 1620;
  const markerX = lineStart + (lineEnd - lineStart) * progress;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.nightDeep}, ${COLORS.ocean})` }}>
      <StarField count={50} seed={17} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <line x1={lineStart} y1={560} x2={lineEnd} y2={560} stroke="rgba(245,234,210,0.3)" strokeWidth={4} />
        <line x1={lineStart} y1={560} x2={markerX} y2={560} stroke={COLORS.gold} strokeWidth={6} />
        {years.map((yr) => {
          const reached = markerX >= yr.x - 4;
          const isFinal = yr.y === "1847";
          return (
            <g key={yr.y}>
              <circle cx={yr.x} cy={560} r={isFinal ? 16 : 11} fill={reached ? COLORS.gold : COLORS.night} stroke={COLORS.sand} strokeWidth={3} />
              <text x={yr.x} y={isFinal ? 640 : 628} textAnchor="middle" fontFamily={FONT_SERIF} fontSize={isFinal ? 64 : 40} fontWeight={isFinal ? 800 : 500} fill={reached ? COLORS.goldSoft : "rgba(245,234,210,0.5)"}>
                {yr.y}
              </text>
            </g>
          );
        })}
      </svg>

      {/* a traveller walking the timeline toward independence */}
      <div style={{ position: "absolute", left: markerX - 74, top: feetY(560, 0.5) }}>
        <Character x={0} y={0} scale={0.5} action="walk" skin="#7a4a2a" outfit="#c75b39" hair="wrap" facing={1} />
      </div>

      <Label appearAt={6} style={{ position: "absolute", top: 130, left: 0, right: 0, textAlign: "center", fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 50, color: COLORS.sand }}>
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
  const fadeOut = interpolate(frame, [110, 146], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: COLORS.nightDeep, opacity: o * fadeOut }}>
      <StarField count={60} seed={21} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginBottom: 20 }}>
          <Star size={92} color={COLORS.sand} />
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 64, color: COLORS.goldSoft, textAlign: "center" }}>
          A story older than its name.
        </div>
        <div style={{ marginTop: 16, fontFamily: FONT_SANS, fontSize: 28, letterSpacing: 6, color: COLORS.sand, textTransform: "uppercase" }}>
          Liberia · before 1847
        </div>
      </AbsoluteFill>
      {/* two figures looking on */}
      <Actor appearAt={14} x={300} y={feetY(1015, 0.7)} scale={0.7} action="idle" skin="#6f4326" outfit="#2c7da0" hair="wrap" />
      <Actor appearAt={20} x={1450} y={feetY(1015, 0.7)} scale={0.7} action="wave" skin="#9a6238" outfit="#c75b39" hair="short" facing={-1} />
    </AbsoluteFill>
  );
};
