const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../database');

// Multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

const CATEGORIES = ['Rozhovory', 'Věda', 'Tech', 'Paragrafy', 'Art', 'Ocenění', 'Speciály'];

// Helper: slug from Czech text
function slugify(text) {
  if (!text) return 'clanek-' + Date.now();
  const map = { 'á':'a','č':'c','ď':'d','é':'e','ě':'e','í':'i','ň':'n','ó':'o','ř':'r','š':'s','ť':'t','ú':'u','ů':'u','ý':'y','ž':'z' };
  return text.toLowerCase().replace(/[áčďéěíňóřšťúůýž]/g, c => map[c] || c)
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

// Login/logout handled in server.js

// ===== ARTICLES =====
router.get('/', (req, res) => res.redirect('/admin/articles'));

router.get('/articles', (req, res) => {
  const cat = req.query.category || '';
  let articles;
  if (cat) {
    articles = db.prepare('SELECT * FROM articles WHERE category = ? ORDER BY published_at DESC, id DESC').all(cat);
  } else {
    articles = db.prepare('SELECT * FROM articles ORDER BY published_at DESC, id DESC').all();
  }
  res.render('admin/articles', { articles, categories: CATEGORIES, selectedCategory: cat, admin: req.session.adminName });
});

router.get('/articles/new', (req, res) => {
  res.render('admin/article-form', { article: null, categories: CATEGORIES, admin: req.session.adminName });
});

router.post('/articles', upload.single('featured_image'), (req, res) => {
  const { title, perex, content, category, author, published_at, is_published } = req.body;
  const slug = slugify(title);
  const image = req.file ? '/uploads/' + req.file.filename : null;
  db.prepare(`INSERT INTO articles (title, slug, perex, content, category, featured_image, author, published_at, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(title, slug, perex, content, category, image, author, published_at || null, is_published ? 1 : 0);
  res.redirect('/admin/articles');
});

router.get('/articles/:id', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.redirect('/admin/articles');
  res.render('admin/article-form', { article, categories: CATEGORIES, admin: req.session.adminName });
});

router.get('/articles/:id/preview', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.redirect('/admin/articles');
  res.render('admin/preview', { article });
});

router.post('/articles/:id', upload.single('featured_image'), (req, res) => {
  const { title, perex, content, category, author, published_at, is_published } = req.body;
  const slug = slugify(title);
  const existing = db.prepare('SELECT featured_image FROM articles WHERE id = ?').get(req.params.id);
  const image = req.file ? '/uploads/' + req.file.filename : (existing ? existing.featured_image : null);
  db.prepare(`UPDATE articles SET title=?, slug=?, perex=?, content=?, category=?, featured_image=?, author=?, published_at=?, is_published=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?`).run(title, slug, perex, content, category, image, author, published_at || null, is_published ? 1 : 0, req.params.id);
  res.redirect('/admin/articles');
});

router.post('/articles/:id/delete', (req, res) => {
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.redirect('/admin/articles');
});

// ===== POLLS =====
router.get('/polls', (req, res) => {
  const polls = db.prepare('SELECT * FROM polls ORDER BY id DESC').all();
  res.render('admin/polls', { polls, admin: req.session.adminName });
});

router.get('/polls/new', (req, res) => {
  res.render('admin/poll-form', { poll: null, options: [], admin: req.session.adminName });
});

router.post('/polls', (req, res) => {
  const { question, options } = req.body;
  const result = db.prepare('INSERT INTO polls (question) VALUES (?)').run(question);
  const pollId = result.lastInsertRowid;
  const optList = Array.isArray(options) ? options : [options];
  const ins = db.prepare('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)');
  optList.filter(o => o && o.trim()).forEach(o => ins.run(pollId, o.trim()));
  res.redirect('/admin/polls');
});

router.get('/polls/:id', (req, res) => {
  const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(req.params.id);
  if (!poll) return res.redirect('/admin/polls');
  const options = db.prepare('SELECT * FROM poll_options WHERE poll_id = ? ORDER BY id').all(req.params.id);
  res.render('admin/poll-form', { poll, options, admin: req.session.adminName });
});

router.post('/polls/:id', (req, res) => {
  const { question, options } = req.body;
  db.prepare('UPDATE polls SET question = ? WHERE id = ?').run(question, req.params.id);
  db.prepare('DELETE FROM poll_options WHERE poll_id = ?').run(req.params.id);
  const optList = Array.isArray(options) ? options : [options];
  const ins = db.prepare('INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)');
  optList.filter(o => o && o.trim()).forEach(o => ins.run(req.params.id, o.trim()));
  res.redirect('/admin/polls');
});

router.post('/polls/:id/activate', (req, res) => {
  db.prepare('UPDATE polls SET is_active = 0').run();
  db.prepare('UPDATE polls SET is_active = 1 WHERE id = ?').run(req.params.id);
  res.redirect('/admin/polls');
});

router.post('/polls/:id/delete', (req, res) => {
  db.prepare('DELETE FROM polls WHERE id = ?').run(req.params.id);
  res.redirect('/admin/polls');
});

// ===== TOP ARTICLES =====
router.get('/top-articles', (req, res) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'top_articles'").get();
  const topIds = row ? JSON.parse(row.value || '[]') : [];
  const allArticles = db.prepare('SELECT id, title, category FROM articles WHERE is_published = 1 ORDER BY title').all();
  res.render('admin/top-articles', { topIds, allArticles, admin: req.session.adminName, saved: req.query.saved });
});

router.post('/top-articles', (req, res) => {
  const ids = Array.isArray(req.body.article_id) ? req.body.article_id : [req.body.article_id];
  const filtered = ids.filter(id => id && parseInt(id) > 0);
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  upsert.run('top_articles', JSON.stringify(filtered));
  res.redirect('/admin/top-articles?saved=1');
});

// ===== BANNER =====
router.get('/banner', (req, res) => {
  const banner = db.prepare('SELECT * FROM banners WHERE is_active = 1 LIMIT 1').get();
  const items = banner ? db.prepare('SELECT * FROM banner_items WHERE banner_id = ? ORDER BY sort_order').all(banner.id) : [];
  res.render('admin/banner', { banner, items, admin: req.session.adminName, saved: req.query.saved });
});

router.post('/banner', upload.none(), (req, res) => {
  const { title, subtitle, link_url } = req.body;
  let banner = db.prepare('SELECT * FROM banners WHERE is_active = 1 LIMIT 1').get();
  if (!banner) {
    const r = db.prepare('INSERT INTO banners (title, subtitle, link_url) VALUES (?, ?, ?)').run(title, subtitle, link_url);
    banner = { id: r.lastInsertRowid };
  } else {
    db.prepare('UPDATE banners SET title=?, subtitle=?, link_url=? WHERE id=?').run(title, subtitle, link_url, banner.id);
  }

  // Update items
  db.prepare('DELETE FROM banner_items WHERE banner_id = ?').run(banner.id);
  const ins = db.prepare('INSERT INTO banner_items (banner_id, image_url, title, link_url, sort_order) VALUES (?, ?, ?, ?, ?)');
  const imgUrls = Array.isArray(req.body.item_image) ? req.body.item_image : [req.body.item_image].filter(Boolean);
  const imgTitles = Array.isArray(req.body.item_title) ? req.body.item_title : [req.body.item_title].filter(Boolean);
  const imgLinks = Array.isArray(req.body.item_link) ? req.body.item_link : [req.body.item_link].filter(Boolean);
  for (let i = 0; i < imgUrls.length; i++) {
    if (imgUrls[i] && imgUrls[i].trim()) {
      ins.run(banner.id, imgUrls[i].trim(), (imgTitles[i] || '').trim(), (imgLinks[i] || '').trim(), i + 1);
    }
  }
  res.redirect('/admin/banner?saved=1');
});

// ===== PARTNERS =====
router.get('/partners', (req, res) => {
  const partners = db.prepare('SELECT * FROM partners ORDER BY sort_order, id').all();
  res.render('admin/partners', { partners, admin: req.session.adminName, saved: req.query.saved });
});

router.post('/partners', upload.none(), (req, res) => {
  const names = Array.isArray(req.body.name) ? req.body.name : [req.body.name].filter(Boolean);
  const logos = Array.isArray(req.body.logo_url) ? req.body.logo_url : [req.body.logo_url].filter(Boolean);
  const links = Array.isArray(req.body.link_url) ? req.body.link_url : [req.body.link_url].filter(Boolean);

  db.prepare('DELETE FROM partners').run();
  const ins = db.prepare('INSERT INTO partners (name, logo_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, 1)');
  for (let i = 0; i < names.length; i++) {
    if (names[i] && names[i].trim()) {
      ins.run(names[i].trim(), (logos[i] || '').trim(), (links[i] || '').trim(), i + 1);
    }
  }
  res.redirect('/admin/partners?saved=1');
});

// ===== SETTINGS =====
router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  res.render('admin/settings', { settings, admin: req.session.adminName, saved: req.query.saved });
});

router.post('/settings', (req, res) => {
  const { contact_email, seo_title, seo_description } = req.body;
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  upsert.run('contact_email', contact_email);
  upsert.run('seo_title', seo_title);
  upsert.run('seo_description', seo_description);
  res.redirect('/admin/settings?saved=1');
});

// ===== USERS =====
router.get('/users', (req, res) => {
  const users = db.prepare('SELECT id, username, display_name, created_at FROM admins ORDER BY id').all();
  res.render('admin/users', { users, admin: req.session.adminName, error: null });
});

router.post('/users', (req, res) => {
  const { username, password, display_name } = req.body;
  if (!username || !password) {
    const users = db.prepare('SELECT id, username, display_name, created_at FROM admins ORDER BY id').all();
    return res.render('admin/users', { users, admin: req.session.adminName, error: 'Vyplňte jméno a heslo' });
  }
  const hash = bcrypt.hashSync(password, 10);
  try {
    db.prepare('INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)').run(username, hash, display_name || username);
  } catch (e) {
    const users = db.prepare('SELECT id, username, display_name, created_at FROM admins ORDER BY id').all();
    return res.render('admin/users', { users, admin: req.session.adminName, error: 'Uživatel už existuje' });
  }
  res.redirect('/admin/users');
});

router.post('/users/:id/delete', (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as c FROM admins').get().c;
  if (count <= 1) return res.redirect('/admin/users');
  db.prepare('DELETE FROM admins WHERE id = ?').run(req.params.id);
  res.redirect('/admin/users');
});

module.exports = router;
