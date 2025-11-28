const express = require('express');
const { listModules, normalizeModule } = require('../services/ampClient');

const router = express.Router();

router.get('/api/game-modules', async (_req, res) => {
  try {
    const data = await listModules();
    const modules = Array.isArray(data?.Modules)
      ? data.Modules
      : Array.isArray(data)
        ? data
        : [];

    const normalized = modules.map((module) => normalizeModule(module));

    res.json(normalized);
  } catch (error) {
    console.error('Failed to fetch game modules from AMP:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch game modules' });
  }
});

module.exports = router;
