import Navigation from '@/components/Navigation';
import LatencyMap from '@/components/LatencyMap';

export default function LatencyPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-orbitron font-bold text-gradient-secondary">Latency Map</h1>
            <p className="text-muted-foreground font-inter">Preview expected latency from your location to our regions.</p>
          </div>
          <LatencyMap />
        </div>
      </div>
    </div>
  );
}

