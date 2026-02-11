# Link集サイト（ターミナル風 / Dracula）

TypeScript + Node.js で作成した、リンク集 + 自己紹介 + Markdown記事表示のシンプルなWebサイトです。

## セットアップ

```bash
npm run build
npm start
```

`http://localhost:3000` にアクセスしてください。

## カスタマイズ

- リンク一覧: `src/links.ts`
- 自己紹介の文言: `src/server.ts`
- アイコン: `public/icon.png`
- 写真: `resources/pictures/*.(jpg/png)`
- 記事(Markdown): `resources/articles/*.md`
  - Tagの指定方法: .md内に `Tags: linux` 等


## Cloudflare Pages で公開

Cloudflare公開手順は `cloudflare.md` を参照してください。

```bash
npm run build:cloudflare
```
