import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, plex} from './theme';
import {DEDICATION_LINE, FPS, SCENES, TOTAL_FRAMES} from './scenes';

const LAST_START = SCENES[SCENES.length - 1].start * FPS;

// الهامش السفلي الثابت: شريط تقدّم + شريط الإهداء
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const left = 120;
  const right = 960;
  const w = right - left;
  const p = frame / TOTAL_FRAMES;
  const LINE_Y = 1700;

  // يظهر الإهداء بهدوء في البداية، ويخفت قليلاً في المشهد الأخير لأن بطاقة الإهداء تبرز فيه
  const appear = interpolate(frame, [15, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dimInLast = interpolate(frame, [LAST_START, LAST_START + 20], [1, 0.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={left} y1={LINE_Y} x2={right} y2={LINE_Y} stroke={`rgba(${COLORS.grid},0.18)`} strokeWidth={2} />
        {/* تقدّم من اليمين لليسار (اتجاه عربي) */}
        <line x1={right} y1={LINE_Y} x2={right - w * p} y2={LINE_Y} stroke={COLORS.gold} strokeWidth={2} opacity={0.8} />
        <circle cx={right - w * p} cy={LINE_Y} r={5} fill={COLORS.gold} />
        {SCENES.map((s) => {
          const x = right - (w * s.start * FPS) / TOTAL_FRAMES;
          const passed = frame >= s.start * FPS;
          return <circle key={s.start} cx={x} cy={LINE_Y} r={3.5} fill={passed ? COLORS.cyan : `rgba(${COLORS.grid},0.5)`} />;
        })}
      </svg>

      {/* شريط الإهداء */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 1760,
          display: 'flex',
          justifyContent: 'center',
          opacity: 0.75 * appear * dimInLast,
        }}
      >
        <div
          dir="rtl"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '16px 34px',
            borderRadius: 999,
            border: '1px solid rgba(229,211,179,0.22)',
            background: 'rgba(229,211,179,0.04)',
            fontFamily: plex,
            fontSize: 30,
            fontWeight: 400,
            color: COLORS.dedication,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width={16} height={16} viewBox="-8 -8 16 16">
            <path d="M 0 -7 L 2 -2 L 7 0 L 2 2 L 0 7 L -2 2 L -7 0 L -2 -2 Z" fill={COLORS.dedication} />
          </svg>
          <span>{DEDICATION_LINE}</span>
          <svg width={16} height={16} viewBox="-8 -8 16 16">
            <path d="M 0 -7 L 2 -2 L 7 0 L 2 2 L 0 7 L -2 2 L -7 0 L -2 -2 Z" fill={COLORS.dedication} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
