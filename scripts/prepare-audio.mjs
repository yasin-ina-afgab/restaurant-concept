// ينسخ ملف الصوت من جذر المستودع إلى public/ ليقرأه Remotion عبر staticFile
import {existsSync, copyFileSync, writeFileSync, mkdirSync} from 'node:fs';

const SOURCE = 'VID_20261122_152316_923.mp3';
const TARGET = 'public/audio.mp3';

mkdirSync('public', {recursive: true});
const hasAudio = existsSync(SOURCE);
if (hasAudio) {
  copyFileSync(SOURCE, TARGET);
  console.log(`✔ تم نسخ ${SOURCE} إلى ${TARGET}`);
} else {
  console.warn(`⚠ لم يُعثر على ${SOURCE} في الجذر — سيُصيَّر الفيديو بدون صوت.`);
}
writeFileSync('src/audio-config.json', JSON.stringify({hasAudio}, null, 2) + '\n');
