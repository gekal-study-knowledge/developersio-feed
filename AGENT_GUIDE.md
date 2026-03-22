# Agent Development Guide

このドキュメントは、AI Agent がこのプロジェクトを理解し、安全かつ効率的に開発・メンテナンスを行うためのガイドラインです。

## プロジェクトの概要

このプロジェクトは、DevelopersIO の RSS フィードを日別にアーカイブする静的サイトです。
Next.js (App Router) をベースに、MUI v7 で UI を構築しています。
Atomic Design の設計思想に基づいたコンポーネント構成を採用しています。

## 技術的制約と重要な仕様

### 1. 静的エクスポート (`output: 'export'`)

- GitHub Pages でホスティングするため、`next.config.ts` で `output: 'export'` が設定されています。
- API Routes やサーバーサイドレンダリング (SSR) は使用できません。
- すべてのデータはビルド時に `_posts/*.md` から取得されます。
- 画像最適化は無効化されています (`images.unoptimized: true`)。

### 2. コンテンツ構造

- 記事データは `_posts/` ディレクトリに `YYYY/MM/DD/YYYY-MM-DD-feed.md` という階層で保存されます。
- Frontmatter (Jekyll 互換) を含みます:
  ```markdown
  ---
  layout: default
  title: DevelopersIO Feed - YYYY-MM-DD
  last_updated: YYYY-MM-DD HH:mm:ss JST
  news_counter: 10
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

- **`fetch_rss.yml`**: RSS 取得と `_posts/` の更新を担当 (1 時間ごと)。
- **`deploy.yml`**: `main` ブランチへのプッシュをトリガーに、ビルドとデプロイを担当。
- これらを統合しないように注意してください。

### 8. データフロー

```
RSS Feed (dev.classmethod.jp/feed/)
       ↓
Python Script (fetch_rss.py)
       ↓
_posts/YYYY/MM/YYYY-MM-DD-feed.md
       ↓
Next.js (getSortedPostsData)
       ↓
Static HTML (out/)
       ↓
GitHub Pages
```

## 開発ルール

### コンポーネント設計 (Atomic Design)

コンポーネントは `src/components/` 下の以下のディレクトリに分類して配置してください：

| Level         | Description                                                  | Examples                                         |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| **atoms**     | 最小単位。他のコンポーネントに依存しない                     | ボタン、アイコン、テーマ切り替え                 |
| **molecules** | 複数の atoms を組み合わせた、意味を持つまとまり              | 記事ヘッダー、カード                             |
| **organisms** | 複数の molecules や atoms で構成される、より複雑なセクション | 記事リスト、ナビゲーション、スティッキーヘッダー |
| **templates** | ページ全体のレイアウトを定義する                             | PostLayout                                       |

### コードスタイル

- `npm run format` (Prettier) と `npm run lint` (ESLint) を遵守してください。
- 独自のルールは `eslint.config.mjs` および `.prettierrc` に定義されています。
- TypeScript は `strict` モードで動作しています。

### ファイル命名規則

- **コンポーネント**: PascalCase (例：`ThemeSwitcher.tsx`)
- **ユーティリティ**: camelCase (例：`stringUtils.ts`)
- **Markdown**: `YYYY-MM-DD-feed.md`

### 依存関係

- パッケージを追加する際は、`package.json` の `dependencies` と `devDependencies` を適切に使い分けてください。
- MUI 関連のパッケージを追加する場合は、既存のバージョン (`@mui/material` v7 等) との互換性に注意してください。

## 主要コンポーネント一覧

### Atoms

| Component       | Description                            |
| --------------- | -------------------------------------- |
| `ThemeSwitcher` | ライト/ダーク/システムモードの切り替え |
| `NavButton`     | ナビゲーションボタン                   |
| `VisitedIcon`   | 既読記事を示すアイコン                 |

### Molecules

| Component    | Description                        |
| ------------ | ---------------------------------- |
| `PostHeader` | 記事のヘッダー（タイトル、日時等） |
| `PostCard`   | 記事カード                         |

### Organisms

| Component         | Description                |
| ----------------- | -------------------------- |
| `PostList`        | 記事リスト                 |
| `StickyHeader`    | 固定ヘッダー               |
| `NavigationLinks` | 前後記事へのナビゲーション |
| `PostContent`     | 記事本文（Markdown 表示）  |
| `UpdateNotifier`  | 更新通知                   |
| `Footer`          | フッター                   |

### Templates

| Component    | Description            |
| ------------ | ---------------------- |
| `PostLayout` | 記事ページのレイアウト |

## テストと検証

- 変更を加えた後は、必ず `npm run build` が通ることを確認してください。静的エクスポート特有のエラー (リンク切れ、シリアライズエラーなど) を防ぐためです。
- ローカルでの確認は `npm run dev` で開発サーバーを起動し、`http://localhost:3000` でアクセスしてください。

## トラブルシューティング

### ビルドエラー: `generateStaticParams` 関連

- `_posts/` 内に有効な Markdown ファイルが存在するか確認してください。
- ファイル名が `YYYY-MM-DD-*.md` の形式に従っているか確認してください。

### ハイドレーションエラー: `<a> cannot be a descendant of <a>`

- `Link` コンポーネントの中に `<a>` タグや、デフォルトで `<a>` を出力する MUI コンポーネント (Button の `component="a"` など) がネストされていないか確認してください。
- 解決策: `component="span"` を使用してネストを避ける

### ローカルで画像が表示されない

- 静的エクスポートでは `next/image` の最適化が無効化されています。
- 外部画像は `og:image` 等として Markdown 内に埋め込まれています。

### RSS 取得スクリプトのエラー

- Python の依存関係: `.github/scripts/requirements.txt`
- 使用ライブラリ: `feedparser`, `BeautifulSoup4`, `pytz`, `requests`

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [MUI v7 Documentation](https://mui.com/material-ui/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)
