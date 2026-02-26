import os
import threading
from functools import lru_cache
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .rag_index import ensure_index
from .hf_generate import generate_answer
from .rag_formatter import format_answer


# Load backend_py/.env if present, else fall back to backend/.env
HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")
load_dotenv(HERE.parent / "backend" / ".env")


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


app = FastAPI(title="Portfolio RAG Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"]
    if os.getenv("CORS_ALLOW_ALL", "1") == "1"
    else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


_REPO_ROOT = HERE.parent
_MODEL_NAME = os.getenv("RAG_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
_TOP_K = int(os.getenv("RAG_TOP_K", "4"))

_PORTFOLIO_PATH = _REPO_ROOT / "src" / "components" / "Portfolio.jsx"
_INDEX = None
_INDEX_MTIME_NS: Optional[int] = None


@lru_cache(maxsize=1)
def get_embedder():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(_MODEL_NAME)


def get_index():
    global _INDEX, _INDEX_MTIME_NS

    try:
        mtime_ns = _PORTFOLIO_PATH.stat().st_mtime_ns
    except FileNotFoundError:
        mtime_ns = None

    if _INDEX is None or mtime_ns != _INDEX_MTIME_NS:
        _INDEX = ensure_index(repo_root=_REPO_ROOT, model_name=_MODEL_NAME)
        _INDEX_MTIME_NS = mtime_ns

    return _INDEX


@app.on_event("startup")
def _warmup_index() -> None:
    # Do not block server startup (model downloads/embedding can be slow on first run).
    def _warm() -> None:
        try:
            get_index()
            get_embedder()
        except Exception:
            # Keep server running even if warmup fails; requests will retry lazily.
            pass

    threading.Thread(target=_warm, daemon=True).start()


@app.get("/api/health")
def health():
    # If the embedder is loaded and we have an index, we consider the service "ready".
    ready = _INDEX is not None
    return {
        "status": "ok",
        "ready": ready,
        "model": _MODEL_NAME,
        "top_k": _TOP_K,
        "portfolio_path": str(_PORTFOLIO_PATH),
    }


@app.post("/api/chatbot", response_model=ChatResponse)
def chatbot(req: ChatRequest) -> ChatResponse:
    question = (req.question or "").strip()
    if not question:
        return ChatResponse(answer="Please ask a question.")

    idx = get_index()

    # Embed query using the same model (cached)
    st = get_embedder()
    q_emb = st.encode([question], normalize_embeddings=True, show_progress_bar=False)[0]

    hits = idx.retrieve(q_emb, top_k=_TOP_K)
    context = "\n\n".join([f"[#{i + 1}] {d.text}" for i, (d, _s) in enumerate(hits)])

    # Try LLM generation first; fall back to smart local formatter if it fails.
    try:
        answer = generate_answer(question=question, context=context)
        if answer:
            return ChatResponse(answer=answer)
    except Exception:
        pass

    # Smart local formatter: clean readable answer from retrieved chunks (no LLM needed).
    return ChatResponse(answer=format_answer(question, hits))
