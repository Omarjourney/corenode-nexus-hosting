import { HostingCard } from "@/components/HostingCard";
import type { GameDefinition } from "@/types/hosting";
import { formatPrice, getClosestPlan, getLowestTierPrice } from "@/utils/pricing";

interface Props {
  game: GameDefinition;
}

export function GameCard({ game }: Props) {
  const plan = getClosestPlan(game.defaultTier, game.recommendedRam);
  const startingPrice = getLowestTierPrice(game.defaultTier);
  const tagLine = game.tags.join(" • ");

  return (
    <HostingCard
      title={game.name}
      label={tagLine}
      price={`Starting at ${formatPrice(startingPrice)}`}
      specs={[
        `Recommended: ${game.recommendedRam}GB • ${game.defaultTier.toUpperCase()} tier`,
        `Closest plan: ${plan.ram}GB @ ${formatPrice(plan.price)}`,
        "DDoS shield • Instant mod support",
      ]}
      ctaLabel="Launch Server"
      href="/order"
    />
  );
}
