---
title: Neovimmer入門編
description: ssh先でとりあえず使う、またはちょっとだけ修正したい際に使うエディタを真面目に使いたかった。hjklが好きなら一度はvimをセットアップしたことがあるべきだと思って頑張ろうとした際のメモ。
date: 2025-01-20
tags:
  - Linux
  - Editor
---
## install neovim
ubuntu: ``apt install git neovim``  
arch: ``pacman -S git neovim``
## make lazy.nvim init.lua
現状動作させられたもののみ
```
-- lazy.nvimのインストール等
-- nvim起動時にチェックが走り、必要ならインストールする
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
	vim.fn.system({
		"git",
		"clone",
		"--filter=blob:none",
		"https://github.com/folke/lazy.nvim.git",
		"--branch=stable",
		lazypath,
	})
end
vim.opt.rtp:prepend(lazypath)

-- ここに追加したいプラグインを書く。
-- GitHubに公開されているプラグインなら、"ユーザー名/リポジトリ名"のフォーマットで記載する。
require("lazy").setup({
	{
		'nvimdev/dashboard-nvim',
		event = 'VimEnter',
		config = function()
		require('dashboard').setup {
			-- config
		}
		end,
		dependencies = { {'nvim-tree/nvim-web-devicons'}}
	}, {
		'Bekaboo/dropbar.nvim',
		-- optional, but required for fuzzy finder support
		dependencies = {
			'nvim-telescope/telescope-fzf-native.nvim',
			build = 'make'
		},
		config = function()
		local dropbar_api = require('dropbar.api')
		vim.keymap.set('n', '<Leader>;', dropbar_api.pick, { desc = 'Pick symbols in winbar' })
		vim.keymap.set('n', '[;', dropbar_api.goto_context_start, { desc = 'Go to start of current context' })
		vim.keymap.set('n', '];', dropbar_api.select_next_context, { desc = 'Select next context' })
		end
	},
})
```
## 参考文献
[https://zenn.dev/siteyo/articles/980b6205e93914](https://zenn.dev/siteyo/articles/980b6205e93914)  
[https://zenn.dev/okmkm321/articles/neovim_plugin](https://zenn.dev/okmkm321/articles/neovim_plugin)  
[https://qiita.com/haw_ohnuma/items/bd7ecfb42141481435ab#%E8%A3%9C%E5%AE%8C%E7%B3%BB](https://qiita.com/haw_ohnuma/items/bd7ecfb42141481435ab#%E8%A3%9C%E5%AE%8C%E7%B3%BB)
