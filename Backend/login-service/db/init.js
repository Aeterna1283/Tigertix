//const sqlite3 = require("sqlite3").verbose();

//const db = new sqlite3.Database("./Backend/login-service/db/users.sqlite");

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, './users.sqlite');
const db = new sqlite3.Database(dbPath, (err) =>
    {
        if (err) 
        {
            console.error('Connection error with database', err.message);
        } 
        else
        {
            console.log('Connected to the SQLite database.');
        }
    });


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  console.log("Users table created.");
});

db.close();