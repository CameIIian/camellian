# Link集サイト（ターミナル風 / Dracula）

TypeScript + Node.js で作成した、リンク集 + 自己紹介 + Markdown記事表示のシンプルなWebサイトです。

## セットアップ

```bash
npm run build
npm start
```

`http://localhost:3000` にアクセスしてください。

## 開発

```bash
npm run check
npm run build
```

## カスタマイズ

- リンク一覧: `src/links.ts`
- 自己紹介の文言: `src/server.ts`
- 写真: `public/icon.png`
- 記事(Markdown): `resources/articles/*.md`
  - サンプル: `resources/articles/welcome.md`
