import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './Background';
import {Ground} from './Ground';
import {Particles} from './Particles';
import {Character} from './Character';
import {SceneText} from './SceneText';
import {SCENES, FPS} from './scenes';
import audioConfig from './audio-config.json';

export const DuaVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Particles />
      <Ground />
      <Character />
      {SCENES.map((scene) => {
        const from = Math.round(scene.start * FPS);
        const durationInFrames = Math.round(scene.end * FPS) - from;
        return (
          <Sequence key={scene.start} from={from} durationInFrames={durationInFrames} layout="none">
            <SceneText scene={scene} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
      {audioConfig.hasAudio ? <Audio src={staticFile('audio.mp3')} /> : null}
    </AbsoluteFill>
  );
};
