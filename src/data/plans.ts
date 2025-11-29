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
    { ram: 2, price: 5.49 },
    { ram: 4, price: 7.99 },
    { ram: 6, price: 11.49 },
    { ram: 8, price: 14.99 },
  ],
  elite: [
    { ram: 4, price: 11.49 },
    { ram: 6, price: 16.49 },
    { ram: 8, price: 21.49 },
    { ram: 12, price: 31.49 },
  ],
  creator: [
    { ram: 16, price: 59.99 },
    { ram: 24, price: 87.99 },
    { ram: 32, price: 114.99 },
  ],
  addons: {
    ramPlus1Gb: 2.49,
    ramPlus2Gb: 4.99,
    ramPlus4Gb: 9.99,
    ramPlus8Gb: 19.99,
    cpuBoostCoreToElite: 5.0,
    cpuBoostEliteToCreator: 10.0,
    storagePlus10Gb: 2.99,
    storagePlus25Gb: 6.99,
    storagePlus50Gb: 12.99,
    storagePlus100Gb: 24.99,
    backupBasic50Gb: 6.99,
    backupPro100Gb: 9.99,
    backupEnterprise250Gb: 19.99,
    backupUltimate500Gb: 34.99,
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
