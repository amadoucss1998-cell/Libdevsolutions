import React from "react";
import { AbsoluteFill } from "remotion";
import { Character, Action } from "./Characters";

const actions: Action[] = ["idle", "walk", "wave", "cheer", "write", "drum", "point"];

export const CharacterTest: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#13476b" }}>
      {actions.map((a, i) => (
        <div key={a} style={{ position: "absolute", left: 40 + (i % 4) * 460, top: 60 + Math.floor(i / 4) * 480 }}>
          <div style={{ position: "absolute", color: "#f5ead2", fontFamily: "sans-serif", fontSize: 28, left: 80, top: -10 }}>{a}</div>
          <Character
            x={0}
            y={20}
            scale={1.3}
            action={a}
            skin={i % 2 ? "#6f4326" : "#a06a43"}
            outfit={["#c75b39", "#2c7da0", "#e9b949", "#7d5ba6", "#4a8c5a"][i % 5]}
            hair={(["wrap", "hat", "short", "wrap", "hat", "short", "wrap"] as const)[i]}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};
