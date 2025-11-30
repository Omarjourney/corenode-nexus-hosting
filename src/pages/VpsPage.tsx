import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  Chip,
  Cpu,
  Flame,
  Lightning,
  MapPin,
  Rocket,
  Save,
  Server,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import AddOns from "@/components/AddOns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureGrid } from "@/components/FeatureGrid";
import { FaqSection } from "@/components/FaqSection";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BRAND_NAME, catalogPricing } from "@/data/pricing";

type ServiceTier = "budget" | "standard" | "premium" | "extreme" | "ryzen";

const tierBorders: Record<ServiceTier, string> = {
  budget: "from-[#00D4FF] to-[#00D4FF]",
  standard: "from-primary to-primary",
  premium: "from-[#FFB800] to-[#FFB800]",
  extreme: "from-[#A855F7] to-[#A855F7]",
  ryzen: "from-[#EF4444] to-[#EF4444]",
};

const tierIcons: Record<ServiceTier, JSX.Element> = {
  budget: <Server className="h-5 w-5" />,
  standard: <Chip className="h-5 w-5" />,
  premium: <Award className="h-5 w-5" />,
  extreme: <Rocket className="h-5 w-5" />,
  ryzen: <Flame className="h-5 w-5" />,
};

interface ServiceType {
  id: ServiceTier;
  name: string;
  description: string;
  pricePerGb: string;
  startingPrice: string;
  details: {
    clock: string;
    geekbench: string;
    price: string;
  };
}

interface Region {
  id: string;
  name: string;
  flag: string;
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
  recommended?: boolean;
}

interface ComparisonPlan extends Plan {
  tier: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: "budget",
    name: "NodeX Budget VPS",
    description: "Balanced Xeon cores for lightweight labs and dev sandboxes.",
    pricePerGb: "$0.39 / GB",
    startingPrice: "$12/mo",
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
    startingPrice: "$11/mo",
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
    startingPrice: "$8/mo",
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
    startingPrice: "$9/mo",
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
    startingPrice: "$7/mo",
    details: {
      clock: "4.5 GHz",
      geekbench: "2100-3200",
      price: "$1.85 / GB",
    },
  },
];

const regions: Region[] = [
  { id: "miami", name: "Miami, FL", flag: "🇺🇸", note: "1 Plan Available", available: true, accent: "text-emerald-400" },
  { id: "los-angeles", name: "Los Angeles, CA", flag: "🇺🇸", note: "1 Plan Available", available: true, accent: "text-primary" },
  { id: "nuremberg", name: "Nuremberg, DE", flag: "🇩🇪", note: "No Plans", available: false, accent: "text-rose-400" },
  { id: "johor", name: "Johor, MY", flag: "🇲🇾", note: "No Plans", available: false, accent: "text-rose-400" },
  { id: "kansas-city", name: "Kansas City, MO", flag: "🇺🇸", note: "No Plans", available: false, accent: "text-rose-400" },
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
    { name: "Standard S", vcpu: "8", ram: "16GB", storage: "128GB NVMe", bandwidth: "4TB", deployment: "Instant", price: "$22/mo", recommended: true },
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
  "Tuned profiles deliver 20% faster compute",
  "Sub-5ms latency to major cloud providers",
  "<1ms IOPS for demanding workloads",
  "Price-locked for 12 months",
  "We own the metal — no hyperscaler markups",
  "Average 99.97% uptime over 12 months",
];

const controlPanelItems = [
  { title: "Power Actions", description: "Start/stop/reboot without SSH" },
  { title: "Auto Reinstall", description: "Fresh OS in under 60 seconds" },
  { title: "noVNC", description: "Browser-based terminal" },
  { title: "Resource Monitoring", description: "Real-time graphs" },
  { title: "Password Adjustment", description: "Rotate root passwords with logging" },
  { title: "Fast UI", description: "React-based with sub-200ms loads" },
];

const testimonials = [
  {
    quote: "Moved game shards to CoreNodeX and latency immediately dropped. Support replies in minutes, not hours.",
    name: "Priya, Platform Engineer",
  },
  {
    quote: "The Standard tier is a sweet spot — pricing is predictable and the panel is ridiculously fast.",
    name: "Leo, SaaS Founder",
  },
  {
    quote: "We match multi-region deployments with their Miami PoP for near-instant provisioning.",
    name: "Morgan, DevOps Lead",
  },
];

const faqItems = [
  {
    question: "Can I scale resources later?",
    answer: "Upgrade RAM, vCPU, or storage at any time with zero reprovisioning delays and automatic balance updates.",
  },
  {
    question: "Do you include DDoS protection?",
    answer: "Always-on mitigation with traffic scrubbing, edge filtering, and alerting built into CommandCenter™.",
  },
  {
    question: "How do I save a configuration?",
    answer: "Use the Save Configuration link to keep your tier, region, and quick-config sliders in the URL for sharing.",
  },
  {
    question: "Is there an uptime guarantee?",
    answer: "Yes. We publish a 99.9% SLA and average 99.97% uptime over the past 12 months.",
  },
];

const trustSignals = [
  "99.9% Uptime SLA",
  "24/7 Support",
  "10,000+ Active Servers",
  "Price Match Guarantee",
];

const AnimatedMetric = ({ label, value }: { label: string; value: string }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <div className="glass-card p-4 rounded-xl border border-glass-border shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.18em]">{label}</p>
      <p className="text-2xl font-orbitron font-bold text-foreground mt-1 transition-all duration-300">{displayValue}</p>
    </div>
  );
};

const MetricBar = ({ label, percent }: { label: string; percent: number }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{percent}%</span>
    </div>
    <div className="h-2 rounded-full bg-glass-surface border border-glass-border relative overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-[#7C3AED] to-primary animate-pulse"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const VpsPage = () => {
  const { tier } = useParams<{ tier?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultService = serviceTypes.find((service) => service.id === "standard") ?? serviceTypes[0];
  const [selectedService, setSelectedService] = useState<ServiceType>(defaultService);
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);
  const [quickCpu, setQuickCpu] = useState(4);
  const [quickRam, setQuickRam] = useState(16);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const [comparison, setComparison] = useState<Record<string, ComparisonPlan>>({});
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const plansRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const urlTier = searchParams.get("tier") as ServiceTier | null;
    const urlRegion = searchParams.get("region");
    const urlCpu = searchParams.get("cpu");
    const urlRam = searchParams.get("ram");

    const normalizedTier = tier?.toLowerCase() as ServiceTier | undefined;
    const tierCandidate = normalizedTier || urlTier;
    const match = tierCandidate ? serviceTypes.find((service) => service.id === tierCandidate) : undefined;
    if (match) {
      setSelectedService(match);
    }

    const regionMatch = regions.find((region) => region.id === urlRegion);
    if (regionMatch) {
      setSelectedRegion(regionMatch);
    }

    if (urlCpu) setQuickCpu(Number(urlCpu));
    if (urlRam) setQuickRam(Number(urlRam));
  }, [searchParams, tier]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tier", selectedService.id);
    params.set("region", selectedRegion.id);
    params.set("cpu", String(quickCpu));
    params.set("ram", String(quickRam));
    setSearchParams(params, { replace: true });
  }, [quickCpu, quickRam, selectedRegion.id, selectedService.id, setSearchParams]);

  useEffect(() => {
    const onScroll = () => setStickyCtaVisible(window.scrollY > 520);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 10) {
        setIsExitModalOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleExitIntent);
    return () => document.removeEventListener("mouseleave", handleExitIntent);
  }, []);

  const plans = useMemo(() => {
    if (!selectedRegion.available) return [];
    return planMatrix[selectedService.id] ?? [];
  }, [selectedRegion.available, selectedService.id]);

  const geekbenchPercent = useMemo(() => {
    const [min, max] = selectedService.details.geekbench.split("-").map(Number);
    return Math.min(100, Math.round(((min + max) / 2 / 3200) * 100));
  }, [selectedService.details.geekbench]);

  const clockPercent = useMemo(() => {
    const clockValue = Number(selectedService.details.clock.replace(" GHz", ""));
    return Math.min(100, Math.round((clockValue / 5) * 100));
  }, [selectedService.details.clock]);

  const estimatedPrice = useMemo(() => {
    const base = Number(selectedService.startingPrice.replace(/[^0-9.]/g, ""));
    const ramPrice = (quickRam / 8) * 4;
    const cpuPrice = quickCpu * 2;
    return `$${(base + ramPrice + cpuPrice).toFixed(2)}/mo`;
  }, [quickCpu, quickRam, selectedService.startingPrice]);

  const toggleCompare = (plan: Plan) => {
    setComparison((prev) => {
      const exists = prev[plan.name];
      const next = { ...prev };
      if (exists) {
        delete next[plan.name];
      } else {
        next[plan.name] = { ...plan, tier: selectedService.name };
      }
      return next;
    });
  };

  const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth" });

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
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/40 px-4 py-2 bg-primary/5">
              <span className="text-xs font-orbitron tracking-[0.2em] text-primary">VPS</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/40">
                Production Ready
              </Badge>
            </div>
            <h1 className="text-5xl font-orbitron font-bold text-foreground">{catalogPricing.vps.label} VPS Hosting</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
              Deploy ultra-fast NVMe VPS with root access, CommandCenter™ automation, and predictable pricing.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button className="bg-gradient-to-r from-primary via-[#7C3AED] to-primary text-background font-orbitron font-semibold px-7 py-3 rounded-xl shadow-[0_0_18px_rgba(0,234,255,0.45)] hover:translate-y-[-2px] transition-all animate-pulse">
                Start My Server
              </Button>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                Talk to Sales
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-glass-surface/60 p-4 rounded-2xl border border-glass-border">
            {trustSignals.map((signal) => (
              <div key={signal} className="flex items-center gap-2 text-sm text-foreground justify-center">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>{signal}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-6 rounded-2xl border border-glass-border">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">Customer Voices</p>
                <div className="flex gap-4 mt-2 overflow-x-auto no-scrollbar pb-2">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.name} className="glass-card min-w-[260px] p-4 border border-glass-border flex flex-col gap-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <p className="text-sm text-foreground/90">“{testimonial.quote}”</p>
                      <p className="text-xs text-muted-foreground">{testimonial.name}</p>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 via-[#7C3AED]/20 to-primary/10 blur-3xl" />
            </div>
          </div>

          <div className="space-y-24">
            <section className="glass-card p-8 rounded-2xl border border-glass-border/80 bg-gradient-to-br from-white/5 via-white/0 to-white/5 backdrop-blur">
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-xs font-orbitron tracking-[0.2em] text-primary">Step 1 of 3 — Choose Service Type</p>
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Service Type</h2>
                <p className="text-sm text-muted-foreground font-inter">Select your tier to update pricing, clocks, and Geekbench instantly.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {serviceTypes.map((service) => {
                  const isSelected = selectedService.id === service.id;
                  return (
                    <Card
                      key={service.id}
                      className={`relative p-4 h-full cursor-pointer transition-all duration-300 rounded-2xl border bg-glass-surface/70 ${
                        isSelected ? "glow-primary border-primary/60" : "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10"
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${tierBorders[service.id]}`} />
                      {service.id === "standard" && (
                        <span className="absolute -top-3 right-3 bg-primary text-background text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 text-primary">
                          {tierIcons[service.id]}
                          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold">NodeX</p>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                          {service.pricePerGb}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        <h3 className="text-xl font-orbitron font-semibold text-foreground leading-tight">{service.name}</h3>
                        <p className="text-sm text-muted-foreground font-inter leading-relaxed">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">From {service.startingPrice}</span>
                          <span className="text-xs text-muted-foreground">{service.pricePerGb}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-start">
                <Card className="glass-card p-6 rounded-2xl border border-glass-border/80 lg:sticky top-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Service Type Details</p>
                      <h4 className="text-xl font-orbitron font-semibold text-foreground mt-2">{selectedService.name}</h4>
                      <p className="text-sm text-muted-foreground font-inter mt-1">Updated in real-time for your selection.</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <AnimatedMetric label="All-Core Clock" value={selectedService.details.clock} />
                    <AnimatedMetric label="Geekbench 6" value={selectedService.details.geekbench} />
                    <AnimatedMetric label="Price / GB RAM" value={selectedService.details.price} />
                  </div>
                  <div className="mt-6 space-y-4">
                    <MetricBar label="GHz Speedometer" percent={clockPercent} />
                    <MetricBar label="Geekbench Score" percent={geekbenchPercent} />
                  </div>
                </Card>

                <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-glass-border/80 space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick Config</p>
                      <h4 className="text-lg font-semibold text-foreground">Use sliders to mock your build</h4>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10">
                      Save Configuration
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>vCPU</span>
                        <span className="font-mono text-foreground">{quickCpu} cores</span>
                      </div>
                      <Slider value={[quickCpu]} min={2} max={32} step={2} onValueChange={([val]) => setQuickCpu(val)} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>RAM</span>
                        <span className="font-mono text-foreground">{quickRam} GB</span>
                      </div>
                      <Slider value={[quickRam]} min={4} max={128} step={4} onValueChange={([val]) => setQuickRam(val)} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Save className="h-4 w-4 text-primary" />
                      <span>Shareable URL updates as you tune.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                        Est. {estimatedPrice}
                      </Badge>
                      <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-card p-8 rounded-2xl border border-glass-border/80 bg-gradient-to-br from-white/5 via-white/0 to-white/5 backdrop-blur">
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-xs font-orbitron tracking-[0.2em] text-primary">Step 2 of 3 — Choose Region</p>
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Compute Region</h2>
                <p className="text-sm text-muted-foreground font-inter">Pick your nearest Point of Presence to view available plans.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="glass-card p-4 rounded-2xl border border-glass-border space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {regions.map((region) => {
                      const isSelected = selectedRegion.id === region.id;
                      return (
                        <Card
                          key={region.id}
                          className={`glass-card p-4 cursor-pointer transition-all duration-300 flex flex-col gap-2 rounded-xl border ${
                            isSelected
                              ? "glow-primary border-primary/60 bg-glass-surface/80"
                              : region.available
                                ? "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
                                : "opacity-50"
                          }`}
                          onClick={() => setSelectedRegion(region)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Region</p>
                              <h4 className="text-lg font-orbitron font-semibold text-foreground flex items-center gap-2">
                                <span>{region.flag}</span>
                                {region.name}
                              </h4>
                            </div>
                            <span className={`text-xs font-semibold ${region.accent}`}>{region.note}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className={region.available ? "border-emerald-500/40 text-emerald-400" : "border-rose-500/50 text-rose-400"}>
                              {region.available ? "In Network" : "No Plans"}
                            </Badge>
                            {region.available && (
                              <button onClick={scrollToPlans} className="text-primary underline-offset-4 hover:underline">
                                1 Plan Available
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-inter">Optimized peering and clean IP space.</p>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                <Card className="glass-card p-6 rounded-2xl border border-glass-border lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Region Visualization</p>
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">{selectedRegion.name}</h3>
                      <p className="text-sm text-muted-foreground font-inter mt-1">Latency mesh and peering preview update as you switch regions.</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                      <MapPin className="h-3 w-3 mr-1" /> {selectedRegion.flag} {selectedRegion.name}
                    </Badge>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <div className="w-full h-full min-h-[220px] rounded-xl bg-gradient-to-br from-[#0c0f1f] via-[#14182c] to-[#0c0f1f] border border-primary/20 relative overflow-hidden">
                        <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full text-primary/30">
                          <defs>
                            <linearGradient id="mapGlow" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="rgba(0,234,255,0.6)" />
                              <stop offset="100%" stopColor="rgba(124,58,237,0.6)" />
                            </linearGradient>
                          </defs>
                          <rect width="400" height="220" fill="url(#mapGlow)" opacity="0.08" />
                          <path
                            d="M40 120 C120 60, 200 60, 320 90"
                            stroke="url(#mapGlow)"
                            strokeWidth="1.5"
                            fill="none"
                            className="animate-pulse"
                          />
                          <path
                            d="M60 160 C160 140, 200 180, 340 140"
                            stroke="url(#mapGlow)"
                            strokeWidth="1.5"
                            fill="none"
                            className="animate-[pulse_2.8s_ease_in_out_infinite]"
                          />
                          {[{ x: 60, y: 160 }, { x: 150, y: 90 }, { x: 260, y: 100 }, { x: 320, y: 90 }].map((node, idx) => (
                            <g key={idx}>
                              <circle cx={node.x} cy={node.y} r={6} fill="url(#mapGlow)" opacity="0.9" />
                              <circle cx={node.x} cy={node.y} r={12} className="animate-ping" fill="rgba(0,234,255,0.25)" />
                            </g>
                          ))}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground font-inter">
                          Global network overlay with glowing nodes
                        </div>
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
                      {!selectedRegion.available && (
                        <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40">No Plans</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section ref={plansRef} className="glass-card p-8 rounded-2xl border border-glass-border/80 bg-gradient-to-br from-white/5 via-white/0 to-white/5 backdrop-blur">
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-xs font-orbitron tracking-[0.2em] text-primary">Step 3 of 3 — Choose Your Plan</p>
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Instance Plans</h2>
                <p className="text-sm text-muted-foreground font-inter">Plans filter automatically by service type and live region availability.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10">Green = instant deploy</Badge>
                <Badge variant="outline" className="border-rose-500/40 text-rose-300 bg-rose-500/10">Red = out of stock</Badge>
                <Button variant="secondary" className="bg-primary/15 text-primary border-primary/40" onClick={() => setIsComparisonOpen(true)}>
                  Compare Selected ({Object.keys(comparison).length})
                </Button>
              </div>

              <div className="hidden md:block overflow-hidden rounded-xl border border-glass-border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <TableHead className="py-3">Name</TableHead>
                      <TableHead className="py-3">vCPU</TableHead>
                      <TableHead className="py-3">RAM</TableHead>
                      <TableHead className="py-3">Storage</TableHead>
                      <TableHead className="py-3">Bandwidth</TableHead>
                      <TableHead className="py-3">Deployment</TableHead>
                      <TableHead className="py-3">Price</TableHead>
                      <TableHead className="py-3">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-6">No plans available in this region. Select another PoP to continue.</TableCell>
                      </TableRow>
                    )}
                    {plans.map((plan) => {
                      const isInstant = plan.deployment === "Instant";
                      return (
                        <TableRow
                          key={plan.name}
                          className={`text-sm text-foreground/90 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-primary/10 ${
                            isInstant ? "" : "opacity-60"
                          }`}
                        >
                          <TableCell className="font-orbitron font-semibold text-foreground flex items-center gap-2">
                            {plan.name}
                            {plan.recommended && <Badge className="bg-primary/20 text-primary">Recommended</Badge>}
                          </TableCell>
                          <TableCell className="font-mono">{plan.vcpu}</TableCell>
                          <TableCell className="font-mono">{plan.ram}</TableCell>
                          <TableCell className="font-mono">{plan.storage}</TableCell>
                          <TableCell className="font-mono">{plan.bandwidth}</TableCell>
                          <TableCell>
                            {isInstant ? (
                              <span className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold relative">
                                <span className="absolute inset-0 rounded-full blur animate-ping bg-emerald-500/30" />
                                <span className="relative z-10 glass-card px-2 py-1 rounded-full border border-emerald-500/50">Instant</span>
                              </span>
                            ) : (
                              <Badge className="bg-rose-500/15 text-rose-300 border border-rose-500/40">Out of Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">{plan.price}</TableCell>
                          <TableCell className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {isInstant ? (
                                <Button className="bg-gradient-primary text-background font-orbitron font-semibold px-4 py-2 h-auto">Purchase</Button>
                              ) : (
                                <Button variant="outline" className="border-rose-400/50 text-rose-200 flex items-center gap-2">
                                  <MailIcon /> Get Notified
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                className="text-primary hover:text-primary"
                                onClick={() => toggleCompare(plan)}
                              >
                                {comparison[plan.name] ? "Remove" : "Compare"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="grid md:hidden gap-3">
                {plans.length === 0 && (
                  <Card className="glass-card p-4 text-center text-muted-foreground">No plans available in this region.</Card>
                )}
                {plans.map((plan) => {
                  const isInstant = plan.deployment === "Instant";
                  return (
                    <Card key={plan.name} className={`glass-card p-4 border ${isInstant ? "border-emerald-500/30" : "border-rose-500/30 opacity-60"} rounded-xl`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-orbitron font-semibold text-foreground">{plan.name}</h4>
                          {plan.recommended && <Badge className="bg-primary/20 text-primary">Recommended</Badge>}
                        </div>
                        <Badge variant="outline" className={isInstant ? "border-emerald-500/40 text-emerald-400" : "border-rose-500/40 text-rose-300"}>
                          {isInstant ? "Instant" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono text-foreground/90 mt-3">
                        <span>vCPU: {plan.vcpu}</span>
                        <span>RAM: {plan.ram}</span>
                        <span>Storage: {plan.storage}</span>
                        <span>Bandwidth: {plan.bandwidth}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-semibold text-foreground">{plan.price}</p>
                        <div className="flex gap-2">
                          {isInstant ? (
                            <Button size="sm" className="bg-gradient-primary text-background font-orbitron font-semibold">Purchase</Button>
                          ) : (
                            <Button size="sm" variant="outline" className="border-rose-400/50 text-rose-200 flex items-center gap-1">
                              <MailIcon /> Notify
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-primary" onClick={() => toggleCompare(plan)}>
                            {comparison[plan.name] ? "Remove" : "Compare"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>

          <Card className="glass-card p-6 rounded-2xl border border-glass-border">
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
                  <div key={item.title} className="glass-card p-4 rounded-xl border border-glass-border flex items-start gap-3">
                    <Cpu className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-orbitron font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground font-inter mt-1">{item.description}</p>
                    </div>
                    <span className="ml-auto text-primary text-xs font-semibold">Live</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <FeatureGrid title="Built for performance teams" />

          <FaqSection items={faqItems} />
        </div>
      </div>

      {stickyCtaVisible && (
        <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 lg:px-8 z-40">
          <div className="max-w-5xl mx-auto glass-card p-4 rounded-2xl border border-primary/40 flex items-center justify-between shadow-[0_0_30px_rgba(0,234,255,0.2)]">
            <div className="flex items-center gap-3 text-sm">
              <Lightning className="h-5 w-5 text-primary" />
              <span className="text-foreground">Configure Your VPS →</span>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-primary text-background font-orbitron font-semibold px-4 py-2 h-auto">Start My Server</Button>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">Live Chat</Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
        <DialogTrigger asChild>
          <span className="sr-only">Open comparison</span>
        </DialogTrigger>
        <DialogContent className="glass-card border border-glass-border bg-gradient-to-br from-[#0c0f1f] via-[#14182c] to-[#0c0f1f]">
          <DialogHeader>
            <DialogTitle className="text-foreground">Plan comparison</DialogTitle>
          </DialogHeader>
          {Object.keys(comparison).length === 0 ? (
            <p className="text-sm text-muted-foreground">Select plans to compare.</p>
          ) : (
            <div className="grid gap-3">
              {Object.values(comparison).map((plan) => (
                <Card key={plan.name} className="glass-card p-4 border border-glass-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-orbitron text-foreground">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.tier}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary">{plan.price}</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-foreground/80 mt-2">
                    <span>vCPU: {plan.vcpu}</span>
                    <span>RAM: {plan.ram}</span>
                    <span>Storage: {plan.storage}</span>
                    <span>BW: {plan.bandwidth}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <Card className="glass-card p-6 max-w-lg w-full border border-primary/30">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-orbitron font-semibold text-foreground">Wait — grab an exclusive offer</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Save your configuration and optionally drop a coupon to lock pricing.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Coupon (optional)"
                className="w-full rounded-lg bg-glass-surface border border-primary/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <Button className="w-full bg-gradient-primary text-background font-orbitron font-semibold">Save and Continue</Button>
              <button className="w-full text-sm text-muted-foreground" onClick={() => setIsExitModalOpen(false)}>
                Maybe later
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const MailIcon = () => <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" strokeWidth="1.5" /><path d="m6 7 5.368 4.214a1 1 0 0 0 1.264 0L18 7" stroke="currentColor" strokeWidth="1.5" /></svg>;

export default VpsPage;
