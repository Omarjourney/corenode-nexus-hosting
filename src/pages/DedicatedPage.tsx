import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import AddOns from "@/components/AddOns";
import { NodeXMetalGrid } from "@/components/dedicated/NodeXMetalGrid";

const DedicatedPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="NodeX Metal™ Dedicated Servers | CodeNodeX"
      description="Ryzen and Threadripper NodeX Metal™ servers with CNX CommandCenter™, 10Gbps uplinks, root access, and free migrations."
      keywords="dedicated servers, nodex metal, ryzen 7950x server, threadripper hosting"
    />
    <Navigation />
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">NODEX METAL™</p>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary">
            Dedicated Servers with CNX CommandCenter™
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Premium Ryzen + Threadripper builds, 10Gbps uplinks, full root access, CrashGuard AI, and free migration service included.
          </p>
        </div>

        <NodeXMetalGrid />

        <Card className="glass-card p-6">
          <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">Optional Add-Ons</h3>
          <AddOns />
        </Card>
      </div>
    </div>
  </div>
);

export default DedicatedPage;
