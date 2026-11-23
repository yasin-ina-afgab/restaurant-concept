import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from './theme';
import {WIDTH, HEIGHT} from './scenes';
import {GROUND_Y} from './Ground';

const GOLD = '#E8B54A';
const GOLD_LIGHT = '#FFF3C4';
const EARTH = '#D9C9A6';
const DARK = '#2B221B';
const ink = COLORS.ink;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// تدرجات مشتركة للنور
const LightDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <radialGradient id={`${id}-glow`}>
      <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity={1} />
      <stop offset="35%" stopColor={GOLD} stopOpacity={0.85} />
      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
    </radialGradient>
    <radialGradient id={`${id}-soft`}>
      <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity={0.9} />
      <stop offset="100%" stopColor={GOLD_LIGHT} stopOpacity={0} />
    </radialGradient>
    <pattern id={`${id}-hatch`} width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1={0} y1={0} x2={0} y2={18} stroke={ink} strokeWidth={2.5} />
    </pattern>
  </defs>
);

// أشعة نور دوّارة
const Rays: React.FC<{cx: number; cy: number; r: number; count: number; rotation: number; opacity: number; width?: number}> = ({
  cx,
  cy,
  r,
  count,
  rotation,
  opacity,
  width = 0.09,
}) => (
  <g transform={`rotate(${rotation} ${cx} ${cy})`} opacity={opacity}>
    {new Array(count).fill(0).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      const len = r * (i % 2 === 0 ? 1 : 0.72);
      const x1 = cx + Math.cos(a - width) * len;
      const y1 = cy + Math.sin(a - width) * len;
      const x2 = cx + Math.cos(a + width) * len;
      const y2 = cy + Math.sin(a + width) * len;
      return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} L ${x2} ${y2} Z`} fill={GOLD} />;
    })}
  </g>
);

/* ───────────── هالة النور خلف الشخصية ───────────── */
export const LightAura: React.FC<{opacity: number}> = ({opacity}) => {
  const frame = useCurrentFrame();
  const cx = WIDTH / 2;
  const cy = 960;
  const pulse = 1 + Math.sin(frame / 20) * 0.08;
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <LightDefs id="aura" />
        <circle cx={cx} cy={cy} r={430 * pulse} fill="url(#aura-soft)" opacity={0.55} />
        <Rays cx={cx} cy={cy} r={470 * pulse} count={16} rotation={frame * 0.35} opacity={0.22} />
        <Rays cx={cx} cy={cy} r={360} count={10} rotation={-frame * 0.5} opacity={0.18} width={0.05} />
        <circle cx={cx} cy={cy - 260} r={110 * pulse} fill="url(#aura-glow)" opacity={0.55} />
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────── القبر والنور الذي فيه ───────────── */
export const GraveScene: React.FC<{opacity: number; localFrame: number}> = ({opacity, localFrame: f}) => {
  const {fps} = useVideoConfig();
  if (opacity <= 0) return null;

  // النور يشتعل تدريجياً داخل اللحد
  const light = spring({frame: f - 25, fps, config: {damping: 18, stiffness: 40}});
  const flicker = 1 + Math.sin(f / 6) * 0.04 + Math.sin(f / 13) * 0.05;
  const lightR = interpolate(light, [0, 1], [10, 250]) * flicker;
  const chamberCx = 540;
  const chamberCy = 1130;
  const rise = interpolate(f, [0, 30], [60, 0], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <LightDefs id="grave" />
        <clipPath id="grave-chamber">
          <path d="M 300 1272 L 300 1085 Q 300 965 540 965 Q 780 965 780 1085 L 780 1272 Z" />
        </clipPath>

        <g transform={`translate(0 ${rise})`}>
          {/* توهج خارجي يتسرّب من القبر */}
          <circle cx={chamberCx} cy={chamberCy} r={lightR * 2.2} fill="url(#grave-soft)" opacity={0.45 * light} />

          {/* الكومة الترابية */}
          <path
            d={`M 160 ${GROUND_Y + 2} C 190 1010, 370 850, 540 850 C 710 850, 890 1010, 920 ${GROUND_Y + 2} Z`}
            fill={EARTH}
            stroke={ink}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <path
            d={`M 160 ${GROUND_Y + 2} C 190 1010, 370 850, 540 850 C 710 850, 890 1010, 920 ${GROUND_Y + 2} Z`}
            fill="url(#grave-hatch)"
            opacity={0.18}
          />
          {/* شاهد القبر */}
          <path d="M 515 856 L 515 800 Q 540 772 565 800 L 565 856 Z" fill={EARTH} stroke={ink} strokeWidth={5} strokeLinejoin="round" />

          {/* اللحد (الحجرة الداخلية) */}
          <path
            d="M 300 1272 L 300 1085 Q 300 965 540 965 Q 780 965 780 1085 L 780 1272 Z"
            fill={DARK}
            stroke={ink}
            strokeWidth={6}
          />
          <g clipPath="url(#grave-chamber)">
            <Rays cx={chamberCx} cy={chamberCy} r={lightR * 1.6} count={14} rotation={f * 0.6} opacity={0.5 * light} />
            <circle cx={chamberCx} cy={chamberCy} r={lightR} fill="url(#grave-glow)" opacity={light} />
            {/* ذرات نور صاعدة داخل اللحد */}
            {new Array(14).fill(0).map((_, i) => {
              const speed = 0.8 + random(`gs-${i}`) * 1.2;
              const y = 1265 - ((random(`go-${i}`) * 300 + f * speed) % 300);
              const x = 320 + random(`gx-${i}`) * 440 + Math.sin(f / 15 + i) * 10;
              return <circle key={i} cx={x} cy={y} r={3 + random(`gr-${i}`) * 4} fill={GOLD_LIGHT} opacity={0.8 * light} />;
            })}
            {/* الميت في كفنه الأبيض */}
            <rect x={355} y={1205} width={370} height={54} rx={27} fill="#FFFFFF" stroke={ink} strokeWidth={4} />
            {[420, 540, 660].map((x) => (
              <line key={x} x1={x} y1={1206} x2={x} y2={1258} stroke={COLORS.headCover} strokeWidth={5} />
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ───────────── شخصية صغيرة تمشي على الصراط ───────────── */
const Walker: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  const step = Math.sin(f / 4);
  const bob = -Math.abs(step) * 5;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${step * 3})`}>
      {/* الساقان */}
      <line x1={-6} y1={-14} x2={-6 + step * 8} y2={0} stroke={ink} strokeWidth={5} strokeLinecap="round" />
      <line x1={6} y1={-14} x2={6 - step * 8} y2={0} stroke={ink} strokeWidth={5} strokeLinecap="round" />
      {/* الثوب */}
      <path d="M -14 -78 L -22 -12 L 22 -12 L 14 -78 Z" fill="#FFFFFF" stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <line x1={-19} y1={-46} x2={19} y2={-46} stroke={COLORS.headCover} strokeWidth={4} />
      {/* الرأس وغطاؤه */}
      <circle cx={0} cy={-92} r={14} fill={COLORS.skin} stroke={ink} strokeWidth={4} />
      <path d="M -16 -88 Q -16 -112 0 -112 Q 16 -112 16 -88 L 14 -70 L 8 -80 L -8 -80 L -14 -70 Z" fill={COLORS.headCover} stroke={ink} strokeWidth={3.5} strokeLinejoin="round" />
    </g>
  );
};

/* ───────────── الصراط (الجسر) والنور حتى باب الجنة ───────────── */
const CLIFF_Y = 930;
const BRIDGE_L = 250;
const BRIDGE_R = 830;
const SAG_Y = 1010;

const bridgeY = (x: number) => {
  if (x <= BRIDGE_L || x >= BRIDGE_R) return CLIFF_Y;
  const t = (x - BRIDGE_L) / (BRIDGE_R - BRIDGE_L);
  return (1 - t) * (1 - t) * CLIFF_Y + 2 * (1 - t) * t * SAG_Y + t * t * CLIFF_Y;
};

export const SiratScene: React.FC<{opacity: number; localFrame: number; durationInFrames: number}> = ({
  opacity,
  localFrame: f,
  durationInFrames,
}) => {
  if (opacity <= 0) return null;

  // تقدّم الماشي من الجرف الأيسر حتى باب الجنة
  const walkX = interpolate(f, [20, durationInFrames - 45], [110, 935], {...clamp, easing: Easing.inOut(Easing.sin)});
  const walkY = bridgeY(walkX);
  const lightX = Math.min(walkX + 95, 960);
  const lightY = bridgeY(lightX) - 190 + Math.sin(f / 9) * 8;
  const doorOpen = interpolate(walkX, [760, 920], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const gateGlow = 0.35 + doorOpen * 0.65;

  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <LightDefs id="sirat" />
        <linearGradient id="abyss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DARK} stopOpacity={0.15} />
          <stop offset="100%" stopColor={DARK} stopOpacity={0.95} />
        </linearGradient>
        <clipPath id="lit-bridge">
          <rect x={0} y={0} width={lightX + 30} height={HEIGHT} />
        </clipPath>

        {/* الهاوية تحت الصراط */}
        <rect x={BRIDGE_L - 5} y={CLIFF_Y + 15} width={BRIDGE_R - BRIDGE_L + 10} height={GROUND_Y - CLIFF_Y - 7} fill="url(#abyss)" />
        {/* ألسنة مظلمة تتراقص في الهاوية */}
        {new Array(9).fill(0).map((_, i) => {
          const x = BRIDGE_L + 30 + i * 65;
          const h = 110 + Math.sin(f / 6 + i * 1.7) * 45 + random(`fh-${i}`) * 60;
          return (
            <path
              key={i}
              d={`M ${x - 26} ${GROUND_Y + 4} Q ${x - 10} ${GROUND_Y - h * 0.5} ${x + Math.sin(f / 5 + i) * 10} ${GROUND_Y - h} Q ${x + 12} ${GROUND_Y - h * 0.5} ${x + 26} ${GROUND_Y + 4} Z`}
              fill="#6B4A32"
              opacity={0.55}
            />
          );
        })}

        {/* الجرفان */}
        {[
          `M -10 ${GROUND_Y + 8} L -10 ${CLIFF_Y} L ${BRIDGE_L} ${CLIFF_Y} L ${BRIDGE_L - 30} 1080 L ${BRIDGE_L + 10} 1190 L ${BRIDGE_L - 10} ${GROUND_Y + 8} Z`,
          `M ${WIDTH + 10} ${GROUND_Y + 8} L ${WIDTH + 10} ${CLIFF_Y} L ${BRIDGE_R} ${CLIFF_Y} L ${BRIDGE_R + 28} 1070 L ${BRIDGE_R - 8} 1180 L ${BRIDGE_R + 12} ${GROUND_Y + 8} Z`,
        ].map((d, i) => (
          <g key={i}>
            <path d={d} fill={EARTH} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <path d={d} fill="url(#sirat-hatch)" opacity={0.18} />
          </g>
        ))}

        {/* باب الجنة */}
        <g transform={`translate(945 ${CLIFF_Y}) scale(1.3) translate(-970 -1045)`}>
          <circle cx={970} cy={900} r={190} fill="url(#sirat-soft)" opacity={gateGlow} />
          <Rays cx={970} cy={900} r={230} count={12} rotation={f * 0.4} opacity={0.3 * gateGlow} />
          {/* نور خلف الباب */}
          <path d="M 905 1045 L 905 880 Q 905 815 970 815 Q 1035 815 1035 880 L 1035 1045 Z" fill={GOLD_LIGHT} />
          <circle cx={970} cy={940} r={60} fill="url(#sirat-glow)" opacity={doorOpen} />
          {/* مصراعا الباب */}
          <g transform={`translate(905 0) scale(${1 - doorOpen * 0.85} 1) translate(-905 0)`}>
            <path d="M 905 1045 L 905 880 Q 905 815 970 815 L 970 1045 Z" fill="#8FA35A" stroke={ink} strokeWidth={4} />
          </g>
          <g transform={`translate(1035 0) scale(${1 - doorOpen * 0.85} 1) translate(-1035 0)`}>
            <path d="M 1035 1045 L 1035 880 Q 1035 815 970 815 L 970 1045 Z" fill="#8FA35A" stroke={ink} strokeWidth={4} />
          </g>
          {/* القوس الخارجي */}
          <path d="M 890 1045 L 890 878 Q 890 798 970 798 Q 1050 798 1050 878 L 1050 1045" fill="none" stroke={ink} strokeWidth={8} strokeLinejoin="round" />
          <path d="M 962 788 L 970 760 L 978 788 Z" fill={GOLD} stroke={ink} strokeWidth={3} />
        </g>

        {/* الصراط: خيط رفيع فوق الهاوية */}
        <path
          d={`M ${BRIDGE_L} ${CLIFF_Y} Q 540 ${SAG_Y} ${BRIDGE_R} ${CLIFF_Y}`}
          fill="none"
          stroke={ink}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* الجزء المضاء من الصراط خلف النور */}
        <g clipPath="url(#lit-bridge)">
          <path
            d={`M 0 ${CLIFF_Y} L ${BRIDGE_L} ${CLIFF_Y} Q 540 ${SAG_Y} ${BRIDGE_R} ${CLIFF_Y} L ${WIDTH} ${CLIFF_Y}`}
            fill="none"
            stroke={GOLD}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.55}
          />
          <path
            d={`M 0 ${CLIFF_Y} L ${BRIDGE_L} ${CLIFF_Y} Q 540 ${SAG_Y} ${BRIDGE_R} ${CLIFF_Y} L ${WIDTH} ${CLIFF_Y}`}
            fill="none"
            stroke={GOLD_LIGHT}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        {/* النور الذي يسير أمام صاحبه */}
        <circle cx={lightX} cy={lightY} r={170} fill="url(#sirat-soft)" opacity={0.5} />
        <Rays cx={lightX} cy={lightY} r={120} count={12} rotation={f * 1.2} opacity={0.45} />
        <circle cx={lightX} cy={lightY} r={60 + Math.sin(f / 7) * 6} fill="url(#sirat-glow)" />

        <g opacity={interpolate(walkX, [900, 935], [1, 0], clamp)}>
          <g transform={`translate(${walkX} ${walkY}) scale(1.7)`}>
            <Walker x={0} y={0} f={f} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
