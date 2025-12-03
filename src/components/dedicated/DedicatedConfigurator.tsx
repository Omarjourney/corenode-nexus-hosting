import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Crown, Cpu, Gauge, MapPin, Rocket, ShieldCheck, Zap } from "lucide-react";

type TierId = "CORE" | "ELITE" | "CREATOR";

type UiInventory = {
  id: string;
  family: string;
  region: string;
  cpu: string;
  ramGb: number;
  storage: string;
  priceMonthly: number;
  status: "available" | "sold-out";
};

type TierMeta = {
  cpuFamily: string;
  clock: string;
  geekbench: string;
  pricePerGb: string;
  markup: string;
  description: string;
};

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const familyMeta: Record<TierId, TierMeta> = {
  CORE: {
    cpuFamily: "Intel Xeon E5",
    clock: "2.3GHz",
    geekbench: "8000",
    pricePerGb: "$1.50",
    markup: "10%",
    description: "Balanced performance for general workloads.",
  },
  ELITE: {
    cpuFamily: "AMD EPYC",
    clock: "2.8GHz",
    geekbench: "12000",
    pricePerGb: "$1.20",
    markup: "8%",
    description: "High performance for demanding applications.",
  },
  CREATOR: {
    cpuFamily: "Intel Xeon Gold",
    clock: "3.0GHz",
    geekbench: "15000",
    pricePerGb: "$1.00",
    markup: "5%",
    description: "Top-tier performance for mission-critical workloads.",
  },
};

const gradientButton =
  "bg-[linear-gradient(135deg,#00E5FF_0%,#8B5CF6_50%,#1EE5C9_100%)] text-slate-900 hover:brightness-110";

const tierCards: Array<{
  id: TierId;
  name: string;
  descriptor: string;
  icon: any;
  border?: string;
  accent?: string;
  badgeClass?: string;
}> = [
  { id: "CORE", name: "CORE", descriptor: "Balanced performance", icon: Cpu, border: "border-cyan-400", accent: "from-cyan-400/30 to-cyan-200/10", badgeClass: "text-cyan-400" },
  { id: "ELITE", name: "ELITE", descriptor: "High performance", icon: Rocket, border: "border-violet-400", accent: "from-violet-400/30 to-violet-200/10", badgeClass: "text-violet-400" },
  { id: "CREATOR", name: "CREATOR", descriptor: "Top-tier performance", icon: Crown, border: "border-amber-400", accent: "from-amber-400/30 to-amber-200/10", badgeClass: "text-amber-400" },
];

const STATIC_INVENTORY: UiInventory[] = [
  {
    id: "static-1",
    family: "CORE",
    region: "miami",
    cpu: "Ryzen 5600X",
    ramGb: 32,
    storage: "1TB NVMe",
    priceMonthly: 69,
    status: "available",
  },
  {
    id: "static-2",
    family: "ELITE",
    region: "london",
    cpu: "Ryzen 7950X",
    ramGb: 64,
    storage: "2TB NVMe",
    priceMonthly: 139,
    status: "available",
  },
];

const CACHE_KEY = "dedicated_inventory_cache";

export function DedicatedConfigurator() {
  const [inventory, setInventory] = useState<UiInventory[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierId>("CORE");
  const [currentRegion, setCurrentRegion] = useState<string>("miami");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function mapReliableToUi(data: any[]): UiInventory[] {
    return data.map((item: any) => ({
      id: item.id,
      family: item.family || item.server_type || "CORE",
      region: item.location || item.region || "miami",
      cpu: item.cpu || item.processor,
      ramGb: item.memory_gb || item.ram_gb,
      storage: item.storage || item.drives,
      priceMonthly: item.price || item.price_usd,
      status: item.available ? "available" : "sold-out",
    }));
  }

  const loadInventory = useCallback(async () => {
    const cachedInventory: UiInventory[] = (() => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? (JSON.parse(raw) as UiInventory[]) : [];
      } catch (err) {
        console.error("Failed to parse cached inventory", err);
        return [];
      }
    })();

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://api.corenodex.com/api/servers.php", {
        headers: { Accept: "application/json" },
      });
      console.log("📡 Raw dedicated response:", response.status, response.headers);
      const json = await response.json();
      console.log("📦 Parsed dedicated JSON:", json);
      const mapped = Array.isArray(json)
        ? mapReliableToUi(json)
        : mapReliableToUi(json.data || json.inventory || []);
      setInventory(mapped);
      if (mapped.length) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      }
    } catch (error) {
      console.error("🔥 Inventory fetch error:", error);
      console.log("🗄 Cached inventory:", cachedInventory);
      setInventory(cachedInventory);
      setError("Unable to load inventory right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedInventory: UiInventory[] = (() => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? (JSON.parse(raw) as UiInventory[]) : [];
      } catch {
        return [];
      }
    })();

    if (cachedInventory.length) {
      setInventory(cachedInventory);
    }
    loadInventory();
  }, [loadInventory]);

  const effectiveInventory = useMemo(() => {
    const mapped = inventory;
    return mapped.length ? mapped : STATIC_INVENTORY;
  }, [inventory]);

  const regions = useMemo(() => {
    const unique = [...new Set(effectiveInventory.map((i) => i.region))];
    return unique.length ? unique : ["miami"];
  }, [effectiveInventory]);

  const selectedRegion = useMemo(() => {
    return regions.includes(currentRegion) ? currentRegion : regions[0] || "miami";
  }, [currentRegion, regions]);

  const tierPrices = useMemo(() => {
    const result: Record<TierId, number> = { CORE: Infinity, ELITE: Infinity, CREATOR: Infinity };
    tierCards.forEach((tier) => {
      const tierMinPrice = effectiveInventory
        .filter((item) => item.family === tier.id)
        .reduce((min, s) => Math.min(min, s.priceMonthly), Infinity);
      if (tierMinPrice !== Infinity) {
        result[tier.id] = tierMinPrice;
      } else {
        const fallback = STATIC_INVENTORY.filter((i) => i.family === tier.id).reduce(
          (min, s) => Math.min(min, s.priceMonthly),
          Infinity,
        );
        result[tier.id] = fallback === Infinity ? 69 : fallback;
      }
    });
    return result;
  }, [effectiveInventory]);

  const serversInRegion = useMemo(() => {
    return effectiveInventory.filter((server) => server.region === selectedRegion);
  }, [effectiveInventory, selectedRegion]);

  const filteredServers = useMemo(() => {
    return serversInRegion.filter((server) => server.family === selectedTier);
  }, [selectedTier, serversInRegion]);

  if (isLoading && !error && !effectiveInventory.length) {
    return <SkeletonLoader />;
  }

  if (error && !effectiveInventory.length) {
    return <ErrorState retry={loadInventory} />;
  }

  return (
    <div className="space-y-12">
      <section className="glass-card p-6 md:p-8 rounded-2xl border border-glass-border shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 1 — TIER</p>
                <h2 className="text-3xl font-orbitron font-bold text-foreground">Select NodeX Metal Family</h2>
              </div>
              <Badge className="bg-primary/10 text-primary border border-primary/30">Live pricing</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tierCards.map((tier) => {
                const Icon = tier.icon;
                const isSelected = tier.id === selectedTier;
                const price = tierPrices[tier.id];
                const priceLabel = price === Infinity ? "Starting at $69/mo" : `${priceFormatter.format(price)}/mo`;
                return (
                  <button
                    key={tier.id}
                    className={cn(
                      "relative glass-card text-left p-4 rounded-2xl border transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,229,255,0.15)]",
                      isSelected ? `${tier.border} ring-2 ring-primary/40` : "border-glass-border",
                    )}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className={cn("absolute inset-0 rounded-2xl opacity-70 bg-gradient-to-br", tier.accent)} />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className={cn("text-sm font-semibold uppercase tracking-wide", tier.badgeClass)}>{tier.name}</p>
                        <p className="text-sm text-muted-foreground font-inter">{tier.descriptor}</p>
                        <p className="text-lg font-semibold text-foreground">
                          From {priceLabel} <span className="text-xs text-muted-foreground ml-2">/mo</span>
                        </p>
                      </div>
                      <span className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border", tier.border)}>
                        <Icon className="w-6 h-6 text-primary" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="glass-card flex-1 lg:max-w-md p-6 border border-primary/20 bg-[#1A243A]/70 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Service Details</p>
                <h3 className="text-xl font-bold text-foreground">{familyMeta[selectedTier]?.cpuFamily || "—"}</h3>
              </div>
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            {familyMeta[selectedTier] ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <DetailRow label="CPU Family" value={familyMeta[selectedTier].cpuFamily} />
                <DetailRow label="Clock Speed" value={familyMeta[selectedTier].clock} />
                <DetailRow label="Geekbench" value={familyMeta[selectedTier].geekbench} />
                <DetailRow label="Price per GB" value={familyMeta[selectedTier].pricePerGb} />
                <DetailRow label="CNX Markup" value={familyMeta[selectedTier].markup} />
                <p className="text-foreground/90 leading-relaxed pt-1">{familyMeta[selectedTier].description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Loading details…</p>
            )}
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="glass-card flex-[2] p-6 border border-glass-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 2 — REGION</p>
                <h3 className="text-2xl font-orbitron font-bold text-foreground">Select Region</h3>
              </div>
              <Badge className="bg-secondary/15 text-secondary border border-secondary/30">{regions.length} Regions</Badge>
            </div>
            {!inventory.length && (
              <div className="text-yellow-400 text-sm mb-3">Delayed capacity sync—showing last known inventory.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {regions.map((region) => {
                const isSelected = region === selectedRegion;
                return (
                  <button
                    key={region}
                    onClick={() => setCurrentRegion(region)}
                    className={cn(
                      "glass-card p-4 rounded-2xl border text-left transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(138,92,255,0.15)]",
                      isSelected ? "border-secondary ring-2 ring-secondary/30" : "border-glass-border",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground capitalize">{region}</p>
                        <p className="text-xs text-muted-foreground">Low latency</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border border-primary/30">Active</Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="glass-card flex-1 p-6 border border-secondary/20 bg-gradient-to-br from-[#1a1f35] via-[#141a2d] to-[#111827]">
            <p className="text-xs text-muted-foreground">Network reachability</p>
            <h4 className="text-lg font-semibold text-foreground mb-4">CoreNodeX global mesh</h4>
            <div className="relative h-56 w-full rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 overflow-hidden border border-glass-border">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(0,229,255,0.3), transparent 25%), radial-gradient(circle at 70% 40%, rgba(154,77,255,0.25), transparent 30%), radial-gradient(circle at 40% 70%, rgba(30,229,201,0.28), transparent 30%)",
                }}
              />
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-3">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 mx-auto my-auto shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-4 py-2 rounded-full bg-black/40 border border-primary/30 text-xs text-primary backdrop-blur">
                  Any-to-any 10Gbps blend
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 3 — LIVE INVENTORY</p>
            <h3 className="text-2xl font-orbitron font-bold text-foreground">
              Available servers in {selectedRegion || "region"}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Available
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Sold Out
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-glass-border">
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Loading inventory…</div>
          ) : error && !effectiveInventory.length ? (
            <ErrorState retry={loadInventory} />
          ) : !serversInRegion.length ? (
            <EmptyState message="No servers found for this region." />
          ) : (
            <div className="overflow-hidden">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="border-b border-glass-border">
                    <TableHead>CPU Model</TableHead>
                    <TableHead>RAM</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredServers.length ? filteredServers : serversInRegion).map((server) => {
                    const isSoldOut = server.status === "sold-out";
                    return (
                      <TableRow
                        key={server.id}
                        className={cn("border-b border-glass-border transition-all duration-200", isSoldOut ? "opacity-60" : "")}
                      >
                        <TableCell className="font-semibold text-foreground">{server.cpu}</TableCell>
                        <TableCell className="text-muted-foreground">{server.ramGb} GB</TableCell>
                        <TableCell className="text-muted-foreground">{server.storage}</TableCell>
                        <TableCell className="text-muted-foreground capitalize">{server.region}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          {typeof server.priceMonthly === "number" ? priceFormatter.format(server.priceMonthly) : "-"}
                        </TableCell>
                        <TableCell>
                          {isSoldOut ? (
                            <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">Out of Stock</Badge>
                          ) : (
                            <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isSoldOut ? (
                            <Button variant="outline" className="border-rose-400/40 text-rose-200">
                              Get Notified
                            </Button>
                          ) : (
                            <Button className={gradientButton}>Purchase</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Enterprise-grade security</p>
              <p className="text-xs text-muted-foreground">DDOS protection and hardened control plane.</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <Zap className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Instant activation</p>
              <p className="text-xs text-muted-foreground">Deploy in minutes with automated imaging.</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Global reach</p>
              <p className="text-xs text-muted-foreground">Strategic metros with 10Gbps blend.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

function SkeletonLoader() {
  return <div className="glass-card p-8 rounded-2xl border border-glass-border">Loading inventory…</div>;
}

function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="glass-card p-8 rounded-2xl border border-rose-400/50 text-center space-y-3">
      <p className="text-rose-200">Unable to load inventory. Please try again.</p>
      <Button onClick={retry} variant="outline" className="border-rose-400/40 text-rose-200">
        Retry
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card border border-dashed border-glass-border rounded-2xl p-8 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <MapPin className="w-6 h-6" />
      </div>
      <h4 className="text-xl font-semibold text-foreground">{message}</h4>
      <p className="text-muted-foreground">Try another NodeX Metal tier or region.</p>
      <Button variant="outline" className="border-primary/30 text-primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Browse other regions
      </Button>
    </div>
  );
}
