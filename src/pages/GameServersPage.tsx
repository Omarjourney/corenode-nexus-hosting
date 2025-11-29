import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { GameGrid } from "@/components/games/GameGrid";

const GameServersPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="Game Server Hosting – CodeNodeX"
      description="Deploy Rust, ARK, Valheim, Minecraft, and more with CommandCenter™ automation and CorePanel Lite™."
      keywords="game server hosting, rust server, valheim server, ark server, instant deploy"
    />
    <Navigation />

    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">CATALOG</p>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary">
            Game Server Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Browse every supported title, filter by genre, and launch from the closest RAM tier recommended for each game.
          </p>
        </header>

        <GameGrid />
      </div>
    </div>
  </div>
);

export default GameServersPage;
