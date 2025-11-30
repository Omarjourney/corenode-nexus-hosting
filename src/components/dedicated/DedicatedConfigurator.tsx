import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, Crown, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type InventoryServer = {
  id?: string | number;
  cpu?: string;
  ram?: string;
  storage?: string;
  location?: string;
  region?: string;
  status?: "available" | "soldout" | string;
  price?: number;
};

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const tierCards = [
  { id: "core", name: "Core", descriptor: "Balanced performance", icon: Cpu },
  { id: "elite", name: "Elite", descriptor: "High performance", icon: Rocket },
  { id: "creator", name: "Creator", descriptor: "Top-tier performance", icon: Crown },
];

const regionCards = [
  { id: "MIAMI", name: "Miami", flag: "🇺🇸" },
  { id: "LONDON", name: "London", flag: "🇬🇧" },
  { id: "FRANKFURT", name: "Frankfurt", flag: "🇩🇪" },
];

export function DedicatedConfigurator(): JSX.Element {
  const [selectedTier, setSelectedTier] = useState<string>("core");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryServer[]>([]);
  const [loading, setLoading] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Minimal placeholder: local demo inventory to keep component functional.
    async function load() {
      setLoading(true);
      try {
        const demo: InventoryServer[] = [
          { id: 1, cpu: "2 x Intel Xeon", ram: "32GB", storage: "1TB NVMe", location: "Miami", region: "MIAMI", status: "available", price: 129 },
          { id: 2, cpu: "AMD EPYC 7742", ram: "64GB", storage: "2TB NVMe", location: "London", region: "LONDON", status: "soldout", price: 249 },
        ];
        if (mounted.current) setInventory(demo.filter((d) => (selectedRegion ? d.region === selectedRegion : true)));
      } finally {
        if (mounted.current) setLoading(false);
      }
    }
    load();
  }, [selectedTier, selectedRegion]);

  const availableCount = useMemo(() => inventory.filter((s) => s.status === "available").length, [inventory]);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">STEP 1 — TIER</p>
            <h2 className="text-2xl font-bold">Select Family</h2>
          </div>
          <Badge>Live</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tierCards.map((t) => (
            <button key={t.id} onClick={() => setSelectedTier(t.id)} className={cn("p-4 rounded border text-left", selectedTier === t.id ? "ring-2" : "")}> 
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.descriptor}</div>
                </div>
                <t.icon className="w-6 h-6" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">STEP 2 — REGION</p>
            <h3 className="text-lg font-semibold">Select Region</h3>
          </div>
          <Badge>{availableCount} available</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {regionCards.map((r) => (
            <button key={r.id} onClick={() => setSelectedRegion(r.id)} className={cn("p-4 rounded border text-left", selectedRegion === r.id ? "ring-2" : "") }>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.flag} {r.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">STEP 3 — INVENTORY</p>
            <h3 className="text-lg font-semibold">Available Servers</h3>
          </div>
        </div>

        <div className="rounded border p-4">
          {loading ? (
            <div>Loading…</div>
          ) : inventory.length === 0 ? (
            <div className="text-muted-foreground">No inventory in this selection.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CPU</TableHead>
                  <TableHead>RAM</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.cpu}</TableCell>
                    <TableCell>{s.ram}</TableCell>
                    <TableCell>{s.storage}</TableCell>
                    <TableCell>{s.location}</TableCell>
                    <TableCell className="text-right">{typeof s.price === "number" ? priceFormatter.format(s.price) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}

// Simple fallback for TableHead if the UI lib doesn't export a specific element
function TableHead({ children, className }: any) { return <th className={className}>{children}</th>; }
