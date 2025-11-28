const express = require('express');
const { listModules, normalizeModule } = require('../services/ampClient');
const fallbackModules = require('../data/fallbackModules');

const router = express.Router();

router.get('/api/game-modules', async (_req, res) => {
  const normalizedFallback = fallbackModules.map((module) => normalizeModule(module));

  try {
    const data = await listModules();
    const modules = Array.isArray(data?.Modules)
      ? data.Modules
      : Array.isArray(data)
        ? data
        : [];

    const normalized = modules.map((module) => normalizeModule(module));

    if (!normalized.length) {
      return res.json(normalizedFallback);
    }

    res.json(normalized);
  } catch (error) {
    console.error('Failed to fetch game modules from AMP:', error.message || error);
    res.json(normalizedFallback);
  }
});

module.exports = router;
