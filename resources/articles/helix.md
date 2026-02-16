# helixが良さげって話
Tag: Editor
date: 2026/01/29

- official
	https://helix-editor.com/
- document
	https://docs.helix-editor.com/title-page.html
- github
	https://github.com/helix-editor/helix
## 1. what is this?
Rust製のnvimにインスパイアされたエディタ
- vimの機能があらかた使える
- lazynvimを拾ってこなくても、カスタマイズされた環境がすぐ使える
## 2. install
### 2.1. natives
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
### 2.2. containers
flatpak
```
flatpak install flathub com.helix_editor.Helix flatpak run com.helix_editor.Helix
```
snapd
```
snap install --classic helix
```
## 3. usage
```
helix [file]
```
or
```
hx [file]
```
### 3.1. command
Can use:
- save & quit: `:q`, `:w`, `:wq`,
- search: `/[need2search]`

Can't use :
- 1line delete: `dd`
- multi-lines delete: `d2d`

Option
- remove single char: `d`
- select strings: `v-v`
- undo: `u`
- redo: `U`
- menu: `space`
