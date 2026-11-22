import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {COLORS, fontFamily, fallbackFontFamily} from './theme';
import type {Scene} from './scenes';

const FADE_OUT = 12;

// ظهور ناعم: تلاشي + تكبير سلس، مع اختفاء هادئ في نهاية المشهد
const useAppear = (delay: number, durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame - delay;
  const progress = spring({frame: f, fps, config: {damping: 200, mass: 0.9}, durationInFrames: 24});
  const fadeIn = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(frame, [durationInFrames - FADE_OUT, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {
    opacity: fadeIn * fadeOut,
    scale: interpolate(progress, [0, 1], [0.9, 1]),
    translateY: interpolate(progress, [0, 1], [18, 0]),
  };
};

const arabicText: React.CSSProperties = {
  fontFamily: `${fontFamily}, ${fallbackFontFamily}, sans-serif`,
  direction: 'rtl',
  unicodeBidi: 'isolate',
  textAlign: 'center',
  color: COLORS.ink,
  // مسافة سطر واسعة كي يظهر التشكيل بوضوح دون تداخل
  lineHeight: 1.85,
  fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "mark" 1, "mkmk" 1',
  textRendering: 'geometricPrecision',
  WebkitFontSmoothing: 'antialiased',
};

export const SceneText: React.FC<{scene: Scene; durationInFrames: number}> = ({
  scene,
  durationInFrames,
}) => {
  const top = useAppear(0, durationInFrames);
  const card = useAppear(8, durationInFrames);

  return (
    <AbsoluteFill>
      {/* النص العلوي */}
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 70,
          right: 70,
          height: 470,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          dir="rtl"
          lang="ar"
          style={{
            ...arabicText,
            fontSize: 84,
            fontWeight: 800,
            opacity: top.opacity,
            transform: `translateY(${top.translateY}px) scale(${top.scale})`,
          }}
        >
          {scene.top}
        </div>
      </div>

      {/* البطاقة السفلية: حواف دائرية + إطار بني مزدوج */}
      <div
        style={{
          position: 'absolute',
          top: 1420,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'center',
          opacity: card.opacity,
          transform: `translateY(${card.translateY}px) scale(${card.scale})`,
        }}
      >
        <div
          style={{
            width: '100%',
            minHeight: 260,
            backgroundColor: COLORS.card,
            borderRadius: 44,
            border: `10px double ${COLORS.ink}`,
            boxShadow: `0 0 0 4px ${COLORS.card}, 0 0 0 7px ${COLORS.ink}, 0 18px 40px rgba(58,46,37,0.18)`,
            padding: '34px 44px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            dir="rtl"
            lang="ar"
            style={{
              ...arabicText,
              fontSize: 64,
              fontWeight: 700,
            }}
          >
            {scene.card}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
