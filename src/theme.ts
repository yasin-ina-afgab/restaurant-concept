import {loadFont} from '@remotion/google-fonts/Cairo';
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';

export const {fontFamily} = loadFont('normal', {
  weights: ['600', '700', '800'],
  subsets: ['arabic'],
});

// خط احتياطي لرمز ﷺ (غير موجود في Cairo)
export const {fontFamily: fallbackFontFamily} = loadAmiri('normal', {
  weights: ['700'],
  subsets: ['arabic'],
});

export const COLORS = {
  background: '#EDE6D6',
  grid: '#B9A98C',
  ink: '#3A2E25',
  card: '#F5DFB0',
  robe: '#FFFFFF',
  robeShade: '#E4DED2',
  headCover: '#7A5236',
  headCoverDark: '#5E3E28',
  skin: '#D9A97F',
};
