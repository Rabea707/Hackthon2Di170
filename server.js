const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home - show entries for selected date
app.get('/', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];

  db.all('SELECT * FROM entries WHERE date = ? ORDER BY id DESC', [date], (err, entries) => {
    db.get(`
      SELECT 
        COALESCE(SUM(calories), 0) AS calories,
        COALESCE(SUM(protein), 0)  AS protein,
        COALESCE(SUM(carbs), 0)    AS carbs,
        COALESCE(SUM(fats), 0)     AS fats
      FROM entries WHERE date = ?
    `, [date], (err, totals) => {
      res.render('index', { entries, totals, date });
    });
  });
});

// Add entry
app.post('/add', (req, res) => {
  const { food_name, calories, protein, carbs, fats, date } = req.body;
  db.run(
    'INSERT INTO entries (food_name, calories, protein, carbs, fats, date) VALUES (?, ?, ?, ?, ?, ?)',
    [food_name, calories, protein || 0, carbs || 0, fats || 0, date],
    () => res.redirect(`/?date=${date}`)
  );
});

// Delete entry
app.post('/delete/:id', (req, res) => {
  db.get('SELECT date FROM entries WHERE id = ?', [req.params.id], (err, entry) => {
    db.run('DELETE FROM entries WHERE id = ?', [req.params.id], () => {
      res.redirect(`/?date=${entry.date}`);
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
