const fs = require('fs');
const path = require('path');
const db = require('./database');

const files = fs.readdirSync(__dirname).filter(f => f.startsWith('clanek-') && f.endsWith('.html')).sort();

const catMap = {
  'art': 'Art',
  'oceneni': 'Ocenění',
  'paragrafy': 'Paragrafy',
  'rozhovor': 'Rozhovory',
  'tech': 'Tech',
  'veda': 'Věda'
};

// Clear existing articles first
db.prepare('DELETE FROM articles').run();
console.log('Cleared existing articles.\n');

const insert = db.prepare(`INSERT INTO articles (title, slug, perex, content, category, featured_image, author, published_at, is_published)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`);

let count = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(__dirname, file), 'utf-8');

  // Title
  const titleMatch = html.match(/<h1 class="article-title">(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1] : file;

  // Slug from filename
  const slug = file.replace('.html', '');

  // Author
  const authorMatch = html.match(/class="author-name">(.*?)</);
  const author = authorMatch ? authorMatch[1] : '';

  // Category from filename
  const parts = file.replace('clanek-', '').replace('.html', '').split('-');
  const category = catMap[parts[0]] || 'Speciály';

  // Body content
  const bodyMatch = html.match(/<div class="article-body">([\s\S]*?)<\/div>\s*(?:<div class="article-tags|<div class="author-box)/);
  const content = bodyMatch ? bodyMatch[1].trim() : '';

  // Perex from first paragraph
  const perexMatch = content.match(/<p>([\s\S]*?)<\/p>/);
  const perex = perexMatch ? perexMatch[1].replace(/<[^>]*>/g, '').substring(0, 250) : '';

  // Featured image
  const imgMatch = html.match(/<div class="article-hero">[\s\S]*?<img src="(.*?)"/);
  const image = imgMatch ? imgMatch[1] : '';

  try {
    insert.run(title, slug, perex, content, category, image, author, '2026-03-23');
    count++;
    console.log(`✅ ${category}: ${title}`);
  } catch (e) {
    console.log(`❌ Error (${title}): ${e.message}`);
  }
}

console.log(`\nImportováno ${count} článků.`);
