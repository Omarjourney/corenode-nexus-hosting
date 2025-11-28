import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Server, Users, HardDrive, Cpu, CheckCircle } from "lucide-react";
import { BRAND_NAME, CONTROL_PANELS, getTierPrice, minecraftPricing, PricingTierKey } from "@/data/pricing";

type BillingCycle = "monthly" | "quarterly" | "annual";

type DisplayPrice = {
  priceLine: string;
  savings: string | null;
};

const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual"
};

const billingCycleSuffix: Record<BillingCycle, string> = {
  monthly: "mo",
  quarterly: "quarter",
  annual: "year"
};

const applyBillingDiscount = (monthlyTotal: number, billingCycle: BillingCycle = "monthly") => {
  const cycles: Record<BillingCycle, { months: number; discount: number }> = {
    monthly: { months: 1, discount: 0 },
    quarterly: { months: 3, discount: 0.1 },
    annual: { months: 12, discount: 0.15 }
  };

  const { months, discount } = cycles[billingCycle];
  const discountedTotal = parseFloat((monthlyTotal * months * (1 - discount)).toFixed(2));

  return { monthlyTotal, discountedTotal, monthsBilled: months };
};

const formatPriceDisplay = (base: number, cycle: BillingCycle): DisplayPrice => {
  const { discountedTotal, monthsBilled, monthlyTotal } = applyBillingDiscount(base, cycle);
  if (cycle === "monthly") {
    return { priceLine: `$${monthlyTotal.toFixed(2)}/mo`, savings: null };
  }

  const savings = parseFloat((monthlyTotal * monthsBilled - discountedTotal).toFixed(2));
  const perMonth = (discountedTotal / monthsBilled).toFixed(2);
  return {
    priceLine: `$${discountedTotal.toFixed(2)} / ${billingCycleSuffix[cycle]} ($${perMonth}/mo)`,
    savings: savings > 0 ? `Save $${savings.toFixed(2)} with ${billingCycleLabels[cycle].toLowerCase()} billing` : null
  };
};

const tierFeatures: Record<PricingTierKey, string[]> = {
  core: [
    "CorePanel Lite™ control panel",
    "NVMe storage & DDoS shield",
    "Daily backups",
    "Multi-game profiles"
  ],
  elite: [
    "CNX CommandCenter™ automation",
    "Priority support SLA",
    "Hourly backups",
    "Performance auto-tuning"
  ],
  creator: [
    "Dedicated vCPU isolation",
    "CommandCenter™ + creator perks",
    "White-label staging slot",
    "Advanced observability"
  ]
};

const javaVersions = [
  { name: "Paper / Spigot", description: "Optimized for low-latency survival & SMP" },
  { name: "Forge / Fabric", description: "Full modding support with instant swaps" },
  { name: "Purpur", description: "Performance tuned for high TPS" },
  { name: "Vanilla", description: "Pristine Mojang experience" },
  { name: "Modpacks", description: "FTB, SkyFactory, RLCraft & more" },
  { name: "Snapshots", description: "Test the latest builds safely" }
];

const bedrockVersions = [
  { name: "Pocket Edition", description: "Mobile-first optimization with RTX-ready nodes" },
  { name: "Console Crossplay", description: "Seamless Xbox, PlayStation, Switch support" },
  { name: "GeyserMC", description: "Java <-> Bedrock cross-play bridge" },
  { name: "Vanilla", description: "Lag-free survival worlds" },
  { name: "Modded Bedrock", description: "Behavior packs & realms migrations" },
  { name: "Education", description: "Safe classrooms with audit logs" }
];

const addOns = [
  { name: "Dedicated IP", price: 3, description: "Your own dedicated IP address" },
  { name: "DDoS Protection+", price: 5, description: "Enhanced DDoS protection" },
  { name: "Extra Backups", price: 2, description: "Daily automated backups" },
  { name: "Plugin Management", price: 4, description: "Professional plugin installation" },
  { name: "Migration Service", price: 10, description: "Free server migration" }
];

const tierOrder: PricingTierKey[] = ["core", "elite", "creator"];

const MinecraftPage = () => {
  const [javaStep, setJavaStep] = useState(1);
  const [bedrockStep, setBedrockStep] = useState(0);
  const [javaBillingCycle, setJavaBillingCycle] = useState<BillingCycle>("monthly");
  const [bedrockBillingCycle, setBedrockBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedJavaVersion, setSelectedJavaVersion] = useState<string | null>(null);
  const [selectedBedrockVersion, setSelectedBedrockVersion] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const currentJavaStep = minecraftPricing.sliderSteps[javaStep];
  const currentBedrockStep = minecraftPricing.sliderSteps[bedrockStep];

  const javaPricing = useMemo(
    () =>
      tierOrder.map((tier) => ({
        tier,
        display: formatPriceDisplay(getTierPrice(currentJavaStep.price, tier), javaBillingCycle)
      })),
    [javaBillingCycle, currentJavaStep.price]
  );

  const bedrockPricing = useMemo(
    () =>
      tierOrder.map((tier) => ({
        tier,
        display: formatPriceDisplay(getTierPrice(currentBedrockStep.price, tier), bedrockBillingCycle)
      })),
    [bedrockBillingCycle, currentBedrockStep.price]
  );

  const renderTierCard = (
    tier: PricingTierKey,
    display: DisplayPrice,
    edition: "java" | "bedrock"
  ) => (
    <Card
      key={tier}
      className={`glass-card p-6 ${
        tier === "elite" ? "glow-secondary border-secondary/40" : tier === "creator" ? "glow-primary border-primary/40" : ""
      }`}
    >
      <div className="text-center mb-6">
        {tier !== "core" && (
          <Badge className="mb-2" variant="secondary">
            {tier === "elite" ? "Most Popular" : "Creator Ready"}
          </Badge>
        )}
        <h4 className="text-xl font-orbitron font-semibold text-foreground">{minecraftPricing.tiers[tier].name}</h4>
        <p className="text-sm text-muted-foreground font-inter mb-2">{minecraftPricing.tiers[tier].description}</p>
        <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient-primary mt-2">
          {display.priceLine}
        </div>
        {display.savings && (
          <p className="text-sm text-muted-foreground font-inter mt-2">{display.savings}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Panel: {minecraftPricing.tiers[tier].panel}
        </p>
      </div>
      <ul className="space-y-2 mb-6">
        {tierFeatures[tier].map((feature, index) => (
          <li key={index} className="flex items-center text-sm font-inter">
            <CheckCircle className="w-4 h-4 mr-2 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
      <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron">
        <a
          href={`/order?category=minecraft&edition=${edition}&plan=${tier}&billing=${
            edition === "java" ? javaBillingCycle : bedrockBillingCycle
          }&ram=${edition === "java" ? currentJavaStep.ram : currentBedrockStep.ram}&cpu=${
            edition === "java" ? currentJavaStep.cpu : currentBedrockStep.cpu
          }&storage=${edition === "java" ? currentJavaStep.storage : currentBedrockStep.storage}&slots=${
            edition === "java" ? currentJavaStep.slots : currentBedrockStep.slots
          }`}
        >
          Launch {minecraftPricing.tiers[tier].name} Server
        </a>
      </Button>
    </Card>
  );

  return (
    <>
      <SEO
        title={`Fast Minecraft Hosting – ${BRAND_NAME} CORE, ELITE & CREATOR pricing`}
        description={`CodeNodeX Minecraft hosting with ${CONTROL_PANELS.pterodactyl} and ${CONTROL_PANELS.amp}. Miami, Dallas, and Frankfurt fleets starting at $4.49/mo.`}
        keywords="minecraft server hosting, fast minecraft hosting, miami servers"
        canonical="https://example.com/minecraft"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Minecraft Server Hosting',
          description:
            'Fast Minecraft hosting with global regions and CommandCenter™ automation starting at $4.49/mo.',
          offers: {
            '@type': 'Offer',
            price: '4.49',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }}
      />
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-primary mb-4">
              Minecraft Hosting
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              CORE, ELITE, and CREATOR plans powered by {CONTROL_PANELS.amp} and {CONTROL_PANELS.pterodactyl}.
              LATAM-tuned Miami POP, modpack swaps, and multi-game profiles.
            </p>
          </div>

          {/* Java & Bedrock Tabs */}
          <Tabs defaultValue="java" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="glass-card p-1">
                <TabsTrigger value="java" className="font-orbitron">Java Edition</TabsTrigger>
                <TabsTrigger value="bedrock" className="font-orbitron">Bedrock Edition</TabsTrigger>
              </TabsList>
            </div>

            {/* Java Edition */}
            <TabsContent value="java" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6">
                      Configure Your Java Server
                    </h3>

                    {/* Server Versions */}
                    <div className="mb-8">
                      <h4 className="font-orbitron font-medium text-foreground mb-4">Server Type</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {javaVersions.map((version, index) => (
                          <Card
                            key={index}
                            onClick={() => setSelectedJavaVersion(version.name)}
                            className={
                              `glass-card p-4 cursor-pointer hover-scale hover-glow-primary ${
                                selectedJavaVersion === version.name ? 'ring-2 ring-primary border-primary/50' : ''
                              }`
                            }
                            role="button"
                            aria-pressed={selectedJavaVersion === version.name}
                          >
                            <h5 className="font-orbitron font-medium text-primary">{version.name}</h5>
                            <p className="text-sm text-muted-foreground font-inter">{version.description}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Resource Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <HardDrive className="w-4 h-4 mr-2 text-primary" />
                            RAM: {currentJavaStep.ram}GB
                          </label>
                          <Badge variant="secondary">Recommended: {minecraftPricing.editions.java.recommended}GB</Badge>
                        </div>
                        <Slider
                          value={[javaStep]}
                          onValueChange={(value) => setJavaStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-primary" />
                            CPU Cores: {currentJavaStep.cpu}
                          </label>
                        </div>
                        <Slider
                          value={[javaStep]}
                          onValueChange={(value) => setJavaStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Server className="w-4 h-4 mr-2 text-primary" />
                            Storage: {currentJavaStep.storage}GB NVMe
                          </label>
                        </div>
                        <Slider
                          value={[javaStep]}
                          onValueChange={(value) => setJavaStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-primary" />
                            Player Slots: {currentJavaStep.slots}
                          </label>
                          <Badge variant="secondary">Multi-game profiles</Badge>
                        </div>
                        <Slider
                          value={[javaStep]}
                          onValueChange={(value) => setJavaStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          className="mb-6"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Java Pricing Panel */}
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {(Object.keys(billingCycleLabels) as BillingCycle[]).map((cycle) => (
                      <Button
                        key={cycle}
                        variant={javaBillingCycle === cycle ? "default" : "outline"}
                        className={
                          javaBillingCycle === cycle
                            ? "bg-gradient-primary text-primary-foreground"
                            : "border-primary/40 text-primary"
                        }
                        onClick={() => setJavaBillingCycle(cycle)}
                      >
                        {billingCycleLabels[cycle]}
                      </Button>
                    ))}
                  </div>
                  {javaPricing.map(({ tier, display }) => renderTierCard(tier, display, "java"))}
                </div>
              </div>
            </TabsContent>

            {/* Bedrock Edition */}
            <TabsContent value="bedrock" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Similar structure for Bedrock */}
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6">
                      Configure Your Bedrock Server
                    </h3>

                    {/* Bedrock Server Versions */}
                    <div className="mb-8">
                      <h4 className="font-orbitron font-medium text-foreground mb-4">Server Type</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {bedrockVersions.map((version, index) => (
                          <Card
                            key={index}
                            onClick={() => setSelectedBedrockVersion(version.name)}
                            className={
                              `glass-card p-4 cursor-pointer hover-scale hover-glow-tertiary ${
                                selectedBedrockVersion === version.name ? 'ring-2 ring-tertiary border-tertiary/50' : ''
                              }`
                            }
                            role="button"
                            aria-pressed={selectedBedrockVersion === version.name}
                          >
                            <h5 className="font-orbitron font-medium text-tertiary">{version.name}</h5>
                            <p className="text-sm text-muted-foreground font-inter">{version.description}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Resource Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <HardDrive className="w-4 h-4 mr-2 text-tertiary" />
                            RAM: {currentBedrockStep.ram}GB
                          </label>
                          <Badge variant="secondary">Recommended: {minecraftPricing.editions.bedrock.recommended}GB</Badge>
                        </div>
                        <Slider
                          value={[bedrockStep]}
                          onValueChange={(value) => setBedrockStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-tertiary" />
                            CPU Cores: {currentBedrockStep.cpu}
                          </label>
                        </div>
                        <Slider
                          value={[bedrockStep]}
                          onValueChange={(value) => setBedrockStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Server className="w-4 h-4 mr-2 text-tertiary" />
                            Storage: {currentBedrockStep.storage}GB NVMe
                          </label>
                        </div>
                        <Slider
                          value={[bedrockStep]}
                          onValueChange={(value) => setBedrockStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-tertiary" />
                            Player Slots: {currentBedrockStep.slots}
                          </label>
                          <Badge variant="secondary">Multi-game profiles</Badge>
                        </div>
                        <Slider
                          value={[bedrockStep]}
                          onValueChange={(value) => setBedrockStep(value[0])}
                          max={minecraftPricing.sliderSteps.length - 1}
                          min={0}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Bedrock Pricing Panel */}
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {(Object.keys(billingCycleLabels) as BillingCycle[]).map((cycle) => (
                      <Button
                        key={cycle}
                        variant={bedrockBillingCycle === cycle ? "default" : "outline"}
                        className={
                          bedrockBillingCycle === cycle
                            ? "bg-gradient-tertiary text-primary-foreground"
                            : "border-tertiary/40 text-tertiary"
                        }
                        onClick={() => setBedrockBillingCycle(cycle)}
                      >
                        {billingCycleLabels[cycle]}
                      </Button>
                    ))}
                  </div>
                  {bedrockPricing.map(({ tier, display }) => renderTierCard(tier, display, "bedrock"))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Add-ons Section */}
          <Card className="glass-card p-8 mt-12">
            <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6">Available Add-ons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <Card key={index} className="glass-card p-4 hover-scale hover-glow-primary">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-orbitron font-medium text-foreground">{addon.name}</h4>
                    <span className="text-primary font-orbitron font-semibold">${addon.price}/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-inter mb-3">{addon.description}</p>
                  <Button
                    size="sm"
                    variant={selectedAddOns.includes(addon.name) ? 'default' : 'outline'}
                    className={
                      `w-full ${selectedAddOns.includes(addon.name) ? 'bg-gradient-primary text-primary-foreground' : 'border-primary/50 text-primary hover:bg-primary/10'}`
                    }
                    onClick={() =>
                      setSelectedAddOns((prev) =>
                        prev.includes(addon.name)
                          ? prev.filter((n) => n !== addon.name)
                          : [...prev, addon.name]
                      )
                    }
                    aria-pressed={selectedAddOns.includes(addon.name)}
                  >
                    {selectedAddOns.includes(addon.name) ? 'Added' : 'Add to Plan'}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default MinecraftPage;
