const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const dbPath = path.join(__dirname, './users.sqlite');
const { hashPassword } = require("../utils/hash");

(async () => {
  const db = new sqlite3.Database(dbPath);

  const username = "admin";
  const email = "admin@email.com";
  const password = await hashPassword("password123");

  db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password], (err) => {
    if (err) console.error("Error:", err);
    else console.log("User created.");
    db.close();
  });
})();