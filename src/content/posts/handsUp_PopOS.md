---
title: 始めまして、Pop!_OS
published: 2025-09-15
draft: false
description: Pop!_OSをインストール、VRChat生活を送れるようにするまでのメモ。
tags:
  - linux
  - VRChat
  - recommend
---
## 1. install
Rufus等でインストールメディアを作る
Nvidia GPUが乗っているので、`with Nvidia`を選択
> https://system76.com/pop/download/?srsltid=AfmBOor_bMXD8pNxHplnUQtkrCh3tLD9oS2ceUX8oABLSYwVOGcHu1L3

**fTPMを無効**にして、usbドライブから起動
GUIに沿ってインストール
詳しい流れは以下金子研の資料が参考になる
> https://www.kkaneko.jp/tools/linux/popos.html

## 2. setup
### 2.1. update
```sh
sudo apt update
sudo apt full-upgrade
sudo apt autoremove
sudo apt autoclean
```
### 2.2. install Nvidia driver
```sh
sudo apt install system76-driver-nvidia
```
再インストールしたい場合は、上記を削除して以下実行
```sh
sudo apt purge nvidia*
```
### 2.3. install applications
#### cosmic store
GUIストア、Pop!\_shopの代わり
```sh
sudo apt install cosmic-store
```
#### Tilix
分割ターミナル、悪くない
```sh
sudo apt install tilix
```
#### VSCode
コード類書くなら僕はこれ
```sh
sudo apt install code
```
#### meld
差分をGUIで見れる、diffにわかなので助かっている
```sh
sudo apt install meld
```
#### gitKraken
ブランチが見やすくてお気に入り
```sh
sudo apt install ./gitkraken-amd64.deb
```
> https://www.gitkraken.com/
#### gimp, krita
お絵描きソフト、kritaばっか使ってる
```sh
sudo apt install gimp krita
```
#### audacity, reaper
人をおもちゃにする為のツール
```sh
sudo apt install audacity 
./install-reaper.sh
```
> https://www.reaper.fm/download.php
#### flameshot
スクショアプリ、撮った直後にそのまま書き込めたり、隠せたりして便利
```sh
sudo apt install flameshot
```
#### simple screen recoder
軽量録画アプリ、入力ソースが少ないならこれで良い
```sh
sudo apt install simplescreenrecorder
```
#### vlc, rhiyhmbox
音楽流す用、なんでもいい
```sh
sudo apt install rhythmbox vlc 
```
#### font-manager
フォントを追加する用、無くてもいいけど楽
```sh
sudo apt install font-manager
```
#### OpenRGB
光り物制御用、XPGのメモリは対応しててラッキー
```sh
sudo apt install ./openrgb_XXX_amd64_XXX_XXX.deb
```
> https://openrgb.org/releases.html
#### python
小物作ったり、NextCord動かしたり用
```sh
sudo apt install python3 python3-pip
```
#### uv, pixi, pyenv
真面目にやるときはuv/pixi
面倒くさくてHome Directoryに設定してるのはpyenv
```sh
# uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# pixi
curl -fsSL https://pixi.sh/install.sh | sh

# pyenv
sudo apt install build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev curl \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
cd ~/.pyenv && src/configure && make -C src
```
#### rust
便利なツール使う用
```sh
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
#### java
slimeVRの依存関係として
```sh
sudo apt install openjdk-17-jre openjdk-17-jdk -y
```
#### Typescript
サイトを作る用
```sh
sudo apt install typescript
```
#### nvm
node.jsの管理用。便利
```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```
#### latex
卒論用に使った
```sh
sudo apt install -y texlive-lang-japanese  texlive-latex-extra texlive-luatex evince texlive-science
```
#### libreOffice
同上
```sh
sudo apt -y install libreoffice libreoffice-l10n-ja libreoffice-help-ja
```
#### AppImageを取得するもの
##### Obsidian
メモ用、階層構造のおかげでメモを無くしにくい
> https://obsidian.md/
##### ALCOM
最強のvcc環境
> http://vrc-get.anatawa12.com/ja/alcom/
##### VRCX
闇魔術への対抗作
> https://github.com/vrcx-team/VRCX
#### 他Cosmic_Store経由でインストールするもの
##### 日用
- Chrome, Vivaldi等
- gThumb
- DropBox
- GParted
- OBS Stadio
##### ゲーム
- steam (**非Flatpak版**)
- WiVRn
- SlimeVR
- Atlauncher
- Azahar
#### ターミナル用
```sh
sudo apt install btop clamtk duf fastfetch fd-find ffmpeg ripgrep mangohud neovim p7zip-full tldr xrdp xsel
cargo install jnv
cargo add dust
```
##### eza
gpgキーを追加してからinstall
```sh
sudo mkdir -p /etc/apt/keyrings
wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg
echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list
sudo chmod 644 /etc/apt/keyrings/gierens.gpg /etc/apt/sources.list.d/gierens.list
sudo apt update
sudo apt install -y eza
```
##### helix
初心者用nvim的なエディタ、密かなお気に入り
```sh
sudo add-apt-repository ppa:maveonair/helix-editor
sudo apt update
sudo apt install helix
```
##### scrcpy
Androidミラーリング用
```sh
sudo apt install android-tools-adb android-tools-fastboot -y

# for Debian/Ubuntu
sudo apt install ffmpeg libsdl2-2.0-0 adb wget \
     gcc git pkg-config meson ninja-build libsdl2-dev \
     libavcodec-dev libavdevice-dev libavformat-dev libavutil-dev \
	 libswresample-dev libusb-1.0-0 libusb-1.0-0-dev

git clone https://github.com/Genymobile/scrcpy
cd scrcpy
./install_release.sh
```
> https://github.com/Genymobile/scrcpy?tab=readme-ov-file
##### yt-dlp
Youtube等からの動画取得用
```sh
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ~/.local/bin/yt-dlp chmod a+rx ~/.local/bin/yt-dlp
```
> https://github.com/yt-dlp/yt-dlp/wiki/Installation
#### Unity
改変のためのもの
```sh
wget -qO - https://hub.unity3d.com/linux/keys/public | gpg --dearmor | sudo tee /usr/share/keyrings/Unity_Technologies_ApS.gpg > /dev/null
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/Unity_Technologies_ApS.gpg] https://hub.unity3d.com/linux/repos/deb stable main" > /etc/apt/sources.list.d/unityhub.list'
sudo apt update
sudo apt-get install unityhub
```
#### osu!
たまにやる音ゲー
```sh
git clone https://github.com/NelloKudo/osu-winello.git cd osu-winello chmod +x ./osu-winello.sh ./osu-winello.sh
```
### 2.4. keyboard settings
#### 日/英 切り替え方法の追加
1. 入力ソースに日本語(Mozc)を追加、その他は削除  
2. キーボードのショートカットにctrl+spaceを空に  
	IME有効/無効にそれぞれctrl+spaceを割り当てる
#### 便利なショートカットの割当変更
1. ワークスペース表示 : Super+D→Super+W  
2. 全アプリの表示 : Super+A  
3. コマンド実行 : ALT+F2→Super+R  
4. 通知の表示 : Super+V→Super+N
5. ワークスペース**n**にフォーカス(**n**=1~4) : Disabled→Super+**n**  
6. ワークスペース**n**に移動する(**n**=1~4) : Disabled→Super+Shift+**n**
7. ホームフォルダー : Super+F  
8. 設定を起動 : Disabled→Super+S  
9. マイクのミュート : Disabled→Super+M  
10. スピーカのミュート : Disabled→Super+Shift+M
#### 独自のショートカットの追加
1. Tilix(設定から"新しいインスタンスの開始時"を"Focus Window"に)  
	コマンド : /usr/bin/tilix  
	割り当て : Super+T  
2. Discord  
	コマンド : /usr/bin/discord  
	割り当て : Super+D  
3. flameshot  
	コマンド : /usr/bin/flameshot gui  
	割り当て : PrintScreen
### 2.5. font settings
font mangerで`Noto sans CJK JP Regular`  
Tilixの設定から`MesloLGS NF Regular`
### 2.6. change default shell
zshの準備
```sh
sudo apt install zsh
chsh -s $(which zsh)
```
カスタマイズ
```sh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
> https://qiita.com/shun198/items/c60ec1cce9c9bf1e8c26
### 2.7. Python venv setting
pyenv
```sh
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

source ~/.zshrc

pyenv install ３.13.X
cd ~/Documents/
pyenv local 3.13.X
```
> https://qiita.com/Ryo8-k2arl/items/d7220d4f19c76686ef52
### 2.8. Change audio-in sampling rate
実行内容
```sh
sudo hx /usr/share/pipewire/pipewire.conf
systemctl --user restart pipewire
```
書き換え
```
default.clock.rate = 96000
default.clock.min-quantum = 24
```
> https://zenn.dev/comtank/articles/d36f9bca4a0a5d
### 2.9. add SSD
1. GPartedでext4でフォーマット
2. ホームディレクトリにマウント用のフォルダを作成
3. nvmeのディレクトリにssdをマウントするためにPTUUIDを調べる
```sh
sudo blkid /dev/nvme1n1p1
/dev/nvme1n1p1: UUID="e885315b-50e6-4063-a396-01b27e5e83d8" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="...(略)"
```
4. /etc/fstabにUUID含めて追記(2枚目のssdだから後ろに2が付いてる)
```
UUID=e885315b-50e6-4063-a396-01b27e5e83d8 /home/camellian/nvme1 ext4 discard,defaults 0 2
```
以上で認識
利便性の為、所有権を付与するべき
```sh
sudo chown camellian:camellian ./nvme1
```
> https://ichiri.biz/tech/linux%E3%80%80%E8%BF%BD%E5%8A%A0ssd%E3%80%80%E8%A8%AD%E5%AE%9A%E6%96%B9%E6%B3%95-%E7%B0%A1%E5%8D%98/
### 2.10. make App icon
`/usr/share/applications/`にデスクトップエントリを作るとアイコンが作れる
#### flameshot (編集)
```sh
# /usr/share/applications/org.flameshot.Flameshot.desktop
# 40行目
Exec=/usr/bin/flameshot gui
# 46行目
StartupWMClass=/usr/bin/flameshot gui
```
#### ALCOM (新規)
```sh
[Desktop Entry]
Name=ALCOM
Exec=/home/camellian/Applications/alcom-1.1.4-x86_64.AppImage
icon=/home/camellian/Applications/alcom.png
Type=Application
Categories=Utility;
```
## 3. startup VRC
### 3.1. install vrc
steamから
1. VRChat
2. Proton EasyAntiCheat Runtime
を取得
### 3.2. install WiVRn
SteamVRに該当するツール
Cosmic_StoreにもFlatpak版がある
```sh
flatpak install flathub io.github.wivrn.wivrn
```
Space Drag用にWayVRも推奨
> https://github.com/wlx-team/wayvr/releases
### 3.3. get proron driver
VRChat用に、proton-ge (または proton-ge-rtsp) を使う
> https://github.com/GloriousEggroll/proton-ge-custom
> https://github.com/SpookySkeletons/proton-ge-rtsp
```sh
tar -xf GE-Proton*.tar.gz -C ~/.steam/root/compatibilitytools.d/
```
### 3.4. start WiVRn
1. QuestとLinux、両方でWiVRnを起動してセットアップウィザード実行
	無線での連携ががおすすめ
2. Linux側で自動起動するアプリにWayVRを選択
### 3.5. make symbolic link
steamまでのpathは環境によって変わる
```sh
cd ~/Pictures
ln -s ~/.steam/steam/steamapps/compatdata/438100/pfx/drive_c/users/steamuser/Pictures/VRChat
```
### 3.6. deprioritize IPv6
以下から編集
```sh
sudo hx /etc/gai.conf
```
以下のコメントを外す
```sh
precedence ::ffff:0:0/96 100
```
ネット関係をリスタートして、pingがIPv4で見えてたらOK
> https://4thsight.xyz/695
### 3.7. setting mangohud
オーバーレイアプリ
スト6はあると動かなかったので、たまに注意が必要かも

以下コンフィグのfps_limitを変更することで、ゲーム側が無制限でも制限可
> https://raw.githubusercontent.com/flightlessmango/MangoHud/master/data/MangoHud.conf

> https://steamcommunity.com/sharedfiles/filedetails/?id=3011121260
### 3.8. start FullBody-Tracking
Ubuntu22.04+X11環境用に起動するための設定
#### ハードウェアアクセラレーションの無効化
```sh
flatpak override --user dev.slimevr.SlimeVR \
  --env=WEBKIT_DISABLE_COMPOSITING_MODE=1 \
  --env=WEBKIT_FORCE_SOFTWARE_RENDERING=1
```
#### Nvidia EGL を明記
```sh
flatpak override --user dev.slimevr.SlimeVR \
  --env=__GLX_VENDOR_LIBRARY_NAME=nvidia \
  --env=GBM_BACKEND=nvidia-drm
```
#### X11 を明記
```sh
flatpak override --user dev.slimevr.SlimeVR \
  --socket=x11 \
  --share=network \
  --device=dri

flatpak run dev.slimevr.SlimeVR
```

後は
- SlimeVR側でOSC, VRC OSCを有効化
- Quest側のWiVRnからフルトラをON
	- 設定から下半身と腰のトラッキングをON 

で動作する
### 3.9. WayVRのカスタマイズ
.xmlを編集すると時計やキーボードなどを編集可能
以下に例を示す
> https://github.com/CameIIian/dotfiles
## 4. startup VRC-Modification
### 4.1. ALCOM上での設定
ALCOMを起動
- 指示に従い、対応するUnityをインストール
- 起動後はWin環境とおおよそ同様
### 4.2. 改変する
アップロードの前に、Taget Platformを追加すること
しないと、Win/Android/iOS向けにアップロードできない
>https://qiita.com/saku-1192/items/635ddb5f28040d70e968

.alcomtemplateも便利なので活用できると良い

しばらくLinuxで改変しているが、トラブルは
- コンパイルするまでおかしいテクスチャがある
- レンダリングの問題がたまにある

程度。レンダリングは、Unity上でVulkanレンダラを強制すると改善するかも
### 4.4. Projectのコピー
sshサーバを立て、SFTPでファイルをコピー
```
systemctl start sshd
```
Win側はWinSCPを利用
必要事項を埋めて接続、`~/ALCOM/Project`へコピー
送信後は、sshをkillすること
> https://forest.watch.impress.co.jp/library/software/winscp/
## 5. trouble shooting
### 5.1. Bootloader破損
Pop!\_shopに壊された。使うな
- 再起動するとInitramfsの画面に
- exitしてfsckすれば治るとの記述
	- 遭遇した際はできなかったので**リカバリディスクから復旧**
```
# /dev/ 以降は環境によって異なるためlsblk等で確認すること
sudo mount /dev/nvme0n1p1 /mnt
sudo chroot /mnt
sudo dpkg --configure -a
exit
sudo shutdown -r now
```
> https://support.system76.com/articles/bootloader/
### 5.2. Super効かない
上記の問題に対応すべくガチャガチャやっていたら効かなくなった
Spキーの有効/無効の切り替えがSp+F6になってた
### 5.3. WayVR(旧wlx-overlay-s)のオーバーレイ画面利用でマウスが効かなくなる
最近起きてない
- 症状が軽微なら設定画面のマウスとタッチパッドを開くと治る
- 症状が重い場合は、ctrl+alt+F6等でターミナルに入り再起動する
### 5.4. "xrizer has crashed!"が出る
たまにクラッシュする時に出たり。
- 基本起動しなおせば良い
- WiVRnのソースが壊れていていることも。その場合はWiVRnをreinstall
### 5.5. "Build&Test your world"をするとTestが始まらない
ワールド作成におけるMac/Linux環境共通の問題
タスクキルすること
### 5.6. ~/.local/share/fonts下へのフォント追加後にデフォルトフォントが変更されてしまう
未だよくわからん
該当箇所にインストール後、変わって欲しくないフォントが変わるように
- Documents/myFonts/等フォントフォルダを作る  
- 必要なときのみcpして読み込み、使い終わったらrm
### 5.7. OBSで録画できない
"XSHM"で画面録画すること
> https://www.reddit.com/r/Ubuntu/comments/17e65dw/cant_record_screen_with_obs/
### 5.8. Unityの画面が変
可能ならVulkanで実行すると良い`-force-vulkan`
ただしPop!\_OSでは、RTX50X0(580driver)+2022.3.22f1では動作しなかったので工夫が必要
## Appendix
### A. ~/.zshrc
```sh
# zsh settings
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="powerlevel10k/powerlevel10k"
zstyle ':omz:update' mode auto
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)

# load oh-my-zsh
source $ZSH/oh-my-zsh.sh

### begin options
HISTSIZE=1000               # ヒストリに保存するコマンド数
SAVEHIST=1000               # ヒストリファイルに保存するコマンド数
setopt hist_ignore_all_dups # 重複するコマンド行は古い方を削除。
setopt hist_ignore_dups     # 直前と同じコマンドラインはヒストリに追加しない。
setopt hist_no_store        # historyコマンドは履歴に登録しない。
setopt hist_reduce_blanks   # 余分な空白は詰めて記録。
setopt correct              # タイポした際に聞き直す。

# ctrl Rでヒストリ検索
bindkey ^R history-incremental-search-backward

# aliasの読み込み
[ -z "$PS1" ] && return
source ~/.zsh_aliases

# cargoの読み込み
. "$HOME/.cargo/env"

# pixiの読み込み
export PATH="$HOME/.pixi/bin:$PATH"

# pyenvの設定
export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# nvm for node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
### end options

# p10kテーマの適用
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```
### B. ~/.zsh_aliases
```sh
# 実行不可の際に終了する
[ -z "$PS1" ] && return

# dotファイルの編集
alias zshrc='vi ~/.zshrc'
alias zsh_aliases='vi ~/.zsh_aliases'

# 確認の追加
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'

### 元コマンドのアルファベット順
# btop - top代替
alias top='btop'

alias c='clear'

alias d='docker'

# duf - df代替
alias df='duf'

# eza - ls代替
alias l=' eza -F --icons --group-directories-first'
alias ls='eza -F --icons --group-directories-first'
alias sl='eza -F --icons --group-directories-first'
alias ll='eza -alhF --icons --group-directories-first'
alias lr='eza -alhF -R -L 2 --icons --group-directories-first --absolute on'
alias ld='eza -alhD --icons --group-directories-first'
alias lf='eza -alhfF --icons --group-directories-first'
alias t='tree'
alias tree='eza -alhF -T -L 2 --icons'

# fd-find - find代替
alias find='fdfind'
alias fd='fdfind'

# jn - インタラクティブなjq
alias jn='jnv'

alias m='mkdir'

alias ln='ln -srnf'

# nvtop - nVidia用gpu版top
alias ntop='nvtop'

# npm
alias n='npm'
alias nb='npm run build'
alias ns='npm start'

# nvim
alias v='nvim'
alias vi='nvim'
alias vim='nvim'
alias nano='nvim'
alias e='nvim'
alias ed='nvim'
alias edit='nvim'

alias o='open'

alias p='python'
alias pp='pip'

# ripgrep - grep代替
alias grep='rg -p'
alias g='grep'
alias -g G='| g'

alias s='ssh'

# tldr - manの短縮版
alias h='tldr'

# xsel - コマンドからコピー
alias clip='xsel --clipboard --input'
alias -g C='| clip'

### 圧縮系
alias zip='zip'
alias unzip='unar'
alias tgz='tar -czvf'
alias txz='tar -cJvf'
alias untar='tar -xvf'

### 画像/映像系
alias yt='~/.local/bin/yt-dlp -N 4 -P ~/Videos'
alias ytw='~/.local/bin/yt-dlp -N 4 -P ~/Music -f bestaudio -x --audio-format mp3 --audio-quality 3'
alias fs='flameshot gui'
alias ff='ffmpeg -i'
ff2mov(){ ffmpeg -i $1 -c:v dnxhd -profile:v dnxhr_sq -pix_fmt yuv420p -c:a pcm_s16le $2 }

# VRC
alias vrc='~/.shells/.vrc.sh'
alias vrcf='~/.shells/.vrcf.sh'
alias alcom='~/Applications/alcom-1.1.5-x86_64.AppImage'
alias wayvr='~/Applications/WayVR-v26.1.2-x86_64.AppImage'
alias slime='flatpak run dev.slimevr.SlimeVR'
alias wrangler='~/Applications/slimevr-wrangler'

# shell呼び出し
alias update='~/.shells/.update.sh'
alias sendPort='~/.shells/.sendPort.sh'

### path系
alias -g vrcdir='~/.steam/steam/steamapps/compatdata/438100/pfx/drive_c/users/steamuser/AppData/LocalLow/VRChat/VRChat'
alias -g vscodir='~/Documents/VSCode/'
alias -g obsidir='~/Dropbox/Obsidian/'

# .[1-9] - 親ディレクトリの指定
alias -g '.1'='../'
alias -g '.2'='../..'
alias -g '.3'='../../..'
alias -g '.4'='../../../..'
alias -g '.5'='../../../../..'
alias -g '.6'='../../../../../..'
alias -g '.7'='../../../../../../..'      
alias -g '.8'='../../../../../../../..'      
alias -g '.9'='../../../../../../../../..'      

### suffix alias
# ./foo.py のように実行した際に使用するツールを指定
alias -s py='python'

```
### C. ~/.shells/
#### update.sh
アプデ用
```sh
#! /usr/bin/zsh
sudo apt update
sudo apt full-upgrade
sudo apt autoremove
sudo apt autoclean
```
#### sendPort.sh
マイクラ等ポートフォワーディング
```sh
#! /usr/bin/zsh
port="19132"
protocol="udp"

# select server
echo "開放するサーバを選択"
echo "1) 19132 BE (default)"
echo "2) 25565 Java"
echo "3) 24872 Azahar"

read "choice?(1-3) >>> "

case $choice in
	2)
		port="25565"
		protocol="tcp"
		;;
	3)
        port="24872"
		;;
	*)
		;;
esac

ownserver --endpoint "${port}"/"${protocol}"
```
#### vrc.sh
3点
```sh
#!/usr/bin/zsh
~/Applications/VRCX.AppImage&
sleep 5
flatpak run io.github.wivrn.wivrn&
sleep 5
steam steam://rungameid/438100
```
#### vrcf.sh
フルトラ
```sh
#!/usr/bin/zsh
flatpak run dev.slimevr.SlimeVR&
~/Applications/slimevr-wrangler&
sleep 5
~/Applications/VRCX.AppImage&
sleep 5
flatpak run io.github.wivrn.wivrn&
sleep 5
steam steam://rungameid/438100&
```
