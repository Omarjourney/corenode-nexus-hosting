import Navigation from "@/components/Navigation";

interface Props {
  title: string;
}

const CheckoutPage = ({ title }: Props) => (
  <div className="min-h-screen bg-gradient-hero">
    <Navigation />
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-orbitron font-bold text-gradient-primary mb-4">
          {title} Checkout
        </h1>
        <p className="text-muted-foreground font-inter">
          Integrate purchase flow here.
        </p>
      </div>
    </div>
  </div>
);

export default CheckoutPage;
