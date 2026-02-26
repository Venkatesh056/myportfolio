const fs = require('fs');
const path = require('path');

function collapseWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function stripJsxTags(text) {
  return collapseWhitespace(
    text
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
  );
}

function sliceConstArray(source, constName) {
  const start = source.indexOf(`const ${constName} = [`);
  if (start === -1) return null;
  const afterStart = source.slice(start);
  const endIdx = afterStart.indexOf('\n];');
  if (endIdx === -1) return null;
  return afterStart.slice(0, endIdx + '\n];'.length);
}

function extractQuotedStrings(block) {
  const out = [];
  const re = /\"([^\"\\]*(?:\\.[^\"\\]*)*)\"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    out.push(m[1].replace(/\\\"/g, '"'));
  }
  return out;
}

function extractAboutParagraph(source) {
  const re = /<p\s+className=\"about-text-full[^\"]*\">([\s\S]*?)<\/p>/;
  const m = source.match(re);
  if (!m) return null;
  return stripJsxTags(m[1]);
}

function extractContactInfo(source) {
  const emailMatch = source.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = source.match(/\+91\s*\d{10}/);
  const locationMatch = source.match(/Coimbatore,\s*Tamil Nadu,\s*India/);
  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ') : null,
    location: locationMatch ? locationMatch[0] : null,
  };
}

function extractProjectDocs(projectsBlock) {
  // Split roughly by project objects (top-level), then pull known fields.
  const docs = [];
  const objectChunks = projectsBlock.split(/\n\s*\},\s*\n\s*\{/g);
  for (const chunk of objectChunks) {
    const title = (chunk.match(/title:\s*\"([^\"]+)\"/) || [])[1];
    const subtitle = (chunk.match(/subtitle:\s*\"([^\"]+)\"/) || [])[1];
    const description = (chunk.match(/description:\s*(?:\"([\s\S]*?)\"|\n\s*\"([\s\S]*?)\")/) || []);
    const descriptionText = description[1] || description[2];

    const highlightsMatch = chunk.match(/highlights:\s*\[([\s\S]*?)\]/);
    const highlights = highlightsMatch ? extractQuotedStrings(highlightsMatch[1]) : [];

    const impact = (chunk.match(/impact:\s*(?:\"([\s\S]*?)\"|\n\s*\"([\s\S]*?)\")/) || []);
    const impactText = impact[1] || impact[2];

    const techMatch = chunk.match(/tech:\s*\[([\s\S]*?)\]/);
    const tech = techMatch ? extractQuotedStrings(techMatch[1]) : [];

    const github = (chunk.match(/github:\s*\"([^\"]+)\"/) || [])[1];

    if (!title && !descriptionText) continue;

    const parts = [];
    if (title) parts.push(`Project: ${title}`);
    if (subtitle) parts.push(`Subtitle: ${subtitle}`);
    if (descriptionText) parts.push(`Description: ${collapseWhitespace(descriptionText)}`);
    if (tech.length) parts.push(`Tech: ${tech.join(', ')}`);
    if (highlights.length) parts.push(`Highlights: ${highlights.join('; ')}`);
    if (impactText) parts.push(`Impact: ${collapseWhitespace(impactText)}`);
    if (github) parts.push(`GitHub: ${github}`);

    docs.push({
      id: `project:${title || Math.random().toString(16).slice(2)}`,
      text: parts.join('\n'),
      meta: { type: 'project', title: title || null },
    });
  }
  return docs;
}

function extractSimpleArrayDocs(source, constName, typeLabel) {
  const block = sliceConstArray(source, constName);
  if (!block) return [];
  const docs = [];

  // For these arrays, we mainly care about title/subtitle/description/duration/organization.
  const objectChunks = block.split(/\n\s*\},\s*\n\s*\{/g);
  for (const chunk of objectChunks) {
    const title = (chunk.match(/title:\s*\"([^\"]+)\"/) || [])[1];
    const subtitle = (chunk.match(/subtitle:\s*\"([^\"]+)\"/) || [])[1];
    const description = (chunk.match(/description:\s*\"([\s\S]*?)\"/) || [])[1];
    const duration = (chunk.match(/duration:\s*\"([^\"]+)\"/) || [])[1];
    const organization = (chunk.match(/organization:\s*\"([^\"]+)\"/) || [])[1];

    if (!title && !description) continue;

    const parts = [];
    if (title) parts.push(`${typeLabel}: ${title}`);
    if (subtitle) parts.push(`Subtitle: ${subtitle}`);
    if (organization) parts.push(`Organization: ${organization}`);
    if (duration) parts.push(`Duration: ${duration}`);
    if (description) parts.push(`Description: ${collapseWhitespace(description)}`);

    docs.push({
      id: `${typeLabel.toLowerCase()}:${title || Math.random().toString(16).slice(2)}`,
      text: parts.join('\n'),
      meta: { type: typeLabel.toLowerCase(), title: title || null },
    });
  }

  return docs;
}

function extractSkillsDocs(source) {
  const block = sliceConstArray(source, 'skillCategories');
  if (!block) return [];

  // Extract all skill names from { name: "..." }
  const skills = [];
  const re = /\{\s*name:\s*\"([^\"]+)\"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    skills.push(m[1]);
  }

  if (!skills.length) return [];

  return [
    {
      id: 'skills:all',
      text: `Skills: ${skills.join(', ')}`,
      meta: { type: 'skills' },
    },
  ];
}

function extractPortfolioDocuments({ portfolioJsxPath }) {
  const source = fs.readFileSync(portfolioJsxPath, 'utf-8');

  const docs = [];

  const about = extractAboutParagraph(source);
  if (about) {
    docs.push({ id: 'about:paragraph', text: `About: ${about}`, meta: { type: 'about' } });
  }

  const contact = extractContactInfo(source);
  const contactParts = [];
  if (contact.email) contactParts.push(`Email: ${contact.email}`);
  if (contact.phone) contactParts.push(`Phone: ${contact.phone}`);
  if (contact.location) contactParts.push(`Location: ${contact.location}`);
  if (contactParts.length) {
    docs.push({ id: 'contact:info', text: contactParts.join('\n'), meta: { type: 'contact' } });
  }

  const projectsBlock = sliceConstArray(source, 'projects');
  if (projectsBlock) {
    docs.push(...extractProjectDocs(projectsBlock));
  }

  docs.push(...extractSimpleArrayDocs(source, 'services', 'Service'));
  docs.push(...extractSimpleArrayDocs(source, 'achievements', 'Achievement'));
  docs.push(...extractSimpleArrayDocs(source, 'coCurricularActivities', 'Activity'));
  docs.push(...extractSkillsDocs(source));

  // Fallback: also include a compact snapshot object if present.
  const snapshotMatch = source.match(/portfolioSnapshot=\{\{([\s\S]*?)\}\}\s*\/>/);
  if (snapshotMatch) {
    docs.push({
      id: 'snapshot:raw',
      text: `Portfolio snapshot (raw): ${stripJsxTags(snapshotMatch[1])}`,
      meta: { type: 'snapshot' },
    });
  }

  return docs;
}

module.exports = {
  extractPortfolioDocuments,
};
