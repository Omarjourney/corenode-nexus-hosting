import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
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

type GameGenre =
  | "Survival"
  | "FPS"
  | "Sandbox"
  | "Building"
  | "Adventure"
  | "Simulation";

type GameServer = {
  name: string;
  genre: GameGenre;
  players: string;
  minRam: number;
  description: string;
  popular: boolean;
};

const GAME_SERVERS: readonly GameServer[] = [
  {
    name: "ARK: Survival Evolved",
    genre: "Survival",
    players: "70+",
    minRam: 6,
    description: "Dinosaur survival with base building",
    popular: true,
  },
  {
    name: "Rust",
    genre: "Survival",
    players: "200+",
    minRam: 4,
    description: "Hardcore multiplayer survival",
    popular: true,
  },
  {
    name: "Palworld",
    genre: "Survival",
    players: "32",
    minRam: 8,
    description: "Creature collection survival game",
    popular: true,
  },
  {
    name: "Valheim",
    genre: "Survival",
    players: "10",
    minRam: 2,
    description: "Viking-themed survival adventure",
    popular: true,
  },
  {
    name: "Garry's Mod",
    genre: "Sandbox",
    players: "128",
    minRam: 2,
    description: "Physics sandbox with mods",
    popular: false,
  },
  {
    name: "Project Zomboid",
    genre: "Survival",
    players: "100+",
    minRam: 2,
    description: "Isometric zombie survival",
    popular: false,
  },
  {
    name: "Satisfactory",
    genre: "Building",
    players: "4",
    minRam: 4,
    description: "Factory building and automation",
    popular: false,
  },
  {
    name: "Eco",
    genre: "Simulation",
    players: "100",
    minRam: 4,
    description: "Ecosystem simulation and government",
    popular: false,
  },
  {
    name: "Terraria",
    genre: "Adventure",
    players: "255",
    minRam: 1,
    description: "2D sandbox adventure",
    popular: true,
  },
  {
    name: "Factorio",
    genre: "Building",
    players: "65000+",
    minRam: 2,
    description: "Factory automation and logistics",
    popular: false,
  },
  {
    name: "7 Days to Die",
    genre: "Survival",
    players: "8",
    minRam: 3,
    description: "Zombie survival with crafting",
    popular: false,
  },
  {
    name: "Counter-Strike 2",
    genre: "FPS",
    players: "64",
    minRam: 2,
    description: "Competitive tactical shooter",
    popular: true,
  },
  {
    name: "Unturned",
    genre: "Survival",
    players: "24",
    minRam: 1,
    description: "Block-style zombie survival",
    popular: false,
  },
  {
    name: "The Forest",
    genre: "Survival",
    players: "8",
    minRam: 2,
    description: "Cannibal island survival horror",
    popular: false,
  },
  {
    name: "V Rising",
    genre: "Survival",
    players: "40",
    minRam: 4,
    description: "Vampire survival action RPG",
    popular: false,
  },
  {
    name: "Raft",
    genre: "Survival",
    players: "10",
    minRam: 2,
    description: "Ocean survival on a raft",
    popular: false,
  },
  {
    name: "Green Hell",
    genre: "Survival",
    players: "4",
    minRam: 2,
    description: "Amazon rainforest survival",
    popular: false,
  },
  {
    name: "Conan Exiles",
    genre: "Survival",
    players: "40",
    minRam: 6,
    description: "Barbarian survival in Conan universe",
    popular: false,
  },
  {
    name: "DayZ",
    genre: "Survival",
    players: "60",
    minRam: 4,
    description: "Post-apocalyptic zombie survival",
    popular: false,
  },
  {
    name: "Space Engineers",
    genre: "Building",
    players: "16",
    minRam: 4,
    description: "Space construction and survival",
    popular: false,
  },
];

const GENRES: readonly ["all", ...GameGenre[]] = [
  "all",
  "Survival",
  "FPS",
  "Sandbox",
  "Building",
  "Adventure",
  "Simulation",
];

const GameServersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<"all" | GameGenre>("all");

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return GAME_SERVERS.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(normalizedSearch);
      const matchesGenre = selectedGenre === "all" || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchTerm, selectedGenre]);

  const popularGames = useMemo(
    () => GAME_SERVERS.filter((game) => game.popular),
    []
  );

  const resultSummary =
    filteredGames.length === GAME_SERVERS.length && !searchTerm && selectedGenre === "all"
      ? `Showing ${GAME_SERVERS.length} supported games`
      : filteredGames.length > 0
        ? `Showing ${filteredGames.length} result${filteredGames.length === 1 ? "" : "s"}`
        : "No games match your filters yet";

  return (
    <div className="min-h-screen bg-gradient-hero">
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
              {popularGames.slice(0, 4).map((game) => (
                <Card
                  key={game.name}
                  className="glass-card p-6 hover-scale hover-glow-secondary cursor-pointer"
                >
                  <div className="text-center">
                    <Badge className="mb-3 bg-gradient-secondary">Popular</Badge>
                    <h3 className="text-xl font-orbitron text-foreground mb-2">{game.name}</h3>
                    <p className="text-sm text-muted-foreground font-inter">{game.description}</p>
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
                  onChange={(event) => setSelectedGenre(event.target.value as "all" | GameGenre)}
                  className="w-full appearance-none bg-background/80 border-0 rounded-md py-2 pl-10 pr-4 font-inter text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Filter by genre"
                >
                  {GENRES.map((genre) => (
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
            {filteredGames.map((game) => (
              <Card
                key={game.name}
                className="glass-card p-6 hover-scale hover-glow-primary cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-orbitron font-semibold text-foreground text-sm">
                      {game.name}
                    </h3>
                    {game.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {game.genre}
                  </Badge>

                  <p className="text-xs text-muted-foreground font-inter">{game.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-muted-foreground">
                        <HardDrive className="w-3 h-3 mr-1" />
                        Min RAM: {game.minRam}GB
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {game.players} players
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

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-inter">
                No games found matching your search criteria.
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
                <Users className="w-8 h-8 mx-auto text-primary glow-primary" />
                <h4 className="font-orbitron font-medium text-foreground">24/7 Support</h4>
                <p className="text-sm text-muted-foreground font-inter">
                  Expert gaming support team
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
