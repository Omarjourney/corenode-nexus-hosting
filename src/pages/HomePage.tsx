import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import LiveStatsBar from "@/components/LiveStatsBar";
import PricingGlowCards from "@/components/PricingGlowCards";
import DeploySimulator from "@/components/DeploySimulator";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle,
  Flame,
  Gamepad2,
  Gauge,
  Globe,
  HardDrive,
  Layers,
  Map,
  Mic,
  Play,
  Rocket,
  Server,
  ServerCog,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const heroTrustBar = [
  { icon: Sparkles, label: "25% off your first month" },
  { icon: Zap, label: "Deploy in 10 seconds" },
  { icon: Shield, label: "Layer-7 DDoS protection" },
  { icon: BadgeCheck, label: "Cancel anytime" },
];

const reassurancePills = [
  "No hidden fees",
  "Auto-backup & recovery",
  "Uptime-backed SLA",
  "Human support, 24/7",
];

const startSteps = [
  { title: "Choose plan", detail: "CORE, ELITE, or CREATOR" },
  { title: "Configure game", detail: "Mods, regions, slots" },
  { title: "Go live", detail: "CNX automations kick in" },
];

const featureGroups = [
  {
    title: "Speed",
    accent: "primary",
    bullets: [
      { icon: Gauge, label: "NVMe everywhere", copy: "Full NVMe stack tuned for low latency." },
      { icon: Zap, label: "10s boot", copy: "Blueprints pre-stage files so servers light up fast." },
      { icon: Rocket, label: "Global POPs", copy: "Route players automatically to the closest edge." },
    ],
  },
  {
    title: "Automation",
    accent: "secondary",
    bullets: [
      { icon: Bot, label: "AI HealthGuard", copy: "Predictive alerts before lag or crashes." },
      { icon: Layers, label: "Blueprints", copy: "Save presets for events, mods, or seasonal wipes." },
      { icon: ServerCog, label: "1-click mods", copy: "Install packs and switch profiles instantly." },
    ],
  },
  {
    title: "Protection",
    accent: "primary",
    bullets: [
      { icon: ShieldCheck, label: "Advanced DDoS", copy: "Layer 3-7 scrubbing built-in." },
      { icon: Activity, label: "CrashGuard", copy: "Auto-restart + rollback when anomalies hit." },
      { icon: Map, label: "Live map", copy: "Visualize node health in real time." },
    ],
  },
  {
    title: "Ease-of-use",
    accent: "secondary",
    bullets: [
      { icon: BadgeCheck, label: "Guided setup", copy: "Walkthroughs for new admins." },
      { icon: Play, label: "Quick actions", copy: "Start, stop, or clone in two taps." },
      { icon: Target, label: "Role-based access", copy: "Share control safely with teammates." },
    ],
  },
];

const commandCenterFeatures = [
  { icon: ShieldCheck, title: "AI HealthGuard", description: "Predictive health monitoring" },
  { icon: Activity, title: "CrashGuard Auto-Recovery", description: "Automatic restart & healing" },
  { icon: Layers, title: "Auto-Mod Installer", description: "1-click packs & mods" },
  { icon: Gamepad2, title: "Multi-Game Profiles", description: "Swap profiles instantly" },
  { icon: Rocket, title: "Blueprints", description: "Pre-built server presets" },
  { icon: Map, title: "Live Performance Map", description: "Realtime server heatmap" },
];

const multiProfiles = [
  { tier: "2 Profiles", price: "Free" },
  { tier: "5 Profiles", price: "$4.49/mo" },
  { tier: "10 Profiles", price: "$6.49/mo" },
  { tier: "Unlimited", price: "$11.99/mo" },
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

const hostingTypes = [
  {
    icon: Gamepad2,
    title: "Minecraft Hosting",
    description: "Java with Blueprints & modpack installer",
    accent: "var(--product-minecraft)",
    link: "/minecraft",
  },
  {
    icon: Server,
    title: "Game Servers",
    description: "80+ games with CNX CommandCenter™",
    accent: "var(--product-games)",
    link: "/game-servers",
  },
  {
    icon: Mic,
    title: "Voice Servers",
    description: "Team comms with low-latency routing",
    accent: "var(--product-games)",
    link: "/voice-servers",
  },
  {
    icon: Globe,
    title: "Web Hosting",
    description: "Fast, reliable web hosting with cPanel",
    accent: "var(--primary)",
    link: "/web-hosting",
  },
  {
    icon: HardDrive,
    title: "VPS Hosting",
    description: "Scalable virtual servers",
    accent: "var(--product-vps)",
    link: "/vps",
  },
  {
    icon: Server,
    title: "NodeX Metal™",
    description: "Ryzen & Threadripper bare metal",
    accent: "var(--product-metal)",
    link: "/dedicated",
  },
];

const quickStats = [
  { label: "Active Servers", value: "50K+" },
  { label: "Game Titles", value: "80+" },
  { label: "Support", value: "24/7" },
  { label: "Deploy Speed", value: "10s" },
];

const differentiators = [
  { feature: "Multi-Game Switching", values: ["❌", "❌", "❌", "✔"] },
  { feature: "CNX CommandCenter™", values: ["❌", "❌", "❌", "✔"] },
  { feature: "CrashGuard AI", values: ["❌", "❌", "❌", "✔"] },
  { feature: "Auto-Mod Installer", values: ["Paid", "Partial", "❌", "✔"] },
  { feature: "DDoS Protection", values: ["Limited", "Standard", "Standard", "Enterprise"] },
  { feature: "AI Monitoring (HealthGuard)", values: ["❌", "❌", "❌", "✔"] },
  { feature: "10-second Deployment", values: ["❌", "❌", "❌", "✔"] },
];

type QuizAnswer = {
  players: "1-10" | "10-25" | "25+";
  mods: "vanilla" | "light" | "heavy";
  budget: "value" | "balanced" | "premium";
  skill: "beginner" | "confident" | "power";
};

const defaultQuiz: QuizAnswer = {
  players: "1-10",
  mods: "vanilla",
  budget: "balanced",
  skill: "beginner",
};

const HomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>(defaultQuiz);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  const recommendation = useMemo(() => {
    if (quizAnswers.mods === "heavy" || quizAnswers.players === "25+" || quizAnswers.budget === "premium") {
      return {
        plan: "CREATOR",
        reason: "Dedicated CPU isolation for heavy mods and larger player caps.",
      };
    }
    if (quizAnswers.mods === "light" || quizAnswers.players === "10-25" || quizAnswers.skill === "confident") {
      return {
        plan: "ELITE",
        reason: "CNX CommandCenter™ automations plus AI monitoring for growing communities.",
      };
    }
    return {
      plan: "CORE",
      reason: "Starter-friendly pricing with CorePanel Lite™ and essentials covered.",
    };
  }, [quizAnswers]);

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <SEO
        title="CodeNodeX – CNX CommandCenter™ & CorePanel Lite™ Hosting"
        description="Start a server in 10 seconds with CorePanel Lite™ or CNX CommandCenter™. Premium automation, AI recovery, multi-game profiles, and creator-grade hardware."
        keywords="game server hosting, cnx commandcenter, corenodex, multi-game profiles"
      />
      <Navigation />
      <LiveStatsBar />

      {/* Hero Section */}
      <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-surface border border-glass-border text-xs font-orbitron uppercase tracking-widest">
              <Flame className="h-4 w-4 text-primary" /> Premium game hosting
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold leading-tight">
              <span className="block text-gradient-primary">Start My Server in 10 Seconds</span>
              <span className="block text-foreground">Automation-first, creator-grade control.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-inter max-w-2xl mx-auto lg:mx-0">
              CodeNodeX pairs
              <Tooltip>
                <TooltipTrigger className="mx-1 underline decoration-dotted text-foreground">CorePanel Lite™</TooltipTrigger>
                <TooltipContent>Lean panel for quick starts and budget-friendly builds.</TooltipContent>
              </Tooltip>
              and
              <Tooltip>
                <TooltipTrigger className="mx-1 underline decoration-dotted text-foreground">CNX CommandCenter™</TooltipTrigger>
                <TooltipContent>AI-assisted automation, monitoring, and mod workflows exclusive to CodeNodeX.</TooltipContent>
              </Tooltip>
              to launch Minecraft, Rust, ARK, Valheim and more with instant mod installers and multi-game profiles.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:glow-primary font-orbitron font-semibold px-8 py-4 text-lg shadow-neon-primary"
              >
                <Link to="/order?cta=hero">Start My Server</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/60 text-primary hover:bg-primary/10 font-orbitron font-medium px-8 py-4 text-lg"
              >
                <Link to="#pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {heroTrustBar.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl bg-glass-surface border border-glass-border px-4 py-3 text-sm font-inter"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-foreground/90">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm font-inter text-muted-foreground">
              {reassurancePills.map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full bg-glass-surface border border-glass-border text-foreground/80"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {startSteps.map((step, idx) => (
                <div key={step.title} className="rounded-xl border border-glass-border bg-glass-surface p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-orbitron font-semibold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="glass-card p-6 space-y-4 shadow-neon-primary border-glass-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Control Panels</p>
                  <p className="text-2xl font-orbitron text-foreground">
                    CorePanel Lite™ → CNX CommandCenter™
                  </p>
                </div>
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm font-inter">
                <div className="p-3 rounded-lg bg-glass-surface border border-glass-border">
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
                  <p className="text-xs mt-2 opacity-80">CodeNodeX exclusive tech.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-glass-surface border border-glass-border p-3">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-orbitron text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">What players say</p>
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-2.5 w-8 rounded-full ${idx === activeTestimonial ? "bg-primary" : "bg-glass-border"}`}
                      aria-label={`Show testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-lg text-foreground font-inter">“{testimonials[activeTestimonial].quote}”</p>
              <p className="text-sm text-muted-foreground font-orbitron">{testimonials[activeTestimonial].name}</p>
              <DeploySimulator />
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Groups */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-gradient-secondary">Built for speed and clarity</h2>
            <p className="text-lg text-muted-foreground font-inter max-w-3xl mx-auto">
              Concise, scannable feature blocks with clear labels and consistent iconography.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureGroups.map((group) => (
              <Card key={group.title} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "hsl(var(--glass-surface))", color: `hsl(var(--${group.accent}))` }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">{group.title}</p>
                    <p className="text-xl font-semibold text-foreground">{group.title} that stays readable</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {group.bullets.map((item) => (
                    <div key={item.label} className="rounded-lg border border-glass-border bg-glass-surface p-3 space-y-1">
                      <div className="flex items-center gap-2 text-foreground">
                        <item.icon className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{item.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.copy}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold text-gradient-secondary mb-2">
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
                className="glass-card p-7 space-y-4 hover:-translate-y-2 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s`, borderColor: "hsla(var(--glass-border),0.8)" }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${"hsla(0,0%,100%,0.06)"}`,
                    boxShadow: `0 8px 24px ${type.accent}22`,
                    color: type.accent,
                  }}
                >
                  <type.icon className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">{type.title}</h3>
                  <p className="text-muted-foreground font-inter">{type.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="font-semibold" style={{ color: type.accent }}>
                    {type.title.includes("Minecraft") && "Minecraft"}
                    {type.title.includes("Game") && !type.title.includes("Voice") && "Game Servers"}
                    {type.title.includes("Voice") && "Voice"}
                    {type.title.includes("Web") && "Web"}
                    {type.title.includes("VPS") && "VPS"}
                    {type.title.includes("Metal") && "Metal"}
                  </span>
                  <span>Subtle accent guidance</span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-primary hover:bg-primary/10 font-inter"
                >
                  <Link to={type.link}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BadgeLike text="CORE" tone="core" />
            <BadgeLike text="ELITE – Most Popular" tone="elite" />
            <BadgeLike text="CREATOR – Pro Grade" tone="creator" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold text-gradient-primary text-center">
            Plans & Pricing
          </h2>
          <p className="text-center text-muted-foreground font-inter max-w-3xl mx-auto">
            CORE (CorePanel Lite™), ELITE (CNX CommandCenter™), and CREATOR (CommandCenter™ + Dedicated CPU) with transparent pricing.
          </p>
          <PricingGlowCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card p-6 space-y-3 lg:col-span-2">
              <h3 className="text-xl font-orbitron font-semibold">Multi-Game Profile System</h3>
              <p className="text-sm text-muted-foreground font-inter">
                Switch between saved game setups instantly (Minecraft, Rust, ARK, Valheim, and more).
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {multiProfiles.map((item) => (
                  <div key={item.tier} className="p-3 rounded-lg bg-glass-surface border border-glass-border text-sm font-inter">
                    <div className="font-semibold text-foreground">{item.tier}</div>
                    <div className="text-muted-foreground">{item.price}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="glass-card p-6 space-y-3">
              <h3 className="text-xl font-orbitron font-semibold">Help me choose</h3>
              <p className="text-sm text-muted-foreground">Answer a few prompts and we’ll map you to the right tier.</p>
              <div className="space-y-3 text-sm font-inter">
                <SelectField
                  label="Player count"
                  value={quizAnswers.players}
                  onChange={(value) => setQuizAnswers((prev) => ({ ...prev, players: value as QuizAnswer["players"] }))}
                  options={[
                    { label: "1-10", value: "1-10" },
                    { label: "10-25", value: "10-25" },
                    { label: "25+", value: "25+" },
                  ]}
                />
                <SelectField
                  label="Mod usage"
                  value={quizAnswers.mods}
                  onChange={(value) => setQuizAnswers((prev) => ({ ...prev, mods: value as QuizAnswer["mods"] }))}
                  options={[
                    { label: "Vanilla", value: "vanilla" },
                    { label: "Some mods", value: "light" },
                    { label: "Heavy/complex", value: "heavy" },
                  ]}
                />
                <SelectField
                  label="Budget"
                  value={quizAnswers.budget}
                  onChange={(value) => setQuizAnswers((prev) => ({ ...prev, budget: value as QuizAnswer["budget"] }))}
                  options={[
                    { label: "Value-first", value: "value" },
                    { label: "Balanced", value: "balanced" },
                    { label: "Premium", value: "premium" },
                  ]}
                />
                <SelectField
                  label="Skill level"
                  value={quizAnswers.skill}
                  onChange={(value) => setQuizAnswers((prev) => ({ ...prev, skill: value as QuizAnswer["skill"] }))}
                  options={[
                    { label: "New to hosting", value: "beginner" },
                    { label: "Comfortable", value: "confident" },
                    { label: "Power user", value: "power" },
                  ]}
                />
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm font-inter">
                <p className="text-xs uppercase tracking-wide text-primary font-semibold">Suggested plan</p>
                <p className="text-lg font-orbitron text-foreground">{recommendation.plan}</p>
                <p className="text-muted-foreground">{recommendation.reason}</p>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-xs text-secondary font-orbitron">CommandCenter™ is exclusive to CodeNodeX.</p>
            </Card>
            <Card className="glass-card p-6 space-y-3">
              <h3 className="text-xl font-orbitron font-semibold">Micro-tooltips for clarity</h3>
              <p className="text-sm text-muted-foreground">
                Proprietary names stay clear with inline explanations so new players know exactly what they get.
              </p>
              <div className="space-y-2 text-sm font-inter">
                <Tooltip>
                  <TooltipTrigger className="underline decoration-dotted text-foreground">CorePanel Lite™</TooltipTrigger>
                  <TooltipContent>Lightweight controls for quick starts and smaller worlds.</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="underline decoration-dotted text-foreground">CNX CommandCenter™</TooltipTrigger>
                  <TooltipContent>Automation suite with AI monitoring, mod workflows, and crash recovery.</TooltipContent>
                </Tooltip>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h3 className="text-3xl font-orbitron font-bold text-gradient-secondary text-center">Why CodeNodeX Wins</h3>
          <div className="overflow-x-auto rounded-xl border border-glass-border bg-glass-surface/50">
            <table className="w-full text-left text-sm font-inter min-w-[640px]">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="p-3">Feature</th>
                  <th className="p-3">Shockbyte</th>
                  <th className="p-3">Apex</th>
                  <th className="p-3">Bisect</th>
                  <th className="p-3 text-foreground">CodeNodeX</th>
                </tr>
              </thead>
              <tbody>
                {differentiators.map((row) => (
                  <tr key={row.feature} className="border-t border-glass-border">
                    <td className="p-3 font-semibold text-foreground">{row.feature}</td>
                    {row.values.map((val, idx) => (
                      <td key={`${row.feature}-${idx}`} className="p-3 text-muted-foreground">
                        {idx === row.values.length - 1 ? <span className="text-primary font-semibold">{val}</span> : val}
                      </td>
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
            <Button asChild className="bg-primary text-primary-foreground glow-primary font-orbitron w-fit">
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

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-glass-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-background font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-orbitron font-bold text-gradient-primary">CodeNodeX</span>
            </div>
            <p className="text-sm text-muted-foreground font-inter">
              CodeNodeX: Automation-first hosting powered by CNX CommandCenter™ and CorePanel Lite™.
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
              <Button asChild className="bg-primary text-primary-foreground glow-primary font-orbitron">
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

const BadgeLike = ({ text, tone }: { text: string; tone: "core" | "elite" | "creator" }) => {
  const palette = {
    core: "var(--tier-core)",
    elite: "var(--tier-elite)",
    creator: "var(--tier-creator)",
  };
  const color = palette[tone];

  return (
    <div
      className="px-3 py-1 rounded-full text-xs font-orbitron uppercase tracking-wide"
      style={{
        backgroundColor: "hsla(var(--glass-surface), 0.6)",
        border: `1px solid ${color}55`,
        color,
      }}
    >
      {text}
    </div>
  );
};

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <select
      className="rounded-lg border border-glass-border bg-glass-surface px-3 py-2 text-foreground"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-background">
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

export default HomePage;
