const Database = require('better-sqlite3');

// Opens (or creates) a BookBuddy database at dbPath, ensures the schema
// exists, and returns the connection. Pass ':memory:' for tests.
function createDb(dbPath) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT,
      description TEXT,
      genre TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      reviewer_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      review_text TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);

  // Databases created before the genre column existed need it added.
  const hasGenre = db.prepare('PRAGMA table_info(books)').all().some((col) => col.name === 'genre');
  if (!hasGenre) {
    db.exec('ALTER TABLE books ADD COLUMN genre TEXT');
  }

  return db;
}

module.exports = { createDb };
