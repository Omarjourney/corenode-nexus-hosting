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

type Marker = { location: [number, number]; size: number };
const STATIC_MARKERS: Marker[] = [
  { location: [37.7595, -122.4367], size: 0.03 },
  { location: [40.7128, -74.006], size: 0.1 },
  { location: [51.5074, -0.1278], size: 0.05 },
  { location: [35.6762, 139.6503], size: 0.05 },
  { location: [22.3193, 114.1694], size: 0.03 },
  { location: [-33.8688, 151.2093], size: 0.03 },
];
type RegionLatency = { region: Region; latency: number | null };

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

  const statusText = user
    ? `Using ${'geolocation' in navigator ? 'your location' : 'fallback location'}`
    : 'Detect your location to personalise latency estimates';

  return (
    <Card className="bg-[#080b15] text-white">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 rounded-xl border border-white/10 bg-[#0f1323] p-6">
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Latency Preview</div>
          <div className="mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-[#05070f]">
            <div className="relative h-full w-full">
              <LatencyGlobe user={user} />
              <div className="pointer-events-none absolute inset-0 rounded-full border border-cyan-500/40" />
              <div className="pointer-events-none absolute inset-[12%] rounded-full border border-cyan-500/10" />
            </div>
          </div>
          <div className="mt-4 text-xs text-cyan-100/70">{statusText}</div>
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-orbitron text-lg font-semibold text-white">Regions</h4>
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-500/40 bg-transparent text-cyan-100/80 hover:bg-cyan-500/10"
              onClick={() => {
                setUser(null);
                setMeasure([]);
              }}
            >
              Reset
            </Button>
          </div>
          <ul className="space-y-3 text-sm text-white/80">
            {regionLatencies.map(({ region, latency }) => (
              <li
                key={region.name}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3"
              >
                <span>{region.name}</span>
                <span className="font-mono text-white">
                  {latency ? `${latency} ms` : '—'}
                </span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-400 hover:to-indigo-400"
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
          <p className="text-xs text-white/50">
            We never store your position—your browser shares it once to personalise these estimates.
          </p>
        </div>
      </div>
    </Card>
  );
}

function LatencyGlobe({ user }: { user: Region | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef(0);
  const markersRef = useRef<Marker[]>([]);
  const markers = useMemo(() => mapMarkers(user), [user]);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    targetPhiRef.current = user ? (-user.lon * Math.PI) / 180 : 0;
  }, [user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.9],
      markerColor: [0.9, 0.5, 1],
      glowColor: [0.2, 0.2, 1],
      offset: [0, 0],
      markers: markersRef.current,
      onRender: (state) => {
        const diff = targetPhiRef.current - phiRef.current;
        phiRef.current += diff * 0.05;  // Rotation logic for centering on user
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

function mapMarkers(user: Region | null): Marker[] {
  const markers = [...STATIC_MARKERS];

  if (user) {
    markers.unshift({
      location: [user.lat, user.lon],
      size: 0.18,
    });
  }

  return markers;
}
