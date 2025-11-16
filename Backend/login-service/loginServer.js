// loginServer.js

const path = require("path");
require("dotenv").config({ 
  path: path.join(__dirname, ".env"),
  debug: true 
});

// === DEBUG: Confirm env is loaded ===
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "LOADED" : "MISSING");
console.log("DATABASE_PATH from .env:", process.env.DATABASE_PATH || "Not set");

// === DB PATH FIX ===
const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, process.env.DATABASE_PATH)
  : path.join(__dirname, "db", "login.sqlite");  // ← Correct: no './'

console.log("Final DB Path:", dbPath);  // ← This should show full path
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const loginRoutes = require("./routes/loginRoute");
const registerRoutes = require("./routes/registerRoute");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

//const dbPath = path.join(__dirname, './db/login.sqlite');
const db = new sqlite3.Database(dbPath, (err) => 
{
  if (err) console.error("DB Error:", err);
  else console.log("Auth DB connected.");
});

app.set("db", db);

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => 
{
  console.log(`Auth service running on http://localhost:${PORT}`);
});

app.get("/api/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Find user in DB
    const db = req.app.get("db");
    db.get(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
      }
    );
  });
});

module.exports = app;