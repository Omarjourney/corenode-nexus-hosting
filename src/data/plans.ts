import type { Plan, AddonPrices, ProfileTier, MetalPlan } from "@/types/hosting";

export const plans: {
  core: Plan[];
  elite: Plan[];
  creator: Plan[];
  addons: AddonPrices;
  profiles: ProfileTier[];
  nodexMetal: MetalPlan[];
} = {
  core: [
    { ram: 2, price: 4.49 },
    { ram: 4, price: 7.49 },
    { ram: 6, price: 10.49 },
    { ram: 8, price: 13.49 },
    { ram: 10, price: 16.49 },
    { ram: 12, price: 20.49 },
    { ram: 16, price: 26.49 },
    { ram: 24, price: 39.49 },
  ],
  elite: [
    { ram: 4, price: 11.49 },
    { ram: 6, price: 14.49 },
    { ram: 8, price: 17.49 },
    { ram: 10, price: 21.49 },
    { ram: 12, price: 27.49 },
    { ram: 16, price: 36.49 },
    { ram: 24, price: 51.49 },
    { ram: 32, price: 67.49 },
  ],
  creator: [
    { ram: 16, price: 49.99 },
    { ram: 24, price: 69.99 },
    { ram: 32, price: 89.99 },
    { ram: 48, price: 129.99 },
  ],
  addons: {
    dedicatedIp: 2.99,
    extra50Gb: 2.99,
    backups: 3.99,
    modpackInstall: 1.99,
    crashGuard: 3.49,
    prioritySupport: 4.99,
  },
  profiles: [
    { slots: 2, price: 0 },
    { slots: 5, price: 4.49 },
    { slots: 10, price: 6.49 },
    { slots: Infinity, price: 11.99 },
  ],
  nodexMetal: [
    { name: "Ryzen 5600X Metal", price: 109 },
    { name: "Ryzen 7600 Metal", price: 149 },
    { name: "Ryzen 5800X Metal", price: 129 },
    { name: "Ryzen 5950X Metal", price: 179 },
    { name: "Ryzen 7950X Metal", price: 199 },
    { name: "Threadripper Pro Studio", price: 399 },
    { name: "EPYC Performance", price: 289 }, // "from"
  ],
};
