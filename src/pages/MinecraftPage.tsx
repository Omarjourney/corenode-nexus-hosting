import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { MinecraftConfigurator } from "@/components/minecraft/MinecraftConfigurator";
import minecraftConfig from "@/data/minecraft-config.json";
import { formatPrice } from "@/utils/pricing";
import { CONTROL_PANELS, getTierPrice, minecraftPricing } from "@/data/pricing";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";
import { HostingCard } from "@/components/HostingCard";

const editionStartPrices = Object.values(minecraftConfig.editions)
  .map((edition) => edition.sliderSteps?.[0]?.price)
  .filter((value): value is number => typeof value === "number");

const startPriceValue = editionStartPrices.length
  ? Math.min(...editionStartPrices)
  : minecraftConfig.editions.java.sliderSteps[0].price;

const startPrice = formatPrice(startPriceValue);

const editionCards = [
  {
    key: "java" as const,
    name: "Java Edition",
    description: minecraftConfig.editions.java.description,
    startPrice: formatPrice(minecraftConfig.editions.java.sliderSteps[0].price),
    specs: ["Forge, Fabric, Paper, Spigot", "Modpack & plugin manager", "Cross-version support"],
  },
  {
    key: "bedrock" as const,
    name: "Bedrock Edition",
    description: minecraftConfig.editions.bedrock.description,
    startPrice: formatPrice(minecraftConfig.editions.bedrock.sliderSteps[0].price),
    specs: ["Mobile + console optimized", "Crossplay with Xbox/PS/Switch", "Instant world backups"],
  },
];

const javaOfficial = minecraftConfig.editions.java.officialPrices;
const tierStartPrices = {
  core: javaOfficial.core?.["2"] ?? minecraftConfig.editions.java.sliderSteps[0].price,
  elite: javaOfficial.elite?.["4"] ?? getTierPrice(minecraftConfig.editions.java.sliderSteps[1].price, "elite"),
  creator:
    javaOfficial.creator?.["16"] ?? getTierPrice(minecraftConfig.editions.java.sliderSteps.find((s) => s.ram === 16)?.price || 0, "creator"),
};

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
          <h1 className="text-5xl font-orbitron font-bold text-foreground">Java & Bedrock Hosting</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Choose Java or Bedrock, slide resources, and launch instantly with {CONTROL_PANELS.pterodactyl} or {" "}
            {CONTROL_PANELS.amp}. Pricing follows the RAM plan—no surprises.
          </p>
          <div className="text-sm text-foreground font-inter">Starting at {startPrice}</div>
        </header>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Pick your edition</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Java and Bedrock cards now share the same layout, pricing color, and CTA.
            </p>
          </div>
          <div className="pricing-grid place-items-center items-stretch">
            {editionCards.map((edition) => (
              <HostingCard
                key={edition.key}
                title={edition.name}
                price={`Starting at ${edition.startPrice}`}
                specs={[edition.description, ...edition.specs]}
                ctaLabel="Launch Server"
                href={`/order?edition=${edition.key}`}
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Minecraft tiers</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">CORE, ELITE, and CREATOR cards follow one consistent layout.</p>
          </div>
          <div className="pricing-grid place-items-center items-stretch">
            {tierCards.map((tier) => {
              const tierData = minecraftPricing.tiers[tier.key];
              const tierPrice = formatPrice(tierStartPrices[tier.key]);

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
