const express = require('express');
const cors = require('cors');
const llmRoute = require('./route/llmRoute');

const app = express();
const PORT = 7001;

app.use(cors());
app.use(express.json());

app.use('/api/llm', llmRoute);
app.listen(PORT, () => 
{
    console.log('LLM service is running on http://localhost:${PORT');
});

module.exports = app;