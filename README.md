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
  - 日付の指定方法: .md内に `date: yyyy/mm/dd` 等

## Cloudflare Pages で公開

Cloudflare公開手順は `cloudflare.md` を参照してください。

```bash
npm run build:cloudflare
```

## OGP画像の編集方法

OGP画像は `src/server.ts` の `renderOgpCardSvg` で生成しています。

- タイトル文字の見た目を変える: `renderOgpCardSvg` 内の `<text ...>${safeTitle}</text>` の `x / y / font-size / fill` を編集
- 背景やウィンドウ風UIを変える: `<rect>` や `<linearGradient>` の色・サイズを編集
- 下部の名前などを変える: 該当する `<text>` 要素の文言や色を編集

変更後は以下で確認できます。

```bash
npm run build
npm start
# 例: http://localhost:3000/ogp/links.svg
```

`icon.png` は OGP SVG 内に base64 で埋め込んでいるため、`public/icon.png` を差し替えると OGPカード内のアイコンも更新されます。
