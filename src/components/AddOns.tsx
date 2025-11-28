import { Checkbox } from "@/components/ui/checkbox";

const addons = [
  { name: "Dedicated IP", price: 2.99, recurring: true },
  { name: "Extra 50GB NVMe", price: 2.99, recurring: false },
  { name: "Automatic Backups", price: 3.99, recurring: true },
  { name: "Modpack Auto-Install", price: 1.99, recurring: false },
  { name: "CrashGuard AI", price: 3.49, recurring: true },
  { name: "Priority Support", price: 4.99, recurring: true },
];

const AddOns = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {addons.map((addon) => (
      <label key={addon.name} className="flex items-center space-x-3">
        <Checkbox id={addon.name} className="rounded-sm" />
        <span className="text-sm font-inter text-foreground">
          {addon.name} - ${addon.price.toFixed(2)}
          {addon.recurring ? "/mo" : ""}
        </span>
      </label>
    ))}
  </div>
);

export default AddOns;
