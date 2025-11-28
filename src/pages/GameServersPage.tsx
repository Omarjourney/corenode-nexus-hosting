import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  Filter,
  HardDrive,
  Search,
  Server,
  Users,
} from "lucide-react";

type GameModule = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: string | null;
  minRam: number | null;
  players: number | null;
};

const GameServersPage = () => {
  const [modules, setModules] = useState<GameModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/api/game-modules")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch game modules");
        }
        return response.json();
      })
      .then((data: GameModule[]) => {
        if (!isMounted) return;
        setModules(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((fetchError) => {
        if (!isMounted) return;
        console.error("Error fetching game modules", fetchError);
        setError("Unable to load game modules. Please try again later.");
        setModules([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const availableGenres = useMemo(() => {
    const categories = new Set<string>();
    modules.forEach((module) => {
      if (module.category) {
        categories.add(module.category);
      }
    });
    return ["all", ...Array.from(categories).sort((a, b) => a.localeCompare(b))];
  }, [modules]);

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return modules.filter((game) => {
      const haystack = `${game.name} ${game.description || ""} ${game.category || ""}`
        .toLowerCase()
        .replace(/\s+/g, " ");
      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch);
      const matchesGenre =
        selectedGenre === "all" ||
        (game.category || "").toLowerCase() === selectedGenre.toLowerCase();

      return matchesSearch && matchesGenre;
    });
  }, [modules, searchTerm, selectedGenre]);

  const popularGames = useMemo(() => modules.slice(0, 4), [modules]);

  const resultSummary = useMemo(() => {
    if (loading) return "Loading game modules...";
    if (error) return "Unable to load game modules right now.";
    if (!modules.length) return "No game modules available yet.";
    if (
      filteredGames.length === modules.length &&
      !searchTerm &&
      selectedGenre === "all"
    ) {
      return `Showing ${modules.length} supported games`;
    }

    return filteredGames.length > 0
      ? `Showing ${filteredGames.length} result${
          filteredGames.length === 1 ? "" : "s"
        }`
      : "No games match your filters yet";
  }, [loading, error, modules.length, filteredGames.length, searchTerm, selectedGenre]);

  const formatPlayers = (players: number | null) => {
    if (players === null || players === undefined) return "N/A";
    return players.toString();
  };

  const formatRam = (minRam: number | null) => {
    if (minRam === null || minRam === undefined) return "N/A";
    const normalized = minRam > 64 ? minRam / 1024 : minRam;
    const display = Number.isInteger(normalized)
      ? normalized.toString()
      : normalized.toFixed(1);
    return `${display}GB`;
  };

  const renderPlaceholderCards = (count: number) => (
    Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="glass-card p-6 animate-pulse">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-12" />
          </div>
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="h-9 bg-muted rounded w-full" />
        </div>
      </Card>
    ))
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Game Server Hosting – 80+ Games | CodeNodeX"
        description="Instant deployment for 80+ games including Rust, ARK, Valheim and more. Custom resources, mod support, and expert 24/7 support from CodeNodeX."
        keywords="game server hosting, rust server, valheim server, ark server, instant deploy"
      />
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary mb-4">
              Game Server Hosting
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Instant deployment for 80+ games with configurable resources, mod support, and
              professional management tools.
            </p>
          </div>

          {/* Popular Games Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-orbitron font-semibold text-foreground mb-6">
              Popular Games
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading && renderPlaceholderCards(4)}
              {!loading && popularGames.length === 0 && (
                <p className="text-muted-foreground font-inter col-span-full text-center">
                  No game modules available yet.
                </p>
              )}
              {!loading &&
                popularGames.map((game) => (
                  <Card
                    key={game.id || game.name}
                    className="glass-card p-6 hover-scale hover-glow-secondary cursor-pointer"
                  >
                    <div className="text-center space-y-3">
                      <Badge className="mb-1 bg-gradient-secondary">Popular</Badge>
                      {game.icon ? (
                        <img
                          src={game.icon}
                          alt={`${game.name} icon`}
                          className="mx-auto h-14 w-14 object-contain"
                        />
                      ) : (
                        <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60" />
                      )}
                      <h3 className="text-xl font-orbitron text-foreground mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground font-inter line-clamp-3">
                        {game.description || "Instantly deploy this game with CodeNodeX."}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* Filters */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search games e.g. 'Rust', 'Survival', 'Sandbox'"
                  className="pl-10 bg-background/80 border-0"
                  aria-label="Search games"
                />
              </div>
              <div className="relative w-full sm:w-1/3">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  value={selectedGenre}
                  onChange={(event) => setSelectedGenre(event.target.value)}
                  className="w-full appearance-none bg-background/80 border-0 rounded-md py-2 pl-10 pr-4 font-inter text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Filter by genre"
                >
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === "all" ? "All genres" : genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-inter text-center sm:text-left">
              {resultSummary}
            </p>
          </Card>

          {/* Game Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && renderPlaceholderCards(6)}

            {!loading &&
              filteredGames.map((game) => (
                <Card
                  key={game.id || game.name}
                  className="glass-card p-6 hover-scale hover-glow-primary cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {game.icon ? (
                          <img
                            src={game.icon}
                            alt={`${game.name} icon`}
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60" />
                        )}
                        <h3 className="font-orbitron font-semibold text-foreground text-sm">
                          {game.name}
                        </h3>
                      </div>
                      {game.category && (
                        <Badge variant="secondary" className="text-xs">
                          {game.category}
                        </Badge>
                      )}
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {game.category || "Uncategorized"}
                    </Badge>

                    <p className="text-xs text-muted-foreground font-inter line-clamp-3">
                      {game.description || "Instantly deploy this game with CodeNodeX."}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center text-muted-foreground">
                          <HardDrive className="w-3 h-3 mr-1" />
                          Min RAM: {formatRam(game.minRam)}
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          {formatPlayers(game.players)} players
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-gradient-primary glow-primary font-orbitron text-xs"
                      >
                        <a href={`/order?game=${encodeURIComponent(game.name)}`}>
                          Configure & Deploy
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {!loading && filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter">
                {error
                  ? "Unable to load game modules right now."
                  : "No games found matching your search criteria."}
              </p>
            </div>
          )}

          {/* Features Section */}
          <Card className="glass-card p-8 mt-12">
            <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6 text-center">
              Every Game Server Includes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <Server className="w-8 h-8 mx-auto text-primary glow-primary" />
                <h4 className="font-orbitron font-medium text-foreground">Instant Setup</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  Deploy in under 60 seconds
                </p>
              </div>
              <div className="text-center space-y-2">
                <Cpu className="w-8 h-8 mx-auto text-secondary glow-secondary" />
                <h4 className="font-orbitron font-medium text-foreground">Custom Resources</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  Adjustable RAM, CPU & storage
                </p>
              </div>
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-tertiary glow-tertiary" />
                <h4 className="font-orbitron font-medium text-foreground">Mod Support</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  Easy mod installation & management
                </p>
              </div>
              <div className="text-center space-y-2">
                <Users className="w-8 h-8 mx-auto text-quaternary glow-quaternary" />
                <h4 className="font-orbitron font-medium text-foreground">24/7 Monitoring</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  Automated health checks & alerts
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameServersPage;
