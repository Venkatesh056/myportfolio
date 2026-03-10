# 🚀 Venkatesh D — Data Science Portfolio

A modern, interactive portfolio built with **React**, featuring an AI-powered chatbot assistant, fan-spread project carousel, animated sections, and a full-stack backend with RAG (Retrieval-Augmented Generation).

---

## 🌐 Live Preview

> Deployed at: (https://myportfolio-theta-ashy.vercel.app/)

---

## ✨ Features

- **Fan-Spread Carousel** — Interactive card-based project showcase with hover overlays, tilt effects, and spotlight animations
- **AI Chatbot Assistant** — Portfolio-aware chatbot powered by Hugging Face LLMs with RAG for intelligent Q&A
- **Animated Stats & Sections** — Count-up animations, scroll-triggered reveals, parallax effects, and particle backgrounds
- **Dual CV Download** — Separate resumes for Data Science/AI-ML and Full Stack/Software roles
- **EmailJS Contact Form** — Direct email integration via environment variables
- **Fully Responsive** — Mobile-friendly layout with hamburger nav and adaptive carousel

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 (CRA) | UI framework |
| lucide-react | Icon library |
| CSS3 (custom) | Animations, fan carousel, responsive design |
| EmailJS | Contact form email delivery |

### Backend (Node.js)
| Technology | Purpose |
|---|---|
| Express.js | REST API server (port 5000) |
| HuggingFace Inference API | LLM-based chat responses |
| RAG pipeline | Vector index + chunk retrieval for portfolio context |
| dotenv | Environment configuration |

### Backend (Python)
| Technology | Purpose |
|---|---|
| FastAPI | Python API server (port 8000) |
| Hugging Face Transformers | Local/hosted model inference |
| Uvicorn | ASGI server |

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   └── resume/                    # PDF resumes
├── src/
│   ├── index.js
│   ├── components/
│   │   ├── Portfolio.jsx          # Main portfolio component
│   │   └── Chatbot.jsx            # Floating AI assistant
│   ├── api/
│   │   └── chatbot.js             # Frontend API calls
│   └── styles/
│       ├── Portfolio.css          # All portfolio styles
│       ├── Chatbot.css
│       └── index.css
├── backend/                       # Node.js backend
│   ├── server.js
│   ├── chatbot.js
│   ├── portfolioData.json
│   └── rag/
│       ├── chunker.js
│       ├── embedder.js
│       ├── portfolioExtractor.js
│       └── vectorIndex.js
├── backend_py/                    # Python backend (alternative)
│   ├── main.py
│   ├── hf_generate.py
│   ├── rag_extractor.py
│   ├── rag_formatter.py
│   ├── rag_index.py
│   └── requirements.txt
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 16
- Python >= 3.10 (for Python backend)
- Hugging Face API key

### 1. Clone the repository
```bash
git clone https://github.com/Venkatesh056/<repo-name>.git
cd <repo-name>
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Configure environment variables

Create `.env` in the root:
```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Create `backend/.env`:
```env
HF_API_KEY=your_huggingface_api_key
PORT=5000
RAG_EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### 4. Run the app

**Frontend only:**
```bash
npm start
```

**Frontend + Node.js backend:**
```bash
# Terminal 1
npm run server

# Terminal 2
npm start
```

**Python backend (alternative):**
```bash
cd backend_py
pip install -r requirements.txt
npm run server:py
```

---

## 🎯 Featured Projects

| Rank | Project | Stack |
|---|---|---|
| 1 | **NETRATAX** — AI Tax Fraud Detection | PyTorch Geometric, GNN, Flask, ReactJS |
| 2 | **UPI Transactions Dashboard** — Digital Payments Analytics | Power BI, DAX, Power Query |
| 3 | **TRI-BIOMETRIX** — Multimodal Biometric Auth | TensorFlow, OpenCV, MediaPipe, CNN |
| 4 | **Blinkit Sales Dashboard** — Grocery Sales Analytics | Power BI, DAX, Microsoft Excel |
| 5 | **FoodBridge** — Food Redistribution Platform | Flutter, Firebase, Google Maps API |
| 6 | **MYTHOVERSE AI** — Mythology Storytelling Engine | Hugging Face, LangChain, FastAPI, Streamlit |
| 7 | **AI-Multimodal MEDI-INTERPRETER** — Healthcare AI | TensorFlow, EfficientNet, Whisper, DeepFace |

---

## 🏆 Achievements

| Award | Event | Result |
|---|---|---|
| TOP 50 | Smart India Hackathon 2025 | Selected from 10,000+ applicants |
| WINNER | Tech Sculpt Expo 2025 — IEEE CIT | Excellence in innovation |
| FINALIST | CIT Spark Grant 2025 | Exceptional community impact |
| RUNNER-UP | AstroNova Hackathon 2026 — Dept of IT, CIT | High-impact innovation |
| TOP 5 | The Big Hack 2025 — AIT Bangalore | 82 teams, 24-hour sprint |
| TOP 6 | GLYTCH 2025 — VIT Chennai | 60 teams, 24-hour sprint |
| FINALIST | Triathlon (AXIOS 2024) — PSG College of Technology | Multi-disciplinary competition |
| AWARDED | Scout Captain — Seva Ratna | By Governor of Tamil Nadu |

---

## 📬 Contact

| Channel | Details |
|---|---|
| Email | venkateshdhanabalan056@gmail.com |
| Phone | +91 8667794170 |
| LinkedIn | [venkatesh-dhanabalan](https://www.linkedin.com/in/venkatesh-dhanabalan-04b164295/) |
| GitHub | [Venkatesh056](https://github.com/Venkatesh056) |
| Location | Coimbatore, Tamil Nadu, India |

---

## 📄 License

This project is personal/portfolio work. All rights reserved © Venkatesh D, 2023–2028.
