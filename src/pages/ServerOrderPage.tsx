import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ramOptions = [1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,48,64];

const pricing: Record<string, Record<number, number>> = {
  Basic: {1:3.49,2:4.99,3:6.49,4:7.99,5:9.49,6:10.99,7:12.49,8:13.99,10:15.99,12:17.99,14:19.99,16:21.99,20:27.99,24:33.99,28:39.99,32:44.99,48:64.99,64:89.99},
  Standard: {1:4.99,2:6.99,3:8.99,4:10.99,5:12.49,6:13.99,7:15.49,8:16.99,10:19.49,12:22.49,14:25.49,16:27.99,20:33.99,24:39.99,28:44.99,32:49.99,48:69.99,64:94.99},
  Premium: {1:6.99,2:8.99,3:10.99,4:12.99,5:14.99,6:16.99,7:18.99,8:20.99,10:23.99,12:26.99,14:29.99,16:32.99,20:39.99,24:46.99,28:52.99,32:59.99,48:84.99,64:114.99}
};

const addons = [
  { name: "+50 GB SSD Storage", price: 3, type: "monthly" },
  { name: "Priority CPU Boost", price: 5, type: "monthly" },
  { name: "Hourly Backup Snapshots", price: 4, type: "monthly" },
  { name: "Custom Domain Mapping", price: 2.5, type: "monthly" },
  { name: "White-label Branding", price: 5, type: "monthly" },
  { name: "Mod/Plugin Installation", price: 7, type: "one-time" }
];

const games = [
  "Minecraft",
  "ARKSurvivalEvolved",
  "Rust",
  "Valheim",
  "CSGO",
  "7DaysToDie",
  "Terraria",
  "ConanExiles",
  "DayZ",
  "EcoServer",
  "Palworld",
  "TheForest",
  "SCUM",
  "L4D2",
  "Squad",
  "ProjectZomboid"
];

const ServerOrderPage = () => {
  const [tier, setTier] = useState("Basic");
  const [ram, setRam] = useState("4");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [game, setGame] = useState("");
  const [openGame, setOpenGame] = useState(false);

  const basePrice = useMemo(() => pricing[tier][Number(ram)] ?? 0, [tier, ram]);

  const addonsMonthly = useMemo(
    () =>
      addons
        .filter((a) => a.type === "monthly" && selectedAddons.includes(a.name))
        .reduce((sum, a) => sum + a.price, 0),
    [selectedAddons]
  );

  const oneTimeCost = useMemo(
    () =>
      addons
        .filter((a) => a.type === "one-time" && selectedAddons.includes(a.name))
        .reduce((sum, a) => sum + a.price, 0),
    [selectedAddons]
  );

  const monthlyTotal = basePrice + addonsMonthly;

  const toggleAddon = (name: string, checked: boolean | "indeterminate") => {
    setSelectedAddons((prev) => {
      if (checked) {
        return prev.includes(name) ? prev : [...prev, name];
      }
      return prev.filter((a) => a !== name);
    });
  };

  const order = {
    tier,
    ram: `${ram} GB`,
    price_base: Number(basePrice.toFixed(2)),
    addons: selectedAddons,
    addons_cost: Number(addonsMonthly.toFixed(2)),
    game,
    monthly_total: Number(monthlyTotal.toFixed(2)),
    one_time: Number(oneTimeCost.toFixed(2))
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <Card className="glass-card p-8 space-y-6">
            <h2 className="text-3xl font-orbitron font-semibold text-center">Order Your Game Server</h2>

            {/* Tier Selection */}
            <div>
              <h3 className="font-orbitron mb-2">1. Select Server Tier</h3>
              <RadioGroup value={tier} onValueChange={setTier} className="grid grid-cols-3 gap-4">
                {["Basic", "Standard", "Premium"].map((t) => (
                  <label key={t} className="flex items-center space-x-2">
                    <RadioGroupItem value={t} id={`tier-${t}`} />
                    <span>{t}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* RAM Selector */}
            <div>
              <h3 className="font-orbitron mb-2">2. Choose RAM</h3>
              <Select value={ram} onValueChange={setRam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select RAM" />
                </SelectTrigger>
                <SelectContent>
                  {ramOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} GB - ${pricing[tier][size].toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="font-orbitron mb-2">3. Add-ons</h3>
              <div className="space-y-2">
                {addons.map((a) => (
                  <label key={a.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={a.name}
                      checked={selectedAddons.includes(a.name)}
                      onCheckedChange={(c) => toggleAddon(a.name, c)}
                    />
                    <span className="text-sm">
                      {a.name} - ${a.price.toFixed(2)}{a.type === "monthly" ? "/mo" : " one-time"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Game Selection */}
            <div>
              <h3 className="font-orbitron mb-2">4. Select Game</h3>
              <Popover open={openGame} onOpenChange={setOpenGame}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openGame} className="w-full justify-between">
                    {game ? game : "Search game"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No game found.</CommandEmpty>
                      <CommandGroup>
                        {games.map((g) => (
                          <CommandItem
                            key={g}
                            value={g}
                            onSelect={(val) => {
                              setGame(val);
                              setOpenGame(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", game === g ? "opacity-100" : "opacity-0")} />
                            {g}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Output */}
            <div className="space-y-2">
              <p className="font-orbitron text-lg text-center">Monthly Total: ${monthlyTotal.toFixed(2)}</p>
              <pre className="bg-glass-surface p-4 rounded-md text-sm overflow-x-auto">
{JSON.stringify(order, null, 2)}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServerOrderPage;
