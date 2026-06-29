import React from "react";
import { Composition } from "remotion";
import { LiberiaVideo } from "./LiberiaVideo";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LiberiaBefore1847"
      component={LiberiaVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
