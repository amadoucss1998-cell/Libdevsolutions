import React from "react";
import { useCurrentFrame } from "remotion";

export type Action =
  | "idle"
  | "walk"
  | "wave"
  | "cheer"
  | "write"
  | "drum"
  | "point";

export type CharacterProps = {
  x: number;
  y: number;
  scale?: number;
  skin?: string;
  outfit?: string;
  outfitDark?: string;
  accent?: string; // headwrap / hat / hair
  hair?: "wrap" | "hat" | "short" | "none";
  action?: Action;
  facing?: 1 | -1;
  phase?: number;
  speed?: number;
  zIndex?: number;
};

/**
 * A small articulated vector person. Limbs are capsules rotating about
 * shoulder / hip pivots, driven by the current frame so each character
 * actually walks, waves, etc. Drawn in a 200×320 viewBox (feet ~310).
 */
export const Character: React.FC<CharacterProps> = ({
  x,
  y,
  scale = 1,
  skin = "#8a5a3b",
  outfit = "#c75b39",
  outfitDark,
  accent = "#e9b949",
  hair = "short",
  action = "idle",
  facing = 1,
  phase = 0,
  speed = 1,
  zIndex = 1,
}) => {
  const frame = useCurrentFrame();
  const t = (frame + phase) * 0.22 * speed;
  const sw = Math.sin(t);
  const outDark = outfitDark ?? shade(outfit, -0.25);

  // joint angles (degrees). 0 = limb pointing straight down.
  let armL = 6;
  let armR = -6;
  let legL = 0;
  let legR = 0;
  let bob = 0;
  let lean = 0;

  switch (action) {
    case "walk":
      legL = sw * 26;
      legR = -sw * 26;
      armL = -sw * 22;
      armR = sw * 22;
      bob = -Math.abs(Math.sin(t)) * 5;
      lean = 4 * facing;
      break;
    case "wave":
      armR = -158 + Math.sin(t * 1.6) * 16;
      armL = 10;
      bob = Math.sin(t * 0.6) * 1.5;
      break;
    case "cheer":
      armL = 150;
      armR = -150;
      bob = -Math.abs(Math.sin(t * 1.4)) * 6;
      break;
    case "write":
      armR = -58 + Math.sin(t * 2.2) * 7;
      armL = 46;
      bob = Math.sin(t * 0.5) * 1;
      break;
    case "drum":
      armL = 40 + Math.abs(Math.sin(t * 2.4)) * 34;
      armR = -40 - Math.abs(Math.cos(t * 2.4)) * 34;
      bob = Math.sin(t * 2.4) * 1.5;
      break;
    case "point":
      armR = -95;
      armL = 8;
      bob = Math.sin(t * 0.6) * 1.2;
      break;
    case "idle":
    default: {
      const br = Math.sin(t * 0.7);
      armL = 7 + br * 3;
      armR = -7 - br * 3;
      bob = br * 1.6;
      break;
    }
  }

  const W = 200;
  const H = 320;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: W * scale,
        height: H * scale,
        zIndex,
      }}
    >
      <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`}>
        <g transform={`translate(${W / 2},0) scale(${facing},1) translate(${-W / 2},0)`}>
          <g transform={`translate(0,${bob}) rotate(${lean} 100 200)`}>
            {/* soft ground shadow */}
            <ellipse cx="100" cy="312" rx="46" ry="9" fill="rgba(0,0,0,0.28)" />

            {/* BACK leg (right) */}
            <Limb pivotX={112} pivotY={198} angle={legR} length={100} width={26} color={outDark} foot />
            {/* BACK arm (right) */}
            <Limb pivotX={128} pivotY={126} angle={armR} length={78} width={20} color={shade(skin, -0.12)} hand />

            {/* torso (tunic) */}
            <path
              d="M64 124 C64 118,136 118,136 124 L146 206 C120 218,80 218,54 206 Z"
              fill={outfit}
              stroke={outDark}
              strokeWidth={3}
            />
            {/* tunic trim */}
            <path d="M64 124 C64 118,136 118,136 124" fill="none" stroke={accent} strokeWidth={5} />

            {/* FRONT leg (left) */}
            <Limb pivotX={88} pivotY={198} angle={legL} length={100} width={26} color={outDark} foot />
            {/* FRONT arm (left) */}
            <Limb pivotX={72} pivotY={126} angle={armL} length={78} width={20} color={skin} hand />

            {/* neck */}
            <rect x="92" y="96" width="16" height="20" rx="6" fill={shade(skin, -0.1)} />

            {/* head */}
            <circle cx="100" cy="74" r="34" fill={skin} />
            {/* face */}
            <circle cx="89" cy="72" r="3.6" fill="#1a1109" />
            <circle cx="111" cy="72" r="3.6" fill="#1a1109" />
            <path d="M90 86 Q100 94 110 86" fill="none" stroke="#1a1109" strokeWidth="3" strokeLinecap="round" />

            {/* hair / headwear */}
            <HeadWear type={hair} accent={accent} skin={skin} />
          </g>
        </g>
      </svg>
    </div>
  );
};

const Limb: React.FC<{
  pivotX: number;
  pivotY: number;
  angle: number;
  length: number;
  width: number;
  color: string;
  foot?: boolean;
  hand?: boolean;
}> = ({ pivotX, pivotY, angle, length, width, color, foot, hand }) => (
  <g transform={`translate(${pivotX},${pivotY}) rotate(${angle})`}>
    <rect x={-width / 2} y={0} width={width} height={length} rx={width / 2} fill={color} />
    {foot && <ellipse cx={width * 0.2} cy={length} rx={width * 0.95} ry={width * 0.5} fill="#3a2616" />}
    {hand && <circle cx={0} cy={length} r={width * 0.62} fill={color} />}
  </g>
);

const HeadWear: React.FC<{ type: string; accent: string; skin: string }> = ({ type, accent, skin }) => {
  switch (type) {
    case "wrap":
      return (
        <g>
          <path d="M66 64 C70 40,130 40,134 64 C120 52,80 52,66 64 Z" fill={accent} />
          <path d="M66 62 C82 50,118 50,134 62 L132 50 C116 40,84 40,68 50 Z" fill={shade(accent, -0.18)} />
        </g>
      );
    case "hat":
      return (
        <g>
          <ellipse cx="100" cy="48" rx="52" ry="11" fill={accent} />
          <path d="M74 50 C74 24,126 24,126 50 Z" fill={shade(accent, -0.15)} />
        </g>
      );
    case "short":
      return <path d="M66 66 C66 36,134 36,134 66 C120 54,80 54,66 66 Z" fill={shade(skin, -0.4)} />;
    case "none":
    default:
      return null;
  }
};

/** lighten/darken a hex color. amt in [-1,1] */
function shade(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
  r = f(r);
  g = f(g);
  b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
