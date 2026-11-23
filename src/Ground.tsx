import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from './theme';
import {WIDTH, HEIGHT} from './scenes';

export const GROUND_Y = 1300;

// خط أرضي متموج بسيط بصيغة مسار SVG
const buildWave = (): string => {
  const points: string[] = [];
  const step = 20;
  for (let x = -20; x <= WIDTH + 20; x += step) {
    const y =
      GROUND_Y +
      Math.sin((x / WIDTH) * Math.PI * 3) * 9 +
      Math.sin((x / WIDTH) * Math.PI * 7 + 1.2) * 4;
    points.push(`${x === -20 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`);
  }
  return points.join(' ');
};

const WAVE = buildWave();

export const Ground: React.FC = () => {
  const frame = useCurrentFrame();
  const hatchHeight = 260;
  // انزلاق بطيء لخطوط التظليل لإحساس بالحياة دون تشتيت
  const hatchShift = (frame * 0.6) % 26;
  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="hatch"
            width={26}
            height={26}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(-45) translate(${hatchShift} 0)`}
          >
            <line x1={0} y1={0} x2={0} y2={26} stroke={COLORS.ink} strokeWidth={3} />
          </pattern>
          <linearGradient id="hatchFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity={0.55} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>
          <mask id="hatchMask">
            <rect x={0} y={GROUND_Y - 20} width={WIDTH} height={hatchHeight} fill="url(#hatchFade)" />
          </mask>
          <clipPath id="belowGround">
            <path d={`${WAVE} L ${WIDTH + 20} ${HEIGHT} L -20 ${HEIGHT} Z`} />
          </clipPath>
        </defs>
        {/* خطوط التظليل المائلة أسفل الخط الأرضي */}
        <g clipPath="url(#belowGround)">
          <rect
            x={0}
            y={GROUND_Y - 20}
            width={WIDTH}
            height={hatchHeight}
            fill="url(#hatch)"
            mask="url(#hatchMask)"
          />
        </g>
        {/* الخط الأرضي */}
        <path
          d={WAVE}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
