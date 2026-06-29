import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

/* Palette pulled from the reference illustration (golden-hour landing). */
const C = {
  skyTop: "#5f5483",
  skyMid: "#dd9560",
  skyLow: "#f3d398",
  sun: "#ffe9bd",
  sea: "#3f6f82",
  seaHi: "#7fb0b8",
  sand: "#e7cb92",
  sandWet: "#caa468",
  j1: "#2c4528",
  j2: "#3f6234",
  j3: "#5c8348",
  ship: "#4b3724",
  shipDk: "#33271a",
  sail: "#d8c39a",
  cream: "#efe2c4",
  coat: "#3f5a3a",
  brown: "#7a5230",
  dressW: "#e7ddc4",
  dressB: "#9fb4c4",
  dressO: "#d08a4a",
  wrap: "#efe6d2",
  rim: "#ffd79a",
};

const skin = ["#5e3a22", "#7a4a2c", "#9a6238", "#b07b4f"];

/* ---- a stylised period figure (feet at local 0,0) ---- */
type Fig = {
  x: number;
  y: number;
  s?: number;
  kind: "coat" | "dress" | "shirt" | "child";
  hat?: "brim" | "wrap" | "cap" | "none";
  holds?: "flag" | "chest" | "none";
  skin?: string;
  cloth?: string;
  cloth2?: string;
  facing?: 1 | -1;
  flagWave?: number;
};

const Figure: React.FC<Fig> = ({
  x,
  y,
  s = 1,
  kind,
  hat = "none",
  holds = "none",
  skin: sk = skin[1],
  cloth = C.brown,
  cloth2 = C.cream,
  facing = 1,
  flagWave = 0,
}) => {
  return (
    <g transform={`translate(${x},${y}) scale(${s * facing},${s})`}>
      {/* shadow */}
      <ellipse cx="0" cy="2" rx="26" ry="7" fill="rgba(60,40,20,0.30)" />

      {/* legs */}
      {kind !== "dress" ? (
        <g>
          <rect x="-15" y="-78" width="12" height="78" rx="5" fill={cloth2 === C.cream ? "#d9c39a" : "#cdb085"} />
          <rect x="3" y="-78" width="12" height="78" rx="5" fill={cloth2 === C.cream ? "#d9c39a" : "#cdb085"} />
          <path d="M-17 0 h16 v-6 h-16 z" fill={C.shipDk} />
          <path d="M1 0 h16 v-6 h-16 z" fill={C.shipDk} />
        </g>
      ) : null}

      {/* body */}
      {kind === "dress" && (
        <path d={`M-30 0 C-26 -70,-14 -96,0 -96 C14 -96,26 -70,30 0 Z`} fill={cloth} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      )}
      {kind === "coat" && (
        <g>
          <path d="M-20 -118 C-26 -70,-24 -34,-20 -2 L20 -2 C24 -34,26 -70,20 -118 Z" fill={cloth} />
          <path d="M-6 -120 L0 -40 L6 -120 Z" fill={cloth2} />
          <rect x="-22" y="-122" width="44" height="16" rx="6" fill={cloth} />
        </g>
      )}
      {kind === "shirt" && (
        <path d="M-18 -112 C-22 -70,-20 -36,-16 -2 L16 -2 C20 -36,22 -70,18 -112 Z" fill={cloth} />
      )}
      {kind === "child" && (
        <path d={`M-18 0 C-15 -42,-8 -58,0 -58 C8 -58,15 -42,18 0 Z`} fill={cloth} />
      )}

      {/* arms */}
      {(() => {
        const top = kind === "child" ? -54 : kind === "dress" ? -88 : -110;
        return (
          <g>
            <rect x={-26} y={top} width={10} height={46} rx={5} fill={sk} transform={`rotate(8 -21 ${top})`} />
            <rect x={16} y={top} width={10} height={46} rx={5} fill={sk} transform={`rotate(-8 21 ${top})`} />
          </g>
        );
      })()}

      {/* head */}
      {(() => {
        const hy = kind === "child" ? -70 : kind === "dress" ? -104 : -128;
        return (
          <g>
            <circle cx="0" cy={hy} r={kind === "child" ? 12 : 16} fill={sk} />
            {/* warm rim light */}
            <path d={`M${kind === "child" ? 6 : 8} ${hy - 10} a ${kind === "child" ? 12 : 16} ${kind === "child" ? 12 : 16} 0 0 1 0 20`} fill="none" stroke={C.rim} strokeWidth="2.5" opacity="0.7" />
            {hat === "brim" && (
              <g>
                <ellipse cx="0" cy={hy - 8} rx="30" ry="7" fill={C.brown} />
                <path d={`M-15 ${hy - 8} C-15 ${hy - 26},15 ${hy - 26},15 ${hy - 8} Z`} fill={C.shipDk} />
              </g>
            )}
            {hat === "wrap" && <path d={`M-16 ${hy - 6} C-14 ${hy - 22},14 ${hy - 22},16 ${hy - 6} C8 ${hy - 14},-8 ${hy - 14},-16 ${hy - 6} Z`} fill={C.wrap} />}
            {hat === "cap" && <path d={`M-15 ${hy - 6} C-12 ${hy - 20},12 ${hy - 20},15 ${hy - 6} Z`} fill={C.brown} />}
          </g>
        );
      })()}

      {/* holds */}
      {holds === "chest" && (
        <g transform={`translate(22,-70)`}>
          <rect x="-2" y="0" width="40" height="26" rx="3" fill={C.brown} stroke={C.shipDk} strokeWidth="2" />
          <path d="M-2 8 q20 -16 40 0" fill={C.shipDk} />
          <rect x="14" y="6" width="6" height="8" fill={C.cream} />
        </g>
      )}
      {holds === "flag" && (
        <g>
          <rect x="20" y="-150" width="5" height="150" rx="2" fill={C.shipDk} />
          <path d={`M25 -148 q40 ${10 + flagWave} 70 0 q-20 22 0 44 q-40 ${-12 - flagWave} -70 0 Z`} fill={C.dressO} opacity="0.95" />
        </g>
      )}
    </g>
  );
};

const Palm: React.FC<{ x: number; y: number; s: number; sway: number }> = ({ x, y, s, sway }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d={`M0 0 C-6 -120,6 -240,${sway} -330`} fill="none" stroke="#5a4326" strokeWidth="14" strokeLinecap="round" />
    <g transform={`translate(${sway},-330)`}>
      {[-70, -35, 0, 35, 70, 110].map((a, i) => (
        <path key={i} d="M0 0 Q70 -10 150 30 Q70 8 0 6 Z" transform={`rotate(${a - 90})`} fill={i % 2 ? C.j2 : C.j3} />
      ))}
    </g>
  </g>
);

export const ArrivalHero: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 30) * 10;
  const flag = Math.sin(frame / 12) * 10;
  const cloud = (frame * 0.25) % 2200;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.skyTop} />
            <stop offset="55%" stopColor={C.skyMid} />
            <stop offset="100%" stopColor={C.skyLow} />
          </linearGradient>
          <radialGradient id="sun" cx="38%" cy="30%" r="42%">
            <stop offset="0%" stopColor={C.sun} stopOpacity="0.95" />
            <stop offset="100%" stopColor={C.sun} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.seaHi} />
            <stop offset="100%" stopColor={C.sea} />
          </linearGradient>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.sandWet} />
            <stop offset="100%" stopColor={C.sand} />
          </linearGradient>
          <radialGradient id="vig" cx="50%" cy="46%" r="75%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(20,8,0,0.45)" />
          </radialGradient>
        </defs>

        {/* sky + sun */}
        <rect width="1920" height="640" fill="url(#sky)" />
        <rect width="1920" height="640" fill="url(#sun)" />
        {/* drifting clouds */}
        {[0, 1, 2].map((i) => {
          const cx = ((cloud + i * 760) % 2400) - 300;
          const cy = 90 + i * 70;
          return (
            <g key={i} opacity={0.5 - i * 0.1} fill="#f6e2c0">
              <ellipse cx={cx} cy={cy} rx={150} ry={26} />
              <ellipse cx={cx + 90} cy={cy + 10} rx={110} ry={22} />
              <ellipse cx={cx - 90} cy={cy + 12} rx={100} ry={20} />
            </g>
          );
        })}

        {/* sea */}
        <rect y="520" width="1920" height="230" fill="url(#sea)" />
        {[0, 1, 2, 3, 4].map((i) => {
          const yy = 560 + i * 34;
          const off = Math.sin(frame / 20 + i) * 16;
          return <path key={i} d={`M0 ${yy} q480 ${10 + off} 960 0 t960 0`} fill="none" stroke={C.seaHi} strokeWidth="3" opacity={0.4 - i * 0.05} />;
        })}

        {/* jungle treeline */}
        <path d="M0 560 Q300 470 620 540 Q900 470 1240 540 Q1600 470 1920 545 L1920 760 L0 760 Z" fill={C.j1} />
        <path d="M780 560 Q1100 470 1500 540 Q1750 500 1920 540 L1920 760 L780 760 Z" fill={C.j2} />

        {/* ship (left, offshore) */}
        <g transform="translate(120,300)" fill={C.ship}>
          <path d="M30 250 L520 250 L470 330 L80 330 Z" fill={C.shipDk} />
          <path d="M40 252 L510 252 L500 268 L50 268 Z" fill={C.ship} />
          {[150, 300, 430].map((mx, i) => (
            <g key={i}>
              <rect x={mx} y={20} width="8" height="232" fill={C.shipDk} />
              <path d={`M${mx - 70} 70 Q${mx + 4} 40 ${mx + 78} 70 L${mx + 70} 150 Q${mx + 4} 130 ${mx - 62} 150 Z`} fill={C.sail} opacity="0.92" />
              <path d={`M${mx - 60} 165 Q${mx + 4} 145 ${mx + 68} 165 L${mx + 60} 225 Q${mx + 4} 210 ${mx - 54} 225 Z`} fill={C.sail} opacity="0.85" />
            </g>
          ))}
          <line x1="50" y1="20" x2="500" y2="20" stroke={C.shipDk} strokeWidth="2" />
        </g>
        {/* ship reflection */}
        <g transform="translate(120,300)" opacity="0.18">
          <path d="M80 332 L470 332 L520 360 L30 360 Z" fill={C.shipDk} />
        </g>

        {/* beach */}
        <path d="M0 700 Q500 660 1100 700 Q1500 730 1920 690 L1920 1080 L0 1080 Z" fill="url(#sand)" />
        {/* waterline foam */}
        <path d="M0 706 Q500 666 1100 706 Q1500 736 1920 696" fill="none" stroke="#f3ead2" strokeWidth="6" opacity="0.55" />

        {/* rowboat (foreground left) with rowers */}
        <g transform="translate(120,820)">
          <path d="M-60 30 Q140 70 360 30 L330 70 Q140 96 -30 70 Z" fill={C.brown} stroke={C.shipDk} strokeWidth="3" />
          <Figure x={70} y={36} s={0.7} kind="shirt" hat="cap" cloth={C.dressB} skin={skin[0]} />
          <Figure x={200} y={36} s={0.7} kind="shirt" hat="brim" cloth={C.cream} skin={skin[2]} facing={-1} />
          <line x1="40" y1="20" x2="-40" y2="80" stroke={C.shipDk} strokeWidth="5" />
          <line x1="250" y1="20" x2="330" y2="80" stroke={C.shipDk} strokeWidth="5" />
        </g>

        {/* central embrace */}
        <g transform="translate(760,930)">
          <Figure x={-20} y={0} s={1.0} kind="shirt" hat="cap" cloth={C.brown} skin={skin[1]} facing={1} />
          <Figure x={40} y={4} s={1.0} kind="dress" hat="wrap" cloth={C.coat} skin={skin[2]} facing={-1} />
        </g>

        {/* welcoming line of settlers (right) */}
        <g transform="translate(0,0)">
          <Figure x={1120} y={930} s={1.05} kind="coat" hat="none" holds="chest" cloth={C.coat} cloth2={C.cream} skin={skin[3]} />
          <Figure x={1240} y={948} s={0.7} kind="child" cloth={C.dressO} skin={skin[2]} holds="chest" />
          <Figure x={1330} y={930} s={1.05} kind="coat" hat="brim" holds="flag" cloth={C.brown} cloth2={C.cream} skin={skin[1]} flagWave={flag} />
          <Figure x={1445} y={934} s={1.0} kind="dress" hat="wrap" cloth={C.dressW} skin={skin[2]} />
          <Figure x={1545} y={946} s={0.78} kind="child" cloth={C.dressB} skin={skin[3]} />
          <Figure x={1630} y={930} s={1.05} kind="shirt" hat="brim" holds="chest" cloth={C.cream} skin={skin[1]} />
          <Figure x={1745} y={936} s={1.0} kind="dress" hat="wrap" cloth={C.dressB} skin={skin[2]} facing={-1} />
          <Figure x={1838} y={930} s={1.02} kind="coat" hat="brim" holds="flag" cloth={C.coat} cloth2={C.cream} skin={skin[3]} flagWave={-flag} />
        </g>

        {/* palms (right) */}
        <Palm x={1760} y={780} s={1.1} sway={sway} />
        <Palm x={1880} y={840} s={0.9} sway={sway * 1.3} />

        <rect width="1920" height="1080" fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};
