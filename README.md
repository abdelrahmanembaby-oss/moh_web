# GriidAi — تشغيل محلي

المشروع يحتوي على الصفحات السبع والكود والصور، بما فيها آخر التعديلات المحلية. لا يحتاج عملية build أو npm install، ولا ينشر أي تغييرات تلقائيًا.

## Windows
1. ثبّت Node.js إذا لم يكن موجودًا على جهازك.
2. فك ضغط الملف بالكامل.
3. افتح START-WINDOWS.bat داخل مجلد griidai-local.
4. افتح http://localhost:3000 في المتصفح، واترك نافذة التشغيل مفتوحة.

## أي نظام مع Node.js
افتح Terminal داخل مجلد griidai-local وشغّل:

```sh
npm start
```

ثم افتح http://localhost:3000. لإيقاف الموقع اضغط Ctrl+C.

## بديل باستخدام Python
إذا كان Python 3 متوفرًا:

```sh
python -m http.server 3000 --bind 127.0.0.1 --directory dist
```

## التعديل
- الرئيسية: dist/index.html
- الصفحات: dist/about/، dist/platform/، dist/solutions/، dist/agentic-geoai/، dist/spatial-analysis/، dist/pricing/
- التنسيق والتفاعلات: ملفات CSS وJS في dist/
- الصور: dist/assets/

احفظ التعديل ثم حدّث المتصفح. افتح الموقع عبر localhost وليس بالنقر على index.html لأن بعض الروابط تبدأ من جذر الموقع.

فيديو YouTube والروابط الخارجية تحتاج اتصال إنترنت. الصور والكود موجودة داخل المشروع. هذه نسخة موقع التعريف، وليست كود تطبيق GriidAi للتحليل الجغرافي.

النسخة المستضافة لم تتغير ولم يتم إيقافها ضمن هذا التسليم.

## GitHub Pages

Live website: https://abdelrahmanembaby-oss.github.io/moh_web/

Pushing to `main` builds and deploys `dist/` through `.github/workflows/pages.yml`. The build adjusts internal links, images, fonts, and pricing data requests for the repository path. Local files keep working at http://localhost:3000.

To prepare the Pages artifact locally:

```sh
npm run build:pages
```

The generated `.deploy/` folder and local QA files are excluded from Git.
