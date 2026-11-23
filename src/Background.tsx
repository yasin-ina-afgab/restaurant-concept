import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, GROUND_Y} from './theme';
import {WIDTH, HEIGHT} from './scenes';

const CELL = 54;

// خلفية بيج ناعمة + شبكة دقيقة جداً وباهتة + خط أرضي بسيط
export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse" x={(WIDTH % CELL) / 2}>
            <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke={COLORS.grid} strokeWidth={1} />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" opacity={0.13} />
        <line
          x1={90}
          y1={GROUND_Y}
          x2={WIDTH - 90}
          y2={GROUND_Y}
          stroke={COLORS.ink}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
