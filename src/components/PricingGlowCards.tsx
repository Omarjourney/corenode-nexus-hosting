import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  badge?: string;
  tag?: string;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "4.99",
    features: ["1GB RAM", "20GB SSD", "24/7 Uptime"],
  },
  {
    name: "Gamer",
    price: "9.99",
    badge: "🔥 Best Value",
    features: ["4GB RAM", "50GB SSD", "Mod Support"],
  },
  {
    name: "Pro",
    price: "19.99",
    tag: "🚀 Most Chosen",
    features: ["8GB RAM", "100GB SSD", "Priority Support"],
  },
];

const PricingGlowCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        "hover:-translate-y-2 hover:rotate-1 hover:glow-primary"
      )}
    >
      {plan.badge && (
        <Badge className="absolute left-2 top-2 bg-gradient-primary animate-pulse">
          {plan.badge}
        </Badge>
      )}
      {plan.tag && (
        <Badge className="absolute right-2 top-2 bg-gradient-secondary">
          {plan.tag}
        </Badge>
      )}

      <div className={cn("space-y-4", reveal && "opacity-0 group-hover:opacity-0")}>
        <h3 className="text-xl font-orbitron font-semibold text-foreground">
          {plan.name}
        </h3>
        <p className="text-4xl font-orbitron font-bold text-gradient-primary">
          ${plan.price}
        </p>
        <Button variant="ghost" className="hover-glow-primary">
          Select Plan
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
              <CheckCircle className="mr-2 h-4 w-4 text-primary glow-primary" />
              {feat}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default PricingGlowCards;
