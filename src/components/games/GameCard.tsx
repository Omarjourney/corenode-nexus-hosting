import type { GameDefinition } from "@/types/hosting";
import { formatPrice, getClosestPlan } from "@/utils/pricing";

interface Props {
  game: GameDefinition;
}

export function GameCard({ game }: Props) {
  const plan = getClosestPlan(game.defaultTier, game.recommendedRam);

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/70 p-4 border border-slate-700/60 hover:border-cyan-400/70 transition">
      <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">{game.tags.join(" · ")}</div>
      <h3 className="mb-2 text-lg font-semibold text-slate-100">{game.name}</h3>
      <div className="mb-2 text-sm text-slate-300">
        Recommended: {game.recommendedRam}GB, {game.defaultTier.toUpperCase()} tier
      </div>
      <div className="mb-3 text-2xl font-semibold text-cyan-300">From {formatPrice(plan.price)}</div>
      <button className="mt-auto rounded-xl bg-cyan-500 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400">
        Configure Server
      </button>
    </div>
  );
}
