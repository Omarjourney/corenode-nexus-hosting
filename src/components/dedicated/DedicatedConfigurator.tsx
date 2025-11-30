import { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Crown, Gauge, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type TierId = (typeof tierCards)[number]["id"];
type RegionId = string;

interface RegionStat {
  code: string;
  name: string;
  flag?: string;
  available: number;
  soldOut: boolean;
  stockPercent?: number;
  loadPercent?: number;
  level?: string;
}

interface ApiServer {
  productId: string;
  name: string;
  details: string;
  region: string;
  price: {
    monthly: number;
  };
  available?: number | boolean;
  availability?: number;
  stock?: number;
  load?: number;
  level?: string;
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

function getAvailableCount(server: ApiServer): number {
  if (typeof server.available === "number") return server.available;
  if (typeof server.availability === "number") return server.availability;
  if (typeof server.stock === "number") return server.stock;
  if (typeof server.available === "boolean") return server.available ? 1 : 0;
  return 0;
}

function buildRegions(servers: ApiServer[]): RegionStat[] {
  const regionMap = new Map<string, RegionStat>();

  servers.forEach((server) => {
    const count = getAvailableCount(server);
    const existing = regionMap.get(server.region);

    if (existing) {
      existing.available += count;
      existing.stockPercent = existing.stockPercent ?? server.stock;
      existing.loadPercent = existing.loadPercent ?? server.load;
      existing.level = existing.level ?? server.level;
      existing.flag = existing.flag ?? server.flag;
    } else {
      regionMap.set(server.region, {
        code: server.region,
        name: server.region,
        flag: server.flag,
        available: count,
        soldOut: false,
        stockPercent: server.stock,
        loadPercent: server.load,
        level: server.level,
      });
    }
  });

  return Array.from(regionMap.values()).map((region) => ({
    ...region,
    soldOut: region.available <= 0,
  }));
}

async function autoDetectBestRegion(regions: RegionStat[]): Promise<string> {
  const results = await Promise.all(
    regions.map(async (r) => {
      const start = performance.now();
      await fetch(`https://api.corenodex.com/ping?region=${r.code}`).catch(() => {});
      const end = performance.now();

      return { region: r.code, ping: end - start };
    }),
  );

  results.sort((a, b) => a.ping - b.ping);
  return results[0]?.region || regions[0]?.code || "";
}

interface DedicatedServer {
  id: string;
  name: string;
  tier: TierId;
  cpu: string;
  ram: string;
  storage: string;
  basePrice: number;
  locations: string[];
  availability: number;
  bandwidth?: string;
}

const staticServers: DedicatedServer[] = [
  {
    id: "basic",
    name: "NodeX Metal Basic™",
    tier: "BASIC",
    cpu: "AMD Ryzen 5600X (6C/12T)",
    ram: "32GB DDR4",
    storage: "2x1TB NVMe RAID1",
    basePrice: 109,
    locations: ["Miami, FL", "Los Angeles, CA"],
    availability: 12,
    bandwidth: "25TB @ 10Gbps",
  },
  {
    id: "core",
    name: "NodeX Metal Core™",
    tier: "CORE",
    cpu: "AMD Ryzen 7600 (6C/12T)",
    ram: "64GB DDR5",
    storage: "2x1TB NVMe RAID1",
    basePrice: 149,
    locations: ["Miami, FL", "Los Angeles, CA", "Nuremberg, DE"],
    availability: 8,
    bandwidth: "25TB @ 10Gbps",
  },
  {
    id: "ultra",
    name: "NodeX Metal Ultra™",
    tier: "ULTRA",
    cpu: "AMD Ryzen 7950X (16C/32T)",
    ram: "128GB DDR5",
    storage: "2x2TB NVMe RAID1",
    basePrice: 199,
    locations: ["Los Angeles, CA", "Nuremberg, DE"],
    availability: 6,
    bandwidth: "25TB @ 10Gbps",
  },
  {
    id: "titan",
    name: "NodeX Metal Titan™",
    tier: "TITAN",
    cpu: "Threadripper Pro 5955WX (16C/32T)",
    ram: "256GB DDR4 ECC",
    storage: "4x4TB NVMe RAID10",
    basePrice: 399,
    locations: ["Los Angeles, CA"],
    availability: 3,
    bandwidth: "25TB @ 10Gbps",
  },
  {
    id: "velocity",
    name: "NodeX Metal Velocity™",
    tier: "VELOCITY",
    cpu: "Dual EPYC 7543P (64C/128T)",
    ram: "512GB DDR4 ECC",
    storage: "8x3.84TB NVMe RAID10",
    basePrice: 599,
    locations: ["Los Angeles, CA", "Johor, MY"],
    availability: 2,
    bandwidth: "25TB @ 10Gbps",
  },
];

const familyMeta: Record<TierId, TierMeta> = {
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

export function DedicatedConfigurator() {
  const [selectedTier, setSelectedTier] = useState<TierId>("CORE");
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("");
  const [regionData, setRegionData] = useState<RegionStat[]>([]);
  const [fullServerData, setFullServerData] = useState<ApiServer[]>([]);
  const [loading, setLoading] = useState(true);
  const autoSelected = useRef(false);

  const servers = staticServers;

  useEffect(() => {
    fetch("https://api.corenodex.com/api/dedicatedServers.php")
      .then((r) => r.json())
      .then((data) => {
        const servers = (data?.servers ?? []) as ApiServer[];
        const regions = buildRegions(servers);
        setRegionData(regions);
        setSelectedRegion(regions[0]?.code || "");
        setFullServerData(servers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function runAutoDetect() {
      if (autoSelected.current || loading || regionData.length === 0) return;
      const best = await autoDetectBestRegion(regionData);
      setSelectedRegion(best);
      autoSelected.current = true;
    }

    runAutoDetect();
  }, [loading, regionData]);

  const getTierPrice = (tierId: string): number =>
    servers.find((server) => server.tier === tierId)?.basePrice ?? 149;
  const tierMeta = useMemo(() => familyMeta[selectedTier], [selectedTier]);

  const summaryForSelectedRegion = useMemo(
    () => regionData.find((region) => region.code === selectedRegion),
    [regionData, selectedRegion],
  );

  const sortedRegions = useMemo(() => {
    const cloned = [...regionData];
    cloned.sort((a, b) => {
      if (a.soldOut && !b.soldOut) return 1;
      if (!a.soldOut && b.soldOut) return -1;
      return (b.available || 0) - (a.available || 0);
    });
    return cloned;
  }, [regionData]);

  const serversInRegion = fullServerData.filter((s) => s.region === selectedRegion);

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
              <Badge className="bg-primary/10 text-primary border border-primary/30">Static pricing</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tierCards.map((tier) => {
                const Icon = tier.icon;
                const isSelected = tier.id === selectedTier;
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
                        <p className="text-lg font-semibold text-foreground">From ${getTierPrice(tier.id)}/mo</p>
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
                <h3 className="text-xl font-bold text-foreground">{familyMeta[selectedTier].cpuFamily}</h3>
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
                  {summaryForSelectedRegion.available} available
                </Badge>
              ) : null}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedRegions.map((region) => {
                  const unavailable = region.soldOut;
                  const isSelected = region.code === selectedRegion;
                  return (
                    <button
                      key={region.code}
                      disabled={unavailable}
                      onClick={() => setSelectedRegion(region.code)}
                      className={cn(
                        "glass-card p-4 border backdrop-blur-md transition rounded-2xl text-left",
                        "hover:border-primary/50 hover:shadow-primary/20 hover:shadow-lg",
                        isSelected ? "border-primary shadow-primary/40" : "border-glass-border",
                        unavailable ? "opacity-40 cursor-not-allowed" : "",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {region.flag} {region.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{region.available} Available Servers</p>
                        </div>
                        {unavailable ? (
                          <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">No Available Servers</Badge>
                        ) : (
                          <Badge className="bg-primary/10 text-primary border border-primary/30">Live latency optimized</Badge>
                        )}
                      </div>
                      {(region.stockPercent || region.loadPercent || region.level) && (
                        <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                          {region.stockPercent !== undefined && (
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-border">
                              Stock {region.stockPercent}%
                            </span>
                          )}
                          {region.loadPercent !== undefined && (
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-border">
                              Load {region.loadPercent}%
                            </span>
                          )}
                          {region.level && (
                            <span className="px-2 py-1 rounded-full bg-white/5 border border-border">{region.level}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="glass-card flex-1 p-6 border border-border">
            <h3 className="font-orbitron text-xl mb-2">Region Insights</h3>

            {regionData.map((r) => (
              <div key={r.code} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                <span>
                  {r.flag} {r.name}
                </span>

                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    r.soldOut ? "bg-red-600/20 text-red-400" : "bg-green-600/20 text-green-400",
                  )}
                >
                  {r.soldOut ? "Sold Out" : `${r.available} Available`}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 3 — LIVE INVENTORY</p>
            <h3 className="text-2xl font-orbitron font-bold text-foreground">Available servers in {summaryForSelectedRegion?.name || 'region'}</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Sold Out</div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-glass-border">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : serversInRegion.length === 0 ? (
            <div className="glass-card p-6 text-center text-muted-foreground mt-6">
              🚫 No servers available in {summaryForSelectedRegion?.name || selectedRegion}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1">
              {serversInRegion.map((server) => (
                <div
                  key={server.productId}
                  className="glass-card p-4 mb-4 flex justify-between items-center border border-border hover:border-primary/40 transition"
                >
                  <div>
                    <p className="font-orbitron text-lg">{server.name}</p>
                    <p
                      className="text-xs text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: server.details }}
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">${server.price.monthly}/mo</p>
                    <button className="btn-primary mt-2 px-4 py-2 rounded glass hover:scale-[1.02] transition">
                      Purchase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-4 animate-pulse border border-border">
      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-muted rounded w-1/3"></div>
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
