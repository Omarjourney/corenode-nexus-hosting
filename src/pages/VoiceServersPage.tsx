import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { catalogPricing, CONTROL_PANELS } from "@/data/pricing";
import { HostingCard } from "@/components/HostingCard";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";

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
    perSlot?: number;
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

  interface SlotConfig {
    slots: number[];
  }

  const calculatePrice = (platform: VoicePlatform, config: SlotConfig) => {
    if (platform.name === "Discord Bot" || !platform.pricing.perSlot) {
      return platform.pricing.base.toFixed(2);
    }
    return (platform.pricing.base + (config.slots[0] * platform.pricing.perSlot)).toFixed(2);
  };

  const starterPrices = {
    teamspeak: calculatePrice(voicePlatforms[0], { slots: [25] }),
    mumble: calculatePrice(voicePlatforms[1], { slots: [50] }),
    discord: calculatePrice(voicePlatforms[2], { slots: [0] }),
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
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <p className="text-xs font-orbitron tracking-[0.2em] text-primary">VOICE</p>
            <h1 className="text-5xl font-orbitron font-bold text-foreground">Voice Server Hosting</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
              TeamSpeak, Mumble, and Discord bot hosting with unified pricing cards and instant setup.
            </p>
          </div>

          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-orbitron font-bold text-foreground">Voice platforms</h2>
              <p className="text-sm text-muted-foreground font-inter mt-2">Launch every platform from the same CTA.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-9 place-items-center items-stretch">
              <HostingCard
                title="TeamSpeak"
                price={`$${starterPrices.teamspeak}/mo`}
                badge="Most Popular"
                specs={[
                  "Advanced permissions",
                  "Channel hierarchy + file transfer",
                  `${CONTROL_PANELS.pterodactyl} ready`,
                ]}
                ctaLabel="Launch Server"
                href="/order?category=voice&type=TeamSpeak"
              />
              <HostingCard
                title="Mumble"
                price={`$${starterPrices.mumble}/mo`}
                specs={["Opus codec", "Positional audio", "Low-latency global routes"]}
                ctaLabel="Launch Server"
                href="/order?category=voice&type=Mumble"
              />
              <HostingCard
                title="Discord Bot"
                price={`$${starterPrices.discord}/mo`}
                specs={["24/7 uptime", "Custom commands", "API + database ready"]}
                ctaLabel="Launch Server"
                href="/order?category=voice&type=DiscordBot"
              />
            </div>
          </section>

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
                      <a href={`/order?category=voice&type=TeamSpeak&slots=${teamSpeakConfig.slots[0]}&storage=${teamSpeakConfig.storage[0]}`}>
                        Launch TeamSpeak Server
                      </a>
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
                      <a href={`/order?category=voice&type=Mumble&slots=${mumbleConfig.slots[0]}`}>
                        Launch Mumble Server
                      </a>
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
                      <a href={`/order?category=voice&type=DiscordBot`}>
                        Launch Discord Bot
                      </a>
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

          <FeatureGrid title="Voice-ready automation" />

          <ComparisonTable
            title="Platform comparison"
            columns={["TeamSpeak", "Mumble", "Discord Bot"]}
            rows={[
              { label: "Setup time", values: ["< 30s", "< 60s", "< 30s"] },
              { label: "Max slots", values: ["500", "1000", "Unlimited"] },
              { label: "Control panel", values: [CONTROL_PANELS.pterodactyl, CONTROL_PANELS.pterodactyl, "API"] },
              { label: "Starting price", values: ["$3.99/mo", "$2.99/mo", "$4.99/mo"] },
            ]}
          />

          <FaqSection
            items={[
              {
                question: "How fast can I launch?",
                answer: "Provisioning completes in under a minute for each platform, and you can change slot counts anytime.",
              },
              {
                question: "Is DDoS protection included?",
                answer: "Yes. All voice servers include active mitigation and alerts inside the dashboard.",
              },
              {
                question: "Do you support custom domains?",
                answer: "TeamSpeak and Mumble both support custom hostnames with guidance from our team.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceServersPage;
