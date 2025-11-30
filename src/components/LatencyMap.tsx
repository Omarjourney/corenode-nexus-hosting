import { useEffect, useMemo, useRef, useState } from 'react';
import createGlobe from 'cobe';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Region = { name: string; lat: number; lon: number };
const REGIONS: Region[] = [
  { name: 'Miami', lat: 25.7617, lon: -80.1918 },
  { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
];
type RegionLatency = { region: Region; latency: number | null };
type Marker = { location: [number, number]; size: number; color?: [number, number, number] };

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
        () => {
          /* keep fallback */
        },
        { enableHighAccuracy: false, timeout: 2000 },
      );
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setMeasure(
      REGIONS.map((r) => ({ name: r.name, ms: approximateLatencyKm(haversine(user, r)) })),
    );
  }, [user]);

  const regionLatencies: RegionLatency[] = useMemo(
    () =>
      REGIONS.map((region) => ({
        region,
        latency: measure.find((m) => m.name === region.name)?.ms ?? null,
      })),
    [measure],
  );

  const bestRegion = useMemo(() => {
    const sorted = regionLatencies
      .filter((entry) => entry.latency !== null)
      .sort((a, b) => (a.latency ?? Infinity) - (b.latency ?? Infinity));
    return sorted[0] ?? null;
  }, [regionLatencies]);

  const statusText = user
    ? `Using ${'geolocation' in navigator ? 'your live location' : 'fallback location'}`
    : 'Detect your location to personalise latency estimates';

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-black/40 p-0 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-1/3 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      </div>
      <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-0 rounded-full border border-white/20" />
            <div className="absolute inset-10 rounded-full bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent blur-2xl" />
            <LatencyGlobe user={user} regions={regionLatencies} />
            <div className="pointer-events-none absolute left-6 top-6 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide text-white/70 backdrop-blur">
              Latency preview
            </div>
            {user && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-xs text-white/70 backdrop-blur">
                {statusText}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-orbitron text-lg font-semibold tracking-wide text-white">
              Region latency snapshot
            </h4>
            <p className="text-sm text-white/70">
              Compare our core locations and see how close you are to blazing-fast performance. Latencies update instantly when you detect your location.
            </p>
          </div>
          {bestRegion && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">Best match</div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-white">{bestRegion.region.name}</div>
                <div className="font-mono text-lg text-emerald-300">{bestRegion.latency} ms</div>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Shortest estimated round-trip time from your current location.
              </p>
            </div>
          )}
          <div className="space-y-3">
            {regionLatencies.map(({ region, latency }) => {
              const fill = latency ? Math.max(8, ((160 - Math.min(latency, 160)) / 160) * 100) : 0;
              const isBest = bestRegion?.region.name === region.name;
              return (
                <div
                  key={region.name}
                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 transition ${
                    isBest ? 'border-emerald-300/60 bg-emerald-400/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{region.name}</span>
                    <span className="font-mono text-xs text-white/70">
                      {latency ? `${latency} ms` : '—'}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500"
                      style={{ width: latency ? `${fill}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              className="w-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => {
                setUser(null);
                setMeasure([]);
              }}
            >
              Reset
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 text-white hover:from-sky-400 hover:via-indigo-400 hover:to-violet-400"
              onClick={() => {
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => setUser({ name: 'You', lat: pos.coords.latitude, lon: pos.coords.longitude }),
                    () => setUser({ name: 'You', lat: 40.7, lon: -74.0 }),
                  );
                } else {
                  setUser({ name: 'You', lat: 40.7, lon: -74.0 });
                }
              }}
            >
              Detect Location
            </Button>
          </div>
          <p className="text-xs text-white/50">
            We never store your position—your browser shares it once to personalise these estimates.
          </p>
        </div>
      </div>
    </Card>
  );
}

function LatencyGlobe({ user, regions }: { user: Region | null; regions: RegionLatency[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef(0);
  const markersRef = useRef<Marker[]>([]);
  const markers = useMemo(() => mapMarkers(user, regions), [user, regions]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    targetPhiRef.current = user ? (user.lon * Math.PI) / 180 : 0;
  }, [user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.04, 0.08, 0.2],
      markerColor: [0.9, 0.5, 1],
      glowColor: [0.2, 0.3, 0.9],
      offset: [0, 0],
      markers: markersRef.current,
      onRender: (state) => {
        const diff = shortestAngularDistance(phiRef.current, targetPhiRef.current);
        phiRef.current += diff * 0.05; // Rotation logic for centering on user
        state.phi = phiRef.current;
        state.theta = 0.25;
        state.markers = markersRef.current;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cobe"
      className="h-full w-full select-none rounded-full border border-white/10 bg-black/50"
      style={{ aspectRatio: '1 / 1' }}
    />
  );
}

function mapMarkers(user: Region | null, regions: RegionLatency[]): Marker[] {
  const markers = regions.map(({ region, latency }) => {
    const normalized = latency ? Math.min(latency, 180) / 180 : 0.4;
    const size = latency ? Math.max(0.03, 0.12 - normalized * 0.06) : 0.04;
    const color: [number, number, number] = [
      0.2 + (1 - normalized) * 0.3,
      0.7 - normalized * 0.4,
      1 - normalized * 0.3,
    ];
    return {
      location: [region.lat, region.lon] as [number, number],
      size,
      color,
    };
  });

  if (user) {
    markers.unshift({
      location: [user.lat, user.lon],
      size: 0.16,
      color: [0.75, 0.4, 1],
    });
  }

  return markers;
}

function shortestAngularDistance(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}
