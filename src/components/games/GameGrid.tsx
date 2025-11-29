"use client";

import { useMemo, useState } from "react";
import { games, gameGenres, usingGameFallback } from "@/data/games";
import { GameCard } from "./GameCard";

export function GameGrid() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");

  const genreFilters = useMemo(() => ["all", ...gameGenres], []);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesQuery =
        !query ||
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.id.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = genre === "all" || g.tags.includes(genre.toLowerCase());
      return matchesQuery && matchesGenre;
    });
  }, [query, genre]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          placeholder="Search games e.g. 'Rust', 'Survival', 'Sandbox'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700/70 focus:ring-cyan-400 md:max-w-md"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700/70 focus:ring-cyan-400 md:w-40"
        >
          {genreFilters.map((g) => (
            <option key={g} value={g}>
              {g === "all" ? "All genres" : g[0].toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-slate-900/80 p-4 text-sm text-slate-300">
          {usingGameFallback
            ? "Catalog is running in safe mode. Try another search term or genre."
            : "No games match your search yet. Try a different keyword or genre."}
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 xl:grid-cols-3 justify-center place-items-center items-stretch">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
