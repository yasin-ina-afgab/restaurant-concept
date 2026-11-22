import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS} from './theme';
import {WIDTH, HEIGHT} from './scenes';

const CELL = 60;

// خلفية بيج مع شبكة مربعات هندسية خفيفة (شفافية 15%)
export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <path
              d={`M ${CELL} 0 L 0 0 0 ${CELL}`}
              fill="none"
              stroke={COLORS.grid}
              strokeWidth={2}
            />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" opacity={0.15} />
      </svg>
    </AbsoluteFill>
  );
};
