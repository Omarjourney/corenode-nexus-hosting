import type { GameDefinition } from "@/types/hosting";
import { formatPrice, getClosestPlan, getLowestTierPrice } from "@/utils/pricing";

interface Props {
  game: GameDefinition;
}

export function GameCard({ game }: Props) {
  const plan = getClosestPlan(game.defaultTier, game.recommendedRam);
  const startingPrice = getLowestTierPrice(game.defaultTier);

  return (
    <div className="flex flex-col rounded-[12px] bg-gradient-to-br from-[#0B0F17] to-[#111827] p-5 border border-cyan-500/25 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:border-cyan-400/60 transition">
      <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">{game.tags.join(" · ")}</div>
      <h3 className="mb-2 text-lg font-semibold text-slate-100">{game.name}</h3>
      <div className="mb-2 text-sm text-slate-300">
        Recommended: {game.recommendedRam}GB, {game.defaultTier.toUpperCase()} tier
      </div>
      <div className="mb-3 text-2xl font-extrabold text-[#00E5FF]">From {formatPrice(startingPrice)}</div>
      <div className="mb-4 text-xs text-slate-400">Closest plan match: {plan.ram}GB @ {formatPrice(plan.price)}</div>
      <button
        className="mt-auto rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00AFFF] to-[#8B5CF6] hover:brightness-110 hover:scale-[1.03] transition transform"
      >
        Launch Server
      </button>
    </div>
  );
}
