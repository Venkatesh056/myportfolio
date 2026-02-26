## Python RAG chatbot (FastAPI)

This folder contains a Retrieval-Augmented Generation (RAG) backend that:
- Reads your React portfolio source: `src/components/Portfolio.jsx`
- Extracts + chunks portfolio text (projects, about, skills, achievements, etc.)
- Builds a local embeddings index using `sentence-transformers`
- Retrieves top relevant chunks for each question
- Generates an answer using Hugging Face `google/flan-t5-large` (optional)

### 1) Setup

From the repo root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend_py\requirements.txt
```

### 2) Hugging Face key (optional but recommended)

Create `backend_py/.env` (or reuse `backend/.env`) with:

```env
HF_API_KEY=YOUR_HUGGING_FACE_TOKEN
```

If `HF_API_KEY` is missing, the API will return an extractive response (top retrieved snippets) instead of a generated answer.

### 3) Run

```powershell
npm run server:py
```

API endpoint:
- `POST http://localhost:8000/api/chatbot`

Body:
```json
{ "question": "Tell me about NETRATAX" }
```

Response:
```json
{ "answer": "..." }
```

### 4) Frontend integration

Frontend uses the Python server by default (`http://localhost:8000`).

Optional override (Create React App):
- Set `REACT_APP_CHATBOT_URL=http://localhost:8000` in a `.env` at repo root.

### Notes
- The embeddings index is cached to `backend_py/.cache/` and automatically rebuilt when `Portfolio.jsx` changes.
