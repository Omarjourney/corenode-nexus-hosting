import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddOns from "@/components/AddOns";

const plans = [
  { name: "VPS Lite", ram: "2 GB", vcpu: 1, ssd: "25GB", bandwidth: "2 TB", price: 6.99 },
  { name: "VPS Basic", ram: "4 GB", vcpu: 2, ssd: "50GB", bandwidth: "3 TB", price: 11.99 },
  { name: "VPS Std", ram: "8 GB", vcpu: 2, ssd: "80GB", bandwidth: "4 TB", price: 17.99 },
  { name: "VPS Pro", ram: "16 GB", vcpu: 4, ssd: "160GB", bandwidth: "5 TB", price: 29.99 },
  { name: "VPS Max", ram: "32 GB", vcpu: 6, ssd: "320GB", bandwidth: "6 TB", price: 54.99 },
  { name: "VPS Extreme", ram: "64 GB", vcpu: 8, ssd: "500GB", bandwidth: "10 TB", price: 89.99 },
];

const VpsPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <Navigation />
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary mb-4">
            VPS Hosting
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Scalable virtual private servers with full root access and SSD storage.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card key={plan.name} className="glass-card p-6 text-center hover-scale hover-glow-primary">
              <h3 className="font-orbitron font-semibold text-foreground text-xl mb-2">
                {plan.name}
              </h3>
              <div className="text-3xl font-orbitron font-bold text-gradient-primary mb-2">
                ${plan.price}/mo
              </div>
              <div className="text-sm text-muted-foreground font-inter mb-4">
                {plan.vcpu} vCPU • {plan.ram} RAM
              </div>
              <div className="text-sm text-muted-foreground font-inter mb-4">
                {plan.ssd} NVMe • {plan.bandwidth} Bandwidth
              </div>
              <Button asChild className="w-full bg-gradient-primary glow-primary font-orbitron">
                <a href="/vps/checkout">Upgrade Now</a>
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

export default VpsPage;
