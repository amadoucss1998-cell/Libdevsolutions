import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SCENES, COLORS } from "./timeline";
import { SCENE_COMPONENTS } from "./Scenes";
import { ProgressBar } from "./components";

export const ForexStickmanVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <Audio src={staticFile("music.mp3")} volume={0.22} loop />

      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.key];
        return (
          <Sequence key={s.key} from={s.from} durationInFrames={s.durationInFrames}>
            <Comp />
          </Sequence>
        );
      })}

      <ProgressBar />
    </AbsoluteFill>
  );
};
