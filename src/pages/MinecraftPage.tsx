import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { MinecraftConfigurator } from "@/components/minecraft/MinecraftConfigurator";
import minecraftConfig from "@/data/minecraft-config.json";
import { formatPrice } from "@/utils/pricing";
import { CONTROL_PANELS, minecraftPricing, getTierPrice } from "@/data/pricing";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";
import { HostingCard } from "@/components/HostingCard";

const startPrice = formatPrice(minecraftConfig.editions.java.sliderSteps[0].price);

const tierCards = [
  {
    key: "core" as const,
    badge: "Most Popular",
    specs: [
      "Vanilla + modded ready",
      "NVMe storage with backups",
      `${CONTROL_PANELS.pterodactyl} included`,
    ],
  },
  {
    key: "elite" as const,
    specs: [
      "Automation & crash recovery",
      "Scaling slots and RAM",
      `${CONTROL_PANELS.amp} priority support`,
    ],
  },
  {
    key: "creator" as const,
    specs: [
      "Dedicated vCPU for creators",
      "Staging profiles for testing",
      "High I/O NVMe with snapshots",
    ],
  },
];

const MinecraftPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="Minecraft Server Hosting | CodeNodeX"
      description={`Fast Minecraft hosting with CNX CommandCenter™ and CorePanel Lite™ starting at ${startPrice}.`}
      keywords="minecraft server hosting, fast minecraft hosting, miami servers"
    />
    <Navigation />

    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-3 text-center">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">MINECRAFT</p>
          <h1 className="text-5xl font-orbitron font-bold text-foreground">Java Hosting</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Choose your RAM tier, slide resources, and launch instantly with {CONTROL_PANELS.pterodactyl} or {CONTROL_PANELS.amp}. Pricing follows the RAM plan—no surprises.
          </p>
          <div className="text-sm text-foreground font-inter">Starting at {startPrice}</div>
        </header>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Minecraft tiers</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">CORE, ELITE, and CREATOR cards follow one consistent layout.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tierCards.map((tier) => {
              const tierData = minecraftPricing.tiers[tier.key];
              const basePrice = minecraftConfig.sliderSteps?.[0]?.price || minecraftConfig.editions.java.sliderSteps[0].price;
              const tierPrice = formatPrice(getTierPrice(basePrice, tier.key));

              return (
                <HostingCard
                  key={tierData.name}
                  title={tierData.name}
                  badge={tier.badge}
                  price={`${tierPrice}/mo`}
                  specs={tier.specs}
                  ctaLabel="Launch Server"
                  href="/order"
                />
              );
            })}
          </div>
        </section>

        <MinecraftConfigurator />

        <FeatureGrid title="Fast, automated, protected" />

        <ComparisonTable
          title="Minecraft tier comparison"
          columns={["CORE", "ELITE", "CREATOR"]}
          rows={[
            { label: "Control panel", values: [CONTROL_PANELS.pterodactyl, CONTROL_PANELS.amp, CONTROL_PANELS.amp] },
            { label: "Performance", values: ["Shared CPU", "Prioritized CPU", "Dedicated vCPU"] },
            { label: "Support", values: ["Standard", "Priority", "Priority + staging"] },
            { label: "Modpacks", values: ["One-click", "One-click + rollbacks", "One-click + snapshots"] },
          ]}
        />

        <FaqSection
          items={[
            {
              question: "Can I change tiers later?",
              answer: "Yes. Switch between CORE, ELITE, and CREATOR without rebuilding your world.",
            },
            {
              question: "Where are servers hosted?",
              answer: "We deploy on low-latency regions with NVMe storage and DDoS protection enabled by default.",
            },
            {
              question: "Do you support modded packs?",
              answer: "Yes. Curated modpack templates and custom JAR uploads are supported on every tier.",
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default MinecraftPage;
