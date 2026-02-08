# إعداد صفحة استلام رسائل التواصل

حتى تعمل صفحة **رسائل التواصل** (`messages.html`) ويُحفظ فيها ما يرسله الزوار، اتبع الخطوات التالية (كلها من لوحة Supabase).

---

## 1. إنشاء مشروع Supabase

1. ادخل إلى **[supabase.com](https://supabase.com)** وسجّل دخولك (أو أنشئ حساباً).
2. اضغط **New Project**.
3. اختر اسم المشروع وكلمة مرور قاعدة البيانات، ثم **Create new project**.
4. بعد إنشاء المشروع، من القائمة الجانبية: **Settings** (أيقونة الترس) → **API**.
5. انسخ:
   - **Project URL** (مثل: `https://xxxxx.supabase.co`)
   - **anon public** (المفتاح الطويل تحت "Project API keys").

6. افتح ملف **`config.js`** في المشروع وضَع القيم مكان النص المؤقت:
   - ضع **Project URL** مكان `'YOUR_SUPABASE_URL'`
   - ضع **anon public** مكان `'YOUR_ANON_KEY'`

مثال بعد التعديل:
```js
window.SUPABASE_URL = 'https://abcdefghijk.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...';
```

---

## 2. إنشاء الجدول والصلاحيات (طريقة سريعة)

1. في Supabase من القائمة: **SQL Editor**.
2. اضغط **New query**.
3. افتح الملف **`supabase_setup.sql`** من مشروعك، انسخ كل محتواه والصقه في المحرر.
4. اضغط **Run** (أو Ctrl+Enter).

بهذا يتم إنشاء جدول `contact_messages` وتفعيل الصلاحيات بحيث:
- الزوار يمكنهم إرسال رسائل فقط (INSERT).
- فقط من يسجّل دخوله (أنت) يمكنه قراءة الرسائل (SELECT).

---

## 3. إنشاء حساب الدخول (أنت فقط تشوف الرسائل)

1. من القائمة: **Authentication** → **Users**.
2. اضغط **Add user** → **Create new user**.
3. أدخل:
   - **Email:** بريدك الإلكتروني (الذي ستستخدمه لفتح صفحة الرسائل).
   - **Password:** كلمة مرور قوية.
4. اضغط **Create user**.

هذا الحساب هو الوحيد الذي يفتح **messages.html** ويشوف الرسائل. لا تشارك هذا البريد وكلمة المرور مع أحد.

---

## 4. التجربة

1. تأكد أن **`config.js`** يحتوي على الـ URL والـ anon key الصحيحين.
2. افتح موقعك ثم املأ نموذج **Contact** وأرسل رسالة تجريبية.
3. افتح **messages.html** في المتصفح.
4. سجّل الدخول بالبريد وكلمة المرور التي أنشأتها في الخطوة 3.
5. يفترض أن تظهر الرسالة التجريبية في القائمة.

---

## روابط سريعة

| الصفحة | الاستخدام |
|--------|-----------|
| **messages.html** | أنت فقط — لاستعراض الرسائل (لا تشارك الرابط). |
| **index.html / index_ar.html** | للزوار — نموذج التواصل يرسل ويُحفظ تلقائياً. |

إذا واجهت خطأ (مثل "relation contact_messages does not exist" أو "new row violates row-level security") تأكد أنك شغّلت **supabase_setup.sql** كاملاً في SQL Editor.
