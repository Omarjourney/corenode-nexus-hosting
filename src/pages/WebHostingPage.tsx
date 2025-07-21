import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  HardDrive, 
  Mail, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Database,
  Zap,
  Users,
  Settings
} from "lucide-react";

const WebHostingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [customStorage, setCustomStorage] = useState([50]);
  const [customBandwidth, setCustomBandwidth] = useState([500]);

  const plans = [
    {
      name: "Basic",
      id: "basic",
      price: 4.99,
      color: "primary",
      description: "Perfect for small websites and blogs",
      features: {
        storage: "25 GB SSD",
        bandwidth: "250 GB",
        domains: "1 Domain",
        email: "5 Email Accounts",
        databases: "1 MySQL Database",
        ssl: "Free SSL Certificate",
        cpanel: "cPanel Access",
        support: "Standard Support"
      },
      highlights: [
        "WordPress Ready",
        "99.9% Uptime",
        "Daily Backups",
        "1-Click Installs"
      ]
    },
    {
      name: "Premium",
      id: "premium", 
      price: 9.99,
      color: "secondary",
      description: "Great for growing businesses",
      popular: true,
      features: {
        storage: "100 GB SSD",
        bandwidth: "Unlimited",
        domains: "5 Domains",
        email: "25 Email Accounts",
        databases: "10 MySQL Databases",
        ssl: "Free SSL + Wildcard",
        cpanel: "Advanced cPanel",
        support: "Priority Support"
      },
      highlights: [
        "Free Website Builder",
        "Advanced Security",
        "Staging Environment", 
        "CDN Integration"
      ]
    },
    {
      name: "Business",
      id: "business",
      price: 19.99,
      color: "tertiary",
      description: "For high-traffic professional sites",
      features: {
        storage: "250 GB SSD",
        bandwidth: "Unlimited",
        domains: "Unlimited Domains",
        email: "100 Email Accounts", 
        databases: "Unlimited MySQL",
        ssl: "Premium SSL Suite",
        cpanel: "White-label cPanel",
        support: "24/7 Phone Support"
      },
      highlights: [
        "E-commerce Ready",
        "Advanced Analytics",
        "Git Integration",
        "API Access"
      ]
    }
  ];

  const addOns = [
    { name: "Extra Storage (20GB)", price: 5, description: "Additional SSD storage space" },
    { name: "Business Email", price: 3, description: "Professional email with your domain" },
    { name: "Premium Support", price: 10, description: "24/7 priority phone support" },
    { name: "Website Builder Pro", price: 7, description: "Advanced website builder tools" },
    { name: "SSL Premium", price: 15, description: "Extended validation SSL certificate" },
    { name: "Daily Backups+", price: 5, description: "Enhanced backup with instant restore" }
  ];

  const webHostingFeatures = [
    {
      icon: Globe,
      title: "99.9% Uptime Guarantee",
      description: "Reliable hosting with SLA-backed uptime"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "DDoS protection, malware scanning, firewall"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "SSD storage, CDN, and optimized servers"
    },
    {
      icon: Settings,
      title: "Full Control",
      description: "cPanel, SSH access, and custom configurations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-primary mb-4">
              Web Hosting Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Fast, reliable web hosting with cPanel, free SSL, and advanced security features. 
              Perfect for websites, blogs, and e-commerce platforms.
            </p>
          </div>

          {/* Hosting Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`glass-card p-8 hover-scale cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id ? `glow-${plan.color} border-${plan.color}/50` : 'hover-glow-primary'
                } ${plan.popular ? 'relative' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-secondary">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-2">{plan.name}</h3>
                  <div className={`text-4xl font-orbitron font-bold text-gradient-${plan.color} mb-2`}>
                    ${plan.price}/mo
                  </div>
                  <p className="text-sm text-muted-foreground font-inter">{plan.description}</p>
                </div>

                {/* Plan Features */}
                <div className="space-y-3 mb-6">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-inter capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Plan Highlights */}
                <div className="space-y-2 mb-6">
                  {plan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 text-${plan.color} flex-shrink-0`} />
                      <span className="text-sm font-inter text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full bg-gradient-${plan.color} glow-${plan.color} font-orbitron`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>

          {/* Custom Configuration */}
          <Card className="glass-card p-8 mb-12">
            <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6 text-center">
              Custom Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-orbitron font-medium text-foreground flex items-center">
                    <HardDrive className="w-4 h-4 mr-2 text-primary" />
                    Storage: {customStorage[0]}GB SSD
                  </label>
                </div>
                <Slider
                  value={customStorage}
                  onValueChange={setCustomStorage}
                  max={500}
                  min={25}
                  step={25}
                  className="mb-6"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="font-orbitron font-medium text-foreground flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Bandwidth: {customBandwidth[0]}GB/mo
                  </label>
                </div>
                <Slider
                  value={customBandwidth}
                  onValueChange={setCustomBandwidth}
                  max={2000}
                  min={100}
                  step={100}
                  className="mb-6"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-orbitron font-bold text-gradient-primary mb-4">
                Custom Price: ${((customStorage[0] * 0.1) + (customBandwidth[0] * 0.01) + 4.99).toFixed(2)}/mo
              </div>
              <Button className="bg-gradient-primary glow-primary font-orbitron">
                Build Custom Plan
              </Button>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {webHostingFeatures.map((feature, index) => (
              <Card key={index} className="glass-card p-6 text-center hover-scale hover-glow-primary">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary glow-primary" />
                <h3 className="font-orbitron font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-inter">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Add-ons Section */}
          <Card className="glass-card p-8">
            <h3 className="text-2xl font-orbitron font-semibold text-foreground mb-6 text-center">
              Available Add-ons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <Card key={index} className="glass-card p-4 hover-scale hover-glow-secondary">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-orbitron font-medium text-foreground text-sm">{addon.name}</h4>
                    <span className="text-secondary font-orbitron font-semibold">${addon.price}/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-inter mb-3">{addon.description}</p>
                  <Button size="sm" variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary/10">
                    Add to Plan
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebHostingPage;