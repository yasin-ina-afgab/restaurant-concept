import {spring} from 'remotion';
import {FPS, SCENES} from './scenes';

// إحداثيات العقد الست في "العالم" (مسار متعرّج نازل)
export const NODE_SPACING = 560;
export const NODES = SCENES.map((_, i) => ({
  x: 540 + (i % 2 === 0 ? -210 : 210),
  y: i * NODE_SPACING,
}));

// موضع العقدة النشطة على الشاشة
export const FOCUS = {x: 540, y: 1330};

export const BOUNDARIES = SCENES.slice(1).map((s) => Math.round(s.start * FPS));

const MOVE_FRAMES = 40;

// تقدّم الانتقال من العقدة k إلى k+1 (0..1)
export const transitionProgress = (frame: number, k: number) =>
  spring({
    frame: frame - BOUNDARIES[k],
    fps: FPS,
    durationInFrames: MOVE_FRAMES,
    config: {damping: 200},
  });

export const getCamera = (frame: number) => {
  let x = NODES[0].x;
  let y = NODES[0].y;
  let zoomOut = 0;
  const progress: number[] = [];
  BOUNDARIES.forEach((_, k) => {
    const p = transitionProgress(frame, k);
    progress.push(p);
    x += (NODES[k + 1].x - NODES[k].x) * p;
    y += (NODES[k + 1].y - NODES[k].y) * p;
    zoomOut += Math.sin(Math.PI * p);
  });
  // تصغير خفيف أثناء الانتقال ثم عودة، مع "تنفس" بطيء جداً للكاميرا
  const scale = 1 - 0.12 * zoomOut + Math.sin(frame / 90) * 0.01;
  return {x, y, scale, progress};
};

export const activeSceneIndex = (frame: number) => {
  let idx = 0;
  BOUNDARIES.forEach((b, k) => {
    if (frame >= b) idx = k + 1;
  });
  return idx;
};
