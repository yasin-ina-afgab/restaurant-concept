import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './Background';
import {Character} from './Character';
import {FADE_IN, FADE_OUT, SceneText} from './SceneText';
import {SCENES, FPS, TOTAL_FRAMES} from './scenes';
import audioConfig from './audio-config.json';

// تداخل قصير جداً عند كل حدّ: القديم يتلاشى بينما يبدأ الجديد بالظهور
const OVERLAP = 2;

export const DuaVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Character />
      {SCENES.map((scene, i) => {
        const isFirst = i === 0;
        const isLast = i === SCENES.length - 1;
        const from = isFirst ? 0 : Math.round(scene.start * FPS) - OVERLAP;
        const to = isLast ? TOTAL_FRAMES : Math.round(scene.end * FPS) + OVERLAP;
        return (
          <Sequence key={scene.start} from={from} durationInFrames={to - from} layout="none">
            <SceneText
              scene={scene}
              durationInFrames={to - from}
              fadeIn={FADE_IN}
              fadeOut={isLast ? 0 : FADE_OUT}
            />
          </Sequence>
        );
      })}
      {audioConfig.hasAudio ? <Audio src={staticFile('audio.mp3')} /> : null}
    </AbsoluteFill>
  );
};
