import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import AddOns from "@/components/AddOns";
import { HostingCard } from "@/components/HostingCard";
import { Card } from "@/components/ui/card";
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary mb-4">
            {catalogPricing.vps.label} VPS Hosting
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Scalable virtual private servers with full root access and NVMe storage.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-9 justify-center place-items-center mb-12">
          {plans.map((plan) => (
            <HostingCard
              key={plan.name}
              title={plan.name}
              price={`$${plan.price}/mo`}
              specs={[
                `${plan.vcpu} vCPU • ${plan.ram} RAM`,
                `${plan.ssd} NVMe • ${plan.bandwidth} Bandwidth`,
              ]}
              ctaLabel="Deploy Now"
              href="/vps/checkout"
            />
          ))}
        </div>
        <Card className="glass-card p-6">
          <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">
            Optional Add-Ons
          </h3>
          <AddOns />
        </Card>
      </div>
    </div>
  </div>
);

export default VpsPage;
