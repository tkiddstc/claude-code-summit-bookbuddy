const test = require('node:test');
const assert = require('node:assert');
const { createDb } = require('../db');

// Helper: a fresh in-memory DB seeded with one book, returning [db, bookId].
function dbWithBook() {
  const db = createDb(':memory:');
  const bookId = db.prepare(
    'INSERT INTO books (title, author, isbn, description, genre) VALUES (?, ?, ?, ?, ?)'
  ).run('Dune', 'Frank Herbert', '978-0441013593', 'A desert epic.', 'Science Fiction').lastInsertRowid;
  return [db, bookId];
}

test('creates a book with all fields persisted', () => {
  const [db, bookId] = dbWithBook();

  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
  assert.strictEqual(book.title, 'Dune');
  assert.strictEqual(book.author, 'Frank Herbert');
  assert.strictEqual(book.genre, 'Science Fiction');

  db.close();
});

test('average rating aggregates across multiple reviews', () => {
  const [db, bookId] = dbWithBook();
  const insertReview = db.prepare(
    'INSERT INTO reviews (book_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)'
  );
  insertReview.run(bookId, 'Dave', 5, 'Masterpiece.');
  insertReview.run(bookId, 'Eve', 3, 'Dense.');

  const info = db.prepare(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE book_id = ?'
  ).get(bookId);

  assert.strictEqual(info.review_count, 2);
  assert.strictEqual(info.avg_rating, 4); // (5 + 3) / 2

  db.close();
});

test('a book with no reviews reports null average and zero count', () => {
  const [db, bookId] = dbWithBook();

  const info = db.prepare(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE book_id = ?'
  ).get(bookId);

  assert.strictEqual(info.avg_rating, null);
  assert.strictEqual(info.review_count, 0);

  db.close();
});

test('deleting a review removes it from the book', () => {
  const [db, bookId] = dbWithBook();
  const reviewId = db.prepare(
    'INSERT INTO reviews (book_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)'
  ).run(bookId, 'Dave', 5, 'Masterpiece.').lastInsertRowid;

  const result = db.prepare('DELETE FROM reviews WHERE id = ?').run(reviewId);
  assert.strictEqual(result.changes, 1);

  const count = db.prepare('SELECT COUNT(*) AS n FROM reviews WHERE book_id = ?').get(bookId).n;
  assert.strictEqual(count, 0);

  db.close();
});

test('deleting a book also clears its reviews', () => {
  const [db, bookId] = dbWithBook();
  db.prepare(
    'INSERT INTO reviews (book_id, reviewer_name, rating, review_text) VALUES (?, ?, ?, ?)'
  ).run(bookId, 'Dave', 5, 'Masterpiece.');

  // Mirrors routes/books.js delete: remove reviews first, then the book.
  db.prepare('DELETE FROM reviews WHERE book_id = ?').run(bookId);
  db.prepare('DELETE FROM books WHERE id = ?').run(bookId);

  assert.strictEqual(db.prepare('SELECT COUNT(*) AS n FROM books').get().n, 0);
  assert.strictEqual(db.prepare('SELECT COUNT(*) AS n FROM reviews').get().n, 0);

  db.close();
});
