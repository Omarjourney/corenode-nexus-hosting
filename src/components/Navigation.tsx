import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navItems = [
    {
      name: "Minecraft",
      href: "/minecraft",
      dropdown: true,
      sections: ["Java Edition", "Bedrock Edition", "Modpack Support"]
    },
    {
      name: "Game Servers",
      href: "/game-servers", 
      dropdown: true,
      sections: ["80+ Games", "Popular Titles", "Custom Configs"]
    },
    {
      name: "Voice Servers",
      href: "/voice-servers",
      dropdown: true,
      sections: ["TeamSpeak", "Mumble", "Discord Hosting"]
    },
    {
      name: "Web Hosting",
      href: "/web-hosting",
      dropdown: true,
      sections: ["Basic", "Premium", "Business"]
    },
    {
      name: "VPS & Dedicated",
      href: "/vps-dedicated",
      dropdown: true,
      sections: ["VPS Servers", "Dedicated Servers", "Custom Solutions"]
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-background font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-orbitron font-bold text-gradient-primary">
                CoreNode
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium font-inter transition-all duration-300 flex items-center space-x-1 hover:text-primary",
                      isActive(item.href) 
                        ? "text-primary glow-primary" 
                        : "text-foreground/80 hover-glow-primary"
                    )}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 w-64 glass-card mt-2 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.sections.map((section, index) => (
                        <Link
                          key={index}
                          to={`${item.href}#${section.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass-surface transition-all duration-200"
                        >
                          {section}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/order">
              <Button className="bg-gradient-primary hover:scale-105 glow-primary font-orbitron font-medium">
                Start My Server
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden glass-card mx-4 mt-2 rounded-lg overflow-hidden animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium font-inter transition-all duration-200",
                  isActive(item.href)
                    ? "text-primary bg-glass-surface glow-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-glass-surface"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <Link to="/order" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-primary glow-primary font-orbitron font-medium">
                  Start My Server
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;