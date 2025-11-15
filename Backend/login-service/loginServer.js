const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/llmRoute');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());

app.use('/api/login', authRoutes);

app.listen(PORT, () =>
{
    console.log('Login service running on http://localhost:${PORT');
});

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const loginRoutes = require("./routes/loginRoutes");
// const sqlite3 = require("sqlite3").verbose();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DATABASE
// const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
//   if (err) console.error("DB Error:", err);
//   else console.log("Login DB connected.");
// });

// app.set("db", db);

// // ROUTES
// app.use("/api/login", loginRoutes);

// // START SERVER
// const PORT = process.env.PORT || 8001;
// app.listen(PORT, () => {
//   console.log(`Login service running on port ${PORT}`);
// });