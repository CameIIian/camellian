---
title: 引越しが済んでそのタイミングでwifiを変えた, 季節の変わり目を感じたからOSを変えた
description: TP-Link Archer C6 v2を2000円弱で拾った際にOpenWRT(Latest, stable)を入れたメモ
date: 2026-06-10
tags:
  - Linux
  - Router
---

### 1. 初期化
起動後に頑張ってResetを10秒くらい押す  
全部のライトが一瞬ついたらOKかも  
その後再起動する
### 2. install
192.168.0.1 へログイン  
upgradeからopenwrtのFactoryでアップグレード
### 3. 初期設定
192.168.1.1 へログイン (root, パスワードなし)  
ファームウェア更新のお知らせは一応受け取っておく  
パスワードを適当に設定

System > Systemから  
タイムゾーンをAsia/Tokyoに  
NTPサーバをNICT(ntp.nict.jp)やIIJ(ntp.iij.ad.jp)等適当に設定

System > Administrationから  
ssh を LAN 内からのみ受け付けるように変更

Network > Interfaceから  
LANを172.16.0.1/24に変更

Network > wirelessからwifiの有効化  
2g: 11, 40MHz, 14 dBm  
5g: 48, 80MHz , 17 dBm  
WPA3 or 2/3mix を使うこと
### 4. 追加設定
System > scheduled Tasksから  
自動再起動設定 (あんまり再起動すると, 保存領域の負荷になるらしい？水曜の朝だけ再起動)
```
0 4 * * 3 reboot
```

System > LED Configurationから  
2g, 5g用LEDランプを指定

sshして  
- vi /etc/config/dhcp  
 でMACアドレスによる優先割り当てを設定
### 参考
[https://qiita.com/maestro_shin1/items/fb8e4fef9ae8b8ba469f](https://qiita.com/maestro_shin1/items/fb8e4fef9ae8b8ba469f)
