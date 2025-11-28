import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Action = {
  id: string;
  label: string;
  hint?: string;
  to: string;
};

const actions: Action[] = [
  { id: 'minecraft', label: 'Start a Minecraft server', hint: 'Java/Bedrock', to: '/minecraft' },
  { id: 'games', label: 'Explore Game Servers', hint: '80+ supported', to: '/game-servers' },
  { id: 'voice', label: 'Host a Voice Server', hint: 'TeamSpeak, Mumble, Discord', to: '/voice-servers' },
  { id: 'web', label: 'Get Web Hosting', hint: 'cPanel plans', to: '/web-hosting' },
  { id: 'vps', label: 'Compare VPS Plans', hint: 'Scalable compute', to: '/vps' },
  { id: 'dedicated', label: 'Dedicated Servers', hint: 'Bare metal', to: '/dedicated' },
  { id: 'launch-lab', label: 'Open Launch Lab', hint: 'Visual builder', to: '/launch-lab' },
  { id: 'pro-config', label: 'Open Pro Configurator', hint: 'Guided 3-step wizard', to: '/pro-configurator' },
  { id: 'latency', label: 'Check Latency Map', hint: 'Region ping preview', to: '/latency' },
  { id: 'order', label: 'Go to Order Form', hint: 'Advanced options', to: '/order' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden">
        <Command label="CodeNodeX Command Palette">
          <div className="p-3 border-b border-glass-border">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search (Cmd/Ctrl+K)"
            />
          </div>
          <Command.List className="max-h-[50vh] overflow-y-auto">
            {results.length === 0 && <Command.Empty className="p-4 text-sm">No results</Command.Empty>}
            <Command.Group heading="Actions">
              {results.map((a) => (
                <Command.Item
                  key={a.id}
                  onSelect={() => {
                    setOpen(false);
                    navigate(a.to);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{a.label}</span>
                    {a.hint && <span className="text-xs text-muted-foreground">{a.hint}</span>}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

