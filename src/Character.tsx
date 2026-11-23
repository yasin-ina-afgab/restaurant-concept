import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, GROUND_Y} from './theme';

const W = 200;
const H = 330;

// أيقونة مسطحة مجردة: ثوب أبيض + شماغ وعقال هندسيان، بلا ملامح
export const Character: React.FC = () => {
  const frame = useCurrentFrame();
  // تنفس هادئ جداً (دورة ~6 ثوانٍ)
  const breath = (Math.sin(frame / 30) + 1) / 2; // 0..1
  const scaleY = 1 + breath * 0.018;
  const lift = breath * 4; // ارتفاع الرأس مع الشهيق

  const ink = COLORS.ink;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{position: 'absolute', left: (1080 - W) / 2, top: GROUND_Y - H, overflow: 'visible'}}
    >
      {/* الثوب */}
      <g transform={`translate(100 ${H}) scale(1 ${scaleY}) translate(-100 ${-H})`}>
        <path
          d={`M 62 118 Q 100 108 138 118 L 152 ${H - 4} Q 100 ${H + 4} 48 ${H - 4} Z`}
          fill={COLORS.robe}
          stroke={ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* ظل جانبي خفيف */}
        <path d={`M 100 120 L 100 ${H - 2} Q 128 ${H} 152 ${H - 4} L 138 118 Q 120 113 100 112 Z`} fill={COLORS.robeShade} opacity={0.7} />
        {/* فتحة الصدر */}
        <line x1={100} y1={126} x2={100} y2={170} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* الرأس: شماغ وعقال */}
      <g transform={`translate(0 ${-lift})`}>
        {/* طرفا الشماغ على الكتفين */}
        <path d="M 58 70 L 46 146 L 84 136 L 80 76 Z" fill={COLORS.shemagh} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 142 70 L 154 146 L 116 136 L 120 76 Z" fill={COLORS.shemaghShade} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        {/* الوجه (دائرة بلا ملامح) */}
        <circle cx={100} cy={82} r={30} fill={COLORS.skin} stroke={ink} strokeWidth={4} />
        {/* الشماغ فوق الرأس */}
        <path
          d="M 56 80 Q 56 30 100 30 Q 144 30 144 80 L 128 66 Q 100 56 72 66 Z"
          fill={COLORS.shemagh}
          stroke={ink}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {/* العقال */}
        <rect x={62} y={40} width={76} height={11} rx={5.5} fill={COLORS.agal} />
      </g>
    </svg>
  );
};
