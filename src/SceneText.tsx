import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, amiri, readex} from './theme';
import {SCENES, type Scene} from './scenes';
import {FOCUS} from './camera';

export const FADE_IN = 22;
export const FADE_OUT = 14;

const CARD_BOTTOM = 1190;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// بطاقة زجاجية فوق العقدة النشطة
export const SceneText: React.FC<{
  scene: Scene;
  index: number;
  durationInFrames: number;
  enterDelay: number;
  fadeOut: number;
}> = ({scene, index, durationInFrames, enterDelay, fadeOut}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: frame - enterDelay, fps, durationInFrames: FADE_IN, config: {damping: 200}});
  const enterSub = spring({frame: frame - enterDelay - 6, fps, durationInFrames: FADE_IN, config: {damping: 200}});
  const exit =
    fadeOut === 0
      ? 0
      : interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});

  const opacity = enter * (1 - exit);
  const y = (1 - enter) * 50 - exit * 30;
  const blur = (1 - enter) * 10 + exit * 6;

  // خط واصل من البطاقة إلى العقدة يُرسم تدريجياً
  const connector = spring({frame: frame - enterDelay - 10, fps, durationInFrames: 25, config: {damping: 200}});

  const label = `${String(index + 1).padStart(2, '0')} / ${String(SCENES.length).padStart(2, '0')}`;

  return (
    <AbsoluteFill>
      {/* الخط الواصل */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 1 - exit}}>
        <line
          x1={FOCUS.x}
          y1={CARD_BOTTOM + 4}
          x2={FOCUS.x}
          y2={CARD_BOTTOM + 4 + (FOCUS.y - 40 - CARD_BOTTOM - 4) * connector}
          stroke={COLORS.gold}
          strokeWidth={1.5}
          strokeDasharray="3 6"
          opacity={0.6}
        />
        <circle cx={FOCUS.x} cy={CARD_BOTTOM + 4} r={4} fill={COLORS.gold} opacity={connector} />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: 0,
          height: CARD_BOTTOM,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          opacity,
          transform: `translateY(${y}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '40px 52px 46px',
            borderRadius: 32,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* رأس البطاقة */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              direction: 'rtl',
              fontFamily: readex,
              fontSize: 26,
              fontWeight: 400,
              color: COLORS.gold,
              letterSpacing: 1,
              marginBottom: 18,
            }}
          >
            <span style={{width: 10, height: 10, borderRadius: 5, background: COLORS.gold, boxShadow: `0 0 14px ${COLORS.gold}`}} />
            <span>المحطة</span>
            <span dir="ltr" style={{unicodeBidi: 'isolate', letterSpacing: 3}}>{label}</span>
            <span style={{flex: 1, height: 1, background: 'linear-gradient(270deg, rgba(212,175,55,0.45), rgba(212,175,55,0))'}} />
          </div>

          {/* النص الرئيسي */}
          <div
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: `${amiri}, serif`,
              fontWeight: 700,
              fontSize: 76,
              lineHeight: 1.75,
              color: COLORS.white,
              textAlign: 'center',
              textShadow: '0 0 30px rgba(248,250,252,0.18)',
            }}
          >
            {scene.top}
          </div>

          {/* البطاقة الفرعية المدمجة */}
          <div
            style={{
              marginTop: 26,
              padding: '22px 32px',
              borderRadius: 20,
              background: 'rgba(212,175,55,0.07)',
              border: '1px solid rgba(212,175,55,0.22)',
              opacity: enterSub,
              transform: `translateY(${(1 - enterSub) * 18}px)`,
            }}
          >
            <div
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: `${readex}, ${amiri}, sans-serif`,
                fontWeight: 400,
                fontSize: 46,
                lineHeight: 1.85,
                color: COLORS.goldSoft,
                textAlign: 'center',
              }}
            >
              {scene.card}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
