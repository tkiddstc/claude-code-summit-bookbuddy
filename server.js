const express = require('express');
const path = require('path');
const { createDb } = require('./db');

const app = express();
const db = createDb(path.join(__dirname, 'bookbuddy.db'));

app.locals.db = db;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/books', require('./routes/books'));
app.use('/reviews', require('./routes/reviews'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => res.redirect('/books'));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BookBuddy running at http://localhost:${PORT}`);
  });
}

module.exports = app;
