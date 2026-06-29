import React from "react";
import { AbsoluteFill } from "remotion";
import { Cast3D } from "./Cast3D";
import { Character3DProps } from "./Character3D";

const actors: Character3DProps[] = [
  { position: [-9, 0, 0], action: "idle", skin: "#6f4326", outfit: "#c75b39", hair: "short" },
  { position: [-6, 0, 0], action: "walk", skin: "#a06a43", outfit: "#2c7da0", hair: "hat" },
  { position: [-3, 0, 0], action: "wave", skin: "#7a4a2a", outfit: "#e9b949", hair: "wrap" },
  { position: [0, 0, 0], action: "cheer", skin: "#9a6238", outfit: "#7d5ba6", hair: "wrap" },
  { position: [3, 0, 0], action: "drum", skin: "#6f4326", outfit: "#4a8c5a", hair: "short" },
  { position: [6, 0, 0], action: "point", skin: "#a06a43", outfit: "#bf1d2d", hair: "hat", facing: -1 },
  { position: [9, 0, 0], action: "write", skin: "#7a4a2a", outfit: "#2c7da0", hair: "wrap" },
];

export const Test3DChars: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b1f33,#13476b)" }}>
      <Cast3D actors={actors} cameraPos={[0, 4.2, 22]} cameraTarget={[0, 1.7, 0]} fov={30} />
    </AbsoluteFill>
  );
};
