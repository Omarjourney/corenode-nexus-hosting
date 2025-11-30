import { useCallback, useEffect, useMemo, useState } from "react";
import { Cpu, Crown, Gauge, MapPin, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const tierCards = [
  {
    id: "BASIC",
    name: "NodeX Metal Basic™",
    descriptor: "Budget-friendly Xeon and EPYC nodes",
    accent: "from-cyan-400/25 via-cyan-500/10 to-transparent",
    border: "border-cyan-400/40",
    icon: Cpu,
    badgeClass: "text-cyan-300",
  },
  {
    id: "CORE",
    name: "NodeX Metal Core™",
    descriptor: "Mainstream Xeon / EPYC performance",
    accent: "from-cyan-300/30 via-cyan-400/20 to-transparent",
    border: "border-cyan-300/60",
    icon: Rocket,
    badgeClass: "text-cyan-200",
  },
  {
    id: "ULTRA",
    name: "NodeX Metal Ultra™",
    descriptor: "Premium Gold-series throughput",
    accent: "from-amber-300/30 via-amber-400/10 to-transparent",
    border: "border-amber-300/70",
    icon: Crown,
    badgeClass: "text-amber-200",
  },
  {
    id: "TITAN",
    name: "NodeX Metal Titan™",
    descriptor: "Extreme dual-socket density",
    accent: "from-fuchsia-400/30 via-purple-500/10 to-transparent",
    border: "border-purple-400/70",
    icon: ShieldCheck,
    badgeClass: "text-purple-200",
  },
  {
    id: "VELOCITY",
    name: "NodeX Metal Velocity™",
    descriptor: "Ryzen-tuned for low latency",
    accent: "from-orange-400/30 via-orange-500/15 to-transparent",
    border: "border-orange-400/70",
    icon: Zap,
    badgeClass: "text-orange-200",
  },
] as const;

const regionCards = [
  { id: "MIAMI", name: "Miami, FL", flag: "🇺🇸" },
  { id: "LOSANGELES", name: "Los Angeles, CA", flag: "🇺🇸" },
  { id: "NUREMBERG", name: "Nuremberg, DE", flag: "🇩🇪" },
  { id: "JOHOR", name: "Johor, MY", flag: "🇲🇾" },
  { id: "KANSASCITY", name: "Kansas City, MO", flag: "🇺🇸" },
] as const;

const regionMatchers: Record<(typeof regionCards)[number]["id"], RegExp[]> = {
  MIAMI: [/miami/i, /fl/],
  LOSANGELES: [/los\s*angeles/i, /la,/i, /california/i],
  NUREMBERG: [/nuremberg/i, /de\b/i],
  JOHOR: [/johor/i, /my\b/i, /malaysia/i],
  KANSASCITY: [/kansas\s*city/i, /mo\b/i],
};

const familyMeta: Record<(typeof tierCards)[number]["id"], TierMeta> = {
  BASIC: {
    cpuFamily: "Xeon E3 / early Silver",
    clock: "3.0 – 3.4 GHz base",
    geekbench: "700 – 1200",
    pricePerGb: "$0.38 / GB",
    markup: "38%",
    description:
      "Perfect for entry workloads, remote labs, and staging pipelines that value price over peak clocks.",
  },
  CORE: {
    cpuFamily: "Xeon E-22xx & Silver 42xx",
    clock: "3.5 – 4.0 GHz boost",
    geekbench: "1200 – 1900",
    pricePerGb: "$0.45 / GB",
    markup: "45%",
    description:
      "Mainstream Xeon and EPYC performance for production web stacks, SaaS, and control planes.",
  },
  ULTRA: {
    cpuFamily: "Xeon Gold 62xx/63xx",
    clock: "3.2 – 3.8 GHz boost",
    geekbench: "1900 – 2600",
    pricePerGb: "$0.52 / GB",
    markup: "52%",
    description:
      "High-core count, NVMe-first compute tuned for analytics, streaming, and busy multi-tenant nodes.",
  },
  TITAN: {
    cpuFamily: "Dual Xeon Gold / Platinum",
    clock: "3.0 – 3.6 GHz boost",
    geekbench: "2400 – 3200",
    pricePerGb: "$0.60 / GB",
    markup: "60%",
    description:
      "Extreme throughput for virtualization clusters, render farms, and enterprise-grade failover.",
  },
  VELOCITY: {
    cpuFamily: "Ryzen 7000 / 5000 series",
    clock: "4.5 – 5.7 GHz boost",
    geekbench: "2200 – 3400",
    pricePerGb: "$0.55 / GB",
    markup: "55%",
    description:
      "Latency-sensitive Ryzen and EPYC Milan-X silicon for game panels, edge services, and bursty APIs.",
  },
};

interface InventoryServer {
  rs_id: string;
  family: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  location: string;
  cnx_price: number;
  base_price: number;
  status: "available" | "soldout";
  region?: string;
}

interface RegionStat {
  label: string;
  total: number;
  available: number;
  flag?: string;
}

interface TierMeta {
  cpuFamily: string;
  clock: string;
  geekbench: string;
  pricePerGb: string;
  markup: string;
  description: string;
}

interface InventoryResponse {
  family?: string | null;
  region?: string | null;
  servers: InventoryServer[];
}

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

const gradientButton =
  "bg-[linear-gradient(135deg,#00E5FF_0%,#8B5CF6_50%,#1EE5C9_100%)] text-slate-900 hover:brightness-110";

function resolveRegion(location: string): (typeof regionCards)[number]["id"] {
  const normalizedLocation = location || "";
  const match = Object.entries(regionMatchers).find(([, patterns]) =>
    patterns.some((pattern) => pattern.test(normalizedLocation)),
  );
  return (match?.[0] as (typeof regionCards)[number]["id"]) || "MIAMI";
}

function summarizeByRegion(servers: InventoryServer[]): Record<string, RegionStat> {
  return regionCards.reduce((acc, region) => {
    const scoped = servers.filter((server) => server.region === region.id);
    acc[region.id] = {
      label: region.name,
      total: scoped.length,
      available: scoped.filter((srv) => srv.status === "available").length,
      flag: region.flag,
    } as RegionStat;
    return acc;
  }, {} as Record<string, RegionStat>);
}

export function DedicatedConfigurator() {
  const [selectedTier, setSelectedTier] = useState<(typeof tierCards)[number]["id"]>("CORE");
  const [selectedRegion, setSelectedRegion] = useState<(typeof regionCards)[number]["id"]>("MIAMI");
  const [inventory, setInventory] = useState<InventoryServer[]>([]);
  const [tierMeta, setTierMeta] = useState<TierMeta | null>(null);
  const [regionSummary, setRegionSummary] = useState<Record<string, RegionStat>>({});
  const [fromPrices, setFromPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTierCard = useMemo(() => tierCards.find((card) => card.id === selectedTier), [selectedTier]);

  const apiBase = 'https://api.corenodex.com/api';

  const hydrateServers = useCallback(
    (payload: InventoryResponse, family: string): InventoryServer[] =>
      (payload.servers || []).map((server) => {
        const resolvedRegion = resolveRegion(server.location);
        return {
          ...server,
          family: server.family || family,
          region: resolvedRegion,
          status: server.status === 'soldout' ? 'soldout' : 'available',
        };
      }),
    [],
  );

  const requestInventory = useCallback(
    async (family: string, region?: string): Promise<InventoryResponse> => {
      const query = new URLSearchParams();
      if (family) query.set('family', family);
      if (region) query.set('region', region);

      const url = `${apiBase}/servers.php${query.toString() ? `?${query.toString()}` : ''}`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        throw new Error('Failed to load inventory');
      }
      return response.json();
    },
    [apiBase],
  );

  const preloadTierMinimums = useCallback(async () => {
    const entries = await Promise.all(
      tierCards.map(async (tier) => {
        try {
          const payload = await requestInventory(tier.id);
          const hydrated = hydrateServers(payload, tier.id);
          const availablePrices = hydrated
            .filter((server) => server.status === 'available')
            .map((server) => server.cnx_price);
          const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : hydrated[0]?.cnx_price || 0;
          return [tier.id, minPrice];
        } catch (err) {
          console.error('[CNX] Failed to prefetch tier pricing', err);
          return [tier.id, 0];
        }
      }),
    );
    setFromPrices(Object.fromEntries(entries));
  }, [hydrateServers, requestInventory]);

  const fetchRegionSummary = useCallback(
    async (tier: string) => {
      try {
        const payload = await requestInventory(tier);
        const hydrated = hydrateServers(payload, tier);
        setRegionSummary(summarizeByRegion(hydrated));
        setTierMeta(familyMeta[tier as keyof typeof familyMeta]);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to refresh region availability');
      }
    },
    [hydrateServers, requestInventory],
  );

  const fetchInventory = useCallback(
    async (tier: string, region: string) => {
      try {
        setLoading(true);
        const payload = await requestInventory(tier, region);
        const hydrated = hydrateServers(payload, tier);
        const scoped = region ? hydrated.filter((server) => server.region === region) : hydrated;
        setInventory(scoped);
        setTierMeta(familyMeta[tier as keyof typeof familyMeta]);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load inventory right now.');
      } finally {
        setLoading(false);
      }
    },
    [hydrateServers, requestInventory],
  );

  useEffect(() => {
    preloadTierMinimums();
  }, [preloadTierMinimums]);

  useEffect(() => {
    setTierMeta(familyMeta[selectedTier]);
  }, [selectedTier]);

  useEffect(() => {
    fetchRegionSummary(selectedTier);
  }, [fetchRegionSummary, selectedTier]);

  useEffect(() => {
    fetchInventory(selectedTier, selectedRegion);
  }, [fetchInventory, selectedRegion, selectedTier]);

  const summaryForSelectedRegion = useMemo(() => regionSummary[selectedRegion], [regionSummary, selectedRegion]);

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
                const price = fromPrices[tier.id] || 0;
                return (
                  <button
                    key={tier.id}
                    className={cn(
                      'relative glass-card text-left p-4 rounded-2xl border transition-all duration-300',
                      'hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,229,255,0.15)]',
                      isSelected ? `${tier.border} ring-2 ring-primary/40` : 'border-glass-border',
                    )}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className={cn('absolute inset-0 rounded-2xl opacity-70 bg-gradient-to-br', tier.accent)} />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className={cn('text-sm font-semibold uppercase tracking-wide', tier.badgeClass)}>{tier.name}</p>
                        <p className="text-sm text-muted-foreground font-inter">{tier.descriptor}</p>
                        <p className="text-lg font-semibold text-foreground">
                          From {price > 0 ? priceFormatter.format(price) : 'Loading…'}
                          <span className="text-xs text-muted-foreground ml-2">/mo</span>
                        </p>
                      </div>
                      <span className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border', tier.border)}>
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
                <h3 className="text-xl font-bold text-foreground">{selectedTierCard?.name}</h3>
              </div>
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            {tierMeta ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <DetailRow label="CPU Family" value={tierMeta.cpuFamily} />
                <DetailRow label="Clock Speed" value={tierMeta.clock} />
                <DetailRow label="Geekbench" value={tierMeta.geekbench} />
                <DetailRow label="Price per GB" value={tierMeta.pricePerGb} />
                <DetailRow label="CNX Markup" value={tierMeta.markup} />
                <p className="text-foreground/90 leading-relaxed pt-1">{tierMeta.description}</p>
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
              {summaryForSelectedRegion ? (
                <Badge className="bg-secondary/15 text-secondary border border-secondary/30">
                  {summaryForSelectedRegion.available} of {summaryForSelectedRegion.total} available
                </Badge>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {regionCards.map((region) => {
                const stats = regionSummary[region.id];
                const unavailable = stats && stats.available === 0;
                const isSelected = region.id === selectedRegion;
                return (
                  <button
                    key={region.id}
                    disabled={unavailable}
                    onClick={() => setSelectedRegion(region.id)}
                    className={cn(
                      'glass-card p-4 rounded-2xl border text-left transition-all duration-300',
                      'hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(138,92,255,0.15)]',
                      isSelected ? 'border-secondary ring-2 ring-secondary/30' : 'border-glass-border',
                      unavailable ? 'opacity-50 cursor-not-allowed' : '',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {region.flag} {region.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats ? `${stats.available} Available Servers` : 'Checking capacity…'}
                        </p>
                      </div>
                      {unavailable ? (
                        <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">No Available Servers</Badge>
                      ) : (
                        <Badge className="bg-primary/10 text-primary border border-primary/30">Low latency</Badge>
                      )}
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
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0,229,255,0.3), transparent 25%), radial-gradient(circle at 70% 40%, rgba(154,77,255,0.25), transparent 30%), radial-gradient(circle at 40% 70%, rgba(30,229,201,0.28), transparent 30%)' }} />
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
            <h3 className="text-2xl font-orbitron font-bold text-foreground">Available servers in {summaryForSelectedRegion?.label || 'region'}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Sold Out</div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-glass-border">
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">Loading inventory…</div>
          ) : error ? (
            <div className="py-10 text-center text-rose-300">{error}</div>
          ) : inventory.length === 0 ? (
            <EmptyInventoryCard />
          ) : (
            <div className="overflow-hidden">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="border-b border-glass-border">
                    <TableHead>CPU Model</TableHead>
                    <TableHead>RAM</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Bandwidth</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>CNX Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((server) => {
                    const isSoldOut = server.status === 'soldout';
                    return (
                      <TableRow
                        key={server.rs_id}
                        className={cn(
                          'border-b border-glass-border transition-all duration-200',
                          'hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(0,229,255,0.12)]',
                          isSoldOut ? 'opacity-60' : '',
                        )}
                      >
                        <TableCell className="font-semibold text-foreground">{server.cpu}</TableCell>
                        <TableCell className="text-muted-foreground">{server.ram}</TableCell>
                        <TableCell className="text-muted-foreground">{server.storage}</TableCell>
                        <TableCell className="text-muted-foreground">{server.bandwidth}</TableCell>
                        <TableCell className="text-muted-foreground">{server.location}</TableCell>
                        <TableCell className="font-semibold text-primary">{priceFormatter.format(server.cnx_price)}</TableCell>
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

function EmptyInventoryCard() {
  return (
    <div className="glass-card border border-dashed border-glass-border rounded-2xl p-8 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <MapPin className="w-6 h-6" />
      </div>
      <h4 className="text-xl font-semibold text-foreground">No Servers Available in This Region</h4>
      <p className="text-muted-foreground">Try another NodeX Metal tier or region.</p>
      <Button variant="outline" className="border-primary/30 text-primary">
        Browse other regions
      </Button>
    </div>
  );
}
