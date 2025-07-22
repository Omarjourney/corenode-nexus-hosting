import { Checkbox } from "@/components/ui/checkbox";

const addons = [
  { name: "Extra IP", price: 2, recurring: true },
  { name: "DDoS Enhanced", price: 4, recurring: true },
  { name: "AMP or Pterodactyl Setup", price: 10, recurring: false },
  { name: "Auto Backups", price: 3, recurring: true },
  { name: "Priority Migration", price: 20, recurring: false },
  { name: "Control Panel (cPanel)", price: 15, recurring: true },
];

const AddOns = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {addons.map((addon) => (
      <label key={addon.name} className="flex items-center space-x-3">
        <Checkbox id={addon.name} />
        <span className="text-sm font-inter text-foreground">
          {addon.name} - ${addon.price}
          {addon.recurring ? "/mo" : ""}
        </span>
      </label>
    ))}
  </div>
);

export default AddOns;
