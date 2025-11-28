import { useState } from "react";
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
  accent: "primary" | "secondary" | "tertiary";
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
      "Basic file access, console & SFTP",
      "Resource metrics + start/stop/restart",
      "DDoS shielded network",
      "99.9% uptime SLA",
    ],
    accent: "primary",
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
    accent: "secondary",
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
    accent: "tertiary",
  },
];

const PricingGlowCards = () => (
  <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {plans.map((plan) => (
      <PricingCard key={plan.name} plan={plan} />
    ))}
  </div>
);

const PricingCard = ({ plan }: { plan: Plan }) => {
  const [reveal, setReveal] = useState(false);

  return (
    <Card
      onMouseEnter={() => setReveal(true)}
      onMouseLeave={() => setReveal(false)}
      className={cn(
        "relative glass-card p-8 text-center cursor-pointer transition-transform duration-300",
        `hover:-translate-y-2 hover:glow-${plan.accent}`
      )}
    >
      {plan.badge && (
        <Badge className={`absolute left-2 top-2 bg-gradient-${plan.accent} animate-pulse`}>
          {plan.badge}
        </Badge>
      )}
      {plan.tag && (
        <Badge className={`absolute right-2 top-2 bg-gradient-${plan.accent}`}>{plan.tag}</Badge>
      )}

      <div className="space-y-3">
        <h3 className="text-2xl font-orbitron font-semibold text-foreground">{plan.name}</h3>
        <p className="text-4xl font-orbitron font-bold text-gradient-primary">{plan.priceLabel}</p>
        <p className="text-sm text-muted-foreground font-inter">{plan.controlPanel}</p>
        <p className="text-sm text-muted-foreground font-inter">{plan.description}</p>
      </div>

      <div className="my-4 grid grid-cols-2 gap-2">
        {plan.packages.map((pkg) => (
          <div key={pkg.ram} className="glass-card p-3 text-sm font-inter">
            <div className="font-semibold text-foreground">{pkg.ram}</div>
            <div className="text-muted-foreground">{pkg.price}/mo</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className={cn("space-y-2", reveal && "opacity-0")}>
          <Button asChild className={`w-full bg-gradient-${plan.accent} glow-${plan.accent} font-orbitron`}>
            <a href={`/order?plan=${encodeURIComponent(plan.name)}&panel=${encodeURIComponent(plan.controlPanel)}`}>
              Launch {plan.name}
            </a>
          </Button>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-center bg-glass-bg p-6 transition-opacity duration-300",
            reveal ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <ul className="space-y-2 text-left">
            {plan.features.map((feat) => (
              <li key={feat} className="flex items-center text-sm font-inter">
                <CheckCircle className={`mr-2 h-4 w-4 text-${plan.accent} glow-${plan.accent}`} />
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PricingGlowCards;
