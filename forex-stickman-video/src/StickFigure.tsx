import React from "react";
import { useCurrentFrame } from "remotion";

export type StickAction =
  | "idle"
  | "walk"
  | "panic"
  | "point"
  | "cheer"
  | "facepalm"
  | "shrug"
  | "think"
  | "sit"
  | "write"
  | "wave"
  | "laugh"
  | "push"
  | "drum";

export type Face = "neutral" | "shock" | "smile" | "worried" | "sly" | "closed";

export type StickFigureProps = {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  action?: StickAction;
  face?: Face;
  facing?: 1 | -1;
  phase?: number;
  speed?: number;
  zIndex?: number;
  strokeWidth?: number;
};

/**
 * A classic thin-line stick figure: a hollow circle head and single-stroke
 * limbs, in the style of fast-cut whiteboard/stickman explainer videos.
 * Drawn in a 100x200 viewBox with feet resting at y=196.
 */
export const StickFigure: React.FC<StickFigureProps> = ({
  x,
  y,
  scale = 1,
  color = "#1a1a1a",
  action = "idle",
  face = "neutral",
  facing = 1,
  phase = 0,
  speed = 1,
  zIndex = 1,
  strokeWidth = 6,
}) => {
  const frame = useCurrentFrame();
  const t = (frame + phase) * 0.2 * speed;
  const sw = Math.sin(t);

  const hipX = 50;
  const hipY = 122;
  const shoulderX = 50;
  const shoulderY = 78;
  const headR = 17;
  const headCY = shoulderY - headR - 3;
  const limbLen = 40;

  let armLA = 25; // degrees from vertical, left arm
  let armRA = -25;
  let legLA = 8;
  let legRA = -8;
  let bob = 0;
  let tilt = 0;
  let headTilt = 0;

  switch (action) {
    case "walk":
      legLA = sw * 32;
      legRA = -sw * 32;
      armLA = -sw * 30;
      armRA = sw * 30;
      bob = -Math.abs(Math.sin(t)) * 4;
      break;
    case "panic":
      armLA = -70 + sw * 40;
      armRA = 70 - sw * 40;
      legLA = sw * 14;
      legRA = -sw * 14;
      bob = Math.sin(t * 2.4) * 3;
      tilt = sw * 5;
      break;
    case "point":
      armRA = facing === 1 ? -95 : -95;
      armLA = 18;
      bob = Math.sin(t * 0.6) * 1.5;
      break;
    case "cheer":
      armLA = 165;
      armRA = -165;
      bob = -Math.abs(Math.sin(t * 1.4)) * 8;
      break;
    case "facepalm":
      armRA = -155;
      armLA = 20;
      headTilt = -8;
      break;
    case "shrug":
      armLA = -100 + Math.sin(t * 1.2) * 6;
      armRA = 100 - Math.sin(t * 1.2) * 6;
      bob = Math.sin(t * 1.2) * 2;
      break;
    case "think":
      armRA = -140;
      armLA = 15;
      headTilt = 10;
      break;
    case "sit":
      legLA = 90;
      legRA = 88;
      armLA = 20;
      armRA = -20;
      break;
    case "write":
      armRA = -60 + Math.sin(t * 2.2) * 8;
      armLA = 40;
      break;
    case "wave":
      armRA = -160 + Math.sin(t * 1.6) * 18;
      armLA = 15;
      bob = Math.sin(t * 0.6) * 1.5;
      break;
    case "laugh":
      armLA = 140 + sw * 8;
      armRA = -140 - sw * 8;
      bob = -Math.abs(Math.sin(t * 1.8)) * 5;
      headTilt = -6;
      break;
    case "push":
      armLA = -80;
      armRA = -95;
      legLA = 20 + sw * 10;
      legRA = -10 - sw * 10;
      tilt = -14 * facing;
      break;
    case "drum":
      armLA = 30 + Math.abs(Math.sin(t * 2.6)) * 40;
      armRA = -30 - Math.abs(Math.cos(t * 2.6)) * 40;
      break;
    case "idle":
    default: {
      const br = Math.sin(t * 0.7);
      armLA = 22 + br * 4;
      armRA = -22 - br * 4;
      bob = br * 1.6;
      break;
    }
  }

  const rad = (deg: number) => (deg * Math.PI) / 180;
  const limbEnd = (px: number, py: number, angleDeg: number, len: number) => {
    const a = rad(angleDeg);
    return [px + Math.sin(a) * len, py + Math.cos(a) * len] as const;
  };

  const [armLx, armLy] = limbEnd(shoulderX, shoulderY, armLA, limbLen);
  const [armRx, armRy] = limbEnd(shoulderX, shoulderY, armRA, limbLen);
  const [legLx, legLy] = limbEnd(hipX, hipY, 180 - legLA, limbLen + 10);
  const [legRx, legRy] = limbEnd(hipX, hipY, 180 - legRA, limbLen + 10);

  const W = 100;
  const H = 200;

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
          <g transform={`translate(0,${bob}) rotate(${tilt} 50 122)`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            {/* ground shadow */}
            <ellipse cx="50" cy="196" rx="26" ry="6" fill="rgba(0,0,0,0.15)" stroke="none" />

            {/* legs */}
            <line x1={hipX} y1={hipY} x2={legLx} y2={legLy} />
            <line x1={hipX} y1={hipY} x2={legRx} y2={legRy} />

            {/* torso */}
            <line x1={shoulderX} y1={shoulderY} x2={hipX} y2={hipY} />

            {/* arms */}
            <line x1={shoulderX} y1={shoulderY} x2={armLx} y2={armLy} />
            <line x1={shoulderX} y1={shoulderY} x2={armRx} y2={armRy} />

            {/* head */}
            <g transform={`rotate(${headTilt} ${shoulderX} ${shoulderY})`}>
              <circle cx={shoulderX} cy={headCY} r={headR} fill="white" fillOpacity={0.02} />
              <Face type={face} cx={shoulderX} cy={headCY} r={headR} color={color} strokeWidth={strokeWidth} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

const Face: React.FC<{ type: Face; cx: number; cy: number; r: number; color: string; strokeWidth: number }> = ({
  type,
  cx,
  cy,
  color,
}) => {
  const eyeDx = 6;
  const eyeDy = -2;
  switch (type) {
    case "shock":
      return (
        <g stroke="none" fill={color}>
          <circle cx={cx - eyeDx} cy={cy + eyeDy} r={2.6} />
          <circle cx={cx + eyeDx} cy={cy + eyeDy} r={2.6} />
          <circle cx={cx} cy={cy + 8} r={4} fill="none" stroke={color} strokeWidth={2.4} />
        </g>
      );
    case "smile":
      return (
        <g>
          <g stroke="none" fill={color}>
            <circle cx={cx - eyeDx} cy={cy + eyeDy} r={2.4} />
            <circle cx={cx + eyeDx} cy={cy + eyeDy} r={2.4} />
          </g>
          <path d={`M ${cx - 6} ${cy + 6} Q ${cx} ${cy + 11} ${cx + 6} ${cy + 6}`} fill="none" stroke={color} strokeWidth={2.4} />
        </g>
      );
    case "worried":
      return (
        <g>
          <g stroke="none" fill={color}>
            <circle cx={cx - eyeDx} cy={cy + eyeDy} r={2.4} />
            <circle cx={cx + eyeDx} cy={cy + eyeDy} r={2.4} />
          </g>
          <path d={`M ${cx - 6} ${cy + 9} Q ${cx} ${cy + 4} ${cx + 6} ${cy + 9}`} fill="none" stroke={color} strokeWidth={2.4} />
        </g>
      );
    case "sly":
      return (
        <g>
          <line x1={cx - eyeDx - 3} y1={cy + eyeDy} x2={cx - eyeDx + 3} y2={cy + eyeDy} stroke={color} strokeWidth={2.2} />
          <line x1={cx + eyeDx - 3} y1={cy + eyeDy} x2={cx + eyeDx + 3} y2={cy + eyeDy} stroke={color} strokeWidth={2.2} />
          <path d={`M ${cx - 5} ${cy + 7} Q ${cx + 1} ${cy + 10} ${cx + 7} ${cy + 5}`} fill="none" stroke={color} strokeWidth={2.4} />
        </g>
      );
    case "closed":
      return (
        <g>
          <line x1={cx - eyeDx - 3} y1={cy + eyeDy} x2={cx - eyeDx + 3} y2={cy + eyeDy} stroke={color} strokeWidth={2.2} />
          <line x1={cx + eyeDx - 3} y1={cy + eyeDy} x2={cx + eyeDx + 3} y2={cy + eyeDy} stroke={color} strokeWidth={2.2} />
          <line x1={cx - 5} y1={cy + 7} x2={cx + 5} y2={cy + 7} stroke={color} strokeWidth={2.4} />
        </g>
      );
    case "neutral":
    default:
      return (
        <g>
          <g stroke="none" fill={color}>
            <circle cx={cx - eyeDx} cy={cy + eyeDy} r={2.4} />
            <circle cx={cx + eyeDx} cy={cy + eyeDy} r={2.4} />
          </g>
          <line x1={cx - 5} y1={cy + 8} x2={cx + 5} y2={cy + 8} stroke={color} strokeWidth={2.4} />
        </g>
      );
  }
};
