import React from "react";
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";

export interface RocketData {
  id: string;
  name: string;
  agency: string;
  year: number;
  h: number;
  d: number;
  pay: number;
  thr: number;
  active: boolean;
  color: string;
  desc: string;
  boosters: boolean;
}

interface Props {
  rockets: RocketData[];
  width: number;
}

function darken(hex: string, amt = 0.25): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * (1 - amt))},${Math.round(g * (1 - amt))},${Math.round(b * (1 - amt))})`;
}

function buildBodyPath(
  cx: number,
  groundY: number,
  hPx: number,
  wPx: number
): string {
  const hw = wPx / 2;
  const noseH = hPx * 0.14;
  const engineH = hPx * 0.1;
  const flare = hw * 0.22;
  const topY = groundY - hPx;
  const noseEndY = topY + noseH;
  const bodyEndY = groundY - engineH;
  return [
    `M ${cx} ${topY}`,
    `Q ${cx + hw * 0.25} ${topY + noseH * 0.25} ${cx + hw} ${noseEndY}`,
    `L ${cx + hw} ${bodyEndY}`,
    `L ${cx + hw + flare} ${groundY}`,
    `L ${cx - hw - flare} ${groundY}`,
    `L ${cx - hw} ${bodyEndY}`,
    `L ${cx - hw} ${noseEndY}`,
    `Q ${cx - hw * 0.25} ${topY + noseH * 0.25} ${cx} ${topY}`,
    "Z",
  ].join(" ");
}

interface ShapeProps {
  cx: number;
  groundY: number;
  rH: number;
  baseW: number;
  color: string;
  addDetail: boolean;
}

function RocketShape({ cx, groundY, rH, baseW, color, addDetail }: ShapeProps) {
  const hw = baseW / 2;
  const noseH = rH * 0.14;
  const engineH = rH * 0.1;
  const topY = groundY - rH;
  const noseEndY = topY + noseH;
  const bodyEndY = groundY - engineH;
  const finTop = groundY - rH * 0.22;
  const finW = hw * 0.7;
  const nzR = hw * 0.48;

  return (
    <G>
      <Path
        d={`M ${cx - hw} ${finTop} L ${cx - hw - finW} ${groundY} L ${cx - hw} ${groundY} Z`}
        fill={darken(color, 0.3)}
      />
      <Path
        d={`M ${cx + hw} ${finTop} L ${cx + hw + finW} ${groundY} L ${cx + hw} ${groundY} Z`}
        fill={darken(color, 0.3)}
      />
      <Path d={buildBodyPath(cx, groundY, rH, baseW)} fill={color} />
      {addDetail && rH > 40 && (
        <G>
          <Line
            x1={cx - hw + 1}
            y1={topY + rH * 0.42}
            x2={cx + hw - 1}
            y2={topY + rH * 0.42}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth={1}
          />
          <Rect
            x={cx - hw + 2}
            y={noseEndY + 3}
            width={Math.max(2, hw * 0.14)}
            height={Math.max(0, bodyEndY - noseEndY - 6)}
            fill="rgba(255,255,255,0.14)"
          />
        </G>
      )}
      <Ellipse
        cx={cx}
        cy={groundY}
        rx={nzR}
        ry={nzR * 0.3}
        fill="#0a0a14"
      />
      <Ellipse
        cx={cx}
        cy={groundY}
        rx={nzR * 0.55}
        ry={nzR * 0.17}
        fill="#1a1a28"
      />
    </G>
  );
}

const RULER_W = 44;
const PAD_B = 42;
const PAD_T = 22;
const MAX_M = 135;

const STAR_SEED = [23, 97, 134, 211, 45, 178, 303, 56, 289, 412, 67, 198, 345, 89, 267, 423, 112, 376, 501, 234];
const RULER_MARKS = [0, 20, 40, 60, 80, 100, 120];

export function RocketVisualization({ rockets, width }: Props) {
  const W = Math.max(width, 200);
  const H = Math.round(W * 0.72);
  const drawH = H - PAD_B - PAD_T;
  const scale = drawH / MAX_M;
  const groundY = H - PAD_B;
  const availW = W - RULER_W - 35;
  const colW = rockets.length > 0 ? availW / rockets.length : availW;
  const personH = 1.8 * scale;
  const personX = W - 18;

  const stars = STAR_SEED.map((s, i) => ({
    x: (s * 37 + i * 53) % (W - 60) + 45,
    y: (s * 19 + i * 31) % (H * 0.75),
    r: i % 3 === 0 ? 1 : 0.6,
  }));

  return (
    <Svg width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill="#080D1A" />

      {stars.map((s, i) => (
        <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="rgba(255,255,255,0.55)" />
      ))}

      {RULER_MARKS.map((m) => {
        const y = groundY - m * scale;
        return (
          <G key={m}>
            <Line
              x1={RULER_W + 2}
              y1={y}
              x2={W - 10}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.5}
              strokeDasharray="3,6"
            />
            <SvgText
              x={RULER_W - 5}
              y={y + 3.5}
              fontSize={9}
              fill="rgba(255,255,255,0.3)"
              textAnchor="end"
              fontFamily="monospace"
            >
              {m}m
            </SvgText>
            <Line
              x1={RULER_W - 3}
              y1={y}
              x2={RULER_W + 1}
              y2={y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.5}
            />
          </G>
        );
      })}

      <Line
        x1={RULER_W}
        y1={PAD_T}
        x2={RULER_W}
        y2={groundY}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={0.5}
      />
      <Line
        x1={RULER_W}
        y1={groundY}
        x2={W - 10}
        y2={groundY}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />

      <Line
        x1={personX}
        y1={groundY}
        x2={personX}
        y2={groundY - personH * 0.55}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
      <Circle
        cx={personX}
        cy={groundY - personH * 0.55 - personH * 0.15}
        r={personH * 0.13}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
        fill="none"
      />
      <Line
        x1={personX - personH * 0.15}
        y1={groundY - personH * 0.45}
        x2={personX + personH * 0.15}
        y2={groundY - personH * 0.45}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
      <Line
        x1={personX}
        y1={groundY - personH * 0.15}
        x2={personX - personH * 0.1}
        y2={groundY}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
      <Line
        x1={personX}
        y1={groundY - personH * 0.15}
        x2={personX + personH * 0.1}
        y2={groundY}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
      <SvgText
        x={personX}
        y={groundY + 13}
        fontSize={8}
        fill="rgba(255,255,255,0.3)"
        textAnchor="middle"
        fontFamily="monospace"
      >
        1.8m
      </SvgText>

      {rockets.map((r, i) => {
        const cx = RULER_W + colW * i + colW / 2;
        const rH = r.h * scale;
        const baseW = Math.max(22, Math.min(r.d * scale * 2.2, colW * 0.55));

        return (
          <G key={r.id}>
            {r.boosters && (() => {
              const bH = rH * 0.58;
              const bW = baseW * 0.3;
              const bOff = baseW * 0.62;
              const boosterColor = darken(r.color, 0.2);
              return (
                <G>
                  <RocketShape
                    cx={cx - bOff}
                    groundY={groundY}
                    rH={bH}
                    baseW={bW}
                    color={boosterColor}
                    addDetail={false}
                  />
                  <RocketShape
                    cx={cx + bOff}
                    groundY={groundY}
                    rH={bH}
                    baseW={bW}
                    color={boosterColor}
                    addDetail={false}
                  />
                </G>
              );
            })()}
            <RocketShape
              cx={cx}
              groundY={groundY}
              rH={rH}
              baseW={baseW}
              color={r.color}
              addDetail={true}
            />
            <SvgText
              x={cx}
              y={groundY + 15}
              fontSize={10}
              fill="rgba(255,255,255,0.75)"
              textAnchor="middle"
              fontWeight="500"
              fontFamily="sans-serif"
            >
              {r.name}
            </SvgText>
            <SvgText
              x={cx}
              y={groundY + 28}
              fontSize={9}
              fill="rgba(255,255,255,0.35)"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {r.h}m
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
