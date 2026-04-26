---
title: 自分を振り返る。設定ファイルを見直す。
published: 2026-04-26
draft: false
description: rcやsettings.json等見直して使いやすい環境を作る
tags:
  - linux
  - Windows
  - Editor
  - recommend
---
## 0. モチベーション
ゆるコンピュータラジオで、"どのエディタか"よりも"どんな設定か"が大事みたいな話をしてた
> https://youtu.be/KpDTFSijA6U?si=ZxBWtSz-ecNC4X38

.zshrc位しかまともに設定していなかった為、今後も考えて使いやすくカスタマイズする
## 1. rcファイル (bash/zsh)
以下のような構成にした
1. `.bashrc`および`.zshrc`で各シェルの設定を読み込み
2. 1の中で`rc`で共通の設定を読み込み
3. 2の中で`.aliases`を読み込み

詳細ファイルは以下の`.bashrc`, `.zshrc`, `rc` 及び `.aliases`
> https://github.com/CameIIian/dotfiles/tree/main

意識したことは、2つ
1. 存在するなら実行を徹底\
   →どの環境でも使いまわしたい
2. セットアップの度に入れ直すものは、無いなら導入する(手元の環境のみ)
## 2. VSCode (settings.json)
意識したことは2つ
1. 無駄なAI補完を無くす\
   必要な時にクレジットが足りないことを防ぐ
2. エディタを見やすく
3. 無駄な変更を減らす

設定ファイルは以下
> https://github.com/CameIIian/dotfiles/tree/main/code

以下は拡張機能
- テーマ: `Catppuccin for VSCode` + `Icons`
- 可視化: `zenkaku` + `indent-rainbow` + `Error Lens`
- 日本語化: `Japanese Language Pack for Visual Studio Code`
- ファイル周り: `Path Intellisense` + `Image Preview`
- 品質管理: `Code Spell Checker`, `Prettier`
- git関連: `GitLens` + `GitGraph`
- AI: `GitHub Copilot Chat` + `Codex – OpenAI’s coding agent`

- markdown: `Markdown All in One` + `Marp for VS Code`
- 設定ファイル: `XML`, `YAML`
- python: `python` + `pylance` + `ruff` + `autopep8` + `isort` + `jupyter`
- C/C++: `C/C++` tools, `clangd`
- Web系: `HTMLHint` + `HTML CSS Support` + `CSS Peek` + `JavaScript (ES6) code snippets` + `Astro`
## 3. Zed (settings.json)
よりシンプルなGUIエディタを使いたい瞬間用、よって意識したことは以下2つ
1. 不要な情報を表示させない
2. 操作系はVSCodeをベースに

設定ファイルは以下
> https://github.com/CameIIian/dotfiles/tree/main/zed
## 4. nvim (lazy.nvim)
本気で使い始めたら書く

現状これ
> https://github.com/bcampolo/nvim-starter-kit