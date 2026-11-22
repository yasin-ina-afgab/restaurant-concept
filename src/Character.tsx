import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from './theme';
import {GROUND_Y} from './Ground';

const FIG_W = 360;
const FIG_H = 620;
const FEET_Y = FIG_H - 6;
const BODY_BASE_Y = FIG_H - 18;

// شخصية بسيطة ثنائية الأبعاد: ثوب أبيض، غطاء رأس بني، حزام خفيف
// كل الحركات مشتقة من useCurrentFrame() لتُصيَّر إطاراً بإطار
export const Character: React.FC = () => {
  const frame = useCurrentFrame();

  // تمايل لطيف يميناً ويساراً (±3 درجات) حول القدمين
  const swayDeg = Math.sin(frame / 25) * 3;

  // تنفس مستمر: scaleY بين 1 و 1.03
  const breathWave = Math.sin(frame / 18); // -1 .. 1
  const scaleY = interpolate(breathWave, [-1, 1], [1, 1.03]);

  // حركة إيقاعية للرأس والذراعين متناسقة مع التنفس
  const bodyTopRise = (scaleY - 1) * (BODY_BASE_Y - 185); // ارتفاع الكتفين مع الشهيق
  const headTilt = Math.sin(frame / 18 + 0.6) * 1.6; // ميلان خفيف للرأس
  const headBob = -breathWave * 2;
  const armSwing = interpolate(breathWave, [-1, 1], [-2.5, 2.5]);

  const ink = COLORS.ink;
  const sw = 5;

  const breathingBody = `translate(180 ${BODY_BASE_Y}) scale(1 ${scaleY}) translate(-180 ${-BODY_BASE_Y})`;

  return (
    <svg
      width={FIG_W}
      height={FIG_H}
      viewBox={`0 0 ${FIG_W} ${FIG_H}`}
      style={{
        position: 'absolute',
        left: (1080 - FIG_W) / 2,
        top: GROUND_Y - FIG_H + 6,
        overflow: 'visible',
      }}
    >
      {/* ظل عند القدمين يتسع ويضيق مع التمايل */}
      <ellipse
        cx={180 + swayDeg * 4}
        cy={FEET_Y}
        rx={110 + Math.abs(swayDeg) * 3}
        ry={10}
        fill={ink}
        opacity={0.12}
      />

      <g transform={`rotate(${swayDeg} 180 ${FEET_Y})`}>
        {/* القدمان */}
        <ellipse cx={150} cy={FIG_H - 12} rx={26} ry={10} fill={ink} />
        <ellipse cx={210} cy={FIG_H - 12} rx={26} ry={10} fill={ink} />

        {/* الجسم مع حركة التنفس */}
        <g transform={breathingBody}>
          {/* الثوب الأبيض */}
          <path
            d="M 130 185
               C 112 190, 100 205, 98 230
               L 92 400
               C 88 470, 96 540, 104 598
               L 256 598
               C 264 540, 272 470, 268 400
               L 262 230
               C 260 205, 248 190, 230 185
               Z"
            fill={COLORS.robe}
            stroke={ink}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* خط الأزرار */}
          <line x1={180} y1={200} x2={180} y2={300} stroke={ink} strokeWidth={3} opacity={0.5} />
          {/* ثنيات الثوب */}
          <path d="M 150 400 C 146 470, 148 530, 150 590" fill="none" stroke={ink} strokeWidth={2.5} opacity={0.25} />
          <path d="M 212 400 C 216 470, 214 530, 212 590" fill="none" stroke={ink} strokeWidth={2.5} opacity={0.25} />
          {/* الحزام الخفيف */}
          <path
            d="M 112 352 C 150 362, 210 362, 248 352"
            fill="none"
            stroke={COLORS.headCover}
            strokeWidth={9}
            strokeLinecap="round"
          />
          <path
            d={`M 194 360 L ${200 + swayDeg * 1.5} 392`}
            stroke={COLORS.headCover}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>

        {/* الذراعان: تتأرجحان من الكتفين بإيقاع التنفس */}
        <g transform={`translate(0 ${-bodyTopRise})`}>
          <g transform={`rotate(${armSwing} 106 215)`}>
            <path
              d="M 98 232 C 88 300, 84 350, 90 396 L 112 398 C 110 350, 112 300, 118 250"
              fill={COLORS.robeShade}
              stroke={ink}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={100} cy={410} r={13} fill={COLORS.skin} stroke={ink} strokeWidth={4} />
          </g>
          <g transform={`rotate(${-armSwing} 254 215)`}>
            <path
              d="M 262 232 C 272 300, 276 350, 270 396 L 248 398 C 250 350, 248 300, 242 250"
              fill={COLORS.robeShade}
              stroke={ink}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <circle cx={260} cy={410} r={13} fill={COLORS.skin} stroke={ink} strokeWidth={4} />
          </g>
        </g>

        {/* الرأس وغطاء الرأس: يرتفع مع الكتفين ويميل ميلاناً خفيفاً */}
        <g transform={`translate(0 ${headBob - bodyTopRise}) rotate(${headTilt} 180 175)`}>
          <path
            d="M 122 110 C 108 160, 108 200, 120 236 L 150 228 C 142 190, 142 150, 148 118 Z"
            fill={COLORS.headCover}
            stroke={ink}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M 238 110 C 252 160, 252 200, 240 236 L 210 228 C 218 190, 218 150, 212 118 Z"
            fill={COLORS.headCover}
            stroke={ink}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect x={164} y={160} width={32} height={30} fill={COLORS.skin} stroke={ink} strokeWidth={4} />
          <ellipse cx={180} cy={128} rx={42} ry={50} fill={COLORS.skin} stroke={ink} strokeWidth={sw} />
          <path
            d="M 140 132 C 142 170, 160 184, 180 184 C 200 184, 218 170, 220 132 C 210 152, 196 158, 180 158 C 164 158, 150 152, 140 132 Z"
            fill={COLORS.headCoverDark}
            stroke={ink}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d="M 160 124 Q 166 130 172 124" fill="none" stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M 188 124 Q 194 130 200 124" fill="none" stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
          <path
            d="M 126 120
               C 122 70, 150 46, 180 46
               C 210 46, 238 70, 234 120
               C 222 98, 202 90, 180 90
               C 158 90, 138 98, 126 120 Z"
            fill={COLORS.headCover}
            stroke={ink}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M 132 92 C 158 78, 202 78, 228 92"
            fill="none"
            stroke={COLORS.headCoverDark}
            strokeWidth={7}
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};
