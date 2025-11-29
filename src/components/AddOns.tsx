import { plans } from "@/data/plans";
import { Checkbox } from "@/components/ui/checkbox";

const addonEntries = Object.entries(plans.addons);

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
