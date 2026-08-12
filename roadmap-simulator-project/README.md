# Roadmap Defense Simulator — פריסה לאינטרנט

## מבנה התיקייה
```
roadmap-simulator-project/
  index.html      <- האתר עצמו
  api/
    chat.js       <- פונקציית שרת שמחזיקה את מפתח ה-API בסתר
    fetch-doc.js  <- פונקציית שרת לייבוא קישורי Google Docs/Slides
```

## שלב 1: מפתח API
1. היכנס ל-console.anthropic.com
2. Settings → API Keys → Create Key
3. וודא שיש אמצעי תשלום מחובר (Billing) - גם שימוש קטן דורש כרטיס מחובר
4. העתק את המפתח - תצטרך אותו בשלב 4, אבל **אף פעם אל תדביק אותו בקוד**

## שלב 2: להעלות ל-GitHub
1. צור repository חדש (פרטי או ציבורי, לא משנה - המפתח לא נמצא בקבצים)
2. העלה את שני הקבצים: `index.html` ו-`api/chat.js`

## שלב 3: לחבר ל-Vercel
1. היכנס ל-vercel.com עם חשבון GitHub
2. "Add New" → "Project" → בחר את ה-repository שיצרת
3. השאר את כל הגדרות ה-Build כברירת מחדל (Vercel מזהה לבד את מבנה הקבצים)

## שלב 4: המפתח הסודי
לפני שלוחצים Deploy (או אחרי, ב-Settings → Environment Variables):
- הוסף משתנה סביבה: `ANTHROPIC_API_KEY` = המפתח שהעתקת בשלב 1
- זה המקום היחיד שבו המפתח אמור להיות רשום, אף פעם לא בקוד עצמו

## שלב 5: Deploy
לחץ Deploy. תוך דקה תקבל כתובת כמו `your-project.vercel.app` - זה האתר החי שלך.
רוצה דומיין אישי? Settings → Domains בפרויקט ב-Vercel.

## הערת עלות
כל שיחה בסימולטור עולה כמה סנטים בודדים (טוקנים של Claude). מומלץ להגדיר תקציב חודשי מקסימלי בעמוד ה-Billing ב-console.anthropic.com, כדי שלא תופתע אם האתר יקבל תנועה בלתי צפויה.

## מעדכנים אתר שכבר פרוס
אם כבר עשית Deploy בעבר וקיבלת קבצים מעודכנים (כמו עכשיו) - פשוט תעלה את הקבצים החדשים ל-GitHub repo הקיים (Add file → Upload files, בחר "Replace" אם GitHub שואל), ו-Vercel יבנה ויפרוס גרסה חדשה אוטומטית תוך דקה. אין צורך ליצור פרויקט חדש ב-Vercel או להגדיר שוב את ה-Environment Variable.
