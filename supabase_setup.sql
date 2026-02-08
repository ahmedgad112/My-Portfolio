-- ============================================================
-- تشغيل هذا الملف من Supabase: SQL Editor → New query → الصق ثم Run
-- ============================================================
-- الأعمدة: الاسم، البريد، رقم الهاتف (اختياري)، الرسالة.

-- 1) إنشاء جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone integer NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2) تفعيل حماية الصفوف (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3) السماح لأي زائر بإرسال رسالة (INSERT)
DROP POLICY IF EXISTS "Allow insert for everyone" ON public.contact_messages;
CREATE POLICY "Allow insert for everyone"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

-- 4) السماح فقط للمسجّل دخوله بقراءة الرسائل (SELECT)
DROP POLICY IF EXISTS "Allow read for authenticated" ON public.contact_messages;
CREATE POLICY "Allow read for authenticated"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- 4b) السماح للمسجّل دخوله بحذف الرسائل (DELETE)
DROP POLICY IF EXISTS "Allow authenticated delete messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated delete messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- -----------------------------------------------
-- إذا الجدول موجود مسبقاً وبدون عمود phone، شغّل مرة واحدة فقط:
-- ALTER TABLE public.contact_messages ADD COLUMN phone text;
-- -----------------------------------------------

-- ========== جدول الزوار (لتعريف الزائر قبل التواصل) ==========
CREATE TABLE IF NOT EXISTS public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone integer UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert visitors" ON public.visitors;
CREATE POLICY "Allow insert visitors" ON public.visitors FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow authenticated read visitors" ON public.visitors;
CREATE POLICY "Allow authenticated read visitors" ON public.visitors FOR SELECT TO authenticated USING (true);

-- دالة للتحقق إن الزائر مسجّل بنفس البريد أو رقم الهاتف (يستدعيها الزائر من الموقع)
CREATE OR REPLACE FUNCTION public.get_visitor_by_email_or_phone(e text, p text)
RETURNS TABLE(id uuid, name text, email text, phone text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT v.id, v.name, v.email, COALESCE(v.phone::text, '') AS phone
  FROM public.visitors v
  WHERE v.email = e OR (p IS NOT NULL AND p != '' AND COALESCE(v.phone::text, '') = p)
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_visitor_by_email_or_phone(text, text) TO anon;

-- ربط الرسائل بالزائر (يُضاف العمود فقط إن لم يكن موجوداً)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'contact_messages' AND column_name = 'visitor_id'
  ) THEN
    ALTER TABLE public.contact_messages ADD COLUMN visitor_id uuid REFERENCES public.visitors(id);
  END IF;
END $$;

-- ========== جدول أعمال البورتفوليو (My Works) ==========
-- 5) إنشاء جدول الأعمال
CREATE TABLE IF NOT EXISTS public.works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  project_link text,
  created_at timestamptz DEFAULT now()
);

-- 6) تفعيل RLS على works
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- 7) الجميع يقرأ الأعمال (الزوار يشوفونها في الموقع)
DROP POLICY IF EXISTS "Allow public read works" ON public.works;
CREATE POLICY "Allow public read works"
  ON public.works
  FOR SELECT
  USING (true);

-- 8) فقط المسجّل دخوله يضيف/يعدّل/يحذف
DROP POLICY IF EXISTS "Allow authenticated insert works" ON public.works;
CREATE POLICY "Allow authenticated insert works"
  ON public.works
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update works" ON public.works;
CREATE POLICY "Allow authenticated update works"
  ON public.works
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete works" ON public.works;
CREATE POLICY "Allow authenticated delete works"
  ON public.works
  FOR DELETE
  TO authenticated
  USING (true);
