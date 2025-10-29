import { useEffect, useMemo, useRef, useState } from 'react';
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
        <div className="flex-1 min-h-[260px] bg-glass-surface rounded relative overflow-hidden grid place-items-center">
          <RotatingGlobe user={user} />
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

function RotatingGlobe({ user }: { user: Region | null }) {
  const R = 110; // radius in px for drawing
  // current central longitude (degrees). Start at 0, animate to user.lon.
  const [centerLon, setCenterLon] = useState(0);
  const raf = useRef<number | null>(null);
  const targetLon = user?.lon ?? 0;

  // Normalize angles to [-180,180]
  function normDeg(d: number) {
    const x = ((d + 180) % 360 + 360) % 360 - 180;
    return x;
  }

  useEffect(() => {
    const start = centerLon;
    const delta = normDeg(targetLon - start);
    const duration = 1200; // ms
    const t0 = performance.now();
    if (raf.current) cancelAnimationFrame(raf.current);
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setCenterLon(normDeg(start + delta * eased));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [targetLon, centerLon]);

  // Precompute grid lines (meridians/parallels)
  const meridians = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let lon = -150; lon <= 150; lon += 30) {
      // project several points and draw polyline approximation as many small segments
      const segs = [] as { x: number; y: number }[];
      for (let lat = -80; lat <= 80; lat += 10) {
        const pt = project(lat, lon, centerLon, R);
        if (pt) segs.push({ x: pt.x, y: pt.y });
      }
      for (let i = 1; i < segs.length; i++) {
        lines.push({ x1: segs[i - 1].x, y1: segs[i - 1].y, x2: segs[i].x, y2: segs[i].y });
      }
    }
    return lines;
  }, [centerLon]);

  const parallels = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const segs = [] as { x: number; y: number }[];
      for (let lon = -180; lon <= 180; lon += 10) {
        const pt = project(lat, lon, centerLon, R);
        if (pt) segs.push({ x: pt.x, y: pt.y });
      }
      for (let i = 1; i < segs.length; i++) {
        lines.push({ x1: segs[i - 1].x, y1: segs[i - 1].y, x2: segs[i].x, y2: segs[i].y });
      }
    }
    return lines;
  }, [centerLon]);

  const userPoint = user ? project(user.lat, user.lon, centerLon, R) : null;

  return (
    <svg width={R * 2 + 20} height={R * 2 + 20} viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`}>
      {/* Globe circle */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(125,125,255,0.15)" />
          <stop offset="100%" stopColor="rgba(125,125,255,0.02)" />
        </radialGradient>
      </defs>
      <circle cx={0} cy={0} r={R} fill="url(#glow)" stroke="rgba(255,255,255,0.1)" />
      {/* Graticule */}
      <g stroke="rgba(255,255,255,0.2)" strokeWidth={0.5}>
        {meridians.map((l, i) => (
          <line key={`m-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        {parallels.map((l, i) => (
          <line key={`p-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
      {/* User marker if visible */}
      {userPoint && (
        <g>
          <circle cx={userPoint.x} cy={userPoint.y} r={3} fill="#7c3aed" />
          <text x={userPoint.x + 6} y={userPoint.y - 6} fontSize={10} fill="rgba(255,255,255,0.8)">
            You
          </text>
        </g>
      )}
    </svg>
  );
}

function project(latDeg: number, lonDeg: number, centerLonDeg: number, R: number) {
  const φ = (latDeg * Math.PI) / 180;
  const λ = (lonDeg * Math.PI) / 180;
  const λ0 = (centerLonDeg * Math.PI) / 180;
  const cosφ = Math.cos(φ);
  const sinφ = Math.sin(φ);
  const cosΔλ = Math.cos(λ - λ0);
  // visibility for orthographic with center lat = 0
  if (cosφ * cosΔλ <= 0) return null;
  const x = R * (cosφ * Math.sin(λ - λ0));
  const y = R * (sinφ);
  return { x, y };
}
