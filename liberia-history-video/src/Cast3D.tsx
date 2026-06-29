import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill } from "remotion";
import { Character3D, Character3DProps } from "./Character3D";

const CameraRig: React.FC<{ pos: [number, number, number]; target: [number, number, number]; fov: number }> = ({ pos, target, fov }) => {
  const camera = useThree((s) => s.camera) as any;
  camera.position.set(...pos);
  camera.fov = fov;
  camera.lookAt(...target);
  camera.updateProjectionMatrix();
  return null;
};

export type Cast3DProps = {
  actors: Character3DProps[];
  cameraPos?: [number, number, number];
  cameraTarget?: [number, number, number];
  fov?: number;
  shadows?: boolean;
};

/** Transparent 3D overlay: lights, soft contact shadows, and a row of people. */
export const Cast3D: React.FC<Cast3DProps> = ({
  actors,
  cameraPos = [0, 3.4, 16],
  cameraTarget = [0, 1.7, 0],
  fov = 32,
  shadows = true,
}) => {
  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={1920}
        height={1080}
        shadows
        gl={{ alpha: true, preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: cameraPos, fov }}
        style={{ position: "absolute", inset: 0 }}
      >
        <CameraRig pos={cameraPos} target={cameraTarget} fov={fov} />
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#cfe8ff", "#3a2a1a", 0.5]} />
        <directionalLight
          position={[7, 14, 8]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={18}
          shadow-camera-bottom={-6}
          shadow-camera-near={1}
          shadow-camera-far={60}
        />
        <directionalLight position={[-8, 5, 4]} intensity={0.35} color={"#ffd9a0"} />

        {shadows && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 40]} />
            <shadowMaterial transparent opacity={0.33} />
          </mesh>
        )}

        {actors.map((a, i) => (
          <Character3D key={i} {...a} />
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
