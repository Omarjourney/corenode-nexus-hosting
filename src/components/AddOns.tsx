import type { JSX } from "react";
import { useMemo, useState } from "react";
import { Brain, Cloud, Cpu, HardDrive } from "lucide-react";
import { plans } from "@/data/plans";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const addonEntries = Object.entries(plans.addons);

const categories: Record<string, { icon: JSX.Element; description: string; items: string[] }> = {
  "🧠 RAM Upgrades": {
    icon: <Brain className="h-4 w-4 text-primary" />,
    description: "For heavier workloads",
    items: ["ramPlus1Gb", "ramPlus2Gb", "ramPlus4Gb", "ramPlus8Gb"],
  },
  "⚡ CPU Boosts": {
    icon: <Cpu className="h-4 w-4 text-primary" />,
    description: "Turbo vCPU allocations",
    items: ["cpuBoostCoreToElite", "cpuBoostEliteToCreator"],
  },
  "💾 Storage Upgrades": {
    icon: <HardDrive className="h-4 w-4 text-primary" />,
    description: "NVMe space for assets",
    items: ["storagePlus10Gb", "storagePlus25Gb", "storagePlus50Gb", "storagePlus100Gb"],
  },
  "☁️ Backup Tiers": {
    icon: <Cloud className="h-4 w-4 text-primary" />,
    description: "Keep snapshots close",
    items: ["backupBasic50Gb", "backupPro100Gb", "backupEnterprise250Gb", "backupUltimate500Gb"],
  },
};

const formatLabel = (key: string) => {
  switch (key) {
    case "ramPlus1Gb":
      return "+1GB RAM";
    case "ramPlus2Gb":
      return "+2GB RAM";
    case "ramPlus4Gb":
      return "+4GB RAM";
    case "ramPlus8Gb":
      return "+8GB RAM";
    case "cpuBoostCoreToElite":
      return "CPU Boost (Core → Elite)";
    case "cpuBoostEliteToCreator":
      return "CPU Boost (Elite → Creator)";
    case "storagePlus10Gb":
      return "+10GB Premium SSD";
    case "storagePlus25Gb":
      return "+25GB Premium SSD";
    case "storagePlus50Gb":
      return "+50GB Premium SSD";
    case "storagePlus100Gb":
      return "+100GB Premium SSD";
    case "backupBasic50Gb":
      return "Basic Backup (50GB)";
    case "backupPro100Gb":
      return "Pro Backup (100GB)";
    case "backupEnterprise250Gb":
      return "Enterprise Backup (250GB)";
    case "backupUltimate500Gb":
      return "Ultimate Backup (500GB)";
    default:
      return key;
  }
};

const AddOns = () => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const total = useMemo(() => {
    return addonEntries.reduce((sum, [key, price]) => {
      return selected[key] ? sum + price : sum;
    }, 0);
  }, [selected]);

  const handleToggle = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categories).map(([title, meta]) => (
          <Card key={title} className="glass-card p-4 rounded-xl border border-glass-border space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-orbitron font-semibold text-foreground flex items-center gap-2">
                  {meta.icon}
                  {title}
                </p>
                <p className="text-xs text-muted-foreground">{meta.description}</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                {meta.items.length} options
              </Badge>
            </div>
            <div className="grid gap-3">
              {meta.items.map((key) => {
                const price = plans.addons[key as keyof typeof plans.addons];
                return (
                  <label key={key} className="glass-card p-3 rounded-lg border border-glass-border flex items-center justify-between gap-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-inter text-foreground">{formatLabel(key)}</p>
                      <p className="text-xs text-muted-foreground">For heavier workloads</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-primary">${price.toFixed(2)}/mo</span>
                      <Checkbox id={key} checked={!!selected[key]} onCheckedChange={() => handleToggle(key)} className="rounded-sm" />
                    </div>
                  </label>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <div className="hidden lg:flex fixed bottom-6 right-8 glass-card px-4 py-3 rounded-xl border border-primary/40 shadow-[0_0_20px_rgba(0,234,255,0.2)]">
        <span className="text-sm text-foreground">Selected Add-ons:</span>
        <span className="ml-2 font-semibold text-primary">+${total.toFixed(2)}/mo</span>
      </div>
    </div>
  );
};

export default AddOns;
