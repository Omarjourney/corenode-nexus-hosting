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

  const [mode, setMode] = useState<'map' | 'globe'>('map');

  return (
    <Card className="glass-card p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-[260px] bg-glass-surface rounded relative overflow-hidden grid place-items-center">
          {mode === 'globe' ? (
            <RotatingGlobe user={user} measure={measure} />
          ) : (
            <FlatMap user={user} measure={measure} />
          )}
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
            <div className="flex items-center gap-2">
              <Button size="sm" variant={mode === 'map' ? 'default' : 'outline'} onClick={() => setMode('map')}>Map</Button>
              <Button size="sm" variant={mode === 'globe' ? 'default' : 'outline'} onClick={() => setMode('globe')}>Globe</Button>
              <Button size="sm" variant="outline" onClick={() => setUser(null)}>Reset</Button>
            </div>
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

function RotatingGlobe({ user, measure }: { user: Region | null; measure: { name: string; ms: number }[] }) {
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
  const regionPoints = useMemo(() =>
    REGIONS.map((r) => ({ r, pt: project(r.lat, r.lon, centerLon, R) })).filter((x) => !!x.pt) as { r: Region; pt: { x: number; y: number } }[],
  [centerLon]);

  function msFor(name: string) {
    return measure.find((m) => m.name === name)?.ms;
  }

  function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    // perpendicular normal
    const nx = -dy / len;
    const ny = dx / len;
    // lift control point proportional to distance
    const lift = Math.min(20, len * 0.2);
    const cx = mx + nx * lift;
    const cy = my + ny * lift;
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
  }

  return (
    <svg width={R * 2 + 20} height={R * 2 + 20} viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`}>
      {/* Globe circle + gradients */}
      <defs>
        <radialGradient id="ocean" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#0a2342" />
          <stop offset="100%" stopColor="#0d2e59" />
        </radialGradient>
        <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(80,120,255,0.2)" />
          <stop offset="100%" stopColor="rgba(80,120,255,0.0)" />
        </radialGradient>
        <style>{`
          @keyframes dashMove { to { stroke-dashoffset: -40; } }
          .arc { stroke-dasharray: 6 8; animation: dashMove 2.2s linear infinite; }
        `}</style>
      </defs>
      <circle cx={0} cy={0} r={R} fill="url(#ocean)" stroke="rgba(255,255,255,0.15)" />
      <circle cx={0} cy={0} r={R} fill="url(#atmo)" />
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
      {/* Regions and animated connections */}
      <g>
        {regionPoints.map(({ r, pt }, idx) => {
          const ms = msFor(r.name) ?? 60;
          const rad = Math.max(2, 6 - ms / 40); // bigger for better (lower) latency
          const hue = Math.max(0, 130 - ms); // rough color shift by latency
          const stroke = `hsla(${hue},70%,60%,0.5)`;
          return (
            <g key={r.name}>
              {userPoint && (
                <path
                  d={arcPath(userPoint, pt)}
                  stroke={stroke}
                  className="arc"
                  strokeWidth={1.2}
                  fill="none"
                  style={{ animationDelay: `${(idx % 3) * 0.3}s` }}
                />
              )}
              <circle cx={pt.x} cy={pt.y} r={rad} fill="#10b981" />
              <text x={pt.x + 5} y={pt.y + 3} fontSize={9} fill="rgba(255,255,255,0.7)">{r.name}</text>
            </g>
          );
        })}
      </g>
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

function FlatMap({ user, measure }: { user: Region | null; measure: { name: string; ms: number }[] }) {
  const W = 440;
  const H = 240;
  const pad = 12;
  const userXY = useMemo(() => (user ? llToXY(user.lat, user.lon, W, H, pad) : null), [user]);
  function msFor(name: string) {
    return measure.find((m) => m.name === name)?.ms;
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="rounded">
      <defs>
        <linearGradient id="mapBg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0b1220" />
          <stop offset="100%" stopColor="#0e1b33" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#mapBg)" />
      {/* World land silhouette (lightweight) */}
      <image href="/maps/world.svg" x={pad} y={pad} width={W - pad * 2} height={H - pad * 2} preserveAspectRatio="none" opacity={0.35} />
      {/* Graticule */}
      <g stroke="rgba(255,255,255,0.08)" strokeWidth={1}>
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={pad + ((W - pad * 2) / 11) * i} y1={pad} x2={pad + ((W - pad * 2) / 11) * i} y2={H - pad} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={pad} y1={pad + ((H - pad * 2) / 5) * i} x2={W - pad} y2={pad + ((H - pad * 2) / 5) * i} />
        ))}
      </g>
      {/* Regions + connections */}
      {REGIONS.map((r, idx) => {
        const pt = llToXY(r.lat, r.lon, W, H, pad);
        const ms = msFor(r.name) ?? 60;
        const rad = Math.max(2, 6 - ms / 40);
        const hue = Math.max(0, 130 - ms);
        const stroke = `hsla(${hue},70%,60%,0.5)`;
        return (
          <g key={r.name}>
            {userXY && (
              <line x1={userXY.x} y1={userXY.y} x2={pt.x} y2={pt.y} stroke={stroke} strokeWidth={1.2} />
            )}
            <circle cx={pt.x} cy={pt.y} r={rad} fill="#10b981" />
            <text x={pt.x + 6} y={pt.y - 6} fontSize={10} fill="rgba(255,255,255,0.85)">{r.name}</text>
          </g>
        );
      })}
      {/* User */}
      {userXY && (
        <g>
          <circle cx={userXY.x} cy={userXY.y} r={3} fill="#7c3aed" />
          <text x={userXY.x + 6} y={userXY.y - 6} fontSize={10} fill="rgba(255,255,255,0.85)">You</text>
        </g>
      )}
    </svg>
  );
}

function llToXY(lat: number, lon: number, W: number, H: number, pad: number) {
  const x = pad + ((lon + 180) / 360) * (W - pad * 2);
  const y = pad + ((90 - lat) / 180) * (H - pad * 2);
  return { x, y };
}
