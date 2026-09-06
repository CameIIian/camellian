# 保守ルール

- 変更前に既存構成と`editor-docs/`を読む。
- MarkdownをSource of Truthとし、公開入力は`docs/`、生成物は`site/`に限定する。
- `editor-docs/`、運用手順、秘密情報、認証情報、非公開情報を公開入力へ含めない。Snippetsで公開領域外を取り込まない。
- Zensical標準機能 → Python Markdown → PyMdown → CSS → 独自拡張 → JavaScriptの順に検討する。
- Astro、React、Vue、Next.js、Nuxt、NodeベースSSG、Database、Server-side API、CMS、目的のない依存を導入しない。
- テーマ本体を編集せず、Tabs、Details、Copy、Navigation、Theme switchingを再実装しない。
- 公開サンプルや空カテゴリを増やさない。構文例は`editor-docs/markdown-reference.md`へ集約する。
- `zensical.toml`、依存、CSS、JavaScript、拡張、Navigationを変更したら`uv run zensical build`を実行し、エラーを残さない。
- 依存は`pyproject.toml`と`uv.lock`で管理する。更新後は`uv sync`とビルドを確認し、Major Updateを自動化しない。
- 公開はCloudflare PagesのGit連携を使用する。GitHub Pagesやデプロイ用GitHub Actionsを作らない。
- 公開済みURLの変更・削除では内部リンク、Navigation、添付ファイル、必要なリダイレクトを確認する。
