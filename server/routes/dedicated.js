const express = require('express');
const { fetchDedicatedServers, regionMap } = require('../services/reliablesite');

const router = express.Router();

router.get('/api/dedicated/servers', async (req, res) => {
  const { family, region } = req.query;
  const normalizedFamily = (family || 'CORE').toString().toUpperCase();
  const normalizedRegion = (region || 'ALL').toString().toUpperCase();

  if (!['BASIC', 'CORE', 'ULTRA', 'TITAN', 'VELOCITY'].includes(normalizedFamily)) {
    return res.status(400).json({ error: 'Invalid family parameter' });
  }

  if (normalizedRegion !== 'ALL' && !regionMap[normalizedRegion]) {
    return res.status(400).json({ error: 'Invalid region parameter' });
  }

  try {
    const payload = await fetchDedicatedServers(normalizedFamily, normalizedRegion);
    return res.json(payload);
  } catch (error) {
    console.error('[CNX] Failed to fetch dedicated inventory', error);
    return res.status(500).json({ error: 'Unable to fetch inventory', detail: error?.message });
  }
});

module.exports = router;
