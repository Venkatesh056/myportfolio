import os
import re
from typing import Optional

import requests

# Zephyr-7b-beta follows instructions well and is free on HF Inference API.
# Falls back to flan-t5-large if the primary is unavailable.
HF_GENERATION_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
HF_FALLBACK_URL   = "https://api-inference.huggingface.co/models/google/flan-t5-large"

# Special tokens to strip from any LLM response
_STRIP_TOKENS = re.compile(
    r"(</s>|<s>|<\|endoftext\|>|<\|system\|>|<\|user\|>|<\|assistant\|>|\[INST\]|\[/INST\])",
    re.IGNORECASE,
)


def _clean_response(text: str) -> Optional[str]:
    """Strip special tokens and whitespace from an LLM response."""
    cleaned = _STRIP_TOKENS.sub("", text).strip()
    return cleaned if cleaned else None


def _call_hf(url: str, payload: dict, key: str, timeout: int = 45) -> Optional[str]:
    try:
        resp = requests.post(
            url,
            headers={"Authorization": f"Bearer {key}"},
            json=payload,
            timeout=timeout,
        )
        if resp.status_code == 503:
            return None  # Model loading — skip
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
            return _clean_response(str(data[0]["generated_text"]))
        if isinstance(data, str):
            return _clean_response(data)
        return None
    except Exception:
        return None


def generate_answer(question: str, context: str, hf_api_key: Optional[str] = None) -> str:
    """
    Generate an answer using the Zephyr-7b-beta chat model.
    `question` is the user's raw question; `context` is the retrieved RAG text.
    Falls back to flan-t5-large if Zephyr is unavailable.
    """
    key = hf_api_key or os.getenv("HF_API_KEY")
    if not key:
        raise RuntimeError("Missing HF_API_KEY")

    # Proper Zephyr chat-template: system role carries instructions,
    # user role carries only context + question (no duplicate system text).
    zephyr_inputs = (
        "<|system|>\n"
        "You are a helpful portfolio assistant for Venkatesh D. "
        "Answer the question using ONLY the context provided. "
        "Be concise and clear. If the context does not contain the answer, "
        "say you don't have that information.\n</s>\n"
        "<|user|>\n"
        f"Context:\n{context}\n\nQuestion: {question}\n</s>\n"
        "<|assistant|>\n"
    )

    payload = {
        "inputs": zephyr_inputs,
        "parameters": {
            "max_new_tokens": 250,
            "temperature": 0.3,
            "return_full_text": False,
            "stop": ["</s>", "<|user|>"],
        },
        "options": {"wait_for_model": True, "use_cache": True},
    }

    # Try primary model (Zephyr)
    answer = _call_hf(HF_GENERATION_URL, payload, key)
    if answer:
        return answer

    # Fallback: flan-t5-large with a plain text prompt
    t5_prompt = (
        "You are a helpful assistant. Answer the question using the context below.\n\n"
        f"Context: {context}\n\nQuestion: {question}\nAnswer:"
    )
    t5_payload = {
        "inputs": t5_prompt,
        "parameters": {"max_new_tokens": 150, "return_full_text": False},
        "options": {"wait_for_model": True, "use_cache": True},
    }
    answer = _call_hf(HF_FALLBACK_URL, t5_payload, key)
    if answer:
        return answer

    raise RuntimeError("All HF models failed to generate an answer.")
