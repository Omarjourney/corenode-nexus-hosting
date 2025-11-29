import { useState } from "react";
import Navigation from "@/components/Navigation";
import { HostingCard } from "@/components/HostingCard";
import { Switch } from "@/components/ui/switch";
import SEO from "@/components/SEO";
import { catalogPricing } from "@/data/pricing";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: catalogPricing.web.core.price,
    specs: [
      "1 Website • 1 Email",
      `${catalogPricing.web.core.storage} storage`,
      "Free SSL • Weekly Backups",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: catalogPricing.web.elite.price,
    specs: [
      "5 Websites • 5 Emails",
      `${catalogPricing.web.elite.storage} storage`,
      "Free SSL + CDN",
      "Daily Backups • Free Migration",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: catalogPricing.web.creator.price,
    specs: [
      "Unlimited Websites • Unlimited Emails",
      `${catalogPricing.web.creator.storage} storage`,
      "Free SSL + CDN",
      "Real-Time Backups • Priority Support",
    ],
  },
];

const WebHostingPage = () => {
  const [billing, setBilling] = useState(false); // false = monthly

  const displayPrice = (price: number) => {
    return billing ? `$${(price * 12).toFixed(2)}/yr` : `$${price}/mo`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Web Hosting – Fast & Reliable cPanel | CodeNodeX"
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-9 justify-center place-items-center mb-12">
            {plans.map((plan) => (
              <HostingCard
                key={plan.id}
                title={plan.name}
                price={displayPrice(plan.price)}
                specs={plan.specs}
                ctaLabel="Get Started"
                href="/web-hosting/checkout"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebHostingPage;
