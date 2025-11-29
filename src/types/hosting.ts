export type TierId = "core" | "elite" | "creator";

export interface Plan {
  ram: number; // in GB
  price: number; // USD / month
}

export interface AddonPrices {
  dedicatedIp: number;
  extra50Gb: number;
  backups: number;
  modpackInstall: number;
  crashGuard: number;
  prioritySupport: number;
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
}
