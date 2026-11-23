import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Background} from './Background';
import {Nodes} from './Nodes';
import {Hud} from './Hud';
import {FADE_OUT, SceneText} from './SceneText';
import {SCENES, FPS, TOTAL_FRAMES} from './scenes';
import audioConfig from './audio-config.json';

// تبدأ البطاقة الجديدة بعد أن تقطع الكاميرا جزءاً من الطريق نحو العقدة التالية
const ENTER_DELAY = 12;

export const DuaVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeFromBlack = interpolate(frame, [0, 20], [1, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#05080F'}}>
      <Background />
      <Nodes />
      <Hud />
      {SCENES.map((scene, i) => {
        const isLast = i === SCENES.length - 1;
        const from = Math.round(scene.start * FPS);
        const to = isLast ? TOTAL_FRAMES : Math.round(scene.end * FPS);
        return (
          <Sequence key={scene.start} from={from} durationInFrames={to - from} layout="none">
            <SceneText
              scene={scene}
              index={i}
              durationInFrames={to - from}
              enterDelay={i === 0 ? 10 : ENTER_DELAY}
              fadeOut={isLast ? 0 : FADE_OUT}
            />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeFromBlack}} />
      {audioConfig.hasAudio ? <Audio src={staticFile('audio.mp3')} /> : null}
    </AbsoluteFill>
  );
};
