import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import AddOns from "@/components/AddOns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FaqSection } from "@/components/FaqSection";
import { BRAND_NAME, catalogPricing } from "@/data/pricing";

type ServiceTier = "budget" | "standard" | "premium" | "extreme" | "ryzen";

interface ServiceType {
  id: ServiceTier;
  name: string;
  description: string;
  pricePerGb: string;
  details: {
    clock: string;
    geekbench: string;
    price: string;
  };
}

interface Region {
  id: string;
  name: string;
  note: string;
  available: boolean;
  accent: string;
}

interface Plan {
  name: string;
  vcpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  deployment: string;
  price: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: "budget",
    name: "NodeX Budget VPS",
    description: "Balanced Xeon cores for lightweight labs and dev sandboxes.",
    pricePerGb: "$0.39 / GB",
    details: {
      clock: "2.0 GHz",
      geekbench: "500-1000",
      price: "$0.39 / GB",
    },
  },
  {
    id: "standard",
    name: "NodeX Standard VPS",
    description: "Modern Xeon compute for production web apps and staging.",
    pricePerGb: "$1.39 / GB",
    details: {
      clock: "3.0 GHz",
      geekbench: "1000-1500",
      price: "$1.39 / GB",
    },
  },
  {
    id: "premium",
    name: "NodeX Premium VPS",
    description: "High-clock Intel cores for latency-sensitive services.",
    pricePerGb: "$1.79 / GB",
    details: {
      clock: "3.7 GHz",
      geekbench: "1500-2000",
      price: "$1.79 / GB",
    },
  },
  {
    id: "extreme",
    name: "NodeX Extreme VPS",
    description: "4+ GHz turbo compute for edge workloads and microservices.",
    pricePerGb: "$2.05 / GB",
    details: {
      clock: "4.1 GHz",
      geekbench: "1800-2600",
      price: "$2.05 / GB",
    },
  },
  {
    id: "ryzen",
    name: "NodeX Ryzen VPS",
    description: "Zen 4 Ryzen cores built for bursty game panels and APIs.",
    pricePerGb: "$1.85 / GB",
    details: {
      clock: "4.5 GHz",
      geekbench: "2100-3200",
      price: "$1.85 / GB",
    },
  },
];

const regions: Region[] = [
  { id: "miami", name: "Miami, FL", note: "1 Plan Available", available: true, accent: "text-emerald-400" },
  { id: "los-angeles", name: "Los Angeles, CA", note: "1 Plan Available", available: true, accent: "text-primary" },
  { id: "nuremberg", name: "Nuremberg, DE", note: "No Available Plans", available: false, accent: "text-rose-400" },
  { id: "johor", name: "Johor, MY", note: "No Available Plans", available: false, accent: "text-rose-400" },
  { id: "kansas-city", name: "Kansas City, MO", note: "No Available Plans", available: false, accent: "text-rose-400" },
];

const planMatrix: Record<ServiceTier, Plan[]> = {
  budget: [
    { name: "Budget XS", vcpu: "8", ram: "32GB", storage: "128GB NVMe", bandwidth: "5TB", deployment: "Out of Stock", price: "$12/mo" },
    { name: "Budget S", vcpu: "12", ram: "64GB", storage: "256GB NVMe", bandwidth: "10TB", deployment: "Out of Stock", price: "$22/mo" },
    { name: "Budget M", vcpu: "14", ram: "96GB", storage: "384GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$34/mo" },
    { name: "Budget L", vcpu: "16", ram: "128GB", storage: "512GB NVMe", bandwidth: "64TB", deployment: "Out of Stock", price: "$46/mo" },
  ],
  standard: [
    { name: "Standard XS", vcpu: "4", ram: "8GB", storage: "64GB NVMe", bandwidth: "2TB", deployment: "Instant", price: "$11/mo" },
    { name: "Standard S", vcpu: "8", ram: "16GB", storage: "128GB NVMe", bandwidth: "4TB", deployment: "Instant", price: "$22/mo" },
    { name: "Standard M", vcpu: "12", ram: "32GB", storage: "256GB NVMe", bandwidth: "8TB", deployment: "Out of Stock", price: "$44/mo" },
    { name: "Standard L", vcpu: "16", ram: "64GB", storage: "512GB NVMe", bandwidth: "16TB", deployment: "Out of Stock", price: "$88/mo" },
    { name: "Standard XL", vcpu: "24", ram: "128GB", storage: "1TB NVMe", bandwidth: "24TB", deployment: "Out of Stock", price: "$169/mo" },
  ],
  premium: [
    { name: "Premium XS", vcpu: "2", ram: "4GB", storage: "64GB NVMe", bandwidth: "2TB", deployment: "Instant", price: "$8/mo" },
    { name: "Premium S", vcpu: "4", ram: "8GB", storage: "128GB NVMe", bandwidth: "5TB", deployment: "Out of Stock", price: "$15/mo" },
    { name: "Premium M", vcpu: "8", ram: "16GB", storage: "256GB NVMe", bandwidth: "10TB", deployment: "Out of Stock", price: "$30/mo" },
    { name: "Premium L", vcpu: "10", ram: "32GB", storage: "512GB NVMe", bandwidth: "15TB", deployment: "Out of Stock", price: "$55/mo" },
    { name: "Premium XL", vcpu: "12", ram: "48GB", storage: "768GB NVMe", bandwidth: "30TB", deployment: "Out of Stock", price: "$78/mo" },
    { name: "Premium XXL", vcpu: "14", ram: "64GB", storage: "1TB NVMe", bandwidth: "50TB", deployment: "Out of Stock", price: "$99/mo" },
  ],
  extreme: [
    { name: "Extreme XS", vcpu: "2", ram: "4GB", storage: "128GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$9/mo" },
    { name: "Extreme S", vcpu: "2", ram: "8GB", storage: "256GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$14/mo" },
    { name: "Extreme M", vcpu: "4", ram: "16GB", storage: "512GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$28/mo" },
    { name: "Extreme L", vcpu: "6", ram: "24GB", storage: "768GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$42/mo" },
    { name: "Extreme XL", vcpu: "8", ram: "32GB", storage: "1TB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$56/mo" },
    { name: "Extreme XXL", vcpu: "10", ram: "48GB", storage: "1.5TB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$78/mo" },
    { name: "Extreme Ultra", vcpu: "12", ram: "64GB", storage: "2TB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$105/mo" },
  ],
  ryzen: [
    { name: "Ryzen XSS", vcpu: "2", ram: "3GB", storage: "45GB NVMe", bandwidth: "2TB", deployment: "Instant", price: "$7/mo" },
    { name: "Ryzen XS", vcpu: "3", ram: "6GB", storage: "90GB NVMe", bandwidth: "4TB", deployment: "Out of Stock", price: "$13/mo" },
    { name: "Ryzen S", vcpu: "4", ram: "12GB", storage: "180GB NVMe", bandwidth: "8TB", deployment: "Out of Stock", price: "$26/mo" },
    { name: "Ryzen M", vcpu: "6", ram: "18GB", storage: "270GB NVMe", bandwidth: "12TB", deployment: "Out of Stock", price: "$40/mo" },
    { name: "Ryzen L", vcpu: "8", ram: "24GB", storage: "360GB NVMe", bandwidth: "16TB", deployment: "Out of Stock", price: "$55/mo" },
    { name: "Ryzen XL", vcpu: "10", ram: "36GB", storage: "540GB NVMe", bandwidth: "24TB", deployment: "Out of Stock", price: "$80/mo" },
    { name: "Ryzen XXL", vcpu: "12", ram: "48GB", storage: "720GB NVMe", bandwidth: "32TB", deployment: "Out of Stock", price: "$110/mo" },
    { name: "Ryzen Ultra", vcpu: "14", ram: "60GB", storage: "900GB NVMe", bandwidth: "48TB", deployment: "Out of Stock", price: "$145/mo" },
    { name: "Ryzen BMM", vcpu: "16", ram: "72GB", storage: "1TB NVMe", bandwidth: "64TB", deployment: "Out of Stock", price: "$175/mo" },
    { name: "Ryzen BML", vcpu: "18", ram: "84GB", storage: "1.2TB NVMe", bandwidth: "64TB", deployment: "Out of Stock", price: "$205/mo" },
    { name: "Ryzen BMXL", vcpu: "20", ram: "96GB", storage: "1.4TB NVMe", bandwidth: "64TB", deployment: "Out of Stock", price: "$235/mo" },
  ],
};

const featureGridItems = [
  "Lightning Fast CPUs",
  "100Gbps Network",
  "All NVMe Storage",
  "Affordable Power",
  "Owned Infrastructure",
  "Reliable 99.9% SLA",
];

const controlPanelItems = [
  "Power Actions",
  "Automatic Reinstallation",
  "noVNC Console",
  "Resource Monitoring",
  "Password Adjustment",
  "Fast, modern UI",
];

const VpsPage = () => {
  const { tier } = useParams<{ tier?: string }>();
  const defaultService = serviceTypes.find((service) => service.id === "standard") ?? serviceTypes[0];
  const [selectedService, setSelectedService] = useState<ServiceType>(defaultService);
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);

  useEffect(() => {
    if (!tier) return;
    const normalizedTier = tier.toLowerCase() as ServiceTier;
    const match = serviceTypes.find((service) => service.id === normalizedTier);
    if (match) {
      setSelectedService(match);
    }
  }, [tier]);

  const plans = useMemo(() => {
    if (!selectedRegion.available) return [];
    return planMatrix[selectedService.id] ?? [];
  }, [selectedRegion.available, selectedService.id]);

  return (
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
            <div className="space-y-2">
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 1</p>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Service Type</h2>
                <p className="text-sm text-muted-foreground font-inter">
                  Select your tier to update pricing, clocks, and Geekbench instantly.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {serviceTypes.map((service) => (
                <Card
                  key={service.id}
                  className={`glass-card p-4 h-full cursor-pointer transition-all duration-300 ${
                    selectedService.id === service.id
                      ? "glow-primary border-primary/60 bg-glass-surface/80"
                      : "hover-glow-primary"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">NodeX</p>
                      <h3 className="text-lg font-orbitron font-semibold text-foreground leading-tight">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      {service.pricePerGb}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
            <div className="glass-card p-6 rounded-2xl border border-glass-border">
              <div className="flex flex-wrap items-center gap-6">
                <div className="min-w-[200px]">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Service Type Details</p>
                  <h4 className="text-xl font-orbitron font-semibold text-foreground mt-2">{selectedService.name}</h4>
                  <p className="text-sm text-muted-foreground font-inter mt-1">Updated in real-time for your selection.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 min-w-[260px]">
                  <div className="glass-card p-4 rounded-xl border border-glass-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">All-Core Clock</p>
                    <p className="text-2xl font-orbitron font-bold text-foreground mt-1">{selectedService.details.clock}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl border border-glass-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">Geekbench 6</p>
                    <p className="text-2xl font-orbitron font-bold text-foreground mt-1">{selectedService.details.geekbench}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl border border-glass-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">Price / GB RAM</p>
                    <p className="text-2xl font-orbitron font-bold text-foreground mt-1">{selectedService.details.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 2</p>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Compute Region</h2>
                <p className="text-sm text-muted-foreground font-inter">Pick your nearest Point of Presence to view available plans.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="glass-card p-4 rounded-2xl border border-glass-border space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regions.map((region) => (
                    <Card
                      key={region.id}
                      className={`glass-card p-4 cursor-pointer transition-all duration-300 flex flex-col gap-2 ${
                        selectedRegion.id === region.id
                          ? "glow-primary border-primary/60 bg-glass-surface/80"
                          : region.available
                            ? "hover-glow-primary"
                            : "opacity-60"
                      }`}
                      onClick={() => setSelectedRegion(region)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Region</p>
                          <h4 className="text-lg font-orbitron font-semibold text-foreground">{region.name}</h4>
                        </div>
                        <span className={`text-xs font-semibold ${region.accent}`}>{region.note}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter">Optimized peering and clean IP space.</p>
                    </Card>
                  ))}
                </div>
              </div>
              <Card className="glass-card p-6 rounded-2xl border border-glass-border lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Region Visualization</p>
                    <h3 className="text-2xl font-orbitron font-semibold text-foreground">{selectedRegion.name}</h3>
                    <p className="text-sm text-muted-foreground font-inter mt-1">Latency mesh and peering preview update as you switch regions.</p>
                  </div>
                  <span className={`text-xs font-semibold ${selectedRegion.accent}`}>{selectedRegion.note}</span>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 h-full">
                    <div className="w-full h-full min-h-[180px] rounded-xl bg-gradient-to-br from-[#0c0f1f] via-[#14182c] to-[#0c0f1f] border border-dashed border-primary/30 flex items-center justify-center text-sm text-muted-foreground font-inter">
                      Region map placeholder
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="glass-card p-3 rounded-xl border border-glass-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">Latency</p>
                      <p className="text-sm text-foreground font-inter">Edge routes tuned for gamer and app traffic.</p>
                    </div>
                    <div className="glass-card p-3 rounded-xl border border-glass-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">Peering</p>
                      <p className="text-sm text-foreground font-inter">Direct connects to carriers and cloud on-ramps.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 3</p>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Instance Plans</h2>
                <p className="text-sm text-muted-foreground font-inter">
                  Plans filter automatically by service type and live region availability.
                </p>
              </div>
            </div>
            <Card className="glass-card p-6 rounded-2xl border border-glass-border">
              <div className="overflow-x-auto comparison-table-wrapper">
                <table className="w-full text-left comparison-table">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <th className="py-3 pr-4 font-semibold">Name</th>
                      <th className="py-3 pr-4 font-semibold">vCPU</th>
                      <th className="py-3 pr-4 font-semibold">RAM</th>
                      <th className="py-3 pr-4 font-semibold">Storage</th>
                      <th className="py-3 pr-4 font-semibold">Bandwidth</th>
                      <th className="py-3 pr-4 font-semibold">Deployment Time</th>
                      <th className="py-3 pr-4 font-semibold">Price</th>
                      <th className="py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border/60">
                    {plans.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-muted-foreground font-inter">
                          No plans available in this region. Select another PoP to continue.
                        </td>
                      </tr>
                    )}
                    {plans.map((plan) => (
                      <tr key={plan.name} className="text-sm text-foreground/90 hover:bg-glass-surface/60 transition-all duration-200">
                        <td className="py-4 pr-4 font-orbitron font-semibold text-foreground">{plan.name}</td>
                        <td className="py-4 pr-4">{plan.vcpu}</td>
                        <td className="py-4 pr-4">{plan.ram}</td>
                        <td className="py-4 pr-4">{plan.storage}</td>
                        <td className="py-4 pr-4">{plan.bandwidth}</td>
                        <td className="py-4 pr-4 text-primary">{plan.deployment}</td>
                        <td className="py-4 pr-4 font-semibold text-foreground">{plan.price}</td>
                        <td className="py-4">
                          {plan.deployment === "Instant" ? (
                            <Button className="bg-gradient-primary text-background font-orbitron font-semibold px-4 py-2 h-auto">
                              Purchase
                            </Button>
                          ) : (
                            <button className="text-primary font-semibold text-sm hover:underline">Get Notified</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <Card className="glass-card p-6">
            <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">Optional Add-Ons</h3>
            <AddOns />
          </Card>

          <section className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">VPS FEATURES</p>
              <h2 className="text-3xl font-orbitron font-bold text-foreground">Infrastructure that keeps up</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureGridItems.map((item) => (
                <div key={item} className="glass-card p-5 rounded-2xl border border-glass-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-orbitron font-semibold text-foreground">{item}</p>
                    <p className="text-xs text-muted-foreground font-inter mt-1">NodeX-grade reliability with tuned network paths.</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,234,255,0.7)]" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">CONTROL PANEL</p>
              <h2 className="text-3xl font-orbitron font-bold text-foreground">Easy-to-use Control Panel</h2>
              <p className="text-sm text-muted-foreground font-inter">CommandCenter™ keeps every action within one sleek interface.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-glass-border">
              <div className="grid gap-4 md:grid-cols-3">
                {controlPanelItems.map((item) => (
                  <div key={item} className="glass-card p-4 rounded-xl border border-glass-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-orbitron font-semibold text-foreground">{item}</p>
                      <p className="text-xs text-muted-foreground font-inter mt-1">One-click ready from the CoreNodeX panel.</p>
                    </div>
                    <span className="text-primary text-xs font-semibold">Live</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <FeatureGrid title="Built for performance teams" />

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
};

export default VpsPage;
