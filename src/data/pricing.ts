export const BRAND_NAME = "CodeNodeX";
export const BRAND_TAGLINE = "Neon-fast cloud for games, creators, and teams";

export const CONTROL_PANELS = {
  amp: "CNX CommandCenter™",
  pterodactyl: "CorePanel Lite™"
};

export const minecraftPricing = {
  tiers: {
    core: {
      name: "CORE",
      description: "CorePanel Lite™ essentials with NVMe storage and instant installs",
      multiplier: 1,
      panel: CONTROL_PANELS.pterodactyl
    },
    elite: {
      name: "ELITE",
      description: "CNX CommandCenter™ automation plus priority support",
      multiplier: 1.45,
      panel: CONTROL_PANELS.amp
    },
    creator: {
      name: "CREATOR",
      description: "CommandCenter™ + dedicated vCPU for creators and streamers",
      multiplier: 1.75,
      panel: CONTROL_PANELS.amp
    }
  },
  sliderSteps: [
    { ram: 2, cpu: 1, storage: 25, slots: 10, price: 5.49 },
    { ram: 4, cpu: 2, storage: 40, slots: 20, price: 7.99 },
    { ram: 6, cpu: 3, storage: 60, slots: 30, price: 11.49 },
    { ram: 8, cpu: 4, storage: 80, slots: 40, price: 14.99 },
    { ram: 16, cpu: 6, storage: 160, slots: 80, price: 34.28 },
    { ram: 24, cpu: 8, storage: 240, slots: 120, price: 50.28 },
    { ram: 32, cpu: 10, storage: 320, slots: 160, price: 65.71 }
  ],
  editions: {
    java: {
      name: "Java Edition",
      recommended: 4,
      description: "Forge, Fabric, Paper & Spigot with one-click modpack swaps"
    },
    bedrock: {
      name: "Bedrock Edition",
      recommended: 3,
      description: "Crossplay-ready Bedrock servers with mobile + console optimizations"
    }
  }
};

export const catalogPricing = {
  minecraft: minecraftPricing,
  gameServers: {
    tiers: {
      core: { name: "CORE", price: 12.99, description: "CorePanel Lite™ with mod manager" },
      elite: { name: "ELITE", price: 18.99, description: "CommandCenter™ autoscaling and backups" },
      creator: { name: "CREATOR", price: 28.99, description: "Dedicated vCPU + staging slots" }
    }
  },
  voice: {
    teamspeak: { base: 3.75, perSlot: 0.09 },
    mumble: { base: 3.25, perSlot: 0.07 },
    discord: { base: 4.5 }
  },
  web: {
    core: { price: 5.99, storage: "20GB NVMe" },
    elite: { price: 9.99, storage: "60GB NVMe" },
    creator: { price: 14.99, storage: "120GB NVMe" }
  },
  vps: {
    label: "NodeX Metal™",
    plans: [
      { name: "Metal Micro", ram: "4 GB", vcpu: 2, ssd: "60GB NVMe", bandwidth: "3 TB", price: 15.99 },
      { name: "Metal Core", ram: "8 GB", vcpu: 4, ssd: "150GB NVMe", bandwidth: "5 TB", price: 26.99 },
      { name: "Metal Elite", ram: "16 GB", vcpu: 6, ssd: "300GB NVMe", bandwidth: "7 TB", price: 44.99 },
      { name: "Metal Creator", ram: "32 GB", vcpu: 8, ssd: "600GB NVMe", bandwidth: "10 TB", price: 74.99 }
    ]
  },
  dedicated: {
    label: "NodeX Metal™ Dedicated",
    plans: [
      { name: "Ryzen 7600 Metal", cpu: "Ryzen 7600", ram: "64GB DDR5", storage: "2x1TB NVMe", price: 129 },
      { name: "Ryzen 7950X Metal", cpu: "Ryzen 7950X", ram: "128GB DDR5", storage: "2x2TB NVMe", price: 189 },
      { name: "EPYC Performance", cpu: "Dual EPYC 7543P", ram: "256GB ECC", storage: "4x3.84TB NVMe", price: 289 },
      { name: "Threadripper Pro Studio", cpu: "Threadripper Pro 5955WX", ram: "256GB DDR4", storage: "4x4TB NVMe", price: 329 }
    ]
  }
};

export type PricingTierKey = keyof typeof minecraftPricing.tiers;

export const getTierPrice = (base: number, tier: PricingTierKey) => {
  const multiplier = minecraftPricing.tiers[tier].multiplier;
  return parseFloat((base * multiplier).toFixed(2));
};
