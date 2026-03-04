-- ============================================
-- BizFlow — Supabase Schema + Seed Data
-- Supabase Dashboard → SQL Editor で実行
-- ============================================

-- 1. clients（取引先）
CREATE TABLE clients (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  abbr text NOT NULL,
  industry text NOT NULL,
  contact text NOT NULL,
  phone text NOT NULL,
  revenue bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  color text NOT NULL DEFAULT '#3b82f6',
  t_no text NOT NULL DEFAULT '',
  invoice_registered boolean NOT NULL DEFAULT false
);

-- 2. receivables（債権）
CREATE TABLE receivables (
  id   text PRIMARY KEY,
  client_id bigint NOT NULL REFERENCES clients(id),
  amount bigint NOT NULL,
  due  date NOT NULL,
  status text NOT NULL DEFAULT 'uncollected',
  t_no text NOT NULL DEFAULT '',
  registered boolean NOT NULL DEFAULT false
);

-- 3. products（商品／在庫）
CREATE TABLE products (
  id   text PRIMARY KEY,
  name text NOT NULL,
  cat  text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  price bigint NOT NULL,
  status text NOT NULL DEFAULT 'ok'
);

-- 4. deposits（入金推移）
CREATE TABLE deposits (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  m    text NOT NULL,
  amt  integer NOT NULL,
  cum  integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- 5. employees（従業員）
CREATE TABLE employees (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  pos  text NOT NULL,
  eid  text NOT NULL UNIQUE
);

-- 6. salary_items（給与明細項目）
CREATE TABLE salary_items (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_id bigint NOT NULL REFERENCES employees(id),
  l    text NOT NULL,
  v    integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- 7. salary_history（給与履歴）
CREATE TABLE salary_history (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_id bigint NOT NULL REFERENCES employees(id),
  m    text NOT NULL,
  v    integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- 8. invoice_template_items（請求書テンプレート品目）
CREATE TABLE invoice_template_items (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  qty  integer NOT NULL DEFAULT 1,
  unit_price bigint NOT NULL,
  tax_rate integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0
);

-- 9. company_profile（自社情報）
CREATE TABLE company_profile (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  t_no text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  tel  text NOT NULL DEFAULT ''
);

-- 10. receivables_with_client（ビュー: 債権 + 取引先名）
CREATE OR REPLACE VIEW receivables_with_client AS
SELECT
  r.id,
  c.name AS client,
  r.amount,
  r.due,
  r.status,
  r.t_no,
  r.registered
FROM receivables r
JOIN clients c ON c.id = r.client_id;

-- ============================================
-- RLS — anon ロールに全操作を許可
-- （認証機能追加時に厳格化する）
-- ============================================
ALTER TABLE clients               ENABLE ROW LEVEL SECURITY;
ALTER TABLE receivables            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits               ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees              ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_history         ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON clients               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON receivables            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON products               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON deposits               FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON employees              FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON salary_items           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON salary_history         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON invoice_template_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON company_profile        FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

-- clients
INSERT INTO clients (id, name, abbr, industry, contact, phone, revenue, status, color, t_no, invoice_registered)
OVERRIDING SYSTEM VALUE VALUES
  (1, '東京テクノロジーズ株式会社', 'TT', 'IT',     '田中太郎', '03-1234-5678',  4800000, 'active',   '#3b82f6', 'T1234567890123', true),
  (2, '大阪マニュファクチャリング', 'OM', '製造',   '佐藤花子', '06-9876-5432', 12500000, 'active',   '#8b5cf6', 'T9876543210987', true),
  (3, '名古屋ロジスティクス合同会社', 'NL', '物流', '鈴木一郎', '052-111-2222',  2300000, 'inactive', '#ef4444', '',               false),
  (4, '福岡デジタルソリューションズ', 'FD', 'IT',   '山田美咲', '092-333-4444',  7600000, 'active',   '#10b981', 'T1111222233334', true),
  (5, '札幌フードサービス株式会社',   'SF', '飲食', '高橋健',   '011-555-6666',  3200000, 'active',   '#f59e0b', '',               false),
  (6, '横浜コンサルティング',         'YC', 'コンサル', '伊藤直美', '045-777-8888', 9100000, 'active', '#ec4899', 'T7777888899990', true);

SELECT setval(pg_get_serial_sequence('clients', 'id'), (SELECT MAX(id) FROM clients));

-- receivables
INSERT INTO receivables (id, client_id, amount, due, status, t_no, registered) VALUES
  ('INV-2026-001', 1, 1200000, '2026-01-31', 'collected',   'T1234567890123', true),
  ('INV-2026-002', 2, 3500000, '2026-02-15', 'uncollected', 'T9876543210987', true),
  ('INV-2026-003', 3,  800000, '2025-12-31', 'overdue',     '',               false),
  ('INV-2026-004', 4, 2200000, '2026-02-28', 'uncollected', 'T1111222233334', true),
  ('INV-2026-005', 5,  960000, '2026-01-15', 'collected',   '',               false),
  ('INV-2026-006', 6, 4100000, '2026-03-15', 'uncollected', 'T7777888899990', true);

-- products
INSERT INTO products (id, name, cat, stock, unit, price, status) VALUES
  ('PRD-001', 'クラウドERP ライセンス',   'SW',   999, '件', 50000,  'ok'),
  ('PRD-002', '業務用ノートPC',           'HW',    12, '台', 180000, 'ok'),
  ('PRD-003', 'セキュリティモジュール',   'SW',     3, '件', 120000, 'low'),
  ('PRD-004', 'オフィスチェア Pro',       '家具',    0, '脚', 85000,  'out'),
  ('PRD-005', '27" 4Kモニター',           'HW',     8, '台', 65000,  'ok'),
  ('PRD-006', 'ワイヤレスヘッドセット',   '周辺',    2, '個', 28000,  'low');

-- deposits
INSERT INTO deposits (m, amt, cum, sort_order) VALUES
  ('8月',  240,  240, 1),
  ('9月',  310,  550, 2),
  ('10月', 180,  730, 3),
  ('11月', 420, 1150, 4),
  ('12月', 290, 1440, 5),
  ('1月',  560, 2000, 6),
  ('2月',  380, 2380, 7);

-- employees
INSERT INTO employees (id, name, pos, eid)
OVERRIDING SYSTEM VALUE VALUES
  (1, '中村 太郎', 'マーケティング部 主任', 'EMP-0042');

SELECT setval(pg_get_serial_sequence('employees', 'id'), (SELECT MAX(id) FROM employees));

-- salary_items
INSERT INTO salary_items (employee_id, l, v, sort_order) VALUES
  (1, '基本給',   320000, 1),
  (1, '残業手当',  45000, 2),
  (1, '通勤手当',  15000, 3),
  (1, '健康保険', -42000, 4),
  (1, '厚生年金', -29000, 5),
  (1, '所得税',   -18000, 6),
  (1, '住民税',   -26000, 7);

-- salary_history
INSERT INTO salary_history (employee_id, m, v, sort_order) VALUES
  (1, '9月',  265, 1),
  (1, '10月', 272, 2),
  (1, '11月', 265, 3),
  (1, '12月', 580, 4),
  (1, '1月',  265, 5),
  (1, '2月',  265, 6);

-- invoice_template_items
INSERT INTO invoice_template_items (name, qty, unit_price, tax_rate, sort_order) VALUES
  ('クラウドERP ライセンス × 3', 3, 50000, 10, 1),
  ('導入サポート費用',           1, 200000, 10, 2),
  ('テイクアウト弁当（会議用）', 10, 1080,   8, 3);

-- company_profile
INSERT INTO company_profile (name, t_no, address, tel) VALUES
  ('株式会社サイバーバズ', 'T2011001050463', '東京都渋谷区桜丘町12-10', '03-5728-4062');
