import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { beatOffsets, COLORS, scene, WIDTH } from "./timeline";
import { PaperBG, TitleCard, SceneCaptions, StatCard, Chip, FONT } from "./components";
import { StickFigure } from "./StickFigure";
import {
  Candle,
  MarketMonster,
  BounceChart,
  TrendPath,
  ChecklistItem,
  GrowthChart,
  RiskRewardBars,
  PhoneAd,
  Rocket,
  EmptyWallet,
  RampBox,
  CurrencyGlobe,
  PairArrow,
  FastClock,
} from "./graphics";

/** Top of a stick figure so its feet land on `groundY`. */
const feetY = (groundY: number, scale: number) => groundY - 196 * scale;
const CENTER_X = WIDTH / 2;
const GROUND = 1440;

/* -------------------------------------------------------------------- */
/* Scene 1 — The Dream                                                   */
/* -------------------------------------------------------------------- */
export const SceneDream: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("dream");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 110, top: 1180 }}>
        <EmptyWallet appearAt={o[1]} />
      </div>
      <StickFigure
        x={CENTER_X - 100}
        y={feetY(GROUND, 2.1)}
        scale={2.1}
        action="sit"
        face={frame >= o[4] ? "shock" : "worried"}
        color={COLORS.alex}
      />
      <PhoneAd appearAt={o[2]} text={s.beats[3].text ?? ""} />
      {frame >= o[5] && <Rocket appearAt={o[5]} />}
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 2 — Reality                                                     */
/* -------------------------------------------------------------------- */
export const SceneReality: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("reality");
  const o = beatOffsets(s.beats);
  const crashed = frame >= o[3];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 210, top: 520 }}>
        <TrendPath up={false} appearAt={o[3]} showLabels={false} />
      </div>
      {frame >= o[1] && (
        <div style={{ position: "absolute", left: CENTER_X - 90, top: 470 }}>
          <StatCard label="Deposit" value="$100" appearAt={o[1]} color={COLORS.blue} />
        </div>
      )}
      {crashed && (
        <div style={{ position: "absolute", left: CENTER_X - 90, top: 990 }}>
          <StatCard label="Account Balance" value="$38" appearAt={o[3]} color={COLORS.red} />
        </div>
      )}
      <StickFigure
        x={CENTER_X - 100}
        y={feetY(GROUND, 2.1)}
        scale={2.1}
        action={crashed ? "panic" : "point"}
        face={crashed ? "shock" : "neutral"}
        color={COLORS.alex}
      />
      {frame >= o[5] && (
        <StickFigure
          x={CENTER_X + 190}
          y={feetY(GROUND, 1.9)}
          scale={1.9}
          action="think"
          face="neutral"
          color={COLORS.mentor}
          facing={-1}
        />
      )}
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 3 — What Is Forex?                                              */
/* -------------------------------------------------------------------- */
export const SceneWhatIsForex: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("whatIsForex");
  const o = beatOffsets(s.beats);
  const showPair = frame >= o[4];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      {!showPair && <CurrencyGlobe appearAt={o[1]} />}
      {showPair && (
        <div style={{ position: "absolute", left: CENTER_X - 130, top: 620 }}>
          <PairArrow up={frame < o[7]} appearAt={o[4]} />
        </div>
      )}
      <StickFigure
        x={CENTER_X - 90}
        y={feetY(GROUND, 2)}
        scale={2}
        action="point"
        color={COLORS.mentor}
      />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 4 — Buy & Sell                                                  */
/* -------------------------------------------------------------------- */
export const SceneBuySell: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("buySell");
  const o = beatOffsets(s.beats);
  const phase2 = frame >= o[2];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 230, top: 560 }}>
        {!phase2 ? <RampBox up appearAt={o[1]} /> : <RampBox up={false} appearAt={o[2]} />}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 44,
          color: phase2 ? COLORS.red : COLORS.green,
        }}
      >
        {phase2 ? "SELL = Price Goes Down" : "BUY = Price Goes Up"}
      </div>
      <StickFigure
        x={CENTER_X - 90}
        y={feetY(1780, 1.7)}
        scale={1.7}
        action="push"
        facing={phase2 ? -1 : 1}
        color={COLORS.alex}
      />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 5 — The Chart                                                   */
/* -------------------------------------------------------------------- */
export const SceneTheChart: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("theChart");
  const o = beatOffsets(s.beats);
  const showLongWick = frame >= o[4];
  const candles = [
    { bull: true, h: 90 },
    { bull: false, h: 60 },
    { bull: true, h: 130 },
    { bull: true, h: 70 },
    { bull: false, h: 100 },
  ];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 200, top: 600, display: "flex", gap: 20 }}>
        {!showLongWick &&
          candles.map((c, i) => (
            <Candle key={i} x={i * 76} bull={c.bull} bodyH={c.h} appearAt={o[1] + i * 8} />
          ))}
        {showLongWick && <Candle x={140} bull={false} bodyH={40} wickTop={16} wickBottom={140} appearAt={o[4]} />}
      </div>
      {frame >= o[2] && frame < o[4] && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", justifyContent: "center", gap: 40 }}>
          <Chip appearAt={o[2]} color={COLORS.green}>Green = Buyers won</Chip>
          <Chip appearAt={o[2] + 10} color={COLORS.red}>Red = Sellers won</Chip>
        </div>
      )}
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 6 — The Big Mistake                                             */
/* -------------------------------------------------------------------- */
export const SceneBigMistake: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("bigMistake");
  const o = beatOffsets(s.beats);
  const punched = frame >= o[3];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      {!punched && (
        <div style={{ position: "absolute", left: CENTER_X - 40, top: 520 }}>
          <Candle x={0} bull bodyH={110} appearAt={o[1]} />
        </div>
      )}
      {punched && (
        <MarketMonster x={CENTER_X - 110} y={520} bull={false} appearAt={o[3]} punch />
      )}
      <StickFigure
        x={CENTER_X - 90}
        y={feetY(GROUND, 2)}
        scale={2}
        action={punched ? "facepalm" : "point"}
        face={punched ? "worried" : "neutral"}
        color={COLORS.alex}
      />
      {frame >= o[4] && (
        <StickFigure x={CENTER_X + 180} y={feetY(GROUND, 1.8)} scale={1.8} action="laugh" face="sly" color={COLORS.mentor} facing={-1} />
      )}
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 7 — Support & Resistance                                        */
/* -------------------------------------------------------------------- */
export const SceneSupportResistance: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("supportResistance");
  const o = beatOffsets(s.beats);
  const showCeiling = frame >= o[2];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 260, top: 560 }}>
        <BounceChart appearAt={o[1]} showFloor showCeiling={showCeiling} bounces={showCeiling ? 3 : 1.5} />
      </div>
      <StickFigure x={CENTER_X - 90} y={feetY(1780, 1.7)} scale={1.7} action="think" color={COLORS.mentor} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 8 — Trend                                                       */
/* -------------------------------------------------------------------- */
export const SceneTrend: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("trend");
  const o = beatOffsets(s.beats);
  const down = frame >= o[5];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 260, top: 560 }}>
        <TrendPath up={!down} appearAt={down ? o[5] : o[1]} />
      </div>
      <StickFigure x={CENTER_X - 90} y={feetY(GROUND, 2)} scale={2} action="point" color={COLORS.mentor} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 9 — Risk Management                                             */
/* -------------------------------------------------------------------- */
export const SceneRiskManagement: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("riskManagement");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      {frame >= o[2] && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 24 }}>
          <StatCard label="Account" value="$100" appearAt={o[2]} color={COLORS.blue} />
          <StatCard label="Risk" value="1%" appearAt={o[2] + 8} color={COLORS.gold} />
          <StatCard label="Loss" value="$1" appearAt={o[2] + 16} color={COLORS.red} />
        </div>
      )}
      <StickFigure x={CENTER_X - 180} y={feetY(GROUND, 1.9)} scale={1.9} action="shrug" face="worried" color={COLORS.alex} />
      <StickFigure x={CENTER_X + 100} y={feetY(GROUND, 1.9)} scale={1.9} action="idle" color={COLORS.mentor} facing={-1} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 10 — Stop Loss                                                  */
/* -------------------------------------------------------------------- */
export const SceneStopLoss: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("stopLoss");
  const o = beatOffsets(s.beats);
  const stopped = frame >= o[2];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 260, top: 560 }}>
        <TrendPath up={false} appearAt={o[1]} showLabels={false} />
      </div>
      {stopped && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 800,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 46,
            color: "#fff",
            background: COLORS.red,
            padding: "18px 0",
          }}
        >
          🛑 STOP LOSS
        </div>
      )}
      <StickFigure x={CENTER_X - 90} y={feetY(GROUND, 2)} scale={2} action={stopped ? "facepalm" : "point"} color={COLORS.alex} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 11 — Risk To Reward                                             */
/* -------------------------------------------------------------------- */
export const SceneRiskReward: React.FC = () => {
  const s = scene("riskReward");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 210, top: 620 }}>
        <RiskRewardBars appearAt={o[1]} />
      </div>
      <StickFigure x={CENTER_X - 90} y={feetY(GROUND, 2)} scale={2} action="cheer" color={COLORS.mentor} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 12 — Emotions                                                   */
/* -------------------------------------------------------------------- */
export const SceneEmotions: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("emotions");
  const o = beatOffsets(s.beats);
  const crashed = frame >= o[2];
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 210, top: 560 }}>
        <TrendPath up={!crashed} appearAt={crashed ? o[2] : o[1]} showLabels={false} />
      </div>
      <StickFigure
        x={CENTER_X - 90}
        y={feetY(GROUND, 2)}
        scale={2}
        action={crashed ? "panic" : "cheer"}
        face={crashed ? "shock" : "smile"}
        color={COLORS.alex}
      />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 13 — Trading Plan                                               */
/* -------------------------------------------------------------------- */
const CHECKLIST_ITEMS = ["Trend", "Support", "Resistance", "Confirmation", "Stop Loss", "Risk"];
export const SceneTradingPlan: React.FC = () => {
  const s = scene("tradingPlan");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 220, top: 560, display: "flex", flexDirection: "column", gap: 18 }}>
        {CHECKLIST_ITEMS.map((item, i) => (
          <ChecklistItem key={item} text={item} appearAt={o[1] + i * 11} />
        ))}
      </div>
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 14 — Patience                                                   */
/* -------------------------------------------------------------------- */
export const ScenePatience: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("patience");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 110, top: 640 }}>
        <FastClock appearAt={o[1]} />
      </div>
      <StickFigure
        x={CENTER_X - 90}
        y={feetY(GROUND, 2)}
        scale={2}
        action="sit"
        face={frame >= o[2] ? "smile" : "neutral"}
        color={COLORS.mentor}
      />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Scene 15 — Ending                                                     */
/* -------------------------------------------------------------------- */
export const SceneEnding: React.FC = () => {
  const s = scene("ending");
  const o = beatOffsets(s.beats);
  return (
    <AbsoluteFill>
      <PaperBG />
      <TitleCard sceneNumber={s.sceneNumber} title={s.title} appearAt={o[0]} />
      <div style={{ position: "absolute", left: CENTER_X - 320, top: 560 }}>
        <GrowthChart appearAt={o[1]} />
      </div>
      <StickFigure x={CENTER_X - 90} y={feetY(1840, 1.6)} scale={1.6} action="idle" face="smile" color={COLORS.alex} />
      <SceneCaptions beats={s.beats} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------- */
/* Final message                                                        */
/* -------------------------------------------------------------------- */
export const SceneFinalMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("finalMessage");
  const o = beatOffsets(s.beats);
  const showEnd = frame >= o[5];
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      {showEnd ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 88,
            letterSpacing: 10,
            color: "#fff",
          }}
        >
          THE END
        </div>
      ) : (
        <SceneCaptions beats={s.beats} />
      )}
    </AbsoluteFill>
  );
};

export const SCENE_COMPONENTS: Record<string, React.FC> = {
  dream: SceneDream,
  reality: SceneReality,
  whatIsForex: SceneWhatIsForex,
  buySell: SceneBuySell,
  theChart: SceneTheChart,
  bigMistake: SceneBigMistake,
  supportResistance: SceneSupportResistance,
  trend: SceneTrend,
  riskManagement: SceneRiskManagement,
  stopLoss: SceneStopLoss,
  riskReward: SceneRiskReward,
  emotions: SceneEmotions,
  tradingPlan: SceneTradingPlan,
  patience: ScenePatience,
  ending: SceneEnding,
  finalMessage: SceneFinalMessage,
};
