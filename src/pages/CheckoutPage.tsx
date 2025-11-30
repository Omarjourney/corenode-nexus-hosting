import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";

interface Props {
  title: string;
}

const tiers = [
  {
    name: "CORE",
    panel: "CorePanel Lite™",
    description: "Budget-friendly control with essentials.",
    prices: [
      { ram: "2GB", price: 5.49 },
      { ram: "4GB", price: 7.99 },
      { ram: "6GB", price: 11.49 },
      { ram: "8GB", price: 14.99 },
    ],
  },
  {
    name: "ELITE",
    panel: "CNX CommandCenter™",
    description: "AI automation with CrashGuard + Blueprints.",
    prices: [
      { ram: "4GB", price: 11.49 },
      { ram: "6GB", price: 16.49 },
      { ram: "8GB", price: 21.49 },
      { ram: "12GB", price: 31.49 },
    ],
  },
  {
    name: "CREATOR",
    panel: "CommandCenter™ + Dedicated CPU",
    description: "Streamer-grade isolation and automation.",
    prices: [
      { ram: "16GB", price: 59.99 },
      { ram: "24GB", price: 87.99 },
      { ram: "32GB", price: 114.99 },
    ],
  },
];

const multiProfiles = [
  { label: "2 Profiles", price: 0 },
  { label: "5 Profiles", price: 4.49 },
  { label: "10 Profiles", price: 6.49 },
  { label: "Unlimited Profiles", price: 11.99 },
];

const addOns = [
  { label: "+1GB RAM", price: 2.49 },
  { label: "+2GB RAM", price: 4.99 },
  { label: "+4GB RAM", price: 9.99 },
  { label: "+8GB RAM", price: 19.99 },
  { label: "CPU Boost (Core → Elite)", price: 5 },
  { label: "CPU Boost (Elite → Creator)", price: 10 },
  { label: "+10GB Premium SSD", price: 2.99 },
  { label: "+25GB Premium SSD", price: 6.99 },
  { label: "+50GB Premium SSD", price: 12.99 },
  { label: "+100GB Premium SSD", price: 24.99 },
  { label: "Basic Backup (50GB)", price: 6.99 },
  { label: "Pro Backup (100GB)", price: 9.99 },
  { label: "Enterprise Backup (250GB)", price: 19.99 },
  { label: "Ultimate Backup (500GB)", price: 34.99 },
];

const CheckoutPage = ({ title }: Props) => {
  const [tier, setTier] = useState("ELITE");
  const [packageRam, setPackageRam] = useState("4GB");
  const [profile, setProfile] = useState("2 Profiles");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const selectedTier = tiers.find((t) => t.name === tier) ?? tiers[0];
  const packagePrice = useMemo(
    () => selectedTier.prices.find((p) => p.ram === packageRam)?.price ?? 0,
    [selectedTier, packageRam]
  );

  const profilePrice = useMemo(
    () => multiProfiles.find((p) => p.label === profile)?.price ?? 0,
    [profile]
  );

  const addOnTotal = useMemo(
    () =>
      addOns
        .filter((a) => selectedAddons.includes(a.label))
        .reduce((sum, addon) => sum + addon.price, 0),
    [selectedAddons]
  );

  const monthlyTotal = packagePrice + profilePrice + addOnTotal;

  const toggleAddon = (label: string, checked: boolean | "indeterminate") => {
    setSelectedAddons((prev) => {
      if (checked) return prev.includes(label) ? prev : [...prev, label];
      return prev.filter((item) => item !== label);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-orbitron tracking-[0.2em] text-primary">Checkout</p>
            <h1 className="text-4xl font-orbitron font-bold text-gradient-primary">{title} Checkout</h1>
            <p className="text-muted-foreground font-inter">
              Select your tier, multi-game profiles, and CodeNodeX add-ons.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card p-6 space-y-4 lg:col-span-2">
              <div className="space-y-3">
                <h3 className="font-orbitron font-semibold text-lg">1. Choose Tier</h3>
                <RadioGroup
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  value={tier}
                  onValueChange={(value) => {
                    setTier(value);
                    const firstPackage = tiers.find((t) => t.name === value)?.prices[0]?.ram;
                    if (firstPackage) setPackageRam(firstPackage);
                  }}
                >
                  {tiers.map((item) => (
                    <label key={item.name} className="glass-card p-3 rounded-lg border border-glass-border space-y-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-orbitron text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.panel}</p>
                        </div>
                        <RadioGroupItem value={item.name} id={item.name} />
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.prices.map((p) => (
                          <span key={p.ram} className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {p.ram} @ ${p.price.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <h3 className="font-orbitron font-semibold text-lg">2. Pick Package</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedTier.prices.map((p) => (
                    <button
                      key={p.ram}
                      onClick={() => setPackageRam(p.ram)}
                      className={`glass-card p-3 text-sm border ${packageRam === p.ram ? "border-primary ring-2 ring-primary/40" : "border-glass-border"}`}
                    >
                      <div className="font-semibold text-foreground">{p.ram}</div>
                      <div className="text-muted-foreground">${p.price.toFixed(2)}/mo</div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <h3 className="font-orbitron font-semibold text-lg">3. Multi-Game Profiles</h3>
                <RadioGroup
                  value={profile}
                  onValueChange={setProfile}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {multiProfiles.map((item) => (
                    <label key={item.label} className={`glass-card p-3 border cursor-pointer ${profile === item.label ? "border-secondary ring-2 ring-secondary/40" : "border-glass-border"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">Switch between saved game setups instantly.</p>
                        </div>
                        <RadioGroupItem value={item.label} id={item.label} />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.price === 0 ? "Included" : `$${item.price.toFixed(2)}/mo`}</p>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <h3 className="font-orbitron font-semibold text-lg">4. Add-Ons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {addOns.map((addon) => (
                    <label key={addon.label} className="flex items-center space-x-3 glass-card p-3 border border-glass-border">
                      <Checkbox
                        id={addon.label}
                        checked={selectedAddons.includes(addon.label)}
                        onCheckedChange={(checked) => toggleAddon(addon.label, checked)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-inter text-foreground">{addon.label}</p>
                        <p className="text-xs text-muted-foreground">${addon.price.toFixed(2)}/mo</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-orbitron font-semibold">Order Summary</p>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2 text-sm font-inter">
                <SummaryRow label="Tier" value={`${tier} (${selectedTier.panel})`} />
                <SummaryRow label="Package" value={`${packageRam} – $${packagePrice.toFixed(2)}/mo`} />
                <SummaryRow
                  label="Multi-Game Profiles"
                  value={`${profile} ${profilePrice === 0 ? "(Included)" : `$${profilePrice.toFixed(2)}/mo`}`}
                />
                {selectedAddons.map((addon) => {
                  const price = addOns.find((a) => a.label === addon)?.price ?? 0;
                  return <SummaryRow key={addon} label={addon} value={`$${price.toFixed(2)}/mo`} />;
                })}
              </div>
              <Separator />
              <div className="flex items-center justify-between font-orbitron text-lg">
                <span>Total (monthly)</span>
                <span className="text-gradient-primary">${monthlyTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-gradient-primary glow-primary font-orbitron">Confirm & Checkout</Button>
              <div className="text-xs text-muted-foreground font-inter space-y-1">
                <p>Includes DDoS protection, uptime SLA, and instant deployment.</p>
                <p>CNX CommandCenter™ tiers ship with AI HealthGuard + CrashGuard.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-semibold">{value}</span>
  </div>
);

export default CheckoutPage;
