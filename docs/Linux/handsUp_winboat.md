---
title: 結局Aviutlが良くてwinboatで帰ってきた話
description: Aviutl2を使うためにWinboatをインストールした際のメモ
date: 2026-02-21
tags:
  - Linux
  - Aviutl
---
## 0. 概要
Linux移行後に、動画編集用にDavinciを入れた。  
しかし、元一般音mad作者にそのような高尚なアプリは使いこなせない。  
よって、Winboat+Aviutil2を構築していく
## 1. install
公式から`.appimage`を取得  
[https://www.winboat.app/](https://www.winboat.app/)

`Docker`/`Podman`環境とFreeRDPが必要  
- `Docker`環境はどうやって構築したか忘れた。以下が参考になるかも  
  [https://qiita.com/tf63/items/c21549ba44224722f301](https://qiita.com/tf63/items/c21549ba44224722f301)  
- FreeRDBのinstall。flatpakより、安定版をsystemにインストール。
```
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install com.freerdp.FreeRDP
```
[https://github.com/FreeRDP/FreeRDP/wiki/PreBuilds](https://github.com/FreeRDP/FreeRDP/wiki/PreBuilds)

後は適当に指示に従っていけばOK  
MSを信用できる人のみ、ホームフォルダ共有はONにすること

起動後はWeb画面が開く  
一旦設定から`windows update`を行っておく

- オプション  
`~/.local/share/applications/winboat.desktop`を作成してアプリアイコンを追加
```
[Desktop Entry]
Name=winboat
Version=0.9.0
Comment=Windows11 virtual env application
Exec=/home/yokogawa/Applications/winboat-0.9.0-x86_64.AppImage
Icon=/home/yokogawa/Applications/winboat_logo.svg
Type=Application
Terminal=false
```
画像はこのへんから  
[https://www.winboat.app/_astro/winboat_logo.NqN8dmd9.svg](https://www.winboat.app/_astro/winboat_logo.NqN8dmd9.svg)
## 2. setup
Winboat > Apps > `Windows Desktop`から起動  

Aviutil2のインストールには以下を使う
[https://github.com/Neosku/aviutl2-catalog](https://github.com/Neosku/aviutl2-catalog)

または  
```
winget install --id Neosku.AviUtl2-Catalog -e
```

後は指示に従ってインストール  
推奨機能は入れとけ
## 3. trouble shooting
### 3.1. 日本語入力できない
`Settings` > IME > キーのタッチとカスタマイズ より  
ctrl + space をIME切り替えに指定
### 3.2. ファイルをやり取りしたい
rsyncでHost⇔Docker間で1個ずつ転送したい  
[https://qiita.com/mamemomonga/items/b5f765e3adc902f5e28d](https://qiita.com/mamemomonga/items/b5f765e3adc902f5e28d)
