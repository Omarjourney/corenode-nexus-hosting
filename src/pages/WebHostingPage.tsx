import { useState } from "react";
import Navigation from "@/components/Navigation";
import { HostingCard } from "@/components/HostingCard";
import { Switch } from "@/components/ui/switch";
import SEO from "@/components/SEO";
import { catalogPricing } from "@/data/pricing";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";

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
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-orbitron tracking-[0.2em] text-primary">WEB HOSTING</p>
            <h1 className="text-5xl font-orbitron font-bold text-foreground">Web Hosting</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
              Reliable cPanel hosting with SSL, CDN, and backups included from day one.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className="font-inter text-sm">Monthly</span>
              <Switch checked={billing} onCheckedChange={setBilling} />
              <span className="font-inter text-sm">Yearly</span>
            </div>
          </div>

          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-orbitron font-bold text-foreground">Choose your plan</h2>
              <p className="text-sm text-muted-foreground font-inter mt-2">Three simple tiers with consistent resources.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center">
              {plans.map((plan, index) => (
                <HostingCard
                  key={plan.id}
                  title={plan.name}
                  badge={index === 1 ? "Most Popular" : undefined}
                  price={displayPrice(plan.price)}
                  specs={plan.specs}
                  ctaLabel="Get Started"
                  href="/web-hosting/checkout"
                />
              ))}
            </div>
          </section>

          <FeatureGrid title="Optimized for sites and stores" />

          <ComparisonTable
            title="Hosting that stays predictable"
            columns={["CodeNodeX", "Budget Hosts", "DIY VPS"]}
            rows={[
              { label: "Backups", values: ["Daily included", "Weekly", "Manual"] },
              { label: "SSL + CDN", values: ["Included", "Paid add-on", "Manual setup"] },
              { label: "Support", values: ["24/7 chat", "Ticket only", "Self-serve"] },
              { label: "Scaling", values: ["One click", "Migrations", "Manual tuning"] },
            ]}
          />

          <FaqSection
            items={[
              {
                question: "Can I migrate my site?",
                answer: "Yes. Free migrations are included with every plan, and we time them to avoid downtime.",
              },
              {
                question: "Is email included?",
                answer: "Every plan includes matching email accounts with spam filtering and DKIM guidance.",
              },
              {
                question: "Can I scale storage?",
                answer: "Storage can be expanded without moving plans, keeping your billing predictable.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WebHostingPage;
