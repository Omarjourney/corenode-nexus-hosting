import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Crown, Cpu, Gauge, MapPin, Rocket, ShieldCheck, Zap } from "lucide-react";

type TierId = "CORE" | "ELITE" | "CREATOR";

type UiServer = {
  id: string;
  family: "CORE" | "ELITE" | "CREATOR";
  region: string;
  cpu: string;
  ramGb: number;
  storage: string;
  bandwidth: string;
  priceMonthly: number;
  available: boolean;
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

const STATIC_INVENTORY: UiServer[] = [
  {
    id: "static-1",
    family: "CORE",
    region: "miami",
    cpu: "Ryzen 5600X",
    ramGb: 32,
    storage: "1TB NVMe",
    bandwidth: "20TB",
    priceMonthly: 69,
    available: true,
  },
  {
    id: "static-2",
    family: "ELITE",
    region: "london",
    cpu: "Ryzen 7950X",
    ramGb: 64,
    storage: "2TB NVMe",
    bandwidth: "30TB",
    priceMonthly: 139,
    available: true,
  },
  {
    id: "static-3",
    family: "CREATOR",
    region: "dallas",
    cpu: "Xeon Gold 6338",
    ramGb: 128,
    storage: "2x1.92TB NVMe",
    bandwidth: "40TB",
    priceMonthly: 229,
    available: true,
  },
];

function normalizeFamily(familyInput: any): UiServer["family"] {
  const value = (familyInput || "").toString().toUpperCase();
  if (value.includes("ELITE")) return "ELITE";
  if (value.includes("CREATOR") || value.includes("TITAN")) return "CREATOR";
  if (value.includes("CORE") || value.includes("BASIC") || value.includes("ULTRA")) return "CORE";
  return "CORE";
}

function normalizeRegion(regionInput: any): string {
  const raw = (regionInput || "").toString().trim();
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNumber(value: any): number | null {
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) return asNumber;
  const match = (value || "").toString().match(/([0-9]+(\.[0-9]+)?)/);
  return match ? Number(match[1]) : null;
}

function parseRam(value: any): number {
  return parseNumber(value) ?? 0;
}

function normalizeRawInventory(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.servers)) return raw.servers;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.inventory)) return raw.inventory;
  if (Array.isArray(raw?.items)) return raw.items;
  if (raw && typeof raw === "object") return Object.values(raw);
  return [];
}

function mapReliableToUi(raw: any): UiServer[] {
  return normalizeRawInventory(raw)
    .map((item: any) => {
      const qty = parseNumber(item.qty ?? item.quantity ?? item.stock);
      const availabilityText = (item.availability || item.status || "available").toString().toLowerCase();
      const available = (qty === null || qty > 0) && !availabilityText.includes("sold") && !availabilityText.includes("out");

      const priceMonthly =
        parseNumber(item.cnx_price) ??
        parseNumber(item.price) ??
        parseNumber(item.base_price) ??
        parseNumber(item.price_usd) ??
        parseNumber(item.monthly_price);

      const ramGb = parseRam(item.ram_gb ?? item.memory_gb ?? item.ram ?? item.memory);

      const bandwidthValue = item.bandwidth || item.bandwidth_tb || item.bandwidth_gb;
      const bandwidth = bandwidthValue
        ? typeof bandwidthValue === "number"
          ? `${bandwidthValue}${item.bandwidth_tb ? "TB" : "GB"}`
          : bandwidthValue
        : "Unmetered";

      return {
        id: (item.id || item.rs_id || item.inventory_id || item.InventoryID || `${item.cpu}-${item.location || item.region}`)?.toString(),
        family: normalizeFamily(item.family || item.server_type || item.tier || item.level),
        region: normalizeRegion(item.region || item.location || item.metro || item.datacenter || item.city),
        cpu: item.cpu || item.processor || item.model || "Unknown CPU",
        ramGb,
        storage: item.storage || item.drives || item.disks || item.drive_configuration || "—",
        bandwidth,
        priceMonthly: priceMonthly ?? 0,
        available,
      } as UiServer;
    })
    .filter((server) => server.id && server.region && server.cpu);
}

function getMinPriceForFamily(family: UiServer["family"], inventory: UiServer[]) {
  const prices = inventory.filter((s) => s.family === family && s.available).map((s) => s.priceMonthly);
  if (!prices.length) return null;
  return Math.min(...prices);
}

function getRegionHealthLabel(inventory: UiServer[], region: string) {
  const availableCount = inventory.filter((s) => s.region === region && s.available).length;
  if (availableCount >= 5) return "Good";
  if (availableCount >= 1) return "Limited";
  return "Full";
}

function formatRegionName(region: string) {
  return region
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function DedicatedConfigurator() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uiInventory, setUiInventory] = useState<UiServer[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierId>("CORE");
  const [currentRegion, setCurrentRegion] = useState<string>("");
  const [showSoldOut, setShowSoldOut] = useState<boolean>(false);

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://api.corenodex.com/api/servers.php", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      const mapped = mapReliableToUi(json);
      setUiInventory(mapped);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.error("Unable to load reliable site inventory", err);
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Live inventory sync issue");
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const inventoryToUse: UiServer[] = uiInventory.length > 0 ? uiInventory : STATIC_INVENTORY;

  const showStaticCapacityBanner = !!error && uiInventory.length === 0;

  const regions = useMemo(() => {
    return Array.from(new Set(inventoryToUse.map((i) => i.region).filter(Boolean)));
  }, [inventoryToUse]);

  const selectedRegion = useMemo(() => {
    return regions.includes(currentRegion) ? currentRegion : regions[0] || "";
  }, [currentRegion, regions]);

  const tierPrices = useMemo(() => {
    return {
      CORE: getMinPriceForFamily("CORE", inventoryToUse),
      ELITE: getMinPriceForFamily("ELITE", inventoryToUse),
      CREATOR: getMinPriceForFamily("CREATOR", inventoryToUse),
    } as Record<TierId, number | null>;
  }, [inventoryToUse]);

  const filteredServers = useMemo(() => {
    return inventoryToUse.filter((server) =>
      server.family === selectedTier &&
      server.region === selectedRegion &&
      (showSoldOut ? true : server.available),
    );
  }, [inventoryToUse, selectedRegion, selectedTier, showSoldOut]);

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
                const priceLabel = isLoading
                  ? "Loading…"
                  : price !== null
                    ? `${priceFormatter.format(price)}`
                    : "Pricing unavailable";
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
        {showStaticCapacityBanner && (
          <Alert variant="warning" className="border border-amber-400/40 bg-amber-500/10 text-amber-50">
            <AlertTitle>Live inventory sync issue — showing static fallback.</AlertTitle>
            <AlertDescription>We could not reach the live feed; static capacity is displayed.</AlertDescription>
          </Alert>
        )}
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
              {regions.length === 0 && inventoryToUse.length > 0 ? (
                <div className="text-muted-foreground text-sm">No regions available yet.</div>
              ) : (
                regions.map((region) => {
                  const isSelected = region === selectedRegion;
                  const availabilityLabel = getRegionHealthLabel(inventoryToUse, region);
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
                          <p className="text-sm font-semibold text-foreground capitalize">{formatRegionName(region)}</p>
                          <p className="text-xs text-muted-foreground">High-density metro location.</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border border-primary/30">{availabilityLabel}</Badge>
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
              Available servers in {selectedRegion ? formatRegionName(selectedRegion) : "region"}
            </h3>
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
            >
              {showSoldOut ? "Hide sold out" : "Show sold out"}
            </Button>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-glass-border">
          {isLoading && (
            <div className="py-2 text-xs text-muted-foreground">Syncing live inventory…</div>
          )}
          {!inventoryToUse.length ? (
            <div className="py-6 text-sm text-center text-muted-foreground">Inventory sources are temporarily unavailable.</div>
          ) : filteredServers.length === 0 && inventoryToUse.length > 0 ? (
            <EmptyState message="No servers match this tier/region yet—try another region or tier." />
          ) : (
            <div className="overflow-hidden">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="border-b border-glass-border">
                    <TableHead>CPU Model</TableHead>
                    <TableHead>RAM</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Bandwidth</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map((server) => (
                    <TableRow key={server.id} className="border-b border-glass-border transition-all duration-200">
                      <TableCell className="font-semibold text-foreground">{server.cpu}</TableCell>
                      <TableCell className="text-muted-foreground">{server.ramGb}GB</TableCell>
                      <TableCell className="text-muted-foreground">{server.storage}</TableCell>
                      <TableCell className="text-muted-foreground">{server.bandwidth}</TableCell>
                      <TableCell className="font-semibold text-primary">${server.priceMonthly.toFixed(2)}</TableCell>
                      <TableCell>
                        {server.available ? (
                          <Badge className="bg-emerald-500/15 text-emerald-200 border border-emerald-400/40">Available</Badge>
                        ) : (
                          <Badge className="bg-rose-500/15 text-rose-200 border border-rose-400/40">Sold Out</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button className={gradientButton}>Purchase</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
