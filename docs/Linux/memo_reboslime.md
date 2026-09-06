---
title: ReboSlimeを読み解く
date: 2026-04-26
description: いつかForkするかもしれないReboSlimeとにらめっこした
tags:
  - Linux
  - VRChat
---

## RevoSlime
### .gitignore, .gitattributes
gitで追跡しないファイルの定義, ファイルのtext属性を定義

text属性 … 主に改行コードの扱いに関して取り決めたもの, githubはLFで統一したさそう

### config.json
{  
    version: RevoSlimeのversion (何かの判断基準になっているわけではない),  
    ip, port: slimeVR_serverとの通信用  
    tps: slimeVR_serverとのパケット送信の頻度 (300以下推奨)  
    imus: 有効なトラッカー番号の割り当て(0が必ず入っているため、無効なトラッカーが1つ表示される問題が残ってたかも),  
    parent_node: `revoslime.py`では参照されていない変数 (24要素あるため、トラッカーと部位との何らかの対応関係に使おうとしていたか？)  
}

### LICENSE
MIT  
- 商用、非商用問わず利用可  
- 全ての再配布を許可  
- 使うときは、`著作権表示`と`MIT LICENSEの全文`の記載が義務  
- ソフトウェアに関する責任を作者は取らない

参考: [https://qiita.com/takobuta_dev/items/120e710ab99721e98f8d](https://qiita.com/takobuta_dev/items/120e710ab99721e98f8d)

### run.bat
`poetry`で`reboslime.py`を動かしてるだけ  
-> pythonで実行するなら`uv`に移行すべき

revocapのlibsを他言語からロードできるなら移行も視野に

### reboslime.py
- import socket  
`TCP/IP`レベルでプログラム間の通信を行う際に利用可能なパッケージ

- import struct  
Cにおける構造体を定義する仕組みとはやや異なり、  
1. Pythonオブジェクトと`バイナリ`を相互変換するためのPackage  
2. ファイルフォーマットの解析や`ネットワークプロトコルの処理`で使うことが多いらしい

参考: [https://qiita.com/Aqua-218/items/f8c71bf96334e08d0e31](https://qiita.com/Aqua-218/items/f8c71bf96334e08d0e31)

- import signal  
シグナルを受け取った際に実行する非同期処理を定義できるPackage

シグナル … Unix系OSで、プロセスに対してカーネル等が要求を通知する仕組み

- from libs.inputimeout import -  
タイムアウト付き、マルチプラットフォームで利用可能なinput()関数

作者: [https://qiita.com/johejo/items/8e724110a008b27d6c1f](https://qiita.com/johejo/items/8e724110a008b27d6c1f)

- from rich.console import -  
ターミナルへの出力を成型できるPackage  
とてもカラフルにすることができる

-> なぜ個別のrichやinputimeoutが使用されているのか？  
 置き換えても問題ないならPyPI版に置き換える (versionやブランチ周辺を調べる)

参考: [https://qiita.com/cvusk/items/0c9fdf1fd12097f4a1b4](https://qiita.com/cvusk/items/0c9fdf1fd12097f4a1b4)

- from libs.rebocap import -  
`.py`は`.h`と同様の役割しか果たしてなさそう  
`.pyd`が`.dll`相当の役割を果たしてそう(読めない)

公式リポジトリから関数の内容を参照する必要あり  
付属のREADMEも読むこと

-> もしも新しいバージョンのpython用libsが利用可能になっているなら置き換える

- ZERO_QUAT  
未使用、\[w, x, y, z\]の初期値？

-

- sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  
socketオブジェクトの作成。ここでは、アドレスファミリとソケット種別を指定  
1. AF_INET: IPv4  
2. SOCK_DGRAM: UDP接続

参照: [https://ryuichi1208.hateblo.jp/entry/2020/03/20/144644](https://ryuichi1208.hateblo.jp/entry/2020/03/20/144644)

-

- def pose_msg_callback()  
コメントには姿勢データのコールバックと書かれている  
トラッカーからデータを受け取った際、`update_imu_quat()`に  
1. トラッカー番号  
2. 各トラッカーの0\~3番目の要素     (4\~7番目はどこに？)  
を引数として、トラッカーの数だけ実行している

コールバック … ある関数を呼び出す際に、その途中で別の関数を実行する手法  
コールバック関数 … 引数として関数に渡される関数

参考: [https://e-words.jp/w/%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF.html](https://e-words.jp/w/%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF.html)

tran, pose24はrebocap/README.mdを参照

- def exception_close_callback()  
恐らく、異常終了の際の処理  
一旦接続を終了し、再度初期化(`init_revocap_ws()`)

- def init_revocap_ws()  
初期化を行っている  
1. revocapのsdkの読み込み  
2. 各種コールバックに使用する関数の定義  
3. トラッカーとの接続の開始  
4. 接続状態の確認

- def build_handshake()  
どのような値を交換するかを決定するパケットを構成する関数

ハンドシェイク … 通信相手の機器と、接続の確認、通信方法や接続方式の交換を行う

 + struct.packについて  
 pack("フォーマット形式", 値1, ...)

 フォーマット形式  
  + int型: `B`(unsigned char), `i`(signed int), `I`(unsigned int), `Q`(unsigned long long)  
  + 文字列型: `〇s`(文字列〇個分)

 エンディアン指定  
  + `>`(ビッグエンディアン)

 エンディアン … 通信の際のバイトの並び列のこと  
 ビッグエンディアン … 最上位バイトを最も若いアドレスに置く (例: 0x12345678 -> 12 34 56 78)

参考: [https://qiita.com/yuu_7_ns/items/82fd791c7286c5cad43e](https://qiita.com/yuu_7_ns/items/82fd791c7286c5cad43e)

- def add_imu()  
トラッカーを追加する/した時の通信を行う関数

- def add_imus()  
各トラッカーにおいて`add_imu()`を実行する関数
呼び出し前にトラッカーの個数を規定か判断す必要がある

\[6, 8, 10, 12, 15\]

- def build_rotation_packet()  
現在のトラッカーの状態`(w,x,y,z)`を取得するためのパケットを構成する関数  
`z`は回転のこと

- def send_all_imus()  
実際にトラッキングデータを得るためにパケットの構成->送信まで行う関数

- def update_imu_quat()  
quatは4次元のこと->`(w,x,y,z)`   
4次元データを`sock.sendto()`でslimeVR_serverへ送信
