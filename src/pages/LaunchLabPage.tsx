import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import DeploySimulator from '@/components/DeploySimulator';

export default function LaunchLabPage() {
  const [cpu, setCpu] = useState([2]);
  const [ram, setRam] = useState([4]);
  const [storage, setStorage] = useState([40]);

  const price = useMemo(() => {
    const base = 3.49;
    const cpuCost = (cpu[0] - 1) * 2.0;
    const ramCost = ram[0] * 0.8;
    const stoCost = Math.max(0, (storage[0] - 25) * 0.05);
    return (base + cpuCost + ramCost + stoCost).toFixed(2);
  }, [cpu, ram, storage]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Launch Lab – Visual Server Builder | CoreNode"
        description="Build your server visually with live pricing for CPU, RAM, and storage. Share your configuration and deploy in seconds."
      />
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-orbitron font-bold text-gradient-primary">Launch Lab</h1>
            <p className="text-muted-foreground font-inter">Drag the sliders to build your server. Shareable pricing updates live.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card p-6 lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2"><span className="font-orbitron">CPU Cores</span><span>{cpu[0]}</span></div>
                <Slider value={cpu} onValueChange={setCpu} min={1} max={16} step={1} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><span className="font-orbitron">RAM (GB)</span><span>{ram[0]}</span></div>
                <Slider value={ram} onValueChange={setRam} min={1} max={64} step={1} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><span className="font-orbitron">Storage (GB)</span><span>{storage[0]}</span></div>
                <Slider value={storage} onValueChange={setStorage} min={25} max={500} step={5} />
              </div>
            </Card>
            <Card className="glass-card p-6 space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Estimated</div>
                <div className="text-4xl font-orbitron font-bold text-gradient-primary">${price}/mo</div>
              </div>
              <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron">
                <a href={`/order?cpu=${cpu[0]}&ram=${ram[0]}&storage=${storage[0]}&price=${price}`}>Continue to Order</a>
              </Button>
              <DeploySimulator />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
