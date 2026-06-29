import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const Spinner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <mesh rotation={[0.4, frame * 0.05, 0]} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"#e9b949"} />
    </mesh>
  );
};

export const Test3D: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1f33" }}>
      <ThreeCanvas linear width={1920} height={1080} camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} />
        <Spinner />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
