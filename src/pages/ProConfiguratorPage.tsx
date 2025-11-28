import { useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type Step = 1 | 2 | 3;

export default function ProConfiguratorPage() {
  const [step, setStep] = useState<Step>(1);
  const [game, setGame] = useState('Minecraft');
  const [players, setPlayers] = useState([20]);
  const [mods, setMods] = useState(false);
  const [ram, setRam] = useState([4]);
  const [region, setRegion] = useState('Miami');

  const estimate = useMemo(() => {
    const base = game === 'Minecraft' ? 4.49 : 6.49;
    const modsCost = mods ? 2.5 : 0;
    const playerCost = Math.max(0, (players[0] - 10) * 0.1);
    const ramCost = ram[0] * 0.7;
    return (base + modsCost + playerCost + ramCost).toFixed(2);
  }, [game, players, mods, ram]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEO
        title="Pro Configurator – Guided Server Setup | CodeNodeX"
        description="3-step guided configurator to pick game, players, mods, region and resources with real-time pricing."
      />
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-orbitron font-semibold">Pro Configurator</h1>
                <div className="text-sm text-muted-foreground">Step {step} / 3</div>
              </div>
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="font-orbitron text-sm">Game</label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {['Minecraft', 'Rust', 'Valheim', 'CS2'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGame(g)}
                          className={`glass-card p-3 rounded border text-sm ${game === g ? 'ring-2 ring-primary border-primary/40' : ''}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-orbitron text-sm">Players: {players[0]}</label>
                    <Slider value={players} onValueChange={setPlayers} min={5} max={200} step={5} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="mods" type="checkbox" checked={mods} onChange={(e) => setMods(e.target.checked)} />
                    <label htmlFor="mods" className="text-sm">Using mods/plugins</label>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="font-orbitron text-sm">RAM (GB): {ram[0]}</label>
                    <Slider value={ram} onValueChange={setRam} min={2} max={64} step={1} />
                  </div>
                  <div>
                    <label className="font-orbitron text-sm">Region</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {['Miami', 'Dallas', 'Los Angeles'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRegion(r)}
                          className={`glass-card p-3 rounded border text-sm ${region === r ? 'ring-2 ring-secondary border-secondary/40' : ''}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2 text-sm">
                  <div>Game: <strong>{game}</strong></div>
                  <div>Players: <strong>{players[0]}</strong></div>
                  <div>Mods/Plugins: <strong>{mods ? 'Yes' : 'No'}</strong></div>
                  <div>RAM: <strong>{ram[0]} GB</strong></div>
                  <div>Region: <strong>{region}</strong></div>
                </div>
              )}
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}>Back</Button>
                <div className="flex items-center gap-2">
                  {step < 3 ? (
                    <Button onClick={() => setStep((s) => ((s + 1) as Step))}>Next</Button>
                  ) : (
                    <Button asChild>
                      <a href={`/order?game=${game}&players=${players[0]}&ram=${ram[0]}&region=${region}&estimate=${estimate}`}>
                        Continue to Order
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="glass-card p-6 text-center">
              <div className="text-sm text-muted-foreground">Estimated</div>
              <div className="text-4xl font-orbitron font-bold text-gradient-secondary">${estimate}/mo</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
