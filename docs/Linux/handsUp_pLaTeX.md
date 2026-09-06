---
title: pLaTeXを使ってみよう
description: 卒論用にTeX環境を構築した際のメモ
date: 2025-12-17
tags:
  - Linux
  - TeX
---
卒論用にUbuntuとArchにTeX環境を用意した時にした事  
全部installするだけ  
今からなら[Prism](https://openai.com/ja-JP/prism/)でも良いかも
## Ubuntu
```
sudo apt install -y texlive-lang-japanese  texlive-latex-extra texlive-luatex evince
```
## Arch
```
sudo pacman -S texlive-latex texlive-latexextra texlive-langjapanese texlive-luatex evince
sudo pacman -S texlive-pictures texlive-science texlive-mathtools
```
## VSCode互換用コンパイル設定
```
"latex-workshop.intellisense.package.enabled": true,
    "latex-workshop.latex.tools": [
        {
            "name": "platex",
            "command": "platex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-kanji=utf8",
                "-guess-input-enc",
                "%DOCFILE%.tex"
            ]
        },
        {
            "name": "pbibtex",
            "command": "pbibtex",
            "args": [
                "-kanji=utf8",
                "%DOCFILE%"
            ]
        },
        {
            "name": "dvipdfmx",
            "command": "dvipdfmx",
            "args": [
                "%DOCFILE%"
            ]
        }
    ],
    "latex-workshop.latex.recipes": [
        // platexとpbibtexを使ってTeXファイル→DVIファイル→PDFファイル生成
        {
            "name": "platex_bib",
            "tools": [
                "platex",
                "pbibtex",
                "platex",
                "platex",
                "dvipdfmx"
            ]
        }
    ],

    // 生成ファイルを削除するときに対象とするファイル
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux",
        "*.bbl",
        "*.blg",
        "*.idx",
        "*.ind",
        "*.lof",
        "*.lot",
        "*.out",
        "*.toc",
        "*.acn",
        "*.acr",
        "*.alg",
        "*.glg",
        "*.glo",
        "*.gls",
        "*.ist",
        "*.fls",
        "*.log",
        "*.fdb_latexmk",
        "*.snm",
        "*.nav",
        "*.dvi",
        "*.synctex.gz"
    ],
```
参考: [https://www.aise.ics.saitama-u.ac.jp/~gotoh/TeXLiveUbuntu2404onWSL2In2025.html#:~:text=%E4%BD%BF%E7%94%A8%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%84%E7%92%B0%E5%A2%83%E3%81%AE%E8%A3%9C%E5%AE%8C%E3%82%92%E6%9C%89%E5%8A%B9%E3%81%AB%E3%81%99%E3%82%8B](https://www.aise.ics.saitama-u.ac.jp/~gotoh/TeXLiveUbuntu2404onWSL2In2025.html#:~:text=%E4%BD%BF%E7%94%A8%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%84%E7%92%B0%E5%A2%83%E3%81%AE%E8%A3%9C%E5%AE%8C%E3%82%92%E6%9C%89%E5%8A%B9%E3%81%AB%E3%81%99%E3%82%8B)
