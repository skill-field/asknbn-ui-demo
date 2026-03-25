const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

const makeRoutes = (key) => {
  router.get(`/${key}`, (req, res) => res.json(store[key]));
  router.get(`/${key}/:id`, (req, res) => {
    const item = store[key].find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });
  router.post(`/${key}`, (req, res) => {
    const item = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    store[key].push(item);
    res.status(201).json(item);
  });
  router.put(`/${key}/:id`, (req, res) => {
    const idx = store[key].findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    store[key][idx] = { ...store[key][idx], ...req.body, id: req.params.id };
    res.json(store[key][idx]);
  });
  router.delete(`/${key}/:id`, (req, res) => {
    const idx = store[key].findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    store[key].splice(idx, 1);
    res.status(204).send();
  });
};

['models', 'guardrails', 'prompts', 'tools', 'udfs'].forEach(makeRoutes);

module.exports = router;
