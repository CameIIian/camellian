# CodexにBlogを作ってもらう
Tag: TypeScript, VibeCoding

- Vibe Coding始めて
- TypeScript知らない、HTMLとCSSなら概形はわかる
程度の人がこのサイトを作るまでの軌跡
## 下準備
- GitHubProjectを作り接続
- Codexの作業用環境を作成
- nvm/typescriptのinstall
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```
## プロンプト
大体これ
機能追加も、修正も、README作成も`~`の部分にやってほしいことを書くだけ
でも、本当はやって欲しくないことも明記するともっと良い
```
# Task
~を作ってください

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```

最後の仕上げ
```
# Task
コード内にある脆弱な部分を修正してください
ただし、過剰な修正は行わないでください

# 技術
- TypeScript
- Node.js
```
公開用に調整
```
# Task
Cloudflareにで公開可能な状態にしてください
また、公開までに必要な作業を`cloudflare.md`に記述してください
```
## Cloudflareに公開
1. cloudflareのアカウントを作る
2. WebサイトからPagesの所に行く
3. GUIに沿って設定
4. ビルドコマンド/ビルド出力を正しく指定する
5. ちゃんと出来てれば、すぐにアクセス可能になる

で、このサイトが生まれたってわけ