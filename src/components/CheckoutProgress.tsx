import { Progress } from "@/components/ui/progress";

interface CheckoutProgressProps {
  step: number;
}

const steps = ["Game", "Plan", "Checkout"];

const CheckoutProgress = ({ step }: CheckoutProgressProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs font-orbitron">
      {steps.map((s, i) => (
        <span
          key={s}
          className={i <= step ? "text-primary" : "text-muted-foreground"}
        >
          {i + 1}. {s}
        </span>
      ))}
    </div>
    <Progress value={(step / (steps.length - 1)) * 100} className="glow-primary" />
    <div className="text-center text-xs font-inter bg-gradient-secondary py-1 rounded-md">
      🎉 Add 2GB RAM more to unlock 10% off <span className="ml-1">9:59</span>
    </div>
  </div>
);

export default CheckoutProgress;
