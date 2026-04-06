---
title: VPN超えJupyterNotebook
published: 2025-11-20
draft: true
description: VPNを経由してJupyterNotebookを使う際に必要なことのメモ
tags:
  - linux
  - VRChat
---
### 接続
```zsh
ssh -L 8888:XXX.XXX.XXX.XXX:8888 -l mail@address XXX.XXX.XXX.XXX
```
### サーバ建て
任意のipから接続できるようにする
```zsh
jupyter notebook --ip=*
```
### ref
> https://qiita.com/ciela/items/0e0392f600c92b93d7c6