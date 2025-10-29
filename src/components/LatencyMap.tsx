import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Region = { name: string; lat: number; lon: number };
const REGIONS: Region[] = [
  { name: 'Miami', lat: 25.7617, lon: -80.1918 },
  { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 }
];

function approximateLatencyKm(km: number) {
  // ~5ms per 1000km baseline + 15ms overhead
  return Math.round(15 + (km / 1000) * 5);
}

function haversine(a: Region, b: Region) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

export default function LatencyMap() {
  const [user, setUser] = useState<Region | null>(null);
  const [measure, setMeasure] = useState<{ name: string; ms: number }[]>([]);

  useEffect(() => {
    // Show a reasonable default immediately, then try to refine via geolocation
    setUser({ name: 'You', lat: 40.7, lon: -74.0 }); // NYC fallback
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUser({ name: 'You', lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {/* keep fallback */},
        { enableHighAccuracy: false, timeout: 2000 }
      );
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setMeasure(
      REGIONS.map((r) => ({ name: r.name, ms: approximateLatencyKm(haversine(user, r)) }))
    );
  }, [user]);

  return (
    <Card className="glass-card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[220px] bg-glass-surface rounded relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 select-none">
            {/* Simple placeholder world map image via gradient blocks */}
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),rgba(255,255,255,0)_70%)]" />
          </div>
          <div className="absolute top-3 left-3 text-xs text-muted-foreground">Latency Preview</div>
          {user && (
            <div className="absolute bottom-3 left-3 text-xs text-foreground">
              {`Using ${'geolocation' in navigator ? 'your location' : 'fallback location'}`}
            </div>
          )}
        </div>
        <div className="w-full lg:w-72">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-orbitron font-semibold">Regions</h4>
            <Button size="sm" variant="outline" onClick={() => setUser(null)}>Reset</Button>
          </div>
          <ul className="space-y-2">
            {REGIONS.map((r) => {
              const latency = measure.find((m) => m.name === r.name)?.ms;
              return (
                <li key={r.name} className="flex items-center justify-between text-sm">
                  <span>{r.name}</span>
                  <span className="font-mono">{latency ? `${latency} ms` : '—'}</span>
                </li>
              );
            })}
          </ul>
          <Button className="mt-4 w-full" onClick={() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (pos) => setUser({ name: 'You', lat: pos.coords.latitude, lon: pos.coords.longitude }),
                () => setUser({ name: 'You', lat: 40.7, lon: -74.0 })
              );
            } else {
              setUser({ name: 'You', lat: 40.7, lon: -74.0 });
            }
          }}>Detect Location</Button>
        </div>
      </div>
    </Card>
  );
}
