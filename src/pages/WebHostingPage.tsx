import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 2.99,
    features: [
      "1 Website",
      "10GB SSD",
      "1 Email",
      "Free SSL",
      "Weekly Backups",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 4.99,
    features: [
      "5 Websites",
      "25GB SSD",
      "5 Emails",
      "Free SSL + CDN",
      "Daily Backups",
      "Free Migration",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 8.99,
    features: [
      "Unlimited Websites",
      "100GB SSD",
      "Unlimited Emails",
      "Free SSL + CDN",
      "Real-Time Backups",
      "Priority Support",
    ],
  },
];

const WebHostingPage = () => {
  const [billing, setBilling] = useState(false); // false = monthly

  const displayPrice = (price: number) => {
    return billing ? `${(price * 12).toFixed(2)}/yr` : `${price}/mo`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Web Hosting – Fast & Reliable cPanel | CoreNode"
        description="Affordable web hosting with free SSL, backups, and CDN. Choose Basic, Standard, or Premium plans with instant activation."
        keywords="web hosting, cpanel hosting, ssl, backups, cdn"
      />
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-primary mb-4">
              Web Hosting
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="font-inter text-sm">Monthly</span>
              <Switch checked={billing} onCheckedChange={setBilling} />
              <span className="font-inter text-sm">Yearly</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card key={plan.id} className="glass-card p-6 text-center hover-scale hover-glow-primary">
                <h3 className="font-orbitron font-semibold text-foreground text-xl mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-orbitron font-bold text-gradient-primary mb-4">
                  {displayPrice(plan.price)}
                </div>
                <ul className="space-y-1 mb-6 text-sm text-muted-foreground font-inter text-left">
                  {plan.features.map((feat) => (
                    <li key={feat}>• {feat}</li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron">
                  <a href="/web-hosting/checkout">Get Started</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebHostingPage;
