-- ============================================
-- Part 1: 旧オブジェクトの削除
-- ============================================

-- トリガー + 関数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 旧 RLS ポリシー
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

-- 旧 profiles テーブル
DROP TABLE IF EXISTS profiles;
