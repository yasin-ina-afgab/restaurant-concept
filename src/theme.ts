import {loadFont} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';

export const {fontFamily} = loadFont('normal', {
  weights: ['600', '700'],
  subsets: ['arabic'],
});

// خط احتياطي لرمز ﷺ (غير موجود في IBM Plex Sans Arabic)
export const {fontFamily: fallbackFontFamily} = loadAmiri('normal', {
  weights: ['700'],
  subsets: ['arabic'],
});

export const COLORS = {
  background: '#EDE6D6',
  grid: '#3A2E25',
  ink: '#3A2E25',
  card: '#F5DFB0',
  robe: '#FFFFFF',
  robeShade: '#E9E3D7',
  shemagh: '#FFFFFF',
  shemaghShade: '#E2DACB',
  agal: '#3A2E25',
  skin: '#D8B48E',
};

export const GROUND_Y = 1660;
