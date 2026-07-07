import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, WIDTH } from "./timeline";
import { fadeIn, popIn, FONT } from "./components";

/** A single OHLC candlestick. `long` stretches the wick for the "rejection" beat. */
export const Candle: React.FC<{
  x: number;
  bull: boolean;
  bodyH: number;
  wickTop?: number;
  wickBottom?: number;
  width?: number;
  appearAt: number;
}> = ({ x, bull, bodyH, wickTop = 18, wickBottom = 18, width = 40, appearAt }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [appearAt, appearAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = bull ? COLORS.green : COLORS.red;
  const h = bodyH * grow;
  return (
    <svg width={width + 20} height={bodyH + wickTop + wickBottom + 20} style={{ position: "absolute", left: x, overflow: "visible" }}>
      <line x1={width / 2 + 10} y1={wickTop} x2={width / 2 + 10} y2={wickTop + h + wickBottom} stroke={color} strokeWidth={4} />
      <rect x={10} y={wickTop} width={width} height={h} fill={color} rx={4} />
    </svg>
  );
};

/** A cartoon bull/bear "market monster" torso with horns or claws. */
export const MarketMonster: React.FC<{
  x: number;
  y: number;
  bull: boolean;
  scale?: number;
  appearAt: number;
  punch?: boolean;
}> = ({ x, y, bull, scale = 1, appearAt, punch }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  if (local < 0) return null;
  const o = fadeIn(frame, appearAt, 10);
  const lunge = punch ? Math.max(0, Math.sin(Math.min(local / 10, Math.PI))) * 40 : 0;
  const color = bull ? COLORS.green : COLORS.red;
  return (
    <div style={{ position: "absolute", left: x, top: y - lunge, opacity: o, transform: `scale(${scale})` }}>
      <svg width="220" height="200" viewBox="0 0 220 200">
        <ellipse cx="110" cy="120" rx="88" ry="66" fill={color} />
        {bull ? (
          <>
            <path d="M50 70 L20 20 L70 55 Z" fill={color} />
            <path d="M170 70 L200 20 L150 55 Z" fill={color} />
          </>
        ) : (
          <>
            <ellipse cx="55" cy="70" rx="20" ry="16" fill={color} />
            <ellipse cx="165" cy="70" rx="20" ry="16" fill={color} />
          </>
        )}
        <circle cx="80" cy="110" r="10" fill="#fff" />
        <circle cx="140" cy="110" r="10" fill="#fff" />
        <circle cx="80" cy="112" r="4" fill="#111" />
        <circle cx="140" cy="112" r="4" fill="#111" />
        <path d={bull ? "M85 145 Q110 160 135 145" : "M85 150 Q110 138 135 150"} fill="none" stroke="#111" strokeWidth={5} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** Price line bouncing between a support floor and resistance ceiling. */
export const BounceChart: React.FC<{ appearAt: number; showFloor?: boolean; showCeiling?: boolean; bounces?: number }> = ({
  appearAt,
  showFloor = true,
  showCeiling = false,
  bounces = 3,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const w = WIDTH - 160;
  const floorY = 260;
  const ceilY = 60;
  const points: [number, number][] = [];
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const px = (i / n) * w;
    const cyclePos = (i / n) * bounces * Math.PI * 2;
    const y = (floorY + ceilY) / 2 - Math.cos(cyclePos) * ((floorY - ceilY) / 2 - 10);
    points.push([px, y]);
  }
  const drawFrac = interpolate(local, [0, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visiblePoints = points.slice(0, Math.max(2, Math.round(points.length * drawFrac)));
  const d = visiblePoints.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  return (
    <svg width={w} height={floorY + 30} style={{ overflow: "visible" }}>
      {showFloor && <line x1={0} y1={floorY} x2={w} y2={floorY} stroke={COLORS.green} strokeWidth={4} strokeDasharray="10 8" />}
      {showCeiling && <line x1={0} y1={ceilY} x2={w} y2={ceilY} stroke={COLORS.red} strokeWidth={4} strokeDasharray="10 8" />}
      <path d={d} fill="none" stroke={COLORS.blue} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

/** A zig-zag trend line: Higher-High/Higher-Low (up) or Lower-High/Lower-Low (down). */
export const TrendPath: React.FC<{ up: boolean; appearAt: number; showLabels?: boolean }> = ({
  up,
  appearAt,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const w = WIDTH - 160;
  const baseY = up ? 340 : 60;
  const step = up ? -60 : 60;
  const pts: [number, number][] = [0, 1, 2, 3, 4].map((i) => [
    (i / 4) * w,
    baseY + step * i + (i % 2 === 1 ? -step * 0.55 : 0),
  ]);
  const labels = up ? ["HL", "HH", "HL", "HH", "HL"] : ["LH", "LL", "LH", "LL", "LH"];
  const drawFrac = interpolate(local, [0, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = Math.max(1, Math.round(pts.length * drawFrac));
  const visible = pts.slice(0, shown);
  const d = visible.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const color = up ? COLORS.green : COLORS.red;
  return (
    <svg width={w} height={420} style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      {visible.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={9} fill={color} />
          {showLabels && (
            <text x={p[0]} y={p[1] + (up && i % 2 === 1 ? -22 : up ? 34 : i % 2 === 1 ? 34 : -22)} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={color}>
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

/** A checklist item that pops in with a checkmark. */
export const ChecklistItem: React.FC<{ text: string; appearAt: number }> = ({ text, appearAt }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 10);
  const s = popIn(frame, appearAt, 10);
  return (
    <div
      style={{
        opacity: o,
        transform: `scale(${s})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 40,
        color: COLORS.ink,
        background: "#fff",
        padding: "14px 28px",
        borderRadius: 16,
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: COLORS.green,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        ✓
      </span>
      {text}
    </div>
  );
};

/** Account-growth step chart for the ending montage. */
export const GrowthChart: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const values = [100, 150, 300, 700, 2000];
  const maxV = 2000;
  const w = WIDTH - 200;
  const barW = w / values.length - 24;
  const chartH = 420;
  return (
    <svg width={w} height={chartH + 60} style={{ overflow: "visible" }}>
      {values.map((v, i) => {
        const revealAt = i * 16;
        const grow = interpolate(local, [revealAt, revealAt + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const h = (v / maxV) * chartH * grow;
        const x = i * (barW + 24);
        return (
          <g key={i}>
            <rect x={x} y={chartH - h} width={barW} height={h} fill={COLORS.blue} rx={8} opacity={0.15 + grow * 0.85} />
            <text x={x + barW / 2} y={chartH - h - 16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={COLORS.ink} opacity={grow}>
              ${v}
            </text>
          </g>
        );
      })}
      <line x1={0} y1={chartH} x2={w} y2={chartH} stroke={COLORS.ink} strokeWidth={3} />
    </svg>
  );
};

/** Two comparison bars for the risk/reward beat. */
export const RiskRewardBars: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const loseGrow = interpolate(local, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const winGrow = interpolate(local, [10, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxH = 300;
  const loseH = maxH * 0.33 * loseGrow;
  const winH = maxH * winGrow;
  return (
    <svg width={420} height={maxH + 80} style={{ overflow: "visible" }}>
      <rect x={40} y={maxH - loseH} width={130} height={loseH} fill={COLORS.red} rx={10} />
      <text x={105} y={maxH - loseH - 16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={COLORS.red}>
        -$10
      </text>
      <rect x={240} y={maxH - winH} width={130} height={winH} fill={COLORS.green} rx={10} />
      <text x={305} y={maxH - winH - 16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={COLORS.green}>
        +$30
      </text>
      <line x1={0} y1={maxH} x2={420} y2={maxH} stroke={COLORS.ink} strokeWidth={3} />
    </svg>
  );
};

/** A glowing phone with an ad line, for the cold-open hook. */
export const PhoneAd: React.FC<{ appearAt: number; text: string }> = ({ appearAt, text }) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  if (local < 0) return null;
  const o = fadeIn(frame, appearAt, 12);
  const glow = 0.4 + Math.abs(Math.sin(local / 8)) * 0.6;
  return (
    <div style={{ position: "absolute", left: WIDTH / 2 - 140, top: 640, opacity: o, textAlign: "center" }}>
      <svg width="280" height="380" viewBox="0 0 280 380">
        <rect x="10" y="10" width="260" height="360" rx="32" fill="#1a1a1a" />
        <rect x="24" y="34" width="232" height="290" rx="6" fill={`rgba(224,165,38,${glow})`} />
        <circle cx="140" cy="350" r="14" fill="#333" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 20,
          width: 240,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 28,
          color: "#1a1a1a",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** A cartoon rocket that launches upward with a flame trail. */
export const Rocket: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const y = interpolate(local, [0, 55], [0, -1400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wobble = Math.sin(local / 4) * 6;
  const flame = 30 + Math.abs(Math.sin(local / 3)) * 30;
  return (
    <div style={{ position: "absolute", left: WIDTH / 2 - 40 + wobble, top: 900 + y }}>
      <svg width="80" height="180" viewBox="0 0 80 180">
        <path d="M40 0 C60 30 64 80 64 110 L16 110 C16 80 20 30 40 0 Z" fill={COLORS.blue} />
        <circle cx="40" cy="70" r="12" fill="#fff" />
        <path d="M16 100 L-6 140 L16 128 Z" fill={COLORS.red} />
        <path d="M64 100 L86 140 L64 128 Z" fill={COLORS.red} />
        <path d={`M24 110 L40 ${110 + flame} L56 110 Z`} fill={COLORS.gold} />
      </svg>
    </div>
  );
};

/** A near-empty wallet, for the "I'm broke" beat. */
export const EmptyWallet: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 12);
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" style={{ opacity: o }}>
      <rect x="10" y="30" width="200" height="110" rx="16" fill="#8a5a3b" />
      <rect x="10" y="30" width="200" height="40" rx="16" fill="#6f4326" />
      <circle cx="180" cy="85" r="10" fill={COLORS.gold} />
      <line x1="30" y1="10" x2="30" y2="40" stroke={COLORS.ink} strokeWidth={4} strokeDasharray="4 6" />
      <line x1="60" y1="6" x2="60" y2="40" stroke={COLORS.ink} strokeWidth={4} strokeDasharray="4 6" />
    </svg>
  );
};

/** Currency chips flying in around a simplified globe. */
export const CurrencyGlobe: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const codes = ["USD", "EUR", "GBP", "JPY", "XAU"];
  const colors = [COLORS.blue, COLORS.gold, COLORS.red, COLORS.purple, COLORS.green];
  const R = 260;
  return (
    <div style={{ position: "absolute", left: WIDTH / 2 - 150, top: 520, width: 300, height: 300 }}>
      <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: "absolute" }}>
        <circle cx="150" cy="150" r="140" fill="none" stroke={COLORS.ink} strokeWidth={5} opacity={0.5} />
        <ellipse cx="150" cy="150" rx="140" ry="46" fill="none" stroke={COLORS.ink} strokeWidth={3} opacity={0.35} />
        <ellipse cx="150" cy="150" rx="60" ry="140" fill="none" stroke={COLORS.ink} strokeWidth={3} opacity={0.35} />
      </svg>
      {codes.map((code, i) => {
        const local = Math.max(0, frame - appearAt - i * 8);
        const angle = (i / codes.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.006;
        const orbit = interpolate(local, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cx = 150 + Math.cos(angle) * R * orbit;
        const cy = 150 + Math.sin(angle) * R * orbit * 0.62;
        return (
          <div
            key={code}
            style={{
              position: "absolute",
              left: cx - 44,
              top: cy - 24,
              opacity: orbit,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 28,
              color: "#fff",
              background: colors[i],
              padding: "8px 16px",
              borderRadius: 999,
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            {code}
          </div>
        );
      })}
    </div>
  );
};

/** EUR/USD pair with a directional arrow (up = buy, down = sell). */
export const PairArrow: React.FC<{ up: boolean; appearAt: number }> = ({ up, appearAt }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, appearAt, 12);
  const color = up ? COLORS.green : COLORS.red;
  return (
    <div style={{ opacity: o, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COLORS.ink }}>EUR / USD</div>
      <svg width="90" height="90" viewBox="0 0 90 90">
        {up ? (
          <path d="M45 80 L45 15 M20 40 L45 12 L70 40" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M45 10 L45 75 M20 50 L45 78 L70 50" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

/** A wall clock whose hands spin fast to show hours passing. */
export const FastClock: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const o = fadeIn(frame, appearAt, 12);
  const minuteAngle = (local * 14) % 360;
  const hourAngle = (local * 1.2) % 360;
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ opacity: o }}>
      <circle cx="110" cy="110" r="95" fill="#fff" stroke={COLORS.ink} strokeWidth={8} />
      {new Array(12).fill(0).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={110 + Math.sin(a) * 80}
            y1={110 - Math.cos(a) * 80}
            x2={110 + Math.sin(a) * 90}
            y2={110 - Math.cos(a) * 90}
            stroke={COLORS.ink}
            strokeWidth={4}
          />
        );
      })}
      <line x1="110" y1="110" x2={110 + Math.sin((hourAngle * Math.PI) / 180) * 45} y2={110 - Math.cos((hourAngle * Math.PI) / 180) * 45} stroke={COLORS.ink} strokeWidth={7} strokeLinecap="round" />
      <line x1="110" y1="110" x2={110 + Math.sin((minuteAngle * Math.PI) / 180) * 68} y2={110 - Math.cos((minuteAngle * Math.PI) / 180) * 68} stroke={COLORS.blue} strokeWidth={5} strokeLinecap="round" />
      <circle cx="110" cy="110" r="8" fill={COLORS.ink} />
    </svg>
  );
};

/** Ramp + box for the BUY/SELL push (uphill = buy, downhill = sell). */
export const RampBox: React.FC<{ up: boolean; appearAt: number }> = ({ up, appearAt }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - appearAt);
  const w = 460;
  const h = 260;
  const prog = interpolate(local, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rampPath = up ? `M0 ${h} L${w} 0` : `M0 0 L${w} ${h}`;
  const boxX = prog * (w - 60);
  const boxY = up ? h - (prog * h) - 60 : prog * h;
  return (
    <svg width={w} height={h + 20} style={{ overflow: "visible" }}>
      <path d={rampPath} stroke={COLORS.ink} strokeWidth={6} fill="none" />
      <rect x={boxX} y={boxY} width={60} height={60} fill={COLORS.gold} stroke={COLORS.ink} strokeWidth={4} rx={6} />
    </svg>
  );
};
