-- ============================================
-- マイグレーション: 認証をテーブルベースに変更
-- Supabase Dashboard → SQL Editor で実行
-- ============================================

-- ────────────────────────────────────────────
-- 【削除】トリガー + 関数（auth.users 依存）
-- ────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ────────────────────────────────────────────
-- 【削除】旧 RLS ポリシー（authenticated ロール）
-- ────────────────────────────────────────────
DROP POLICY IF EXISTS "authenticated_all" ON clients;
DROP POLICY IF EXISTS "authenticated_all" ON receivables;
DROP POLICY IF EXISTS "authenticated_all" ON products;
DROP POLICY IF EXISTS "authenticated_all" ON deposits;
DROP POLICY IF EXISTS "authenticated_all" ON employees;
DROP POLICY IF EXISTS "authenticated_all" ON salary_items;
DROP POLICY IF EXISTS "authenticated_all" ON salary_history;
DROP POLICY IF EXISTS "authenticated_all" ON invoice_template_items;
DROP POLICY IF EXISTS "authenticated_all" ON company_profile;
DROP POLICY IF EXISTS "authenticated_all" ON accounts;
DROP POLICY IF EXISTS "authenticated_all" ON journal_entries;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- ────────────────────────────────────────────
-- 【削除】旧 profiles テーブル
-- ────────────────────────────────────────────
DROP TABLE IF EXISTS profiles;

-- ────────────────────────────────────────────
-- 【追加】新 profiles テーブル（email + password）
-- ────────────────────────────────────────────
CREATE TABLE profiles (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email        text NOT NULL UNIQUE,
  password     text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────
-- 【追加】RLS ポリシー（anon ロール — 全操作許可）
-- ────────────────────────────────────────────
CREATE POLICY "anon_all" ON clients               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON receivables            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON products               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON deposits               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON employees              FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON salary_items           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON salary_history         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON invoice_template_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON company_profile        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON accounts               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON journal_entries        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON profiles               FOR ALL TO anon USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────
-- 【追加】テスト用アカウント
-- ────────────────────────────────────────────
INSERT INTO profiles (email, password, display_name)
VALUES ('admin@bizflow.jp', 'password123', '管理者');
