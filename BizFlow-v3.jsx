import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { Search, Plus, Building2, CreditCard, Package, TrendingUp, User, Bell, Settings, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2, Clock, LayoutDashboard, ChevronRight, ChevronDown, Filter, Eye, EyeOff, Zap, Boxes, Wallet, Receipt, UserCircle, Home, X, ArrowRight, Hash, FileText, Printer, ToggleLeft, ToggleRight, ShieldCheck, ShieldX, Percent, BadgeCheck, CircleSlash, Download, Copy, Trash2 } from "lucide-react";

/* ════════════════════════════════════════
   DESIGN SYSTEM — "Sage Paper"
   白ベース・競合差別化（青系回避・セージグリーン）
   ════════════════════════════════════════ */
const C = {
  bg: "#faf9f7", bgCard: "#ffffff",
  bgGlass: "#ffffff", bgGlassHover: "#f8f7f8",
  bgGlassBright: "#f5f5f5",
  bgAccentSoft: "rgba(45,122,95,0.08)", bgAccentMed: "rgba(45,122,95,0.14)",
  border: "rgba(0,0,0,0.06)", borderHover: "rgba(0,0,0,0.1)",
  borderAccent: "rgba(45,122,95,0.35)",
  text: "#1a1a1a", textSub: "#5c5c6d", textMuted: "#8a8a99",
  accent: "#2d7a5f", accentLight: "#3d9a77", accentDim: "#1f5c47",
  success: "#059669", successBg: "rgba(5,150,105,0.1)",
  warning: "#d97706", warningBg: "rgba(217,119,6,0.1)",
  error: "#dc2626", errorBg: "rgba(220,38,38,0.1)",
  info: "#0284c7", infoBg: "rgba(2,132,199,0.1)",
};

/* ─── DATA ─── */
const clientsData = [
  { id: 1, name: "東京テクノロジーズ株式会社", abbr: "TT", industry: "IT", contact: "田中太郎", phone: "03-1234-5678", revenue: 4800000, status: "active", color: "#3b82f6", tNo: "T1234567890123", invoiceRegistered: true },
  { id: 2, name: "大阪マニュファクチャリング", abbr: "OM", industry: "製造", contact: "佐藤花子", phone: "06-9876-5432", revenue: 12500000, status: "active", color: "#8b5cf6", tNo: "T9876543210987", invoiceRegistered: true },
  { id: 3, name: "名古屋ロジスティクス合同会社", abbr: "NL", industry: "物流", contact: "鈴木一郎", phone: "052-111-2222", revenue: 2300000, status: "inactive", color: "#ef4444", tNo: "", invoiceRegistered: false },
  { id: 4, name: "福岡デジタルソリューションズ", abbr: "FD", industry: "IT", contact: "山田美咲", phone: "092-333-4444", revenue: 7600000, status: "active", color: "#10b981", tNo: "T1111222233334", invoiceRegistered: true },
  { id: 5, name: "札幌フードサービス株式会社", abbr: "SF", industry: "飲食", contact: "高橋健", phone: "011-555-6666", revenue: 3200000, status: "active", color: "#f59e0b", tNo: "", invoiceRegistered: false },
  { id: 6, name: "横浜コンサルティング", abbr: "YC", industry: "コンサル", contact: "伊藤直美", phone: "045-777-8888", revenue: 9100000, status: "active", color: "#ec4899", tNo: "T7777888899990", invoiceRegistered: true },
];

const receivables = [
  { id: "INV-2026-001", client: "東京テクノロジーズ株式会社", amount: 1200000, due: "2026-01-31", status: "collected", tNo: "T1234567890123", registered: true },
  { id: "INV-2026-002", client: "大阪マニュファクチャリング", amount: 3500000, due: "2026-02-15", status: "uncollected", tNo: "T9876543210987", registered: true },
  { id: "INV-2026-003", client: "名古屋ロジスティクス合同会社", amount: 800000, due: "2025-12-31", status: "overdue", tNo: "", registered: false },
  { id: "INV-2026-004", client: "福岡デジタルソリューションズ", amount: 2200000, due: "2026-02-28", status: "uncollected", tNo: "T1111222233334", registered: true },
  { id: "INV-2026-005", client: "札幌フードサービス株式会社", amount: 960000, due: "2026-01-15", status: "collected", tNo: "", registered: false },
  { id: "INV-2026-006", client: "横浜コンサルティング", amount: 4100000, due: "2026-03-15", status: "uncollected", tNo: "T7777888899990", registered: true },
];

const products = [
  { id: "PRD-001", name: "クラウドERP ライセンス", cat: "SW", stock: 999, unit: "件", price: 50000, status: "ok" },
  { id: "PRD-002", name: "業務用ノートPC", cat: "HW", stock: 12, unit: "台", price: 180000, status: "ok" },
  { id: "PRD-003", name: "セキュリティモジュール", cat: "SW", stock: 3, unit: "件", price: 120000, status: "low" },
  { id: "PRD-004", name: "オフィスチェア Pro", cat: "家具", stock: 0, unit: "脚", price: 85000, status: "out" },
  { id: "PRD-005", name: '27" 4Kモニター', cat: "HW", stock: 8, unit: "台", price: 65000, status: "ok" },
  { id: "PRD-006", name: "ワイヤレスヘッドセット", cat: "周辺", stock: 2, unit: "個", price: 28000, status: "low" },
];

const depositData = [
  { m: "8月", amt: 240, cum: 240 }, { m: "9月", amt: 310, cum: 550 },
  { m: "10月", amt: 180, cum: 730 }, { m: "11月", amt: 420, cum: 1150 },
  { m: "12月", amt: 290, cum: 1440 }, { m: "1月", amt: 560, cum: 2000 },
  { m: "2月", amt: 380, cum: 2380 },
];

const salary = {
  name: "中村 太郎", pos: "マーケティング部 主任", eid: "EMP-0042",
  items: [
    { l: "基本給", v: 320000 }, { l: "残業手当", v: 45000 }, { l: "通勤手当", v: 15000 },
    { l: "健康保険", v: -42000 }, { l: "厚生年金", v: -29000 }, { l: "所得税", v: -18000 }, { l: "住民税", v: -26000 },
  ],
  history: [
    { m: "9月", v: 265 }, { m: "10月", v: 272 }, { m: "11月", v: 265 },
    { m: "12月", v: 580 }, { m: "1月", v: 265 }, { m: "2月", v: 265 },
  ],
};

const fmt = n => "¥" + Math.abs(n).toLocaleString();
const statusMap = {
  collected: { bg: C.successBg, c: C.success, l: "入金済", icon: CheckCircle2 },
  uncollected: { bg: C.warningBg, c: C.warning, l: "未回収", icon: Clock },
  overdue: { bg: C.errorBg, c: C.error, l: "延滞", icon: AlertCircle },
};
const stockMap = {
  ok: { bg: C.successBg, c: C.success, l: "在庫あり" },
  low: { bg: C.warningBg, c: C.warning, l: "残少" },
  out: { bg: C.errorBg, c: C.error, l: "在庫切れ" },
};

/* ════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════ */
const Glass = ({ children, style = {}, hover = true, delay = 0, onClick, ...props }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)} onMouseLeave={() => hover && setH(false)}
      style={{
        background: h ? C.bgGlassHover : C.bgGlass,
        border: `1px solid ${h ? C.borderHover : C.border}`,
        borderRadius: 16, boxShadow: h ? "0 8px 24px rgba(0,0,0,0.08)" : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: h ? "translateY(-2px)" : "none",
        animation: `revealUp 0.55s ${delay}s both cubic-bezier(0.16,1,0.3,1)`,
        ...style,
      }} {...props}>{children}</div>
  );
};

const Tag = ({ bg, c, label, icon: Icon }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    background: bg, color: c, padding: "4px 10px", borderRadius: 20,
    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.03em", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap",
  }}>{Icon && <Icon size={11} />}{label}</span>
);

const Metric = ({ label, value, sub, trend, icon: Icon, size = "md", delay = 0 }) => (
  <Glass delay={delay} style={{ padding: size === "lg" ? "28px 30px" : "18px 20px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: size === "lg" ? 16 : 10 }}>
        {Icon && <div style={{ background: C.bgAccentSoft, borderRadius: 8, padding: 5, display: "flex" }}><Icon size={13} color={C.accent} strokeWidth={2.5} /></div>}
        <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{label}</span>
      </div>
      <div style={{ fontSize: size === "lg" ? 36 : 26, fontWeight: 200, color: C.text, letterSpacing: "-0.03em", fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textSub, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
        {trend === "up" && <ArrowUpRight size={12} color={C.success} />}
        {trend === "down" && <ArrowDownRight size={12} color={C.error} />}
        <span style={{ color: trend === "up" ? C.success : trend === "down" ? C.error : C.textSub }}>{sub}</span>
      </div>}
    </div>
    <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}08 0%, transparent 70%)` }} />
  </Glass>
);

const ChartTip = ({ active, payload, label, unit = "万" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 13px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
      <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{label}</div>
      <div style={{ fontSize: 14, color: C.text, fontWeight: 500, fontFamily: "'Syne', sans-serif", marginTop: 2 }}>
        ¥{unit === "万" ? (payload[0].value * 10000).toLocaleString() : payload[0].value.toLocaleString()}
      </div>
    </div>
  );
};

const SectionHeader = ({ process, title }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ fontSize: 10, fontWeight: 600, color: C.accent, letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace" }}>{process}</div>
    <h2 style={{ fontSize: 28, fontWeight: 200, color: C.text, fontFamily: "'Syne', sans-serif", marginTop: 4, letterSpacing: "-0.02em" }}>{title}</h2>
  </div>
);

const PillFilter = ({ items, active, onChange }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    {items.map(f => (
      <button key={f.k} onClick={() => onChange(f.k)} style={{
        padding: "7px 16px", borderRadius: 20,
        border: `1px solid ${active === f.k ? C.borderAccent : C.border}`,
        background: active === f.k ? C.bgAccentSoft : "transparent",
        color: active === f.k ? C.accent : C.textSub,
        fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.25s",
      }}>{f.l}</button>
    ))}
  </div>
);

const InvoiceBadge = ({ registered }) => (
  <Tag
    bg={registered ? C.successBg : C.errorBg}
    c={registered ? C.success : C.error}
    label={registered ? "適格事業者" : "免税事業者"}
    icon={registered ? ShieldCheck : ShieldX}
  />
);

/* ════════════════════════════════════════
   PAGE: DASHBOARD
   ════════════════════════════════════════ */
const DashboardPage = () => {
  const uncollected = receivables.filter(r => r.status !== "collected");
  const lowStock = products.filter(p => p.status !== "ok");
  const regCount = clientsData.filter(c => c.invoiceRegistered).length;
  const unregCount = clientsData.filter(c => !c.invoiceRegistered).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 14 }}>
        <Glass delay={0} style={{ padding: "30px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>累計入金</div>
            <div style={{ fontSize: 52, fontWeight: 200, color: C.text, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.04em", lineHeight: 1.1, marginTop: 12 }}>
              ¥23.8<span style={{ fontSize: 22, color: C.textSub, fontWeight: 300 }}>M</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, background: C.successBg, padding: "3px 8px", borderRadius: 6 }}>
                <ArrowUpRight size={11} color={C.success} /><span style={{ fontSize: 11, color: C.success, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>+16%</span>
              </div>
              <span style={{ fontSize: 11, color: C.textMuted }}>前月比</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "70%", opacity: 0.5 }}>
            <ResponsiveContainer><AreaChart data={depositData}>
              <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={C.accent} stopOpacity={0} /></linearGradient></defs>
              <Area type="monotone" dataKey="cum" stroke={C.accent} strokeWidth={2} fill="url(#hg)" dot={false} />
            </AreaChart></ResponsiveContainer>
          </div>
        </Glass>
        <Metric icon={CreditCard} label="未回収額" value="¥10.6M" sub="4件の未回収" trend="down" delay={0.06} />
        <Metric icon={Boxes} label="在庫アラート" value={`${lowStock.length}品目`} sub="要補充" delay={0.12} />
      </div>

      {/* Invoice Compliance Banner */}
      <Glass delay={0.15} style={{
        padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.bgAccentSoft, borderColor: C.borderAccent,
      }} hover={false}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bgAccentMed, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} color={C.accent} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>インボイス制度対応状況</div>
            <div style={{ fontSize: 11.5, color: C.textSub, marginTop: 2 }}>
              適格事業者 <span style={{ color: C.success, fontWeight: 600 }}>{regCount}社</span> ／ 
              免税事業者 <span style={{ color: C.error, fontWeight: 600 }}>{unregCount}社</span> ／ 
              T番号未登録の取引があります
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ textAlign: "center", padding: "6px 16px", background: C.successBg, borderRadius: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 300, color: C.success, fontFamily: "'Syne', sans-serif" }}>{regCount}</div>
            <div style={{ fontSize: 9, color: C.success, fontFamily: "'DM Mono', monospace" }}>適格</div>
          </div>
          <div style={{ textAlign: "center", padding: "6px 16px", background: C.errorBg, borderRadius: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 300, color: C.error, fontFamily: "'Syne', sans-serif" }}>{unregCount}</div>
            <div style={{ fontSize: 9, color: C.error, fontFamily: "'DM Mono', monospace" }}>免税</div>
          </div>
        </div>
      </Glass>

      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 14 }}>
        <Glass delay={0.2} style={{ padding: "24px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>入金推移</span>
            <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>2025.08 — 2026.02</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={depositData}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.2} /><stop offset="100%" stopColor={C.accent} stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="m" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}万`} width={40} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="cum" stroke={C.accent} strokeWidth={2.5} fill="url(#cg)" dot={{ fill: "#ffffff", stroke: C.accent, strokeWidth: 2, r: 3.5 }} activeDot={{ fill: C.accent, r: 5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Glass>

        <Glass delay={0.25} style={{ padding: "24px 22px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 18 }}>債権ステータス</span>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: "入金済", n: 2, total: 7, c: C.success },
              { l: "未回収", n: 4, total: 7, c: C.warning },
              { l: "延滞", n: 1, total: 7, c: C.error },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.c, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.textSub, flex: 1 }}>{s.l}</span>
                <span style={{ fontSize: 18, fontWeight: 300, color: C.text, fontFamily: "'Syne', sans-serif", width: 28, textAlign: "right" }}>{s.n}</span>
                <div style={{ width: 60, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(s.n / s.total) * 100}%`, background: s.c, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </Glass>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: CLIENTS (P1) — T番号 + 適格/免税バッジ
   ════════════════════════════════════════ */
const ClientsPage = () => {
  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState("all");

  const sorted = [...clientsData]
    .filter(c => {
      const matchSearch = c.name.includes(search) || c.contact.includes(search);
      const matchInvoice = invoiceFilter === "all" ? true : invoiceFilter === "registered" ? c.invoiceRegistered : !c.invoiceRegistered;
      return matchSearch && matchInvoice;
    })
    .sort((a, b) => {
      let v = sortKey === "name" ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey];
      return sortDir === "asc" ? v : -v;
    });

  const toggle = k => { if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("desc"); } };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <SectionHeader process="P1 · 顧客対応・販売支援" title="取引先管理" />
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 20px",
          background: C.accent, color: "#ffffff", border: "none", borderRadius: 10,
          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${C.accent}40`; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        ><Plus size={14} strokeWidth={2.5} /> 新規登録</button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} color={C.textMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="企業名・担当者名で検索..." style={{
            width: "100%", boxSizing: "border-box", padding: "10px 14px 10px 38px",
            background: C.bgGlass, border: `1px solid ${C.border}`, borderRadius: 10,
            color: C.text, fontSize: 12.5, fontFamily: "'Outfit', sans-serif",
            outline: "none", backdropFilter: "blur(12px)", transition: "border-color 0.2s",
          }} onFocus={e => e.target.style.borderColor = C.borderAccent} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
        <PillFilter active={invoiceFilter} onChange={setInvoiceFilter} items={[
          { k: "all", l: "すべて" }, { k: "registered", l: "適格事業者" }, { k: "unregistered", l: "免税事業者" },
        ]} />
        {[{ k: "revenue", l: "取引額" }, { k: "name", l: "企業名" }].map(s => (
          <button key={s.k} onClick={() => toggle(s.k)} style={{
            padding: "9px 14px", borderRadius: 10,
            border: `1px solid ${sortKey === s.k ? C.borderAccent : C.border}`,
            background: sortKey === s.k ? C.bgAccentSoft : C.bgGlass,
            color: sortKey === s.k ? C.accent : C.textSub,
            fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace",
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
          }}>{s.l}{sortKey === s.k && <span style={{ fontSize: 9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {sorted.map((c, i) => (
          <Glass key={c.id} delay={i * 0.04} style={{ padding: "20px 22px", cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${c.color}22, ${c.color}08)`,
                border: `1px solid ${c.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: c.color, fontFamily: "'DM Mono', monospace",
              }}>{c.abbr}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.name}</span>
                  <Tag bg={c.status === "active" ? C.successBg : C.errorBg} c={c.status === "active" ? C.success : C.error} label={c.status === "active" ? "取引中" : "停止"} />
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, display: "flex", gap: 12, marginBottom: 10 }}>
                  <span>{c.industry}</span><span>担当: {c.contact}</span>
                </div>
                {/* ★ T番号表示 + 適格/免税バッジ */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                  background: c.invoiceRegistered ? "rgba(52,211,153,0.05)" : "rgba(251,113,133,0.05)",
                  borderRadius: 10, border: `1px solid ${c.invoiceRegistered ? "rgba(52,211,153,0.1)" : "rgba(251,113,133,0.1)"}`,
                }}>
                  <InvoiceBadge registered={c.invoiceRegistered} />
                  {c.tNo ? (
                    <span style={{ fontSize: 10.5, color: C.textSub, fontFamily: "'DM Mono', monospace" }}>{c.tNo}</span>
                  ) : (
                    <span style={{ fontSize: 10.5, color: C.error, fontStyle: "italic" }}>T番号未登録</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 300, color: C.text, fontFamily: "'Syne', sans-serif" }}>{fmt(c.revenue)}</div>
              </div>
            </div>
          </Glass>
        ))}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: RECEIVABLES (P2)
   ════════════════════════════════════════ */
const ReceivablesPage = () => {
  const [filter, setFilter] = useState("all");
  const filtered = receivables.filter(r => filter === "all" || r.status === filter);
  const uncollectedTotal = receivables.filter(r => r.status !== "collected").reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader process="P2 · 決済・債権債務・資金回収" title="債権管理" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Metric icon={Wallet} label="未回収合計" value={fmt(uncollectedTotal)} delay={0} />
        <Metric icon={Clock} label="未回収件数" value={`${receivables.filter(r => r.status === "uncollected").length}件`} delay={0.05} />
        <Metric icon={AlertCircle} label="延滞" value={`${receivables.filter(r => r.status === "overdue").length}件`} sub="要対応" delay={0.1} />
      </div>
      <PillFilter active={filter} onChange={setFilter} items={[
        { k: "all", l: "すべて" }, { k: "uncollected", l: "未回収" }, { k: "overdue", l: "延滞" }, { k: "collected", l: "入金済" },
      ]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((r, i) => {
          const st = statusMap[r.status];
          return (
            <Glass key={r.id} delay={i * 0.03} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <st.icon size={16} color={st.c} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.client}</span>
                  <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{r.id}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10.5, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                  <span>期日 {r.due}</span>
                  <InvoiceBadge registered={r.registered} />
                  {r.tNo && <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Hash size={9} />{r.tNo}</span>}
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 300, color: C.text, fontFamily: "'Syne', sans-serif", marginRight: 14, flexShrink: 0 }}>{fmt(r.amount)}</div>
              <Tag {...st} icon={st.icon} />
            </Glass>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: INVENTORY (P3)
   ════════════════════════════════════════ */
const InventoryPage = () => {
  const [cat, setCat] = useState("all");
  const cats = ["all", ...new Set(products.map(p => p.cat))];
  const filtered = products.filter(p => cat === "all" || p.cat === cat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader process="P3 · 供給・在庫・物流" title="在庫管理" />
      <PillFilter active={cat} onChange={setCat} items={cats.map(c => ({ k: c, l: c === "all" ? "All" : c }))} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {filtered.map((p, i) => {
          const st = stockMap[p.status];
          return (
            <Glass key={p.id} delay={i * 0.04} style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{p.id}</span>
                <Tag {...st} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 16 }}>{p.cat} · {fmt(p.price)}/{p.unit}</div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 3 }}>STOCK</div>
                  <div style={{ fontSize: 28, fontWeight: 200, color: p.status === "out" ? C.error : C.text, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                    {p.stock}<span style={{ fontSize: 11, color: C.textMuted, marginLeft: 2 }}>{p.unit}</span>
                  </div>
                </div>
                <div style={{ width: 50, height: 40, display: "flex", alignItems: "flex-end", gap: 2 }}>
                  {[70, 50, 90, p.status === "ok" ? 100 : p.status === "low" ? 30 : 0].map((h, j) => (
                    <div key={j} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: j >= 3 ? st.c : "rgba(0,0,0,0.08)", opacity: j >= 3 ? 0.8 : 1 }} />
                  ))}
                </div>
              </div>
            </Glass>
          );
        })}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: ACCOUNTING (P4) — T番号仕分け + 税額控除
   ════════════════════════════════════════ */
const AccountingPage = () => {
  const [view, setView] = useState("overview");

  const regTx = receivables.filter(r => r.registered);
  const unregTx = receivables.filter(r => !r.registered);
  const regTotal = regTx.reduce((s, r) => s + r.amount, 0);
  const unregTotal = unregTx.reduce((s, r) => s + r.amount, 0);
  const regTax = Math.round(regTotal * 0.1);
  const unregTax = Math.round(unregTotal * 0.1);
  const deductible = regTax;
  const nonDeductible = unregTax;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader process="P4 · 会計・財務・経営" title="入金管理" />

      <PillFilter active={view} onChange={setView} items={[
        { k: "overview", l: "入金概要" }, { k: "invoice-sort", l: "インボイス仕分け" },
      ]} />

      {view === "overview" && (<>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Metric icon={TrendingUp} label="累計入金" value="¥23.8M" sub="+16% 前月比" trend="up" size="lg" delay={0} />
          <Metric icon={Wallet} label="今月入金" value="¥3.8M" sub="目標達成率 95%" size="lg" delay={0.06} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
          <Glass delay={0.12} style={{ padding: "24px 26px" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>累積推移</span>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={depositData} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
                <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.25} /><stop offset="100%" stopColor={C.accent} stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}万`} width={40} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="cum" stroke={C.accent} strokeWidth={2.5} fill="url(#ag)" dot={{ fill: "#ffffff", stroke: C.accent, strokeWidth: 2, r: 4 }} activeDot={{ fill: C.accent, r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Glass>
          <Glass delay={0.18} style={{ padding: "24px 22px" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>月別入金</span>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={depositData} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="m" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}万`} width={40} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="amt" radius={[6, 6, 0, 0]} barSize={24}>
                  {depositData.map((d, i) => (<Cell key={i} fill={i === depositData.length - 1 ? C.accent : "rgba(45,122,95,0.15)"} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Glass>
        </div>
      </>)}

      {/* ★ インボイス仕分け画面 */}
      {view === "invoice-sort" && (<>
        {/* 仕分けサマリー */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Glass delay={0} style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>適格請求書 取引</div>
            <div style={{ fontSize: 28, fontWeight: 200, color: C.success, fontFamily: "'Syne', sans-serif" }}>{fmt(regTotal)}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 6 }}>{regTx.length}件 · 仕入税額控除<span style={{ color: C.success, fontWeight: 600 }}>可</span></div>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "8px 12px" }}><ShieldCheck size={20} color={C.success} style={{ opacity: 0.3 }} /></div>
          </Glass>
          <Glass delay={0.05} style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>免税事業者 取引</div>
            <div style={{ fontSize: 28, fontWeight: 200, color: C.error, fontFamily: "'Syne', sans-serif" }}>{fmt(unregTotal)}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 6 }}>{unregTx.length}件 · 仕入税額控除<span style={{ color: C.error, fontWeight: 600 }}>不可</span></div>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "8px 12px" }}><ShieldX size={20} color={C.error} style={{ opacity: 0.3 }} /></div>
          </Glass>
          <Glass delay={0.1} style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>控除可能 消費税額</div>
            <div style={{ fontSize: 28, fontWeight: 200, color: C.accent, fontFamily: "'Syne', sans-serif" }}>{fmt(deductible)}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 6 }}>
              控除不可: <span style={{ color: C.error }}>{fmt(nonDeductible)}</span>
            </div>
          </Glass>
        </div>

        {/* T番号自動仕分けリスト */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* 適格 */}
          <Glass delay={0.15} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ShieldCheck size={15} color={C.success} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.success, letterSpacing: "0.06em", fontFamily: "'DM Mono', monospace" }}>適格請求書発行事業者（T番号あり）</span>
            </div>
            {regTx.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < regTx.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ fontSize: 12.5, color: C.text, fontWeight: 500 }}>{r.client}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                    {r.tNo} · {r.id}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(r.amount)}</div>
                  <div style={{ fontSize: 10, color: C.success }}>税額控除可</div>
                </div>
              </div>
            ))}
          </Glass>

          {/* 免税 */}
          <Glass delay={0.2} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ShieldX size={15} color={C.error} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.error, letterSpacing: "0.06em", fontFamily: "'DM Mono', monospace" }}>免税事業者（T番号なし）</span>
            </div>
            {unregTx.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < unregTx.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div>
                  <div style={{ fontSize: 12.5, color: C.text, fontWeight: 500 }}>{r.client}</div>
                  <div style={{ fontSize: 10, color: C.error, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                    T番号なし · {r.id}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(r.amount)}</div>
                  <div style={{ fontSize: 10, color: C.error }}>税額控除不可</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: "10px 14px", background: C.errorBg, borderRadius: 10, border: `1px solid rgba(251,113,133,0.12)` }}>
              <div style={{ fontSize: 11, color: C.error, fontWeight: 500 }}>⚠ 免税事業者との取引は仕入税額控除の対象外です</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 3 }}>経過措置期間中の控除割合にご注意ください</div>
            </div>
          </Glass>
        </div>
      </>)}
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: INVOICE CREATE — ★ 新規追加
   請求書作成 + 8%/10%切替 + T番号自動付与
   ════════════════════════════════════════ */
const InvoiceCreatePage = () => {
  const [docType, setDocType] = useState("invoice"); // "invoice" | "estimate"
  const [selectedClient, setSelectedClient] = useState(1);
  const [items, setItems] = useState([
    { id: 1, name: "クラウドERP ライセンス × 3", qty: 3, unitPrice: 50000, taxRate: 10 },
    { id: 2, name: "導入サポート費用", qty: 1, unitPrice: 200000, taxRate: 10 },
    { id: 3, name: "テイクアウト弁当（会議用）", qty: 10, unitPrice: 1080, taxRate: 8 },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const docLabel = docType === "invoice" ? "請求書" : "見積書";
  const docLabelEn = docType === "invoice" ? "INVOICE" : "ESTIMATE";
  const docNo = docType === "invoice" ? "INV-2026-008" : "EST-2026-003";

  const client = clientsData.find(c => c.id === selectedClient);
  const updateItem = (id, field, value) => setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  const toggleTax = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, taxRate: it.taxRate === 10 ? 8 : 10 } : it));
  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id));
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), name: "", qty: 1, unitPrice: 0, taxRate: 10 }]);

  const subtotal = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const tax8Items = items.filter(it => it.taxRate === 8);
  const tax10Items = items.filter(it => it.taxRate === 10);
  const tax8Base = tax8Items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const tax10Base = tax10Items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const tax8 = Math.floor(tax8Base * 0.08);
  const tax10 = Math.floor(tax10Base * 0.1);
  const total = subtotal + tax8 + tax10;

  const myCompany = { name: "株式会社サイバーバズ", tNo: "T2011001050463", address: "東京都渋谷区桜丘町12-10", tel: "03-5728-4062" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <SectionHeader process="インボイス制度対応" title={`${docLabel}作成`} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowPreview(!showPreview)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            background: "transparent", color: C.accent, border: `1px solid ${C.borderAccent}`, borderRadius: 10,
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.bgAccentSoft}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          ><Eye size={14} /> {showPreview ? "編集に戻る" : "プレビュー"}</button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            background: C.accent, color: "#ffffff", border: "none", borderRadius: 10,
            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${C.accent}40`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          ><Download size={14} /> 発行</button>
        </div>
      </div>

      {/* ★ 書類タイプ切替（請求書 / 見積書） */}
      <Glass delay={0.02} hover={false} style={{
        padding: "6px", display: "inline-flex", alignSelf: "flex-start",
        borderRadius: 14, gap: 4, background: "rgba(0,0,0,0.04)",
      }}>
        {[
          { k: "invoice", l: "請求書", icon: Receipt },
          { k: "estimate", l: "見積書", icon: FileText },
        ].map(d => (
          <button key={d.k} onClick={() => { setDocType(d.k); setShowPreview(false); }} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 22px",
            borderRadius: 10, border: "none", cursor: "pointer",
            background: docType === d.k ? C.bgAccentMed : "transparent",
            color: docType === d.k ? C.accent : C.textMuted,
            fontSize: 13, fontWeight: docType === d.k ? 700 : 500,
            fontFamily: "'Syne', sans-serif", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            letterSpacing: "0.02em",
          }}
            onMouseEnter={e => { if (docType !== d.k) e.currentTarget.style.color = C.textSub; }}
            onMouseLeave={e => { if (docType !== d.k) e.currentTarget.style.color = C.textMuted; }}
          >
            <d.icon size={15} strokeWidth={docType === d.k ? 2.2 : 1.6} />
            {d.l}
          </button>
        ))}
      </Glass>

      {!showPreview ? (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          {/* Editor */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Client Select */}
            <Glass delay={0} style={{ padding: "18px 22px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{docType === "invoice" ? "請求先" : "見積先"}</div>
              <select value={selectedClient} onChange={e => setSelectedClient(Number(e.target.value))} style={{
                width: "100%", padding: "10px 14px", background: C.bgGlass, border: `1px solid ${C.border}`,
                borderRadius: 10, color: C.text, fontSize: 13, fontFamily: "'Outfit', sans-serif",
                outline: "none", cursor: "pointer", appearance: "none",
              }}>
                {clientsData.map(c => <option key={c.id} value={c.id} style={{ background: C.bg }}>{c.name}</option>)}
              </select>
              {client && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <InvoiceBadge registered={client.invoiceRegistered} />
                  {client.tNo ? (
                    <span style={{ fontSize: 11, color: C.textSub, fontFamily: "'DM Mono', monospace" }}>
                      T番号: {client.tNo}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: C.error }}>⚠ T番号未登録 — 仕入税額控除対象外</span>
                  )}
                </div>
              )}
            </Glass>

            {/* Line Items */}
            <Glass delay={0.06} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>品目</span>
                <button onClick={addItem} style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "5px 12px",
                  background: C.bgAccentSoft, color: C.accent, border: `1px solid ${C.borderAccent}`,
                  borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace",
                }}><Plus size={12} /> 行追加</button>
              </div>

              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 60px 100px 70px 70px 32px", gap: 8, marginBottom: 8, padding: "0 4px" }}>
                {["品名", "数量", "単価", "税率", "小計", ""].map(h => (
                  <span key={h} style={{ fontSize: 9.5, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>{h}</span>
                ))}
              </div>

              {items.map((item, idx) => (
                <div key={item.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 60px 100px 70px 70px 32px", gap: 8, alignItems: "center",
                  padding: "8px 4px", borderBottom: idx < items.length - 1 ? `1px solid ${C.border}` : "none",
                  animation: `revealUp 0.3s ${idx * 0.03}s both`,
                }}>
                  <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px",
                    color: C.text, fontSize: 12, fontFamily: "'Outfit', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
                  }} onFocus={e => e.target.style.borderColor = C.borderAccent} onBlur={e => e.target.style.borderColor = C.border} />
                  <input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", Number(e.target.value))} style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 8px",
                    color: C.text, fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none", textAlign: "center", width: "100%", boxSizing: "border-box",
                  }} />
                  <input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))} style={{
                    background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 8px",
                    color: C.text, fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none", textAlign: "right", width: "100%", boxSizing: "border-box",
                  }} />

                  {/* ★ 税率ワンクリック切替ボタン */}
                  <button onClick={() => toggleTax(item.id)} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                    padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: item.taxRate === 8 ? C.infoBg : C.bgAccentSoft,
                    color: item.taxRate === 8 ? C.info : C.accent,
                    fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                    transition: "all 0.2s",
                  }}>
                    {item.taxRate}%
                    <Percent size={10} />
                  </button>

                  <span style={{ fontSize: 12, color: C.text, fontFamily: "'DM Mono', monospace", textAlign: "right" }}>
                    {fmt(item.qty * item.unitPrice)}
                  </span>

                  <button onClick={() => removeItem(item.id)} style={{
                    background: "transparent", border: "none", cursor: "pointer", color: C.textMuted,
                    padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = C.error}
                    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                  ><Trash2 size={13} /></button>
                </div>
              ))}
            </Glass>
          </div>

          {/* Summary Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Glass delay={0.12} style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>計算明細</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.textSub }}>小計</span>
                <span style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(subtotal)}</span>
              </div>

              {tax8Base > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.info, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ background: C.infoBg, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>8%</span>
                    消費税
                  </span>
                  <span style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(tax8)}</span>
                </div>
              )}
              {tax10Base > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ background: C.bgAccentSoft, padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>10%</span>
                    消費税
                  </span>
                  <span style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(tax10)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>合計</span>
                <span style={{ fontSize: 22, fontWeight: 300, color: C.accent, fontFamily: "'Syne', sans-serif" }}>{fmt(total)}</span>
              </div>
            </Glass>

            {/* ★ 発行者情報 + T番号自動付与 */}
            <Glass delay={0.18} style={{ padding: "20px 22px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>発行者情報</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{myCompany.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{myCompany.address}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{myCompany.tel}</div>
              <div style={{
                marginTop: 12, padding: "10px 14px", background: C.bgAccentSoft, borderRadius: 10,
                border: `1px solid ${C.borderAccent}`, display: "flex", alignItems: "center", gap: 8,
              }}>
                <BadgeCheck size={16} color={C.accent} />
                <div>
                  <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.06em" }}>適格請求書発行事業者番号</div>
                  <div style={{ fontSize: 14, color: C.text, fontFamily: "'DM Mono', monospace", fontWeight: 600, marginTop: 2 }}>{myCompany.tNo}</div>
                  <div style={{ fontSize: 9.5, color: C.textMuted, marginTop: 2 }}>請求書に自動付与されます</div>
                </div>
              </div>
            </Glass>

            {/* Tax Rate Legend */}
            <Glass delay={0.24} style={{ padding: "16px 22px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>税率ガイド</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: C.bgAccentSoft, color: C.accent, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>10%</span>
                  <span style={{ fontSize: 11.5, color: C.textSub }}>標準税率（一般的な商品・サービス）</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: C.infoBg, color: C.info, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>8%</span>
                  <span style={{ fontSize: 11.5, color: C.textSub }}>軽減税率（飲食料品・新聞等）</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 10 }}>品目の税率ボタンをクリックで切り替え</div>
            </Glass>
          </div>
        </div>
      ) : (
        /* ★ 請求書プレビュー */
        <Glass delay={0} style={{ padding: "40px 48px", maxWidth: 680, margin: "0 auto", background: "#f8f7f4" }}>
          <div style={{ borderBottom: `2px solid ${C.accent}`, paddingBottom: 20, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em" }}>{docLabel.split("").join(" ")}</div>
              <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{docLabelEn}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{docType === "invoice" ? "請求日" : "見積日"}: 2026-02-17</div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>No: {docNo}</div>
              {docType === "estimate" && <div style={{ fontSize: 11, color: C.warning, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>有効期限: 2026-03-17</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{docType === "invoice" ? "請求先" : "見積先"}</div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>{client?.name} 御中</div>
              {client?.invoiceRegistered && <div style={{ fontSize: 10.5, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 4 }}>登録番号: {client.tNo}</div>}
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>発行者</div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{myCompany.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{myCompany.address}</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
                padding: "4px 10px", background: C.bgAccentSoft, borderRadius: 6, border: `1px solid ${C.borderAccent}`,
              }}>
                <BadgeCheck size={12} color={C.accent} />
                <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{myCompany.tNo}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
            <thead>
              <tr>{["品名", "数量", "単価", "税率", "金額"].map(h => (
                <th key={h} style={{ padding: "10px 8px", textAlign: h === "品名" ? "left" : "right", fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 8px", fontSize: 12.5, color: C.text }}>
                    {it.name}
                    {it.taxRate === 8 && <span style={{ marginLeft: 6, fontSize: 9, color: C.info, fontWeight: 700 }}>※軽減</span>}
                  </td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: C.textSub, fontFamily: "'DM Mono', monospace", textAlign: "right" }}>{it.qty}</td>
                  <td style={{ padding: "10px 8px", fontSize: 12, color: C.textSub, fontFamily: "'DM Mono', monospace", textAlign: "right" }}>{fmt(it.unitPrice)}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <span style={{
                      padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                      background: it.taxRate === 8 ? C.infoBg : C.bgAccentSoft,
                      color: it.taxRate === 8 ? C.info : C.accent,
                    }}>{it.taxRate}%</span>
                  </td>
                  <td style={{ padding: "10px 8px", fontSize: 12.5, color: C.text, fontFamily: "'DM Mono', monospace", textAlign: "right" }}>{fmt(it.qty * it.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
                <span style={{ color: C.textSub }}>小計</span>
                <span style={{ color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(subtotal)}</span>
              </div>
              {tax8Base > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
                <span style={{ color: C.textSub }}>消費税(8%対象 {fmt(tax8Base)})</span>
                <span style={{ color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(tax8)}</span>
              </div>}
              {tax10Base > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
                <span style={{ color: C.textSub }}>消費税(10%対象 {fmt(tax10Base)})</span>
                <span style={{ color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(tax10)}</span>
              </div>}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", marginTop: 6, borderTop: `2px solid ${C.accent}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>合計金額</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: C.accent, fontFamily: "'Syne', sans-serif" }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 10, color: C.textMuted, lineHeight: 1.6 }}>
            ※ 本書はインボイス制度（適格請求書等保存方式）に対応した適格{docLabel}です。<br />
            ※「※軽減」は軽減税率(8%)対象品目を示します。
            {docType === "estimate" && <><br />※ 本見積書の有効期限は発行日より30日間です。</>}
          </div>
        </Glass>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE: PAYROLL (P5)
   ════════════════════════════════════════ */
const PayrollPage = () => {
  const gross = salary.items.filter(i => i.v > 0).reduce((s, i) => s + i.v, 0);
  const ded = salary.items.filter(i => i.v < 0).reduce((s, i) => s + Math.abs(i.v), 0);
  const net = gross - ded;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionHeader process="P5 · 総務・人事・給与" title="給与明細" />
      <Glass delay={0} style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.accent}20, ${C.accent}08)`, border: `1px solid ${C.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserCircle size={26} color={C.accent} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: C.text, fontFamily: "'Syne', sans-serif" }}>{salary.name}</div>
            <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{salary.pos} · {salary.eid}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}>2026年2月 手取り</div>
          <div style={{ fontSize: 40, fontWeight: 200, color: C.accent, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em", lineHeight: 1.15 }}>{fmt(net)}</div>
        </div>
      </Glass>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Glass delay={0.08} style={{ padding: "22px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>明細内訳</div>
          <div style={{ fontSize: 10, color: C.success, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>INCOME</div>
          {salary.items.filter(i => i.v > 0).map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12.5, color: C.textSub }}>{item.l}</span>
              <span style={{ fontSize: 12.5, color: C.text, fontFamily: "'DM Mono', monospace" }}>{fmt(item.v)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", marginBottom: 14 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>支給合計</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: "'DM Mono', monospace" }}>{fmt(gross)}</span>
          </div>
          <div style={{ fontSize: 10, color: C.error, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>DEDUCTION</div>
          {salary.items.filter(i => i.v < 0).map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12.5, color: C.textSub }}>{item.l}</span>
              <span style={{ fontSize: 12.5, color: C.error, fontFamily: "'DM Mono', monospace" }}>-{fmt(item.v)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>控除合計</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.error, fontFamily: "'DM Mono', monospace" }}>-{fmt(ded)}</span>
          </div>
        </Glass>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Glass delay={0.14} style={{ padding: "22px 24px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>手取り推移</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={salary.history}>
                <XAxis dataKey="m" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.textMuted, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 10}万`} width={35} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (<div style={{ background: "#ffffff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 13px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{label}</div>
                    <div style={{ fontSize: 14, color: C.text, fontWeight: 500, fontFamily: "'Syne', sans-serif", marginTop: 2 }}>¥{(payload[0].value * 1000).toLocaleString()}</div>
                  </div>);
                }} />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} barSize={22}>
                  {salary.history.map((d, i) => (<Cell key={i} fill={i === salary.history.length - 1 ? C.accent : "rgba(45,122,95,0.15)"} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Glass>
          <Glass delay={0.2} style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 14, background: C.bgAccentSoft, borderColor: C.borderAccent }} hover={false}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bgAccentMed, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={18} color={C.accent} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>次回支給日</div>
              <div style={{ fontSize: 12, color: C.textSub, marginTop: 2 }}>2026年2月25日（水）</div>
            </div>
          </Glass>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   SHELL
   ════════════════════════════════════════ */
const navItems = [
  { key: "dashboard", icon: Home, label: "ダッシュボード" },
  { key: "clients", icon: Building2, label: "取引先" },
  { key: "receivables", icon: Receipt, label: "債権" },
  { key: "invoice", icon: FileText, label: "請求書/見積書" },
  { key: "inventory", icon: Boxes, label: "在庫" },
  { key: "accounting", icon: TrendingUp, label: "入金" },
  { key: "payroll", icon: UserCircle, label: "給与" },
];
const pages = {
  dashboard: DashboardPage, clients: ClientsPage, receivables: ReceivablesPage,
  invoice: InvoiceCreatePage, inventory: InventoryPage, accounting: AccountingPage, payroll: PayrollPage,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [hoveredNav, setHoveredNav] = useState(null);
  const Page = pages[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@200;300;400;500;600;700&family=Syne:wght@200;300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body { font-family: 'Outfit', sans-serif; background: ${C.bg}; color: ${C.text}; -webkit-font-smoothing: antialiased; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: #ffffff; color: ${C.text}; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "15%", width: "45vw", height: "45vw", borderRadius: "50%", background: `radial-gradient(circle, rgba(45,122,95,0.06) 0%, transparent 65%)`, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "10%", width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(2,132,199,0.04) 0%, transparent 65%)", filter: "blur(60px)" }} />
      </div>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

      <div style={{ display: "flex", height: "100vh", position: "relative", zIndex: 1 }}>
        <nav style={{ width: 68, flexShrink: 0, background: "#ffffff", borderRight: `1px solid ${C.border}`, boxShadow: "1px 0 0 rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, gap: 4, position: "relative" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, marginBottom: 20, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#ffffff", fontFamily: "'Syne', sans-serif", boxShadow: `0 4px 16px ${C.accent}40` }}>B</div>
          {navItems.map(item => {
            const isActive = active === item.key;
            const isHovered = hoveredNav === item.key;
            return (
              <div key={item.key} style={{ position: "relative" }} onMouseEnter={() => setHoveredNav(item.key)} onMouseLeave={() => setHoveredNav(null)}>
                <button onClick={() => setActive(item.key)} style={{
                  width: 42, height: 42, borderRadius: 12, border: "none", cursor: "pointer",
                  background: isActive ? C.bgAccentSoft : "transparent",
                  color: isActive ? C.accent : isHovered ? C.textSub : C.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)", position: "relative",
                }}>
                  {isActive && <div style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: 2, background: C.accent }} />}
                  <item.icon size={19} strokeWidth={isActive ? 2.2 : 1.6} />
                </button>
                {isHovered && <div style={{ position: "absolute", left: 54, top: "50%", transform: "translateY(-50%)", background: "#ffffff", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap", fontSize: 11.5, fontWeight: 500, color: C.text, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", animation: "revealUp 0.15s both", pointerEvents: "none" }}>{item.label}</div>}
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <button style={{ width: 42, height: 42, borderRadius: 12, border: "none", cursor: "pointer", background: "transparent", color: C.textMuted, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.textSub} onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
          ><Settings size={18} strokeWidth={1.6} /></button>
        </nav>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
          <header style={{ padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, background: "#ffffff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Syne', sans-serif" }}>BizFlow</span>
              <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", background: "rgba(0,0,0,0.04)", padding: "2px 8px", borderRadius: 4 }}>v1.0</span>
              <span style={{ fontSize: 9, color: C.accent, fontFamily: "'DM Mono', monospace", background: C.bgAccentSoft, padding: "2px 8px", borderRadius: 4, marginLeft: 4, border: `1px solid ${C.borderAccent}` }}>インボイス対応</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, display: "flex", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.text} onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
              ><Bell size={16} strokeWidth={1.8} /><span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, background: C.error, borderRadius: "50%", border: "1.5px solid #ffffff" }} /></button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}25, ${C.accent}10)`, border: `1px solid ${C.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: "'DM Mono', monospace" }}>中</div>
                <span style={{ fontSize: 12, color: C.textSub }}>中村</span>
              </div>
            </div>
          </header>
          <div key={active} style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}><Page /></div>
        </main>
      </div>
    </>
  );
}
