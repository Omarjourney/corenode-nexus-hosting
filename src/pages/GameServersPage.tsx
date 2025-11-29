import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { GameGrid } from "@/components/games/GameGrid";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";

const GameServersPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="Game Server Hosting – CodeNodeX"
      description="Deploy Rust, ARK, Valheim, and more with CommandCenter™ automation and CorePanel Lite™."
      keywords="game server hosting, rust server, valheim server, ark server, instant deploy"
    />
    <Navigation />

    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-3">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">CATALOG</p>
          <h1 className="text-5xl font-orbitron font-bold text-foreground">Game Server Hosting</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Browse supported titles, filter by genre, and launch using the standardized pricing cards.
          </p>
        </header>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Choose your game</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">Every card uses the unified "Launch Server" CTA.</p>
          </div>
          <GameGrid />
        </section>

        <FeatureGrid title="Built for every title" />

        <ComparisonTable
          title="CodeNodeX vs generic hosts"
          columns={["CodeNodeX", "Generic Host", "DIY"]}
          rows={[
            { label: "Deploy time", values: ["Under a minute", "10-30 minutes", "Manual"] },
            { label: "Control panel", values: ["CorePanel Lite™", "Basic panel", "None"] },
            { label: "Mod support", values: ["One-click", "Manual", "Manual"] },
            { label: "DDoS protection", values: ["Included", "Add-on", "Self-configured"] },
          ]}
        />

        <FaqSection
          items={[
            {
              question: "Which locations are available?",
              answer: "We deploy across multiple POPs and auto-route to the closest location during checkout.",
            },
            {
              question: "Do you support modded servers?",
              answer: "Yes. Modpack installers and custom JAR uploads are included on every game card.",
            },
            {
              question: "Can I switch games later?",
              answer: "Switch or rebuild from templates without changing your account or billing.",
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default GameServersPage;
