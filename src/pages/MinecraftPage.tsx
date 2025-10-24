import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Users, 
  HardDrive, 
  Cpu, 
  Shield, 
  Wifi, 
  Download,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const MinecraftPage = () => {
  const [javaConfig, setJavaConfig] = useState({
    ram: [4],
    cpu: [2],
    storage: [25],
    slots: [20]
  });

  // Bedrock configuration values for backend submission
  const [ramValue, setRamValue] = useState([2]);
  const [cpuCores, setCpuCores] = useState([1]);
  const [storageSize, setStorageSize] = useState([25]);
  const [playerSlots, setPlayerSlots] = useState([10]);

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

  const plans = {
    basic: {
      name: "Basic",
      price: 8,
      features: ["Standard Support", "Daily Backups", "Basic DDoS Protection"]
    },
    premium: {
      name: "Premium", 
      price: 15,
      features: ["Priority Support", "Hourly Backups", "Enhanced DDoS", "Free Migration"]
    }
  };

  type ServerConfig = {
    ram: number[];
    cpu: number[];
    storage: number[];
    slots: number[];
  };

  const calculatePrice = (config: ServerConfig, isPremium = false) => {
    const basePrice = isPremium ? plans.premium.price : plans.basic.price;
    const ramPrice = config.ram[0] * 2;
    const storagePrice = Math.max(0, (config.storage[0] - 25) * 0.2);
    return (basePrice + ramPrice + storagePrice).toFixed(2);
  };

  return (
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
                          <Card key={index} className="glass-card p-4 cursor-pointer hover-scale hover-glow-primary">
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
                  {/* Basic Plan */}
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{plans.basic.name}</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-primary mt-2">
                        ${calculatePrice(javaConfig)}/mo
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plans.basic.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-primary glow-primary font-orbitron">
                      Start Basic Server
                    </Button>
                  </Card>

                  {/* Premium Plan */}
                  <Card className="glass-card p-6 glow-secondary border-secondary/50">
                    <div className="text-center mb-6">
                      <Badge className="mb-2 bg-gradient-secondary">Most Popular</Badge>
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">{plans.premium.name}</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-secondary mt-2">
                        ${calculatePrice(javaConfig, true)}/mo
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plans.premium.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm font-inter">
                          <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gradient-secondary glow-secondary font-orbitron">
                      Start Premium Server
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
                          <Card key={index} className="glass-card p-4 cursor-pointer hover-scale hover-glow-tertiary">
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
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">Bedrock Hosting</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-tertiary mt-2">
                        $6.99/mo
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center text-sm font-inter">
                        <CheckCircle className="w-4 h-4 mr-2 text-tertiary" />
                        Cross-platform support
                      </li>
                      <li className="flex items-center text-sm font-inter">
                        <CheckCircle className="w-4 h-4 mr-2 text-tertiary" />
                        Mobile optimizations
                      </li>
                      <li className="flex items-center text-sm font-inter">
                        <CheckCircle className="w-4 h-4 mr-2 text-tertiary" />
                        24/7 support
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-tertiary glow-tertiary font-orbitron">
                      Start Bedrock Server
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
                  <Button size="sm" variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
                    Add to Plan
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MinecraftPage;