const express = require('express');
const { fetchAmpTemplates } = require('../services/ampClient');

const router = express.Router();

router.get('/games', async (_req, res) => {
  try {
    const games = await fetchAmpTemplates();

    const grouped = games.reduce(
      (acc, game) => {
        const category = game.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(game);
        return acc;
      },
      {
        Survival: [],
        FPS: [],
        Framework: [],
        Generic: [],
        Other: [],
      }
    );

    res.json({
      success: true,
      count: games.length,
      games,
      grouped,
    });
  } catch (error) {
    console.error('Failed to fetch game templates from AMP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game templates from AMP',
      details: error?.message || 'Unknown error',
    });
  }
});

module.exports = router;
