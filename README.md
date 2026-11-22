# فيديو الدعاء — Remotion

فيديو عمودي (1080×1920، 30fps، مدته 61 ثانية) مبني بـ [Remotion](https://www.remotion.dev).

## التشغيل محلياً

```bash
npm install
npm run studio   # معاينة تفاعلية
npm run render   # تصيير final_dua.mp4
```

ملف الصوت `VID_20261122_152316_923.mp3` يجب أن يكون في جذر المستودع؛ يُنسخ تلقائياً إلى `public/audio.mp3` قبل المعاينة أو التصيير. إن لم يوجد يُصيَّر الفيديو بدون صوت مع تنبيه.

## البنية

- `src/scenes.ts` — نصوص المشاهد وتوقيتها بالثواني.
- `src/Background.tsx` — الخلفية البيج وشبكة المربعات.
- `src/Ground.tsx` — الخط الأرضي المتموج وخطوط التظليل.
- `src/Character.tsx` — الشخصية مع حركة التنفس والتمايل.
- `src/SceneText.tsx` — النص العلوي والبطاقة السفلية مع تأثير الظهور.

## GitHub Actions

`.github/workflows/render.yml` يصيّر الفيديو عند كل دفع (push) ويرفع `final_dua.mp4` في قسم Artifacts باسم `final_dua`.
