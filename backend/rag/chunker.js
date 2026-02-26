function chunkText(text, { maxChars = 700, overlapChars = 120 } = {}) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return [clean];

  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(clean.length, start + maxChars);
    chunks.push(clean.slice(start, end));
    if (end === clean.length) break;
    start = Math.max(0, end - overlapChars);
  }
  return chunks;
}

function chunkDocuments(documents, opts) {
  const out = [];
  for (const doc of documents) {
    const chunks = chunkText(doc.text, opts);
    if (chunks.length === 1) {
      out.push({ id: doc.id, text: chunks[0], meta: doc.meta });
      continue;
    }
    chunks.forEach((c, idx) => {
      out.push({ id: `${doc.id}#${idx + 1}`, text: c, meta: { ...doc.meta, chunk: idx + 1 } });
    });
  }
  return out;
}

module.exports = {
  chunkDocuments,
};
