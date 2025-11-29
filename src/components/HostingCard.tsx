import { cn } from "@/lib/utils";

interface HostingCardProps {
  title: string;
  price: string;
  specs: string[];
  ctaLabel: string;
  href: string;
  label?: string;
  badge?: string;
  className?: string;
}

export function HostingCard({
  title,
  price,
  specs,
  ctaLabel,
  href,
  label,
  badge,
  className,
}: HostingCardProps) {
  return (
    <div className={cn("hosting-card flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <div className="text-[12px] uppercase tracking-[0.16em] text-[#A3B3C2]">{label}</div>
        )}
        {badge && (
          <span className="rounded-full bg-gradient-to-r from-[#9A4DFF] to-[#B47CFF] px-3 py-1 text-[12px] font-semibold text-background">
            {badge}
          </span>
        )}
      </div>
      <h3 className="hosting-card-title">{title}</h3>
      <div className="hosting-card-price">{price}</div>
      <div className="space-y-2">
        {specs.map((spec) => (
          <p className="hosting-card-spec" key={spec}>
            {spec}
          </p>
        ))}
      </div>
      <a className="hosting-cta mt-auto inline-block text-center" href={href}>
        {ctaLabel}
      </a>
    </div>
  );
}
