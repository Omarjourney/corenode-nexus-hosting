import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddOns from "@/components/AddOns";
import { CheckCircle } from "lucide-react";

const metalPlans = [
  { cpu: "Ryzen 5600X", price: "$109" },
  { cpu: "Ryzen 7600", price: "$149" },
  { cpu: "Ryzen 5800X", price: "$129" },
  { cpu: "Ryzen 5950X", price: "$179" },
  { cpu: "Ryzen 7950X", price: "$199" },
  { cpu: "Threadripper 3990X", price: "$399" },
  { cpu: "Dual EPYC", price: "$199–$399" },
];

const DedicatedPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="NodeX Metal™ Dedicated Servers | CoreNodeX"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metalPlans.map((plan) => (
            <Card key={plan.cpu} className="glass-card p-6 space-y-3 hover-scale hover-glow-secondary">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron font-semibold text-foreground text-lg">{plan.cpu}</h3>
                <span className="text-xs font-orbitron bg-gradient-secondary text-background px-2 py-1 rounded">NodeX Metal™</span>
              </div>
              <div className="text-3xl font-orbitron font-bold text-gradient-secondary">{plan.price}/mo</div>
              <ul className="text-sm text-muted-foreground font-inter space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />CNX CommandCenter™ included</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />10Gbps uplink</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Full root access</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Free migration service</li>
              </ul>
              <Button asChild className="w-full bg-gradient-secondary glow-secondary font-orbitron">
                <a href="/dedicated/checkout">Upgrade Now</a>
              </Button>
            </Card>
          ))}
        </div>

        <Card className="glass-card p-6">
          <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">
            Optional Add-Ons
          </h3>
          <AddOns />
        </Card>
      </div>
    </div>
  </div>
);

export default DedicatedPage;
