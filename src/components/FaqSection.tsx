import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  items: FaqItem[];
}

export function FaqSection({ title = "FAQ", items }: FaqSectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-orbitron tracking-[0.2em] text-primary">FAQ</p>
        <h2 className="text-3xl font-orbitron font-bold text-foreground">{title}</h2>
      </div>
      <div className="glass-card p-6 rounded-2xl border border-glass-border">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
