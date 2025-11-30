const soap = require('soap');
const fallbackInventory = require('../data/dedicatedInventory');

const regionMap = {
  MIAMI: { label: 'Miami, FL', matchers: [/miami/i, /fl/], flag: '🇺🇸' },
  LOSANGELES: { label: 'Los Angeles, CA', matchers: [/los\s*angeles/i, /la,/i, /california/i], flag: '🇺🇸' },
  NUREMBERG: { label: 'Nuremberg, DE', matchers: [/nuremberg/i, /de\b/i], flag: '🇩🇪' },
  JOHOR: { label: 'Johor, MY', matchers: [/johor/i, /my\b/i, /malaysia/i], flag: '🇲🇾' },
  KANSASCITY: { label: 'Kansas City, MO', matchers: [/kansas\s*city/i, /mo\b/i], flag: '🇺🇸' },
};

const markupRates = {
  BASIC: 0.38,
  CORE: 0.45,
  ULTRA: 0.52,
  TITAN: 0.6,
  VELOCITY: 0.55,
};

const familyMeta = {
  BASIC: {
    cpuFamily: 'Xeon E3 / early Silver',
    clock: '3.0 – 3.4 GHz base',
    geekbench: '700 – 1200',
    pricePerGb: '$0.38 / GB',
    markup: '38%',
    description: 'Perfect for entry workloads, remote labs, and staging pipelines that value price over peak clocks.',
  },
  CORE: {
    cpuFamily: 'Xeon E-22xx & Silver 42xx',
    clock: '3.5 – 4.0 GHz boost',
    geekbench: '1200 – 1900',
    pricePerGb: '$0.45 / GB',
    markup: '45%',
    description: 'Mainstream Xeon and EPYC performance for production web stacks, SaaS, and control planes.',
  },
  ULTRA: {
    cpuFamily: 'Xeon Gold 62xx/63xx',
    clock: '3.2 – 3.8 GHz boost',
    geekbench: '1900 – 2600',
    pricePerGb: '$0.52 / GB',
    markup: '52%',
    description: 'High-core count, NVMe-first compute tuned for analytics, streaming, and busy multi-tenant nodes.',
  },
  TITAN: {
    cpuFamily: 'Dual Xeon Gold / Platinum',
    clock: '3.0 – 3.6 GHz boost',
    geekbench: '2400 – 3200',
    pricePerGb: '$0.60 / GB',
    markup: '60%',
    description: 'Extreme throughput for virtualization clusters, render farms, and enterprise-grade failover.',
  },
  VELOCITY: {
    cpuFamily: 'Ryzen 7000 / 5000 series',
    clock: '4.5 – 5.7 GHz boost',
    geekbench: '2200 – 3400',
    pricePerGb: '$0.55 / GB',
    markup: '55%',
    description: 'Latency-sensitive Ryzen and EPYC Milan-X silicon for game panels, edge services, and bursty APIs.',
  },
};

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
  const upper = region.toUpperCase();
  if (upper === 'ALL') return 'ALL';
  return regionMap[upper] ? upper : 'ALL';
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
  if (fallbackRegion && regionMap[fallbackRegion]) return fallbackRegion;
  const normalized = location.toLowerCase();
  const match = Object.entries(regionMap).find(([, meta]) => meta.matchers.some((regex) => regex.test(normalized)));
  return match ? match[0] : 'MIAMI';
}

function applyMarkup(basePrice, family) {
  const markup = markupRates[family] ?? 0.45;
  const numericPrice = typeof basePrice === 'number' ? basePrice : Number(basePrice || 0);
  return Math.round(numericPrice * (1 + markup));
}

function formatServer(server, familyOverride) {
  const family = familyOverride || mapCpuToFamily(server.cpu || server.CPU || '');
  const region = detectRegion(server.location || server.Location || '', server.region || server.Region);
  const basePrice = server.base_price || server.BasePrice || server.price || 0;
  return {
    id: server.id || server.ServerId || server.InventoryID || `${family.toLowerCase()}-${region}-${server.cpu}`,
    cpu: server.cpu || server.CPU || 'Unknown CPU',
    ram: server.ram || server.RAM || '—',
    storage: server.storage || server.Storage || '—',
    bandwidth: server.bandwidth || server.Bandwidth || '—',
    location: regionMap[region]?.label || server.location || server.Location || 'Unknown',
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
  return Object.values(regionMap).reduce((acc, meta, index) => {
    const key = Object.keys(regionMap)[index];
    const scoped = servers.filter((server) => server.region === key);
    acc[key] = {
      label: meta.label,
      total: scoped.length,
      available: scoped.filter((srv) => srv.availability === 'available').length,
      flag: meta.flag,
    };
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
