import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, fallbackFontFamily, fontFamily} from './theme';
import type {Scene} from './scenes';

export const FADE_IN = 18; // إطارات ظهور المشهد
export const FADE_OUT = 16; // إطارات اختفاء المشهد

const ease = Easing.bezier(0.45, 0, 0.25, 1);

const arabic: React.CSSProperties = {
  fontFamily: `${fontFamily}, ${fallbackFontFamily}, sans-serif`,
  direction: 'rtl',
  unicodeBidi: 'isolate',
  textAlign: 'center',
  color: COLORS.ink,
  lineHeight: 1.75, // مساحة كافية للتشكيل
  fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "mark" 1, "mkmk" 1',
};

// النص الرئيسي ثم البطاقة مباشرة تحته في الثلث العلوي
// fadeIn / fadeOut بالإطارات: 0 للمشهد الأول (يظهر فوراً) أو الأخير
export const SceneText: React.FC<{
  scene: Scene;
  durationInFrames: number;
  fadeIn: number;
  fadeOut: number;
}> = ({scene, durationInFrames, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame();

  const inP = fadeIn === 0 ? 1 : interpolate(frame, [0, fadeIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const outP =
    fadeOut === 0
      ? 0
      : interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: ease,
        });

  const opacity = inP * (1 - outP);
  // حركة خفيفة للأعلى: يدخل من الأسفل ويخرج للأعلى
  const y = (1 - inP) * 28 - outP * 28;
  const cardDelay = fadeIn === 0 ? 1 : interpolate(frame, [4, fadeIn + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const cardY = (1 - cardDelay) * 20;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 80,
          right: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 44,
          opacity,
          transform: `translateY(${y}px)`,
        }}
      >
        <div dir="rtl" lang="ar" style={{...arabic, fontSize: 72, fontWeight: 700}}>
          {scene.top}
        </div>
        <div
          style={{
            opacity: cardDelay,
            transform: `translateY(${cardY}px)`,
            backgroundColor: COLORS.card,
            borderRadius: 36,
            border: `9px double ${COLORS.ink}`,
            padding: '26px 52px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div dir="rtl" lang="ar" style={{...arabic, fontSize: 54, fontWeight: 600}}>
            {scene.card}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
