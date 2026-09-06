---
title: vs. Arch
description: 金をもらいながらArchLinuxと格闘した際のメモ
date: 2026-05-20
tags:
  - Linux
---
## Oracle VM VirtualBox で Archlinux が動くまで

### 注意点
systemd-bootについて扱います  
grubを利用する場合は、読み替えてください

基本的に以下の記事を参照しました  
[https://qiita.com/uhooi/items/594e0488fb948c8e1199](https://qiita.com/uhooi/items/594e0488fb948c8e1199)

### 1. setup
1. インストールメディアの入手  
[https://archlinux.org/download/](https://archlinux.org/download/)

2. Oracle VM上で環境を作成  
ISOイメージは先程の`archlinux-XXX-XXX.iso`  
`EFIを有効化`のチェックを入れておく

3. システムクロックの更新
```
timedatectl set-timezone Asia/Tokyo
```

4. パーティションの作成  
`cfdisk`を実行  
初回起動時に`MBR`か`GPT`、どちらを使うか聞かれるが、`GPT`を選択  
以下の2つを作成する  
- 300MiB以上のパーティション。タイプを**EFI System**に変更  
- 残りの領域からなる1つのパーティション。タイプを対応する**Linux root**に変更  

4. フォーマット  
root: `mkfs.ext4 /dev/sda2`   
boot: `mkfs.fat -F 32 /dev/sda1`   
`lsblk -f`で4-5の内容を確認可能

5. マウント
```
mount /dev/sda2 /mnt
```

7. pacman最適化  
先に`reflector`を利用し、ミラーを最適化  
24時間以内に同期された最もDLの早い5つを更新先として取得
```
pacman -Sy
pacman -S reflector
reflector --country Japan --age 24 --sort rate --save /etc/pacman.d/mirrorlist
pacman -Syy
```

8. インストール
```
pacstrap -K /mnt base linux linux-firmware
```

9. fstabの作成  
ストレージに関する情報を記録
```
genfstab -U /mnt >> /mnt/etc/fstab
systemctl daemon-reload
```

10. EFIパーティションのマウント
```
mount /dev/sda1 /mnt/boot
```

11. /mnt内での作業
```
arch-chroot /mnt

ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
hwclock --systohc

pacman -Syyu
pacman -S vi iwd dhcp terminus-font

systemctl enable iwd
systemctl enable dhcpcd

vi /etc/locale.gen # `ja_JP.UTF-8 UTF-8`と`en_US.UTF-8 UTF-8`を追加
locale-gen

echo "LANG=en_US.UTF-8" > /etc/locale.conf

echo "FONT=ter-132b" > /etc/vconsole.conf

echo "arch" > /etc/hostname # 任意の名前
passwd # ルートユーザの任意のパスワード

mkinitcpio -P
```

12. 不足するファイルの作成  
`/boot/EFI/loader/loader.conf`
```
default  arch.conf
timeout  4
console-mode max
editor   no
```
`/boot/EFI/loader/entries/arch.conf`
```
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID={sda2's UUID here} rw
```

13. fstabの編集  
`/etc/fstab`の編集
```
UUID={sda2's UUID here} / ext4 defaults 0 1
UUID={sda1's UUID here} /boot vfat defaults,nodev,nosuid,noexec,fmask=0177,dmask=0077 0 2
```

14. systemd-bootを設定
```
exit
bootctl install --esp-path=/mnt/boot
arch-chroot /mnt
bootctl update
```

15. 終了
```
exit
reboot
```

16. 起動確認  
選択肢が`Arch`と他のメディアから起動する選択肢が出ていればOK  
そのままバージョン情報とログイン画面が出ればなお良し

### 2. 安全/快適に使うために
1. ユーザ追加
```
useradd -m -g users -s /bin/bash camellian
passwd camellian
visudo # camellian ALL=(ALL:ALL) ALL
```
2. パッケージ取得のための設定  
以降は作成したユーザで進行
```
su
pacman -Syyu && pacman -S sudo
exit
sudo locale-gen
```

3. 適当なパッケージを追加
```
sudo pacman -S btop curl eza fastfetch git helix lazygit nvim ripgrep wget xsel zellij zsh
```

4. zsh設定
```
mkdir Desktop Documents Downloads Templates
sudo chsh -s /usr/bin/zsh camellian
cd ~/Documents
git clone https://github.com/cameIIian/dotfiles
```

### トラブルシューティング
- `/boot/vmlinuz-linux`が無くなった  
 `sudo pacman -S linux` で再インストール可

- bootctlでWarningが出る  
 他のユーザの実行権を無くせばよい  
 今回はfstab中で指定

- ルートのディスクが読み込めない  
 `arch.conf`と`fstab`のUUIDが間違えていた  
 修正すると起動

### 参考
archlinux
[https://wiki.archlinux.jp/index.php/%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89](https://wiki.archlinux.jp/index.php/%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89)    
[https://wiki.archlinux.jp/index.php/EFI_%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%91%E3%83%BC%E3%83%86%E3%82%A3%E3%82%B7%E3%83%A7%E3%83%B3](https://wiki.archlinux.jp/index.php/EFI_%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%91%E3%83%BC%E3%83%86%E3%82%A3%E3%82%B7%E3%83%A7%E3%83%B3)    
[https://wiki.archlinux.jp/index.php/Systemd-boot](https://wiki.archlinux.jp/index.php/Systemd-boot)    
[https://wiki.archlinux.jp/index.php/Fstab](https://wiki.archlinux.jp/index.php/Fstab)  
[https://bbs.archlinux.org/viewtopic.php?id=287790](https://bbs.archlinux.org/viewtopic.php?id=287790)  
[https://bbs.archlinux.org/viewtopic.php?id=302290](https://bbs.archlinux.org/viewtopic.php?id=302290)  

島根大学    
[https://dynamics.riko.shimane-u.ac.jp/personal/virtual-linux-for-dual-boot.html#:~:text=%E3%81%BE%E3%81%9A%EF%BC%8C-,EFI%E3%82%92%E6%9C%89%E5%8A%B9%E5%8C%96,-%E3%81%97%E3%81%AA%E3%81%84%E3%81%A8%E3%83%96%E3%83%BC%E3%83%88](https://dynamics.riko.shimane-u.ac.jp/personal/virtual-linux-for-dual-boot.html#:~:text=%E3%81%BE%E3%81%9A%EF%BC%8C-,EFI%E3%82%92%E6%9C%89%E5%8A%B9%E5%8C%96,-%E3%81%97%E3%81%AA%E3%81%84%E3%81%A8%E3%83%96%E3%83%BC%E3%83%88)  
qiita  
[https://qiita.com/uhooi/items/594e0488fb948c8e1199](https://qiita.com/uhooi/items/594e0488fb948c8e1199)

zenn  
[https://zenn.dev/ytjvdcm/articles/0efb9112468de3](https://zenn.dev/ytjvdcm/articles/0efb9112468de3)
