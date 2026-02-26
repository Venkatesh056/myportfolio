// backend/chatbot.js
// RAG-style portfolio chatbot using Hugging Face embeddings + generation

const express = require('express');
const axios = require('axios');
const router = express.Router();

const { ensureIndex, retrieve } = require('./rag/vectorIndex');
const { DEFAULT_EMBEDDING_MODEL } = require('./rag/embedder');

// Hugging Face API config
const HF_GENERATION_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large';
const HF_API_KEY = process.env.HF_API_KEY; // required for embeddings + generation

const TOP_K = Number(process.env.RAG_TOP_K || 4);
const EMBEDDING_MODEL = process.env.RAG_EMBED_MODEL || DEFAULT_EMBEDDING_MODEL;

router.post('/chatbot', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Missing question' });

  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'Server is missing HF_API_KEY' });
  }

  try {
    const index = await ensureIndex({ hfApiKey: HF_API_KEY, embeddingModel: EMBEDDING_MODEL });
    const hits = await retrieve({ query: question, index, hfApiKey: HF_API_KEY, embeddingModel: EMBEDDING_MODEL, topK: TOP_K });

    const retrievedContext = hits
      .map((h, i) => `[#${i + 1}] ${h.text}`)
      .join('\n\n');

    const prompt =
      `You are a helpful portfolio assistant for Venkatesh D. ` +
      `Answer the user's question using ONLY the provided context. ` +
      `If the context doesn't contain the answer, say you don't have that information and suggest what to ask instead.\n\n` +
      `Context:\n${retrievedContext}\n\n` +
      `User: ${question}\n` +
      `Assistant:`;

    const response = await axios.post(
      HF_GENERATION_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 220,
          temperature: 0.2,
          return_full_text: false,
        },
      },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const answer = response.data && response.data[0] && (response.data[0].generated_text || response.data[0].generated_text === '')
      ? String(response.data[0].generated_text).trim()
      : (typeof response.data === 'string' ? response.data.trim() : 'Sorry, I could not generate an answer.');

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response from Hugging Face API.' });
  }
});

module.exports = router;
