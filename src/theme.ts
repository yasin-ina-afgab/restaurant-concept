import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSansArabic';

// Amiri للنص الرئيسي (تشكيل واضح ويحتوي رمز ﷺ)
export const {fontFamily: amiri} = loadAmiri('normal', {
  weights: ['400', '700'],
  subsets: ['arabic'],
});

// IBM Plex Sans Arabic للنص الفرعي والإهداء والتسميات
export const {fontFamily: plex} = loadPlex('normal', {
  weights: ['300', '400', '500'],
  subsets: ['arabic', 'latin'],
});

export const COLORS = {
  bgTop: '#0B101B',
  bgBottom: '#05080F',
  gold: '#D4AF37',
  goldSoft: '#FDE68A',
  dedication: '#E5D3B3',
  cyan: '#38BDF8',
  white: '#F8FAFC',
  muted: '#64748B',
  grid: '148, 163, 184', // RGB لاستخدامه مع الشفافية
};
