# DevelopersIO Feed Archive

クラスメソッドの技術ブログ「DevelopersIO」の最新記事を日別で自動収集し、閲覧しやすくまとめたアーカイブサイトです。
Next.js (App Router) と Material UI (MUI) v7 を使用してモダンに構築されています。

## 特徴

- **自動更新**: GitHub Actions により、1時間ごとに最新の RSS フィードを取得して記事データを更新します。
- **高速な遷移**: Next.js の静的サイト生成 (SSG) とクライアントサイドナビゲーションにより、ストレスのないページ遷移を実現しています。
- **モダンな UI**: Material UI (MUI) v7 を採用し、レスポンシブで使いやすいデザインを提供します。
- **ダークモード対応**: システム設定に応じた自動切り替え、および手動でのライト/ダークモード切り替えに対応しています。
- **日別アーカイブ**: 1日ごとの記事が1ページにまとまっており、前後の日へスムーズに移動できます。

## 技術スタック

- **Framework**: Next.js 16+ (App Router)
- **UI Library**: Material UI (MUI) v7
- **Styling**: Emotion
- **Content**: Markdown (\_posts/)
- **Data Fetching**: Python (RSS Parser)
- **Deployment**: GitHub Pages (via GitHub Actions)

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

- `npm run dev`: 開発サーバーを起動します。
- `npm run build`: 静的サイトをビルド (`out` ディレクトリに出力) します。
- `npm run lint`: ESLint によるコードチェックを実行します。
- `npm run format`: Prettier によるコード整形を実行します。

## プロジェクト構造

```text
.
├── .github/
│   ├── scripts/        # RSS取得スクリプト (Python)
│   └── workflows/      # 自動更新・デプロイ用ワークフロー
├── _posts/             # 日別の記事データ (Markdown)
├── src/
│   ├── app/            # Next.js App Router (ページ定義)
│   ├── components/     # Atomic Design に基づくコンポーネント (atoms, molecules, organisms, templates)
│   ├── lib/            # コンテンツ処理ロジック
│   └── theme/          # MUI テーマ設定 (v7 colorSchemes)
└── public/             # 静的資産
```

## 自動更新の仕組み

1.  `.github/workflows/fetch_rss.yml` が1時間ごとに実行されます。
2.  Python スクリプトが最新の RSS を取得し、`_posts/` 内の Markdown ファイルを更新します。
3.  変更があった場合のみ GitHub にコミット・プッシュされます。
4.  `main` ブランチへのプッシュを検知して `.github/workflows/deploy.yml` が起動し、サイトをビルドして GitHub Pages へデプロイします。

---

詳細な開発仕様については [AGENT_GUIDE.md](./AGENT_GUIDE.md) を参照してください。
