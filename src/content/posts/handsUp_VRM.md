---
title: ルルネちゃん、世界を救って！
published: 2025-12-06
draft: false
description: 東方異域見聞 ~Touhou Dystopian~用にルルネをVRM化した際のメモ
tags:
  - VRM
  - Unity
---

## 0. 概要
東方異域見聞 ~Touhou Dystopian~用にVRMを作成した道筋
> https://store.steampowered.com/app/3265060/__Touhou_Dystopian/
## 1. 準備
改変キット
- ALCOM
- Unity 2022.3.22f1
- Liltoon
- Modular Avatar
- Avatar Optimizer
追加で以下も必要
- **NDMF VRM Exporter**
> https://github.com/hkrn/ndmf-vrm-exporter
## 2. 手順
VRMに変換したいアバターを一度VRC向けにアップロード
- テクスチャが正常でない場合は必要

1. アバターのrootに**VRM Export Description**を付ける
2. **VRM Export Description**の以下2つの項目を埋める
	- **Authors**: このVRMを変換した作者の名前、**必須**
	- **MToon Options**: シェーダ変換時の設定、**推奨**、全てチェック
3. 再生ボタンを押すと変換が始まる
## 3. ゲームで確認
移動例
```sh
cp "ALCOM/Projects/Rurune_VRM/Assets/NDMF VRM Exporter/Rurune_VRM/rurune.vrm" "nvme1/SteamLibrary/steamapps/common/Touhou Dystopian/Touhou Dystopian_Data/mods/Sample/Vrm_Player/"
```

ゲームを起動しModsを開く
rurune.vrmが表示されアバターの適応自体は問題なく出来た
## 4. トラブルシューティング
1. 重力に逆らうオブジェクト**(ジャンプした瞬間は正しい動きになる)  
 理由は、**Gravityが非常に弱く設定**されているから  
 VRCで何故これでまともに動くかは謎だが、**0.9**~**1**を代入すると解決
2. 髪の毛はまだ逆立つ/荒ぶりすぎ、胸がどこかに行く  
 諦めて短い髪を使用  
 髪を変えると胸も正常になった為、どこかが悪さしてた可能性?
 3. 髪が透けてる  
 マテリアルが標準のLiltoonを使うよう強制
 4. 表情が崩れている、スカートがめくれやすい  
 見なかったことにする
## 5. 動作の様子
> https://youtu.be/O8jMJ-rNaFU
## 参考
> https://note.com/sonoty_hearts/n/ne8b3838881e3