# 編集者向けドキュメント

普段の作業は、Markdownを編集し、ローカルで表示を確認してGitHubへpushするだけです。

- [編集・環境構築・公開ガイド](editing-guide.md)
- [Markdownリファレンス](markdown-reference.md)

`docs/`は公開コンテンツ、`editor-docs/`は編集・運用手順の置き場所です。
Zensicalの入力は`docs/`のみで、Cloudflare Pagesへ渡すのは`site/`のみです。
このディレクトリを`docs/`へコピーしたり、Snippetsで読み込んだりしないでください。

**GitHubリポジトリがPublicの場合、この文書もGitHub上では公開されます。**
編集者だけに閲覧を制限する必要がある場合は、リポジトリ自体をPrivateにしてください。
Webサイトからリンクしないことはアクセス制御にはなりません。
