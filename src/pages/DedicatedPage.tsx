import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import AddOns from "@/components/AddOns";
import { NodeXMetalGrid } from "@/components/dedicated/NodeXMetalGrid";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FaqSection } from "@/components/FaqSection";

const DedicatedPage = () => (
  <div className="min-h-screen bg-gradient-hero">
    <SEO
      title="NodeX Metal™ Dedicated Servers | CodeNodeX"
      description="Ryzen and Threadripper NodeX Metal™ servers with CNX CommandCenter™, 10Gbps uplinks, root access, and free migrations."
      keywords="dedicated servers, nodex metal, ryzen 7950x server, threadripper hosting"
    />
    <Navigation />
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-orbitron tracking-[0.2em] text-primary">NODEX METAL™</p>
          <h1 className="text-5xl font-orbitron font-bold text-foreground">Dedicated Servers</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Ryzen and Threadripper metal with automation, 10Gbps networking, and white-glove migrations.
          </p>
        </div>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-orbitron font-bold text-foreground">Purchase your server</h2>
            <p className="text-sm text-muted-foreground font-inter mt-2">Fixed pricing, instant remote access, and clean SLAs.</p>
          </div>
          <NodeXMetalGrid />
        </section>

        <Card className="glass-card p-6">
          <h3 className="font-orbitron font-semibold text-foreground mb-4 text-center">Optional Add-Ons</h3>
          <AddOns />
        </Card>

        <FeatureGrid title="Enterprise-grade resilience" />

        <ComparisonTable
          title="Dedicated vs competitors"
          columns={["NodeX Metal", "Commodity", "Barebones"]}
          rows={[
            { label: "Provisioning", values: ["&lt; 2 hours", "1-3 days", "1-2 days"] },
            { label: "Network", values: ["10Gbps", "1Gbps", "1-5Gbps"] },
            { label: "Automation", values: ["CommandCenter™", "Manual", "Manual"] },
            { label: "Support", values: ["24/7 engineers", "Ticket only", "Email only"] },
          ]}
        />

        <FaqSection
          items={[
            {
              question: "Can I request custom hardware?",
              answer: "Yes. We can source custom NVMe, RAM, or networking options and keep the pricing transparent.",
            },
            {
              question: "Is there remote management?",
              answer: "Full IPMI and CommandCenter™ automation are included for every dedicated node.",
            },
            {
              question: "Do migrations cost extra?",
              answer: "Migrations and re-install assistance are included with all dedicated plans.",
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default DedicatedPage;
