# 音ゲー用の壁を作りたい
Tag: VRChat, Gimmick
## TO-DO
- ワールド固定できる壁を作る ✅
- ワールドの任意の位置に固定可能に ✅
- EXメニューの整理 ✅
- EXメニューから位置を操作可能に 🔄
## link
- https://github.com/CameIIian/BlindWall
## Ref
1. https://yusukekato.jp/html/2025/1003.html
2. https://note.com/kesera2_vrc/n/n40bdf65cfd61
## ワールド固定
``MA World Fixed Object`` (以下**W**) でワールド固定可能
``VRC Parent Constraint`` (以下**P**)と併用することで任意の位置に配置可能
 **W**→**P**だと、ワールド固定
 **P**→**W**だと、アバター追従 [1]
## 色変更
``MA Mesh Setter``で色変え [2]
理想は、裏表別マテリアル(TTTで統合)を作り、180度回転

