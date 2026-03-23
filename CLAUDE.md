# DevelopersIO Feed Archive - Development Guide

## プロジェクト概要

クラスメソッドの技術ブログ「DevelopersIO」の記事を日別でまとめた Next.js + MUI ベースのアーカイブサイト。

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **UI Library**: MUI v5 (Material UI)
- **Language**: TypeScript
- **Date Handling**: date-fns
- **Markdown Processing**: remark, remark-html
- **CSS**: CSS Modules, MUI Styled Components

## プロジェクト構造

```
src/
├─ app/                 # Next.js App Router
│  ├─ archive/[month_key]/   # 月別アーカイブページ
│  ├─ posts/[year]/[month]/[day]/[slug]/  # 記事詳細ページ
│  ├─ layout.tsx         # ルートレイアウト
│  ├─ page.tsx           # ホームページ
│  └─ loading.tsx        # ローディングコンポーネント
├─ components/
│  ├─ atoms/             # アトムレベルのコンポーネント
│  │  ├─ NavButton.tsx
│  │  ├─ ThemeSwitcher.tsx
│  │  └─ VisitedIcon.tsx
│  ├─ molecules/         # マレキュールレベルのコンポーネント
│  │  ├─ PostHeader.tsx
│  │  └─ PostCard.tsx
│  ├─ organisms/         # オーガニズムレベルのコンポーネント
│  │  ├─ Footer.tsx
│  │  ├─ NavigationLinks.tsx
│  │  ├─ PostContent.tsx
│  │  ├─ PostList.tsx
│  │  ├─ StickyHeader.tsx
│  │  └─ UpdateNotifier.tsx
│  └─ templates/         # テンプレートコンポーネント
│     └─ PostLayout.tsx
├─ lib/
│  ├─ posts.ts           # 記事データ処理
│  └─ store/
│     └─ useVisitedPost.ts  # 訪問履歴管理
├─ theme/
│  └─ theme.ts           # MUI テーマ定義
└─ utils/
   └─ stringUtils.ts     # 文字列ユーティリティ
```

## データモデル

### PostData インターフェース

```typescript
interface PostData {
  slug: string;         // エンコードされたスラッグ
  year: string;         # 例: "2026"
  month: string;        # 例: "01"
  day: string;          # 例: "15"
  date: string;         # YYYY-MM-DD 形式
  title: string;        # 記事タイトル
  contentHtml?: string; # マーカダウンを HTML に変換
  lastUpdated?: string; # 最終更新日
  newsCounter?: number; # ニュースカウンター
  previous?: string;    # 前記事のパス
  next?: string;        # 次記事のパス
}
```

### _posts ディレクトリ構造

```
_posts/
└─ YYYY-MM-DD-XXXXXXX.md  # ファイル名は YYYY-MM-DD-スラッグ.md 形式
```

**YAML フロントマター例**:

```yaml
---
title: 記事タイトル
date: 2026-01-15
category: XXXXX
tags: [tag1, tag2]
---

# コンテンツ
```

## コンポーネント階層

| レベル | コンポーネント | 役割 |
|--------|----------------|------|
| Atom | ThemeSwitcher, NavButton | 基本 UI 要素 |
| Molecule | PostHeader, PostCard, VisitedIcon | 複数のアトムを結合 |
| Organism | PostList, Footer, NavigationLinks | ページの一部を形成 |
| Template | PostLayout | 記事ページの完全なレイアウト |

## 主要関数

### `src/lib/posts.ts`

- `getSortedPostsData()`: 全ての記事を日付順にソートして取得
- `getPostsByMonth()`: 月別に記事をグループ化
- `getAllMonthParams()`: 月別アーカイブページの生成に使用
- `getPostData()`: 単一記事の詳細データ取得（HTML コンテンツ含む）
- `getAllPostSlugs()`: 全記事のスラッグ一覧

### `src/utils/stringUtils.ts`

- `keysToCamelCase()`: フロントマターデータのキーをキャメルケースに変換

## テーマ設定

`src/theme/theme.ts` で MUI テーマを定義：

- **ライトモード**: 背景 `#f4f7f6`, プライマリ `#157878`
- **ダークモード**: 背景 `#0d1117`, プライマリ `#2aa1a1`

## 動的機能

### 更新カウンター機能

- 最新記事の `newsCounter` フィールドをインクリメント
- `UpdateNotifier` コンポーネントで表示
- 公式更新時のみカウンターが更新される

### 訪問履歴管理

- `useVisitedPost`フックでユーザーの訪問履歴を管理
- `VisitedIcon` コンポーネントで表示

## 開発ワークフロー

1. 新規記事追加: `_posts/YYYY-MM-DD-スラッグ.md` を作成
2. `next build` でビルド
3. `next start` で起動

## 重要な制限

- `generateStaticParams` で静的生成された月のみ表示可能
- 新規月は一度 `next build` が必要
- `dynamicParams: false` で静的生成モード

## 外部依存

- MUI: `@mui/material`, `@mui/icons-material`
- Next.js: `nextjs-toploader` (ロードインジケータ)
- date-fns: 日付処理
- gray-matter: YAML フロントマターパース
- remark: Markdown パースと HTML 変換

## 環境変数

現在使用していない。必要に応じて `.env.local` で管理。

## CI/CD

GitHub Actions でデプロイを実装中。

## 今後の拡張予定

- RSS フィード機能
- 記事検索機能
- タグページの実装
- コメント機能（可选）
