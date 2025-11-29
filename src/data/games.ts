import categories from "./categories.json";
import rawGameList from "./game-list.json";
import type { GameDefinition } from "@/types/hosting";

const fallbackGames: GameDefinition[] = [
  { id: "rust", name: "Rust", tags: ["survival", "fps"], defaultTier: "elite", recommendedRam: 8, category: "game" },
  { id: "ark", name: "ARK: Survival Evolved", tags: ["survival", "dinosaur"], defaultTier: "elite", recommendedRam: 12, category: "game" },
  { id: "valheim", name: "Valheim", tags: ["survival", "co-op"], defaultTier: "core", recommendedRam: 4, category: "game" },
  { id: "project-zomboid", name: "Project Zomboid", tags: ["zombie", "isometric"], defaultTier: "core", recommendedRam: 4, category: "game" },
  { id: "conan-exiles", name: "Conan Exiles", tags: ["survival", "fantasy"], defaultTier: "elite", recommendedRam: 10, category: "game" },
  { id: "palworld", name: "Palworld", tags: ["survival", "creatures"], defaultTier: "elite", recommendedRam: 12, category: "game" }
];

function normalizeGame(entry: GameDefinition): GameDefinition | null {
  if (!entry?.id || !entry?.name) return null;
  const category = entry.category ?? "game";
  if (category !== "game") return null;
  return {
    ...entry,
    category,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
  };
}

const parsedGames = (rawGameList as GameDefinition[])
  .map(normalizeGame)
  .filter(Boolean) as GameDefinition[];

export const games: GameDefinition[] = parsedGames.length ? parsedGames : fallbackGames;
export const usingGameFallback = !parsedGames.length;
export const gameGenres = categories.gameGenres;
