import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS, readex} from './theme';
import {FPS, SCENES, TOTAL_FRAMES} from './scenes';

// شريط تقدّم سفلي بأسلوب لوحات البيانات
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const left = 120;
  const right = 960;
  const w = right - left;
  const p = frame / TOTAL_FRAMES;
  const secs = Math.floor(frame / FPS);
  const time = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={left} y1={1720} x2={right} y2={1720} stroke={`rgba(${COLORS.grid},0.2)`} strokeWidth={2} />
        {/* تقدّم من اليمين لليسار (اتجاه عربي) */}
        <line x1={right} y1={1720} x2={right - w * p} y2={1720} stroke={COLORS.gold} strokeWidth={2} />
        <circle cx={right - w * p} cy={1720} r={5} fill={COLORS.gold} />
        {SCENES.map((s) => {
          const x = right - (w * s.start * FPS) / TOTAL_FRAMES;
          const passed = frame >= s.start * FPS;
          return <circle key={s.start} cx={x} cy={1720} r={3.5} fill={passed ? COLORS.cyan : `rgba(${COLORS.grid},0.5)`} />;
        })}
        <text x={left} y={1764} fill={COLORS.muted} fontSize={22} letterSpacing={3} style={{fontFamily: readex}}>
          {time} / 01:01
        </text>
      </svg>
    </AbsoluteFill>
  );
};
