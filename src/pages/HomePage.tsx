import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { 
  Server, 
  Gamepad2, 
  Mic, 
  Globe, 
  HardDrive,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Play,
  CheckCircle
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Servers deployed in seconds with automated configuration"
    },
    {
      icon: Shield,
      title: "DDoS Protection",
      description: "Premium protection included with all plans"
    },
    {
      icon: Clock,
      title: "99.9% Uptime",
      description: "Reliable hosting with guaranteed performance"
    }
  ];

  const hostingTypes = [
    {
      icon: Gamepad2,
      title: "Minecraft Hosting",
      description: "Java & Bedrock editions with full modpack support",
      color: "primary",
      link: "/minecraft"
    },
    {
      icon: Server,
      title: "Game Servers",
      description: "80+ supported games with instant deployment",
      color: "secondary", 
      link: "/game-servers"
    },
    {
      icon: Mic,
      title: "Voice Servers",
      description: "TeamSpeak, Mumble & Discord bot hosting",
      color: "tertiary",
      link: "/voice-servers"
    },
    {
      icon: Globe,
      title: "Web Hosting",
      description: "Fast, reliable web hosting with cPanel",
      color: "primary",
      link: "/web-hosting"
    },
    {
      icon: HardDrive,
      title: "VPS & Dedicated",
      description: "Scalable virtual and dedicated servers",
      color: "secondary",
      link: "/vps-dedicated"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Hero Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-orbitron font-bold">
                <span className="block text-gradient-primary">Next-Gen</span>
                <span className="block text-foreground">Hosting Platform</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Premium hosting for Minecraft, game servers, voice platforms, web hosting, 
                and dedicated servers with instant setup and enterprise-grade performance.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-primary hover:scale-105 glow-primary font-orbitron font-semibold px-8 py-4 text-lg group"
              >
                Start Your Server Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 font-orbitron font-medium px-8 py-4 text-lg group hover-glow-primary"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 text-center hover-scale animate-float" 
                    style={{ animationDelay: `${index * 0.2}s` }}>
                <feature.icon className="h-8 w-8 mx-auto mb-4 text-primary glow-primary" />
                <h3 className="font-orbitron font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-inter">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold text-gradient-secondary mb-6">
              Choose Your Hosting Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
              From gaming to web hosting, we've got the perfect solution for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostingTypes.map((type, index) => (
              <Card key={index} className={`glass-card p-8 hover-scale group cursor-pointer animate-scale-in glow-${type.color}`} 
                    style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-${type.color} rounded-xl flex items-center justify-center glow-${type.color} group-hover:animate-glow-pulse`}>
                    <type.icon className="h-8 w-8 text-background" />
                  </div>
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">{type.title}</h3>
                  <p className="text-muted-foreground font-inter">{type.description}</p>
                  <Button 
                    variant="ghost" 
                    className={`text-${type.color} hover:bg-${type.color}/10 font-inter group-hover:glow-${type.color}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-glass-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-orbitron font-bold text-gradient-primary">50K+</div>
              <p className="text-muted-foreground font-inter">Active Servers</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-orbitron font-bold text-gradient-secondary">99.9%</div>
              <p className="text-muted-foreground font-inter">Uptime</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-orbitron font-bold text-gradient-tertiary">24/7</div>
              <p className="text-muted-foreground font-inter">Support</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-orbitron font-bold text-gradient-primary">80+</div>
              <p className="text-muted-foreground font-inter">Game Types</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-glass-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
              <span className="text-background font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-orbitron font-bold text-gradient-primary">CoreNode Hosting</span>
          </div>
          <p className="text-muted-foreground font-inter">
            © 2025 CoreNode Hosting. Premium hosting solutions for the modern web.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;