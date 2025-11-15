const jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/hash");

exports.loginUser = (req, res) => {
  const db = req.app.get("db");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password." });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
};