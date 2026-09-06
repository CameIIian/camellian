#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

# Pagesのビルドイメージにuvがない場合だけ、固定版を作業領域に導入する。
if ! command -v uv >/dev/null 2>&1; then
  python3 -m pip install --disable-pip-version-check --target .cache/build-tools 'uv==0.12.10'
  PATH="$PWD/.cache/build-tools/bin:$PATH"
  export PATH
fi

uv sync --locked
uv run --locked zensical build --clean --strict
