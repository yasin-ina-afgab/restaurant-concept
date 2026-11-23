import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadReadex} from '@remotion/google-fonts/ReadexPro';

// Amiri للنص الرئيسي (تشكيل واضح ويحتوي رمز ﷺ)
export const {fontFamily: amiri} = loadAmiri('normal', {
  weights: ['400', '700'],
  subsets: ['arabic'],
});

// Readex Pro للنص الفرعي والتسميات
export const {fontFamily: readex} = loadReadex('normal', {
  weights: ['300', '400', '500'],
  subsets: ['arabic', 'latin'],
});

export const COLORS = {
  bgTop: '#0B101B',
  bgBottom: '#05080F',
  gold: '#D4AF37',
  goldSoft: '#FDE68A',
  cyan: '#38BDF8',
  white: '#F8FAFC',
  muted: '#64748B',
  grid: '148, 163, 184', // RGB لاستخدامه مع الشفافية
};
