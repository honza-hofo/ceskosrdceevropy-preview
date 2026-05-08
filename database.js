const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'data', 'cse.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    perex TEXT,
    content TEXT,
    category TEXT NOT NULL,
    featured_image TEXT,
    author TEXT,
    published_at DATE,
    is_published INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT 'HOFO',
    subtitle TEXT DEFAULT 'Studiové projekty',
    link_url TEXT DEFAULT 'https://hofo.cz',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS banner_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    banner_id INTEGER NOT NULL,
    image_url TEXT,
    title TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (banner_id) REFERENCES banners(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo_url TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS poll_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  );
`);

// Seed default settings
const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;
if (settingsCount === 0) {
  const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insert.run('contact_email', 'redakce@ceskesrdceevropy.cz');
  insert.run('seo_title', 'Česko srdce Evropy - Příběhy, které formují Česko');
  insert.run('seo_description', 'Rozhovory, věda, technologie, právo, umění a ocenění z České republiky');
}

// Seed default admin
const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get().c;
if (adminCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password_hash, display_name) VALUES (?, ?, ?)').run('admin', hash, 'Administrátor');
}

// Seed default banner
const bannerCount = db.prepare('SELECT COUNT(*) as c FROM banners').get().c;
if (bannerCount === 0) {
  const result = db.prepare("INSERT INTO banners (title, subtitle, link_url) VALUES ('HOFO', 'Studiove projekty', 'https://hofo.cz')").run();
  const bid = result.lastInsertRowid;
  const ins = db.prepare('INSERT INTO banner_items (banner_id, image_url, title, sort_order) VALUES (?, ?, ?, ?)');
  ins.run(bid, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=225&fit=crop', 'Imageovy spot: Budoucnost ceske energetiky', 1);
  ins.run(bid, 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop', 'Produktove video: AI ve vyrobni lince', 2);
  ins.run(bid, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop', 'Dokument: Pribeh ceskeho startupu', 3);
}

module.exports = db;
