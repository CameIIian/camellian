---
title: helixが良さげって話
published: 2026-01-29
draft: false
description: vimライクなhelixってEditorがCUI初学者には良いかも。セットアップが楽な反面、アップデートにより使い勝手が変わる可能性あり。
tags:
  - linux
  - Editor
---
## 参考
- official
	https://helix-editor.com/
- document
	https://docs.helix-editor.com/title-page.html
- github
	https://github.com/helix-editor/helix
## helixとは
Rust製のnvimにインスパイアされたエディタ
- vimの機能があらかた使える
- lazynvimを拾ってこなくても、カスタマイズされた環境がすぐ使える
## install
### natives
ubuntu
```
sudo add-apt-repository ppa:maveonair/helix-editor
sudo apt update
sudo apt install helix
```
arch
```
sudo pacman -S helix
```
### containers
flatpak
```
flatpak install flathub com.helix_editor.Helix flatpak run com.helix_editor.Helix
```
snapd
```
snap install --classic helix
```
## 使い方
```
helix [file]
```
または
```
hx [file]
```
### key-bind
Can use:
- save & quit: ``:q``, ``:w``, ``:wq``,
- search: ``/[need2search]``

Can't use :
- 1line delete: ``dd``
- multi-lines delete: ``d2d``

Option
- remove single char: ``d``
- select strings: ``v-v``
- undo: ``u``
- redo: ``U``
- menu: ``space``
