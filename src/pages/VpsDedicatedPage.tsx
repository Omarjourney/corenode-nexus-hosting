import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Database,
  Shield,
  CheckCircle,
  ArrowRight,
  Settings,
  Zap,
  Globe
} from "lucide-react";

const VpsDedicatedPage = () => {
  const [vpsConfig, setVpsConfig] = useState({
    vCPU: 1,
    ram: 1,
    ssd: 25,
    os: "ubuntu"
  });

  const [dedicatedConfig, setDedicatedConfig] = useState({
    processor: "amd",
    plan: "entry"
  });

  const vpsConfigs = [
    { vCPU: 1, ram: 1, ssd: 25, price: 5.99 },
    { vCPU: 2, ram: 2, ssd: 50, price: 11.99 },
    { vCPU: 4, ram: 4, ssd: 100, price: 23.99 },
    { vCPU: 8, ram: 8, ssd: 200, price: 47.99 },
    { vCPU: 16, ram: 16, ssd: 400, price: 95.99 }
  ];

  const operatingSystems = [
    { id: "ubuntu", name: "Ubuntu 22.04 LTS", icon: "🐧" },
    { id: "debian", name: "Debian 12", icon: "🐧" },
    { id: "centos", name: "CentOS 9 Stream", icon: "🐧" },
    { id: "windows", name: "Windows Server 2022", icon: "🪟", extra: "+$15/mo" }
  ];

  const dedicatedPlans = [
    {
      id: "entry",
      name: "Entry Level",
      amd: {
        cpu: "AMD Ryzen 5 5600G",
        ram: "16GB DDR4",
        storage: "500GB NVMe SSD",
        price: 89
      },
      intel: {
        cpu: "Intel Core i5-12400",
        ram: "16GB DDR4", 
        storage: "500GB NVMe SSD",
        price: 94
      }
    },
    {
      id: "performance",
      name: "Performance",
      amd: {
        cpu: "AMD Ryzen 7 5800X",
        ram: "32GB DDR4",
        storage: "1TB NVMe SSD",
        price: 149
      },
      intel: {
        cpu: "Intel Core i7-12700K",
        ram: "32GB DDR4",
        storage: "1TB NVMe SSD", 
        price: 159
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      amd: {
        cpu: "AMD Ryzen 9 5950X",
        ram: "64GB DDR4",
        storage: "2TB NVMe SSD",
        price: 249
      },
      intel: {
        cpu: "Intel Core i9-12900K",
        ram: "64GB DDR4",
        storage: "2TB NVMe SSD",
        price: 269
      }
    }
  ];

  const vpsFeatures = [
    "Full Root Access",
    "99.9% Uptime SLA",
    "DDoS Protection",
    "24/7 Support",
    "Instant Deployment",
    "IPv4 & IPv6",
    "Backup Solutions",
    "Monitoring Tools"
  ];

  const dedicatedFeatures = [
    "Dedicated Hardware",
    "No Resource Sharing",
    "IPMI Remote Management",
    "Hardware RAID Options",
    "Custom OS Installation",
    "Private Networking",
    "24/7 NOC Monitoring",
    "Migration Assistance"
  ];

  interface VpsConfig {
    vCPU: number
    ram: number
    ssd: number
    os: string
  }

  const calculateVpsPrice = (config: VpsConfig) => {
    const basePrice = vpsConfigs.find(c => 
      c.vCPU === config.vCPU && 
      c.ram === config.ram && 
      c.ssd === config.ssd
    )?.price || 5.99;
    
    const osPrice = config.os === "windows" ? 15 : 0;
    return (basePrice + osPrice).toFixed(2);
  };

  const getDedicatedPrice = () => {
    const plan = dedicatedPlans.find(p => p.id === dedicatedConfig.plan);
    if (!plan) return "89";
    return dedicatedConfig.processor === "amd" ? plan.amd.price : plan.intel.price;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-secondary mb-4">
              VPS & Dedicated Servers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Scalable virtual private servers and powerful dedicated hardware 
              with full control, instant deployment, and enterprise-grade performance.
            </p>
          </div>

          {/* VPS & Dedicated Tabs */}
          <Tabs defaultValue="vps" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="glass-card p-1">
                <TabsTrigger value="vps" className="font-orbitron">VPS Servers</TabsTrigger>
                <TabsTrigger value="dedicated" className="font-orbitron">Dedicated Servers</TabsTrigger>
              </TabsList>
            </div>

            {/* VPS Servers */}
            <TabsContent value="vps" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* VPS Configuration */}
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <div className="flex items-center mb-6">
                      <Server className="w-8 h-8 mr-3 text-primary glow-primary" />
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">
                        Configure Your VPS
                      </h3>
                    </div>

                    <div className="space-y-8">
                      {/* VPS Plans */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Select Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vpsConfigs.map((config, index) => (
                            <Card 
                              key={index}
                              className={`glass-card p-4 cursor-pointer hover-scale transition-all duration-300 ${
                                vpsConfig.vCPU === config.vCPU && 
                                vpsConfig.ram === config.ram && 
                                vpsConfig.ssd === config.ssd ? 
                                'glow-primary border-primary/50' : 'hover-glow-primary'
                              }`}
                              onClick={() => setVpsConfig({...vpsConfig, vCPU: config.vCPU, ram: config.ram, ssd: config.ssd})}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="font-orbitron font-semibold text-foreground">
                                    {config.vCPU} vCPU • {config.ram}GB RAM
                                  </div>
                                  <div className="text-sm text-muted-foreground font-inter">
                                    {config.ssd}GB NVMe SSD
                                  </div>
                                </div>
                                <div className="text-lg font-orbitron font-bold text-primary">
                                  ${config.price}/mo
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Cpu className="w-3 h-3 mr-1" />
                                  {config.vCPU} Core{config.vCPU > 1 ? 's' : ''}
                                </span>
                                <span className="flex items-center">
                                  <Database className="w-3 h-3 mr-1" />
                                  {config.ram}GB
                                </span>
                                <span className="flex items-center">
                                  <HardDrive className="w-3 h-3 mr-1" />
                                  {config.ssd}GB
                                </span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Operating System */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Operating System</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {operatingSystems.map((os) => (
                            <Card 
                              key={os.id}
                              className={`glass-card p-3 cursor-pointer hover-scale transition-all duration-300 ${
                                vpsConfig.os === os.id ? 'glow-secondary border-secondary/50' : 'hover-glow-secondary'
                              }`}
                              onClick={() => setVpsConfig({...vpsConfig, os: os.id})}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{os.icon}</span>
                                <div className="flex-1">
                                  <div className="font-orbitron font-medium text-foreground text-sm">{os.name}</div>
                                  {os.extra && (
                                    <div className="text-xs text-secondary font-inter">{os.extra}</div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* VPS Features */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Included Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {vpsFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm font-inter text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* VPS Pricing */}
                <div>
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">VPS Configuration</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-primary mt-2">
                        ${calculateVpsPrice(vpsConfig)}/mo
                      </div>
                      <div className="space-y-1 mt-3 text-sm text-muted-foreground font-inter">
                        <div>{vpsConfig.vCPU} vCPU • {vpsConfig.ram}GB RAM</div>
                        <div>{vpsConfig.ssd}GB NVMe SSD</div>
                        <div>{operatingSystems.find(os => os.id === vpsConfig.os)?.name}</div>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-primary glow-primary font-orbitron mb-4">
                      Deploy VPS Server
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Deployment time:</span>
                        <span className="text-primary font-medium">&lt; 5 minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Full root access:</span>
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Dedicated Servers */}
            <TabsContent value="dedicated" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="glass-card p-8">
                    <div className="flex items-center mb-6">
                      <HardDrive className="w-8 h-8 mr-3 text-secondary glow-secondary" />
                      <h3 className="text-2xl font-orbitron font-semibold text-foreground">
                        Configure Dedicated Server
                      </h3>
                    </div>

                    <div className="space-y-8">
                      {/* Processor Selection */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Processor Type</h4>
                        <RadioGroup 
                          value={dedicatedConfig.processor} 
                          onValueChange={(value) => setDedicatedConfig({...dedicatedConfig, processor: value})}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="amd" id="amd" />
                            <Label htmlFor="amd" className="font-inter text-foreground cursor-pointer">
                              AMD Processors (Better Price/Performance)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intel" id="intel" />
                            <Label htmlFor="intel" className="font-inter text-foreground cursor-pointer">
                              Intel Processors (Single-Thread Performance)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Dedicated Plans */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Server Plans</h4>
                        <div className="space-y-4">
                          {dedicatedPlans.map((plan) => {
                            const specs = dedicatedConfig.processor === "amd" ? plan.amd : plan.intel;
                            return (
                              <Card 
                                key={plan.id}
                                className={`glass-card p-6 cursor-pointer hover-scale transition-all duration-300 ${
                                  dedicatedConfig.plan === plan.id ? 'glow-secondary border-secondary/50' : 'hover-glow-secondary'
                                }`}
                                onClick={() => setDedicatedConfig({...dedicatedConfig, plan: plan.id})}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <h5 className="font-orbitron font-semibold text-foreground text-lg">{plan.name}</h5>
                                    <div className="space-y-1 text-sm text-muted-foreground font-inter">
                                      <div className="flex items-center">
                                        <Cpu className="w-4 h-4 mr-2" />
                                        {specs.cpu}
                                      </div>
                                      <div className="flex items-center">
                                        <Database className="w-4 h-4 mr-2" />
                                        {specs.ram}
                                      </div>
                                      <div className="flex items-center">
                                        <HardDrive className="w-4 h-4 mr-2" />
                                        {specs.storage}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-orbitron font-bold text-gradient-secondary">
                                      ${specs.price}/mo
                                    </div>
                                    <div className="text-xs text-muted-foreground font-inter">
                                      Setup: $99
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dedicated Features */}
                      <div>
                        <h4 className="font-orbitron font-medium text-foreground mb-4">Included Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dedicatedFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                              <span className="text-sm font-inter text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Dedicated Pricing */}
                <div className="space-y-6">
                  <Card className="glass-card p-6">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-orbitron font-semibold text-foreground">Dedicated Server</h4>
                      <div className="text-3xl font-orbitron font-bold text-gradient-secondary mt-2">
                        ${getDedicatedPrice()}/mo
                      </div>
                      <div className="text-sm text-muted-foreground font-inter mt-2">
                        Setup fee: $99 (one-time)
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-secondary glow-secondary font-orbitron mb-4">
                      Order Dedicated Server
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Deployment time:</span>
                        <span className="text-secondary font-medium">4-24 hours</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">IPMI access:</span>
                        <CheckCircle className="w-3 h-3 text-secondary" />
                      </div>
                    </div>
                  </Card>

                  {/* Contact for Custom */}
                  <Card className="glass-card p-6">
                    <div className="text-center">
                      <h4 className="font-orbitron font-semibold text-foreground mb-3">Need Custom Hardware?</h4>
                      <p className="text-sm text-muted-foreground font-inter mb-4">
                        Contact us for custom configurations, GPU servers, or enterprise solutions.
                      </p>
                      <Button variant="outline" className="border-tertiary/50 text-tertiary hover:bg-tertiary/10 font-orbitron">
                        Contact Sales
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VpsDedicatedPage;