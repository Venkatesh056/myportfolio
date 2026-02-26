const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { extractPortfolioDocuments } = require('./portfolioExtractor');
const { chunkDocuments } = require('./chunker');
const { embedTextHuggingFace, DEFAULT_EMBEDDING_MODEL } = require('./embedder');

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

function getDefaultPaths() {
  const repoRoot = path.join(__dirname, '..', '..');
  return {
    portfolioJsxPath: path.join(repoRoot, 'src', 'components', 'Portfolio.jsx'),
    indexPath: path.join(__dirname, 'index.json'),
  };
}

function loadIndex(indexPath) {
  if (!fs.existsSync(indexPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  } catch {
    return null;
  }
}

function saveIndex(indexPath, index) {
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
}

async function buildIndex({
  portfolioJsxPath,
  indexPath,
  hfApiKey,
  embeddingModel = DEFAULT_EMBEDDING_MODEL,
  chunking = { maxChars: 700, overlapChars: 120 },
} = {}) {
  const portfolioHash = sha256File(portfolioJsxPath);

  const rawDocs = extractPortfolioDocuments({ portfolioJsxPath });
  const docs = chunkDocuments(rawDocs, chunking);

  const vectors = [];
  for (const doc of docs) {
    // Keep chunk text small; embeddings work best with concise context.
    const embedding = await embedTextHuggingFace(doc.text, { apiKey: hfApiKey, model: embeddingModel });
    vectors.push({ id: doc.id, text: doc.text, meta: doc.meta || {}, embedding });
  }

  const index = {
    version: 1,
    createdAt: new Date().toISOString(),
    embeddingModel,
    portfolioHash,
    count: vectors.length,
    vectors,
  };

  saveIndex(indexPath, index);
  return index;
}

async function ensureIndex({
  portfolioJsxPath,
  indexPath,
  hfApiKey,
  embeddingModel = DEFAULT_EMBEDDING_MODEL,
} = {}) {
  const paths = getDefaultPaths();
  const jsxPath = portfolioJsxPath || paths.portfolioJsxPath;
  const idxPath = indexPath || paths.indexPath;

  const currentHash = sha256File(jsxPath);
  const existing = loadIndex(idxPath);

  if (existing && existing.portfolioHash === currentHash && existing.embeddingModel === embeddingModel) {
    return existing;
  }

  return await buildIndex({
    portfolioJsxPath: jsxPath,
    indexPath: idxPath,
    hfApiKey,
    embeddingModel,
  });
}

async function retrieve({ query, index, hfApiKey, embeddingModel = DEFAULT_EMBEDDING_MODEL, topK = 4 } = {}) {
  const qEmbed = await embedTextHuggingFace(query, { apiKey: hfApiKey, model: embeddingModel });
  const scored = index.vectors
    .map(v => ({
      id: v.id,
      text: v.text,
      meta: v.meta,
      score: cosineSimilarity(qEmbed, v.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return scored;
}

module.exports = {
  ensureIndex,
  retrieve,
  getDefaultPaths,
};
