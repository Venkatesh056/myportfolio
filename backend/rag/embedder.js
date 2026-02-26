const axios = require('axios');

const DEFAULT_EMBEDDING_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

function meanPool(tokenEmbeddings) {
  // tokenEmbeddings: [tokens][dims]
  const tokens = tokenEmbeddings.length;
  const dims = tokenEmbeddings[0].length;
  const out = new Array(dims).fill(0);
  for (let t = 0; t < tokens; t++) {
    const row = tokenEmbeddings[t];
    for (let d = 0; d < dims; d++) out[d] += row[d];
  }
  for (let d = 0; d < dims; d++) out[d] /= Math.max(1, tokens);
  return out;
}

async function embedTextHuggingFace(text, {
  apiKey,
  model = DEFAULT_EMBEDDING_MODEL,
  timeoutMs = 60000,
} = {}) {
  if (!apiKey) throw new Error('Missing HF_API_KEY');

  // Use the standard inference endpoint; the older /pipeline/feature-extraction URLs can return 410.
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const resp = await axios.post(
    url,
    {
      inputs: text,
      options: { wait_for_model: true },
    },
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: timeoutMs,
    }
  );

  const data = resp.data;

  // HF sometimes returns:
  // - [tokens][dims]
  // - [1][tokens][dims]
  // - [dims]
  if (Array.isArray(data) && data.length && Array.isArray(data[0]) && data[0].length && Array.isArray(data[0][0])) {
    return meanPool(data[0]);
  }
  if (Array.isArray(data) && data.length && Array.isArray(data[0]) && typeof data[0][0] === 'number') {
    return meanPool(data);
  }
  if (Array.isArray(data) && typeof data[0] === 'number') {
    return data;
  }

  throw new Error('Unexpected embedding response format from Hugging Face');
}

module.exports = {
  DEFAULT_EMBEDDING_MODEL,
  embedTextHuggingFace,
};
