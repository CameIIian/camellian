---
title: Minecraftを皆と遊ぶ
description: Minecraftサーバを自宅で適当に立てた時のメモ
date: 2025-09-21
tags:
  - Linux
  - Minecraft
---
## 共通
### コマンド
``/setidletimeout``: タイムアウトまでの時間を指定
### ポート開放
ownserver(0.7.1)で記述
```
#! /usr/bin/zsh
port="80"
protocol="udp"

# select server
echo "開放するサーバを選択"
echo "1) 19132 BE (default)"
echo "2) 25565 Java"

read "choice?(1-3) >>> "

case $choice in
	2)
		port="25565"
		protocol="tcp"
		;;
	*)
        port="19132"
		;;
esac

ownserver --endpoint "${port}"/"${protocol}"
```

## 統合版
### コマンド
座標常時表示
```
gamerule showcoordinates true
```
日付常時表示
```
gamerule showdaysplayed true
```

### リソース/ビーヘビアパック追加
Windowsでワールド作成
→リソースなど追加
　→作成したワールドデータをサーバのワールドデータへコピー (rsync等)
## java版
### コマンド
``/op``: op権限付与
``/deop``: op権限剥奪

### mod
Atlauncherでモッド構成を作成してエクスポート
→サーバ機でインポート
　→サーバ内で直接run.shを実行
