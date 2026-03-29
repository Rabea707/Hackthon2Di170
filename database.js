const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('fitness.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein INTEGER DEFAULT 0,
      carbs INTEGER DEFAULT 0,
      fats INTEGER DEFAULT 0,
      date TEXT NOT NULL DEFAULT (date('now'))
    )
  `);
});

module.exports = db;