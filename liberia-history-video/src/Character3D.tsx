import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { Action } from "./Characters";

export type Character3DProps = {
  position?: [number, number, number];
  scale?: number;
  skin?: string;
  outfit?: string;
  accent?: string;
  hair?: "wrap" | "hat" | "short" | "none";
  action?: Action;
  facing?: 1 | -1;
  phase?: number;
  speed?: number;
  appearAt?: number;
};

const D = Math.PI / 180;

/** A low-poly 3D person, articulated and animated from the Remotion frame. */
export const Character3D: React.FC<Character3DProps> = ({
  position = [0, 0, 0],
  scale = 1,
  skin = "#8a5a3b",
  outfit = "#c75b39",
  accent = "#e9b949",
  hair = "short",
  action = "idle",
  facing = 1,
  phase = 0,
  speed = 1,
  appearAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame + phase) * 0.22 * speed;
  const sw = Math.sin(t);

  // pop-in
  const pop = spring({ frame: frame - appearAt, fps, config: { damping: 12, stiffness: 120 }, durationInFrames: 22 });
  const s = scale * (frame < appearAt ? 0 : pop);

  const skinDark = shade(skin, -0.12);
  const outDark = shade(outfit, -0.22);

  // joint angles (radians). limbs hang down at rot=0.
  let armLx = 6 * D, armLz = 0;
  let armRx = -6 * D, armRz = 0;
  let legLx = 0, legRx = 0;
  let bob = 0, lean = 0;

  switch (action) {
    case "walk":
      legLx = sw * 0.5; legRx = -sw * 0.5;
      armLx = -sw * 0.45; armRx = sw * 0.45;
      bob = -Math.abs(Math.sin(t)) * 0.08;
      lean = 0.06 * facing;
      break;
    case "wave":
      armRz = -2.5; armRx = Math.sin(t * 1.6) * 0.25;
      armLx = 0.15;
      bob = Math.sin(t * 0.6) * 0.03;
      break;
    case "cheer":
      armLz = 2.3; armRz = -2.3;
      armLx = -0.2; armRx = -0.2;
      bob = -Math.abs(Math.sin(t * 1.4)) * 0.1;
      break;
    case "write":
      armRx = -1.0 + Math.sin(t * 2.2) * 0.12; armRz = -0.4;
      armLx = -0.7; armLz = 0.3;
      break;
    case "drum":
      armLx = -0.7 - Math.abs(Math.sin(t * 2.4)) * 0.5; armLz = 0.3;
      armRx = -0.7 - Math.abs(Math.cos(t * 2.4)) * 0.5; armRz = -0.3;
      bob = Math.sin(t * 2.4) * 0.03;
      break;
    case "point":
      armRz = -1.5; armRx = -0.2;
      armLx = 0.12;
      break;
    case "idle":
    default: {
      const br = Math.sin(t * 0.7);
      armLx = (7 + br * 3) * D; armRx = -(7 + br * 3) * D;
      bob = br * 0.03;
      break;
    }
  }

  return (
    <group position={position} scale={[s * facing, s, s]}>
      <group position={[0, bob, 0]} rotation={[0, 0, lean]}>
        {/* legs (pivot at hips y=1.5) */}
        <Limb pivot={[0.26, 1.5, 0]} rot={[legRx, 0, 0]} len={1.5} w={0.32} color={outDark} foot />
        <Limb pivot={[-0.26, 1.5, 0]} rot={[legLx, 0, 0]} len={1.5} w={0.32} color={outDark} foot />

        {/* torso */}
        <mesh position={[0, 2.05, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.6, 1.15, 12]} />
          <meshStandardMaterial color={outfit} flatShading />
        </mesh>
        {/* collar */}
        <mesh position={[0, 2.62, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.46, 0.12, 12]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>

        {/* arms (pivot at shoulders y=2.55) */}
        <Limb pivot={[0.56, 2.55, 0]} rot={[armRx, 0, armRz]} len={1.2} w={0.22} color={skin} hand />
        <Limb pivot={[-0.56, 2.55, 0]} rot={[armLx, 0, armLz]} len={1.2} w={0.22} color={skin} hand />

        {/* neck */}
        <mesh position={[0, 2.78, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.2, 10]} />
          <meshStandardMaterial color={skinDark} flatShading />
        </mesh>

        {/* head */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <sphereGeometry args={[0.42, 20, 20]} />
          <meshStandardMaterial color={skin} flatShading />
        </mesh>
        {/* eyes */}
        <mesh position={[0.14, 3.24, 0.38]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={"#160d05"} />
        </mesh>
        <mesh position={[-0.14, 3.24, 0.38]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={"#160d05"} />
        </mesh>

        <HeadWear3D type={hair} accent={accent} skin={skin} />
      </group>
    </group>
  );
};

const Limb: React.FC<{
  pivot: [number, number, number];
  rot: [number, number, number];
  len: number;
  w: number;
  color: string;
  foot?: boolean;
  hand?: boolean;
}> = ({ pivot, rot, len, w, color, foot, hand }) => (
  <group position={pivot} rotation={rot}>
    <mesh position={[0, -len / 2, 0]} castShadow>
      <cylinderGeometry args={[w * 0.8, w, len, 8]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
    {foot && (
      <mesh position={[0, -len, 0.12]} castShadow>
        <boxGeometry args={[w * 1.4, w * 0.7, w * 2]} />
        <meshStandardMaterial color={"#3a2616"} flatShading />
      </mesh>
    )}
    {hand && (
      <mesh position={[0, -len, 0]} castShadow>
        <sphereGeometry args={[w * 0.85, 10, 10]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    )}
  </group>
);

const HeadWear3D: React.FC<{ type: string; accent: string; skin: string }> = ({ type, accent, skin }) => {
  switch (type) {
    case "wrap":
      return (
        <mesh position={[0, 3.46, 0]} castShadow>
          <cylinderGeometry args={[0.46, 0.44, 0.34, 14]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>
      );
    case "hat":
      return (
        <group>
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.4, 0.34, 14]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
          <mesh position={[0, 3.36, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.06, 18]} />
            <meshStandardMaterial color={shade(accent, -0.15)} flatShading />
          </mesh>
        </group>
      );
    case "short":
      return (
        <mesh position={[0, 3.42, -0.02]} castShadow>
          <sphereGeometry args={[0.44, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={shade(skin, -0.45)} flatShading />
        </mesh>
      );
    default:
      return null;
  }
};

export function shade(hex: string, amt: number): string {
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
  r = f(r); g = f(g); b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
