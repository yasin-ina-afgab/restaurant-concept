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

تصميم مسطح بسيط (Clean Flat Minimalist):

- `src/scenes.ts`: نصوص المشاهد وتوقيتها بالثواني.
- `src/theme.ts`: الألوان والخطوط (IBM Plex Sans Arabic، مع Amiri احتياطياً لرمز ﷺ).
- `src/Background.tsx`: الخلفية البيج والشبكة الباهتة والخط الأرضي.
- `src/Character.tsx`: أيقونة الشخصية المسطحة مع تنفس هادئ.
- `src/SceneText.tsx`: النص الرئيسي والبطاقة تحته مباشرة في الثلث العلوي، مع انتقال ناعم للأعلى.

## GitHub Actions

`.github/workflows/render.yml` يصيّر الفيديو عند كل دفع (push) ويرفع `final_dua.mp4` في قسم Artifacts باسم `final_dua`.
