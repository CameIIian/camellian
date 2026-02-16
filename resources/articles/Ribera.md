# お姉ちゃんRiberaちゃん改変がしたかった
Tag: VRChat, 改変
date: 2026/02/02

改変の基礎はわかっている前提で話させてもらう
わからなければ以下へ
	https://vr-nmzw.fanbox.cc/posts/10800110
## 準備するもの (特筆すべきもののみ)
- ボクの.alcomtemplateに含まれるパッケージと.alcomtemplate
	https://github.com/CameIIian/dotfiles
- Riberaちゃん
	https://ensuiuni.booth.pm/items/6253733
## やること
### 衣装
着せたいなら現在なら
- もちふぃった
- EDEN Auto Morpher
等の変換系ツールを使うが吉
EDENはRiberaちゃんに対応しているかは不明

体の形が近いと破綻が少ないため
**上半身が細くない有名な子**から変換できると最適
#### 変換精度リスト(もちふぃった)
| 変換元 | 精度                         |
| ------ | -------------------------- |
| マヌカ | 上半身が貧弱なため、肩周り部分が怪しい。ガンダムる。 |
| 桔梗　 | 良さげに見える                    |
| しなの | 良さげに見える                    |
### ネイル
非対応を頑張ってつけよう
指なら10個BoneProxyするだけ
### スケール調整
MA Scale Ajastar が上手く効かない
以下は一例
- Bust.L/R: `1.4`, `1.2`, `1.45`
- neck/head: `0.94`, `0.94`, `0.94`
- upperleg/lower_leg.L/R: `1.1`, `1`, `1.1`
- BustL/R: `0.9`, `0.875`, `0.975`
注意点は以下2つ
- フルトラ動かないかも(股関節の角度が問題)
- 衣装やアクセサリ類の位置調整も適宜行うこと
### テクスチャ/マテリアル変更
#### 追加
- メイクテクスチャ(体/顔)
- アイテクスチャ
	例: https://kokoroyori.booth.pm/items/7520433

- 汎用系の肌マテリアル
	例: https://namazuda.booth.pm/items/6562939
- リム
	例: https://chigyuisgod.booth.pm/items/6297256
### ギミック追加
#### モーション修正
1. HandgestureEX
	https://rabbit-luvit.booth.pm/items/6927524
2. MashmallowPB
	https://wataame89.booth.pm/items/4511536
3. モーション系
	- Gogo Loco
		https://booth.pm/ja/items/3290806
	- ごろ寝
		https://minminmart.booth.pm/items/2886739
		https://minminmart.booth.pm/items/4233545
	- かわいいPose
		https://booth.pm/ja/items/5479202
4. FaceEmo
	https://suzuryg.github.io/face-emo/ja/
	https://select-ssc.booth.pm/items/7393446
#### 便利系
- LightLimitChanger
	https://azukimochi.github.io/LLC-Docs/
- 赤夜撫で音 (導入案)
- 心音系 (導入案)
- タバコ (導入案)
- 衣装に合わせた小物 (導入案, ドリンク等) 
### メニューの追加/修正 (一例)
不要な項目や深すぎる階層構造は**基本的に**避けるべき
```
root
┣ ごろ寝
┣ ギミック
┃ ┣ リアキス
┃ ┣ ジェスチャーEX
┃ ┗ 赤夜注射
┣ 衣装
┃ ┣ 髪 (デフォルト)
┃ ┣ LLC
┃ ┗ ましゅまろPB
┗ FaceEmo
```
### 最適化
1. MA Trace & Optimize
2. LilAvatarUtils
	- 大きすぎるテクスチャを圧縮
	- 非推奨なクランチ圧縮は削除
	- 光の当たり方を確認(暗所で無駄に発光していないか)