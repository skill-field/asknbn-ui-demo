const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

router.get('/', (req, res) => {
  res.json(store.chatbots);
});

router.get('/:id', (req, res) => {
  const bot = store.chatbots.find(b => b.id === req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found' });
  res.json(bot);
});

router.post('/', (req, res) => {
  const bot = {
    id: uuidv4(),
    name: req.body.name || 'Untitled Bot',
    description: req.body.description || '',
    model: req.body.model || 'gpt-4o',
    status: 'draft',
    tags: req.body.tags || [],
    icon: req.body.icon || 'default',
    pipeline: req.body.pipeline || [],
    tools: req.body.tools || [],
    prompts: req.body.prompts || [],
    guardrails: req.body.guardrails || [],
    createdAt: new Date().toISOString(),
  };
  store.chatbots.push(bot);
  res.status(201).json(bot);
});

router.put('/:id', (req, res) => {
  const idx = store.chatbots.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Chatbot not found' });
  store.chatbots[idx] = { ...store.chatbots[idx], ...req.body, id: req.params.id };
  res.json(store.chatbots[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = store.chatbots.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Chatbot not found' });
  store.chatbots.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
