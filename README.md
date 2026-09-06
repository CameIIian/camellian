# Camellian

MarkdownをZensicalで静的HTMLへ変換し、GitHub連携のCloudflare Pagesで公開する技術情報サイトです。

公開サイト: [camellian.pages.dev](https://camellian.pages.dev/)

編集方法・環境構築・公開設定は[編集者向けドキュメント](editor-docs/README.md)を参照してください。

```bash
uv sync
uv run zensical serve
uv run zensical build
```
