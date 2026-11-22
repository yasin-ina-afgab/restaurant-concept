import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {WIDTH, HEIGHT} from './scenes';

const COUNT = 46;
const TOP_LIMIT = 0;
const BOTTOM_LIMIT = 1330; // تبدأ الجزيئات فوق خط الأرض
const TRAVEL = BOTTOM_LIMIT - TOP_LIMIT;

type Particle = {
  x: number;
  offset: number;
  speed: number;
  size: number;
  drift: number;
  phase: number;
  twinkle: number;
  alpha: number;
};

// قيم ثابتة ومحددة مسبقاً (random مع seed) ليكون التصيير متطابقاً في كل مرة
const PARTICLES: Particle[] = new Array(COUNT).fill(0).map((_, i) => ({
  x: random(`x-${i}`) * WIDTH,
  offset: random(`o-${i}`) * TRAVEL,
  speed: 0.6 + random(`s-${i}`) * 0.9, // بكسل لكل إطار
  size: 3 + random(`z-${i}`) * 6,
  drift: 10 + random(`d-${i}`) * 28,
  phase: random(`p-${i}`) * Math.PI * 2,
  twinkle: 18 + random(`t-${i}`) * 30,
  alpha: 0.35 + random(`a-${i}`) * 0.5,
}));

// نقاط ذهبية صغيرة تطفو للأعلى ببطء
export const Particles: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="goldGlow">
            <stop offset="0%" stopColor="#FFF4C8" stopOpacity={1} />
            <stop offset="45%" stopColor="#E2B04A" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#C8942E" stopOpacity={0} />
          </radialGradient>
        </defs>
        {PARTICLES.map((p, i) => {
          const travelled = (p.offset + frame * p.speed) % TRAVEL;
          const y = BOTTOM_LIMIT - travelled;
          const x = p.x + Math.sin(frame / 40 + p.phase) * p.drift;
          // تلاشي عند الأطراف العليا والسفلى + وميض خفيف
          const edgeFade = interpolate(travelled, [0, 120, TRAVEL - 220, TRAVEL], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const twinkle = 0.65 + 0.35 * Math.sin(frame / p.twinkle + p.phase);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={p.size * 1.8}
              fill="url(#goldGlow)"
              opacity={p.alpha * edgeFade * twinkle}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
