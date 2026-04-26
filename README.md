# DevelopersIO Feed Archive

クラスメソッドの技術ブログ「DevelopersIO」の最新記事を日別で自動収集し、閲覧しやすくまとめたアーカイブサイトです。
Next.js (App Router) と Material UI (MUI) v7 を使用してモダンに構築されています。

## 特徴

- **自動更新**: GitHub Actions により、1 時間ごとに最新の RSS フィードを取得して記事データを更新します。
- **高速な遷移**: Next.js の静的サイト生成 (SSG) とクライアントサイドナビゲーションにより、ストレスのないページ遷移を実現しています。
- **モダンな UI**: Material UI (MUI) v7 を採用し、レスポンシブで使いやすいデザインを提供します。
- **ダークモード対応**: システム設定に応じた自動切り替え、および手動でのライト/ダークモード切り替えに対応しています。
- **日別アーカイブ**: 1 日ごとの記事が 1 ページにまとまっており、前後の日へスムーズに移動できます。
- **訪問履歴管理**: 閲覧した記事は localStorage に保存され、既読マークが表示されます。

## 技術スタック

| Category            | Technology                         |
| ------------------- | ---------------------------------- |
| **Framework**       | Next.js 16+ (App Router)           |
| **UI Library**      | Material UI (MUI) v7               |
| **Styling**         | Emotion                            |
| **Language**        | TypeScript 5.9+                    |
| **Content**         | Markdown (\_posts/)                |
| **Data Fetching**   | Python (feedparser, BeautifulSoup) |
| **Deployment**      | GitHub Pages (via GitHub Actions)  |
| **Package Manager** | npm                                |

- [![Build and Deploy](https://github.com/gekal-study-knowledge/developersio-feed/actions/workflows/deploy.yml/badge.svg)](https://github.com/gekal-study-knowledge/developersio-feed/actions/workflows/deploy.yml)

## 開発ガイド

### ローカル開発環境の構築

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

`http://localhost:3000` でプレビューが可能です。

### スクリプト

| Command            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `npm run dev`      | 開発サーバーを起動します                             |
| `npm run build`    | 静的サイトをビルド (`out` ディレクトリに出力) します |
| `npm run start`    | ビルド後のサイトを起動します                         |
| `npm run lint`     | ESLint によるコードチェックを実行します              |
| `npm run lint:fix` | ESLint による自動修正を実行します                    |
| `npm run format`   | Prettier によるコード整形を実行します                |

### 必要バージョン

- **Node.js**: 24+
- **npm**: 最新版

## プロジェクト構造

```text
.
├── .github/
│   ├── scripts/        # RSS 取得スクリプト (Python)
│   │   ├── fetch_rss.py
│   │   └── requirements.txt
│   └── workflows/      # 自動更新・デプロイ用ワークフロー
│       ├── fetch_rss.yml
│       └── deploy.yml
├── _posts/             # 日別の記事データ (Markdown)
│   └── YYYY/
│       └── MM/
│           └── YYYY-MM-DD-feed.md
├── src/
│   ├── app/            # Next.js App Router (ページ定義)
│   │   ├── archive/    # 月別アーカイブページ
│   │   ├── posts/      # 個別記事ページ
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/     # Atomic Design に基づくコンポーネント
│   │   ├── atoms/      # 最小単位 (ボタン、アイコン等)
│   │   ├── molecules/  # 複数の atoms の組み合わせ
│   │   ├── organisms/  # 複雑なセクション
│   │   └── templates/  # ページ全体のレイアウト
│   ├── lib/            # コンテンツ処理ロジック
│   │   ├── posts.ts
│   │   └── store/
│   ├── theme/          # MUI テーマ設定 (v7 colorSchemes)
│   └── utils/          # ユーティリティ関数
├── public/             # 静的資産
├── out/                # ビルド出力ディレクトリ
└── package.json
```

## 自動更新の仕組み

1.  `.github/workflows/fetch_rss.yml` が 1 時間ごとに実行されます。
2.  Python スクリプト (`fetch_rss.py`) が最新の RSS を取得し、`_posts/` 内の Markdown ファイルを更新します。
3.  変更があった場合のみ GitHub にコミット・プッシュされます。
4.  `main` ブランチへのプッシュを検知して `.github/workflows/deploy.yml` が起動し、サイトをビルドして GitHub Pages へデプロイします。

### ワークフロー詳細

| Workflow        | Trigger                     | Role                     |
| --------------- | --------------------------- | ------------------------ |
| `fetch_rss.yml` | Schedule (hourly), manual   | RSS 取得・`_posts/` 更新 |
| `deploy.yml`    | Push to main, workflow_call | ビルド・デプロイ         |

## 主要機能

### ページ構成

- **トップページ**: 月別アーカイブ一覧と最近の記事（先月 1 日〜）を表示
- **月別アーカイブ**: 指定月の記事を日別に一覧表示
- **個別記事ページ**: 記事の詳細表示（前後ナビゲーション付き）

### コンポーネント

- **ThemeSwitcher**: ライト/ダーク/システムのモード切り替え
- **PostList**: 記事リスト表示
- **StickyHeader**: 固定ヘッダー
- **UpdateNotifier**: 更新通知
- **VisitedIcon**: 既読記事のアイコン表示

---

詳細な開発仕様については [AGENT_GUIDE.md](./AGENT_GUIDE.md) を参照してください。
