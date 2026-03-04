# BizFlow 構築タスク

## 目的
BizFlow-v3.jsx の内容をフォルダ内に実行可能なプロジェクトとして構築する。

## 実装計画

1. **プロジェクト基盤**
   - Vite + React プロジェクト構成を作成
   - package.json（react, react-dom, recharts, lucide-react）
   - vite.config.js, index.html

2. **エントリポイント**
   - src/main.jsx
   - src/App.jsx（BizFlow-v3.jsx の内容を配置）

3. **動作確認**
   - npm install && npm run dev で起動確認

## 依存関係
- react, react-dom
- recharts（チャート）
- lucide-react（アイコン）

---

## UIデザイン変更（2026-02）

- **テーマ**: 「Obsidian Amber」（ダーク）→「Sage Paper」（白ベース）
- **背景**: 温かみのあるクリーム (#faf9f7)
- **アクセント**: セージグリーン (#2d7a5f) — 競合（freee/マネーフォワード等の青系）との差別化
- **カード**: 白背景 + ソフトシャドウ
