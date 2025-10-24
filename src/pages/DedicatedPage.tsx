import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AddOns from "@/components/AddOns";

const plans = [
  { name: "Entry", cpu: "Xeon E3-1240 v5", ram: "16 GB", storage: "1x500GB SSD", network: "1Gbps", price: 59.99 },
  { name: "Standard", cpu: "Xeon E5-1650 v3", ram: "32 GB", storage: "2x500GB SSD", network: "1Gbps", price: 89.99 },
  { name: "Pro", cpu: "Ryzen 7 3700X", ram: "64 GB", storage: "2x1TB NVMe", network: "1Gbps", price: 139.99 },
  { name: "Extreme", cpu: "Ryzen 9 5950X", ram: "128 GB", storage: "2x2TB NVMe RAID", network: "10Gbps", price: 179.99 },
];

const DedicatedPage = () => {
  const [location, setLocation] = useState("Miami");

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary mb-4">
              Dedicated Servers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              High performance bare metal servers for demanding applications.
            </p>
          </div>
          <div className="mb-8 flex justify-center">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Miami">Miami</SelectItem>
                <SelectItem value="Dallas">Dallas</SelectItem>
                <SelectItem value="LA">Los Angeles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {location === "Miami" && (
            <p className="text-center text-sm text-secondary font-inter mb-6">
              Low Latency for LATAM from Miami
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => (
              <Card key={plan.name} className="glass-card p-6 text-center hover-scale hover-glow-secondary">
                <h3 className="font-orbitron font-semibold text-foreground text-xl mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-orbitron font-bold text-gradient-secondary mb-2">
                  ${plan.price}/mo
                </div>
                <div className="text-sm text-muted-foreground font-inter mb-1">{plan.cpu}</div>
                <div className="text-sm text-muted-foreground font-inter mb-1">{plan.ram}</div>
                <div className="text-sm text-muted-foreground font-inter mb-1">{plan.storage}</div>
                <div className="text-sm text-muted-foreground font-inter mb-4">{plan.network} Network</div>
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
};

export default DedicatedPage;
