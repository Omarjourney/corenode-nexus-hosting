const axios = require('axios');

const AMP_URL = process.env.AMP_URL;

function normalizeModule(module = {}) {
  return {
    id:
      module.ModuleID ||
      module.ModuleId ||
      module.ID ||
      module.Id ||
      module.id ||
      module.name ||
      '',
    name: module.Name || module.FriendlyName || module.ModuleName || module.name || 'Unknown Module',
    description: module.Description || module.ShortDescription || module.Summary || module.description || '',
    icon: module.Icon || module.IconUrl || module.IconURL || module.icon || null,
    category: module.Category || module.Type || module.category || null,
    minRam:
      module.MinimumRAM ||
      module.MinRam ||
      module.MinRAM ||
      module.RamRequiredMB ||
      module.MinimumMemoryMB ||
      module.minRam ||
      null,
    players:
      module.MaxPlayers ||
      module.PlayerSlots ||
      module.MaximumPlayers ||
      module.players ||
      null,
  };
}

async function listModules() {
  if (!AMP_URL) {
    throw new Error('AMP_URL is not configured');
  }

  const response = await axios.post(
    `${AMP_URL}/API/ListModules`,
    { AuthToken: process.env.AMP_API_KEY },
    { timeout: 15000 }
  );

  return response.data;
}

module.exports = { listModules, normalizeModule };
