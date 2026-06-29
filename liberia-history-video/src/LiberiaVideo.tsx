import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { SCENES, OUTRO, AUDIO_OFFSET, COLORS, TOTAL_FRAMES } from "./timeline";
import { Subtitle, Vignette } from "./components";
import {
  SceneOrigins,
  SceneGrainCoast,
  SceneACS,
  SceneElizabeth,
  SceneMonrovia,
  SceneLiberia,
  SceneToward1847,
  Outro,
} from "./Scenes";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  origins: SceneOrigins,
  graincoast: SceneGrainCoast,
  acs: SceneACS,
  elizabeth: SceneElizabeth,
  monrovia: SceneMonrovia,
  liberia: SceneLiberia,
  toward1847: SceneToward1847,
};

/** Thin year-progress bar along the very bottom of the frame. */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: "rgba(245,234,210,0.12)" }}>
      <div style={{ width: `${w}%`, height: "100%", background: COLORS.gold }} />
    </div>
  );
};

export const LiberiaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.nightDeep }}>
      {/* Audio */}
      <Audio src={staticFile("music.mp3")} volume={0.14} />
      <Sequence from={AUDIO_OFFSET}>
        <Audio src={staticFile("narration.mp3")} />
      </Sequence>

      {/* Scenes (each carries its own synced subtitle) */}
      {SCENES.map((s) => {
        const Comp = SCENE_COMPONENTS[s.key];
        return (
          <Sequence key={s.key} from={s.from} durationInFrames={s.durationInFrames}>
            <Comp />
            <Subtitle text={s.text} delay={s.subtitleDelay} />
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={OUTRO.from} durationInFrames={OUTRO.durationInFrames}>
        <Outro />
      </Sequence>

      <Vignette />
      <ProgressBar />
    </AbsoluteFill>
  );
};
