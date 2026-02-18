#!/usr/bin/env python3
"""Run inference with Ministral-3-3B-Instruct (Unsloth 4-bit) using vLLM.

Example:
  uv run infer.py --prompt "日本語で自己紹介して"
"""

from __future__ import annotations

import argparse
import os
from typing import Optional

from vllm import LLM, SamplingParams

DEFAULT_MODEL = "unsloth/Ministral-3-3B-Instruct-2512-bnb-4bit"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Inference script for Ministral3:3b via vLLM + Unsloth model"
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help="Hugging Face model id (default: %(default)s)",
    )
    parser.add_argument(
        "--prompt",
        default="こんにちは。あなたはどんなモデルですか？",
        help="User prompt text",
    )
    parser.add_argument(
        "--system",
        default="You are a helpful assistant.",
        help="System prompt text",
    )
    parser.add_argument("--max-tokens", type=int, default=256, help="Max generated tokens")
    parser.add_argument("--temperature", type=float, default=0.7, help="Sampling temperature")
    parser.add_argument("--top-p", type=float, default=0.95, help="Top-p sampling")
    parser.add_argument(
        "--gpu-memory-utilization",
        type=float,
        default=0.90,
        help="Fraction of GPU memory to use in vLLM",
    )
    parser.add_argument(
        "--tensor-parallel-size",
        type=int,
        default=1,
        help="Tensor parallel degree",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for generation",
    )
    return parser


def build_messages(system_prompt: str, user_prompt: str) -> list[dict[str, str]]:
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


def maybe_set_hf_token(token: Optional[str]) -> None:
    if token:
        os.environ["HF_TOKEN"] = token


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    maybe_set_hf_token(os.getenv("HUGGING_FACE_HUB_TOKEN") or os.getenv("HF_TOKEN"))

    llm = LLM(
        model=args.model,
        tokenizer=args.model,
        quantization="bitsandbytes",
        load_format="bitsandbytes",
        gpu_memory_utilization=args.gpu_memory_utilization,
        tensor_parallel_size=args.tensor_parallel_size,
        trust_remote_code=True,
    )

    sampling_params = SamplingParams(
        temperature=args.temperature,
        top_p=args.top_p,
        max_tokens=args.max_tokens,
        seed=args.seed,
    )

    messages = build_messages(args.system, args.prompt)
    outputs = llm.chat(messages=messages, sampling_params=sampling_params)

    print("=== PROMPT ===")
    print(args.prompt)
    print("\n=== RESPONSE ===")
    print(outputs[0].outputs[0].text.strip())


if __name__ == "__main__":
    main()
