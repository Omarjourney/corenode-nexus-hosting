import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const STEPS = [
  'Provisioning resources…',
  'Pulling container image…',
  'Allocating public IP…',
  'Applying firewall rules…',
  'Health checks passing…',
  'Deployment complete!'
];

export default function DeploySimulator({ triggerLabel = 'Try Deploy (Demo)' }: { triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setRunning(false);
      setIndex(0);
      if (timer.current) window.clearInterval(timer.current);
    }
  }, [open]);

  const start = () => {
    setRunning(true);
    setIndex(0);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        if (i >= STEPS.length - 1) {
          if (timer.current) window.clearInterval(timer.current);
          return i;
        }
        return i + 1;
      });
    }, 900);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Live Deploy Simulator</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-black text-green-400 font-mono text-sm p-3 rounded h-48 overflow-auto border border-glass-border">
              {STEPS.map((line, i) => (
                <div key={i} className={i <= index ? 'opacity-100' : 'opacity-30'}>
                  $ {line}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Progress: {Math.round(((index + 1) / STEPS.length) * 100)}%</div>
              <Button onClick={start} disabled={running && index < STEPS.length - 1}>
                {index >= STEPS.length - 1 ? 'Replay' : running ? 'Running…' : 'Start Simulation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

