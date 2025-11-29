import { HostingCard } from "@/components/HostingCard";
import { catalogPricing } from "@/data/pricing";

const metalPlans = catalogPricing.dedicated.plans;

export function NodeXMetalGrid() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-9 justify-center place-items-center items-stretch">
        {metalPlans.map((plan, index) => (
          <HostingCard
            key={plan.name}
            title={plan.name}
            price={`$${plan.price}/mo`}
            specs={[
              `CPU: ${plan.cpu}`,
              `Memory: ${plan.ram}`,
              `Storage: ${plan.storage}`,
              "10Gbps uplink • Root access",
            ]}
            badge={index === 1 ? "Most Popular" : undefined}
            ctaLabel="Purchase Server"
            href="/dedicated/checkout"
          />
        ))}
      </div>
    </section>
  );
}
