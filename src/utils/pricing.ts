import { plans } from "@/data/plans";
import type { TierId } from "@/types/hosting";

export function getPlanPrice(tier: TierId, ram: number): number | null {
  const tierPlans = plans[tier];
  const match = tierPlans.find((p) => p.ram === ram);
  return match ? match.price : null;
}

export function getClosestPlan(tier: TierId, ram: number) {
  const tierPlans = plans[tier];
  return tierPlans.reduce((closest, plan) => {
    const closestDiff = Math.abs(closest.ram - ram);
    const diff = Math.abs(plan.ram - ram);
    return diff < closestDiff ? plan : closest;
  }, tierPlans[0]);
}

export function formatPrice(value: number | null): string {
  if (value == null) return "--";
  return `$${value.toFixed(2)}/mo`;
}
