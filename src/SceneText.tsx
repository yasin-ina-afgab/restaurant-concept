import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {COLORS, fontFamily, fallbackFontFamily} from './theme';
import type {Scene} from './scenes';

const ENTER_FRAMES = 15; // الدخول في أول 15 إطاراً من المشهد
const EXIT_FRAMES = 10; // الخروج في آخر 10 إطارات

// دخول بـ spring من الأسفل للأعلى مع تلاشٍ، وخروج ناعم في نهاية المشهد
const useEnterExit = (delay: number, durationInFrames: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    durationInFrames: ENTER_FRAMES - delay,
    config: {damping: 14, stiffness: 120, mass: 0.8},
  });
  const enterOpacity = interpolate(frame, [delay, ENTER_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const exitStart = durationInFrames - EXIT_FRAMES;
  const exit = interpolate(frame, [exitStart, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return {
    opacity: enterOpacity * (1 - exit),
    translateY: interpolate(enter, [0, 1], [160, 0]) - exit * 70,
    scale: interpolate(enter, [0, 1], [0.85, 1]) - exit * 0.08,
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
  const frame = useCurrentFrame();
  const top = useEnterExit(0, durationInFrames);
  const card = useEnterExit(4, durationInFrames);
  // نبض خفيف جداً للبطاقة أثناء ظهورها
  const cardFloat = Math.sin(frame / 22) * 9;

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
          transform: `translateY(${card.translateY + cardFloat}px) scale(${card.scale})`,
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
          <div dir="rtl" lang="ar" style={{...arabicText, fontSize: 64, fontWeight: 700}}>
            {scene.card}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
