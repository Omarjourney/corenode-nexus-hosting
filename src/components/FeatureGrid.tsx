import { ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";

const featureItems = [
  {
    title: "Speed",
    description: "Low-latency routing, NVMe storage, and tuned CPU profiles.",
    icon: Zap,
  },
  {
    title: "Automation",
    description: "One-click deploys, backups, and config templates across products.",
    icon: Workflow,
  },
  {
    title: "Protection",
    description: "Always-on mitigation with alerts, health checks, and rollbacks.",
    icon: ShieldCheck,
  },
  {
    title: "Ease",
    description: "Clear dashboards, guided wizards, and human support in minutes.",
    icon: Sparkles,
  },
];

interface FeatureGridProps {
  title?: string;
}

export function FeatureGrid({ title = "Why CodeNodeX" }: FeatureGridProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-orbitron tracking-[0.2em] text-primary">FEATURES</p>
        <h2 className="text-3xl font-orbitron font-bold text-foreground">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featureItems.map(({ title: itemTitle, description, icon: Icon }) => (
          <div
            key={itemTitle}
            className="glass-card p-6 rounded-2xl border border-glass-border flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-[hsl(171.6,79.3%,50.8%)]" strokeWidth={2} />
              <h3 className="text-lg font-semibold text-foreground">{itemTitle}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
