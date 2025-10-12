const express = require('express');
const cors = require('cors');
const {initializeDatabase } = require('./setup');
const routes = require('./routes/adminRoutes');

const app = express();
const PORT = 5001;

//Middleware to make sure we use json (I learned from using insomnia (Rodrigo))
app.use(cors());
app.use(express.json());

// Staring up the server
app.use('/api/admin', routes);

initializeDatabase().then(() => 
{
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});