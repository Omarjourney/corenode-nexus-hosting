import { useState, useMemo, useEffect } from "react";
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

const pricing: Record<string, Record<number, number>> = {
  CORE: {2: 5.49, 4: 7.99, 6: 11.49, 8: 14.99},
  ELITE: {4: 11.49, 6: 16.49, 8: 21.49, 12: 31.49},
  CREATOR: {16: 59.99, 24: 87.99, 32: 114.99}
};

const multiProfiles = [
  { name: "2 Profiles", price: 0 },
  { name: "5 Profiles", price: 4.49 },
  { name: "10 Profiles", price: 6.49 },
  { name: "Unlimited Profiles", price: 11.99 }
];

const addons = [
  { name: "+1GB RAM", price: 2.49, type: "monthly" },
  { name: "+2GB RAM", price: 4.99, type: "monthly" },
  { name: "+4GB RAM", price: 9.99, type: "monthly" },
  { name: "+8GB RAM", price: 19.99, type: "monthly" },
  { name: "CPU Boost (Core → Elite)", price: 5, type: "monthly" },
  { name: "CPU Boost (Elite → Creator)", price: 10, type: "monthly" },
  { name: "+10GB Premium SSD", price: 2.99, type: "monthly" },
  { name: "+25GB Premium SSD", price: 6.99, type: "monthly" },
  { name: "+50GB Premium SSD", price: 12.99, type: "monthly" },
  { name: "+100GB Premium SSD", price: 24.99, type: "monthly" },
  { name: "Basic Backup (50GB)", price: 6.99, type: "monthly" },
  { name: "Pro Backup (100GB)", price: 9.99, type: "monthly" },
  { name: "Enterprise Backup (250GB)", price: 19.99, type: "monthly" },
  { name: "Ultimate Backup (500GB)", price: 34.99, type: "monthly" }
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
  const [tier, setTier] = useState("CORE");
  const [ram, setRam] = useState("4");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [profile, setProfile] = useState("2 Profiles");
  const [game, setGame] = useState("");
  const [openGame, setOpenGame] = useState(false);

  const availableRam = useMemo(
    () => Object.keys(pricing[tier] || {}).map((r) => Number(r)).sort((a, b) => a - b),
    [tier]
  );

  useEffect(() => {
    const firstOption = availableRam[0];
    if (firstOption && pricing[tier][Number(ram)] === undefined) {
      setRam(firstOption.toString());
    }
  }, [availableRam, ram, tier]);

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

  const profilePrice = useMemo(
    () => multiProfiles.find((p) => p.name === profile)?.price ?? 0,
    [profile]
  );

  const monthlyTotal = basePrice + addonsMonthly + profilePrice;

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
    multi_profile: profile,
    profile_cost: Number(profilePrice.toFixed(2)),
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
            <p className="text-center text-sm text-muted-foreground font-inter">
              CORE = CorePanel Lite™, ELITE = CNX CommandCenter™, CREATOR = CommandCenter™ + dedicated CPU.
            </p>

            {/* Tier Selection */}
            <div>
              <h3 className="font-orbitron mb-2">1. Select Server Tier</h3>
              <RadioGroup value={tier} onValueChange={setTier} className="grid grid-cols-3 gap-4">
                {["CORE", "ELITE", "CREATOR"].map((t) => (
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
                  {availableRam.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} GB - ${pricing[tier][size].toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Multi-Game Profiles */}
            <div>
              <h3 className="font-orbitron mb-2">3. Multi-Game Profiles</h3>
              <RadioGroup value={profile} onValueChange={setProfile} className="grid grid-cols-2 gap-3">
                {multiProfiles.map((p) => (
                  <label key={p.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={p.name} id={`profile-${p.name}`} />
                    <span className="text-sm">{p.name} {p.price === 0 ? "(Included)" : `- $${p.price.toFixed(2)}/mo`}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Add-ons */}
            <div>
              <h3 className="font-orbitron mb-2">4. Add-ons</h3>
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
              <h3 className="font-orbitron mb-2">5. Select Game</h3>
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
