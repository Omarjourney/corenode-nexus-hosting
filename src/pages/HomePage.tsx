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

      <main style={{ backgroundColor: '#0f172a', color: '#ffffff', fontFamily: 'sans-serif' }}>
        {/* HERO SECTION */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '50vh',
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&auto=format&fm=webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '20px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '40px 20px 20px',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '2.8rem',
                marginBottom: '12px',
                fontWeight: '700',
                lineHeight: '1.2',
              }}
            >
              Start My Server in 10 Seconds
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                marginBottom: '20px',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Your game hosting, redefined — fast, reliable, scalable.
            </p>
            <a
              href="/#pricing"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: '#06b6d4',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              Get Started →
            </a>
          </div>
        </section>

        {/* FEATURE ICONS */}
        <section
          className="features-section"
          style={{
            padding: '0 20px 40px',
            marginTop: '-60px',
            position: 'relative',
            zIndex: 10,
            background: 'transparent',
          }}
        >
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '20px',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            {/* Feature 1: NVMe SSD */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fm=webp&q=90"
                alt="NVMe SSD Storage"
                loading="lazy"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  margin: '0 auto 12px',
                  display: 'block',
                }}
              />
              <h3
                style={{
                  fontSize: '1rem',
                  color: '#06b6d4',
                  marginBottom: '6px',
                  fontWeight: '600',
                }}
              >
                NVMe Everywhere
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Full NVMe stack tuned for low latency
              </p>
            </div>

            {/* Feature 2: Global POPs */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fm=webp&q=90"
                alt="Global Network"
                loading="lazy"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  margin: '0 auto 12px',
                  display: 'block',
                }}
              />
              <h3 style={{ fontSize: '1rem', color: '#06b6d4', marginBottom: '6px', fontWeight: '600' }}>
                Global POPs
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Route players to closest edge automatically
              </p>
            </div>

            {/* Feature 3: Fast Deployment */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1rem', color: '#06b6d4', marginBottom: '6px', fontWeight: '600' }}>
                10s Boot
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Blueprints pre-stage files fast
              </p>
            </div>

            {/* Feature 4: AI HealthGuard */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fm=webp&q=90"
                alt="AI Monitoring"
                loading="lazy"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  margin: '0 auto 12px',
                  display: 'block',
                }}
              />
              <h3 style={{ fontSize: '1rem', color: '#a855f7', marginBottom: '6px', fontWeight: '600' }}>
                AI HealthGuard
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Predictive alerts before crashes
              </p>
            </div>

            {/* Feature 5: 1-Click Mods */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 12h6M12 9v6" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1rem', color: '#a855f7', marginBottom: '6px', fontWeight: '600' }}>
                1-Click Mods
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Install packs instantly
              </p>
            </div>

            {/* Feature 6: Advanced DDoS */}
            <div
              className="feature-card"
              style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(30, 41, 59, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: '6px', fontWeight: '600' }}>
                Advanced DDoS
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4',
                }}
              >
                Adaptive L3-7 mitigation
              </p>
            </div>
          </div>
        </section>

        {/* HOSTING SOLUTION CARDS */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            padding: '40px 20px',
          }}
        >
          {/* Minecraft Hosting Card */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&auto=format&fm=webp"
              alt="Minecraft Hosting"
              loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                Minecraft Hosting
              </h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>
                Java & Bedrock Editions
              </p>
            </div>
          </div>

          {/* Game Servers Card */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fm=webp"
              alt="Game Servers"
              loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                Game Servers
              </h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>
                Valheim · Rust · ARK · Palworld & more
              </p>
            </div>
          </div>

          {/* Voice Servers Card */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fm=webp"
              alt="Voice Servers"
              loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                Voice Servers
              </h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>
                TS3 · Mumble · Discord bots
              </p>
            </div>
          </div>

          {/* Web Hosting Card */}
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fm=webp&q=80"
              alt="Web Hosting"
              loading="lazy"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>Web Hosting</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>
                Landing pages, stores, and more
              </p>
            </div>
          </div>
        </section>
      </main>
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
