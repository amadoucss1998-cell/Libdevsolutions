import React from "react";
import { Composition } from "remotion";
import { LiberiaVideo } from "./LiberiaVideo";
import { CharacterTest } from "./CharacterTest";
import { Test3D } from "./Test3D";
import { Test3DChars } from "./Test3DChars";
import { ArrivalHero } from "./series/ArrivalHero";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="LiberiaBefore1847"
      component={LiberiaVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="CharacterTest"
      component={CharacterTest}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Test3D"
      component={Test3D}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Test3DChars"
      component={Test3DChars}
      durationInFrames={60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="ArrivalHero"
      component={ArrivalHero}
      durationInFrames={300}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    </>
  );
};
