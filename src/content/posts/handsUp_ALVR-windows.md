---
title: 一番難しそうなPCVR、ALVRを触ってみる
published: 2026-01-01
draft: false
description: 以前から興味があったもののWiVRnで満足していたため使ったことのなかったALVR使い始めるまでのメモ
tags:
  - VRChat
  - Windows
---
ALVR: https://github.com/alvr-org/ALVR \
VD環境に似たような構成になる？(VDにわか故間違ってるかも)
## 1. セットアップ
[Windows用Launcher](https://github.com/alvr-org/ALVR/releases/latest/download/alvr_launcher_windows.zip)をダウンロード(Winget版は古いか?) \
LauncherからALVR本体をinstall \
Launchを押して設定を開始 \
ALVR用のVirtual Audio Cableをinstall \
Firewall を追加 \
`Launch SteamVR`よりSteamVRを起動、連携

PCとヘッドセットを有線で繋ぎ、`install APK` \
インストール後はPCからヘッドセットを認証(`Trust`)

ALVR上で`Headset microphone`を`Virtual Audio Cable`に \
SteamVRで、オーディオ入力デバイスを`Virtual Audio Cable`に

お好みで解像度を設定 \
フレームレートはヘッドセットの設定に合わせる
## 2. 接続
ALVRクライアントを起動し、SteamVRを起動 \
2回目以降はヘッドセットのALVRアプリから接続可 \
ALVRがヘッドセットに接続済みなら、有線接続して`install APK`でもlaunch可

不要なら設定からSteamVR Homeを無効化しておくこと
## 3. OVR導入
[Github](https://github.com/OpenVR-Advanced-Settings/OpenVR-AdvancedSettings/releases)から取得(Wingetはこちらも古いか?) \
インストーラを実行

SpaceDrag設定と自動起動を設定
## 4. トラブルシューティング
- 手がグーにならない
人差し指/中指トリガー共に握り込みによりジェスチャーが曲線的に変化する\
これが災いしてか、親指がどう頑張っても手の内に入っていかない

対処法としては、
## 5. 比較
メモリは潤沢なので省略、表内の数値はゲーム中から確認できるfps \
ハードウェア構成1 (Windows):
```
CPU: corei9 11900H
GPU: rtx 3060 laptop (6GB)
```
ハードウェア構成2 (Linux):
```
CPU: ryzen 5700x
GPU: rtx 5060 (8GB)
Proton: GE 10-32
```
ソフトウェア構成:
```
a. SteamVRのみ
b. SteamVR+ALVR
c. WiVRn
```

| 構成  | 超軽量ログインワールド | SurRoom | SlashCo(ロビー) |
| --- | ----------- | ------- | ------------ |
| 1a  |             |         |              |
| 1b  |             |         |              |
| 2c  |             |         |              |
## 参考
VIVE Hubを捨ててALVRを使おうシリーズ　ALVRインストール編 - Qiita
https://qiita.com/mhoohmjwAsiya/items/4d5dfdf726c61a8d1c0b

OVR導入完全ガイド！VRChatで高さ・姿勢・操作を自由に調整する方法 - ぶいなび
https://vrnavi.jp/ovr-advanced-settings/