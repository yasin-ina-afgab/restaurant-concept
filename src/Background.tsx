import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS} from './theme';
import {WIDTH, HEIGHT} from './scenes';
import {getCamera} from './camera';

const MINOR = 40;
const MAJOR = 200;

/* ───────── زخرفة هندسية إسلامية دائرية (Mandala) ───────── */
const polar = (r: number, deg: number, cx = 0, cy = 0) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

const starPolygon = (n: number, skip: number, r: number) => {
  const pts: string[] = [];
  let i = 0;
  for (let c = 0; c <= n; c++) {
    const [x, y] = polar(r, (i * 360) / n);
    pts.push(`${c === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    i = (i + skip) % n;
  }
  return pts.join(' ');
};

const Mandala: React.FC = () => {
  const g = COLORS.gold;
  const sw = 1.6;
  return (
    <g fill="none" stroke={g} strokeWidth={sw}>
      {[120, 240, 380, 520, 700, 820].map((r) => (
        <circle key={r} r={r} />
      ))}
      {/* زهرة الحياة: 12 دائرة متداخلة */}
      {new Array(12).fill(0).map((_, i) => {
        const [x, y] = polar(120, i * 30);
        return <circle key={`f${i}`} cx={x} cy={y} r={120} />;
      })}
      {/* نجمة اثني عشرية */}
      <path d={starPolygon(12, 5, 520)} />
      {/* نجمة ثمانية (مربعان متداخلان) */}
      <path d={starPolygon(8, 3, 380)} />
      {[0, 45].map((rot) => (
        <rect key={rot} x={-269} y={-269} width={538} height={538} transform={`rotate(${rot})`} />
      ))}
      {/* بتلات على الحلقة الخارجية */}
      {new Array(24).fill(0).map((_, i) => {
        const [x, y] = polar(610, i * 15);
        return <circle key={`p${i}`} cx={x} cy={y} r={90} />;
      })}
      {/* خطوط شعاعية دقيقة */}
      {new Array(72).fill(0).map((_, i) => {
        const [x1, y1] = polar(705, i * 5);
        const [x2, y2] = polar(i % 3 === 0 ? 815 : 760, i * 5);
        return <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
      {new Array(24).fill(0).map((_, i) => {
        const [x, y] = polar(860, i * 15 + 7.5);
        return <circle key={`d${i}`} cx={x} cy={y} r={5} fill={g} />;
      })}
    </g>
  );
};

/* ───────── النجوم / الجزيئات ───────── */
const STARS = new Array(150).fill(0).map((_, i) => ({
  x: random(`sx${i}`) * WIDTH,
  y: random(`sy${i}`) * HEIGHT,
  r: 0.8 + random(`sr${i}`) ** 3 * 2.6,
  speed: 0.08 + random(`sv${i}`) * 0.35,
  depth: 0.02 + random(`sd${i}`) * 0.08, // عمق للمنظور (parallax)
  phase: random(`sp${i}`) * Math.PI * 2,
  tw: 25 + random(`st${i}`) * 50,
  gold: random(`sg${i}`) > 0.35,
}));

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = getCamera(frame);

  // الشبكة تتحرك مع الكاميرا بعمق أقل (parallax)
  const gx = -(cam.x * 0.35) % MAJOR;
  const gy = -(cam.y * 0.35) % MAJOR;

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${COLORS.bgTop} 0%, ${COLORS.bgBottom} 100%)`}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="minor" width={MINOR} height={MINOR} patternUnits="userSpaceOnUse" patternTransform={`translate(${gx} ${gy})`}>
            <path d={`M ${MINOR} 0 L 0 0 0 ${MINOR}`} fill="none" stroke={`rgba(${COLORS.grid},0.045)`} strokeWidth={1} />
          </pattern>
          <pattern id="major" width={MAJOR} height={MAJOR} patternUnits="userSpaceOnUse" patternTransform={`translate(${gx} ${gy})`}>
            <path d={`M ${MAJOR} 0 L 0 0 0 ${MAJOR}`} fill="none" stroke={`rgba(${COLORS.grid},0.09)`} strokeWidth={1} />
            <path d="M -6 0 L 6 0 M 0 -6 L 0 6" stroke={`rgba(${COLORS.grid},0.25)`} strokeWidth={1} />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.7} />
          </radialGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.09} />
            <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect width={WIDTH} height={HEIGHT} fill="url(#minor)" />
        <rect width={WIDTH} height={HEIGHT} fill="url(#major)" />

        {/* الزخرفة الدائرية البعيدة: تدور ببطء مستمر */}
        <ellipse cx={540} cy={900} rx={760} ry={760} fill="url(#halo)" />
        <g transform={`translate(540 900) rotate(${frame * 0.05}) scale(${0.95 + cam.scale * 0.05})`} opacity={0.08}>
          <Mandala />
        </g>
        <g transform={`translate(540 900) rotate(${-frame * 0.03})`} opacity={0.05}>
          <path d={starPolygon(16, 7, 300)} fill="none" stroke={COLORS.gold} strokeWidth={1.4} />
        </g>

        {/* النجوم تطفو للأعلى ببطء مع عمق للمنظور */}
        {STARS.map((s, i) => {
          const y = (((s.y - frame * s.speed - cam.y * s.depth) % HEIGHT) + HEIGHT) % HEIGHT;
          const x = (((s.x - cam.x * s.depth + Math.sin(frame / 80 + s.phase) * 6) % WIDTH) + WIDTH) % WIDTH;
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / s.tw + s.phase));
          return (
            <circle key={i} cx={x} cy={y} r={s.r} fill={s.gold ? COLORS.goldSoft : '#CBD5E1'} opacity={tw * (s.gold ? 0.75 : 0.4)} />
          );
        })}

        <rect width={WIDTH} height={HEIGHT} fill="url(#vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
