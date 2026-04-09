---
title: Genellianが居ればもう寂しくないね
published: 2026-04-11
draft: false
description: 多言語対応, ボイスクローン搭載。中国発の多機能ttsモデルをちゃんと触ってみる
tags:
  - ML
  - tts
---
## 1. セットアップ
VRAM <= 8GB ならFlashAttn無くても動くはず \
torchは自身のQUDAバージョンによっては、urlからインストールすること
```
uv init qwen3-tts
uv venv -p 3.12
uv pip install torch torchvision torchaudio ffmpeg qwen-tts
```
## 2. 実行
qwen3-tts/main.pyを編集
```
# ==========================================
# qwen3-tts voice clone program
# PLEASE change variable on "1. Set Var"
# ==========================================
import torch
import soundfile as sf
from qwen_tts import Qwen3TTSModel

# ==========================================
# 1. Set Variables
# ==========================================
ref_audio_path = "./sample_sound.wav"
ref_text = "こんにちは、かめりあんです。一般成人男性です。"
target_text = "ドーナツみたいな雲は、僕の心のようだった"
output_file="output_voiceClone.wav"

# ==========================================
# 2. Load Qwen3-TTS
# ==========================================
model = Qwen3TTSModel.from_pretrained(
	"Qwen/Qwen3-TTS-12Hz-1.7B-Base",
	device_map="cuda:0",
	dtype=torch.bfloat16,
)

# ==========================================
# 3. Run voice clone
# ==========================================
wavs, sr = model.generate_voice_clone(
	text=target_text,
	language="Japanese",
	ref_audio=ref_audio_path,
	ref_text=ref_text,
)

# ==========================================
# 4. save output wave file
# ==========================================
sf.write(output_file, wavs[0], sr)
print(f"output has been generated in ./{output_file}")
```
## 3. 音声入出力
マイク環境が悪く、ノイズが乗りやすいためHMDの音を学習に使う

取得した音声は以下の通り
> https://

Audacityで`ノイズ抑制`と`クリップノイズの除去`、ゲインの調整を実施

得られた出力は以下の通り
> https://
## 参考
[音声生成AI「Qwen3-TTS」を検証してみた - GMOインターネットグループ グループ研究開発本部](https://recruit.group.gmo/engineer/jisedai/blog/voice-clone-qwen3-tts/)