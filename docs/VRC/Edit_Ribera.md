---
title: Riberaちゃん改変メモ
description: リベラちゃんを改変する上でやっていること
date: 2026-02-02
tags:
  - VRChat
  - Unity
---
改変の基礎はわかっている前提で話させてもらう  
わからなければ以下等  
[https://vr-nmzw.fanbox.cc/posts/10800110](https://vr-nmzw.fanbox.cc/posts/10800110)

## 準備するもの (特筆すべきもののみ)
- [.alcomtemplate](https://github.com/CameIIian/dotfiles/blob/main/CamellianAvatarTemplate.alcomtemplate)  
- [Riberaちゃん](https://ensuiuni.booth.pm/items/6253733)
## やること
### 衣装
着せたいなら現在なら  
- もちふぃった  
- キメラ  
の2択。もちふぃったも完全ではないし、キメラもアニメータが壊れる?ため一長一短か  

体の形が近いと破綻が少ないため、**上半身が細くない有名な子**から変換できると最適  
#### 変換精度リスト(もちふぃった)
| 変換元 | 精度                                 |
| --- | ---------------------------------- |
| マヌカ | 肩周り部分が怪しい。ガンダムる。                   |
| 桔梗  | 良さげ？Bust.L/Rの名称のせいで追従が上手く行かないこともある |
| しなの | 良さげ？同上                             |

### ネイル
非対応を頑張ってつけよう、その方が選択肢が増える  
指なら10個BoneProxyするだけ  
Prefab Variantにすれば次回以降の手間も省ける  
### スケール調整
MA Scale Adjastarを併用  
動かない場合はupgrade/downgrade推奨  
- Bust.L/R: ``1.2``, 盛ると形が崩れやすい為ShapeKeyを併用することを推奨  
- neck/head: ``0.95``  
- upperleg/lower_leg.L/R: ``1.1``, ``1``, ``1.1``, 必要に合わせてPositionを修正すること  
- hips: `1.1`,`1`,`1.1`, hips/chest等のサイズ修正の影響がtongueに出ることがある？  
- chest: ``0.95``, ``1``, ``0.95``, 非対応着せる場合は小さくしたほうが着せやすいことも  

破綻がある場合は表情アニメーションの`tongue.001`のpositionを変更  
position: `0`,`0.003`,`0.06`  
scale:`0.9`  
### テクスチャ/マテリアル変更
#### 追加
- メイクテクスチャ(体/顔)  
- アイテクスチャ  
	例: [https://kokoroyori.booth.pm/items/7520433](https://kokoroyori.booth.pm/items/7520433)  

- 汎用系の肌マテリアル  
	例: [https://namazuda.booth.pm/items/6562939](https://namazuda.booth.pm/items/6562939)  
- リム  
	例: [https://chigyuisgod.booth.pm/items/6297256](https://chigyuisgod.booth.pm/items/6297256)  
### ギミック追加
#### モーション修正
1. HandgestureEX  
	[https://rabbit-luvit.booth.pm/items/6927524](https://rabbit-luvit.booth.pm/items/6927524)  
2. MashmallowPB  
	[https://wataame89.booth.pm/items/4511536](https://wataame89.booth.pm/items/4511536)  
3. モーション系  
	- Gogo Loco  
		[https://booth.pm/ja/items/3290806](https://booth.pm/ja/items/3290806)  
	- ごろ寝  
		[https://minminmart.booth.pm/items/2886739](https://minminmart.booth.pm/items/2886739)  
		[https://minminmart.booth.pm/items/4233545](https://minminmart.booth.pm/items/4233545)  
	- かわいいPose  
		[https://booth.pm/ja/items/5479202](https://booth.pm/ja/items/5479202)  
4. FaceEmo  
	[https://suzuryg.github.io/face-emo/ja/](https://suzuryg.github.io/face-emo/ja/)  
	[https://select-ssc.booth.pm/items/7393446](https://select-ssc.booth.pm/items/7393446)  
#### 便利系
- LightLimitChanger  
	[https://azukimochi.github.io/LLC-Docs/](https://azukimochi.github.io/LLC-Docs/)  
- アバターペン  
	[https://booth.pm/ja/items/6113734](https://booth.pm/ja/items/6113734)  
- sit判定  
	[https://booth.pm/ja/items/6795343](https://booth.pm/ja/items/6795343)  
#### その他
- 赤夜撫で音  
	[http://booth.pm/ja/items/6174567](http://booth.pm/ja/items/6174567)  
- 心音系  
	[https://booth.pm/ja/items/5316535](https://booth.pm/ja/items/5316535)  
- タバコ  
	[https://booth.pm/ja/items/4835743](https://booth.pm/ja/items/4835743)  
### メニューの追加/修正 (一例)
不要な項目や深すぎる階層構造は**避けるべき**  
以下の構成なら6角型になる  
```
root
┣ ごろ寝
┃ ┗ :
┣ ギミック
┃ ┣ リアキス
┃ ┣ :
┃ ┗ ジェスチャーEX
┣ 衣装
┃ ┣ 衣装ON/OFFスイッチ1
┃ ┣ :
┃ ┣ LLC
┃ ┗ ましゅまろPB
┗ FaceEmo
  ┗ :
```
### 最適化
1. MA Trace & Optimize  
2. LilAvatarUtils  
	- 大きすぎるテクスチャを圧縮  
	- 非推奨なクランチ圧縮は削除  
	- 光の当たり方を確認(暗所で無駄に発光していないか)
