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
      { ram: "2GB", price: 4.49 },
      { ram: "4GB", price: 7.49 },
      { ram: "6GB", price: 10.49 },
      { ram: "8GB", price: 13.49 },
    ],
  },
  {
    name: "ELITE",
    panel: "CNX CommandCenter™",
    description: "AI automation with CrashGuard + Blueprints.",
    prices: [
      { ram: "4GB", price: 11.49 },
      { ram: "8GB", price: 17.49 },
      { ram: "12GB", price: 27.49 },
      { ram: "16GB", price: 36.49 },
    ],
  },
  {
    name: "CREATOR",
    panel: "CommandCenter™ + Dedicated CPU",
    description: "Streamer-grade isolation and automation.",
    prices: [
      { ram: "16GB", price: 49.99 },
      { ram: "24GB", price: 69.99 },
      { ram: "32GB", price: 89.99 },
      { ram: "48GB", price: 129.99 },
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
  { label: "Dedicated IP", price: 2.99 },
  { label: "Extra 50GB NVMe", price: 2.99 },
  { label: "Automatic Backups", price: 3.99 },
  { label: "Modpack Auto-Install", price: 1.99 },
  { label: "CrashGuard AI", price: 3.49 },
  { label: "Priority Support", price: 4.99 },
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
              Select your tier, multi-game profiles, and CoreNodeX add-ons.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {multiProfiles.map((item) => (
                    <label key={item.label} className={`glass-card p-3 border ${profile === item.label ? "border-secondary ring-2 ring-secondary/40" : "border-glass-border"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">Switch between saved game setups instantly.</p>
                        </div>
                        <RadioGroupItem
                          value={item.label}
                          id={item.label}
                          checked={profile === item.label}
                          onCheckedChange={() => setProfile(item.label)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.price === 0 ? "Included" : `$${item.price.toFixed(2)}/mo`}</p>
                    </label>
                  ))}
                </div>
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
