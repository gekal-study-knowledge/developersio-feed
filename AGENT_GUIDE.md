# Agent Development Guide

このドキュメントは、AI Agent がこのプロジェクトを理解し、安全かつ効率的に開発・メンテナンスを行うためのガイドラインです。

## プロジェクトの概要

このプロジェクトは、DevelopersIO の RSS フィードを日別にアーカイブする静的サイトです。
Next.js (App Router) をベースに、MUI v7 で UI を構築しています。
Atomic Design の設計思想に基づいたコンポーネント構成を採用しています。

## 技術的制約と重要な仕様

### 1. 静的エクスポート (`output: 'export'`)

- GitHub Pages でホスティングするため、`next.config.js` で `output: 'export'` が設定されています。
- API Routes やサーバーサイドレンダリング (SSR) は使用できません。
- すべてのデータはビルド時に `_posts/*.md` から取得されます。

### 2. コンテンツ構造

- 記事データは `_posts/` ディレクトリに `YYYY-MM-DD-feed.md` という形式で保存されます。
- Frontmatter (Jekyll 互換) を含みます:
  ```markdown
  ---
  layout: default
  title: DevelopersIO Feed - YYYY-MM-DD
  last_updated: YYYY-MM-DD HH:mm:ss JST
  ---
  ```
- このディレクトリは `prettier` の対象外に設定されています (`.prettierignore`)。

### 3. MUI と Next.js Link の連携

- サーバーコンポーネント内蔵の MUI コンポーネントに `next/link` を `component` プロップとして直接渡すと、シリアライズエラーが発生する場合があります。
- 推奨される実装方法:

  ```tsx
  <Link href="/path" passHref style={{ textDecoration: 'none' }}>
    <Button component="span">Click Me</Button>
  </Link>
  ```

  - `passHref` を使用する。
  - 内部の MUI コンポーネントには `component="span"` を指定し、HTML のネストルール (`<a>` の中に `<a>` を置かない) を遵守する。

### 4. テーマとカラースキーム

- MUI v7 の `colorSchemes` (CSS 変数方式) を使用しています。
- `ThemeSwitcher` (atoms) を使用して、ライト/ダーク/システムのモードを切り替えることができます。
- スタイル定義ではハードコードされた色の代わりに `theme.vars.palette` や `theme.palette.background.paper` などのテーマ変数を使用してください。

### 5. 訪問済み記事の管理

- 閲覧した記事の ID (`year/month/day/slug`) はブラウザの `localStorage` (`visited_posts` キー) に保存されます。
- `VisitedIcon` (atoms) はこの情報を参照して、既読マークを表示します。

### 6. Favicon (icon.tsx)

- `src/app/icon.tsx` を使用して、ビルド時に favicon を動的に生成しています。
- MUI のプライマリカラーを使用したシンプルなデザインを採用しています。
- 静的エクスポート (`output: 'export'`) をサポートするため、`export const dynamic = 'force-static'` が設定されています。

### 7. ワークフローの分離

- **`fetch_rss.yml`**: RSS 取得と `_posts/` の更新を担当 (1時間ごと)。
- **`deploy.yml`**: `main` ブランチへのプッシュをトリガーに、ビルドとデプロイを担当。
- これらを統合しないように注意してください。

## 開発ルール

### コンポーネント設計 (Atomic Design)

コンポーネントは `src/components/` 下の以下のディレクトリに分類して配置してください：

- **atoms**: 最小単位（ボタン、アイコン、テーマ切り替えなど）。他のコンポーネントに依存しない。
- **molecules**: 複数の atoms を組み合わせた、意味を持つまとまり（記事ヘッダー、カードなど）。
- **organisms**: 複数の molecules や atoms で構成される、より複雑なセクション（記事リスト、ナビゲーション、スティッキーヘッダーなど）。
- **templates**: ページ全体のレイアウトを定義する（PostLayout など）。

### コードスタイル

- `npm run format` (Prettier) と `npm run lint` (ESLint) を遵守してください。
- 独自のルールは `eslint.config.mjs` および `.prettierrc` に定義されています。

### テストと検証

- 変更を加えた後は、必ず `npm run build` が通ることを確認してください。静的エクスポート特有のエラー (リンク切れ、シリアライズエラーなど) を防ぐためです。

### 依存関係

- パッケージを追加する際は、`package.json` の `dependencies` と `devDependencies` を適切に使い分けてください。
- MUI 関連のパッケージを追加する場合は、既存のバージョン (`@mui/material` v7 等) との互換性に注意してください。

## トラブルシューティング

- **ビルドエラー: `generateStaticParams` 関連**
  - `_posts/` 内に有効な Markdown ファイルが存在するか確認してください。
- **ハイドレーションエラー: `<a> cannot be a descendant of <a>`**
  - `Link` コンポーネントの中に `<a>` タグや、デフォルトで `<a>` を出力する MUI コンポーネント (Button の `component="a"` など) がネストされていないか確認してください。
