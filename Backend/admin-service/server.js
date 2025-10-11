const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/adminRoutes');

//Middleware to make sure we use json (I learned from using insomnia (Rodrigo))
app.use(cors());
app.use(express.json());

// Staring up the server
app.use('/api', routes);
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));