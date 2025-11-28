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

const pricing: Record<string, Record<number, number>> = {
  CORE: {2:4.49,4:7.49,6:10.49,8:13.49,10:16.49,12:20.49,16:26.49,24:39.49},
  ELITE: {4:11.49,6:14.49,8:17.49,10:21.49,12:27.49,16:36.49,24:51.49,32:67.49},
  CREATOR: {16:49.99,24:69.99,32:89.99,48:129.99}
};

const multiProfiles = [
  { name: "2 Profiles", price: 0 },
  { name: "5 Profiles", price: 4.49 },
  { name: "10 Profiles", price: 6.49 },
  { name: "Unlimited Profiles", price: 11.99 }
];

const addons = [
  { name: "Dedicated IP", price: 2.99, type: "monthly" },
  { name: "Extra 50GB NVMe", price: 2.99, type: "monthly" },
  { name: "Automatic Backups", price: 3.99, type: "monthly" },
  { name: "Modpack Auto-Install", price: 1.99, type: "one-time" },
  { name: "CrashGuard AI", price: 3.49, type: "monthly" },
  { name: "Priority Support", price: 4.99, type: "monthly" }
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
