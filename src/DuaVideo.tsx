import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Background} from './Background';
import {Ground} from './Ground';
import {Particles} from './Particles';
import {Character} from './Character';
import {SceneText} from './SceneText';
import {GraveScene, LightAura, SiratScene} from './Illustrations';
import {SCENES, FPS} from './scenes';
import audioConfig from './audio-config.json';

type Visual = 'grave' | 'sirat' | 'character';

// الخط الزمني للرسومات (بالثواني) مربوط بمعنى النص
const VISUALS: {start: number; end: number; kind: Visual}[] = [
  {start: 0, end: 6.5, kind: 'grave'}, // نورًا في القبر
  {start: 6.5, end: 13, kind: 'sirat'}, // ونورًا على الصراط وحتى الجنة
  {start: 13, end: 36, kind: 'character'},
  {start: 36, end: 51, kind: 'sirat'}, // ليكون لك نورًا حتى تدخل الجنة
  {start: 51, end: 61, kind: 'character'},
];

const FADE = 15;

const visualState = (frame: number, kind: Visual) => {
  for (const v of VISUALS) {
    if (v.kind !== kind) continue;
    const from = Math.round(v.start * FPS);
    const to = Math.round(v.end * FPS);
    if (frame < from - FADE || frame > to + FADE) continue;
    const fadeIn = from === 0 ? 1 : interpolate(frame, [from - FADE / 2, from + FADE / 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const fadeOut = interpolate(frame, [to - FADE / 2, to + FADE / 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const opacity = Math.min(fadeIn, fadeOut);
    if (opacity > 0) return {opacity, localFrame: frame - from, durationInFrames: to - from};
  }
  return {opacity: 0, localFrame: 0, durationInFrames: 1};
};

export const DuaVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const grave = visualState(frame, 'grave');
  const sirat = visualState(frame, 'sirat');
  const character = visualState(frame, 'character');

  return (
    <AbsoluteFill>
      <Background />
      <Particles />
      <LightAura opacity={character.opacity} />
      <Ground />
      <GraveScene opacity={grave.opacity} localFrame={grave.localFrame} />
      <SiratScene opacity={sirat.opacity} localFrame={sirat.localFrame} durationInFrames={sirat.durationInFrames} />
      {character.opacity > 0 ? (
        <AbsoluteFill style={{opacity: character.opacity}}>
          <Character />
        </AbsoluteFill>
      ) : null}
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
