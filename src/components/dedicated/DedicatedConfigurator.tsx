import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Crown, Rocket, Gauge, MapPin, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type InventoryServer = {
  rs_id?: string | number;
  productId?: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  bandwidth?: string;
  location?: string;
  region?: string;
  status?: "available" | "soldout" | string;
  cnx_price?: number;
  family?: string;
  name?: string;
  details?: string;
  stock?: number;
  price?: {
    monthly?: string;
    yearly?: string;
  };
};

type InventoryResponse = {
  family?: string | null;
  region?: string | null;
  servers: InventoryServer[];
};

type TierId = "core" | "elite" | "creator";

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
  core: {
    cpuFamily: "Intel Xeon E5",
    clock: "2.3GHz",
    geekbench: "8000",
    pricePerGb: "$1.50",
    markup: "10%",
    description: "Balanced performance for general workloads.",
  },
  elite: {
    cpuFamily: "AMD EPYC",
    clock: "2.8GHz",
    geekbench: "12000",
    pricePerGb: "$1.20",
    markup: "8%",
    description: "High performance for demanding applications.",
  },
  creator: {
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
  { id: "core", name: "Core", descriptor: "Balanced performance", icon: Cpu, border: "border-cyan-400", accent: "from-cyan-400/30 to-cyan-200/10", badgeClass: "text-cyan-400" },
  { id: "elite", name: "Elite", descriptor: "High performance", icon: Rocket, border: "border-violet-400", accent: "from-violet-400/30 to-violet-200/10", badgeClass: "text-violet-400" },
  { id: "creator", name: "Creator", descriptor: "Top-tier performance", icon: Crown, border: "border-amber-400", accent: "from-amber-400/30 to-amber-200/10", badgeClass: "text-amber-400" },
];

const regionCards = [
  { id: "MIAMI", name: "Miami", flag: "🇺🇸" },
  { id: "LONDON", name: "London", flag: "🇬🇧" },
  { id: "FRANKFURT", name: "Frankfurt", flag: "🇩🇪" },
];

const regionMatchers: Record<string, RegExp[]> = {
  MIAMI: [/miami/i, /us/i, /usa/i, /united states/i],
  LONDON: [/london/i, /uk/i, /united kingdom/i],
  FRANKFURT: [/frankfurt/i, /germany/i, /de/i],
};

function resolveRegion(location?: string) {
  const normalized = (location || "").toString();
  const match = Object.entries(regionMatchers).find(([, patterns]) => patterns.some((p) => p.test(normalized)));
  return (match?.[0] as string) || "MIAMI";
}

type RegionStat = {
  label: string;
  total: number;
  available: number;
  flag?: string;
};

function summarizeByRegion(servers: InventoryServer[]): Record<string, RegionStat> {
  return regionCards.reduce((acc, region) => {
    const scoped = servers.filter((s) => s.region === region.id || s.location === region.name || s.location?.toLowerCase().includes(region.name.toLowerCase()));
    acc[region.id] = {
      label: region.name,
      total: scoped.length,
      available: scoped.filter((s) => s.status === "available").length,
      flag: region.flag,
    } as RegionStat;
    return acc;
  }, {} as Record<string, RegionStat>);
}

export function DedicatedConfigurator() {
  const [servers, setServers] = useState<InventoryServer[]>([]);
  const [inventory, setInventory] = useState<InventoryServer[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierId>("core");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionSummary, setRegionSummary] = useState<Record<string, RegionStat>>({});
  const [tierMeta, setTierMeta] = useState<TierMeta | null>(null);
  const [fromPrices, setFromPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const apiBase = (import.meta.env.VITE_API_BASE || "https://api.corenodex.com").replace(/\/$/, "");

  const hydrateServers = useCallback((payload: InventoryResponse, family: string) => {
    return (payload.servers || []).map((s) => ({ ...s, family: s.family || family, region: s.region || resolveRegion(s.location), status: s.status || (s.stock && s.stock > 0 ? "available" : "soldout") }));
  }, []);

  const requestInventory = useCallback(async (family?: string, region?: string) => {
    const q = new URLSearchParams();
    if (family) q.set("family", family);
    if (region) q.set("region", region);
    const url = `${apiBase}/api/servers.php${q.toString() ? `?${q.toString()}` : ""}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, [apiBase]);

  const preloadTierMinimums = useCallback(async () => {
    try {
      const entries = await Promise.all(tierCards.map(async (t) => {
        try {
          const payload = await requestInventory(t.id);
          const hydrated = hydrateServers(payload, t.id);
          const prices = hydrated.filter((s) => s.status === "available" && typeof s.cnx_price === "number").map((s) => s.cnx_price as number);
          const min = prices.length ? Math.min(...prices) : 0;
          return [t.id, min];
        } catch (e) {
          return [t.id, 0];
        }
      }));
      setFromPrices(Object.fromEntries(entries));
    } catch (e) {
      console.error(e);
    }
  }, [hydrateServers, requestInventory]);

  const fetchRegionSummary = useCallback(async (tier: string) => {
    try {
      const payload = await requestInventory(tier);
      const hydrated = hydrateServers(payload, tier);
      setRegionSummary(summarizeByRegion(hydrated));
      setTierMeta(familyMeta[tier as TierId] || null);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Unable to refresh region availability");
    }
  }, [hydrateServers, requestInventory]);

  const fetchInventory = useCallback(async (tier: string, region?: string | null) => {
    try {
      setLoading(true);
      const payload = await requestInventory(tier, region || undefined);
      const hydrated = hydrateServers(payload, tier);
      const scoped = region ? hydrated.filter((s) => s.region === region) : hydrated;
      setInventory(scoped);
      setTierMeta(familyMeta[tier as TierId] || null);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Unable to load inventory right now.");
    } finally {
      setLoading(false);
    }
  }, [hydrateServers, requestInventory]);

  useEffect(() => {
    mounted.current = true;
    preloadTierMinimums();
    return () => { mounted.current = false; };
  }, [preloadTierMinimums]);

  useEffect(() => { setTierMeta(familyMeta[selectedTier] || null); }, [selectedTier]);
  useEffect(() => { fetchRegionSummary(selectedTier); }, [fetchRegionSummary, selectedTier]);
  useEffect(() => { fetchInventory(selectedTier, selectedRegion); }, [fetchInventory, selectedRegion, selectedTier]);

  const summaryForSelectedRegion = useMemo(() => selectedRegion ? regionSummary[selectedRegion] : undefined, [regionSummary, selectedRegion]);

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
                  <button key={tier.id} className={cn('relative glass-card text-left p-4 rounded-2xl border transition-all duration-300','hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,229,255,0.15)]',isSelected ? `${tier.border} ring-2 ring-primary/40` : 'border-glass-border',)} onClick={() => setSelectedTier(tier.id)}>
                    <div className={cn('absolute inset-0 rounded-2xl opacity-70 bg-gradient-to-br', tier.accent)} />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className={cn('text-sm font-semibold uppercase tracking-wide', tier.badgeClass)}>{tier.name}</p>
                        <p className="text-sm text-muted-foreground font-inter">{tier.descriptor}</p>
                        <p className="text-lg font-semibold text-foreground">From {price > 0 ? priceFormatter.format(price) : 'Loading…'}<span className="text-xs text-muted-foreground ml-2">/mo</span></p>
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
                <h3 className="text-xl font-bold text-foreground">{tierMeta?.cpuFamily || '—'}</h3>
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
                <Badge className="bg-secondary/15 text-secondary border border-secondary/30">{summaryForSelectedRegion.available} of {summaryForSelectedRegion.total} available</Badge>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {regionCards.map((region) => {
                const stats = regionSummary[region.id];
                const unavailable = stats && stats.available === 0;
                const isSelected = region.id === selectedRegion;
                return (
                  <button key={region.id} disabled={unavailable} onClick={() => setSelectedRegion(region.id)} className={cn('glass-card p-4 rounded-2xl border text-left transition-all duration-300','hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(138,92,255,0.15)]',isSelected ? 'border-secondary ring-2 ring-secondary/30' : 'border-glass-border',unavailable ? 'opacity-50 cursor-not-allowed' : '',)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{region.flag} {region.name}</p>
                        <p className="text-xs text-muted-foreground">{stats ? `${stats.available} Available Servers` : 'Checking capacity…'}</p>
                      </div>
                      {unavailable ? <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">No Available Servers</Badge> : <Badge className="bg-primary/10 text-primary border border-primary/30">Low latency</Badge>}
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
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-3">{Array.from({ length: 18 }).map((_, idx) => (<span key={idx} className="w-1.5 h-1.5 rounded-full bg-white/40 mx-auto my-auto shadow-[0_0_10px_rgba(0,229,255,0.6)]" />))}</div>
              <div className="absolute inset-0 flex items-center justify-center"><div className="px-4 py-2 rounded-full bg-black/40 border border-primary/30 text-xs text-primary backdrop-blur">Any-to-any 10Gbps blend</div></div>
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
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div><div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Sold Out</div></div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-glass-border">
          {loading ? (<div className="py-10 text-center text-muted-foreground">Loading inventory…</div>) : error ? (<div className="py-10 text-center text-rose-300">{error}</div>) : inventory.length === 0 ? (<EmptyInventoryCard />) : (
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
                      <TableRow key={server.rs_id || server.productId} className={cn('border-b border-glass-border transition-all duration-200', isSoldOut ? 'opacity-60' : '')}>
                        <TableCell className="font-semibold text-foreground">{server.cpu}</TableCell>
                        <TableCell className="text-muted-foreground">{server.ram}</TableCell>
                        <TableCell className="text-muted-foreground">{server.storage}</TableCell>
                        <TableCell className="text-muted-foreground">{server.bandwidth}</TableCell>
                        <TableCell className="text-muted-foreground">{server.location}</TableCell>
                        <TableCell className="font-semibold text-primary">{typeof server.cnx_price === 'number' ? priceFormatter.format(server.cnx_price) : '-'}</TableCell>
                        <TableCell>{isSoldOut ? <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">Out of Stock</Badge> : <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">Available</Badge>}</TableCell>
                        <TableCell className="text-right">{isSoldOut ? <Button variant="outline" className="border-rose-400/40 text-rose-200">Get Notified</Button> : <Button className={gradientButton}>Purchase</Button>}</TableCell>
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
      <Button variant="outline" className="border-primary/30 text-primary">Browse other regions</Button>
    </div>
  );
}

        <h4 className="text-xl font-semibold text-foreground">No Servers Available in This Region</h4>
        <p className="text-muted-foreground">Try another NodeX Metal tier or region.</p>
        <Button variant="outline" className="border-primary/30 text-primary">Browse other regions</Button>
      </div>
    );
  }
