// backend/server.js
// Express server setup for chatbot endpoint

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const chatbotRoute = require('./chatbot');
const cors = require('cors');
const path = require('path');

const { ensureIndex } = require('./rag/vectorIndex');
const { DEFAULT_EMBEDDING_MODEL } = require('./rag/embedder');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', chatbotRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  const hfKey = process.env.HF_API_KEY;
  if (!hfKey) {
    console.log('RAG index warmup skipped: missing HF_API_KEY');
    return;
  }

  const embedModel = process.env.RAG_EMBED_MODEL || DEFAULT_EMBEDDING_MODEL;
  ensureIndex({ hfApiKey: hfKey, embeddingModel: embedModel })
    .then((idx) => console.log(`RAG index ready (${idx.count} chunks, model: ${idx.embeddingModel})`))
    .catch((e) => console.log(`RAG index warmup failed: ${e.message || e}`));
});
