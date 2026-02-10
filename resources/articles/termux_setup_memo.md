# Termux であそぼ
Tag: Android, Linux

## 1. Termuxのセットアップ
### update
```sh
termux-setup-storage
pkg update -y && pkg upgrade -y
```
### Ubuntu install
```sh
pkg in proot proot-distro -y
proot-distro install ubuntu
proot-distro login ubuntu
```
他ディストロも入手可能
> https://github.com/termux/proot-distro

## 2. Ubuntuのセットアップ(superuser)
### install package
```sh
apt update && apt upgrade -y
apt install locales tzdata-y
vi /etc/locale.gen # 290行目、ja_JP.UTF-8のコメントアウト(#)を外す
locale-gen
update-locale LANG=ja_JP.UTF-8
```
### make user
```sh
apt install adduser sudo -y
adduser camellian
visudo
exit
```
追記内容は以下の通り
```sh
camellian ALL=(ALL:ALL) ALL
```
visudoが動かないときは`export EDITOR=vi`などが必要
### make login shell
```sh
echo 'proot-distro login --user u305f ubuntu' > ./login.sh
chmod 744 login.sh
```
## 3. Termuxのセットアップ
### install package
```sh
pkg in python rust -y
pkg in curl duf eza fastfetch git neovim ripgrep tar unar wget yt-dlp zsh -y
```
### install zsh
```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
### make selection
```sh
echo "choose boot"
echo "t) termux"
echo "u) ubuntu"

echo -n "> "
read choice

case "${choice}" in
    u)
        proot-distro login --user camellian ubuntu
        ;;

    *)
        zsh
        ;;
esac
```
### cp .zsh*
```sh
git clone https://github.com/CameIIian/dotfiles/
mv dotfiles/.zshrc ~/
mv dotfiles/.zsh_aliases ~/
```
## 4. Ubuntuのセットアップ(user)
### install package
```sh
sudo apt install python3 curl duf eza fastfetch git neovim ripgrep tar unar wget zsh -y
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
### make sym link
```sh
ln -s /storage/emulated/0/ ~/Android
```
### zsh
カスタマイズは3章を参考
```sh
sudo chsh -s /usr/bin/zsh
```
### setup python
uvのinstall
```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.13
```
## 5. addon apks
### termux-api
`termux-clipboard-set`や`termux-clipboard-get`が便利そう
### termux-widget
Home画面からスクリプトを実行できる？
## Reference
1. Termuxs' apps
	https://github.com/termux/termux-app/releases
	https://github.com/termux/termux-styling/releases
	https://github.com/termux/termux-widget/releases
	https://github.com/termux/termux-float/releases
2. TermuxにUbuntuを入れてJupyterlabの環境を整備 | rm -rf /*
	https://u305f.hateblo.jp/entry/2024/08/09/202335
3. 【Termux】素のTermuxでできたこと｜銀河連邦（流れ弾）
	https://note.com/gingarenpo/n/n707f7743efea#f151ca0e-491f-4337-bdf4-4071d37fcc09
