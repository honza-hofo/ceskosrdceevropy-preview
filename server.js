const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Sessions
app.use(session({
  secret: 'cse-admin-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin/static', express.static(path.join(__dirname, 'public', 'admin')));
app.use('/favicon.svg', express.static(path.join(__dirname, 'favicon.svg')));

// Database
const db = require('./database');

// Helper: category name mapping (URL-safe ↔ display)
const CATEGORIES = ['Rozhovory', 'Věda', 'Tech', 'Paragrafy', 'Art', 'Ocenění', 'Speciály'];
function findCategory(slug) {
  return CATEGORIES.find(c => c.toLowerCase() === decodeURIComponent(slug).toLowerCase()) || null;
}

// Helper: top articles for sidebar (manual selection or fallback to latest)
function getTopArticles() {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'top_articles'").get();
  if (row) {
    const ids = JSON.parse(row.value || '[]');
    if (ids.length > 0) {
      const result = [];
      const stmt = db.prepare('SELECT title, slug, category FROM articles WHERE id = ? AND is_published = 1');
      ids.forEach(id => { const a = stmt.get(id); if (a) result.push(a); });
      if (result.length > 0) return result;
    }
  }
  return db.prepare('SELECT title, slug, category FROM articles WHERE is_published = 1 ORDER BY published_at DESC LIMIT 5').all();
}

// Pagination helper
const PER_PAGE = 8;
function paginate(allItems, page) {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const totalPages = Math.max(1, Math.ceil(allItems.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const items = allItems.slice(start, start + PER_PAGE);
  return { items, currentPage: Math.min(currentPage, totalPages), totalPages };
}

// Helper: banner + partners for sidebar/footer
function getBanner() {
  const banner = db.prepare('SELECT * FROM banners WHERE is_active = 1 LIMIT 1').get();
  const bannerItems = banner ? db.prepare('SELECT * FROM banner_items WHERE banner_id = ? ORDER BY sort_order').all(banner.id) : [];
  return { banner, bannerItems };
}
function getPartners() {
  return db.prepare('SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order, id').all();
}

// Inject banner + partners into all public renders
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) return next();
  const orig = res.render.bind(res);
  res.render = function(view, options = {}, callback) {
    const { banner, bannerItems } = getBanner();
    const partners = getPartners();
    orig(view, { ...options, banner, bannerItems, partners }, callback);
  };
  next();
});

// ===========================
// PUBLIC WEBSITE ROUTES
// ===========================

// Homepage
app.get('/', (req, res) => {
  const all = db.prepare('SELECT * FROM articles WHERE is_published = 1 ORDER BY published_at DESC, id DESC').all();
  const featured = all.length > 0 ? all[0] : null;
  const rest = all.slice(1);
  const { items: articles, currentPage, totalPages } = paginate(rest, req.query.page);
  const topArticles = all.slice(0, 5);
  res.render('homepage', { featured, articles, topArticles, currentPage, totalPages });
});

// Search
app.get('/hledat', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.redirect('/');
  const all = db.prepare("SELECT * FROM articles WHERE is_published = 1 AND (title LIKE ? OR perex LIKE ? OR content LIKE ?) ORDER BY published_at DESC")
    .all(`%${query}%`, `%${query}%`, `%${query}%`);
  const total = all.length;
  const { items: articles, currentPage, totalPages } = paginate(all, req.query.page);
  const topArticles = getTopArticles();
  res.render('search', { query, articles, total, topArticles, currentPage, totalPages });
});

// Article page
app.get('/clanek/:slug', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE slug = ? AND is_published = 1').get(req.params.slug);
  if (!article) return res.status(404).send('Článek nenalezen');
  const related = db.prepare('SELECT * FROM articles WHERE category = ? AND id != ? AND is_published = 1 ORDER BY published_at DESC LIMIT 3').all(article.category, article.id);
  const topArticles = getTopArticles();
  res.render('article', { article, related, topArticles });
});

// Category page
app.get('/kategorie/:slug', (req, res) => {
  const categoryName = findCategory(req.params.slug);
  if (!categoryName) return res.status(404).send('Kategorie nenalezena');
  const all = db.prepare('SELECT * FROM articles WHERE category = ? AND is_published = 1 ORDER BY published_at DESC').all(categoryName);
  const { items: articles, currentPage, totalPages } = paginate(all, req.query.page);
  const topArticles = getTopArticles();
  res.render('category', { categoryName, articles, topArticles, currentPage, totalPages });
});

// ===========================
// ADMIN ROUTES
// ===========================

// Public: Login / Logout
app.get('/admin/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (admin && bcrypt.compareSync(password, admin.password_hash)) {
    req.session.adminId = admin.id;
    req.session.adminName = admin.display_name || admin.username;
    return res.redirect('/admin/articles');
  }
  res.render('admin/login', { error: 'Špatné jméno nebo heslo' });
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Protected admin routes
const requireAuth = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
app.use('/admin', requireAuth, adminRoutes);

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
