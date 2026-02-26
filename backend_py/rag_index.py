import hashlib
import json
import os
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer

from .rag_extractor import Doc, load_portfolio_docs


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def chunk_text(text: str, max_chars: int = 700, overlap_chars: int = 120) -> List[str]:
    clean = " ".join(text.split()).strip()
    if len(clean) <= max_chars:
        return [clean]

    out: List[str] = []
    start = 0
    while start < len(clean):
        end = min(len(clean), start + max_chars)
        out.append(clean[start:end])
        if end == len(clean):
            break
        start = max(0, end - overlap_chars)
    return out


def chunk_docs(docs: List[Doc], max_chars: int = 700, overlap_chars: int = 120) -> List[Doc]:
    out: List[Doc] = []
    for d in docs:
        chunks = chunk_text(d.text, max_chars=max_chars, overlap_chars=overlap_chars)
        if len(chunks) == 1:
            out.append(d)
        else:
            for i, ch in enumerate(chunks, start=1):
                out.append(Doc(id=f"{d.id}#{i}", text=ch, meta={**(d.meta or {}), "chunk": i}))
    return out


def cosine_sim_matrix(query_vec: np.ndarray, mat: np.ndarray) -> np.ndarray:
    # query_vec: (d,), mat: (n, d)
    q = query_vec / (np.linalg.norm(query_vec) + 1e-12)
    m = mat / (np.linalg.norm(mat, axis=1, keepdims=True) + 1e-12)
    return m @ q


class RAGIndex:
    def __init__(
        self,
        embeddings: np.ndarray,
        docs: List[Doc],
        meta: Dict[str, Any],
    ):
        self.embeddings = embeddings
        self.docs = docs
        self.meta = meta

    def retrieve(self, query_embedding: np.ndarray, top_k: int = 4) -> List[Tuple[Doc, float]]:
        scores = cosine_sim_matrix(query_embedding, self.embeddings)
        top_idx = np.argsort(-scores)[:top_k]
        return [(self.docs[int(i)], float(scores[int(i)])) for i in top_idx]


def default_paths(repo_root: Path) -> Dict[str, Path]:
    return {
        "portfolio_jsx": repo_root / "src" / "components" / "Portfolio.jsx",
        "cache_dir": repo_root / "backend_py" / ".cache",
        "index_json": repo_root / "backend_py" / ".cache" / "rag_index.json",
        "embeddings_npy": repo_root / "backend_py" / ".cache" / "embeddings.npy",
    }


def ensure_index(
    repo_root: Path,
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    max_chars: int = 700,
    overlap_chars: int = 120,
) -> RAGIndex:
    paths = default_paths(repo_root)
    paths["cache_dir"].mkdir(parents=True, exist_ok=True)

    portfolio_hash = _sha256_file(paths["portfolio_jsx"])

    existing_meta: Optional[Dict[str, Any]] = None
    if paths["index_json"].exists() and paths["embeddings_npy"].exists():
        try:
            existing_meta = json.loads(paths["index_json"].read_text(encoding="utf-8"))
        except Exception:
            existing_meta = None

    if (
        existing_meta
        and existing_meta.get("portfolio_hash") == portfolio_hash
        and existing_meta.get("model_name") == model_name
        and existing_meta.get("max_chars") == max_chars
        and existing_meta.get("overlap_chars") == overlap_chars
    ):
        # Load cached
        emb = np.load(paths["embeddings_npy"], allow_pickle=False)
        docs = [Doc(**d) for d in existing_meta["docs"]]
        return RAGIndex(embeddings=emb, docs=docs, meta=existing_meta)

    # Build new
    docs = load_portfolio_docs(paths["portfolio_jsx"])
    docs = chunk_docs(docs, max_chars=max_chars, overlap_chars=overlap_chars)

    st = SentenceTransformer(model_name)
    emb = st.encode([d.text for d in docs], normalize_embeddings=True, show_progress_bar=False)
    emb = np.asarray(emb, dtype=np.float32)

    meta = {
        "version": 1,
        "model_name": model_name,
        "portfolio_hash": portfolio_hash,
        "max_chars": max_chars,
        "overlap_chars": overlap_chars,
        "count": len(docs),
        "docs": [asdict(d) for d in docs],
    }

    paths["index_json"].write_text(json.dumps(meta, indent=2), encoding="utf-8")
    np.save(paths["embeddings_npy"], emb)

    return RAGIndex(embeddings=emb, docs=docs, meta=meta)
