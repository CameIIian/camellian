# Linuxでもちふぃったが動くまで
Tag: VRChat, 改変
date: 2025/11/24

## 1. 準備するもの
- もちふぃった
> https://booth.pm/ja/items/7657840
- blender (native)
> https://store.steampowered.com/app/365670/Blender/
## 2. setup
1. もちふぃったの.unitypackageをインポート
2. BlenderへのPathを通す
```sh
# Blender用のディレクトリを作る (例)
cd ~/ALCOM/Projects/Project/
mkdir -p BlenderTools/blender-4.0.2-windows-x64
cd BlenderTools/blender-4.0.2-windows-x64

# exeファイルを起動する代わりにblenderを起動 (例)
echo "#\!/usr/bin/bash\n~/.steam/steam/steamapps/common/Blender/blender \"{@//\\\\\\//}\"" > blender.exe
chmod 744 blender.exe
```
丁寧に教えてくださり、ありがとうございます(.alcomtemplateの件も感謝です)
> https://x.com/kuroclef/status/1991861380736250006
3. パッケージのインストール
	- scipy
	- robust-weight-transfer
```sh
# ディレクトリへ移動 (例)
cd ~/.steam/steam/steamapps/common/Blender/5.0/python/bin/

# scipyのインストール
./python3.11 -m pip install -U pip
./pip3 install scipy

# robust-weight-transferのダウンロード
cd ~/Downloads/
curl -OL https://github.com/sentfromspacevr/robust-weight-transfer/releases/download/v1.1.6/robust-weight-transfer-v1.1.6.zip
```

SteamからBlenderを起動し、ポップアップを適当に回避
その後、**Edit > Preference > Addon**を開く
右上の下矢印から **Install from Disk** を押し、先ほどダウンロードした.**zip形式のフォルダ**からインストール

> https://github.com/sentfromspacevr/robust-weight-transfer/releases
> https://signyamo.blog/b4-5r_robust-wt/

## 3. トラブルシューティング
### ✗ ペア1 処理失敗
もちふぃった〜をアップデート等すると解決
## Appendix. A "{@//\\//}"って何？
テストコード
```sh
❯ cat test.sh                                                     
#!/usr/bin/bash
for loop in ${@//\\//}; do
	echo $loop
done

❯ ./test.sh "test" "/usr/bin /home/camellian" "C:\\ProgramData"
test
/usr/bin
/home/camellian
C:/ProgramData
```
- "$@"は"$*"とおおよそ同義
	- 今回の用途ではコマンドライン変数を引き継ぐため利用
- "$@"では1つの要素として連結されている部分を展開

ちゃっぴーとのお話
```
✅ 結論：${@//\\//} は Bash の「パラメータ展開置換構文」  
  
Bash には次の構文があります：  
${variable/pattern/replacement}  
  
その派生形で：  
${variable//pattern/replacement}  
は **“pattern の全一致を replacement に置換する”** という意味です。  
  
ここで、${@//\\//} は次のように解釈されます：  
  
$@ **全置換の区切り文字//** pattern=**\\** **区切り文字/** replacement=**/**  
  
 "//\\//" には **3つのスラッシュ区切りがある**ように見えるけど、  
実際は **pattern と replacement を / で区切っているだけ**です。
```
