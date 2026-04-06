---
title: かわいいArchはお好きですか？
published: 2025-08-25
draft: true
description: Nyarchをセットアップして使った際のメモ/URL集
tags:
  - linux
---

## memo
- ファンコンはSATAケーブルが必要
- FastSDcpu トラブル
  Use locally ~ (offline) はlocalモデルの使用ではなく、Networkアクセスの禁止である。

## links
- flash tool: https://rufus.ie/ja/
- iso: https://nyarchlinux.moe/#download
- spec: https://zenn.dev/may15/articles/74dd1106408ea7
- Japanize: https://ameblo.jp/ninjav8/entry-12884438543.html
- Downgrade python: https://qiita.com/yuya_mtk371/items/08a8fd25a34bd06bf64f
- make swap: https://qiita.com/youyonghua/items/e1382390328ad5ddab61
- 不要なPythonパッケージの削除: https://qiita.com/hunzy/items/6965dce22cedb046af7c
- load memory profile (これにより、OpenRGBでメモリのLEDを変更可能に、起動毎に必要)
  https://github.com/P3R-CO/openrgb-container/blob/master/README.md#smbus-access
- systemd / profile.d による自動起動
  書き方:
  https://wiki.archlinux.jp/index.php/Systemd_FAQ
  https://superuser.com/questions/885730/run-bash-script-at-boot
  PATHの接続:
  https://sunday-morning.app/posts/2019-08-05-systemd-symlink