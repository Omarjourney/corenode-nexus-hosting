import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ConfiguratorPanel from "@/components/ConfiguratorPanel";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    setActiveDropdown(null);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeDropdowns = (event?: MouseEvent) => {
      if (event && navRef.current?.contains(event.target as Node)) return;
      setActiveDropdown(null);
    };

    const handleScroll = () => setActiveDropdown(null);

    document.addEventListener("click", closeDropdowns);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", closeDropdowns);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  type Section = string | { label: string; to: string };
  const navItems: { name: string; href: string; dropdown?: boolean; sections?: Section[] }[] = [
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
      sections: ["Basic", "Standard", "Premium"]
    },
    {
      name: "VPS Hosting",
      href: "/vps",
      dropdown: true,
      sections: [
        { label: "NodeX Budget VPS", to: "/vps/budget" },
        { label: "NodeX Standard VPS", to: "/vps/standard" },
        { label: "NodeX Premium VPS", to: "/vps/premium" },
        { label: "NodeX Extreme VPS", to: "/vps/extreme" },
        { label: "NodeX Ryzen VPS", to: "/vps/ryzen" },
      ]
    },
    {
      name: "Dedicated Servers",
      href: "/dedicated",
      dropdown: true,
      sections: ["Entry", "Pro", "Extreme"]
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-background font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-orbitron font-bold text-gradient-primary">
                CodeNodeX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium font-inter transition-all duration-300 flex items-center space-x-1 hover:text-primary",
                      isActive(item.href)
                        ? "text-primary glow-primary"
                        : "text-foreground/80 hover-glow-primary"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown((current) =>
                        current === item.name && item.dropdown ? null : item.name
                      );
                    }}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 w-64 glass-card mt-2 py-4 shadow-xl border border-glass-border z-40"
                    >
                      {item.sections?.map((section, index) => {
                        const label = typeof section === 'string' ? section : section.label;
                        const to = typeof section === 'string'
                          ? `${item.href}#${section.toLowerCase().replace(/\s+/g, '-')}`
                          : section.to;
                        return (
                          <Link
                            key={index}
                            to={to}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass-surface transition-all duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              className="bg-gradient-primary hover:scale-105 glow-primary font-orbitron font-medium"
              onClick={() => setPanelOpen(true)}
            >
              Start My Server
            </Button>
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
              <Button
                className="w-full bg-gradient-primary glow-primary font-orbitron font-medium"
                onClick={() => {
                  setPanelOpen(true);
                  setIsOpen(false);
                }}
              >
                Start My Server
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
    <ConfiguratorPanel open={panelOpen} onOpenChange={setPanelOpen} />
    </>
  );
};

export default Navigation;
