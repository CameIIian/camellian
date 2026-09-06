---
title: 一番難しそうなPCVR、ALVRを触ってみる
description: 以前から興味があったもののWiVRnで満足していたため使ったことのなかったALVR使い始めるまでのメモ
date: 2026-04-07
tags:
  - SteamVR
  - Windows
---
ALVR: [https://github.com/alvr-org/ALVR](https://github.com/alvr-org/ALVR)  
VD環境に似たような構成になる？(VDにわか故間違ってるかも)
## 1. セットアップ
[Windows用Launcher](https://github.com/alvr-org/ALVR/releases/latest/download/alvr_launcher_windows.zip)をダウンロード(Winget版は古いか?)  
LauncherからALVR本体をinstall 
Launchを押して設定を開始  
ALVR用のVirtual Audio Cableをinstall  
Firewall を追加  
`Launch SteamVR`よりSteamVRを起動、連携

PCとヘッドセットを有線で繋ぎ、`install APK`  
もしくは、MetaStoreからALVRをダウンロード(パッチバージョンが違うくらいなら動作可)  
インストール後はPCからヘッドセットを認証(`Trust`)

ALVR上で`Headset microphone`を`Virtual Audio Cable`に  
SteamVRで、オーディオ入力デバイスを`Virtual Audio Cable`に

お好みで解像度を設定  
フレームレートはヘッドセットの設定に合わせる
## 2. 接続
ALVRクライアントを起動し、SteamVRを起動  
2回目以降はヘッドセットのALVRアプリから接続可  
ALVRがヘッドセットに接続済みなら、有線接続して`install APK`でもlaunch可

不要なら設定からSteamVR Homeを無効化しておくこと
## 3. OVR導入
[Github](https://github.com/OpenVR-Advanced-Settings/OpenVR-AdvancedSettings/releases)から取得(Wingetはこちらも古いか?)  
インストーラを実行

SpaceDrag設定と自動起動を設定
## 4. トラブルシューティング
- 手がグーにならない
人差し指/中指トリガー共に握り込みによりジェスチャーが曲線的に変化する  
これが災いしてか、親指がどう頑張っても手の内に入っていかない  
VRC内でのハントラ オン/オフに関わらず手がグーにならない

ハントラoff, 入力方式をQuest3, inputをsteamVR 2.0等色々やってたら治った  
気がする
## 5. 比較
メモリは潤沢なので省略、表内の数値はゲーム中から確認できるfps  
Win環境は全体的に解像度を低めに設定済  
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

| 構成  | 超軽量ログインワールド | SurRoom | Fish \[Easter\] |
| --- | ----------- | ------- | --------------- |
| 1a  | 63          | 47      | 40              |
| 1b  | 68          | 43      | 45              |
| 2c  | 67          | 42      | 42              |

SteamVR単体→ALVRで劇的な変化は無いが、多少改善は存在する  
SteamVRの端の映像が荒い問題はALVRと比べてもよく分からなかった  
SteamVR側の解像度とALVRの解像度を控えめにしたうえで、Upscaleをすればもうちょっと改善するかも
## 参考
VIVE Hubを捨ててALVRを使おうシリーズ　ALVRインストール編 - Qiita  
[https://qiita.com/mhoohmjwAsiya/items/4d5dfdf726c61a8d1c0b](https://qiita.com/mhoohmjwAsiya/items/4d5dfdf726c61a8d1c0b)

OVR導入完全ガイド！VRChatで高さ・姿勢・操作を自由に調整する方法 - ぶいなび  
[https://vrnavi.jp/ovr-advanced-settings/](https://vrnavi.jp/ovr-advanced-settings/)
