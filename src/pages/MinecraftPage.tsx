import { Cpu, HardDrive, Server, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { MinecraftConfigurator } from "@/components/minecraft/MinecraftConfigurator";
import minecraftConfig from "@/data/minecraft-config.json";
import { formatPrice } from "@/utils/pricing";
import { CONTROL_PANELS } from "@/data/pricing";

const featureCards = [
  {
    title: "Instant Deploy",
    description: "Provisioned on NVMe nodes with DDoS shield and global routes.",
    icon: Server,
  },
  {
    title: "Tuned Performance",
    description: "CommandCenter™ automation, CrashGuard AI, and TPS-friendly cores.",
    icon: Cpu,
  },
  {
    title: "Flexible Storage",
    description: "Scale NVMe storage and swap modpacks without migrations.",
    icon: HardDrive,
  },
  {
    title: "Co-op Ready",
    description: "Multi-profile slots, backups, and invite links for friends.",
    icon: Users,
  },
];

const startPrice = formatPrice(minecraftConfig.editions.java.sliderSteps[0].price);

const MinecraftPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="Minecraft Server Hosting | CodeNodeX"
      description={`Fast Minecraft hosting with CNX CommandCenter™ and CorePanel Lite™ starting at ${startPrice}.`}
      keywords="minecraft server hosting, fast minecraft hosting, miami servers"
    />
    <Navigation />

    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">MINECRAFT</p>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-gradient-primary">
            Java & Bedrock Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Choose your RAM tier, slide resources, and launch instantly with {CONTROL_PANELS.pterodactyl} or {CONTROL_PANELS.amp}.
            Pricing automatically follows the RAM plan—no surprises.
          </p>
          <div className="text-sm text-foreground font-inter">Starting at {startPrice}</div>
        </header>

        <MinecraftConfigurator />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl bg-slate-900/60 border border-slate-700/60 p-4">
              <Icon className="h-6 w-6 text-cyan-300 mb-2" />
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

export default MinecraftPage;
