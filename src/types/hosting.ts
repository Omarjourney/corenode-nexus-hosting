export type TierId = "core" | "elite" | "creator";

export interface Plan {
  ram: number; // in GB
  price: number; // USD / month
}

export interface AddonPrices {
  ramPlus1Gb: number;
  ramPlus2Gb: number;
  ramPlus4Gb: number;
  ramPlus8Gb: number;
  cpuBoostCoreToElite: number;
  cpuBoostEliteToCreator: number;
  storagePlus10Gb: number;
  storagePlus25Gb: number;
  storagePlus50Gb: number;
  storagePlus100Gb: number;
  backupBasic50Gb: number;
  backupPro100Gb: number;
  backupEnterprise250Gb: number;
  backupUltimate500Gb: number;
}

export interface ProfileTier {
  slots: number; // Infinity = Unlimited
  price: number;
}

export interface MetalPlan {
  name: string;
  price: number;
}

export interface GameDefinition {
  id: string;
  name: string;
  tags: string[];
  defaultTier: TierId;
  recommendedRam: number;
  featured?: boolean;
  category?: "game" | "minecraft" | "voice" | "bots" | string;
}
