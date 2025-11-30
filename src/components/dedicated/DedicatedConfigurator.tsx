import { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Crown, Gauge, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TierId } from "@/types/hosting";

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

type InventoryServer = {
  productId: string;
  region: string;
  name: string;
  details: string;
  status: "available" | "soldout" | string;
  price: {
    monthly: string;
    sixMonth?: string;
    yearly: string;
    twoYear?: string;
  };
};

interface InventoryResponse {
  family?: string | null;
  region?: string | null;
  servers: InventoryServer[];
}

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

const familyMeta: Record<TierId, {
  cpuFamily: string;
  clock: string;
  geekbench: string;
  pricePerGb: string;
  markup: string;
  description: string;
}> = {
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


// Example tierCards definition (missing in original code)
const tierCards: Array<{
  id: TierId;
  name: string;
  descriptor: string;
  icon: any;
  border: string;
  accent: string;
  badgeClass: string;
}> = [
  {
    id: "core",
    name: "Core",
    descriptor: "Balanced performance",
    icon: Cpu,
    border: "border-cyan-400",
    accent: "from-cyan-400/30 to-cyan-200/10",
    badgeClass: "text-cyan-400",
  },
  {
    id: "elite",
    name: "Elite",
    descriptor: "High performance",
    icon: Rocket,
    border: "border-violet-400",
    accent: "from-violet-400/30 to-violet-200/10",
    badgeClass: "text-violet-400",
  },
  {
    id: "creator",
    name: "Creator",
    descriptor: "Top-tier performance",
    icon: Crown,
    border: "border-amber-400",
    accent: "from-amber-400/30 to-amber-200/10",
    badgeClass: "text-amber-400",
  },
];

const regionCards = [
  { id: "MIAMI", name: "Miami", flag: "🇺🇸" },
  { id: "LONDON", name: "London", flag: "🇬🇧" },
  { id: "FRANKFURT", name: "Frankfurt", flag: "🇩🇪" },
  // Add more regions as needed
];

const regionMatchers: Record<string, RegExp[]> = {
  MIAMI: [/miami/i, /us/i, /usa/i, /united states/i],
  LONDON: [/london/i, /uk/i, /united kingdom/i],
  FRANKFURT: [/frankfurt/i, /germany/i, /de/i],
  // Add more region matchers as needed
};

function resolveRegion(location: string): (typeof regionCards)[number]["id"] {
  const normalizedLocation = location || "";
  const match = Object.entries(regionMatchers).find(([, patterns]) =>
    patterns.some((pattern) => pattern.test(normalizedLocation)),
  );
  return (match?.[0] as (typeof regionCards)[number]["id"]) || "MIAMI";
}

type RegionStat = {
  code: string;
  name: string;
  flag: string;
  total: number;
  available: number;
  soldOut?: boolean;
  cheapestMonthly?: number;
  stockPercent?: number;
  loadPercent?: number;
  level?: string;
};

function summarizeByRegion(servers: InventoryServer[]): Record<string, RegionStat> {
  return regionCards.reduce((acc, region) => {
    const scoped = servers.filter((server) => server.region === region.id);
    acc[region.id] = {
      code: region.id,
      name: region.name,
      total: scoped.length,
      available: scoped.filter((srv) => srv.status === "available").length,
      flag: region.flag,
    };
    return acc;
  }, {} as Record<string, RegionStat>);
}

export function DedicatedConfigurator() {
  const [selectedTier, setSelectedTier] = useState<TierId>("core");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [regionData, setRegionData] = useState<RegionStat[]>([]);
  const [fullServerData, setFullServerData] = useState<ApiServer[]>([]);
  const [loading, setLoading] = useState(true);
  const autoSelected = useRef(false);

  // Use fullServerData as the source of servers, or define staticServers if needed


  useEffect(() => {
    fetch(`${API_BASE}/dedicatedServers.php`)
      .then((r) => r.json())
      .then((data) => {
        const servers = (data?.servers ?? []) as ApiServer[];
        const regionStats = regionCards.map((region) => {
          const scoped = servers.filter((server) => server.region === region.id);
          const available = scoped.length;
          const soldOut = available === 0;
          let cheapestMonthly: number | undefined = undefined;
          if (scoped.length > 0) {
            cheapestMonthly = Math.min(
              ...scoped.map((srv) => Number(srv.price.monthly.replace(/[^0-9.]/g, "")))
            );
          }
          return {
            code: region.id,
            name: region.name,
            flag: region.flag,
            total: scoped.length,
            available,
            soldOut,
            cheapestMonthly,
          };
        });
        setRegionData(regionStats);
        setSelectedRegion(regionStats[0]?.code || "");
        setFullServerData(servers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  // Removed autoDetectBestRegion logic (not defined). If you want to auto-select, implement here.

  // Use a static price or derive from available servers if needed
  const getTierPrice = (tierId: TierId): number => {
    // Try to find the lowest price for this tier in all servers (if servers have a tier property)
    // For now, fallback to static pricing per tier
    switch (tierId) {
      case "core":
        return 149;
      case "elite":
        return 199;
      case "creator":
        return 299;
      default:
        return 149;
    }
  };

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
      {/* ...existing code for sections 1 and 2... */}
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
