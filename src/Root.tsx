import React from 'react';
import {Composition} from 'remotion';
import {DuaVideo} from './DuaVideo';
import {FPS, TOTAL_FRAMES, WIDTH, HEIGHT} from './scenes';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DuaVideo"
      component={DuaVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
