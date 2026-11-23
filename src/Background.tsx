import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from './theme';
import {WIDTH, HEIGHT} from './scenes';

const CELL = 60;

// خلفية بيج مع شبكة مربعات خفيفة (شفافية 15%) تنساب ببطء شديد
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  // انسياب قطري هادئ: ~0.6px أفقياً و ~0.9px رأسياً لكل إطار
  const dx = (frame * 0.6) % CELL;
  const dy = (frame * 0.9) % CELL;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern
            id="grid"
            width={CELL}
            height={CELL}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${dx} ${-dy})`}
          >
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
