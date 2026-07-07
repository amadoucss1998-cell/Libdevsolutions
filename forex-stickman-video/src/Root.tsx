import React from "react";
import { Composition } from "remotion";
import { ForexStickmanVideo } from "./ForexStickmanVideo";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ForexStickman"
      component={ForexStickmanVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
