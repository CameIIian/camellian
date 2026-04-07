---
title: Qwen3.5をとても楽して動かす
published: 2026-04-08
draft: false
description: Android+PocketPalでQwen3.5-4B-Q4_K_Mを動かして遊ぶ
tags:
  - Android
  - LLM
---
## PocketPalのインストール
https://play.google.com/store/apps/details?id=com.pocketpalai&hl=ja
## モデルのインストール
メニューの モデル > \[+\] > Huggingfaceから追加 \
任意のモデルを探す、今回はQwen3.5-4B-Q4_K_M
## ベンチマーク
メニューの ベンチマーク から実施\
端末はXiaomiのSD7s gen4機

| 端末           | token/s |
| ------------ | ------- |
| SD7s gen4    |         |
| RTX5060 (参考) |         |
## 展望
bonsai-8Bはllama.cppをカスタムしてるらしく現状動かない \
色々動くようになれば最高のモバイルローカルLLM環境になるのかもしれない