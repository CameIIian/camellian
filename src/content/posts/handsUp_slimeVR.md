---
title: SlimeVRでフルトラ
published: 2026-01-23
draft: true
description: linuxでフルトラするならオススメ
tags:
  - linux
  - VRChat
---
## SlimeVR setup
### java 17
install
```
sudo apt install openjdk-17-jre openjdk-17-jdk -y
```
### SlimeVR
flatpak version install
```
flatpak install flathub dev.slimevr.SlimeVR
flatpak run dev.slimevr.SlimeVR
```
環境によっては、ここで画面が黒一色になる

描画エラーの修正(Pop!\_OS22.04 + Nvidia RTX5060 + Flatpak環境で効果あり)
ハードウェアアクセラレーションの無効
```
flatpak override --user dev.slimevr.SlimeVR \
  --env=WEBKIT_DISABLE_COMPOSITING_MODE=1 \
  --env=WEBKIT_FORCE_SOFTWARE_RENDERING=1
```
Nvidia EGL を明示
```
flatpak override --user dev.slimevr.SlimeVR \
  --env=__GLX_VENDOR_LIBRARY_NAME=nvidia \
  --env=GBM_BACKEND=nvidia-drm
```
X11 を明示
```
flatpak override --user dev.slimevr.SlimeVR \
  --socket=x11 \
  --share=network \
  --device=dri

flatpak run dev.slimevr.SlimeVR
```
## Wrangler setup
install
```
cd ~/Documents/VRChat/
curl -OL https://github.com/carl-anders/slimevr-wrangler/releases/download/v0.11.0/slimevr-wrangler-ubuntu.zip 
unzip slimevr-wrangler-ubuntu.zip
rm -f slimevr-wrangler-ubuntu.zip
```

SlimeVRとWranglerどちらも起動するとSlimeVR側で新規トラッカーの検出が通知されるため許可

充電のために本体に指すとBluetoothを削除→追加の流れが必要でやや煩雑
接続が切れた際も同様

VRCの側に情報を送るために、
接続→割当→キャリブレーション→OSC有効

フルトラでVRC入るとちょっとレイテンシと言うか、スタッターを感じた
