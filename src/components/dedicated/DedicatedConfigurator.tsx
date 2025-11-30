import { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Crown, Gauge, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

type ApiServer = {
  productId: string;
  region: string;
  name: string;
  details: string;
  stock: number;
  price: {
    monthly: string;
    sixMonth?: string;
    yearly: string;
    twoYear?: string;
  };
};

// Removed duplicate DedicatedConfigurator component to resolve duplicate identifier error.
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
  const [selectedTier, setSelectedTier] = useState<TierId>("CORE");
  const [selectedRegion, setSelectedRegion] = useState<RegionId>("");
  const [regionData, setRegionData] = useState<RegionStat[]>([]);
  const [fullServerData, setFullServerData] = useState<ApiServer[]>([]);
  const [loading, setLoading] = useState(true);
  const autoSelected = useRef(false);

  const servers = staticServers;

  useEffect(() => {
    fetch(`${API_BASE}/dedicatedServers.php`)
      .then((r) => r.json())
      .then((data) => {
        const servers = (data?.servers ?? []) as ApiServer[];
        const regions = Array.from(new Set(servers.map((s) => s.region)));
        const regionStats = buildRegions(servers);
        setRegionData(regionStats);
        setSelectedRegion(regions[0] || regionStats[0]?.code || "");
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

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading inventory...</p>
            ) : fullServerData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No servers available</p>
            ) : (
              regionData.map((r) => (
                <div
                  key={r.code}
                  className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0"
                >
                  <span>
                    {r.flag} {r.name}
                  </span>

                  <span className="flex items-center gap-2 text-sm">
                    <span>{r.available} servers</span>
                    {typeof r.cheapestMonthly === "number" ? (
                      <span className="text-muted-foreground text-xs">from ${r.cheapestMonthly}/mo</span>
                    ) : null}
                  </span>
                </div>
              ))
            )}
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
