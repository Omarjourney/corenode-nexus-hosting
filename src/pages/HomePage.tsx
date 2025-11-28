import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import LiveStatsBar from "@/components/LiveStatsBar";
import PricingGlowCards from "@/components/PricingGlowCards";
import DeploySimulator from "@/components/DeploySimulator";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  Flame,
  Gamepad2,
  Globe,
  HardDrive,
  Layers,
  Map,
  Mic,
  Play,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Zap
} from "lucide-react";

const commandCenterFeatures = [
  { icon: ShieldCheck, title: "AI HealthGuard", description: "Predictive health monitoring" },
  { icon: Activity, title: "CrashGuard Auto-Recovery", description: "Automatic restart & healing" },
  { icon: Layers, title: "Auto-Mod Installer", description: "1-click packs & mods" },
  { icon: Gamepad2, title: "Multi-Game Profiles", description: "Swap profiles instantly" },
  { icon: Rocket, title: "Blueprints", description: "Pre-built server presets" },
  { icon: Map, title: "Live Performance Map", description: "Realtime server heatmap" }
];

const multiProfiles = [
  { tier: "2 Profiles", price: "Free" },
  { tier: "5 Profiles", price: "$4.49/mo" },
  { tier: "10 Profiles", price: "$6.49/mo" },
  { tier: "Unlimited", price: "$11.99/mo" }
];

const testimonials = [
  {
    name: "Lena – Rust Creator",
    quote: "CommandCenter™ blueprints let me swap from vanilla to modded without rebuilding. Unreal time saver.",
  },
  {
    name: "Carlos – Minecraft Admin",
    quote: "CrashGuard AI recovered my world mid-stream. Zero downtime for my viewers.",
  },
  {
    name: "Mina – ARK Tribe Lead",
    quote: "Multi-game profiles mean I can park ARK, spin up Valheim, and come back later with the same settings.",
  },
  {
    name: "Jae – Esports Ops",
    quote: "The new pricing tiers make scaling events painless, and the dashboards are incredibly clear.",
  },
];

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  const hostingTypes = [
    {
      icon: Gamepad2,
      title: "Minecraft Hosting",
      description: "Java & Bedrock with Blueprints & modpack installer",
      color: "primary",
      link: "/minecraft"
    },
    {
      icon: Server,
      title: "Game Servers",
      description: "80+ games with CNX CommandCenter™",
      color: "secondary",
      link: "/game-servers"
    },
    {
      icon: Mic,
      title: "Voice Servers",
      description: "Team comms with low-latency routing",
      color: "tertiary",
      link: "/voice-servers"
    },
    {
      icon: Globe,
      title: "Web Hosting",
      description: "Fast, reliable web hosting with cPanel",
      color: "primary",
      link: "/web-hosting"
    },
    {
      icon: HardDrive,
      title: "VPS Hosting",
      description: "Scalable virtual servers",
      color: "secondary",
      link: "/vps"
    },
    {
      icon: Server,
      title: "NodeX Metal™",
      description: "Ryzen & Threadripper bare metal",
      color: "tertiary",
      link: "/dedicated"
    }
  ];

  const quickStats = [
    { label: "Active Servers", value: "50K+", color: "primary" },
    { label: "Uptime SLA", value: "99.9%", color: "secondary" },
    { label: "Support", value: "24/7", color: "tertiary" },
    { label: "Game Types", value: "80+", color: "primary" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="CoreNodeX – CNX CommandCenter™ & CorePanel Lite™ Hosting"
        description="Start a server in 10 seconds with CorePanel Lite™ or CNX CommandCenter™. Premium automation, AI recovery, multi-game profiles, and creator-grade hardware."
        keywords="game server hosting, cnx commandcenter, corenodex, multi-game profiles"
      />
      <Navigation />
      <LiveStatsBar />

      <div className="bg-glow-warning text-center text-sm font-orbitron text-amber-100 py-3 flex items-center justify-center gap-2">
        <Flame className="h-4 w-4" />
        <span>🔥 Deploy Any Server in 10 Seconds — 25% OFF Your First Month.</span>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-orbitron font-bold">
              <span className="block text-gradient-primary">Start a Server in 10 Seconds</span>
              <span className="block text-foreground">Fast, Smart & Fully Automated Hosting.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-inter max-w-2xl mx-auto lg:mx-0">
              CoreNodeX pairs CorePanel Lite™ for budget builds with CNX CommandCenter™ for AI-driven automation.
              Launch Minecraft, Rust, ARK, Valheim and more with instant mod installers and multi-game profiles.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary hover:scale-105 glow-primary font-orbitron font-semibold px-8 py-4 text-lg group"
              >
                <Link to="/minecraft">
                  Launch Server
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-orbitron font-medium px-8 py-4 text-lg group hover-glow-primary"
              >
                <Link to="#pricing">
                  View Pricing
                  <Play className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <DeploySimulator />
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm font-inter text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />DDoS Protected</span>
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-secondary" />10s Auto-Deploy</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-tertiary" />CommandCenter™ Exclusive</span>
            </div>
          </div>
          <Card className="glass-card p-6 space-y-4 shadow-xl border-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Control Panels</p>
                <p className="text-2xl font-orbitron text-gradient-primary">CorePanel Lite™ → CNX CommandCenter™</p>
              </div>
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-inter">
              <div className="p-3 rounded-lg bg-glass-surface/40 border border-glass-border">
                <p className="font-semibold">CorePanel Lite™</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Basic file access</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Console + SFTP</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Resource metrics</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Start/stop/restart</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-gradient-secondary text-background shadow-lg">
                <p className="font-semibold">CNX CommandCenter™</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />AI HealthGuard</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />CrashGuard Auto-Recovery</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />Auto-Mod Installer</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4" />Blueprints & Live Map</li>
                </ul>
                <p className="text-xs mt-2 opacity-80">CoreNodeX exclusive tech.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Hosting Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold text-gradient-secondary mb-6">
              Choose Your Hosting Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
              From budget-friendly CorePanel Lite™ to CNX CommandCenter™ automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostingTypes.map((type, index) => (
              <Card
                key={type.title}
                className={`glass-card p-8 hover-scale group cursor-pointer animate-scale-in glow-${type.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-${type.color} rounded-xl flex items-center justify-center glow-${type.color} group-hover:animate-glow-pulse`}>
                    <type.icon className="h-8 w-8 text-background" />
                  </div>
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">{type.title}</h3>
                  <p className="text-muted-foreground font-inter">{type.description}</p>
                  <Button
                    asChild
                    variant="ghost"
                    className={`text-${type.color} hover:bg-${type.color}/10 font-inter group-hover:glow-${type.color}`}
                  >
                    <Link to={type.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BadgeLike text="CORE" />
            <BadgeLike text="ELITE – Most Popular" />
            <BadgeLike text="CREATOR – Pro Grade" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold text-gradient-primary text-center">
            Plans & Pricing
          </h2>
          <p className="text-center text-muted-foreground font-inter max-w-3xl mx-auto">
            CORE (CorePanel Lite™), ELITE (CNX CommandCenter™), and CREATOR (CommandCenter™ + Dedicated CPU) with transparent pricing.
          </p>
          <PricingGlowCards />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card p-6 space-y-3">
              <h3 className="text-xl font-orbitron font-semibold">Multi-Game Profile System</h3>
              <p className="text-sm text-muted-foreground font-inter">
                Switch between saved game setups instantly (Minecraft, Rust, ARK, Valheim, and more).
              </p>
              <div className="grid grid-cols-2 gap-3">
                {multiProfiles.map((item) => (
                  <div key={item.tier} className="p-3 rounded-lg bg-glass-surface border border-glass-border text-sm font-inter">
                    <div className="font-semibold text-foreground">{item.tier}</div>
                    <div className="text-muted-foreground">{item.price}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="glass-card p-6 space-y-3">
              <h3 className="text-xl font-orbitron font-semibold">CNX CommandCenter™ Stack</h3>
              <div className="grid grid-cols-2 gap-3">
                {commandCenterFeatures.map((feat) => (
                  <div key={feat.title} className="p-3 rounded-lg bg-gradient-secondary/10 border border-secondary/20">
                    <feat.icon className="h-5 w-5 text-secondary mb-1" />
                    <div className="font-semibold text-sm">{feat.title}</div>
                    <div className="text-xs text-muted-foreground">{feat.description}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-secondary font-orbitron">CommandCenter™ is exclusive to CoreNodeX.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h3 className="text-3xl font-orbitron font-bold text-gradient-secondary text-center">Why CoreNodeX Wins</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-inter min-w-[640px]">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="p-3">Feature</th>
                  <th className="p-3">Shockbyte</th>
                  <th className="p-3">Apex</th>
                  <th className="p-3">Bisect</th>
                  <th className="p-3">CoreNodeX</th>
                </tr>
              </thead>
              <tbody className="bg-glass-surface/40">
                {[
                  { feature: "Multi-Game Switching", values: ["❌", "❌", "❌", "✔"] },
                  { feature: "CNX CommandCenter™", values: ["❌", "❌", "❌", "✔"] },
                  { feature: "CrashGuard AI", values: ["❌", "❌", "❌", "✔"] },
                  { feature: "Auto-Mod Installer", values: ["Paid", "Partial", "❌", "✔"] },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-glass-border">
                    <td className="p-3 font-semibold text-foreground">{row.feature}</td>
                    {row.values.map((val, idx) => (
                      <td key={`${row.feature}-${idx}`} className="p-3 text-muted-foreground">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NodeX Metal */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h3 className="text-3xl font-orbitron font-bold text-gradient-primary">NodeX Metal™ Dedicated</h3>
            <p className="text-muted-foreground font-inter">
              Ryzen + Threadripper bare metal with CNX CommandCenter™, 10Gbps uplinks, full root access, and free migrations.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-sm font-inter">
              {["CNX CommandCenter™", "10Gbps uplink", "Full root access", "Free migration service"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary" />{item}
                </li>
              ))}
            </ul>
            <Button asChild className="bg-gradient-primary glow-primary font-orbitron w-fit">
              <Link to="/dedicated">Explore NodeX Metal™</Link>
            </Button>
          </div>
          <Card className="glass-card p-6 grid grid-cols-2 gap-4">
            {[
              { cpu: "Ryzen 5600X", price: "$109" },
              { cpu: "Ryzen 7600", price: "$149" },
              { cpu: "Ryzen 5800X", price: "$129" },
              { cpu: "Ryzen 5950X", price: "$179" },
              { cpu: "Ryzen 7950X", price: "$199" },
              { cpu: "Threadripper 3990X", price: "$399" },
              { cpu: "Dual EPYC", price: "$199–$399" },
            ].map((plan) => (
              <div key={plan.cpu} className="p-3 rounded-lg bg-glass-surface border border-glass-border">
                <p className="text-sm text-muted-foreground">{plan.cpu}</p>
                <p className="text-xl font-orbitron text-gradient-secondary">{plan.price}/mo</p>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-orbitron font-bold text-gradient-secondary">What players say</h3>
          <Card className="glass-card p-8 space-y-4">
            <Star className="h-6 w-6 text-amber-400 mx-auto" />
            <p className="text-lg text-foreground font-inter max-w-3xl mx-auto">“{testimonials[activeTestimonial].quote}”</p>
            <p className="text-sm text-muted-foreground font-orbitron">{testimonials[activeTestimonial].name}</p>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2.5 w-8 rounded-full ${idx === activeTestimonial ? "bg-gradient-primary" : "bg-glass-border"}`}
                  aria-label={`Show testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {quickStats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className={`text-3xl sm:text-4xl font-orbitron font-bold text-gradient-${stat.color}`}>{stat.value}</div>
                <p className="text-muted-foreground font-inter">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-glass-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-background font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-orbitron font-bold text-gradient-primary">CoreNodeX</span>
            </div>
            <p className="text-sm text-muted-foreground font-inter">
              CoreNodeX: Neon-fast infrastructure with CNX CommandCenter™ and CorePanel Lite™ powering every deployment.
            </p>
          </div>
          <div className="space-y-2 font-inter text-sm">
            <p className="font-semibold text-foreground">Trust</p>
            <p>DDoS protection badge</p>
            <p>Secure payments</p>
            <p>Uptime SLA 99.9%</p>
          </div>
          <div className="space-y-2 font-inter text-sm">
            <p className="font-semibold text-foreground">Products</p>
            <p>CorePanel Lite™ (Budget)</p>
            <p>CNX CommandCenter™ (Premium)</p>
            <p>NodeX Metal™ Dedicated</p>
          </div>
          <div className="space-y-3 font-inter text-sm">
            <p className="font-semibold text-foreground">Get Started</p>
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-gradient-primary glow-primary font-orbitron">
                <Link to="/minecraft">Launch Server</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <Link to="#pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const BadgeLike = ({ text }: { text: string }) => (
  <div className="px-3 py-1 rounded-full bg-glass-surface border border-primary/30 text-primary text-xs font-orbitron uppercase">
    {text}
  </div>
);

export default HomePage;
