import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { catalogPricing, CONTROL_PANELS } from "@/data/pricing";

interface VoiceConfig {
  slots: number[];
  storage: number[];
}

interface VoicePlatform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  features: string[];
  pricing: {
    base: number;
    perSlot: number;
  };
}
import { 
  Mic, 
  Users, 
  HardDrive, 
  Wifi, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Bot,
  Globe,
  Headphones
} from "lucide-react";

const VoiceServersPage = () => {
  const [teamSpeakConfig, setTeamSpeakConfig] = useState<VoiceConfig>({
    slots: [25],
    storage: [1]
  });

  const [mumbleConfig, setMumbleConfig] = useState<VoiceConfig>({
    slots: [50],
    storage: [1]
  });

  const voicePlatforms = [
    {
      name: "TeamSpeak",
      icon: Headphones,
      color: "primary",
      description: "Professional voice communication with advanced permissions",
      features: [
        "Advanced permission system",
        "Channel hierarchy",
        "File transfer support",
        "Server groups & channels",
        "Bandwidth control",
        "Custom server icons"
      ],
      pricing: catalogPricing.voice.teamspeak
    },
    {
      name: "Mumble",
      icon: Mic,
      color: "secondary",
      description: "Low-latency, high-quality voice chat with Opus codec",
      features: [
        "Ultra-low latency",
        "Opus audio codec",
        "Positional audio support", 
        "Certificate authentication",
        "Overlay support",
        "Custom domain support"
      ],
      pricing: catalogPricing.voice.mumble
    },
    {
      name: "Discord Bot",
      icon: Bot,
      color: "tertiary", 
      description: "24/7 Discord bot hosting with custom commands and APIs",
      features: [
        "24/7 uptime guarantee",
        "Custom command support",
        "API integrations",
        "Auto-scaling resources",
        "Database support",
        "Webhook support"
      ],
      pricing: catalogPricing.voice.discord
    }
  ];

  interface Pricing {
    base: number;
    perSlot: number;
  }
  interface VoicePlatform {
    name: string;
    pricing: Pricing;
  }
  interface SlotConfig {
    slots: number[];
  }

  const calculatePrice = (platform: VoicePlatform, config: SlotConfig) => {
    if (platform.name === "Discord Bot") {
      return platform.pricing.base.toFixed(2);
    }
    return (platform.pricing.base + (config.slots[0] * platform.pricing.perSlot)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Voice Server Hosting – TeamSpeak, Mumble & Discord | CodeNodeX"
        description="Professional voice hosting with low-latency audio, advanced permissions, and 24/7 reliability. TeamSpeak, Mumble, and Discord bot hosting."
        keywords="teamspeak hosting, mumble hosting, discord bot hosting, voice servers"
      />
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-tertiary mb-4">
              Voice Server Hosting
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Professional voice communication hosting for TeamSpeak, Mumble, and Discord bots 
              with enterprise-grade performance and reliability.
            </p>
          </div>

          {/* Voice Platform Tabs */}
          <Tabs defaultValue="teamspeak" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="glass-card p-1">
                <TabsTrigger value="teamspeak" className="font-orbitron">TeamSpeak</TabsTrigger>
                <TabsTrigger value="mumble" className="font-orbitron">Mumble</TabsTrigger>
                <TabsTrigger value="discord" className="font-orbitron">Discord Bot</TabsTrigger>
              </TabsList>
            </div>

            {/* TeamSpeak */}
            <TabsContent value="teamspeak" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <div className="flex items-center mb-6">
                      <Headphones className="w-8 h-8 mr-3 text-primary glow-primary" />
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">
                        TeamSpeak Server Configuration
                      </h3>
                    </div>

                    <div className="space-y-8">
                      {/* Slots Configuration */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-primary" />
                            Voice Slots: {teamSpeakConfig.slots[0]}
                          </label>
                          <Badge variant="secondary">Recommended: 25-50</Badge>
                        </div>
                        <Slider
                          value={teamSpeakConfig.slots}
                          onValueChange={(value) => setTeamSpeakConfig({...teamSpeakConfig, slots: value})}
                          max={500}
                          min={5}
                          step={5}
                          className="mb-6"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <HardDrive className="w-4 h-4 mr-2 text-primary" />
                            Storage: {teamSpeakConfig.storage[0]}GB
                          </label>
                        </div>
                        <Slider
                          value={teamSpeakConfig.storage}
                          onValueChange={(value) => setTeamSpeakConfig({...teamSpeakConfig, storage: value})}
                          max={10}
                          min={1}
                          step={1}
                          className="mb-6"
                        />
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {voicePlatforms[0].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm font-inter text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">TeamSpeak Hosting</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-primary mt-2">
                        ${calculatePrice(voicePlatforms[0], teamSpeakConfig)}/mo
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mt-2">
                        {teamSpeakConfig.slots[0]} slots • {teamSpeakConfig.storage[0]}GB storage
                      </p>
                    </div>
                    <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron mb-4">
                      <a href={`/order?category=voice&type=TeamSpeak&slots=${teamSpeakConfig.slots[0]}&storage=${teamSpeakConfig.storage[0]}`}>Deploy TeamSpeak Server</a>
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Setup time:</span>
                        <span className="text-primary font-medium">&lt; 30 seconds</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">DDoS protection:</span>
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Mumble */}
            <TabsContent value="mumble" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <div className="flex items-center mb-6">
                      <Mic className="w-8 h-8 mr-3 text-secondary glow-secondary" />
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">
                        Mumble Server Configuration
                      </h3>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <label className="font-orbitron font-medium text-foreground flex items-center">
                            <Users className="w-4 h-4 mr-2 text-secondary" />
                            Voice Slots: {mumbleConfig.slots[0]}
                          </label>
                          <Badge variant="secondary">Recommended: 50-100</Badge>
                        </div>
                        <Slider
                          value={mumbleConfig.slots}
                          onValueChange={(value) => setMumbleConfig({...mumbleConfig, slots: value})}
                          max={1000}
                          min={5}
                          step={5}
                          className="mb-6"
                        />
                      </div>

                      {/* Mumble Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {voicePlatforms[1].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span className="text-sm font-inter text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">Mumble Hosting</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-secondary mt-2">
                        ${calculatePrice(voicePlatforms[1], mumbleConfig)}/mo
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mt-2">
                        {mumbleConfig.slots[0]} slots • Ultra-low latency
                      </p>
                    </div>
                    <Button asChild className="w-full bg-gradient-secondary glow-secondary font-orbitron mb-4">
                      <a href={`/order?category=voice&type=Mumble&slots=${mumbleConfig.slots[0]}`}>Deploy Mumble Server</a>
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Audio codec:</span>
                        <span className="text-secondary font-medium">Opus</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="text-secondary font-medium">&lt; 50ms</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Discord Bot */}
            <TabsContent value="discord" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <div className="flex items-center mb-6">
                      <Bot className="w-8 h-8 mr-3 text-tertiary glow-tertiary" />
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">
                        Discord Bot Hosting
                      </h3>
                    </div>

                    <div className="space-y-8">
                      {/* Discord Bot Features */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {voicePlatforms[2].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-tertiary flex-shrink-0" />
                            <span className="text-sm font-inter text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Popular Bot Types */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Popular Bot Types</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card className="glass-card p-4 hover-scale hover-glow-tertiary">
                            <h5 className="font-orbitron font-medium text-tertiary mb-2">Music Bot</h5>
                            <p className="text-sm text-muted-foreground font-inter">Play music from YouTube, Spotify</p>
                          </Card>
                          <Card className="glass-card p-4 hover-scale hover-glow-tertiary">
                            <h5 className="font-orbitron font-medium text-tertiary mb-2">Moderation Bot</h5>
                            <p className="text-sm text-muted-foreground font-inter">Auto-moderation and server management</p>
                          </Card>
                          <Card className="glass-card p-4 hover-scale hover-glow-tertiary">
                            <h5 className="font-orbitron font-medium text-tertiary mb-2">Custom Bot</h5>
                            <p className="text-sm text-muted-foreground font-inter">Your own custom Discord bot</p>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">Discord Bot Hosting</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-tertiary mt-2">
                        ${calculatePrice(voicePlatforms[2], { slots: [0] })}/mo
                      </div>
                      <p className="text-sm text-muted-foreground font-inter mt-2">
                        24/7 uptime • Auto-scaling
                      </p>
                    </div>
                    <Button asChild className="w-full bg-gradient-tertiary glow-tertiary font-orbitron mb-4">
                      <a href={`/order?category=voice&type=DiscordBot`}>Deploy Discord Bot</a>
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Uptime guarantee:</span>
                        <span className="text-tertiary font-medium">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Auto-restart:</span>
                        <CheckCircle className="w-3 h-3 text-tertiary" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Comparison Table */}
          <Card className="glass-card p-8 mt-12">
            <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6 text-center">
              Platform Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left font-orbitron font-medium text-foreground py-3">Feature</th>
                    <th className="text-center font-orbitron font-medium text-primary py-3">TeamSpeak</th>
                    <th className="text-center font-orbitron font-medium text-secondary py-3">Mumble</th>
                    <th className="text-center font-orbitron font-medium text-tertiary py-3">Discord Bot</th>
                  </tr>
                </thead>
                <tbody className="font-inter">
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 text-foreground">Setup Time</td>
                    <td className="text-center py-3 text-muted-foreground">&lt; 30s</td>
                    <td className="text-center py-3 text-muted-foreground">&lt; 60s</td>
                    <td className="text-center py-3 text-muted-foreground">&lt; 30s</td>
                  </tr>
                  <tr className="border-b border-glass-border/50">
                    <td className="py-3 text-foreground">Max Slots</td>
                    <td className="text-center py-3 text-muted-foreground">500</td>
                    <td className="text-center py-3 text-muted-foreground">1000</td>
                    <td className="text-center py-3 text-muted-foreground">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-foreground">Starting Price</td>
                    <td className="text-center py-3 text-primary font-medium">$3.99/mo</td>
                    <td className="text-center py-3 text-secondary font-medium">$2.99/mo</td>
                    <td className="text-center py-3 text-tertiary font-medium">$4.99/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceServersPage;
