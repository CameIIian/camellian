---
title: 技術ブログを自作したい
published: 2026-02-06
draft: true
description: これはテンプレートです。
tags:
  - Web
  - ViveCoding
---
Vibe Coding始めての人が色々やった軌跡
## 選定
Codexを利用
- TypeScriptを利用
- ワークスペースはGitHubに
## 下準備
- GitHubProjectを作り接続
- Codexの作業用環境を作成
- 確認用にnpmをローカルにインストール
- nvmのinstall, .zshrcへの追記
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

 ```sh
 export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use # This loads nvm, without auto-using the default version
 ```
## 始動
概形を作ってもらう
```
# Task
Link集のWEBサイトを作ってください
XやGitHub等のリンクを掲載したいです

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```
## 機能追加
メインページに自己紹介の追加
```
# Task
リンク集に自己紹介を追加してください

# 注意点
これまでの技術選定、見た目の指示に従ってください

# 概形
[タイトル]
[リンク集]

[写真]
[自己紹介]
```
人の手で修正した後、雑記ページ追加
```
# Task1
WEBページ上のターミナルを全画面表示にしてください

# Task2
トップバーの下にタブバーを作ってください。
タブバーの表示は以下のようにしてください。
- links
- articles

詳細は添付ファイルを参考にしてください

タブバーをクリックした際、
- linksをクリックしたら、現在のlink集のドキュメントを開いてください
- articleをクリックしたら、一旦からのページを開くようにしてください

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```
雑記のページはmarkdownを表示できるように
```
# Task
articleのページをリソース内の.mdを表示できるようにしてもらってもいいですか？
また、マークダウンのリソース置き場とサンプルのマークダウンも作ってもらっていいですか？

# 技術
- TypeScript
- Node.js

# 見た目
- Draculaテーマのカラーリング
```
記事のページの構成を調整
```
# Task
articleのページを開いた際、
- 左の1/3は記事一覧のページ (タイトル、更新日時、タグを各記事表示)
- 残りの領域は選択した記事を表示できるページ

にしてもらっていいですか？
ページの分割のイメージは添付写真のようにお願いします

# 技術
- TypeScript
- Node.js

# 見た目
- Draculaテーマのカラーリング
```
検索機能の追加
```
# Task
articleのページを開いた際、左の1/3に存在する記事一覧のページに
- 検索機能を付けてもらえますか？
- Tagによる絞り込み機能を付けてもらえますか？

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```
Githubのcontributionの追加
```
# Task
cat contributions下に
- Githubの自分のコントリビューションを表示してもらってもいいですか？

# 技術
- TypeScript
- Node.js

# 見た目
- Draculaテーマのカラーリング
```
Picturesの追加
```
# Task
タブバーに新たに写真を見ることのできるphotoを追加してください
- photoをクリックすると写真を見ることのできるページへ遷移s
- resources/pictures/*.png または resources/pictures/*.jpg と一言コメントを表示
- 縦にスクロール可能

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```
## 修正
タブバーの手直し
```
# Task
タブバーの隙間をなくしてもらえますか？
左端から中央までの空間をabout, 中央から右端までの空間をarticleに割り当ててください

# 技術
- TypeScript
- Node.js

# 見た目
- ターミナル風
- Draculaテーマのカラーリング
```
記事のページの手直し1
```
# Task
articleのページの記事の表示部分の外枠が2重になっている所を1重になるように修正してもらえますか？

# 技術
- TypeScript
- Node.js  
```
記事のページの手直し2
```
# Task
articleのページで下部に空白の空間があるのを修正してもらえますか？

# 技術
- TypeScript
- Node.js
```
記事のページ手直し3
```
# Task
articleのページで"https://"で始まるURLを明示的に指定しなくてもクリック可能にしてもらってもいいですか？

# 技術
- TypeScript
- Node.js
```
記事ページをスマホ対応
```
# Task
articleのページにおいて、画面の横幅が少ない場合の仕様を変えてもらってもいいですか？
- 前画面で記事を表示
- 右下にメニューボタンを用意
- メニューボタンを押すと左から一覧が開く/閉じる

# 技術
- TypeScript
- Node.js
```
リンクにアイコンの追加
```
# Task
リンクの部分に対応するアイコンを追加したいです

# 技術
- TypeScript
- Node.js
```
色やUIや無駄を省く
```
# Task
- リンクのページにおいてGitHub Contributionsの外側の枠を外してください
- 可能な限りスクロールバーを表示しないようにしてください

# 技術
- TypeScript
- Node.js
```
色やUIや無駄を省く2
```
# Task
- 縦方向のみ、ドラキュラテーマのスクロールバーを追加してください
- URLやコード部分がはみ出してしまうことを改善してください

# 技術
- TypeScript
- Node.js
```
photoのページの修正
```
# Task
photoのページにおいて
- スクロールバーが2つ存在しているので、1つにまとめてもらってもいいですか？
- 画像のタグは不要なので、削除してください

# 技術
- TypeScript
- Node.js
```
## 脆弱性排除/最適化
photoのページの修正
```
# Task
photoのページにおいて
- パスの表示の際に、`resources/pictures/`の部分は表示しないようにしてもらってもいいですか？

# 技術
- TypeScript
- Node.js
```
安全に
```
# Task
コード内にある脆弱な部分を修正してください
ただし、過剰な修正は行わないでください

# 技術
- TypeScript
- Node.js
```
## 将来性
1. .md表示部分はもっと綺麗な他の人が作った物に変えたい
2. OGPをいい感じに表示できるようにしたい
## 公開
Cloudflareに魂を売る
1. Pages にリポジトリを接続
2. ClaudFlareに公開するリポジトリを選択
3. ビルド設定を(`npm run build`と出力のdir`dist`)
4. アップロード&デプロイ
注意点
- `https://リポジトリ名.pages.dev`が無料なので、いい感じの名前にしておくこと
- わりとすぐアクセス可能になる、アクセスできなかったらトラブってる
- 特にindex.htmlとか？
- もしも、危険なサイト扱いされたら抗議すること
## 感想
凄い、それしか言葉が出ない
おもちゃ性能高すぎる
楽しかった
## 役に立ちそう
https://10nm.saba.run/posts/%E8%87%AA%E5%88%86%E3%81%AE%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA%E3%82%92%E4%BD%9C%E3%82%8B/
## 良いなって思った
https://github.com/stelcodes/multiterm-astro
