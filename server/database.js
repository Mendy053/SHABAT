const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'shabat.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create single meal table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS meal (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          created_by TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Create meal_items table (what each user is making)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS meal_items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          user_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Insert default users if table is empty
      this.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
          const defaultUsers = [
            { id: '1', name: 'אמא', color: '#FF6B6B' },
            { id: '2', name: 'אבא', color: '#4ECDC4' },
            { id: '3', name: 'יוסי', color: '#45B7D1' },
            { id: '4', name: 'שרה', color: '#96CEB4' },
            { id: '5', name: 'דוד', color: '#FFEAA7' },
            { id: '6', name: 'רחל', color: '#DDA0DD' }
          ];

          const stmt = this.db.prepare("INSERT INTO users (id, name, color) VALUES (?, ?, ?)");
          defaultUsers.forEach(user => {
            stmt.run(user.id, user.name, user.color);
          });
          stmt.finalize();
        }
      });
    });
  }

  // User methods
  getUsers() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM users ORDER BY name", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  addUser(name, color) {
    const id = require('uuid').v4();
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO users (id, name, color) VALUES (?, ?, ?)", 
        [id, name, color], function(err) {
        if (err) reject(err);
        else resolve({ id, name, color });
      });
    });
  }

  // Single meal methods
  getMeal() {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT m.*, u.name as created_by_name, u.color as created_by_color 
        FROM meal m 
        JOIN users u ON m.created_by = u.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
      `, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  setMeal(name, userId) {
    return new Promise((resolve, reject) => {
      // Check if meal already exists
      this.db.get("SELECT COUNT(*) as count FROM meal", (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count > 0) {
          // Update existing meal
          this.db.run("UPDATE meal SET name = ?, created_by = ?", 
            [name, userId], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, name, created_by: userId });
          });
        } else {
          // Insert new meal
          this.db.run("INSERT INTO meal (name, created_by) VALUES (?, ?)", 
            [name, userId], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, name, created_by: userId });
          });
        }
      });
    });
  }

  // Meal items methods
  getMealItems() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT mi.*, u.name as user_name, u.color as user_color 
        FROM meal_items mi 
        JOIN users u ON mi.user_id = u.id 
        ORDER BY mi.created_at DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  addMealItem(name, description, userId) {
    const id = require('uuid').v4();
    return new Promise((resolve, reject) => {
      this.db.run("INSERT INTO meal_items (id, name, description, user_id) VALUES (?, ?, ?, ?)", 
        [id, name, description, userId], function(err) {
        if (err) reject(err);
        else resolve({ id, name, description, user_id: userId });
      });
    });
  }

  updateMealItem(id, name, description) {
    return new Promise((resolve, reject) => {
      this.db.run("UPDATE meal_items SET name = ?, description = ? WHERE id = ?", 
        [name, description, id], function(err) {
        if (err) reject(err);
        else resolve({ updated: this.changes > 0 });
      });
    });
  }

  deleteMealItem(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM meal_items WHERE id = ?", [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes > 0 });
      });
    });
  }
}

module.exports = new Database(); 