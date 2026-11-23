import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, plex} from './theme';
import {WIDTH, HEIGHT, SCENES} from './scenes';
import {FOCUS, NODES, getCamera} from './camera';

const segmentPath = (i: number) => {
  const a = NODES[i];
  const b = NODES[i + 1];
  const h = (b.y - a.y) * 0.55;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + h} ${b.x} ${b.y - h} ${b.x} ${b.y}`;
};

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export const Nodes: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = getCamera(frame);

  // ظهور الشبكة في بداية الفيديو
  const intro = spring({frame: frame - 4, fps, durationInFrames: 45, config: {damping: 200}});

  // حالة كل عقدة: نشطة (ذهبي) / تمت زيارتها (فيروزي)
  const arrive = (j: number) => (j === 0 ? intro : cam.progress[j - 1]);
  const leave = (j: number) => (j < cam.progress.length ? cam.progress[j] : 0);

  const pulse = 0.5 + 0.5 * Math.sin(frame / 14);

  const transform = `translate(${FOCUS.x} ${FOCUS.y}) scale(${cam.scale}) translate(${-cam.x} ${-cam.y})`;

  const first = NODES[0];
  const last = NODES[NODES.length - 1];

  return (
    <AbsoluteFill style={{opacity: intro}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="goldGlow">
            <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.55} />
            <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="cyanGlow">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity={0} />
          </radialGradient>
          <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>

        <g transform={transform}>
          {/* خطوط دخول وخروج باهتة */}
          <line x1={first.x} y1={first.y - 900} x2={first.x} y2={first.y} stroke={`rgba(${COLORS.grid},0.18)`} strokeWidth={2} strokeDasharray="4 10" />
          <line x1={last.x} y1={last.y} x2={last.x} y2={last.y + 900} stroke={`rgba(${COLORS.grid},0.18)`} strokeWidth={2} strokeDasharray="4 10" />

          {/* المقاطع: باهت منقّط للقادم، فيروزي مضيء لما رُسم */}
          {NODES.slice(0, -1).map((_, i) => {
            const p = cam.progress[i];
            const d = segmentPath(i);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={`rgba(${COLORS.grid},0.22)`} strokeWidth={2} strokeDasharray="4 10" />
                <path d={d} fill="none" stroke={COLORS.cyan} strokeWidth={8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.35} filter="url(#blurGlow)" />
                <path d={d} fill="none" stroke={COLORS.cyan} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
                {/* نبضة ضوء تسير على المقطع أثناء الانتقال */}
                {p > 0.02 && p < 0.98 ? (
                  <path d={d} fill="none" stroke={COLORS.goldSoft} strokeWidth={5} pathLength={1} strokeDasharray="0.05 1" strokeDashoffset={0.05 - p} strokeLinecap="round" />
                ) : null}
              </g>
            );
          })}

          {/* العقد */}
          {NODES.map((n, j) => {
            const active = Math.max(0, Math.min(1, arrive(j) - leave(j)));
            const visited = leave(j);
            const reached = arrive(j);
            const side = n.x < 540 ? -1 : 1;
            const labelX = n.x - side * 70;
            return (
              <g key={j}>
                {/* هالة فيروزية للعقد السابقة */}
                <circle cx={n.x} cy={n.y} r={70} fill="url(#cyanGlow)" opacity={visited} />
                {/* توهج ذهبي ونبض للعقدة النشطة */}
                <circle cx={n.x} cy={n.y} r={150 + pulse * 30} fill="url(#goldGlow)" opacity={active} />
                {[0, 1, 2].map((k) => {
                  const t = ((frame + k * 20) % 60) / 60;
                  return (
                    <circle key={k} cx={n.x} cy={n.y} r={28 + t * 70} fill="none" stroke={COLORS.gold} strokeWidth={2} opacity={active * (1 - t) * 0.7} />
                  );
                })}
                {/* الحلقة الخارجية */}
                <circle cx={n.x} cy={n.y} r={26} fill={COLORS.bgBottom} stroke={`rgba(${COLORS.grid},0.45)`} strokeWidth={2} />
                <circle cx={n.x} cy={n.y} r={26} fill="none" stroke={COLORS.cyan} strokeWidth={2.5} opacity={visited} />
                <circle cx={n.x} cy={n.y} r={26 + pulse * 3} fill="none" stroke={COLORS.gold} strokeWidth={3} opacity={active} />
                {/* اللب */}
                <circle cx={n.x} cy={n.y} r={11} fill={`rgba(${COLORS.grid},0.35)`} />
                <circle cx={n.x} cy={n.y} r={11} fill={COLORS.cyan} opacity={visited} />
                <circle cx={n.x} cy={n.y} r={11 + pulse * 2} fill={COLORS.gold} opacity={active} />
                {/* تسميات تقنية بجانب العقدة */}
                <g opacity={interpolate(reached, [0, 1], [0.35, 1])} style={{fontFamily: plex}}>
                  <text x={labelX} y={n.y - 6} fill={active > 0.5 ? COLORS.gold : visited > 0.5 ? COLORS.cyan : COLORS.muted} fontSize={30} fontWeight={500} textAnchor={side < 0 ? 'start' : 'end'}>
                    {String(j + 1).padStart(2, '0')}
                  </text>
                  <text x={labelX} y={n.y + 28} fill={COLORS.muted} fontSize={20} letterSpacing={2} textAnchor={side < 0 ? 'start' : 'end'}>
                    {mmss(SCENES[j].start)}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
