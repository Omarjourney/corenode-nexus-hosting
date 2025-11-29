import { plans } from "@/data/plans";
import { Checkbox } from "@/components/ui/checkbox";

const addonEntries = Object.entries(plans.addons);

const formatLabel = (key: string) => {
  switch (key) {
    case "dedicatedIp":
      return "Dedicated IP";
    case "extra50Gb":
      return "Extra 50GB NVMe";
    case "backups":
      return "Automatic Backups";
    case "modpackInstall":
      return "Modpack Auto-Install";
    case "crashGuard":
      return "CrashGuard AI";
    case "prioritySupport":
      return "Priority Support";
    default:
      return key;
  }
};

const AddOns = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {addonEntries.map(([key, price]) => (
      <label key={key} className="flex items-center space-x-3">
        <Checkbox id={key} className="rounded-sm" />
        <span className="text-sm font-inter text-foreground">
          {formatLabel(key)} - ${price.toFixed(2)}/mo
        </span>
      </label>
    ))}
  </div>
);

export default AddOns;
