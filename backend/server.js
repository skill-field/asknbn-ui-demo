const express = require('express');
const cors = require('cors');
const chatbotsRouter = require('./routes/chatbots');
const resourcesRouter = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/chatbots', chatbotsRouter);
app.use('/api', resourcesRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🚀 LLM Chatbot Studio API server running on http://localhost:${PORT}`);
});

module.exports = app;
