import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageOption {
  ram: string;
  price: string;
}

interface Plan {
  name: string;
  priceLabel: string;
  badge?: string;
  tag?: string;
  controlPanel: string;
  description: string;
  packages: PackageOption[];
  features: string[];
  accent: "core" | "elite" | "creator";
}

const plans: Plan[] = [
  {
    name: "CORE",
    priceLabel: "$4.49/mo",
    controlPanel: "CorePanel Lite™",
    description: "Budget-friendly power with CorePanel Lite™ for quick starts.",
    packages: [
      { ram: "2GB", price: "$4.49" },
      { ram: "4GB", price: "$7.49" },
      { ram: "8GB", price: "$13.49" },
      { ram: "24GB", price: "$39.49" },
    ],
    features: [
      "DDoS shielded network",
      "Resource metrics + start/stop/restart",
      "Ready-made blueprints",
      "Uptime-backed SLA",
    ],
    accent: "core",
  },
  {
    name: "ELITE",
    priceLabel: "$11.49/mo",
    badge: "Most Popular",
    controlPanel: "CNX CommandCenter™",
    description: "Premium automation with CNX CommandCenter™ and AI safeguards.",
    packages: [
      { ram: "4GB", price: "$11.49" },
      { ram: "10GB", price: "$21.49" },
      { ram: "16GB", price: "$36.49" },
      { ram: "32GB", price: "$67.49" },
    ],
    features: [
      "AI HealthGuard + CrashGuard Auto-Recovery",
      "Auto-Mod Installer & Blueprints presets",
      "Multi-Game Profiles + Live Performance Map",
      "Priority routing & proactive monitoring",
    ],
    accent: "elite",
  },
  {
    name: "CREATOR",
    priceLabel: "$49.99/mo",
    tag: "Pro Grade",
    controlPanel: "CNX CommandCenter™ + Dedicated CPU",
    description: "Streamer-grade isolation with dedicated CPU and automation.",
    packages: [
      { ram: "16GB", price: "$49.99" },
      { ram: "24GB", price: "$69.99" },
      { ram: "32GB", price: "$89.99" },
      { ram: "48GB", price: "$129.99" },
    ],
    features: [
      "Dedicated Ryzen vCores",
      "CommandCenter™ automations included",
      "Creator-safe CPU isolation",
      "White-glove migration",
    ],
    accent: "creator",
  },
];

const accentPalette: Record<Plan["accent"], string> = {
  core: "var(--tier-core)",
  elite: "var(--tier-elite)",
  creator: "var(--tier-creator)",
};

const PricingGlowCards = () => (
  <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {plans.map((plan) => (
      <PricingCard key={plan.name} plan={plan} />
    ))}
  </div>
);

const PricingCard = ({ plan }: { plan: Plan }) => {
  const accentColor = accentPalette[plan.accent];
  const accentGradient = useMemo(
    () => `linear-gradient(120deg, ${accentColor}99, ${accentColor}44)`,
    [accentColor]
  );

  return (
    <Card
      className={cn(
        "relative glass-card p-7 text-left transition-transform duration-300",
        "hover:-translate-y-2"
      )}
      style={{
        borderColor: `${accentColor}55`,
        boxShadow: `0 12px 40px ${accentColor}22`,
      }}
    >
      <div className="absolute inset-x-4 top-0 h-1 rounded-b-full" style={{ background: accentGradient }} />
      {(plan.badge || plan.tag) && (
        <div className="flex items-center justify-between mb-2">
          {plan.badge && (
            <Badge className="bg-secondary text-secondary-foreground">{plan.badge}</Badge>
          )}
          {plan.tag && <Badge className="bg-secondary/20 text-secondary">{plan.tag}</Badge>}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-orbitron font-semibold text-foreground">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.controlPanel}</p>
        </div>
        <p className="text-4xl font-orbitron font-bold" style={{ color: accentColor }}>
          {plan.priceLabel}
        </p>
        <p className="text-sm text-muted-foreground font-inter">{plan.description}</p>
      </div>

      <div className="my-4 grid grid-cols-2 gap-2">
        {plan.packages.map((pkg) => (
          <div
            key={pkg.ram}
            className="glass-card p-3 text-sm font-inter border border-glass-border"
            style={{ borderColor: `${accentColor}33` }}
          >
            <div className="font-semibold text-foreground">{pkg.ram}</div>
            <div className="text-muted-foreground">{pkg.price}/mo</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {plan.features.map((feat) => (
          <div key={feat} className="flex items-start gap-2 text-sm font-inter">
            <CheckCircle className="h-4 w-4" style={{ color: accentColor }} />
            <span className="text-foreground">{feat}</span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className="w-full mt-5 font-orbitron"
        style={{
          background: accentGradient,
          color: "var(--background)",
          boxShadow: `0 10px 25px ${accentColor}33`,
        }}
      >
        <a href={`/order?plan=${encodeURIComponent(plan.name)}&panel=${encodeURIComponent(plan.controlPanel)}`}>
          Launch {plan.name}
        </a>
      </Button>
    </Card>
  );
};

export default PricingGlowCards;
