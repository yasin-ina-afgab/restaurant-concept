export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_SECONDS = 61;
export const TOTAL_FRAMES = DURATION_SECONDS * FPS; // 1830

export type Scene = {
  start: number; // بالثواني
  end: number; // بالثواني
  top: string;
  card: string;
};

export const SCENES: Scene[] = [
  {
    start: 0,
    end: 13,
    top: 'دعاءٌ يكون لك نورًا في القبر',
    card: 'ونورًا على الصراط وحتى الجنة',
  },
  {
    start: 13,
    end: 19,
    top: 'عن ابن عمر مرفوعًا إلى النبي ﷺ',
    card: 'أن من قال:',
  },
  {
    start: 19,
    end: 28,
    top: 'اللَّهُ أَكْبَرُ كَبِيرًا عَدَدَ الشَّفْعِ وَالْوَتْرِ',
    card: 'وَكَلِمَاتِ اللَّهِ التَّامَّاتِ الطَّيِّبَاتِ الْمُبَارَكَاتِ',
  },
  {
    start: 28,
    end: 36,
    top: 'لَا إِلَهَ إِلَّا اللَّهُ عَدَدَ الشَّفْعِ وَالْوَتْرِ',
    card: 'وَكَلِمَاتِ اللَّهِ التَّامَّاتِ الطَّيِّبَاتِ الْمُبَارَكَاتِ',
  },
  {
    start: 36,
    end: 51,
    top: 'حافظ عليه بعد الصلوات وعند النوم',
    card: 'ليكون لك نورًا حتى تدخل الجنة',
  },
  {
    start: 51,
    end: 61,
    top: 'أسأل الله لمن نشره الجنة',
    card: 'وصلى الله وسلم على نبينا محمد ﷺ',
  },
];
