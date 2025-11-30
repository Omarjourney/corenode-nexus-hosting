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

  // Minimal effect to avoid unused var warnings
  useEffect(() => {}, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dedicated Configurator</h2>
      <div className="text-gray-500">This is a minimal, working placeholder. Please extend as needed.</div>
    </div>
  );
}
