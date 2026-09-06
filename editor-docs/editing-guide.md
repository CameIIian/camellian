# 編集・環境構築・公開ガイド

## 環境構築

Gitと[uv](https://docs.astral.sh/uv/getting-started/installation/)をインストールします。
Pythonは`.python-version`に指定した3.12.11を使います。uvは必要に応じてPythonも取得します。
初回のインストールと依存更新にはインターネット接続が必要です。

```bash
git clone https://github.com/CameIIian/camellian.git
cd camellian
uv sync
```

すでに作業フォルダがある場合は、そのフォルダで`uv sync`を実行します。
仮想環境の手動activateやnpmの実行は不要です。

## 公開範囲

| 場所 | 用途 | Webへの公開 |
| --- | --- | --- |
| `docs/` | Markdown、画像、ダウンロードファイル | 公開する前提で扱う |
| `editor-docs/` | 編集・運用手順 | ビルド入力外 |
| `scripts/`、`.github/` | ビルド・品質検査 | ビルド入力外 |
| ルートの設定・README・lock・`.git/` | 管理ファイル | ビルド入力外 |
| `site/` | 生成された静的サイト | Pagesへ渡す唯一のフォルダ |

`docs/`にパスワード、APIキー、Token、秘密鍵、個人情報、非公開の構成情報を置かないでください。
隠しファイルやリンクのないファイルも、非公開保管場所として扱わないでください。
公開領域外へのシンボリックリンクも作成しません。

`site/`は生成物なので直接編集せず、Gitにも追加しません。
Publicリポジトリでは`editor-docs/`もGitHubから読めます。編集者限定にする場合はPrivateにします。

## ローカルプレビュー

```bash
uv run zensical serve
```

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)を開きます。
Markdownを保存すると表示が更新されます。終了は`Ctrl+C`です。
ポートが使用中なら`uv run zensical serve --dev-addr 127.0.0.1:8001`を使います。

GitHubやエディタのMarkdownプレビューでは、Tabs、Icons、Columnsなどがそのままの記法で表示される場合があります。
最終表示はZensicalで確認します。

## 新規ページ

例として`docs/network/openwrt.md`を作ります。カテゴリが必要になるまではフォルダを作る必要はありません。

```markdown
# OpenWrt

本文。
```

ファイル名・フォルダ名は原則`lowercase-kebab-case`とします。
この例の公開URLは`/network/openwrt/`です。
`docs/network/index.md`は`/network/`になります。カテゴリ入口が不要なら作成しません。

初期設定は`nav`を省略しているため、新しいページは自動でNavigationに追加されます。
トップページだけはfront matterの`title: Home`でNavigation名を指定しています。
本文の見出しとNavigation名を分けたいページでも同じ方法を使えます。

## Navigationと内部リンク

並び順や表示名を管理したくなったら、`zensical.toml`の`[project]`内に`nav`を追加します。
**下記は対応するページを作成してから設定してください。**

```toml
nav = [
  { "Home" = "index.md" },
  { "Network" = [
    { "OpenWrt" = "network/openwrt.md" },
  ] },
]
```

`nav`を明示した後は新しいページも必要に応じてここへ追加します。
Navigationから外しても、そのファイルは非公開になりません。

内部リンクは編集しているMarkdownからの相対パスで書きます。
`docs/index.md`からは`[OpenWrt](network/openwrt.md)`、
`docs/network/openwrt.md`からトップへは`[Home](../index.md)`です。
Zensicalが生成先のURLへ変換します。

## 画像・図・添付ファイル

必要になった時点で次のフォルダを作ります。

| 内容 | 保存先 |
| --- | --- |
| 画像 | `docs/assets/images/` |
| 保存済みの図 | `docs/assets/diagrams/` |
| ダウンロード用ファイル | `docs/assets/files/` |

`docs/network/openwrt.md`からの例です。

```markdown
![ルーターと端末の接続関係](../assets/images/network.webp)

[設定例をダウンロード](../assets/files/example.conf)
```

画像のaltは内容が伝わる文章にします。追加前にファイル内の秘密情報も確認してください。
MermaidはMarkdownのコードブロックに直接記述できます。

## ページ削除

1. 他ページからのリンクと、明示した`nav`の参照を取り除きます。
2. `git rm docs/network/openwrt.md`などでページを削除します。
3. 画像・添付ファイルが他のページで使われていないか確認し、不要なものだけ削除します。
4. 公開済みURLに代替ページがある場合はリダイレクトを設定します。
5. ビルドとプレビューでリンク切れがないことを確認します。

参照元の調査にはエディタの全体検索、または`rg 'openwrt' docs zensical.toml`を使えます。

## ページ移動・URLの維持

公開済みのパスはできるだけ維持します。移動が必要な場合は`git mv`を使い、
Navigation、参照元リンク、移動したページ内の相対リンクと画像パスを更新します。

Cloudflare Pagesの[リダイレクト](https://developers.cloudflare.com/pages/configuration/redirects/)は、
必要になった時点で`docs/_redirects`に記述します。例は次のとおりです。

```text
/network/old-name/ /network/new-name/ 301
```

`_redirects`は`site/`へコピーされ、Pagesで解釈されます。
転送元の古いHTMLは残さず、転送先ページを用意します。
ZensicalのローカルサーバーはPagesのリダイレクトを実行しないため、Preview Deploymentでも確認します。

## ビルド確認

```bash
uv run zensical build
```

公開前は、Pagesと同じ厳密なビルドも確認します。

```bash
sh scripts/build.sh
```

スクリプトはlockと設定の不整合を拒否し、キャッシュをクリアして警告もエラーとして扱います。
出力は`site/`のみです。`editor-docs/`や設定ファイルを成果物へコピーしません。
削除・移動後は古いページが`site/`に残っていないことも確認します。
ビルドだけでは外部リンク先の可用性やブラウザ上の操作までは検証できません。
検索、Navigation、スマートフォン幅、配色切替、変更した拡張構文を画面でも確認してください。

## Gitと通常の公開フロー

本番へ直接公開する場合は`main`で作業します。

```bash
git switch main
git pull --ff-only
# docs/のMarkdownを編集し、プレビューとビルドを確認する
uv run zensical serve
# Ctrl+Cで終了
uv run zensical build
git status --short
git diff
git add docs/
git commit -m "docs: 技術情報を更新"
git push origin main
```

設定や編集者向け文書も変更した場合は、そのファイルを指定して`git add`します。
`site/`や`.venv/`を追加しません。GitHubへのpush後はCloudflare Pagesがビルド・公開します。

## Pull Requestで公開前に確認

```bash
git switch main
git pull --ff-only
git switch -c feature/new-page
# 編集・プレビュー・ビルド
git add docs/
git commit -m "docs: 新規ページを追加"
git push -u origin feature/new-page
```

GitHubで`main`向けのPull Requestを作成します。
PagesのDeploymentsからPreview URLを開き、内容を確認してからmergeします。
merge後に`main`のProduction Deploymentが走ります。
Preview URLも通常は公開されるため、非公開情報のレビュー場所として扱わないでください。

## Cloudflare Pagesの初期設定・移行

管理対象はGitHubの`CameIIian/camellian`とPagesの`camellian`です。
以下はこの基盤で使用する設定です。Cloudflare側の設定はDashboardまたはAPIで管理します。

今回の置き換えでは、所有者が旧Markdownのバックアップを保有していることを確認し、
既存記事・添付ファイルを引き継がず、トップページ1枚の新構成に切り替えます。
代替ページがない旧記事URLは404になります。過去のソースはGit履歴にも残します。

Cloudflare DashboardのWorkers & PagesからPagesプロジェクトを開きます。
新規作成する場合はGit連携でGitHubリポジトリを選びます。
Direct UploadのプロジェクトやGitHub Pagesは使用しません。

| 設定 | 値 |
| --- | --- |
| Project | `camellian` |
| Git repository | `CameIIian/camellian` |
| Framework preset | None |
| Production branch | `main` |
| Root directory | リポジトリのルート（空欄、`/`相当） |
| Build command | `sh scripts/build.sh` |
| Build output directory | `site` |
| Build system | v3 |
| Production deployments | 有効 |
| Preview deployments | 非本番ブランチすべて、または必要なブランチを指定 |

ProductionとPreviewの両方に環境変数`SKIP_DEPENDENCY_INSTALL=1`を設定します。
Pythonはコミット済みの`.python-version`を使用します。
Dashboardに既存の`PYTHON_VERSION`があれば3.12.11へ合わせるか削除してください。

Pagesの[ビルドイメージ仕様](https://developers.cloudflare.com/pages/configuration/build-image/)には
uvのプリインストールが保証されていないため、ラッパーを使います。
uvがなければビルド用uv 0.12.10を`.cache/build-tools/`へインストールし、その後は
`uv sync --locked`と`uv run --locked zensical build --clean --strict`を実行します。
Zensicalを含むPython依存は`uv.lock`で固定されます。
通常のローカル編集は`uv sync`と`uv run zensical serve`のままです。

Git連携にデプロイ用API Tokenは不要です。GitHub ActionsのデプロイWorkflowを追加しません。
将来秘密情報が必要になった場合のみPagesのEnvironment Variables / Secretsへ保存します。

設定後、まず作業ブランチへのpushでPreview Build成功を確認します。
`main`へmergeし、Production Build成功と[公開サイト](https://camellian.pages.dev/)の表示を確認します。
ビルドコマンドだけでなく、Production・Preview双方の自動デプロイが有効であることを確認してください。

公式手順: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)、
[Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)。

## 依存関係と設定の更新

採用版はZensical 0.0.59です。Zensicalはまだ0.xの開発段階なので、更新はリリース内容を読んで手動で行います。
`pyproject.toml`のバージョン制約を対象版に変更してから実行します。

```bash
uv lock --upgrade-package zensical
uv sync
uv run zensical build
```

`pyproject.toml`と`uv.lock`を一緒にレビュー・コミットします。
lockを削除して再解決する運用や、自動Major Updateは行いません。
Pythonを変更するときは`.python-version`、`requires-python`、Pages側の設定も合わせます。

この版では`[project.markdown_extensions]`を指定するとZensicalの標準一覧が置き換わります。
SnippetsとColumnsの追加のために必要な標準拡張も明記しています。更新時に一覧を削らないでください。
検索はZensical標準で有効です。日本語本文も検索でき、外部検索サービスは不要です。
検索UIの一部はZensical側の実装により英語表記になります。

## トラブルシューティング

| 症状 | 確認・対処 |
| --- | --- |
| `uv`が見つからない | uvをインストールし、ターミナルを開き直す |
| Pythonを取得できない | ネットワークを確認、またはPython 3.12.11を先に導入する |
| lock不整合 | 依存更新の意図を確認して`uv sync`し、lock差分をレビューする |
| タブや補足が普通の文章になる | 空行と半角4スペースのインデントを確認する |
| Snippetが見つからない | `docs/`基準のパスか確認する。公開領域外の読み込みは不可 |
| 新ページがNavigationにない | 明示的な`nav`を設定していないか確認する |
| 画像が表示されない | 大文字小文字、Markdownからの相対パス、Gitへの追加を確認する |
| 検索が開かない | `file://`ではなくローカルサーバーで開き、コンソールと通信を確認する |
| Mermaidが表示されない | 図の文法と、テーマが読み込むMermaidモジュールへの通信を確認する |
| 数式が未整形 | 初期構成はArithmatexのみ。リファレンスの手順でレンダラーを追加する |
| Pagesがビルドを開始しない | Git連携、対象branch、Production/Previewの有効化、監視パスを確認する |
| Pagesで`uv`がない | Build commandが`sh scripts/build.sh`か確認する |
| Pagesのビルドに失敗 | Build log、Pythonの指定、lock差分を確認し、ローカルで同じスクリプトを実行する |

デプロイ失敗時はログに従ってソースを修正し、再pushします。生成HTMLを手修正して復旧しません。

## 初期構築の検証記録（2026-09-06）

| 項目 | 結果 |
| --- | --- |
| 依存・lock | `uv sync`成功、Zensical 0.0.59に固定 |
| プレビュー | `uv run zensical serve --dev-addr 127.0.0.1:8765`で起動・Home表示成功 |
| ビルド | 通常ビルドと`--clean --strict`の両方で成功 |
| Pages用スクリプト | uvのない一時環境で、uv導入からlockに従ったビルドまで成功 |
| ブラウザ | Chromiumで日本語検索、Navigation、System/Light/Dark、OS設定追従を確認 |
| 拡張構文 | 公開対象外の一時フォルダで23例をビルド。Copyの実コピー、Tabs、Details、Annotation、Mermaid 5種類を確認 |
| Columns | PCの2列、390px幅の1列、横スクロールなしを確認 |
| 公開分離 | 編集者文書・設定ファイルが成果物にないこと、静的配信で404になることを確認 |
| Snippets | 公開Markdownの読み込み成功、領域外と存在しないファイルの参照失敗を確認 |
| Git除外 | `site/`、`.venv/`、キャッシュのignoreルールを検証 |
| GitHub実環境 | 既存履歴を引き継ぎ、`main`をZensical構成へ置き換え済み |
| Pages実環境 | 更新APIが認証エラーを返すため、設定変更と公開ビルドは未完了 |

検証用ページは`docs/`へ追加していません。初期公開Markdownは`docs/index.md`の1枚です。
数式はArithmatexによる構文処理までを確認し、MathJaxなどのレンダラー追加は使用時に行います。
ローカルでのPages用スクリプト成功は、Cloudflare実環境のBuild成功や自動Deployの確認とは別です。

既存GitHubリポジトリの履歴を引き継ぐコミットで構成を置き換えます。
独立した履歴の強制pushで上書きしないでください。既存リポジトリのライセンス表記はルートの`LICENSE`へ維持しています。

## Pages切り替えの残作業（2026-09-06）

GitHubへの置き換えは完了しています。Cloudflareの更新APIは`10000: Authentication error`を返しました。
読み取りAPIは利用できましたが、Pages設定の更新には成功していません。
Pagesの編集権限を持つ接続で再認証するか、Dashboardから次の設定へ変更してください。

| 設定 | 確認時の値 | 変更先 |
| --- | --- | --- |
| Production branch | `codex/mkdocs-migration` | `main` |
| Build command | `mkdocs build --strict` | `sh scripts/build.sh` |
| Build output directory | `site` | `site`（変更不要） |
| Root directory | 空欄 | 空欄（変更不要） |
| Production deployments | 無効 | 有効 |
| Preview deployments | 無効（none） | 有効（all） |
| Production / Previewの環境変数 | 未設定 | `SKIP_DEPENDENCY_INSTALL=1`、`PYTHON_VERSION=3.12.11` |

GitHub連携先は引き続き`CameIIian/camellian`です。Build system v3も設定済みです。
設定後は`main`の最新コミットを対象にビルドし、本番URLを確認します。
作業ブランチ`codex/zensical-foundation`にも新構成を配置しています。
Previewを有効にした後のブランチへのpushで、Preview Buildも確認してください。
この記録時点では本番・PreviewともZensicalのCloudflare Build成功は確認できていません。
