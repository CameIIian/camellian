# Obsidian の迷い方
Tag: Linux, Android

## 1. install
- Obsidian
 LinuxにはAppImageで、AndroidはPlayストアからインストール
> https://obsidian.md/
- Dropbox
 Linuxのみインストールし、Cosmic Storeから行った
> https://www.dropbox.com/
## 2. setup
### Linuxでの設定
1. Obsidian.AppImageを取得
2. 必要であればデスクトップエントリを作成    
3. .AppImageから起動
4. Dropboxのバックアップフォルダ内にObsidian用のフォルダを作る    
5. Remote Saveをインストールする

エントリの一例
```sh
sudo echo "[Desktop Entry]
Name=Obsidian
Exec=/home/camellian/Applications/Obsidian-1.9.14.AppImage --no-sandbox
Icon=/home/camellian/Applications/obsidian-icon.png
Type=Application
Categories=Utility;" > /usr/share/applications/obsidian.desktop
```
アイコンはこちらから
> https://obsidian.md/blog/new-obsidian-icon/
参考
> https://qiita.com/akiralab/items/35ab02b1fa6db2e6c94f
### Androidでの設定
1. 任意のストアからObsidianをインストール
2. ユーザディレクトリ内にObsidian用のフォルダを作る
3. Remote Saveをインストールする
### Remote Saveのインストール
Remote Saveはコミュニティが開発するプラグイン
ダウンロード/有効化のためには、  
1. 歯車⚙の設定の中からコミュニティプラグインタブへアクセス  
2. コミュニティプラグインの有効化を押す  
3. 閲覧から"Remote Save"を探しインストール  
4. 注意事項に従い、問題がなければチェックして有効化  

有効化した後、コミュニティプラグインの設定を行う部分が追加される  
設定画面のコアプラグインの下に存在
1. クラウドサービスの選択→Dropbox  
2. 認証→Authを押してWebで認証(PC環境はURL？の入力が必要であった)  
3. 自動実行設定→1分毎に同期(スマホ環境では同期間隔を長くしてもよい)  
4. 起動時の実行→1秒後に同期  
5. 大きなファイルをスキップ→10MB(Android端末のみ)

参考
> https://note.com/penchi/n/nc1b42ccdf368
## 3. その他便利なプラグイン
### Outline
コアプラグインの部分から有効化出来るプラグイン  
三点リーダなどからアウトライン(章立て)を表示できる
### EditingToolbar
Word的な編集をサポートするバーを追加するプラグイン  
専ら文字の色を変えたい時や背景色を変えたい時に使う  

参考
> https://qiita.com/Kei_Adachi/items/1f5d01230334574f2e26#commander
## 4. 外観の変更
オプション > 外観 > テーマ > 管理 からテーマをダウンロード可
一番有名そうな"Minimal"に
アクセントカラーは元の色に近そうな紫になるように設定
- URLにもこの色が反映されるので背景色からは遠い色を選ぶのが懸命
## 5. トラブルシューティング
### Remote Saveが同期されない
"failed to sync"という記載が出た
- 削除されたファイルが多かった

手動で不要になったファイルをクラウドやローカルから削除
- 再び正常に同期されるようになった
