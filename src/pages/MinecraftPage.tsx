import { useMemo, useState } from "react";

type BillingCycle = "monthly" | "quarterly" | "annual";

type DisplayPrice = {
  priceLine: string;
  savings: string | null;
};

interface SliderServerConfig {
  ram: number[];
  cpu: number[];
  storage: number[];
  slots: number[];
}

const basePrice = {
  java: { basic: 9, premium: 17 },
  bedrock: { basic: 7, premium: 14 }
};

const increments = {
  java: {
    ram: [3, 4],
    cpu: [2, 3],
    storage: [0.75, 1],
    slots: [1, 1.5]
  },
  bedrock: {
    ram: [2, 3],
    cpu: [1.5, 2],
    storage: [0.5, 0.75],
    slots: [0.75, 1]
  }
} as const;

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

const calcMonthlyPrice = (
  edition: keyof typeof basePrice,
  tier: "basic" | "premium",
  ramGB: number,
  cpuCores: number,
  storageGB: number,
  playerSlots: number
) => {
  const tIndex = tier === "basic" ? 0 : 1;
  const base = basePrice[edition][tier];
  const inc = increments[edition];

  const ramAdd = Math.max(0, ramGB - 1) * inc.ram[tIndex];
  const cpuAdd = Math.max(0, cpuCores - 2) * inc.cpu[tIndex];
  const storageAdd = Math.max(0, (storageGB - 10) / 10) * inc.storage[tIndex];
  const slotAdd = Math.max(0, (playerSlots - 20) / 10) * inc.slots[tIndex];

  const additions = parseFloat((ramAdd + cpuAdd + storageAdd + slotAdd).toFixed(2));
  const total = parseFloat((base + additions).toFixed(2));

  return { base, additions, total };
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

const formatPriceDisplay = (pricing: { total: number }, cycle: BillingCycle): DisplayPrice => {
  const { discountedTotal, monthsBilled, monthlyTotal } = applyBillingDiscount(pricing.total, cycle);
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Server, Users, HardDrive, Cpu, CheckCircle } from "lucide-react";

const MinecraftPage = () => {
  const [javaConfig, setJavaConfig] = useState<SliderServerConfig>({
    ram: [4],
    cpu: [2],
    storage: [25],
    slots: [20]
  });
  const [javaBillingCycle, setJavaBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedJavaVersion, setSelectedJavaVersion] = useState<string | null>(null);

  // Bedrock configuration values for backend submission
  const [ramValue, setRamValue] = useState([2]);
  const [cpuCores, setCpuCores] = useState([1]);
  const [storageSize, setStorageSize] = useState([25]);
  const [playerSlots, setPlayerSlots] = useState([10]);
  const [bedrockBillingCycle, setBedrockBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedBedrockVersion, setSelectedBedrockVersion] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const javaVersions = [
    { name: "Vanilla", description: "Official Minecraft server" },
    { name: "Spigot", description: "Plugin support with optimizations" },
    { name: "Paper", description: "High performance fork of Spigot" },
    { name: "Forge", description: "Mod support with Forge modloader" },
    { name: "Fabric", description: "Lightweight modern mod support" }
  ];

  const bedrockVersions = [
    { name: "Vanilla", description: "Official Bedrock server" },
    { name: "Nukkit", description: "Bedrock server with plugin support" },
    { name: "PocketMine", description: "Cross-platform Bedrock server" }
  ];

  const addOns = [
    { name: "Dedicated IP", price: 3, description: "Your own dedicated IP address" },
    { name: "DDoS Protection+", price: 5, description: "Enhanced DDoS protection" },
    { name: "Extra Backups", price: 2, description: "Daily automated backups" },
    { name: "Plugin Management", price: 4, description: "Professional plugin installation" },
    { name: "Migration Service", price: 10, description: "Free server migration" }
  ];

  const javaPlans = {
    basic: {
      name: "Basic",
      features: ["Standard Support", "Daily Backups", "Basic DDoS Protection"]
    },
    premium: {
      name: "Premium",
      features: ["Priority Support", "Hourly Backups", "Enhanced DDoS", "Free Migration"]
    }
  };

  const bedrockPlans = {
    basic: {
      name: "Basic",
      features: ["Cross-platform support", "Mobile optimizations", "24/7 support"]
    },
    premium: {
      name: "Premium",
      features: ["Cross-platform support", "Priority support", "Enhanced backups", "DDoS Protection+"]
    }
  };

  const javaBasicPricing = useMemo(
    () =>
      calcMonthlyPrice(
        "java",
        "basic",
        javaConfig.ram[0],
        javaConfig.cpu[0],
        javaConfig.storage[0],
        javaConfig.slots[0]
      ),
    [javaConfig]
  );

  const javaPremiumPricing = useMemo(
    () =>
      calcMonthlyPrice(
        "java",
        "premium",
        javaConfig.ram[0],
        javaConfig.cpu[0],
        javaConfig.storage[0],
        javaConfig.slots[0]
      ),
    [javaConfig]
  );

  const bedrockBasicPricing = useMemo(
    () =>
      calcMonthlyPrice(
        "bedrock",
        "basic",
        ramValue[0],
        cpuCores[0],
        storageSize[0],
        playerSlots[0]
      ),
    [cpuCores, playerSlots, ramValue, storageSize]
  );

  const bedrockPremiumPricing = useMemo(
    () =>
      calcMonthlyPrice(
        "bedrock",
        "premium",
        ramValue[0],
        cpuCores[0],
        storageSize[0],
        playerSlots[0]
      ),
    [cpuCores, playerSlots, ramValue, storageSize]
  );

  const javaBasicDisplay = useMemo(
    () => formatPriceDisplay(javaBasicPricing, javaBillingCycle),
    [javaBasicPricing.total, javaBillingCycle]
  );
  const javaPremiumDisplay = useMemo(
    () => formatPriceDisplay(javaPremiumPricing, javaBillingCycle),
    [javaPremiumPricing.total, javaBillingCycle]
  );
  const bedrockBasicDisplay = useMemo(
    () => formatPriceDisplay(bedrockBasicPricing, bedrockBillingCycle),
    [bedrockBasicPricing.total, bedrockBillingCycle]
  );
  const bedrockPremiumDisplay = useMemo(
    () => formatPriceDisplay(bedrockPremiumPricing, bedrockBillingCycle),
    [bedrockPremiumPricing.total, bedrockBillingCycle]
  );

  return (
    <>
      <SEO
        title="Fast Minecraft Hosting – $4.49/mo Miami Servers"
        description="Get low-lag Minecraft servers with CNX CommandCenter™ and CorePanel Lite™. Host in Miami for LATAM speed – starting at $4.49/month."
        keywords="minecraft server hosting, fast minecraft hosting, miami servers"
        canonical="https://example.com/minecraft"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Minecraft Server Hosting',
          description:
            'Fast Minecraft hosting with Miami servers for LATAM players starting at $4.49/mo.',
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
              Premium Minecraft hosting for Java & Bedrock with full modpack support, 
              instant setup, and professional management tools.
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
                            RAM: {javaConfig.ram[0]}GB
                          </label>
                          <Badge variant="secondary">Recommended: 4GB</Badge>
                        </div>
                        <Slider
                          value={javaConfig.ram}
                          onValueChange={(value) => setJavaConfig({...javaConfig, ram: value})}
                          max={32}
                          min={1}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-primary" />
                            CPU Cores: {javaConfig.cpu[0]}
                          </label>
                        </div>
                        <Slider
                          value={javaConfig.cpu}
                          onValueChange={(value) => setJavaConfig({...javaConfig, cpu: value})}
                          max={8}
                          min={1}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Server className="w-4 h-4 mr-2 text-primary" />
                            Storage: {javaConfig.storage[0]}GB
                          </label>
                        </div>
                        <Slider
                          value={javaConfig.storage}
                          onValueChange={(value) => setJavaConfig({...javaConfig, storage: value})}
                          max={200}
                          min={10}
                          step={5}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-primary" />
                            Player Slots: {javaConfig.slots[0]}
                          </label>
                          <Badge variant="secondary">Recommended: 20</Badge>
                        </div>
                        <Slider
                          value={javaConfig.slots}
                          onValueChange={(value) => setJavaConfig({...javaConfig, slots: value})}
                          max={100}
                          min={5}
                          step={5}
                          className="mb-6"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Pricing Panel */}
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
                  {/* Basic Plan */}
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{javaPlans.basic.name}</h4>
                      <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient-primary mt-2">
                        {javaBasicDisplay.priceLine}
                      </div>
                      {javaBasicDisplay.savings && (
                        <p className="text-sm text-muted-foreground font-inter mt-2">
                          {javaBasicDisplay.savings}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {javaPlans.basic.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron">
                      <a
                        href={`/order?category=minecraft&edition=java&plan=basic&billing=${javaBillingCycle}&ram=${javaConfig.ram[0]}&cpu=${javaConfig.cpu[0]}&storage=${javaConfig.storage[0]}&slots=${javaConfig.slots[0]}`}
                      >
                        Start Basic Server
                      </a>
                    </Button>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="glass-card p-6 glow-secondary border-secondary/50">
                    <div className="text-center mb-6">
                      <Badge className="mb-2 bg-gradient-secondary">Most Popular</Badge>
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{javaPlans.premium.name}</h4>
                      <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient-secondary mt-2">
                        {javaPremiumDisplay.priceLine}
                      </div>
                      {javaPremiumDisplay.savings && (
                        <p className="text-sm text-muted-foreground font-inter mt-2">
                          {javaPremiumDisplay.savings}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {javaPlans.premium.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gradient-secondary glow-secondary font-orbitron">
                      <a
                        href={`/order?category=minecraft&edition=java&plan=premium&billing=${javaBillingCycle}&ram=${javaConfig.ram[0]}&cpu=${javaConfig.cpu[0]}&storage=${javaConfig.storage[0]}&slots=${javaConfig.slots[0]}`}
                      >
                        Start Premium Server
                      </a>
                    </Button>
                  </Card>
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
                            RAM: {ramValue[0]}GB
                          </label>
                          <Badge variant="secondary">Recommended: 2GB</Badge>
                        </div>
                        <Slider
                          value={ramValue}
                          onValueChange={setRamValue}
                          max={64}
                          min={1}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Cpu className="w-4 h-4 mr-2 text-tertiary" />
                            CPU Cores: {cpuCores[0]}
                          </label>
                        </div>
                        <Slider
                          value={cpuCores}
                          onValueChange={setCpuCores}
                          max={8}
                          min={1}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Server className="w-4 h-4 mr-2 text-tertiary" />
                            Storage: {storageSize[0]}GB
                          </label>
                        </div>
                        <Slider
                          value={storageSize}
                          onValueChange={setStorageSize}
                          max={100}
                          min={10}
                          step={5}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-tertiary" />
                            Player Slots: {playerSlots[0]}
                          </label>
                          <Badge variant="secondary">Recommended: 10</Badge>
                        </div>
                        <Slider
                          value={playerSlots}
                          onValueChange={setPlayerSlots}
                          max={100}
                          min={1}
                          step={1}
                          color="tertiary"
                          className="mb-6"
                        />
                      </div>
                    </div>

                    {/* Bedrock Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <Card className="glass-card p-4">
                        <h5 className="font-orbitron font-medium text-tertiary mb-2">Cross-Play Support</h5>
                        <p className="text-sm text-muted-foreground font-inter">PC, Mobile, Console compatibility</p>
                      </Card>
                      <Card className="glass-card p-4">
                        <h5 className="font-orbitron font-medium text-tertiary mb-2">Mobile Optimized</h5>
                        <p className="text-sm text-muted-foreground font-inter">Perfect performance on mobile devices</p>
                      </Card>
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
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{bedrockPlans.basic.name}</h4>
                      <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient-tertiary mt-2">
                        {bedrockBasicDisplay.priceLine}
                      </div>
                      {bedrockBasicDisplay.savings && (
                        <p className="text-sm text-muted-foreground font-inter mt-2">
                          {bedrockBasicDisplay.savings}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {bedrockPlans.basic.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-tertiary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-gradient-tertiary glow-tertiary font-orbitron">
                      <a
                        href={`/order?category=minecraft&edition=bedrock&plan=basic&billing=${bedrockBillingCycle}&ram=${ramValue[0]}&cpu=${cpuCores[0]}&storage=${storageSize[0]}&slots=${playerSlots[0]}`}
                      >
                        Start Bedrock Basic Server
                      </a>
                    </Button>
                  </Card>
                  <Card className="glass-card p-6 border-tertiary/50">
                    <div className="text-center mb-6">
                      <Badge className="mb-2 bg-tertiary/20 text-tertiary">Upgrade</Badge>
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{bedrockPlans.premium.name}</h4>
                      <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient-tertiary mt-2">
                        {bedrockPremiumDisplay.priceLine}
                      </div>
                      {bedrockPremiumDisplay.savings && (
                        <p className="text-sm text-muted-foreground font-inter mt-2">
                          {bedrockPremiumDisplay.savings}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {bedrockPlans.premium.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-tertiary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-tertiary/10 border border-tertiary/40 text-tertiary font-orbitron hover:bg-tertiary/20">
                      <a
                        href={`/order?category=minecraft&edition=bedrock&plan=premium&billing=${bedrockBillingCycle}&ram=${ramValue[0]}&cpu=${cpuCores[0]}&storage=${storageSize[0]}&slots=${playerSlots[0]}`}
                      >
                        Start Bedrock Premium Server
                      </a>
                    </Button>
                  </Card>
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
