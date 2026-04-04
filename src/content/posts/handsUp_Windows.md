---
title: Windowsに本気で一度向き合ったなら
published: 2026-04-05
draft: false
description: 会社でWindowsをセットアップする予定がある為、本気で準備してみた際のメモ。
tags:
  - Windows
---
## 1. インストールメディアの作成
[公式サイト](https://www.microsoft.com/ja-jp/software-download/windows11)からインストールメディア作成ソフトをダウンロード
usbに書き込み
再起動してBIOSからusbを起動
読み飛ばしながらクリーンインストール
※`VMD Controller`がEnableになっているなら一時的に無効化しておく
## 2. 初回設定
必要なドライバをインストール
[ASUS TUF Gaming F17 FX706HM - asus.com](https://www.asus.com/jp/laptops/for-gaming/tuf-gaming/2021-asus-tuf-gaming-f17/helpdesk_download?model2Name=FX706HM)
Windows Updateも終わらせておく

パッケージ管理のためにデフォルトのWin-get以外に以下2つをインストール
1. Chocolatey 
2. scoop
```
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```
### 2.1. 設定の変更
`カラーモード`をダーク
`クリップボードの履歴`をON
## 3. アプリインストール
パッケージ検索は以下より
[Winget](https://winget.run/), [Choco](https://community.chocolatey.org/packages), [scoop](https://scoop.sh/#/)
### 3.1. Winget経由
```
winget install -e --id Microsoft.PowerToys
winget install -e --id Microsoft.PowerShell
winget install -e --id Google.Chrome
winget install -e --id VivaldiTechnologies.Vivaldi
winget install -e --id CodeSector.TeraCopy
winget install -e --id mcmilk.7zip-zstd
winget install -e --id Gyan.FFmpeg
winget install -e --id Python.Python.3.11
winget install -e --id yt-dlp.yt-dlp
winget install -e --id JanDeDobbeleer.OhMyPosh
winget install -e --id nepnep.neofetch-win
winget install -e --id sharkdp.fd
winget install -e --id BurntSushi.ripgrep.GNU
winget install -e --id Rufus.Rufus
winget install -e --id CrystalDewWorld.CrystalDiskInfo.KureiKeiEdition
winget install -e --id Meld.Meld
winget install -e --id Microsoft.VisualStudioCode
winget install -e --id Microsoft.VisualStudio.2022.Community
winget install -e --id Git.Git
winget install -e --id GitHub.GitHubDesktop
winget install -e --id Axosoft.GitKraken
winget install -e --id Obsidian.Obsidian
winget install -e --id KDE.Krita
winget install -e --id Audacity.Audacity
winget install -e --id Valve.Steam
winget install -e --id Nvidia.GeForceExperience
```

### 3.2. Choco経由
chocoはパッケージ管理システム含め全て管理者での実行が必要
```
choco install vivaldi
choco install eza
```
### 3.3. scoop経由
```
scoop bucket add extras
scoop install extras/zed
scoop install extras/wave-terminal
```
### 3.4. その他
- Aviutl2
  https://github.com/Neosku/aviutl2-catalog
- Armory Crate
  Win-get配布版が古いかも
  https://armoury-crate.com/#download
- Nvidia Driver(566.36)
  RTX30シリーズで人気なドライバを入れとく
- [MesloLGS NF](https://github.com/romkatv/dotfiles-public/tree/master/.local/share/fonts/NerdFonts)
## 4. セットアップ
CUIをメインに書く

先に右クリックを旧仕様に戻しておく(他の手段を考える必要があるかも)
```
reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
```
### 4.1. Powershellを使う
`ターミナル`の設定からPowershellを使うように変更
カラーや不透明度も必要に応じて変える (以前はUbuntuスタイルが選べた気がするがない、残念)
#### oh-my-poshを設定
nerd系フォント: [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/Hack/Regular)
テーマ: [sonicboom_dark](https://github.com/JanDeDobbeleer/oh-my-posh/blob/main/themes/sonicboom_dark.omp.json)

インストール
```
Install-Module posh-git -Scope CurrentUser -Force
```
プロファイル編集
```
code $PROFILE
```
内容
```
Import-Module posh-git
oh-my-posh init pwsh --config "$HOME\Posh\montys.omp.json" | Invoke-Expression

Remove-Item alias:ls -Force

function ls { eza -F --icons --group-directories-first @args }
function ll { eza -alhF --icons --group-directories-first @args }
function lr { eza -alhF -R -L 2 --icons --group-directories-first --absolute on @args }
function ld { eza -alhD --icons --group-directories-first @args }
function lf { eza -alhfF --icons --group-directories-first @args }

function find { fd @args }

function grep { rg @args }
function g { rg @args }
```
### 4.2. PowerShell以外を使う
WaveTermを使ってみる
左1/3にAI、右にターミナルという構成で使ってみる
PowerShellを認識してくれるので設定を少し書くだけで利用可能

`setting.json`を編集
```
{
  "autoupdate:channel": "latest",
  "telemetry:enabled": false,
  "term:fontfamily": "Hack Nerd Font",
  "term:fontsize": 18
}
```
### 4.3. Zedのセットアップ
cui上では基本codeのように使える
任意のテーマ/アイコンパックを入れるとよい
- PowershellのLanguageサーバを入れて.ps1エディタとして利用
- Markdown Oxideを入れて.mdエディタとして利用
## 必要に合わせて入れると良いもの
- Tablacus Explorer
	便利なファイラ、GUI
- LocalSend
	LAN内でデータを楽にやり取りするのに便利
- TresGrep
	ファイル検索ソフト、word等の中に書いてあることまで探してくれる
- MultiMonitorTool
	モニター管理、プロファイル保存
- X-Mouse Button Control
	マウス操作をカスタマイズするソフト
	公式ソフトがクソなとき用