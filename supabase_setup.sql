-- ============================================================
-- تشغيل هذا الملف من Supabase: SQL Editor → New query → الصق ثم Run
-- ============================================================
CREATE SCHEMA IF NOT EXISTS myportfolio;
-- 1) إنشاء جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
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
