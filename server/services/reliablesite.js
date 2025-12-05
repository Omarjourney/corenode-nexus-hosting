const soap = require('soap');
const fallbackInventory = require('../data/dedicatedInventory');

const regionMap = {};

const markupRates = {};

const familyMeta = {};

const soapOptions = {
  wsdl_headers: {
    Connection: 'keep-alive',
  },
  timeout: 8000,
};

function normalizeFamily(family) {
  const upper = (family || '').toUpperCase();
  if (['BASIC', 'CORE', 'ULTRA', 'TITAN', 'VELOCITY'].includes(upper)) return upper;
  return 'CORE';
}

function normalizeRegion(region) {
  if (!region) return 'ALL';
  const upper = region.toString().trim().toUpperCase();
  if (!upper) return 'ALL';
  return upper;
}

function mapCpuToFamily(cpu = '') {
  const normalized = cpu.toLowerCase();
  if (normalized.includes('ryzen') || normalized.includes('threadripper') || normalized.includes('epyc 75') || normalized.includes('5950') || normalized.includes('7950')) {
    return 'VELOCITY';
  }
  if (normalized.includes('e5-') || normalized.includes('e3-12') || normalized.includes('silver 42')) {
    return 'BASIC';
  }
  if (normalized.includes('e-22') || normalized.includes('e-23') || normalized.includes('silver')) {
    return 'CORE';
  }
  if (normalized.includes('gold 62') || normalized.includes('gold 63')) {
    return 'ULTRA';
  }
  if (normalized.includes('gold 64') || normalized.includes('platinum') || normalized.includes('dual')) {
    return 'TITAN';
  }
  return 'CORE';
}

function detectRegion(location = '', fallbackRegion) {
  if (fallbackRegion) return fallbackRegion.toString().toUpperCase();
  const normalized = location.toString().trim();
  if (!normalized) return 'UNKNOWN';
  return normalized.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toUpperCase() || 'UNKNOWN';
}

function applyMarkup(basePrice, family) {
  const markup = markupRates[family] ?? 0;
  const numericPrice = typeof basePrice === 'number' ? basePrice : Number(basePrice || 0);
  return Math.round(numericPrice * (1 + markup));
}

function formatServer(server, familyOverride) {
  const family = familyOverride || mapCpuToFamily(server.cpu || server.CPU || '');
  const region = detectRegion(server.location || server.Location || '', server.region || server.Region);
  const basePrice = server.base_price || server.BasePrice || server.price || 0;
  const labelFromServer = server.location || server.Location || 'Unknown';
  return {
    id: server.id || server.ServerId || server.InventoryID || `${family.toLowerCase()}-${region}-${server.cpu}`,
    cpu: server.cpu || server.CPU || 'Unknown CPU',
    ram: server.ram || server.RAM || '—',
    storage: server.storage || server.Storage || '—',
    bandwidth: server.bandwidth || server.Bandwidth || '—',
    location: labelFromServer,
    region,
    availability: (server.availability || server.Status || 'available').toString().toLowerCase().includes('sold')
      ? 'soldout'
      : 'available',
    base_price: typeof basePrice === 'number' ? basePrice : Number(basePrice || 0),
    cnx_price: applyMarkup(basePrice, family),
    stock: server.stock || (server.availability === 'soldout' ? 'out of stock' : 'in stock'),
    family,
  };
}

async function loadRemoteInventory() {
  const wsdlUrl = process.env.RELIABLESITE_WSDL || 'http://api.reliablesite.net/inventory.svc?wsdl';
  try {
    const client = await soap.createClientAsync(wsdlUrl, soapOptions);
    const [response] = await client.ServersListAsync({});
    const rawInventory =
      response?.ServersListResult?.ServerInventory?.ServerInventoryItem || response?.ServersListResult?.ServerInventory || [];
    if (!rawInventory || !Array.isArray(rawInventory)) return null;
    return rawInventory.map((item) => formatServer(item));
  } catch (error) {
    console.warn('[CNX] ReliableSite SOAP unavailable, using fallback inventory.', error?.message || error);
    return null;
  }
}

function buildRegionSummary(servers) {
  return servers.reduce((acc, server) => {
    const key = server.region || 'UNKNOWN';
    const entry = acc[key] || { label: server.location || 'Unknown', total: 0, available: 0, flag: '' };
    entry.total += 1;
    if (server.availability === 'available') {
      entry.available += 1;
    }
    entry.label = server.location || entry.label;
    acc[key] = entry;
    return acc;
  }, {});
}

async function fetchDedicatedServers(familyInput, regionInput) {
  const family = normalizeFamily(familyInput);
  const region = normalizeRegion(regionInput);
  const remoteInventory = await loadRemoteInventory();
  const workingInventory = remoteInventory || fallbackInventory;
  const mapped = workingInventory
    .map((server) => formatServer(server, mapCpuToFamily(server.cpu || server.CPU || '')))
    .filter((server) => server.family === family);

  const regionSummary = buildRegionSummary(mapped);
  const filtered = region === 'ALL' ? mapped : mapped.filter((server) => server.region === region);

  return {
    family,
    region,
    meta: familyMeta[family],
    regionSummary,
    servers: filtered,
    source: remoteInventory ? 'soap' : 'fallback',
  };
}

module.exports = {
  fetchDedicatedServers,
  regionMap,
  markupRates,
  familyMeta,
};
