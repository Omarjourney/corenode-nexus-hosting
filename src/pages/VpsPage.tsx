import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import AddOns from "@/components/AddOns";
import { HostingCard } from "@/components/HostingCard";
import { Card } from "@/components/ui/card";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";
import { BRAND_NAME, catalogPricing } from "@/data/pricing";

const plans = catalogPricing.vps.plans;

const VpsPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title={`VPS Hosting – ${catalogPricing.vps.label} | ${BRAND_NAME}`}
      description="NodeX Metal™ VPS with NVMe storage, root access, and CommandCenter™ automation."
      keywords="vps hosting, ssd vps, root access, scalable servers"
    />
    <Navigation />
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">VPS</p>
          <h1 className="text-5xl font-orbitron font-bold text-foreground">{catalogPricing.vps.label} VPS Hosting</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Deploy ultra-fast NVMe VPS with root access, CommandCenter™ automation, and predictable pricing.
          </p>
        </div>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Choose Your VPS</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Fixed tiers with 10Gbps networking and instant handoff.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center">
            {plans.map((plan, index) => (
              <HostingCard
                key={plan.name}
                title={plan.name}
                badge={index === 1 ? "Most Popular" : undefined}
                price={`$${plan.price}/mo`}
                specs={[
                  `${plan.vcpu} vCPU • ${plan.ram} RAM`,
                  `${plan.ssd} NVMe storage`,
                  `${plan.bandwidth} bandwidth • DDoS shield`,
                ]}
                ctaLabel="Deploy Server"
                href="/vps/checkout"
              />
            ))}
          </div>
        </section>

        <Card className="glass-card p-6">
          <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">Optional Add-Ons</h3>
          <AddOns />
        </Card>

        <FeatureGrid title="Built for performance teams" />

        <ComparisonTable
          title="VPS vs alternatives"
          columns={["NodeX VPS", "Shared Hosting", "Legacy VPS"]}
          rows={[
            { label: "Deploy time", values: ["&lt; 60s", "Hours", "30-60m"] },
            { label: "Storage", values: ["NVMe", "SATA", "Mixed SSD"] },
            { label: "Automation", values: ["CommandCenter™", "Manual", "Limited"] },
            { label: "Bandwidth", values: ["10Gbps", "1Gbps", "1-5Gbps"] },
          ]}
        />

        <FaqSection
          items={[
            {
              question: "Can I scale resources later?",
              answer: "Yes. Upgrade RAM, vCPU, or storage at any time with zero re-provisioning delays.",
            },
            {
              question: "Do you include DDoS protection?",
              answer: "Always-on mitigation is included, with traffic scrubbing and alerts in the dashboard.",
            },
            {
              question: "Which panel do I get?",
              answer: "CommandCenter™ is standard for automation, while SSH and API access remain open for custom workflows.",
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default VpsPage;
