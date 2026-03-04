-- ============================================
-- Part 3: RLS ポリシー（anon）+ シードデータ
-- ============================================

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

-- テスト用アカウント
INSERT INTO profiles (email, password, display_name)
VALUES ('admin@bizflow.jp', 'password123', '管理者');
