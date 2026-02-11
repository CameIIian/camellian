# Cloudflare公開手順

このリポジトリは **Cloudflare Pages** で公開できるように対応済みです。
`npm run build:cloudflare` で静的サイト (`cloudflare-dist/`) を生成し、そのまま Pages にデプロイできます。

## 1. 事前準備

1. Cloudflare アカウントを作成
2. ローカルで Cloudflare CLI にログイン

```bash
npx wrangler login
```

## 2. ローカルで静的ファイルを生成

```bash
npm ci
npm run build:cloudflare
```

生成物:
- `cloudflare-dist/index.html`（`/links` へリダイレクト）
- `cloudflare-dist/links/index.html`
- `cloudflare-dist/articles/index.html`
- `cloudflare-dist/articles/<slug>/index.html`
- `cloudflare-dist/photo/index.html`
- `cloudflare-dist/styles.css`
- `cloudflare-dist/icon.png`
- `cloudflare-dist/pictures/*`
- `cloudflare-dist/_redirects`

## 3. 公開前の確認（任意）

```bash
npm run preview:cloudflare
```

上記でローカル preview を起動し、表示崩れやリンクを確認します。

## 4. Cloudflare Pages にデプロイ

初回（プロジェクト作成を兼ねる）:

```bash
npx wrangler pages deploy cloudflare-dist --project-name website-link-collection
```

2回目以降:

```bash
npx wrangler pages deploy cloudflare-dist
```

デプロイ完了後、`*.pages.dev` のURLで公開されます。

## 5. 継続運用時に必要な作業

- 記事追加・更新後は必ず再ビルド
  - `resources/articles/*.md` を更新したら `npm run build:cloudflare`
- 画像追加後も再ビルド
  - `resources/pictures/*` を更新したら `npm run build:cloudflare`
- 反映のたびに再デプロイ
  - `npx wrangler pages deploy cloudflare-dist`

## 6. Git連携で自動デプロイしたい場合

Cloudflare Pages のダッシュボードでこのリポジトリを接続し、Build settings を以下に設定します。

- Build command: `npm run build:cloudflare`
- Build output directory: `cloudflare-dist`

これで `main` への push ごとに自動で公開更新されます。
