import { useMemo, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ConfiguratorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ramOptions = [1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64];

const ConfiguratorPanel = ({ open, onOpenChange }: ConfiguratorPanelProps) => {
  const [ramIndex, setRamIndex] = useState(1);
  const [ssd, setSsd] = useState(false);
  const [mods, setMods] = useState(false);

  const price = useMemo(() => {
    let p = ramOptions[ramIndex] * 1.5;
    if (ssd) p += 2.99;
    if (mods) p += 1;
    return p.toFixed(2);
  }, [ramIndex, ssd, mods]);

  const progress = useMemo(() => {
    let value = 33;
    if (ssd) value += 33;
    if (mods) value += 34;
    return value;
  }, [ssd, mods]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md space-y-6">
        <h2 className="text-2xl font-orbitron font-semibold text-foreground">
          Configure Your Server
        </h2>

        <div>
          <label className="font-orbitron mb-2 block text-sm text-foreground">
            RAM: {ramOptions[ramIndex]}GB
          </label>
          <Slider
            min={0}
            max={ramOptions.length - 1}
            step={1}
            value={[ramIndex]}
            onValueChange={(v) => setRamIndex(v[0])}
            className="mb-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-orbitron text-sm text-foreground">
            SSD Upgrade +$2.99/50GB
          </span>
          <Switch checked={ssd} onCheckedChange={setSsd} />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-orbitron text-sm text-foreground">Mod Support</span>
          <Checkbox checked={mods} onCheckedChange={setMods} />
        </div>

        <Progress value={progress} className="glow-primary" />

        <div className="text-center pt-4">
          <div className="text-3xl font-orbitron font-bold text-gradient-primary mb-4">
            ${price}/mo
          </div>
          <Button className="w-full bg-gradient-primary glow-primary font-orbitron">
            Launch Server
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConfiguratorPanel;
