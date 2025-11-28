const axios = require('axios');

const AMP_BASE_URL = process.env.AMP_BASE_URL;
const AMP_API_KEY = process.env.AMP_API_KEY;

const CATEGORY_MATCHERS = [
  { name: 'Survival', keywords: ['minecraft', 'valheim', 'ark', 'rust', 'zomboid', '7 days', 'eco', 'palworld'] },
  { name: 'Framework', keywords: ['fivem', 'redm', 'txadmin'] },
  { name: 'FPS', keywords: ['csgo', 'cs2', 'counter-strike', 'insurgency', 'squad', 'dayz', 'killing floor'] },
  { name: 'Generic', keywords: ['source', 'generic', 'steamcmd'] },
];

function kebabCase(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function pickFirst(values = []) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return undefined;
}

function parseNumber(value) {
  const numberValue = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(numberValue) ? numberValue : null;
}

function normalizeCategory(providedCategory, name) {
  if (providedCategory) return providedCategory;
  const lowerName = (name || '').toLowerCase();
  const match = CATEGORY_MATCHERS.find(({ keywords }) =>
    keywords.some((keyword) => lowerName.includes(keyword))
  );

  return match ? match.name : 'Other';
}

function normalizeTemplate(template = {}) {
  const name =
    pickFirst([
      template.Name,
      template.DisplayName,
      template.FriendlyName,
      template.ModuleName,
    ]) || 'Unknown Game';

  const moduleId =
    pickFirst([template.Module, template.ModuleName, template.InternalName]) ||
    'UnknownModule';

  const description =
    pickFirst([template.Description, template.Summary]) ||
    'Game server template managed by AMP.';

  const category = normalizeCategory(template.Category, name);

  const defaultPorts = Array.isArray(template.DefaultPorts)
    ? template.DefaultPorts
        .map((port) => parseNumber(port))
        .filter((port) => port !== null)
    : template.DefaultPort !== undefined && template.DefaultPort !== null
      ? [parseNumber(template.DefaultPort)].filter((port) => port !== null)
      : [];

  const minRamMb = parseNumber(
    pickFirst([
      template.MinimumRAM,
      template.MinimumRAMMB,
      template.MinimumRAMMiB,
      template.MinimumRam,
      template.MinimumRamMB,
    ])
  );

  const maxRamMb = parseNumber(
    pickFirst([template.MaximumRAM, template.MaximumRam, template.MaximumRAMMB])
  );

  const recommendedSlots = parseNumber(
    pickFirst([template.DefaultSlots, template.SuggestedSlots])
  );

  const icon =
    pickFirst([template.Icon, template.Logo]) ||
    `/assets/images/games/${kebabCase(name)}.png`;

  return {
    name,
    moduleId,
    description,
    category,
    defaultPorts,
    minRamMb,
    maxRamMb,
    recommendedSlots,
    icon,
  };
}

async function fetchAmpTemplates() {
  if (!AMP_BASE_URL) {
    throw new Error('AMP_BASE_URL is not configured');
  }

  if (!AMP_API_KEY) {
    throw new Error('AMP_API_KEY is not configured');
  }

  let response;

  try {
    response = await axios.post(
      `${AMP_BASE_URL}/API/ADSModule/GetTemplates`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `AMP-API ${AMP_API_KEY}`,
        },
        timeout: 15000,
      }
    );
  } catch (error) {
    if (error.response) {
      const body =
        typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data);
      throw new Error(
        `AMP GetTemplates failed (${error.response.status}): ${body}`
      );
    }
    throw new Error(`AMP GetTemplates request failed: ${error.message}`);
  }

  const data = response.data;

  if (!Array.isArray(data)) {
    throw new Error('Unexpected AMP GetTemplates response (not an array)');
  }

  return data.map((template) => normalizeTemplate(template));
}

module.exports = { fetchAmpTemplates, normalizeTemplate };
