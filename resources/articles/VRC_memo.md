# VRC改変雑多メモ
Tag: VRChat, 改変
date: 3000/01/01

### 改変教えて！
これ読め
https://vr-nmzw.fanbox.cc/posts/10800110
https://vr-nmzw.fanbox.cc/posts/11032427
### なんか動かない！
README読め
パッケージはアップデートしたか？
VCCは捨ててALCOMを使え
### テンプレートファイル読み込めない
拡張子が`.alcomtemplate`しか読み込まないから注意
### Unity動かしづらい！
Scene下のCenterをPivotに
赤青緑の下、Parspをisoに
タイルは自由に動かせ、VSCode的には左から縦長Hierarchy, 縦長inspector, 正方形Scene, 下にAssetsとかでいいんじゃない？
ついでに目のマークの左、重なった平面の下矢印からSkyboxを消す
### Unitu重い！
赤青緑の上、球場のマークは必要なときだけONにしろ
例) view pointの調整, AAO remove by boxの指定, SPSの調整など
### 〇〇が動かない！
同じシステムのバージョン、配布方法違いを複数入れてないか？
全部消して安定版1個入れろ
後README読め
### Lightのカラー
DirectionalLightのColorを白にすると正しい色になる
また、lilAvaterUtilsのライト項目でライティング毎の色の見え方を確認可
### 適当にBoneを消してるとルルネの尻尾が壊れる理由
Skirt_Rootの中に尻尾に影響するボーンがある
### 要らないテクスチャどこに居るの？
lilAvatarUtilsから確認可能
輪郭線などが忘れがち？
LAC Avater Compressor等に任せて極小サイズの画像にしてもいい
### アバター越しにワールドが透けて見える
レンダーキューを多少下げると解決しそう？
https://note.com/labo405/n/ne29acc4669c4#fb855b97-eb69-409a-b488-391d852ff25e
### 肌テクスチャの色変えが難しい！
乗算レイヤに赤とか白とかを薄く乗せて調整すると楽？
https://x.com/tuberoseVRC/status/1894665881017618700
### ヒール埋まる, 埋まる
FloorAjasterを使う
### つま先が浮く
FBXのConfigを弄ってToesのチェックを外してApply
https://x.com/kuroclef/status/1997617601313407087
### エフェクトが変(頬染めなど)
基本肌テクスチャ/マテリアルが原因
### SkinnedMeshの正しい減らし方
AAO_Merge_SkinnedMesh + AAO_Freeze_BlendShape
### 距離フェードコピペ用
ちー牛くんの白リムセットの一部には最初から入っている
服にも設定すると丁寧
1. 色
```
0a0707
```
2. 距離
```
0.18
```
4. 距離
```
0.95
```
5. 色
```
ffbcb1
```
6. 強度？
```
0.25
```
7. 距離？
```
4.5
```
### 表情/口の破綻対策
口はFaceEmoの口変形キャンセルキーを適切に設定？
表情は組み合わせを最適化するか、以下ツールでも修正可能？
https://lemoneru.booth.pm/items/7074770
https://lemoneru.booth.pm/items/7662586
### 非対応辛い
Kisetene 4 MA, もちふぃった(おーぷんふぃった), EDEN Auto Morpher
好きなの使え
### 衣装思いつかない
試着ワールドで試せ
### その他思いつかない
髪や肌マテリアルはまだ試着少ないから、有名人のBoothリストとかおすすめとか見てろ
それか人の改変をベースにアレンジしろ
## 外部ツール, 環境など
### 改変後の写真撮影場所が思いつかない
これとか？
https://www.astrolens.dev/about
### Avatar用テンプレート？Git管理のすゝめ
要山くろね様より、ブランチ切ったり前のコミットに戻れたりと一度構築できたら便利
### Linux + WiVRn, pipewire環境で音声入出力が壊れた時の対処方法
pipewireの再起動
```
systemctl --user restart pipewire pipewire-pulse wireplumber
```
### Linux対応のフルトラはどれ？
- SlimeVR
	SlimeVR 用トラッカー, Vive, Tundra?, mocopi, haritoraX, Revocap, Axis?, Somatic?
	**switchジョイコン**, Wiiコントローラ, 2ds/3ds, DualShock/Sence
### Linuxで顔トラ動かん
どうせPathでトラブってるから
SymLink張れ
https://x.com/Kavyana_chan/status/1992992786740908092
### WindowsでVRCした方がいいよ
帰れ
