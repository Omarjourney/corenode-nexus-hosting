import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Cpu, Gauge, MapPin, ShieldCheck, Zap } from "lucide-react";

type InventoryModel = {
  id: string;
  cpu: string;
  clock: string;
  ram: string;
  bandwidth: string;
  price: number;
  available: boolean;
};

type InventoryFamily = {
  id: string;
  label: string;
  models: InventoryModel[];
};

type InventoryRegion = {
  id: string;
  name: string;
  families: InventoryFamily[];
};

type InventoryResponse = {
  regions: InventoryRegion[];
};

type FlattenedModel = InventoryModel & {
  regionId: string;
  regionName: string;
  familyId: string;
  familyLabel: string;
};

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const gradientButton =
  "bg-[linear-gradient(135deg,#00E5FF_0%,#8B5CF6_50%,#1EE5C9_100%)] text-slate-900 hover:brightness-110";

const familyIcons: Record<string, any> = {
  default: Cpu,
};

const defaultFamilyMeta = {
  cpuFamily: "Performance optimized",
  clock: "Up to 4.0GHz",
  description: "Balanced performance for demanding workloads.",
};

async function fetchInventory(url: string): Promise<InventoryResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = (await response.json()) as InventoryResponse;
  const regions = Array.isArray(data.regions) ? data.regions : [];
  return { regions };
}

function formatRegionName(region: string) {
  return region
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DedicatedConfigurator() {
  const [inventory, setInventory] = useState<InventoryResponse>({ regions: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showSoldOut, setShowSoldOut] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const live = await fetchInventory("/api/dedicated/inventory");
        if (isMounted) {
          setInventory(live);
        }
      } catch (primaryError) {
        console.error("Failed to load live inventory, using static fallback", primaryError);
        try {
          const fallback = await fetchInventory("/data/static-inventory.json");
          if (isMounted) {
            setInventory(fallback);
            setError((primaryError as Error).message);
          }
        } catch (fallbackError) {
          console.error("Unable to load fallback inventory", fallbackError);
          if (isMounted) {
            setInventory({ regions: [] });
            setError((fallbackError as Error).message);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const regions = useMemo(() => inventory.regions.filter(Boolean), [inventory.regions]);

  useEffect(() => {
    if (!regions.length) {
      setSelectedRegion("");
      return;
    }
    const existing = regions.find((region) => region.id === selectedRegion);
    if (!existing) {
      setSelectedRegion(regions[0].id);
    }
  }, [regions, selectedRegion]);

  const selectedRegionData = useMemo(
    () => regions.find((region) => region.id === selectedRegion) ?? regions[0] ?? null,
    [regions, selectedRegion],
  );

  const families = useMemo(() => {
    const familyMap = new Map<string, { id: string; label: string }>();
    regions.forEach((region) => {
      region.families?.forEach((family) => {
        if (!familyMap.has(family.id)) {
          familyMap.set(family.id, { id: family.id, label: family.label });
        }
      });
    });
    return Array.from(familyMap.values());
  }, [regions]);

  const familiesForRegion = useMemo(() => selectedRegionData?.families ?? [], [selectedRegionData]);

  useEffect(() => {
    if (!familiesForRegion.length) {
      setSelectedFamily("");
      return;
    }
    const exists = familiesForRegion.find((family) => family.id === selectedFamily);
    if (!exists) {
      setSelectedFamily(familiesForRegion[0].id);
    }
  }, [familiesForRegion, selectedFamily]);

  const tierPrices = useMemo(() => {
    return families.reduce((acc, family) => {
      const prices: number[] = [];
      regions.forEach((region) => {
        region.families
          ?.filter((f) => f.id === family.id)
          .forEach((fam) => fam.models?.forEach((model) => prices.push(model.price)));
      });
      acc[family.id] = prices.length ? Math.min(...prices) : null;
      return acc;
    }, {} as Record<string, number | null>);
  }, [families, regions]);

  const flattenedModels: FlattenedModel[] = useMemo(() => {
    if (!selectedRegionData) return [];
    const familiesScope = selectedFamily
      ? selectedRegionData.families.filter((fam) => fam.id === selectedFamily)
      : selectedRegionData.families;

    return familiesScope.flatMap((family) =>
      (family.models || []).map((model) => ({
        ...model,
        regionId: selectedRegionData.id,
        regionName: selectedRegionData.name,
        familyId: family.id,
        familyLabel: family.label,
      })),
    );
  }, [selectedFamily, selectedRegionData]);

  const filteredModels = useMemo(
    () => flattenedModels.filter((model) => (showSoldOut ? true : model.available)),
    [flattenedModels, showSoldOut],
  );

  const selectedFamilyInfo = useMemo(
    () => families.find((family) => family.id === selectedFamily) || null,
    [families, selectedFamily],
  );

  const hasInventory = regions.some((region) => region.families?.some((family) => family.models?.length));

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
              {families.length === 0 ? (
                <div className="text-sm text-muted-foreground">No families available.</div>
              ) : (
                families.map((family) => {
                  const Icon = familyIcons[family.id] ?? familyIcons.default;
                  const isSelected = family.id === selectedFamily;
                  const price = tierPrices[family.id];
                  const priceLabel = isLoading
                    ? "Loading…"
                    : price !== null
                      ? `${priceFormatter.format(price)}`
                      : "Pricing unavailable";
                  const meta = { ...defaultFamilyMeta, cpuFamily: family.label };
                  return (
                    <button
                      key={family.id}
                      className={cn(
                        "relative glass-card text-left p-4 rounded-2xl border transition-all duration-300",
                        "hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(0,229,255,0.15)]",
                        isSelected ? "border-primary ring-2 ring-primary/40" : "border-glass-border",
                      )}
                      onClick={() => setSelectedFamily(family.id)}
                      disabled={!familiesForRegion.some((fam) => fam.id === family.id)}
                    >
                      <div className="absolute inset-0 rounded-2xl opacity-70 bg-gradient-to-br from-primary/10 to-secondary/10" />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{family.label}</p>
                          <p className="text-sm text-muted-foreground font-inter">{meta.description}</p>
                          <p className="text-lg font-semibold text-foreground">
                            From {priceLabel} <span className="text-xs text-muted-foreground ml-2">/mo</span>
                          </p>
                        </div>
                        <span
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border",
                            isSelected ? "border-primary" : "border-glass-border",
                          )}
                        >
                          <Icon className="w-6 h-6 text-primary" />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <Card className="glass-card flex-1 lg:max-w-md p-6 border border-primary/20 bg-[#1A243A]/70 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Service Details</p>
                <h3 className="text-xl font-bold text-foreground">{selectedFamilyInfo?.label || "—"}</h3>
              </div>
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            {selectedFamilyInfo ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <DetailRow label="CPU Family" value={selectedFamilyInfo.label} />
                <DetailRow label="Clock Speed" value={defaultFamilyMeta.clock} />
                <p className="text-foreground/90 leading-relaxed pt-1">{defaultFamilyMeta.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">{isLoading ? "Loading details…" : "No family selected."}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {regions.length === 0 && hasInventory === false ? (
                <div className="text-muted-foreground text-sm">No regions available yet.</div>
              ) : (
                regions.map((region) => {
                  const isSelected = region.id === selectedRegion;
                  const familiesCount = region.families?.length || 0;
                  return (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(region.id)}
                      className={cn(
                        "glass-card p-4 rounded-2xl border text-left transition-all duration-300",
                        "hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(138,92,255,0.15)]",
                        isSelected ? "border-secondary ring-2 ring-secondary/30" : "border-glass-border",
                      )}
                      disabled={!familiesCount}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground capitalize">{formatRegionName(region.name || region.id)}</p>
                          <p className="text-xs text-muted-foreground">{familiesCount} family options.</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border border-primary/30">{familiesCount ? "Available" : "Coming Soon"}</Badge>
                      </div>
                    </button>
                  );
                })
              )}
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
                  Live edge fabric
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-orbitron tracking-[0.2em] text-primary">STEP 3 — CONFIGURE</p>
              <h3 className="text-2xl font-orbitron font-bold text-foreground">Select Server</h3>
              {error && <p className="text-xs text-amber-400 mt-1">{error}</p>}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Available
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Sold Out
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary"
                onClick={() => setShowSoldOut((prev) => !prev)}
                disabled={!flattenedModels.length}
              >
                {showSoldOut ? "Hide sold out" : "Show sold out"}
              </Button>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-glass-border">
            {isLoading && <div className="py-2 text-xs text-muted-foreground">Syncing live inventory…</div>}
            {!hasInventory && !isLoading ? (
              <div className="py-6 text-sm text-center text-muted-foreground">Inventory sources are temporarily unavailable.</div>
            ) : filteredModels.length === 0 && hasInventory ? (
              <EmptyState message="No servers match this tier/region yet—try another region or tier." />
            ) : (
              <div className="overflow-hidden">
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-glass-border">
                      <TableHead>CPU Model</TableHead>
                      <TableHead>Clock</TableHead>
                      <TableHead>RAM</TableHead>
                      <TableHead>Bandwidth</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.map((model) => (
                      <TableRow key={`${model.regionId}-${model.familyId}-${model.id}`} className="border-b border-glass-border transition-all duration-200">
                        <TableCell className="font-semibold text-foreground">{model.cpu}</TableCell>
                        <TableCell className="text-muted-foreground">{model.clock}</TableCell>
                        <TableCell className="text-muted-foreground">{model.ram}</TableCell>
                        <TableCell className="text-muted-foreground">{model.bandwidth}</TableCell>
                        <TableCell className="font-semibold text-primary">{priceFormatter.format(model.price)}</TableCell>
                        <TableCell>
                          {model.available ? (
                            <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">Available</Badge>
                          ) : (
                            <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">Sold Out</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button className={gradientButton} disabled={!model.available}>
                            {model.available ? "Purchase" : "Notify"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
